// Dry run: node --env-file=.env scripts/backfill-purchase-materials.cjs
// Apply: add --apply --report=<dry-run.json>. Scope is the recent-purchase audit.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { MongoClient, ObjectId } = require('mongodb');
const { EJSON } = require('bson');

const FROM = '2026-08-07T03:00:00.000Z';
const directory = path.join(__dirname, '.purchase-material-backfills');
const normalize = (value) => typeof value === 'string'
  ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ').toUpperCase() : '';
const missing = (item) => item.materialId == null || (typeof item.materialId === 'string' && !item.materialId.trim());

function match(item, materials) {
  const name = normalize(item.descricao);
  if (!name) return { kind: 'unmatched', candidates: [] };
  const candidates = materials.filter((material) => normalize(material.nome) === name);
  const unit = normalize(item.unidade);
  if (candidates.length === 1) {
    const candidateUnit = normalize(candidates[0].grandeza);
    if (unit && candidateUnit && unit !== candidateUnit) return { kind: 'unit-conflict', candidates };
    return { kind: 'matched', material: candidates[0], basis: 'unique-name' };
  }
  // A missing catalog unit is unknown, not evidence against that candidate.
  // Disambiguate only when every alternative has an explicitly different unit.
  const compatible = candidates.filter((material) => !normalize(material.grandeza) || normalize(material.grandeza) === unit);
  if (unit && compatible.length === 1 && normalize(compatible[0].grandeza) === unit) {
    return { kind: 'matched', material: compatible[0], basis: 'name-and-unit' };
  }
  return { kind: candidates.length ? 'ambiguous' : 'unmatched', candidates };
}

function planPurchase(purchase, materials) {
  const changes = [];
  const unresolved = [];
  for (const [index, item] of (purchase.composicao || []).entries()) {
    if (!missing(item)) continue;
    const result = match(item, materials);
    if (result.kind === 'matched') {
      changes.push({ index, description: item.descricao, materialId: result.material._id.toString(), materialName: result.material.nome, basis: result.basis });
    } else {
      unresolved.push({ index, description: item.descricao, unit: item.unidade, reason: result.kind,
        candidates: result.candidates.map((material) => ({ id: material._id.toString(), name: material.nome, unit: material.grandeza })) });
    }
  }
  return { purchaseId: purchase._id.toString(), title: purchase.titulo, before: purchase.composicao, changes, unresolved };
}

function prepareUpdate(plan) {
  assert.ok(ObjectId.isValid(plan.purchaseId));
  const $set = {};
  for (const change of plan.changes) {
    assert.ok(Number.isInteger(change.index) && change.index >= 0);
    assert.ok(missing(plan.before[change.index]), 'Never overwrite an existing reference');
    assert.ok(ObjectId.isValid(change.materialId));
    assert.equal(plan.before[change.index].descricao, change.description);
    const key = `composicao.${change.index}.materialId`;
    assert.ok(!Object.hasOwn($set, key), 'Duplicate item index');
    $set[key] = change.materialId;
  }
  assert.ok(Object.keys($set).length);
  return { filter: { _id: new ObjectId(plan.purchaseId), composicao: plan.before }, update: { $set } };
}

function afterComposition(plan) {
  return plan.before.map((item, index) => {
    const change = plan.changes.find((entry) => entry.index === index);
    return change ? { ...item, materialId: change.materialId } : item;
  });
}

function prepareRollback(plan) {
  const $set = {}, $unset = {};
  for (const change of plan.changes) {
    const key = `composicao.${change.index}.materialId`;
    const item = plan.before[change.index];
    if (Object.hasOwn(item, 'materialId')) $set[key] = item.materialId;
    else $unset[key] = '';
  }
  return {
    filter: { _id: new ObjectId(plan.purchaseId), composicao: afterComposition(plan) },
    update: { ...(Object.keys($set).length ? { $set } : {}), ...(Object.keys($unset).length ? { $unset } : {}) },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const reportArg = args.find((arg) => arg.startsWith('--report='));
  if (args.some((arg) => arg !== '--apply' && !arg.startsWith('--report=')) || apply !== !!reportArg) throw new Error('Use no arguments for dry run, or --apply --report=<file>');
  const client = new MongoClient(process.env.DB_KEY, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  try {
    const purchases = client.db('projetos').collection('controles-compras');
    const materials = await client.db('almoxarifado').collection('material').find({}, { projection: { nome: 1, grandeza: 1 } }).toArray();
    fs.mkdirSync(directory, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (!apply) {
      const to = new Date().toISOString();
      const rows = await purchases.find({ dataInsercao: { $gte: FROM, $lte: to } }).toArray();
      const plans = rows.map((purchase) => planPurchase(purchase, materials));
      const report = { mode: 'dry-run', generatedAt: to, from: FROM, to, databaseWrites: 0,
        summary: { purchasesScanned: rows.length, matchedItems: plans.reduce((n, p) => n + p.changes.length, 0),
          purchasesToUpdate: plans.filter((p) => p.changes.length).length,
          unresolvedItems: plans.reduce((n, p) => n + p.unresolved.length, 0) },
        plans: plans.filter((p) => p.changes.length || p.unresolved.length) };
      const output = path.join(directory, `dry-run-${stamp}.json`);
      fs.writeFileSync(output, EJSON.stringify(report, null, 2), { flag: 'wx' });
      console.log(JSON.stringify({ ...report.summary, report: output }));
      return;
    }
    const reviewed = EJSON.parse(fs.readFileSync(reportArg.slice('--report='.length), 'utf8'));
    assert.equal(reviewed.mode, 'dry-run');
    assert.equal(reviewed.from, FROM);
    assert.equal(reviewed.databaseWrites, 0);
    const backupPath = path.join(directory, `backup-${stamp}.jsonl`);
    const resultPath = path.join(directory, `result-${stamp}.json`);
    const result = { mode: 'apply', from: FROM, to: reviewed.to, report: path.resolve(reportArg.slice(9)), backupPath,
      updatedPurchases: 0, updatedItems: 0, applied: [], skipped: [], verificationIssues: [] };
    const fd = fs.openSync(backupPath, 'wx');
    try {
      for (const plan of reviewed.plans.filter((entry) => entry.changes.length)) {
        const current = await purchases.findOne({ _id: new ObjectId(plan.purchaseId) });
        if (!current || current.dataInsercao < FROM || current.dataInsercao > reviewed.to || !require('node:util').isDeepStrictEqual(current.composicao, plan.before)) {
          result.skipped.push({ purchaseId: plan.purchaseId, reason: 'purchase-changed' }); continue;
        }
        // Recompute matches from the actual purchase and current catalog; do not trust supplied IDs.
        const recomputed = planPurchase(current, materials);
        assert.deepEqual(recomputed.changes, plan.changes, 'Catalog matches differ from reviewed plan');
        const prepared = prepareUpdate(plan);
        fs.writeSync(fd, EJSON.stringify({ plan, rollback: prepareRollback(plan) }) + '\n');
        fs.fsyncSync(fd);
        const update = await purchases.updateOne(prepared.filter, prepared.update);
        if (update.modifiedCount !== 1) {
          result.skipped.push({ purchaseId: plan.purchaseId, reason: 'concurrent-change' }); continue;
        }
        result.updatedPurchases++;
        result.updatedItems += plan.changes.length;
        result.applied.push(plan.purchaseId);
        const after = await purchases.findOne({ _id: current._id });
        const expected = { ...current, composicao: afterComposition(plan) };
        if (!require('node:util').isDeepStrictEqual(after, expected)) result.verificationIssues.push(plan.purchaseId);
      }
    } finally {
      fs.closeSync(fd);
      fs.writeFileSync(resultPath, EJSON.stringify(result, null, 2), { flag: 'wx' });
    }
    console.log(JSON.stringify({ ...result, applied: result.applied.length, resultPath }));
    if (result.skipped.length || result.verificationIssues.length) process.exitCode = 1;
  } finally { await client.close(); }
}

module.exports = { normalize, missing, match, planPurchase, prepareUpdate, afterComposition, prepareRollback };
if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });

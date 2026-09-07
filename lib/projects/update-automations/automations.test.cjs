const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { ObjectId } = require('mongodb');

// Load the TypeScript modules with isolated integration fakes; no database or messages are sent.
function loadAutomations() {
  const calls = { projects: [], orders: [], crm: [], emails: [], tracking: [] };
  const cache = new Map();
  const stubs = {
    '@/lib/integrations/resend': { emails: { send: async (email) => { calls.emails.push(email); return {}; } } },
    '@/utils/services/mongodb/crm/main': async () => ({ collection: () => ({ updateOne: async (...args) => calls.crm.push(args) }) }),
    '@/utils/methods/util/projects': { getContractValue: () => 100 },
    '@/lib/project-journeys/tracking': { handleProjectUpdateJourneyStepsTracking: async (input) => {
      await new Promise(resolve => setImmediate(resolve));
      calls.tracking.push(input);
    } },
  };
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    new Function('require', 'module', 'exports', code)((id) => {
      if (id in stubs) return stubs[id];
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), `${id}.ts`));
      if (id.startsWith('@/')) return load(path.resolve(__dirname, '../../..', `${id.slice(2)}.ts`));
      return require(id);
    }, module, module.exports);
    return module.exports;
  }
  const project = {
    _id: new ObjectId(), tipoDeServico: 'SISTEMA FOTOVOLTAICO', nomeDoContrato: 'Test',
    contrato: { status: 'PENDENTE', dataAssinatura: '2026-09-01T00:00:00.000Z' },
    compra: { dataPagamento: '2026-09-02T00:00:00.000Z' },
    obra: { observacoes: 'Roof / Access' }, vendedor: { nome: 'Test seller' },
    homologacao: { acesso: {}, vistoria: {} }, pagamento: {},
  };
  const context = {
    project, previous: structuredClone(project), updateKeys: [], author: { id: 'test', nome: 'Test' },
    projectsCollection: { updateOne: async (...args) => calls.projects.push(args) },
    serviceOrdersCollection: {
      updateOne: async (...args) => calls.orders.push(['update', ...args]),
      insertOne: async (order) => { calls.orders.push(['insert', order]); return { insertedId: new ObjectId() }; },
    },
  };
  return { calls, context, ...load(path.join(__dirname, 'index.ts')) };
}

test('unrelated updates only run tracking, and wait for it', async () => {
  const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
  context.updateKeys = ['nomeDoContrato'];
  await run(context);
  assert.equal(calls.tracking.length, 1);
  for (const key of ['projects', 'orders', 'crm', 'emails']) assert.equal(calls[key].length, 0);
});

test('signature date creates and links an assembly order without status notifications', async () => {
  const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
  context.updateKeys = ['contrato.dataAssinatura'];
  await run(context);
  assert.equal(calls.orders[0][0], 'insert');
  assert.equal(calls.orders[0][1].projeto.id, context.project._id.toString());
  assert.equal(calls.orders[0][1].autor.nome, 'Test');
  assert.ok(calls.projects[0][1].$set.idOrdemServico);
  assert.equal(calls.emails.length, 0);
});

test('saving a signature again syncs the linked order without replacing it', async () => {
  const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
  context.project.idOrdemServico = new ObjectId().toString();
  context.updateKeys = ['contrato.dataAssinatura'];
  await run(context);
  assert.equal(calls.orders.length, 1);
  assert.equal(calls.orders[0][0], 'update');
  assert.equal(calls.projects.length, 0);
});

test('commission uses payment for assembly types and signature for other types, including clearing dates', async () => {
  for (const type of ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO', 'PRODUTOS E SERVIÇOS AVULSOS', 'MONTAGEM E DESMONTAGEM', 'MONITORAMENTO']) {
    const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
    context.project.tipoDeServico = type;
    context.project.idOrdemServico = new ObjectId().toString();
    context.updateKeys = ['compra.dataPagamento', 'contrato.dataAssinatura'];
    context.project.compra.dataPagamento = null;
    await run(context);
    assert.equal(calls.projects[0][1].$set['comissoes.dataReferencia'], type === 'MONITORAMENTO' ? context.project.contrato.dataAssinatura : null);
  }
});

test('signing notifies finance, marks CRM won, and sets coverage for eligible services', async () => {
  for (const type of ['SEGURO DE SISTEMA FOTOVOLTAICO', 'OPERAÇÃO E MANUTENÇÃO', 'MONITORAMENTO']) {
    const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
    context.project.tipoDeServico = type;
    context.project.contrato.status = 'ASSINADO';
    context.project.idProjetoCRM = new ObjectId().toString();
    await run(context);
    assert.equal(calls.emails.length, 1);
    assert.equal(calls.crm[0][1].$set.ganho.idProjeto, context.project._id.toString());
    const prefix = type.startsWith('SEGURO') ? 'seguro' : 'oem';
    assert.equal(calls.projects[0][1].$set[`${prefix}.dataFim`], '2027-09-01T00:00:00.000Z');
  }
});

test('rescission and unsigning have distinct CRM and notification effects', async () => {
  for (const status of ['RESCISÃO DE CONTRATO', 'PENDENTE', 'ASSINADO']) {
    const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
    context.previous.contrato.status = 'ASSINADO';
    context.project.contrato.status = status;
    context.project.idProjetoCRM = new ObjectId().toString();
    await run(context);
    assert.equal(calls.emails.length, status === 'RESCISÃO DE CONTRATO' ? 1 : 0);
    assert.equal(calls.crm.length, status === 'ASSINADO' ? 0 : 1);
    if (status !== 'ASSINADO') assert.equal(calls.crm[0][1].$set.ganho.data, null);
    if (status === 'PENDENTE') assert.equal(calls.crm[0][1].$set.perda.data, null);
  }
});

test('cleared signature dates and whole-object updates do not create orders', async () => {
  for (const updateKeys of [['contrato.dataAssinatura'], ['contrato']]) {
    const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
    context.updateKeys = updateKeys;
    if (updateKeys[0].includes('.')) context.project.contrato.dataAssinatura = null;
    await run(context);
    assert.equal(calls.orders.length, 0);
    assert.equal(calls.projects.length, 0);
  }
});

test('a failed order insert stops later side effects and does not link a nonexistent order', async () => {
  const { calls, context, runProjectUpdateAutomations: run } = loadAutomations();
  context.updateKeys = ['contrato.dataAssinatura', 'compra.dataPagamento'];
  context.project.contrato.status = 'ASSINADO';
  context.serviceOrdersCollection.insertOne = async () => { throw new Error('insert failed'); };
  await assert.rejects(run(context), /insert failed/);
  for (const key of ['projects', 'emails', 'crm', 'tracking']) assert.equal(calls[key].length, 0);
});

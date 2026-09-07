const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file, stubs = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(id => id in stubs ? stubs[id] : require(id), module, module.exports);
  return module.exports;
}
const rules = load('allocations.ts');
const projectId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const materialId = 'bbbbbbbbbbbbbbbbbbbbbbbb';

function fixture({ authenticated = true, matched = true, materialFound = true } = {}) {
  const calls = { updates: [], logs: [], reads: [] };
  const allocation = { idMaterial: materialId, quantidadePrevista: 10, quantidade: 8, movimentacoes: [{ quantidade: 8 }], precoUnitario: 4 };
  const db = { collection: name => ({
    findOne: async () => { calls.reads.push(name); return name === 'material' ? (materialFound ? { nome: 'Cabo', grandeza: 'M', preco: 4 } : null) : { _id: projectId }; },
    findOneAndUpdate: async (filter, update) => {
      calls.updates.push({ filter, update });
      if (!matched) return { value: null };
      if (!Array.isArray(update)) allocation.quantidadePrevista = update.$set['alocacoes.$.quantidadePrevista'];
      return { value: { alocacoes: [allocation] } };
    },
    insertOne: async log => calls.logs.push(log),
  }) };
  const handlers = load('../../pages/api/projects/allocations.ts', {
    '@/utils/api': {
      apiHandler: x => x,
      validateAuthenticationWithSession: async () => { if (!authenticated) throw new Error('Unauthorized'); return { user: { id: 'user', nome: 'Test' } }; },
    },
    '@/utils/services/mongodb/projects': async () => db,
    '@/utils/services/mongodb/warehouse': async () => db,
    '@/lib/projects/allocations': rules,
  }).default;
  const invoke = async (method, body) => {
    let response;
    await handlers[method]({ method, body }, { json: data => { response = data; } });
    return response;
  };
  return { calls, allocation, invoke };
}

test('planned quantities accept decimals and reject zero, negatives, nonfinite and extra fields', () => {
  assert.equal(rules.PlannedAllocationQuantitySchema.parse(0.5), 0.5);
  for (const value of [0, -1, NaN, Infinity]) assert.equal(rules.PlannedAllocationQuantitySchema.safeParse(value).success, false);
  assert.equal(rules.EditProjectAllocationSchema.safeParse({ projectId, materialId, quantidadePrevista: 3, quantidadePrevistaAnterior: 2, quantidade: 99 }).success, false);
});

test('allocation status distinguishes none, partial, complete and excess with nonnegative pending', () => {
  for (const [actual, pending, status] of [[0, 10, 'NÃO ALOCADO'], [4, 6, 'PARCIALMENTE ALOCADO'], [10, 0, 'ALOCADO'], [12, 0, 'ALOCADO']]) {
    assert.deepEqual(rules.getAllocationProgress(10, actual), { pending, status });
  }
});

test('editing writes only planned quantity, retains movement values and audits the actor', async () => {
  const { invoke, calls, allocation } = fixture();
  await invoke('PATCH', { projectId, materialId, quantidadePrevista: 5.5, quantidadePrevistaAnterior: 10 });
  assert.deepEqual(calls.updates[0].update, { $set: { 'alocacoes.$.quantidadePrevista': 5.5 } });
  assert.deepEqual(calls.updates[0].filter.alocacoes.$elemMatch, { idMaterial: materialId, quantidadePrevista: 10 });
  assert.equal(allocation.quantidade, 8);
  assert.deepEqual(allocation.movimentacoes, [{ quantidade: 8 }]);
  assert.equal(allocation.precoUnitario, 4);
  assert.equal(calls.logs[0].autor.id, 'user');
});

test('conflicting edits return 409 and do not create a success audit', async () => {
  const { invoke, calls } = fixture({ matched: false });
  await assert.rejects(invoke('PATCH', { projectId, materialId, quantidadePrevista: 5, quantidadePrevistaAnterior: 10 }), { statusCode: 409 });
  assert.equal(calls.logs.length, 0);
});

test('adding uses catalog metadata and appends atomically even to a null allocation list', async () => {
  const { invoke, calls } = fixture();
  await invoke('POST', { projectId, materialId, quantidadePrevista: 5 });
  const { filter, update } = calls.updates[0];
  assert.deepEqual(filter['alocacoes.idMaterial'], { $ne: materialId });
  const parts = update[0].$set.alocacoes.$concatArrays;
  assert.deepEqual(parts[0], { $ifNull: ['$alocacoes', []] });
  assert.equal(parts[1].$literal[0].nome, 'Cabo');
  assert.equal(parts[1].$literal[0].quantidade, 0);
  assert.deepEqual(parts[1].$literal[0].movimentacoes, []);
});

test('duplicate adds and missing materials fail without a success audit', async () => {
  for (const [options, statusCode] of [[{ matched: false }, 409], [{ materialFound: false }, 404]]) {
    const { invoke, calls } = fixture(options);
    await assert.rejects(invoke('POST', { projectId, materialId, quantidadePrevista: 5 }), { statusCode });
    assert.equal(calls.logs.length, 0);
  }
});

test('unauthenticated requests never touch the database', async () => {
  const { invoke, calls } = fixture({ authenticated: false });
  await assert.rejects(invoke('PATCH', {}), /Unauthorized/);
  assert.equal(calls.reads.length, 0);
  assert.equal(calls.updates.length, 0);
});

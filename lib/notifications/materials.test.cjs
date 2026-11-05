const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '../..');

function harness() {
  const calls = [];
  const modules = new Map();
  const controls = [{ _id: 'purchase-1', titulo: 'Purchase', status: 'PENDENTE' }];
  const stubs = {
    '@/utils/api': {
      apiHandler: (handlers) => handlers.GET,
      validateAuthenticationWithSession: async () => ({ user: { id: 'operator' } }),
    },
    '@/utils/services/mongodb/projects': async () => ({
      collection: () => ({
        find(query) {
          assert.deepEqual(query, { dataEfetivacao: null });
          return { toArray: async () => controls };
        },
      }),
    }),
    '@/utils/services/mongodb/mongo-client': {},
    '@/utils/schemas/purchases': { PurchaseControlKanbanSimplifiedProjection: {} },
    '@/lib/service-orders/delivery-release': {},
    '@/utils/services/novu': {
      novu: { trigger: async (input) => {
        calls.push(input);
        return { result: { transactionId: 'notification-1' } };
      } },
    },
  };

  function load(id, parent = projectRoot) {
    if (Object.hasOwn(stubs, id)) return stubs[id];
    // Reproduce the production dependency failure without relying on Node's
    // version-dependent support for require(ESM).
    if (id.startsWith('@novu/framework') || id === 'sanitize-html') {
      throw new Error('ERR_REQUIRE_ESM: workflow runtime must not load in purchase routes');
    }
    if (!id.startsWith('@/') && !id.startsWith('.')) return require(id);
    const filename = path.resolve(id.startsWith('@/') ? projectRoot : parent, id.startsWith('@/') ? id.slice(2) : id) + '.ts';
    if (modules.has(filename)) return modules.get(filename);
    const compiledModule = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    new Function('require', 'module', 'exports', code)(
      (dependency) => load(dependency, path.dirname(filename)), compiledModule, compiledModule.exports,
    );
    modules.set(filename, compiledModule.exports);
    return compiledModule.exports;
  }
  return { load, calls, controls };
}

test('Purchases kanban GET loads and returns controls even when the workflow runtime cannot load', async () => {
  const { load, controls } = harness();
  const handler = load('@/pages/api/controles-compras/index').default;
  let status, body;
  await handler({ query: { queryTags: '', queryPendingConclusion: 'true' } }, {
    status(value) { status = value; return this; },
    json(value) { body = value; return this; },
  });
  assert.equal(status, 200);
  assert.deepEqual(body, { data: controls });
});

test('stock threshold notifications retain their workflow and subscriber contracts', async () => {
  const { load, calls } = harness();
  const { notifyMaterialBelowMinimumIfCrossed } = load('@/lib/notifications/materials');
  const change = { materialName: 'Panel', previousQuantity: 10, newQuantity: 4, minimumQuantity: 5 };
  const result = await notifyMaterialBelowMinimumIfCrossed(change);
  assert.equal(result.transactionId, 'notification-1');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].workflowId, 'notify-general-notification');
  assert.ok(calls[0].to.every((subscriber) => subscriber.startsWith('app-')));
  assert.match(calls[0].payload.body, /Panel/);
  assert.equal(await notifyMaterialBelowMinimumIfCrossed({ ...change, previousQuantity: 4 }), null);
  assert.equal(await notifyMaterialBelowMinimumIfCrossed({ ...change, minimumQuantity: null }), null);
  assert.equal(calls.length, 1);
});


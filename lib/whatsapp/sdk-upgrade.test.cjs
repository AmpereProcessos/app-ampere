const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file, stubs = {}, expose = '') {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  new Function('require', 'module', 'exports', `${code}\n${expose}`)(
    (id) => (id in stubs ? stubs[id] : require(id)),
    module,
    module.exports,
  );
  return module.exports;
}

async function aiHarness(payload) {
  const ai = await import('ai');
  const { MockLanguageModelV4 } = await import('ai/test');
  const model = new MockLanguageModelV4({
    doGenerate: {
      content: [{ type: 'text', text: JSON.stringify(payload) }],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage: {
        inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 10, text: 10, reasoning: 0 },
      },
      warnings: [],
    },
  });
  const { z } = require('zod');
  const schemas = load('../../utils/schemas/finances.ts', {
    './users': {
      AuthorSchema: z.object({ id: z.string(), nome: z.string(), avatar_url: z.string().nullish() }),
    },
  });
  return {
    model,
    stubs: {
      ai,
      '@ai-sdk/openai': { openai: () => model },
      '@/utils/api': {
        apiHandler: (handlers) => handlers.POST,
        validateAuthenticationWithSession: async () => ({ user: { id: 'operator' } }),
      },
      '@/utils/schemas/finances': schemas,
      '@/utils/services/mongodb/projects': async () => {
        throw new Error('Unexpected database access');
      },
    },
  };
}

test('AI SDK 7 extracts schema-validated PDF lines and the endpoint still assigns UUIDs', async () => {
  const line = {
    data: '2026-11-04T00:00:00.000Z',
    descricao: 'Payment',
    valor: 125.5,
    tipo: 'ENTRADA',
    documento: null,
  };
  const { model, stubs } = await aiHarness({ linhas: [line] });
  const handler = load('../../pages/api/financeiro/reconciliation/extract.ts', stubs).default;
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(new Uint8Array([37, 80, 68, 70]), { headers: { 'Content-Type': 'application/pdf' } });
  try {
    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
      },
    };
    await handler({ body: { pdfUrl: 'https://documents.example/statement.pdf' } }, res);
    assert.equal(res.statusCode, 200);
    const { id, ...extracted } = res.body.data.linhasExtraidas[0];
    assert.match(id, /^[0-9a-f-]{36}$/);
    assert.deepEqual(extracted, line);
    assert.equal(model.doGenerateCalls[0].prompt[0].role, 'system');
    assert.ok(
      model.doGenerateCalls[0].prompt.some(
        (message) => Array.isArray(message.content) && message.content.some((part) => part.type === 'file'),
      ),
    );
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('AI SDK 7 matching keeps structured results and sends instructions separately', async () => {
  const { model, stubs } = await aiHarness({
    matches: [{ linhaId: 'line-1', transacaoId: 'transaction-1', score: 0.9 }],
  });
  const { runAiMatch } = load(
    '../../pages/api/financeiro/reconciliation/match.ts',
    stubs,
    'exports.runAiMatch = runAiMatch;',
  );
  const result = await runAiMatch({
    ambiguas: [
      {
        linha: {
          id: 'line-1',
          data: '2026-11-04T00:00:00.000Z',
          descricao: 'Payment',
          valor: 100,
          tipo: 'ENTRADA',
        },
      },
    ],
    naoEncontradas: [],
    candidatosRestantes: [
      {
        id: 'transaction-1',
        titulo: 'Payment',
        valor: 100,
        tipo: 'ENTRADA',
        metodo: 'PIX',
        dataPrevisao: '2026-11-04T00:00:00.000Z',
        dataEfetivacao: null,
      },
    ],
  });
  assert.deepEqual(result.get('line-1'), { transacaoId: 'transaction-1', score: 0.9 });
  assert.equal(model.doGenerateCalls[0].prompt[0].role, 'system');
});

test('Novu 3 serializes notification triggers and parses transaction ids', async () => {
  const { Novu } = await import('@novu/api');
  const { HTTPClient } = await import('@novu/api/lib/http.js');
  const requests = [];
  const httpClient = new HTTPClient({
    fetcher: async (request) => {
      requests.push({ url: request.url, body: JSON.parse(await request.text()) });
      return Response.json(
        { data: { acknowledged: true, status: 'processed', transactionId: 'transaction-id' } },
        { status: 201 },
      );
    },
  });
  const novu = new Novu({ secretKey: 'test-key', httpClient });
  const result = await novu.trigger({
    workflowId: 'notify-general-notification',
    to: ['subscriber-1'],
    payload: { subject: 'Subject', body: 'Body', text: 'Text' },
  });
  assert.equal(result.result.transactionId, 'transaction-id');
  assert.equal(requests[0].body.name, 'notify-general-notification');
  assert.deepEqual(requests[0].body.to, ['subscriber-1']);
});

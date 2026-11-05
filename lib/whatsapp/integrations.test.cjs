const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file, stubs = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  new Function('require', 'module', 'exports', code)(
    (id) => (id in stubs ? stubs[id] : require(id)),
    module,
    module.exports,
  );
  return module.exports;
}

function webhookHarness() {
  const updates = [];
  let connections = 0;
  const parsing = load('parsing.ts');
  const handler = load('../../pages/api/integracao/whatsapp/index.ts', {
    '@/lib/whatsapp/parsing': parsing,
    '@/utils/services/mongodb/administration': async () => {
      connections++;
      return {
        collection: () => ({
          updateOne: async (...args) => {
            updates.push(args);
            return { matchedCount: 1 };
          },
        }),
      };
    },
  }).default;
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
  return { handler, response, updates, connections: () => connections };
}

test('WhatsApp webhook verification works without a chat backend', async () => {
  const previous = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = 'verification-token';
  try {
    const { handler, response, connections } = webhookHarness();
    await handler(
      {
        method: 'GET',
        query: {
          'hub.mode': 'subscribe',
          'hub.verify_token': 'verification-token',
          'hub.challenge': 'challenge',
        },
      },
      response,
    );
    assert.equal(response.statusCode, 200);
    assert.equal(response.body, 'challenge');
    assert.equal(connections(), 0);
  } finally {
    if (previous === undefined) delete process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    else process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = previous;
  }
});

test('deprecated incoming chat events are acknowledged without database access', async () => {
  const { handler, response, connections } = webhookHarness();
  await handler(
    {
      method: 'POST',
      body: {
        object: 'whatsapp_business_account',
        entry: [{ changes: [{ field: 'messages', value: { messages: [{ id: 'old-chat-message' }] } }] }],
      },
    },
    response,
  );
  assert.equal(response.statusCode, 200);
  assert.equal(connections(), 0);
});

for (const [field, value, expected] of [
  [
    'message_template_status_update',
    { event: 'REJECTED', reason: 'Invalid content' },
    { status: 'REJEITADO', motivoRejeicao: 'Invalid content' },
  ],
  ['message_template_quality_update', { new_quality: 'GREEN' }, { qualidade: 'ALTA' }],
  ['template_category_update', { category: 'UTILITY' }, { categoria: 'utility' }],
]) {
  test(`template ${field} events still update MongoDB`, async () => {
    const { handler, response, updates } = webhookHarness();
    await handler(
      {
        method: 'POST',
        body: {
          object: 'whatsapp_business_account',
          entry: [
            {
              changes: [
                {
                  field,
                  value: {
                    message_template_id: 'template-id',
                    message_template_name: 'journey',
                    message_template_language: 'pt_BR',
                    ...value,
                  },
                },
              ],
            },
          ],
        },
      },
      response,
    );
    assert.equal(response.statusCode, 200);
    assert.deepEqual(updates, [[{ whatsappTemplateId: 'template-id' }, { $set: expected }]]);
  });
}

test('connection persistence uses the existing integration record and preserves its original author', async () => {
  const updates = [];
  const connection = {
    tipo: 'WHATSAPP',
    token: 'test-token',
    dataExpiracao: '2027-01-01T00:00:00.000Z',
    metaAutorAppId: 'app-user',
    metaEscopo: ['whatsapp_business_messaging'],
    telefones: [],
  };
  const { z } = require('zod');
  const schemas = load('../../utils/schemas/integrations.ts', {
    './users': {
      AuthorSchema: z.object({ id: z.string(), nome: z.string(), avatar_url: z.string().nullish() }),
    },
  });
  const { saveWhatsappIntegration } = load('connection.ts', {
    '@/utils/schemas/integrations': schemas,
    '@/utils/services/mongodb/projects': async () => ({
      collection: (name) => {
        assert.equal(name, 'integracoes');
        return { updateOne: async (...args) => updates.push(args) };
      },
    }),
  });
  await saveWhatsappIntegration(connection, { user: { id: 'operator', nome: 'Operator', avatar_url: null } });
  const [filter, update, options] = updates[0];
  assert.deepEqual(filter, { identificador: 'WHATSAPP' });
  assert.deepEqual(update.$set.dados, connection);
  assert.equal(update.$setOnInsert.autor.id, 'operator');
  assert.equal(update.$set.autor, undefined);
  assert.deepEqual(options, { upsert: true });
  await assert.rejects(saveWhatsappIntegration(connection, { user: null }), /não autenticado/);
});

test('project journey messages use the direct sender and retain the configured payload', async () => {
  const sent = [];
  const stage = {
    ordem: 1,
    titulo: 'Signed',
    versao: 'WORKFLOW',
    concluido: false,
    gatilho: { evento: 'CONTRATO_ASSINADO' },
    acoes: [{ tipo: 'ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP', metadados: { whatsappTemplateId: 'template-id' } }],
  };
  const payload = {
    messaging_product: 'whatsapp',
    to: 'configured-recipient',
    type: 'template',
    template: { name: 'journey' },
  };
  const { handleProjectUpdateJourneyStepsTracking } = load('../project-journeys/tracking.ts', {
    '@/lib/whatsapp': {
      sendTemplateWhatsappMessage: async (input) => {
        sent.push(input);
        return { whatsappMessageId: 'sent-id' };
      },
    },
    '.': {
      UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_CONFIG: [{ ...stage, payload: () => ({ data: payload }) }],
    },
  });
  const base = {
    contrato: { status: 'PENDENTE' },
    homologacao: { acesso: {}, vistoria: {} },
    compra: {},
    obra: {},
    conferencias: { energiaInjetada: {} },
    jornada: { estagios: [stage] },
  };
  const result = await handleProjectUpdateJourneyStepsTracking({
    projectId: '507f1f77bcf86cd799439011',
    previous: base,
    updated: { ...base, contrato: { status: 'ASSINADO' } },
    collection: { updateOne: async () => ({ acknowledged: true }) },
  });
  assert.deepEqual(sent, [{ fromPhoneNumberId: '807009649165845', templatePayload: payload }]);
  assert.equal(result.success, true);
});

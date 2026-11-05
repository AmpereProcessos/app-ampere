const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');

function load(file) {
  const filename = path.resolve(root, file);
  const compiledModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(
    (id) => id.startsWith('.') ? load(path.relative(root, path.resolve(path.dirname(filename), id)) + '.ts')
      : id.startsWith('@/') ? load(id.slice(2) + '.ts') : require(id),
    compiledModule, compiledModule.exports,
  );
  return compiledModule.exports;
}

test('deployment runtime supports the Google and Novu dependency requirements', () => {
  const [major, minor] = process.versions.node.split('.').map(Number);
  assert.ok(major === 22 && minor >= 12, 'Use Node 22.12+ (22.x), as declared in package.json and .nvmrc');
  assert.equal(typeof require('node:buffer').SlowBuffer, 'function');
  assert.equal(process.features.require_module, true, 'require(ESM) must be enabled for sanitize-html');
});

test('service-order Google OAuth and Calendar imports work and preserve authenticated event requests', async () => {
  const { getConfiguredGoogleOAuth2Client } = load('utils/services/google/oauth.ts');
  const { google } = require('googleapis');
  const auth = getConfiguredGoogleOAuth2Client('test-refresh-token');
  assert.equal(auth.credentials.refresh_token, 'test-refresh-token');
  auth.setCredentials({ access_token: 'test-access-token', expiry_date: Date.now() + 3600000 });
  const requests = [];
  auth.transporter.request = async (options) => {
    requests.push(options);
    return { data: { id: 'test-event' }, status: 200, headers: {}, config: options };
  };
  const calendar = google.calendar({ version: 'v3', auth });
  const result = await calendar.events.insert({
    calendarId: 'service-orders@example.com',
    requestBody: { summary: 'Service order', start: { dateTime: '2026-11-05T12:00:00Z' }, end: { dateTime: '2026-11-05T13:00:00Z' } },
  });
  assert.equal(result.data.id, 'test-event');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].method, 'POST');
  assert.match(String(requests[0].url), /calendars\/service-orders%40example.com\/events/);
  assert.equal(requests[0].headers.Authorization, 'Bearer test-access-token');
  assert.equal(requests[0].data.summary, 'Service order');
});

test('Novu framework loads through both server module entry points', async () => {
  // These are actual dependencies, deliberately not mocked. A build alone did
  // not catch the production sanitize-html -> htmlparser2 require(ESM) failure.
  assert.equal(typeof require('@novu/framework').workflow, 'function');
  assert.equal(typeof (await import('@novu/framework')).workflow, 'function');
  const previousSecret = process.env.NOVU_SECRET_KEY;
  process.env.NOVU_SECRET_KEY = 'runtime-test-secret';
  try {
    const bridge = load('app/api/novu/route.ts');
    for (const method of ['GET', 'POST', 'OPTIONS']) assert.equal(typeof bridge[method], 'function');
  } finally {
    if (previousSecret === undefined) delete process.env.NOVU_SECRET_KEY;
    else process.env.NOVU_SECRET_KEY = previousSecret;
  }
});

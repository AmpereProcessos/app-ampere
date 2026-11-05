const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

test('retired purchase migration returns 410 for every method without loading database dependencies', async () => {
  const compiledModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../../pages/api/manual-updates/fix-purchase-composition-items.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('require', 'module', 'exports', code)(
    (id) => { throw new Error(`Retired route must not load runtime dependencies: ${id}`); },
    compiledModule, compiledModule.exports,
  );
  for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']) {
    let status, response;
    const headers = {};
    const res = {
      setHeader: (name, value) => { headers[name] = value; },
      status: (code) => { status = code; return res; },
      json: (body) => { response = body; return res; },
    };
    await compiledModule.exports.default({ method, query: {}, body: { force: true } }, res);
    assert.equal(status, 410, method);
    assert.equal(headers['Cache-Control'], 'no-store', method);
    assert.equal(typeof response.error.message, 'string');
  }
});

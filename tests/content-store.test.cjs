const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

test('a seed-backed deployment serves new restaurants even when the data cache contains the previous list', async () => {
  const previousEnv = process.env.NODE_ENV, previousToken = process.env.BLOB_READ_WRITE_TOKEN;
  process.env.NODE_ENV = 'production'; delete process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const restaurants = [{ slug: 'existing' }, { slug: 'newly-added' }];
    const staleContent = { restaurants: [{ slug: 'existing' }], updates: [] };
    const compiled = { exports: {} };
    const source = fs.readFileSync(require.resolve('../app/lib/content-store.ts'), 'utf8');
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    const mockedRequire = name => {
      if (name === 'server-only') return {};
      if (name === 'next/cache') return { unstable_cache: () => async () => staleContent };
      if (name === '@vercel/blob') return {};
      if (name === '@/content/restaurants') return { RESTAURANTS: restaurants };
      if (name === '@/content/updates') return { UPDATES: [] };
      return require(name);
    };
    new Function('require', 'module', 'exports', output)(mockedRequire, compiled, compiled.exports);
    assert.deepEqual((await compiled.exports.getContent()).restaurants, restaurants);
  } finally {
    if (previousEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousEnv;
    if (previousToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN; else process.env.BLOB_READ_WRITE_TOKEN = previousToken;
  }
});

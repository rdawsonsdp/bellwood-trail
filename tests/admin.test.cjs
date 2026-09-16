const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file, mocks) {
  const module = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(require.resolve(file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'module', 'exports', output)(name => name in mocks ? mocks[name] : require(name), module, module.exports);
  return module.exports;
}

test('admin session rejects missing, tampered, expired and revoked cookies', async () => {
  const previous = process.env.ADMIN_PASSWORD, previousMode = process.env.NODE_ENV;
  process.env.ADMIN_PASSWORD = 'test-secret-for-auth-test'; process.env.NODE_ENV = 'production';
  let stored, options;
  const auth = load('../app/lib/admin-auth.ts', {
    'server-only': {},
    'next/headers': { cookies: async () => ({ get: () => stored ? { value: stored } : undefined, set: (_name, value, flags) => { stored = value; options = flags; } }) },
    'next/navigation': { redirect: path => { throw new Error(`Redirect ${path}`); } },
  });
  try {
    assert.equal(auth.passwordMatches('wrong'), false);
    assert.equal(auth.passwordMatches(process.env.ADMIN_PASSWORD), true);
    await assert.rejects(auth.requireAdmin(), /Redirect \/admin\/login/);
    await auth.startSession(); const original = stored;
    assert.equal(await auth.isAdmin(), true);
    assert.equal(options.httpOnly, true); assert.equal(options.secure, true); assert.equal(options.path, '/admin');
    stored = original + 'tampered'; assert.equal(await auth.isAdmin(), false);
    stored = '1.' + original.split('.')[1]; assert.equal(await auth.isAdmin(), false);
    stored = original; process.env.ADMIN_PASSWORD = 'changed-test-secret'; assert.equal(await auth.isAdmin(), false);
    process.env.ADMIN_PASSWORD = 'test-secret-for-auth-test'; await auth.endSession(); assert.equal(await auth.isAdmin(), false);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previous;
    if (previousMode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousMode;
  }
});

test('restaurant editor preserves existing pins and rejects incomplete or invalid coordinates', () => {
  const { coordinatesFromDraft, toDraft } = load('../app/admin/stop-draft.ts', { '@/content/restaurants': { CORRIDORS: { '75th': {} } } });
  assert.deepEqual(coordinatesFromDraft('', ''), { lat: undefined, lng: undefined });
  assert.deepEqual(coordinatesFromDraft('41.75', '-87.61'), { lat: 41.75, lng: -87.61 });
  for (const [lat, lng] of [['41.75', ''], ['', '-87.61'], ['NaN', '1'], ['91', '1'], ['1', '181']]) assert.throws(() => coordinatesFromDraft(lat, lng));
  const draft = toDraft({ lat: 41.75, lng: -87.61 });
  assert.deepEqual(coordinatesFromDraft(draft.lat, draft.lng), { lat: 41.75, lng: -87.61 });
});

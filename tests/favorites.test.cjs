const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const KEY = 'bellwood-saved-kitchens-v1';
// Exercise the provider with browser storage and event lifecycles, without a DOM dependency.
function browser(storage = new Map(), cookie = '') {
  const listeners = new Map(), state = [], refs = [], effects = [];
  let cursor = 0, refCursor = 0, mounted = false;
  const react = {
    createContext: () => ({ Provider: 'provider' }), useContext: () => null,
    useState: value => { const i = cursor++; if (!(i in state)) state[i] = value; return [state[i], next => { state[i] = next; }]; },
    useRef: value => { const i = refCursor++; return refs[i] ||= { current: value }; },
    useEffect: effect => { if (!mounted) effects.push(effect); },
  };
  global.document = { cookie };
  global.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  global.window = { location: { search: '' }, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: () => {}, setTimeout, clearTimeout };
  function load(file) {
    const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    const mod = { exports: {} };
    new Function('require', 'module', 'exports', output)(name => name === 'react' ? react : name === 'react/jsx-runtime' ? { jsx: (_, props) => props.value } : load(path.join(__dirname, '..', name.slice(2) + '.ts')), mod, mod.exports);
    return mod.exports;
  }
  const { DiscoveryProvider } = load(path.join(__dirname, '../app/components/DiscoveryContext.tsx'));
  const render = () => { cursor = refCursor = 0; return DiscoveryProvider({ children: null }); };
  render(); mounted = true; effects.forEach(fn => fn());
  return { render, event: (name, event) => listeners.get(name)?.(event) };
}
test('favorites persist by default across reloads, including removal of the final favorite', () => {
  const storage = new Map();
  let page = browser(storage);
  page.render().toggleSaved('sharks', 'Sharks');
  page.render().toggleSaved('stans', 'Stans');
  page = browser(storage);
  assert.deepEqual(page.render().saved, ['sharks', 'stans']);
  page.render().toggleSaved('sharks', 'Sharks');
  page.render().toggleSaved('stans', 'Stans');
  assert.deepEqual(browser(storage).render().saved, []);
});
test('visit-only preference is respected and changing it clears persistent storage', () => {
  const storage = new Map();
  const cookie = 'bellwood_cookie_preferences=' + encodeURIComponent(JSON.stringify({version: 1, favorites: false}));
  let page = browser(storage, cookie);
  page.render().toggleSaved('sharks', 'Sharks');
  assert.equal(storage.has(KEY), false);
  assert.deepEqual(page.render().saved, ['sharks']);
  page = browser(storage);
  page.render().toggleSaved('sharks', 'Sharks');
  document.cookie = cookie;
  page.event('bellwood-cookie-preferences-changed');
  assert.equal(storage.has(KEY), false);
});
test('corrupt storage, cross-tab clearing, and unavailable storage remain usable', () => {
  const page = browser(new Map([[KEY, '{invalid']]));
  assert.deepEqual(page.render().saved, []);
  page.event('storage', {key: KEY, newValue: '["sharks"]'});
  assert.deepEqual(page.render().saved, ['sharks']);
  page.event('storage', {key: null, newValue: null});
  assert.deepEqual(page.render().saved, []);
  localStorage.setItem = () => { throw new Error('blocked'); };
  page.render().toggleSaved('sharks', 'Sharks');
  assert.deepEqual(page.render().saved, ['sharks']);
  assert.match(page.render().message, /this visit/);
});

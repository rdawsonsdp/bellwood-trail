const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Use the project's existing TypeScript compiler, without another test dependency.
const cache = new Map();
function loadTs(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} }; cache.set(filename, module);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const localRequire = spec => {
    const source = spec.startsWith('@/') ? path.join(__dirname, '..', spec.slice(2)) : spec.startsWith('.') ? path.resolve(path.dirname(filename), spec) : null;
    return source ? loadTs(`${source}.ts`) : require(spec);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  return module.exports;
}
const { EMPTY_FILTERS, readFilters, writeFilters, filterStops } = loadTs(path.join(__dirname, '../app/lib/discovery.ts'));
const stops = [
  { slug:'bakery', name:'Cake Kitchen', tagline:'Caramel cake', cuisine:['Bakery'], signature:['Sweet potato pie'], address:'328 E 75th St', neighborhood:'Chatham', corridor:'75th', meals:[], dineIn:false, status:{open:true} },
  { slug:'jerk', name:'Island Kitchen', tagline:'Jerk chicken', cuisine:['Caribbean'], signature:['Curry goat'], address:'119 E 79th St', neighborhood:'Chatham', corridor:'79th', meals:['lunch','dinner'], dineIn:true, status:{open:false} },
  { slug:'unknown', name:'A barbecue kitchen', tagline:'Slow smoked', cuisine:['Barbecue'], signature:['Rib tips'], address:'312 E 75th St', neighborhood:'Chatham', corridor:'75th', meals:['dinner'], status:{open:true} },
];
const matches = patch => filterStops(stops, {...EMPTY_FILTERS,...patch}, ['bakery']).map(s=>s.slug);

test('empty filters preserve every published stop and original order',()=>assert.deepEqual(matches({}),['bakery','jerk','unknown']));
test('search spans dishes, addresses, corridor names, and multiple words',()=>{
  assert.deepEqual(matches({q:'sweet potato'}),['bakery']);
  assert.deepEqual(matches({q:'79th curry'}),['jerk']);
  assert.deepEqual(matches({q:'  CHATHAM cake  '}),['bakery']);
  assert.deepEqual(matches({q:'cake curry'}),[]);
});
test('unconfirmed dining is neither dine-in nor carryout',()=>{
  assert.deepEqual(matches({dining:'carryout'}),['bakery']);
  assert.deepEqual(matches({dining:'dine-in'}),['jerk']);
});
test('cuisine choices widen within their group; other filters narrow',()=>{
  assert.deepEqual(matches({foods:['sweets','caribbean']}),['bakery','jerk']);
  assert.deepEqual(matches({foods:['sweets','caribbean'],open:true}),['bakery']);
  assert.deepEqual(matches({area:'79th',meal:'dinner',foods:['caribbean']}),['jerk']);
  assert.deepEqual(matches({area:'79th',meal:'breakfast'}),[]);
});
test('saved filter uses the supplied saved IDs',()=>assert.deepEqual(matches({saved:true}),['bakery']));
test('sorting does not mutate source data',()=>{
  assert.deepEqual(matches({sort:'name'}),['unknown','bakery','jerk']);
  assert.deepEqual(matches({sort:'open'}),['unknown','bakery','jerk']);
  assert.deepEqual(stops.map(s=>s.slug),['bakery','jerk','unknown']);
});
test('URL filters round-trip and keep unrelated query parameters',()=>{
  const filters={...EMPTY_FILTERS,q:'sweet potato',area:'75th',foods:['sweets','vegan'],meal:'lunch',dining:'carryout',open:true,saved:true,sort:'name'};
  const params=writeFilters(filters,new URLSearchParams('utm_source=gci'));
  assert.deepEqual(readFilters(params),filters);assert.equal(params.get('utm_source'),'gci');
  assert.equal(writeFilters(EMPTY_FILTERS,params).toString(),'utm_source=gci');
});
test('unknown or repeated URL values cannot become active filters',()=>{
  const parsed=readFilters(new URLSearchParams('area=constructor&food=sweets,sweets,bogus&meal=midnight&dining=maybe&sort=random&open=true'));
  assert.deepEqual(parsed,{...EMPTY_FILTERS,foods:['sweets']});
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadTs(filename) {
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const localRequire = spec => spec.startsWith('@/') ? loadTs(`${path.join(__dirname, '..', spec.slice(2))}.ts`) : require(spec);
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  return module.exports;
}
const { searchDishes, matchDishes, menuSections, dishCount, sourceNote, checkedLabel, searchWords } = loadTs(path.join(__dirname, '../app/lib/menu.ts'));
const { EMPTY_FILTERS, filterStops } = loadTs(path.join(__dirname, '../app/lib/discovery.ts'));
const { MENUS } = loadTs(path.join(__dirname, '../content/menus.ts'));
const { RESTAURANTS } = loadTs(path.join(__dirname, '../content/restaurants.ts'));

const menu = sections => ({ source: { label: 'Its website', url: 'https://example.com/menu' }, sourceKind: 'own-site', checked: '2026-11-10', sections });
const stops = [
  { slug: 'gyros', name: 'Gyro Counter', signature: ['Gyros'], status: { open: false }, menu: menu([
    { name: 'Ribs', items: [{ name: 'Small BBQ Rib Tips', price: '$12.09' }, { name: 'Large BBQ Rib Tips', price: '$13.74' }] },
    { name: 'Tacos', items: [{ name: 'Steak', price: '$3.79' }] }]) },
  { slug: 'beef', name: 'Beef Stand', signature: ['Italian Beef'], status: { open: true }, menu: menu([
    { name: 'Bar-B-Q', items: [{ name: 'Rib Tips', description: 'With fries and garlic bread', price: '$8.95' }] },
    { name: 'Soups', items: [{ name: 'Coctel de Camarón', price: '$11.99' }] }]) },
  { slug: 'bar', name: 'Corner Bar', signature: ['Cold Beer', 'Jukebox'], status: { open: true }, menu: null },
];

test('dish search finds a dish at every kitchen that lists it, open kitchens first', () => {
  const found = searchDishes(stops, 'rib tips');
  assert.equal(found.kitchens, 2);
  assert.equal(found.total, 3);
  assert.deepEqual(found.hits.map(h => `${h.slug}:${h.item.name}`), ['beef:Rib Tips', 'gyros:Small BBQ Rib Tips', 'gyros:Large BBQ Rib Tips']);
});
test('a word may match the section, the description, or an accented dish', () => {
  assert.deepEqual(searchDishes(stops, 'tacos').hits.map(h => h.item.name), ['Steak']);
  assert.deepEqual(searchDishes(stops, 'garlic bread').hits.map(h => h.item.name), ['Rib Tips']);
  assert.deepEqual(searchDishes(stops, 'camaron').hits.map(h => h.item.name), ['Coctel de Camarón']);
  assert.deepEqual(searchDishes(stops, '   ').hits, []);
});
test('the hit limit is shared between kitchens rather than filled by one menu', () => {
  assert.deepEqual(searchDishes(stops, 'rib', 2).hits.map(h => h.slug), ['beef', 'gyros']);
});
test('a kitchen with no published menu shows what it is known for, without prices', () => {
  assert.deepEqual(menuSections(stops[2]), [{ name: 'Known for', items: [{ name: 'Cold Beer' }, { name: 'Jukebox' }] }]);
  assert.equal(dishCount(stops[2]), 2);
  assert.deepEqual(matchDishes(stops[2], searchWords('beer')).map(h => h.item.name), ['Cold Beer']);
});
test('the kitchen filter searches every dish on the menu', () => {
  const full = stops.map(s => ({ ...s, tagline: '', address: '', neighborhood: 'Bellwood', corridor: 'mannheim', cuisine: [], meals: [] }));
  assert.deepEqual(filterStops(full, { ...EMPTY_FILTERS, q: 'rib tips' }, []).map(s => s.slug), ['gyros', 'beef']);
  assert.deepEqual(filterStops(full, { ...EMPTY_FILTERS, q: 'camaron' }, []).map(s => s.slug), ['beef']);
});
test('source notes name the source and date, and warn about delivery prices', () => {
  assert.equal(checkedLabel('2026-11-10'), 'November 2026');
  assert.equal(sourceNote(menu([])), 'Menu from Its website, checked November 2026.');
  assert.match(sourceNote({ ...menu([]), sourceKind: 'delivery-marketplace' }), /often higher than at the counter/);
});
test('every published menu belongs to a real stop, names its source, and never carries an invented-looking price', () => {
  const slugs = new Set(RESTAURANTS.map(r => r.slug));
  for (const [slug, m] of Object.entries(MENUS)) {
    assert.ok(slugs.has(slug), slug);
    assert.match(m.source.url, /^https:\/\//, slug);
    assert.match(m.checked, /^\d{4}-\d{2}-\d{2}$/, slug);
    assert.ok(m.sections.length > 0 && m.sections.length <= 6, slug);
    for (const s of m.sections) for (const item of s.items) {
      assert.ok(item.name, slug);
      if (item.price !== undefined) assert.match(item.price, /^\$\d{1,3}\.\d{2}( – \$\d{1,3}\.\d{2})?$/, `${slug}: ${item.name} ${item.price}`);
    }
  }
});

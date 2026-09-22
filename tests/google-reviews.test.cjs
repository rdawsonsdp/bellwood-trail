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
const { matchesRestaurant, reviewSelection, safeGoogleUrl, fetchRestaurantReviews } = loadTs(path.join(__dirname, '../app/lib/google-reviews.ts'));
const restaurant = { name: 'Fixture Kitchen', address: '123 St Charles Rd, Bellwood, IL 60104' };
const place = { displayName: { text: 'Fixture Kitchen' }, formattedAddress: '123 Saint Charles Road, Bellwood, IL 60104, USA' };
const review = i => ({ name: `fixture-${i}`, rating: (i % 5) + 1, originalText: { text: `Synthetic test review ${i}` }, authorAttribution: { displayName: `Fixture author ${i}`, uri: 'https://www.google.com/maps/contrib/test' }, googleMapsUri: `https://www.google.com/maps/reviews/test${i}` });
test('require the same business, street, and ZIP before displaying reviews', () => {
  assert.equal(matchesRestaurant(place, restaurant), true);
  assert.equal(matchesRestaurant({...place, formattedAddress:'456 St Charles Rd, Bellwood, IL 60104'}, restaurant), false);
  assert.equal(matchesRestaurant({...place, displayName:{text:'Different Kitchen'}}, restaurant), false);
  assert.equal(matchesRestaurant({...place, formattedAddress:'123 St Charles Rd, Other City, IL 60000'}, restaurant), false);
});
test('limit to three attributed written reviews without filtering by stars or changing relevance', () => {
  const data = reviewSelection({reviews:[review(0), review(0), {rating:5}, review(1), review(2), review(3)], rating:4.1, userRatingCount:150}, 'fallback');
  assert.deepEqual(data.reviews.map(r=>r.id), ['fixture-0','fixture-1','fixture-2']);
  assert.deepEqual(data.reviews.map(r=>r.rating), [1,2,3]);
  assert.equal(data.rating, 4.1); assert.equal(data.count,150);
  assert.equal(data.reviews[0].text,'Synthetic test review 0');
});
test('reject unsafe or unrelated links and omit reviews lacking source attribution', () => {
  for(const url of ['javascript:alert(1)','https://google.com.evil.test/','https://evil.test/','http://google.com/']) assert.equal(safeGoogleUrl(url),undefined);
  assert.equal(safeGoogleUrl('https://lh3.googleusercontent.com/photo'),'https://lh3.googleusercontent.com/photo');
  assert.equal(reviewSelection({reviews:[{...review(0),googleMapsUri:'https://evil.test/'},{...review(1),authorAttribution:{}}]},'fallback').reviews.length,0);
});
test('fetch only the supplied business, disable caching, and reject ambiguous results', async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async (url, options) => {
      assert.equal(url,'https://places.googleapis.com/v1/places:searchText');
      assert.equal(options.cache,'no-store');
      assert.equal(options.headers['X-Goog-Api-Key'],'fixture-not-a-key');
      assert.equal(JSON.parse(options.body).textQuery,`${restaurant.name}, ${restaurant.address}`);
      return {ok:true,json:async()=>({places:[{...place,reviews:[review(0)]}]})};
    };
    assert.equal((await fetchRestaurantReviews(restaurant,'fixture-not-a-key')).reviews.length,1);
    global.fetch = async () => ({ok:true,json:async()=>({places:[place,place]})});
    assert.equal((await fetchRestaurantReviews(restaurant,'fixture-not-a-key')).available,false);
    global.fetch = async () => ({ok:false,status:403});
    await assert.rejects(fetchRestaurantReviews(restaurant,'fixture-not-a-key'),/403/);
  } finally { global.fetch=originalFetch; }
});

test('recognize cafe possessives, accents, and BBQ spelling with strict address matching', () => {
  assert.equal(matchesRestaurant({...place, displayName:{text:"Corner Cafe's"}}, {...restaurant,name:'Corner Cafe'}),true);
  assert.equal(matchesRestaurant({...place, displayName:{text:'Corner Café'}}, {...restaurant,name:'Corner Cafe'}),true);
  assert.equal(matchesRestaurant({...place, displayName:{text:"Donnie's BBQ"}}, {...restaurant,name:"Donnie's Barbecue"}),true);
  assert.equal(matchesRestaurant({...place, displayName:{text:"Donnie's BBQ"},formattedAddress:'4018 Butterfield Rd, Bellwood, IL 60104'}, {...restaurant,name:"Donnie's Barbecue"}),false);
});

// Google spells street types out; the village's own listings abbreviate them.
// Seven of the twenty stops sit on St. Charles Road, so this is load-bearing.
test('fold spelled-out street types so St. Charles Road matches Saint Charles Rd', () => {
  const on = (address) => matchesRestaurant({...place, formattedAddress: address}, restaurant);
  assert.equal(on('123 Saint Charles Road, Bellwood, IL 60104, USA'), true);
  assert.equal(on('123 St Charles Rd, Bellwood, IL 60104'), true);
  assert.equal(matchesRestaurant({...place, formattedAddress:'919 North Mannheim Road, Bellwood, IL 60104'}, {...restaurant, address:'919 N Mannheim Rd, Bellwood, IL 60104'}), true);
  assert.equal(matchesRestaurant({...place, formattedAddress:'633 Bellwood Avenue, Bellwood, IL 60104'}, {...restaurant, address:'633 Bellwood Ave, Bellwood, IL 60104'}), true);
  // A different house number on the right street is still the wrong place.
  assert.equal(on('125 Saint Charles Road, Bellwood, IL 60104'), false);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const output = ts.transpileModule(fs.readFileSync(require.resolve('../app/lib/map.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const compiled = { exports: {} };
new Function('exports', 'module', output)(compiled.exports, compiled);
const { project, fitMap, hasCoordinates, zoomAt, MIN_ZOOM, MAX_ZOOM } = compiled.exports;

test('invalid or missing coordinates are excluded without dropping valid zero coordinates', () => {
  for (const value of [{}, {lat:null,lng:null}, {lat:NaN,lng:0}, {lat:86,lng:0}, {lat:0,lng:181}]) assert.equal(hasCoordinates(value), false);
  assert.equal(hasCoordinates({lat:0,lng:0}), true);
});
test('all Bellwood stops fit within a phone map with room for the pins', () => {
  const points = [project(41.7594,-87.6382),project(41.7377,-87.5897)];
  const width = 390, height = 260, view = fitMap(points,width,height), scale = 256 * 2 ** view.zoom;
  for (const p of points) {
    assert.ok(Math.abs(p.x-view.x)*scale <= width/2-55);
    assert.ok(Math.abs(p.y-view.y)*scale <= height/2-55);
  }
});
test('zoom keeps the location under the pointer stationary and clamps zoom limits', () => {
  const view = {...project(41.75,-87.61),zoom:14}, anchor={x:130,y:-65};
  const next = zoomAt(view,16,anchor);
  for (const axis of ['x','y']) assert.ok(Math.abs(view[axis]+anchor[axis]/(256*2**view.zoom)-next[axis]-anchor[axis]/(256*2**next.zoom))<1e-12);
  assert.equal(zoomAt(view,100).zoom,MAX_ZOOM);
  assert.equal(zoomAt(view,-100).zoom,MIN_ZOOM);
});
test('empty and single-stop maps have finite useful views', () => {
  for (const points of [[],[project(41.75,-87.61)]]) {
    const view=fitMap(points,390,260);
    assert.ok(Object.values(view).every(Number.isFinite));
    assert.ok(view.zoom>=MIN_ZOOM && view.zoom<=MAX_ZOOM);
  }
});

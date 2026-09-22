export type MapPoint = { x: number; y: number };
export type MapView = MapPoint & { zoom: number };
/* Bellwood: the bounding box centre of the twenty stops. Used only when a
 * map is asked to fit no points at all — every real view is fitted to the
 * stops it is given. Zoom 14 frames the whole village; the trail spans about
 * 1.8 miles east to west, which is narrower than the Chatham trail this was
 * built for, so the default zoom is one step tighter. */
export const BELLWOOD_CENTER = { lat: 41.8824, lng: -87.8808 };
export const BELLWOOD_ZOOM = 14;
export const MIN_ZOOM = 11;
export const MAX_ZOOM = 19;
export function project(lat: number, lng: number): MapPoint {
  const sin = Math.sin(Math.max(-85, Math.min(85, lat)) * Math.PI / 180);
  return { x: (lng + 180) / 360, y: .5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI) };
}
export function hasCoordinates<T extends { lat?: number; lng?: number }>(stop: T): stop is T & { lat: number; lng: number } {
  return Number.isFinite(stop.lat) && Number.isFinite(stop.lng) && Math.abs(stop.lat!) <= 85 && Math.abs(stop.lng!) <= 180;
}
export function fitMap(points: MapPoint[], width: number, height: number): MapView {
  if (!points.length) return { ...project(BELLWOOD_CENTER.lat, BELLWOOD_CENTER.lng), zoom: BELLWOOD_ZOOM };
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
  const zoom = Math.min(Math.log2(Math.max(80, width - 112) / (256 * Math.max(right - left, .00001))), Math.log2(Math.max(80, height - 112) / (256 * Math.max(bottom - top, .00001))));
  return { x: (left + right) / 2, y: (top + bottom) / 2, zoom: Math.max(MIN_ZOOM, Math.min(16, zoom)) };
}
export function zoomAt(view: MapView, zoom: number, anchor: MapPoint = { x: 0, y: 0 }): MapView {
  const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  const oldScale = 256 * 2 ** view.zoom, scale = 256 * 2 ** next;
  return { x: view.x + anchor.x / oldScale - anchor.x / scale, y: view.y + anchor.y / oldScale - anchor.y / scale, zoom: next };
}

# Restaurant map — October 2026 update

The homepage now matches the Chatham reference with a compact map preview that opens the full-screen explorer. The dedicated `/map` route retains the embedded interactive view. Search matches names, addresses, cuisines and dishes. A corridor selector filters both list and pins. Selecting a restaurant shows its photo, address, website, call link, save control and Google Maps directions. `/map?stop=mickeys` (or another valid slug) opens the selected restaurant. Nearby pins cluster and expand on zoom; the searchable list keeps every stop reachable.

The map uses the existing tile renderer, keyboard controls and pinch/drag support. Twenty seed entries remain; nineteen are visible because Vari’s has not confirmed its opening. Tastee Rolls uses the current Mannheim Road address and a Census address-range geocode. Some inherited pins are approximations; see bellwood-stops.md. The map deliberately omits open-now filtering because inherited hours include placeholders.

The original modal remains available to callers that omit `embedded`. Street tiles require internet access; failures preserve the restaurant list and directions. OpenStreetMap attribution stays visible. No key or map-library dependency was added.

## Original renderer notes

# Restaurant map

The homepage opens with a click-to-explore street map, using the village blue (#0055a5), village gold (#fdb813), discovery ink (#172b45), and Figtree typography. Pins are blue; the selected pin flips to gold and carries dark ink. On mobile the primary action appears before the map preview. Opening it presents a full-screen map with a separately scrolling kitchen list. Desktop uses a map and sidebar.

Select a pin or list entry to move the map to that kitchen and show its photo, hours, address, directions, website, phone, and save action. Neighboring pins group together; selecting a group zooms in. At high zoom, grouped pins cycle through their kitchens. Every kitchen is also available in the list. Search matches dishes, cuisine, names and addresses. Open now uses the same status as the main directory. These map filters are local to the explorer; the main directory filters stay unchanged.

The native modal contains keyboard focus, closes with Escape, locks background scrolling, and restores focus to Explore the map. Map arrow keys pan and plus/minus zoom. Mouse drag, wheel, touch drag, pinch, and explicit zoom controls are supported. Selection motion respects reduced-motion preferences. Hover reveals a label without moving the camera.

Restaurant data comes from the same resolved live content as the directory. Only finite, valid stored latitude/longitude pairs become pins. Unmapped restaurants remain in the list with directions by address. Coordinates are existing editorial data, not automatically geocoded; verify them when a business moves or an address changes.

Street tiles load directly from OpenStreetMap, only for visible viewports, using normal browser caching and visible attribution. No map library or API key is required. The base tile template can be changed with NEXT_PUBLIC_MAP_TILE_URL; attribution must also be updated if changing providers. Follow https://operations.osmfoundation.org/policies/tiles/. Tile failures leave restaurant search, selection and directions available. Automated browser checks should mock tile requests to avoid synthetic map browsing against community servers.

Validation: npm test covers coordinate eligibility, mobile bounds, zoom anchoring, zoom limits and empty maps. Browser checks cover responsive overflow, open/close and focus, selection, filters, controls, tile errors and reduced motion.

## Individual cuisine pins

All 17 published restaurants have coordinates and individual pins. Nearby pins are separated on screen with leader lines to their geographic points; no count clusters hide restaurants. The legend and result-list dots use the same cuisine classification. The test suite verifies all 17 remain distinct at 320px, 390px and desktop map widths.

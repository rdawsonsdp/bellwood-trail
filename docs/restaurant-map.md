# Restaurant map

The homepage opens with a click-to-explore street map, using the existing GCI crimson (#bf1e2d), orange (#f26927), discovery ink (#172b45), and Figtree typography. On mobile the primary action appears before the map preview. Opening it presents a full-screen map with a separately scrolling kitchen list. Desktop uses a map and sidebar.

Select a pin or list entry to move the map to that kitchen and show its photo, hours, address, directions, website, phone, and save action. Neighboring pins group together; selecting a group zooms in. At high zoom, grouped pins cycle through their kitchens. Every kitchen is also available in the list. Search matches dishes, cuisine, names and addresses. Open now uses the same status as the main directory. These map filters are local to the explorer; the main directory filters stay unchanged.

The native modal contains keyboard focus, closes with Escape, locks background scrolling, and restores focus to Explore the map. Map arrow keys pan and plus/minus zoom. Mouse drag, wheel, touch drag, pinch, and explicit zoom controls are supported. Selection motion respects reduced-motion preferences. Hover reveals a label without moving the camera.

Restaurant data comes from the same resolved live content as the directory. Only finite, valid stored latitude/longitude pairs become pins. Unmapped restaurants remain in the list with directions by address. Coordinates are existing editorial data, not automatically geocoded; verify them when a business moves or an address changes.

Street tiles load directly from OpenStreetMap, only for visible viewports, using normal browser caching and visible attribution. No map library or API key is required. The base tile template can be changed with NEXT_PUBLIC_MAP_TILE_URL; attribution must also be updated if changing providers. Follow https://operations.osmfoundation.org/policies/tiles/. Tile failures leave restaurant search, selection and directions available. Automated browser checks should mock tile requests to avoid synthetic map browsing against community servers.

Validation: npm test covers coordinate eligibility, mobile bounds, zoom anchoring, zoom limits and empty maps. Browser checks cover responsive overflow, open/close and focus, selection, filters, controls, tile errors and reduced motion.

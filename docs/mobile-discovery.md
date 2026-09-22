# Mobile restaurant discovery

Keep the Village of Bellwood's blue (#0055a5), gold (#fdb813), navy text (#172b45), muted text (#5f6b7a), white (#ffffff), and pale slate (#f2f7fb). Keep Figtree for controls and the script face for the hero lettering.

Phone layout: compact header, short storefront hero, horizontal cuisine choices, search and filters, two-column restaurant grid, fixed Map / Search / Favorites navigation. The grid is left aligned; restaurant names and real restaurant images carry the visual identity. No new dependencies.

At widths up to 700px, secondary card information moves into the existing details dialog. Photos and names open that dialog; hearts save on the current device. The map opens in its existing native modal, with the same navigation available inside it. Navigation uses labels, selected states, 60px-high buttons, safe-area padding, and focus restoration. Restaurant cards retain 44px save and title targets. Body zoom remains enabled. The desktop composition is retained.

References:
- https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

Validation: production build and 20 existing tests pass. Playwright checks cover 320, 390, 430, 700, and 1280px widths; no page overflow; mobile two-column and desktop four-column grids; search; empty favorites; saving and persistence after reload; map selection and navigation; restaurant details; map focus restoration. Map tiles are mocked during automated tests. Mobile screenshots reviewed at 390px. This is a responsive website, not an installable or offline application.

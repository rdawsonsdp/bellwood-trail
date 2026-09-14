# Restaurant Google reviews

Each restaurant detail dialog requests up to three written reviews from Google Places (New), in relevance order with no star-rating filter. The directory never fetches reviews for all restaurants upfront. No dependency was added.

## Enable the data connection

Set `GOOGLE_PLACES_API_KEY` in the local `.env.local` and the Vercel project environments. Keep this server-only; never use a `NEXT_PUBLIC_` key or commit an environment file. The Google Cloud project needs billing and Places API (New) enabled. Restrict the key to that API and set appropriate usage quotas in Google Cloud. Requests for reviews use the Text Search Enterprise + Atmosphere fields; they can incur Google charges.

Restart the local server after setting the key, and redeploy to apply a Vercel environment change. Until configured, the UI offers a restaurant-specific Google Maps link and explains reviews are unavailable; it never substitutes invented reviews.

## Behavior

- Only known, visible restaurant slugs can be requested. Restaurant queries come from the existing content store, never arbitrary browser-supplied search terms.
- Match the returned business name and street address. Ambiguous or mismatched listings fail closed; verify corrected names/addresses in the content store if a restaurant has no match.
- Request on opening details, timeout after eight seconds, abort on changing/closing details, no persistent review cache or local-storage copies.
- Preserve original review text, author attribution, avatar/profile and individual source link; cap at three unique written reviews. Long text expands inline. The overall Google rating and count are independent of this subset.
- Failures do not block restaurant details, contact links or navigation.
- `/review-information` explains ordering, sources, Google feature terms and privacy.

## Verification boundary

Unit and browser tests use clearly synthetic fixtures through test-only mocks. No fixtures ship as restaurant reviews. Live reviews and listing matches for all 13 businesses must be checked with an enabled Google API key before treating the integration as complete. Neither the local environment nor the Vercel project had a key configured during implementation.

## Sources

- https://developers.google.com/maps/documentation/places/web-service/text-search
- https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places
- https://developers.google.com/maps/documentation/places/web-service/policies

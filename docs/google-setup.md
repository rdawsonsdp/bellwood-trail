# Google Maps and reviews setup

The site has separate integrations for the Google Maps background and authentic restaurant ratings/review excerpts. Neither requires Supabase.

## Configure Google Cloud

1. Select a Google Cloud project with billing enabled.
2. Enable **Maps JavaScript API** and **Places API (New)**.
3. Create a browser key restricted to Maps JavaScript API and these website referrers:
   - `https://bellwood-trail.vercel.app/*`
   - `http://localhost:3002/*`
   - Add any custom production domain or preview domains you choose to support.
4. Create a separate server key restricted to Places API (New). Do not apply website-referrer restrictions to the server key; the calls originate from the Next.js server. Keep this key private and set suitable quotas in Google Cloud.

## Vercel environment variables

Project: `rdawson-7101s-projects/bellwood-trail`.

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: the browser key. Included in the browser bundle; protect it with referrer/API restrictions.
- `GOOGLE_PLACES_API_KEY`: the server key. Never expose it with a NEXT_PUBLIC prefix.

Set these in the desired Vercel environments and redeploy. The map key is read at build time. For local development, place the variables in the ignored `.env.local` file and restart Next.js.

## Current behavior

Without the map key, the existing map remains available. Once configured, Google Maps provides the background and projection for all restaurant pins, with Google controls and attribution intact. Cuisine colors, individual pins, leader lines, filtering, and restaurant details are retained.

Review cards fetch Google's aggregate rating, rating count, and first written review in relevance order through the server endpoint. Each match must pass name, street and ZIP checks. Review excerpts link to the original review and identify its author; no third-party directory rating is substituted. If data is unavailable, the card links to Google Maps instead.

Do not store Google review text or ratings in Supabase by default. Google Places content has storage restrictions; place IDs have a documented exception. Restaurant-owned data and future VIP registrations are separate storage use cases.

References:
- https://developers.google.com/maps/documentation/javascript/get-api-key
- https://developers.google.com/maps/documentation/places/web-service/get-api-key
- https://developers.google.com/maps/documentation/places/web-service/policies

As checked October 5, 2026: Vercel reports no configured environment variables. Live Google data and the Google map cannot yet be verified.

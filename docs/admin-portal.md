# Restaurant admin portal

The portal is at `/admin`. It is not linked from the public header or footer, and all admin pages emit noindex/nofollow metadata. Authentication is enforced before each admin page reads data and before every save, upload, lookup or deletion action. The password is stored as the production `ADMIN_PASSWORD` secret in Vercel, never in source control. Sessions use signed, secure, HTTP-only cookies and expire after twelve hours. Changing the password invalidates existing sessions.

## Manage restaurants

1. Open `/admin` directly and log in.
2. Find a restaurant by its name and current image, then choose **Edit**.
3. Under **Restaurant image**, upload a photo or homepage screenshot (up to 4 MB). Alternatively, use **Check the site now** and choose a photo from the website. The preview shows how it will be cropped.
4. Add descriptive image text and choose **Save changes**. The updated image appears in the directory and map without a deployment.
5. To add a restaurant, choose **Add a restaurant**. Enter its website, address, image, cuisine, hours and other verified details.
6. Use **Find from address** in **Map location**, check the matched address, and save to place its pin. Coordinates can also be entered manually. Without coordinates it remains searchable in the directory but has no pin.
7. Use **Hide this stop from the trail** to keep a draft off the public directory. Hidden entries stay in the admin list until published or deleted.

The refresh button updates website hours and contact details. It does not replace editorial images or automatically take screenshots.

## Storage

Restaurant data lives in the private Vercel Blob store `chatham-culinary-path-data`, authenticated with `CONTENT_BLOB_READ_WRITE_TOKEN`. Reads bypass the storage CDN so a save is immediately visible, and request uncompressed JSON to preserve the strong ETag needed for version checks. The public `chatham-culinary-path-content` store, using `BLOB_READ_WRITE_TOKEN`, serves uploaded images with unique URLs to prevent stale image caches.

The stored document is authoritative and was initialized with all fourteen repository listings and the existing updates. Edits use version checks and invalidate the public content cache. Subsequent code deployments do not overwrite admin edits.

Local development without a Blob token continues to use `.content/` and `public/uploads/`, both ignored by Git. Never point routine local testing at the production store. Credentials and environment files must not be committed.

## Homepage hero

Open `/admin/hero` from the dashboard’s Edit hero image link. Upload an image up to 4 MB, add its accessible description, review the desktop/mobile crops, and save. The hero is stored alongside restaurant content and survives deployments. Existing content without a hero setting falls back to the Lem’s photo. Saving uses the same version checks as restaurant edits and refreshes the public content cache.

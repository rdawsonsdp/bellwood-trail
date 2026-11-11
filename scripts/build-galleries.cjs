// Rebuild content/galleries.ts from docs/gallery-manifests/*.json and
// content/profiles.ts from docs/site-content/*.json.
// Run: node scripts/build-galleries.cjs
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const dir = path.join(root, "docs/gallery-manifests");
const target = path.join(root, "content/galleries.ts");
const galleries = {};
for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
  const { slug, photos } = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const kept = photos.filter(p => fs.existsSync(path.join(root, "public", p.src)));
  if (kept.length) galleries[slug] = kept.map(({ src, alt, kind, credit }) => ({ src, alt, kind, ...(credit ? { credit } : {}) }));
}
const src = fs.readFileSync(target, "utf8");
const head = src.slice(0, src.indexOf("export const GALLERIES"));
fs.writeFileSync(target, `${head}export const GALLERIES: Record<string, GalleryPhoto[]> = ${JSON.stringify(galleries, null, 2)};\n`);
console.log(Object.entries(galleries).map(([s, p]) => `${s}: ${p.length}`).join("\n") || "no galleries");

const label = url => /facebook\.com/.test(url) ? "Facebook" : /instagram\.com/.test(url) ? "Instagram"
  : /doordash|grubhub|ubereats|postmates|netwaiter|toasttab|clover|square\.site|chownow|order/i.test(url) ? "Order online" : "Website";
const contentDir = path.join(root, "docs/site-content");
const profiles = {};
for (const file of fs.existsSync(contentDir) ? fs.readdirSync(contentDir).filter(f => f.endsWith(".json")).sort() : []) {
  const c = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
  // Website first, then one link per kind (Facebook, Instagram, Order online).
  const seen = new Set();
  const links = [c.website, ...(c.otherLinks || [])].filter(Boolean).map(url => ({ label: label(url), url }))
    .filter(l => !seen.has(l.label) && seen.add(l.label));
  if (c.about || links.length) profiles[c.slug] = { about: c.about || "", links };
}
const profTarget = path.join(root, "content/profiles.ts");
const profSrc = fs.readFileSync(profTarget, "utf8");
fs.writeFileSync(profTarget, `${profSrc.slice(0, profSrc.indexOf("export const PROFILES"))}export const PROFILES: Record<string, RestaurantProfile> = ${JSON.stringify(profiles, null, 2)};\n`);
console.log(`profiles: ${Object.keys(profiles).length}`);

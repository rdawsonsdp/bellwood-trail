// Rebuild content/menus.ts from docs/menus/*.json.
// Run: node scripts/build-menus.cjs
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const dir = path.join(root, "docs/menus");
const target = path.join(root, "content/menus.ts");
const KINDS = ["own-site", "first-party-ordering", "delivery-marketplace", "directory"];
const clean = text => String(text ?? "").replace(/\s+/g, " ").trim();

const menus = {};
for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
  const m = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  // A menu nobody could verify is left off: the card then shows the dishes
  // the kitchen is known for, without prices.
  if (!KINDS.includes(m.sourceKind) || !/^https?:\/\//.test(m.source?.url ?? "")) { console.log(`${m.slug}: no verified menu, skipped`); continue; }
  const sections = (m.sections || []).map(s => ({
    name: clean(s.name),
    items: (s.items || []).filter(i => clean(i.name)).map(i => {
      const description = clean(i.description), price = clean(i.price);
      return { name: clean(i.name), ...(description ? { description } : {}), ...(price ? { price } : {}) };
    }),
  })).filter(s => s.name && s.items.length);
  if (!sections.length) { console.log(`${m.slug}: no items, skipped`); continue; }
  menus[m.slug] = { source: { label: clean(m.source.label), url: m.source.url }, sourceKind: m.sourceKind, checked: m.checked, sections };
  console.log(`${m.slug}: ${sections.length} sections, ${sections.reduce((n, s) => n + s.items.length, 0)} dishes (${m.sourceKind})`);
}
const src = fs.readFileSync(target, "utf8");
fs.writeFileSync(target, `${src.slice(0, src.indexOf("export const MENUS"))}export const MENUS: Record<string, RestaurantMenu> = ${JSON.stringify(menus, null, 2)};\n`);
console.log(`menus: ${Object.keys(menus).length}`);

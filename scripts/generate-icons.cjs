const fs = require('node:fs/promises');
const sharp = require('sharp');
const path = require('node:path');
const root = path.join(__dirname, '..', 'public');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0055A5"/>
  <circle cx="256" cy="256" r="189" fill="none" stroke="#FDB813" stroke-width="6"/>
  <path d="M214 140h84M214 367h84" stroke="#FDB813" stroke-width="7" stroke-linecap="round"/>
  <text x="256" y="255" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="110" fill="#FDB813">Dine</text>
  <text x="256" y="321" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="66" fill="#FFFBF2">Bellwood</text>
</svg>`;
(async () => {
  await fs.writeFile(path.join(root, 'icons/dine-bellwood.svg'), svg);
  for (const size of [32, 48, 180, 192, 512, 1024]) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(root, `icons/dine-bellwood-${size}.png`));
  }
  const pngs = await Promise.all([32, 48].map(size => fs.readFile(path.join(root, `icons/dine-bellwood-${size}.png`))));
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach((png, index) => {
    const base = 6 + 16 * index, size = [32, 48][index];
    header[base] = size; header[base + 1] = size;
    header.writeUInt16LE(1, base + 4); header.writeUInt16LE(32, base + 6);
    header.writeUInt32LE(png.length, base + 8); header.writeUInt32LE(offset, base + 12); offset += png.length;
  });
  await fs.writeFile(path.join(root, 'favicon.ico'), Buffer.concat([header, ...pngs]));
})();

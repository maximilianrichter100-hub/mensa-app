// Baut aus den Quelldateien eine einzige, offline lauffähige HTML-Datei (iPad/Safari).
// Aufruf: node build.js  →  erzeugt mensa-app-ipad.html
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');

let html = read('index.html');
const css = read('styles.css');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>\n?/g)].map(m => m[1]);
const js = scripts.map(read).join('\n;\n');

html = html.replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${css}\n</style>`);
html = html.replace(/<script src="[^"]+"><\/script>\n?/g, '');
html = html.replace('</body>', () => `<script>\n${js}\n</script>\n</body>`);

fs.writeFileSync(path.join(dir, 'mensa-app-ipad.html'), html);
console.log(`OK: ${scripts.length} Skripte + CSS inline → mensa-app-ipad.html (${(html.length / 1024).toFixed(0)} KB)`);

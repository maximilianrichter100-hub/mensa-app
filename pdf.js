/* ==========================================================================
   pdf.js – erzeugt eine echte PDF-Datei (Helvetica, A4 quer) ohne Bibliothek.
   Funktioniert offline, auch auf dem iPad. Lädt VOR app.js.
   Nur Text und Linien; Umlaute und € werden als WinAnsi kodiert.
   ========================================================================== */

const PDF_WIN_MAP = {
  '€': 0x80, '„': 0x84, '“': 0x93, '”': 0x94, '…': 0x85, '•': 0x95,
  '–': 0x96, '—': 0x97, '‘': 0x91, '’': 0x92
};

function pdfWinBytes(str) {
  const out = [];
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    if (c < 256) out.push(c);
    else out.push(PDF_WIN_MAP[ch] !== undefined ? PDF_WIN_MAP[ch] : 63); // '?'
  }
  return out;
}

/* Textliteral als reines ASCII: Sonderzeichen oktal, Klammern und Backslash escaped */
function pdfLiteral(str) {
  return pdfWinBytes(str).map(b => {
    if (b === 40 || b === 41 || b === 92) return '\\' + String.fromCharCode(b);
    if (b < 32 || b > 126) return '\\' + b.toString(8).padStart(3, '0');
    return String.fromCharCode(b);
  }).join('');
}

/* pages: Array von Seiten; Seite = Array von { x, y, s (Größe), b (fett), t (Text) } */
function buildPdf(pages, W = 842, H = 595) {
  const objs = [];
  const kids = pages.map((_, i) => 5 + i * 2);
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objs[2] = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${pages.length} >>`;
  objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  pages.forEach((ops, i) => {
    const pid = kids[i];
    const cid = pid + 1;
    let content = '';
    ops.forEach(o => {
      content += `BT /${o.b ? 'F2' : 'F1'} ${o.s || 10} Tf ${o.x.toFixed(1)} ${o.y.toFixed(1)} Td (${pdfLiteral(o.t)}) Tj ET\n`;
    });
    objs[pid] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${cid} 0 R >>`;
    objs[cid] = `<< /Length ${content.length} >>\nstream\n${content}endstream`;
  });

  let out = '%PDF-1.4\n';
  const offs = [];
  for (let i = 1; i < objs.length; i++) {
    offs[i] = out.length;
    out += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xref = out.length;
  out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objs.length; i++) out += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
  out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new Uint8Array(out.split('').map(c => c.charCodeAt(0)));
}

/* Bricht Text an Wortgrenzen in Zeilen von höchstens max Zeichen */
function pdfWrap(text, max) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  });
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

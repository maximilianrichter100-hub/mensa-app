/* ==========================================================================
   bowls.js – Bowl-Datenbank: kombiniert Protein × Beilage × Gemüse × Salat × Sauce
   aus dem Lidl-Katalog zu vielen verschiedenen Bowls. Die Auswahl ist
   deterministisch (gleiche Bowls auf jedem Gerät), die Kombinationen sind
   nicht von Hand geschrieben – so hat man immer neue Bowl-Ideen mit dem,
   was ohnehin im Vorrat liegt.
   Lädt NACH recipes_extra.js.
   ========================================================================== */

const BOWL_PROTEINS = ['huhn_innen', 'huhn_brust', 'putenbrust', 'lachs', 'garnele', 'hack', 'tofu', 'kichererbsen', 'thunfisch', 'linsen', 'edamame'];
const BOWL_CARBS = ['reis', 'quinoa', 'reisnudeln', 'kartoffel', 'drillinge', 'suesskartoffel'];
const BOWL_VEGS = ['brokkoli', 'paprika', 'zucchini', 'spinat', 'karotten', 'blumenkohl', 'asia_tk', 'pak_choi', 'rosenkohl', 'spargel', 'kohlrabi', 'aubergine', 'mais_dose', 'erbsen_tk', 'kuerbis_hokkaido'];
const BOWL_SALADS = ['avocado', 'gurke', 'tomaten', 'rucola', 'eisberg', 'rote_bete', 'radieschen', 'mango', 'krautsalat'];
const BOWL_SAUCES = ['skyr', 'quark', 'feta', 'pesto', 'salsa', 'sriracha', 'sojasauce', 'kokosmilch', 'schmand_light', 'frischkaese_light'];
const BOWL_COUNT = 220;

/* Kurzname eines Katalogartikels ohne Zusatz in Klammern */
function bowlShort(id) { return CATALOG_BY_ID[id].name.split(' (')[0]; }

function buildBowls() {
  // Einfacher, deterministischer Zufallsgenerator (LCG) → immer dieselbe Auswahl
  let seed = 20261104;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const pick = list => list[Math.floor(rnd() * list.length)];

  const seen = new Set();
  const out = [];
  let guard = 0;
  while (out.length < BOWL_COUNT && guard++ < 20000) {
    const p = pick(BOWL_PROTEINS), c = pick(BOWL_CARBS), v = pick(BOWL_VEGS), s = pick(BOWL_SALADS), sauce = pick(BOWL_SAUCES);
    const key = [p, c, v, s, sauce].join('|');
    if (seen.has(key)) continue;
    seen.add(key);

    const tags = CATALOG_BY_ID[p].tags;
    const category = tags.includes('huhn') ? 'gefluegel'
      : (tags.includes('fisch') ? 'fisch'
      : (tags.includes('rind') ? 'rind' : 'tiktok'));
    const heavy = ['kartoffel', 'drillinge', 'suesskartoffel'].includes(c);

    out.push(enrichRecipe({
      id: 'bowl_' + out.length,
      title: `${bowlShort(p)}-Bowl mit ${bowlShort(c)}, ${bowlShort(v)} & ${bowlShort(s)}`,
      category,
      season: 'all',
      prepTime: heavy ? 25 : 15,
      components: {
        protein: { id: p },
        carb: { id: c, g: 100 },
        veggie: { id: v, g: 150 },
        salad: { id: s, g: 60 },
        extras: [{ id: sauce, g: 40 }]
      },
      steps: [
        `${bowlShort(c)} nach Packungsanleitung bzw. bis gar garen${heavy ? ' (Kartoffeln vorher in Stücke schneiden)' : ''}.`,
        `${bowlShort(p)} würzen und in der Pfanne oder im Ofen rundum durchgaren.`,
        `${bowlShort(v)} knackig garen oder kurz anbraten und würzen.`,
        `${bowlShort(s)} vorbereiten, alles in der Bowl anrichten und mit ${bowlShort(sauce)} als Dip oder Dressing servieren.`
      ],
      custom: false,
      bowl: true
    }));
  }
  return out;
}

const BOWL_RECIPES = buildBowls();

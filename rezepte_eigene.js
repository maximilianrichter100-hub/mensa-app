/* Zusammenführung der eigenen Rezepte (Teile 1–4) zu App-Rezepten.
   Alle Rezepte sind EIGENE Rezepte (keine übernommenen Fremdtexte) und tragen
   die Quelle "Eigenes Rezept". Mengen in Gramm passen zum Lidl-Katalog. */
const BUILTIN_IMPORTED = [...BUILTIN_RECIPES_RAW_1, ...BUILTIN_RECIPES_RAW_2, ...BUILTIN_RECIPES_RAW_3, ...BUILTIN_RECIPES_RAW_4]
  .map((r, k) => ({
    id: 'imp_b' + String(k + 1).padStart(3, '0'),
    title: r[0],
    kategorie: r[1],
    quelle: 'Eigenes Rezept',
    prepTime: r[2],
    ingredients: r[3].map(z => ({ name: z[0], menge: z[1] })),
    steps: r[4],
    imported: true,
    builtin: true
  }));

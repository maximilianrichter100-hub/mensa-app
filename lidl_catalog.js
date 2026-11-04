/* ==========================================================================
   lidl_catalog.js – Lidl-Einzelprodukte
   Nährwerte pro 100 g (roh bzw. trocken). Packungsgrößen = echte Lidl-Gebinde.
   Felder: id, name, brand, dept, season, roles, tags, kcal, protein, carbs, fat,
           packG (Packungsgröße in g), packLabel (Anzeige auf der Einkaufsliste)
   roles: welche Bausteine das Produkt im Baukasten einnehmen kann
          (protein | carb | veggie | salad | extra)
   tags:  Allergen-/Vorlieben-Merkmale (huhn, rind, fisch, lachs, garnele,
          schwein, vegetarisch, pilze, scharf, weizen)
   ========================================================================== */

const SEASON_TAGS = {
  herbst_winter: 'Herbst / Winter',
  fruehling_sommer: 'Frühling / Sommer',
  ganzjaehrig: 'Ganzjährig'
};

/* Laufweg im Lidl-Markt – bestimmt die Sortierung der Einkaufsliste */
const DEPARTMENTS = [
  { key: 'obst', label: 'Obst, Gemüse, Kürbis & Salate', order: 1 },
  { key: 'fleisch', label: 'Frischfleisch & Fisch', order: 2 },
  { key: 'kuehl', label: 'Kühlregal (Milbona / Chef Select)', order: 3 },
  { key: 'trocken', label: 'Trockensortiment (Golden Sun)', order: 4 },
  { key: 'tk', label: 'Tiefkühltruhe (Freshona)', order: 5 },
  { key: 'backshop', label: 'Backshop & Brot', order: 6 },
  { key: 'extra', label: 'Eigene Zusatzwünsche', order: 7 }
];

function lidlItem(id, name, brand, dept, season, roles, tags, kcal, protein, carbs, fat, packG, packLabel) {
  return { id, name, brand, dept, season, roles, tags, kcal, protein, carbs, fat, packG, packLabel };
}

const LIDL_CATALOG = [
  /* ---------- Frischfleisch & Fisch ---------- */
  lidlItem('huhn_innen', 'Hähnchen-Innenfilets', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['huhn'], 110, 23, 0, 1.5, 600, '600 g Metzgerfrisch'),
  lidlItem('huhn_brust', 'Hähnchenbrustfilet', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['huhn'], 105, 23.5, 0, 1, 600, '600 g Metzgerfrisch'),
  lidlItem('cornflakes_chicken', 'Crispy Cornflakes Chicken', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['huhn', 'weizen'], 190, 18, 17, 7, 400, '400 g Cornflakes Chicken'),
  lidlItem('lachs', 'Lachsfilet (MSC)', 'Ocean Sea', 'fleisch', 'ganzjaehrig', ['protein'], ['fisch', 'lachs'], 180, 20, 0, 11, 250, '250 g Ocean Sea Lachs'),
  lidlItem('garnele', 'Riesengarnelen (roh, ohne Schale)', 'Ocean Sea', 'fleisch', 'ganzjaehrig', ['protein', 'extra'], ['fisch', 'garnele'], 90, 20, 0.5, 1, 250, '250 g Ocean Sea Garnelen'),
  lidlItem('hack', 'Rinderhack light (5 % Fett)', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['rind'], 130, 21, 0, 5, 500, '500 g Rinderhack light'),
  lidlItem('schwein', 'Schweinefilet', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['schwein'], 120, 21, 0.3, 3.5, 500, '500 g Schweinefilet'),

  /* ---------- Kühlregal ---------- */
  lidlItem('skyr', 'Skyr Natur', 'Milbona', 'kuehl', 'ganzjaehrig', ['protein', 'extra'], ['vegetarisch'], 63, 11, 4, 0.2, 500, '500 g Milbona Skyr'),
  lidlItem('huettenkaese', 'Hüttenkäse', 'Milbona', 'kuehl', 'ganzjaehrig', ['protein', 'extra'], ['vegetarisch'], 98, 11.5, 3.4, 4.3, 200, '200 g Milbona Hüttenkäse'),
  lidlItem('feta', 'Feta light', 'Milbona', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 170, 15, 3, 13, 200, '200 g Milbona Feta light'),
  lidlItem('gnocchi', 'Gnocchi', 'Chef Select', 'kuehl', 'ganzjaehrig', ['carb'], ['weizen'], 150, 4, 30, 1, 500, '500 g Chef Select Gnocchi'),

  /* ---------- Trockensortiment ---------- */
  lidlItem('linsen', 'Rote Linsen (trocken)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['protein'], ['vegetarisch'], 340, 24, 50, 1.5, 500, '500 g Golden Sun Linsen'),
  lidlItem('reis', 'Jasminreis (trocken)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['carb'], [], 350, 7, 78, 0.6, 500, '500 g Golden Sun Jasminreis'),
  lidlItem('reisnudeln', 'Reisbandnudeln (trocken)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['carb'], [], 360, 6, 80, 1, 400, '400 g Golden Sun Reisbandnudeln'),
  lidlItem('kokosmilch', 'Kokosmilch', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], [], 190, 2, 3, 19, 400, '400 ml Golden Sun Kokosmilch'),
  lidlItem('currypaste', 'Rote Currypaste', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], ['scharf'], 130, 2, 8, 9, 70, '70 g Rote Currypaste'),

  /* ---------- Obst, Gemüse, Kürbis & Salate ---------- */
  lidlItem('kartoffel', 'Speisekartoffeln (festkochend)', '', 'obst', 'ganzjaehrig', ['carb'], [], 75, 2, 15, 0.1, 1000, '1 kg Speisekartoffeln'),
  lidlItem('drillinge', 'Drillinge', '', 'obst', 'ganzjaehrig', ['carb'], [], 75, 2, 15, 0.1, 750, '750 g Drillinge'),
  lidlItem('suesskartoffel', 'Süßkartoffeln', '', 'obst', 'ganzjaehrig', ['carb'], [], 86, 1.6, 20, 0.1, 1000, '1 kg Süßkartoffeln'),
  lidlItem('kuerbis_hokkaido', 'Hokkaido-Kürbis (ungeschält)', '', 'obst', 'herbst_winter', ['carb', 'veggie'], [], 26, 1, 6, 0.1, 1000, '1 kg Hokkaido-Kürbis'),
  lidlItem('butternut', 'Butternut-Kürbis', '', 'obst', 'herbst_winter', ['carb', 'veggie'], [], 45, 1, 11, 0.1, 1000, '1 kg Butternut-Kürbis'),
  lidlItem('spinat', 'Babyspinat', '', 'obst', 'ganzjaehrig', ['veggie'], [], 23, 2.9, 3.6, 0.4, 200, '200 g Babyspinat'),
  lidlItem('spitzkohl', 'Spitzkohl', '', 'obst', 'herbst_winter', ['veggie'], [], 25, 1.3, 6, 0.1, 1000, '1 kg Spitzkohl'),
  lidlItem('rosenkohl', 'Rosenkohl', '', 'obst', 'herbst_winter', ['veggie'], [], 43, 3.4, 9, 0.3, 500, '500 g Rosenkohl'),
  lidlItem('zucchini', 'Zucchini', '', 'obst', 'fruehling_sommer', ['veggie'], [], 17, 1.2, 3, 0.3, 500, '500 g Zucchini'),
  lidlItem('spargel', 'Grüner Spargel', '', 'obst', 'fruehling_sommer', ['veggie'], [], 20, 2.2, 3.9, 0.1, 500, '500 g grüner Spargel'),
  lidlItem('paprika', 'Paprika (bunt)', '', 'obst', 'fruehling_sommer', ['veggie'], [], 31, 1, 6, 0.3, 500, '500 g Paprika'),
  lidlItem('champignons', 'Champignons', '', 'obst', 'ganzjaehrig', ['extra'], ['pilze'], 22, 3.1, 0.3, 0.3, 250, '250 g Champignons'),
  lidlItem('feldsalat', 'Feldsalat', '', 'obst', 'herbst_winter', ['salad'], [], 21, 2, 2, 0.4, 100, '100 g Feldsalat'),
  lidlItem('rote_bete', 'Rote-Bete-Salat', 'Chef Select', 'obst', 'herbst_winter', ['salad'], [], 60, 1.5, 11, 1.5, 330, '330 g Chef Select Rote Bete'),
  lidlItem('krautsalat', 'Krautsalat', 'Chef Select', 'obst', 'herbst_winter', ['salad'], [], 80, 1, 8, 5, 500, '500 g Chef Select Krautsalat'),
  lidlItem('gurkensalat', 'Gurkensalat', 'Chef Select', 'obst', 'ganzjaehrig', ['salad'], [], 50, 1, 4, 3, 300, '300 g Chef Select Gurkensalat'),
  lidlItem('eisberg', 'Eisbergsalat', '', 'obst', 'fruehling_sommer', ['salad'], [], 14, 0.9, 2, 0.2, 350, '1 Kopf Eisbergsalat'),
  lidlItem('tomaten', 'Snack-Tomaten', '', 'obst', 'fruehling_sommer', ['salad'], [], 18, 0.9, 3.9, 0.2, 500, '500 g Snack-Tomaten'),

  /* ---------- Tiefkühltruhe ---------- */
  lidlItem('brokkoli', 'Brokkoli (TK-Röschen)', 'Freshona', 'tk', 'ganzjaehrig', ['veggie'], [], 34, 2.8, 7, 0.4, 400, '400 g Freshona Brokkoli'),
  lidlItem('bohnen', 'Prinzessbohnen (TK)', 'Freshona', 'tk', 'ganzjaehrig', ['veggie'], [], 31, 1.8, 7, 0.1, 400, '400 g Freshona Prinzessbohnen'),
  lidlItem('asia_tk', 'Asia-Gemüse-Mix (TK)', 'Freshona', 'tk', 'ganzjaehrig', ['veggie'], [], 35, 2.5, 6, 0.3, 400, '400 g Freshona Asia-Mix')
];

const CATALOG_BY_ID = Object.fromEntries(LIDL_CATALOG.map(item => [item.id, item]));

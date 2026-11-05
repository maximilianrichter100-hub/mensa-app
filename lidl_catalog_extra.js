/* ==========================================================================
   lidl_catalog_extra.js – erweitert den Lidl-Katalog um Gemüse, Obst,
   Milchprodukte, Dosenware, Pasta, Wraps und Saucen.
   Nährwerte pro 100 g (ca.-Richtwerte, bitte am Etikett prüfen).
   Lädt NACH lidl_catalog.js.
   ========================================================================== */

const LIDL_CATALOG_EXTRA = [
  /* ---------- Obst, Gemüse & Salate ---------- */
  lidlItem('karotten', 'Karotten', '', 'obst', 'ganzjaehrig', ['veggie'], [], 41, 0.9, 9.6, 0.2, 1000, '1 kg Karotten'),
  lidlItem('blumenkohl', 'Blumenkohl', '', 'obst', 'herbst_winter', ['veggie'], [], 25, 1.9, 5, 0.3, 600, 'Kopf Blumenkohl (ca. 600 g)'),
  lidlItem('lauch', 'Lauch', '', 'obst', 'herbst_winter', ['veggie'], [], 31, 1.5, 7, 0.3, 500, '500 g Lauch'),
  lidlItem('zwiebeln', 'Zwiebeln', '', 'obst', 'ganzjaehrig', ['extra'], [], 40, 1.1, 9, 0.1, 1000, '1 kg Zwiebeln'),
  lidlItem('knoblauch', 'Knoblauch', '', 'obst', 'ganzjaehrig', ['extra'], [], 149, 6, 33, 0.5, 50, '1 Knolle Knoblauch'),
  lidlItem('aubergine', 'Aubergine', '', 'obst', 'fruehling_sommer', ['veggie'], [], 25, 1, 6, 0.2, 400, '400 g Aubergine'),
  lidlItem('fenchel', 'Fenchelknolle', '', 'obst', 'herbst_winter', ['veggie'], [], 31, 1.2, 7, 0.2, 400, '1 Fenchelknolle (ca. 400 g)'),
  lidlItem('rucola', 'Rucola', '', 'obst', 'fruehling_sommer', ['salad'], [], 25, 2.6, 3.7, 0.7, 75, '75 g Rucola'),
  lidlItem('avocado', 'Avocado', '', 'obst', 'ganzjaehrig', ['salad'], [], 160, 2, 9, 15, 180, '1 Avocado (ca. 180 g)'),
  lidlItem('gurke', 'Salatgurke', '', 'obst', 'fruehling_sommer', ['salad', 'veggie'], [], 15, 0.7, 3.6, 0.1, 350, '1 Salatgurke (ca. 350 g)'),
  lidlItem('radieschen', 'Radieschen', '', 'obst', 'fruehling_sommer', ['veggie', 'salad'], [], 16, 0.7, 3.4, 0.1, 200, '200 g Radieschen'),
  lidlItem('kohlrabi', 'Kohlrabi', '', 'obst', 'herbst_winter', ['veggie'], [], 27, 1.7, 6.2, 0.1, 500, '500 g Kohlrabi'),
  lidlItem('pak_choi', 'Pak Choi', '', 'obst', 'ganzjaehrig', ['veggie', 'salad'], [], 13, 1.5, 2.2, 0.2, 250, '250 g Pak Choi'),
  lidlItem('sojasprossen', 'Sojasprossen', '', 'obst', 'ganzjaehrig', ['veggie'], [], 30, 3, 6, 0.2, 200, '200 g Sojasprossen'),
  lidlItem('mango', 'Mango', '', 'obst', 'fruehling_sommer', ['salad', 'extra'], [], 60, 0.8, 15, 0.4, 500, '500 g Mango'),
  lidlItem('apfel', 'Äpfel', '', 'obst', 'herbst_winter', ['extra'], [], 52, 0.3, 14, 0.2, 1000, '1 kg Äpfel'),
  lidlItem('banane', 'Bananen', '', 'obst', 'ganzjaehrig', ['extra'], [], 89, 1.1, 23, 0.3, 1000, '1 kg Bananen'),
  lidlItem('heidelbeeren', 'Heidelbeeren', '', 'obst', 'fruehling_sommer', ['extra'], [], 57, 0.7, 14, 0.3, 250, '250 g Heidelbeeren'),
  lidlItem('erdbeeren', 'Erdbeeren', '', 'obst', 'fruehling_sommer', ['extra'], [], 32, 0.7, 7.7, 0.3, 500, '500 g Erdbeeren'),

  /* ---------- Frischfleisch & Fisch ---------- */
  lidlItem('putenbrust', 'Putenbrustfilet', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['huhn'], 105, 24, 0, 1, 500, '500 g Metzgerfrisch Putenbrust'),
  lidlItem('haehnchen_keule', 'Hähnchenkeulen (ohne Haut)', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['huhn'], 120, 19, 0, 5, 1000, '1 kg Metzgerfrisch Keulen'),
  lidlItem('rinder_steak', 'Rinderhüftsteak', 'Metzgerfrisch', 'fleisch', 'ganzjaehrig', ['protein'], ['rind'], 140, 22, 0, 5.5, 300, '300 g Rinderhüftsteak'),
  lidlItem('seelachs', 'Seelachsfilet', 'Ocean Sea', 'fleisch', 'ganzjaehrig', ['protein'], ['fisch'], 90, 19, 0, 1.2, 300, '300 g Ocean Sea Seelachs'),

  /* ---------- Kühlregal ---------- */
  lidlItem('quark', 'Magerquark', 'Milbona', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 67, 12, 4, 0.2, 500, '500 g Milbona Magerquark'),
  lidlItem('mozzarella_light', 'Mozzarella light', 'Milbona', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 170, 22, 1, 9, 125, '125 g Mozzarella light'),
  lidlItem('frischkaese_light', 'Frischkäse light', 'Milbona', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 110, 9, 4, 8, 200, '200 g Frischkäse light'),
  lidlItem('schmand_light', 'Schmand light', 'Milbona', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 120, 4, 4, 11, 200, '200 g Schmand light'),
  lidlItem('eier', 'Eier (Bodenhaltung)', '', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 143, 12.6, 0.7, 9.5, 630, '10 Eier (ca. 630 g)'),
  lidlItem('parmesan', 'Parmesan (gerieben)', 'Deluxe', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 392, 36, 0, 27, 150, '150 g Parmesan'),
  lidlItem('tofu', 'Tofu natur', 'Vantastic', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 76, 8, 1, 4.8, 200, '200 g Tofu natur'),

  /* ---------- Tiefkühltruhe ---------- */
  lidlItem('edamame', 'Edamame (TK)', 'Freshona', 'tk', 'ganzjaehrig', ['veggie', 'extra'], ['vegetarisch'], 121, 11.9, 8.9, 5.2, 400, '400 g Freshona Edamame'),
  lidlItem('erbsen_tk', 'Erbsen (TK)', 'Freshona', 'tk', 'ganzjaehrig', ['veggie'], [], 81, 5.4, 14, 0.4, 400, '400 g Freshona Erbsen'),

  /* ---------- Trockensortiment & Dosen ---------- */
  lidlItem('kichererbsen', 'Kichererbsen (Dose, Abtropfgewicht)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], ['vegetarisch'], 120, 7, 15, 2.5, 240, '240 g Golden Sun Kichererbsen'),
  lidlItem('kidneybohnen', 'Kidneybohnen (Dose, Abtropfgewicht)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], ['vegetarisch'], 110, 7.5, 15, 0.7, 240, '240 g Golden Sun Kidneybohnen'),
  lidlItem('thunfisch', 'Thunfisch in eigenem Saft (Abtropfgewicht)', 'Ocean Sea', 'trocken', 'ganzjaehrig', ['protein'], ['fisch'], 100, 22, 0, 1, 160, '160 g Ocean Sea Thunfisch'),
  lidlItem('mais_dose', 'Mais (Dose, Abtropfgewicht)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['veggie', 'extra'], [], 90, 3.3, 19, 1.5, 285, '285 g Golden Sun Mais'),
  lidlItem('penne', 'Penne (Hartweizen)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['carb'], ['weizen'], 350, 12, 70, 1.5, 500, '500 g Golden Sun Penne'),
  lidlItem('quinoa', 'Quinoa (trocken)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['carb'], [], 368, 14, 64, 6, 500, '500 g Golden Sun Quinoa'),
  lidlItem('bulgur', 'Bulgur (trocken)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['carb'], ['weizen'], 342, 12, 76, 1.3, 500, '500 g Golden Sun Bulgur'),
  lidlItem('tortilla_wraps', 'Weizen-Tortillas (8 Stück)', 'Chef Select', 'trocken', 'ganzjaehrig', ['carb'], ['weizen'], 300, 8, 50, 7.5, 320, '320 g Chef Select Wraps'),
  lidlItem('pesto', 'Pesto Genovese', 'Deluxe', 'kuehl', 'ganzjaehrig', ['extra'], ['vegetarisch'], 480, 5, 5, 47, 190, '190 g Deluxe Pesto'),
  lidlItem('passierte_tomaten', 'Passierte Tomaten', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], [], 32, 1.6, 5.7, 0.2, 500, '500 g Golden Sun Passierte Tomaten'),
  lidlItem('tomatenmark', 'Tomatenmark', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], [], 82, 4.5, 15, 0.5, 200, '200 g Golden Sun Tomatenmark'),
  lidlItem('sojasauce', 'Sojasauce', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], ['weizen'], 60, 8, 5.6, 0.6, 250, '250 ml Golden Sun Sojasauce'),
  lidlItem('sriracha', 'Sriracha-Sauce', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], ['scharf'], 90, 2, 16, 1, 300, '300 ml Golden Sun Sriracha'),
  lidlItem('salsa', 'Salsa (mild bis scharf)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], ['scharf'], 40, 1.5, 7, 0.5, 380, '380 g Golden Sun Salsa'),
  lidlItem('ananas_dose', 'Ananasstücke (Dose, Abtropfgewicht)', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], [], 60, 0.5, 14, 0.1, 340, '340 g Golden Sun Ananas'),
  lidlItem('oliven', 'Oliven (entsteint, Abtropfgewicht)', 'Deluxe', 'trocken', 'ganzjaehrig', ['extra'], [], 145, 1, 4, 15, 150, '150 g Deluxe Oliven'),
  lidlItem('haferflocken', 'Haferflocken', 'Golden Sun', 'trocken', 'ganzjaehrig', ['extra'], [], 370, 13, 59, 7, 500, '500 g Golden Sun Haferflocken'),

  /* ---------- Backshop & Brot ---------- */
  lidlItem('vollkornbrot', 'Vollkornbrot (Scheiben)', 'Lidl Backshop', 'backshop', 'ganzjaehrig', ['carb'], ['weizen'], 250, 9, 40, 3, 500, '500 g Vollkornbrot'),
];

LIDL_CATALOG.push(...LIDL_CATALOG_EXTRA);
LIDL_CATALOG_EXTRA.forEach(item => { CATALOG_BY_ID[item.id] = item; });

/* Beispiel-Angebote dieser Woche – bitte mit dem aktuellen Lidl-Prospekt abgleichen
   (in der App änderbar). */
const DEFAULT_OFFER_IDS = ['huhn_brust', 'paprika', 'zucchini', 'lachs', 'passierte_tomaten', 'mozzarella_light', 'kichererbsen', 'tofu'];

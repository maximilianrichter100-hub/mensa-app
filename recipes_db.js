/* ==========================================================================
   recipes_db.js – 36 ausgeschriebene Rezepte + Speicherlogik für eigene Rezepte
   Mengen (g) in den Komponenten gelten für eine Referenzperson mit 45 g Protein
   pro Hauptmahlzeit. app.js skaliert Kohlenhydrate, Gemüse, Salat und Extras
   individuell; das Hauptprotein wird exakt auf das Ziel der Person berechnet.
   Kategorien: gefluegel | fisch | rind | tiktok
   Saisons:    herbst_winter | fruehling_sommer | all
   ========================================================================== */

const RECIPE_CATEGORIES = {
  gefluegel: 'Geflügel',
  fisch: 'Fisch',
  rind: 'Rind & Schwein',
  tiktok: 'TikTok / Trend'
};

const RECIPE_SEASONS = {
  herbst_winter: '🍂 Herbst / Winter',
  fruehling_sommer: '☀️ Frühling / Sommer',
  all: '🌍 Ganzjährig'
};

/* Kurzform für Komponenten-Aufbau: R({...}) erzeugt das Rezept-Objekt */
function R(o) {
  return {
    id: o.id,
    title: o.t,
    category: o.cat,
    season: o.s,
    prepTime: o.prep,
    components: {
      protein: { id: o.p },
      carb: { id: o.carb[0], g: o.carb[1] },
      veggie: { id: o.veg[0], g: o.veg[1] },
      salad: { id: o.salad[0], g: o.salad[1] },
      extras: (o.extras || []).map(e => ({ id: e[0], g: e[1] }))
    },
    steps: o.steps
  };
}

const RECIPES = [
  /* ===================== 🍂 HERBST / WINTER (Kürbis-Fokus) ===================== */
  R({
    id: 'r01', t: 'Herbst-Ofenblech: Crispy Chicken mit Hokkaido, Brokkoli, Kräuter-Skyr & Feldsalat',
    cat: 'gefluegel', s: 'herbst_winter', prep: 35, p: 'huhn_innen',
    carb: ['kuerbis_hokkaido', 200], veg: ['brokkoli', 150], salad: ['feldsalat', 60], extras: [['skyr', 40]],
    steps: [
      'Backofen auf 200 °C Ober-/Unterhitze vorheizen. Hokkaido ungeschält waschen, entkernen und in 2 cm dicke Spalten schneiden.',
      'Kürbisspalten mit 1 EL Rapsöl, Paprikapulver, Salz und Pfeffer mischen und 20 Minuten auf dem Blech vorgaren.',
      'Hähnchen-Innenfilets würzen, mit den TK-Brokkoliröschen zum Kürbis legen und 15 Minuten weitergaren, bis das Fleisch durch ist (Kerntemperatur 72 °C).',
      'Skyr mit gehackten Kräutern, Zitronenabrieb und Salz verrühren. Feldsalat waschen, alles anrichten und den Skyr als Klecks daneben setzen.'
    ]
  }),
  R({
    id: 'r02', t: 'Cremige Kürbis-Gnocchi-Pfanne mit Hähnchenbrust, Babyspinat & Rote-Bete-Salat',
    cat: 'gefluegel', s: 'herbst_winter', prep: 25, p: 'huhn_brust',
    carb: ['gnocchi', 150], veg: ['spinat', 100], salad: ['rote_bete', 80], extras: [['kuerbis_hokkaido', 120], ['huettenkaese', 60]],
    steps: [
      'Hähnchenbrustfilet in Würfel schneiden, salzen, pfeffern und in einer beschichteten Pfanne in 1 TL Öl rundum goldbraun braten. Herausnehmen.',
      'Kürbiswürfel in der Pfanne 8 Minuten mit einem Schluck Wasser weich schmoren, Gnocchi dazugeben und 4 Minuten braten.',
      'Hüttenkäse mit etwas Gemüsebrühe, Muskat und Salz pürieren und als Sauce unter die Gnocchi rühren. Babyspinat und Hähnchen kurz mitschwenken.',
      'Rote-Bete-Salat aus dem Glas abtropfen lassen und als Beilage zur Pfanne servieren.'
    ]
  }),
  R({
    id: 'r03', t: 'TikTok Stuffed Hokkaido mit Rinderhack light, Reis, Feta light & Krautsalat',
    cat: 'tiktok', s: 'herbst_winter', prep: 30, p: 'hack',
    carb: ['reis', 100], veg: ['kuerbis_hokkaido', 200], salad: ['krautsalat', 80], extras: [['feta', 25]],
    steps: [
      'Hokkaido halbieren, Kerne mit einem Löffel entfernen. Die Hälften mit Öl und Salz einreiben und 25 Minuten bei 200 °C backen.',
      'Reis nach Packungsanleitung garen. Rinderhack in einer Pfanne krümelig braten, würzen und mit dem Reis vermengen.',
      'Die gebackenen Kürbishälften mit der Hack-Reis-Mischung füllen, Feta light darüber bröseln und 5 Minuten zurück in den Ofen geben.',
      'Krautsalat dazu servieren, eventuell mit Pfeffer und Apfelessig nachwürzen.'
    ]
  }),
  R({
    id: 'r04', t: 'Honig-Senf-Lachs vom Blech mit Ofen-Kürbis, Kartoffeln, Prinzessbohnen & Gurkensalat',
    cat: 'fisch', s: 'herbst_winter', prep: 30, p: 'lachs',
    carb: ['kartoffel', 150], veg: ['bohnen', 150], salad: ['gurkensalat', 70], extras: [['skyr', 40]],
    steps: [
      'Kartoffeln halbieren, mit Öl und Rosmarin auf das Blech geben und 15 Minuten bei 200 °C vorgaren.',
      'Skyr mit Dijon-Senf und einem Teelöffel Honig verrühren. Lachsfilets salzen und mit der Senf-Skyr-Masse bestreichen.',
      'Lachs und TK-Prinzessbohnen auf das Blech zu den Kartoffeln legen und weitere 12 bis 15 Minuten garen.',
      'Gurkensalat aus dem Glas danebenlegen und alles direkt vom Blech servieren.'
    ]
  }),
  R({
    id: 'r05', t: 'Deftige Spitzkohl-Hack-Pfanne mit Kümmel-Kartoffeln, Skyr-Klecks & Rote-Bete-Apfel-Salat',
    cat: 'rind', s: 'herbst_winter', prep: 25, p: 'hack',
    carb: ['kartoffel', 150], veg: ['spitzkohl', 200], salad: ['rote_bete', 60], extras: [['skyr', 40]],
    steps: [
      'Kartoffeln in Scheiben schneiden, mit Kümmel und Salz in der Pfanne mit etwas Öl 15 Minuten knusprig braten.',
      'Spitzkohl in feine Streifen schneiden und zu den Kartoffeln geben, 5 Minuten mitgaren.',
      'Rinderhack krümelig anbraten, würzen und unter das Gemüse mischen, bis alles durchgegart ist.',
      'Mit Skyr und dem Rote-Bete-Salat servieren; wer mag, streut frische Apfelwürfel darüber.'
    ]
  }),
  R({
    id: 'r06', t: 'Kürbis-Kokos-Red-Curry mit Hähnchen & Garnelen, Jasminreis, Asia-Gemüse & Eisbergsalat',
    cat: 'gefluegel', s: 'herbst_winter', prep: 25, p: 'huhn_innen',
    carb: ['reis', 100], veg: ['asia_tk', 150], salad: ['eisberg', 60],
    extras: [['garnele', 45], ['kokosmilch', 100], ['currypaste', 15], ['kuerbis_hokkaido', 100]],
    steps: [
      'Jasminreis nach Packungsanleitung garen. Hokkaido in kleine Würfel schneiden.',
      'Currypaste in einem Topf kurz anrösten, Kokosmilch dazugeben und mit Kürbiswürfeln 10 Minuten köcheln lassen.',
      'Hähnchen-Innenfilets und Garnelen in Stücke schneiden, in die Sauce geben und 6 Minuten garziehen lassen.',
      'Asia-Gemüse aus der Tiefkühltruhe zugeben, mit Jasminreis und Eisbergsalat (in Streifen) servieren.'
    ]
  }),
  R({
    id: 'r07', t: 'Süßkartoffel-Kürbis-Mash mit knusprigen Rinderhack-Bällchen, Brokkoli & Feldsalat',
    cat: 'rind', s: 'herbst_winter', prep: 25, p: 'hack',
    carb: ['suesskartoffel', 180], veg: ['brokkoli', 150], salad: ['feldsalat', 60], extras: [['kuerbis_hokkaido', 100]],
    steps: [
      'Süßkartoffeln und Kürbiswürfel schälen bzw. schneiden, in Salzwasser 15 Minuten weich kochen.',
      'Abgießen, mit einem Stampfer zu Mash verarbeiten, mit Muskat, Salz und einem Schuss Wasser cremig rühren.',
      'Rinderhack mit Salz, Pfeffer und Paprika zu kleinen Bällchen formen und in der Pfanne rundum knusprig braten.',
      'TK-Brokkoli dämpfen, mit Feldsalat auf den Mash und die Bällchen anrichten.'
    ]
  }),
  R({
    id: 'r08', t: 'Kürbis-Linsen-Bowl vegetarisch mit Skyr, Babyspinat & Rote Bete',
    cat: 'tiktok', s: 'herbst_winter', prep: 25, p: 'linsen',
    carb: ['kuerbis_hokkaido', 200], veg: ['spinat', 120], salad: ['rote_bete', 60], extras: [['skyr', 60]],
    steps: [
      'Rote Linsen mit der doppelten Menge Wasser aufkochen und 10 bis 12 Minuten weich köcheln, dann abgießen.',
      'Hokkaido-Würfel im Ofen bei 200 °C mit Öl und Kreuzkümmel 20 Minuten rösten.',
      'Babyspinat kurz in der Pfanne zusammenfallen lassen, mit Salz und Zitrone würzen.',
      'Linsen, Kürbis und Spinat in eine Schüssel geben, Skyr als Klecks obendrauf und Rote-Bete-Salat dazu.'
    ]
  }),
  R({
    id: 'r09', t: 'Schweinefilet-Ofenblech mit Kartoffeln, Rosenkohl & Krautsalat',
    cat: 'rind', s: 'herbst_winter', prep: 30, p: 'schwein',
    carb: ['kartoffel', 150], veg: ['rosenkohl', 150], salad: ['krautsalat', 80],
    steps: [
      'Ofen auf 190 °C Ober-/Unterhitze vorheizen. Kartoffeln vierteln, mit Öl, Thymian und Salz würzen und 15 Minuten vorbacken.',
      'Rosenkohl putzen, halbieren und mit auf das Blech geben.',
      'Schweinefilet mit Salz, Pfeffer und Senf einreiben, in die Mitte des Blechs legen und 15 bis 18 Minuten garen (Kern 62 °C).',
      'Filet 5 Minuten ruhen lassen, in Scheiben schneiden und mit Kartoffeln, Rosenkohl und Krautsalat servieren.'
    ]
  }),
  R({
    id: 'r10', t: 'Butternut-Hähnchen-Curry-Bowl mit Reis & Gurkensalat',
    cat: 'gefluegel', s: 'herbst_winter', prep: 25, p: 'huhn_brust',
    carb: ['reis', 100], veg: ['butternut', 200], salad: ['gurkensalat', 60], extras: [['kokosmilch', 60], ['currypaste', 15]],
    steps: [
      'Butternut schälen, entkernen und in 2 cm große Würfel schneiden. In der Pfanne mit Öl 8 Minuten anbraten.',
      'Hähnchenbrust in Streifen schneiden und zum Kürbis geben, mit Currypaste würzen und mitbraten.',
      'Kokosmilch angießen und 8 Minuten köcheln, bis Kürbis weich und das Hähnchen durch ist.',
      'Reis garen, mit dem Curry in Bowls anrichten und den Gurkensalat dazu essen.'
    ]
  }),
  R({
    id: 'r11', t: 'Hähnchen-Rosenkohl-Pfanne mit Drillingen & Krautsalat',
    cat: 'gefluegel', s: 'herbst_winter', prep: 30, p: 'huhn_innen',
    carb: ['drillinge', 150], veg: ['rosenkohl', 150], salad: ['krautsalat', 60], extras: [['skyr', 50]],
    steps: [
      'Drillinge halbieren und in der Pfanne mit Öl und Salz 12 Minuten braten, bis sie außen knusprig sind.',
      'Rosenkohl putzen, halbieren und dazugeben, weitere 6 Minuten braten.',
      'Hähnchen-Innenfilets würzen, in einer zweiten Pfanne rundum braten, in Stücke schneiden und zurück in die Pfanne geben.',
      'Mit Krautsalat und einem Klecks Skyr mit Zitrone servieren.'
    ]
  }),
  R({
    id: 'r12', t: 'Lachs-Rosenkohl mit Reisbandnudeln & Asia-Dressing',
    cat: 'tiktok', s: 'herbst_winter', prep: 20, p: 'lachs',
    carb: ['reisnudeln', 100], veg: ['rosenkohl', 150], salad: ['gurkensalat', 60], extras: [],
    steps: [
      'Reisbandnudeln nach Packungsanleitung garen, abgießen und kalt abschrecken.',
      'Rosenkohl halbieren und in der Pfanne 8 Minuten braten, bis er Röstaromen hat.',
      'Lachsfilet in der Pfanne mit der Hautseite zuerst 4 Minuten braten, wenden und weitere 2 Minuten garen.',
      'Nudeln mit Rosenkohl und Lachs mischen; Dressing aus Sojasauce, Limette und Honig darüberträufeln, Gurkensalat dazu.'
    ]
  }),
  R({
    id: 'r13', t: 'Rinderhack-Kartoffel-Auflauf mit Champignons & Spinat',
    cat: 'rind', s: 'herbst_winter', prep: 35, p: 'hack',
    carb: ['kartoffel', 200], veg: ['spinat', 120], salad: ['feldsalat', 50], extras: [['champignons', 60], ['huettenkaese', 60]],
    steps: [
      'Ofen auf 190 °C vorheizen. Kartoffeln in dünne Scheiben hobeln und in einer Auflaufform schichten.',
      'Champignons in Scheiben braten, Rinderhack dazugeben, würzen und krümelig durchbraten.',
      'Hack, Champignons und Spinat auf die Kartoffeln schichten, Hüttenkäse mit etwas Brühe pürieren und darübergeben.',
      '25 bis 30 Minuten backen, bis die Kartoffeln weich sind. Mit Feldsalat servieren.'
    ]
  }),
  R({
    id: 'r14', t: 'Garnelen-Kürbis-Pfanne mit Spinat & Feta',
    cat: 'fisch', s: 'herbst_winter', prep: 20, p: 'garnele',
    carb: ['kuerbis_hokkaido', 200], veg: ['spinat', 120], salad: ['feldsalat', 50], extras: [['feta', 20]],
    steps: [
      'Hokkaido in Würfel schneiden und in der Pfanne mit Öl 10 Minuten braten, bis er Biss hat.',
      'Garnelen salzen, zum Kürbis geben und 2 bis 3 Minuten braten, bis sie rosa sind.',
      'Babyspinat dazugeben und kurz zusammenfallen lassen; Feta light darüber bröseln.',
      'Mit Feldsalat und einer Zitronen-Vinaigrette servieren.'
    ]
  }),
  R({
    id: 'r15', t: 'Hokkaido-Hähnchen-Traybake mit Brokkoli, Feta & Feldsalat',
    cat: 'gefluegel', s: 'herbst_winter', prep: 35, p: 'huhn_brust',
    carb: ['kuerbis_hokkaido', 200], veg: ['brokkoli', 150], salad: ['feldsalat', 60], extras: [['feta', 30]],
    steps: [
      'Ofen auf 200 °C vorheizen. Hokkaido in Spalten und Hähnchenbrust in grobe Stücke schneiden.',
      'Alles mit Öl, Thymian, Knoblauchpulver und Salz auf einem Blech verteilen und 20 Minuten backen.',
      'TK-Brokkoli für die letzten 8 Minuten dazugeben und mitbacken.',
      'Feta light zerbröseln, über das Blech streuen und mit Feldsalat servieren.'
    ]
  }),
  R({
    id: 'r16', t: 'Kartoffel-Hack-Pfanne mit Paprika & Krautsalat',
    cat: 'rind', s: 'all', prep: 20, p: 'hack',
    carb: ['drillinge', 150], veg: ['paprika', 150], salad: ['krautsalat', 60], extras: [['skyr', 40]],
    steps: [
      'Drillinge halbieren und in der Pfanne mit Öl 10 Minuten knusprig braten.',
      'Paprika in Streifen schneiden und 5 Minuten mitbraten.',
      'Rinderhack zugeben, krümelig braten, würzen und alles vermengen.',
      'Mit Krautsalat und Skyr-Klecks servieren.'
    ]
  }),

  /* ===================== ☀️ FRÜHLING / SOMMER & GANZJÄHRIG ===================== */
  R({
    id: 'r17', t: 'Crispy Cornflakes Chicken Bowl mit Reis, Zucchini, Tomaten & Skyr-Dip',
    cat: 'gefluegel', s: 'all', prep: 20, p: 'cornflakes_chicken',
    carb: ['reis', 100], veg: ['zucchini', 150], salad: ['tomaten', 80], extras: [['skyr', 60]],
    steps: [
      'Reis nach Packungsanleitung garen. Zucchini in Halbmonde schneiden.',
      'Cornflakes Chicken im Ofen bei 200 °C 15 Minuten knusprig garen, bis es durch ist.',
      'Zucchini in der Pfanne mit Öl 5 Minuten anbraten und salzen.',
      'Skyr mit Knoblauchpulver, Salz und Schnittlauch verrühren. Alles in einer Bowl mit Tomaten anrichten.'
    ]
  }),
  R({
    id: 'r18', t: 'TikTok Salmon Bowl mit Reis, Asia-Gemüse & Gurkensalat',
    cat: 'tiktok', s: 'all', prep: 15, p: 'lachs',
    carb: ['reis', 100], veg: ['asia_tk', 150], salad: ['gurkensalat', 60], extras: [['skyr', 60]],
    steps: [
      'Reis garen. Asia-Gemüse aus der Tiefkühltruhe direkt in der Pfanne mit Öl 5 Minuten braten.',
      'Lachsfilet würzen und in der Pfanne 3 Minuten pro Seite braten.',
      'Skyr mit Sojasauce und Sesamöl verrühren, als Sauce auf die Bowl geben.',
      'Reis, Gemüse, Lachs und Gurkensalat schichtweise in der Bowl anrichten.'
    ]
  }),
  R({
    id: 'r19', t: 'Creamy Chicken Gnocchi mit Spinat & Tomaten',
    cat: 'gefluegel', s: 'all', prep: 20, p: 'huhn_brust',
    carb: ['gnocchi', 150], veg: ['spinat', 120], salad: ['tomaten', 60], extras: [['huettenkaese', 60]],
    steps: [
      'Hähnchenbrust in Würfel schneiden, würzen und in der Pfanne goldbraun braten.',
      'Gnocchi in einer zweiten Pfanne mit Öl 5 Minuten knusprig braten.',
      'Hüttenkäse mit einem Schuss Wasser, Knoblauch und Salz zur cremigen Sauce pürieren und in die Pfanne geben.',
      'Babyspinat unterrühren, Hähnchen zugeben und mit halbierten Tomaten servieren.'
    ]
  }),
  R({
    id: 'r20', t: 'Big Mac Auflauf mit Kartoffeln, Paprika & Eisbergsalat',
    cat: 'tiktok', s: 'all', prep: 35, p: 'hack',
    carb: ['kartoffel', 150], veg: ['paprika', 150], salad: ['eisberg', 60], extras: [['skyr', 60]],
    steps: [
      'Kartoffeln in Scheiben schneiden und in Salzwasser 8 Minuten vorgaren; abgießen.',
      'Rinderhack mit Paprika und Zwiebel anbraten. Skyr mit Senf, Gurkenwürfeln und Essig als Big-Mac-Sauce anrühren.',
      'Kartoffeln, Hack und Paprika in eine Form schichten, Sauce darübergeben.',
      '25 Minuten bei 200 °C backen und mit Eisbergsalat-Streifen servieren.'
    ]
  }),
  R({
    id: 'r21', t: 'Crispy Rice Salad mit Garnelen, Spargel & Gurkensalat',
    cat: 'fisch', s: 'fruehling_sommer', prep: 20, p: 'garnele',
    carb: ['reis', 100], veg: ['spargel', 150], salad: ['gurkensalat', 80], extras: [['skyr', 40]],
    steps: [
      'Reis garen, abkühlen lassen und in einer Pfanne mit etwas Öl knusprig anbraten.',
      'Spargel schräg in Stücke schneiden und 4 Minuten mit den Garnelen braten.',
      'Garnelen salzen und zitronig abschmecken.',
      'Reis mit Spargel und Garnelen mischen, Skyr mit Zitrone als Dip und Gurkensalat dazu.'
    ]
  }),
  R({
    id: 'r22', t: 'Souvlaki-Blech mit Drillingen, Paprika & Gurkensalat',
    cat: 'gefluegel', s: 'fruehling_sommer', prep: 30, p: 'huhn_brust',
    carb: ['drillinge', 150], veg: ['paprika', 150], salad: ['gurkensalat', 80], extras: [['skyr', 60]],
    steps: [
      'Hähnchenbrust in Würfel schneiden und mit Olivenöl, Oregano, Knoblauch und Zitrone 20 Minuten marinieren.',
      'Drillinge und Paprikastücke auf das Blech legen, mit Öl und Salz würzen.',
      'Hähnchen-Spieße auf das Blech geben und alles 20 Minuten bei 220 °C backen.',
      'Mit Gurkensalat und einem Skyr-Dip mit Gurke und Knoblauch servieren.'
    ]
  }),
  R({
    id: 'r23', t: 'Grüner-Spargel-Hähnchen-Pfanne mit Drillingen & Tomaten',
    cat: 'gefluegel', s: 'fruehling_sommer', prep: 25, p: 'huhn_innen',
    carb: ['drillinge', 150], veg: ['spargel', 200], salad: ['tomaten', 60], extras: [['feta', 20]],
    steps: [
      'Drillinge halbieren und in der Pfanne mit Öl 12 Minuten braten, bis sie gar sind.',
      'Holzende vom Spargel brechen, Stangen halbieren und 5 Minuten mitbraten.',
      'Hähnchen-Innenfilets würzen und in einer zweiten Pfanne rundum goldbraun braten.',
      'Alles zusammen anrichten, Tomaten dazulegen und Feta light darüber bröseln.'
    ]
  }),
  R({
    id: 'r24', t: 'Zucchini-Lachs-Ofen mit Kartoffeln, Eisbergsalat & Skyr-Dip',
    cat: 'fisch', s: 'fruehling_sommer', prep: 30, p: 'lachs',
    carb: ['kartoffel', 150], veg: ['zucchini', 200], salad: ['eisberg', 60], extras: [['skyr', 40]],
    steps: [
      'Kartoffeln in Spalten auf das Blech legen, mit Öl und Salz würzen und 15 Minuten bei 200 °C vorbacken.',
      'Zucchini in Scheiben und Lachsfilets dazu auf das Blech legen, mit Zitronenscheiben belegen.',
      'Alles weitere 12 Minuten backen, bis der Lachs in der Mitte noch saftig ist.',
      'Skyr mit Dill und Salz verrühren und mit Eisbergsalat als Beilage servieren.'
    ]
  }),
  R({
    id: 'r25', t: 'Hack-Grillspieße mit Reis, Paprika & Tomatensalat',
    cat: 'rind', s: 'fruehling_sommer', prep: 25, p: 'hack',
    carb: ['reis', 100], veg: ['paprika', 150], salad: ['tomaten', 80], extras: [['skyr', 40]],
    steps: [
      'Rinderhack mit Paprikapulver, Kreuzkümmel und Salz würzen und zu länglichen Spießen formen.',
      'Paprikastücke auf Holzspieße stecken und mit den Hack-Spießen auf dem Grill oder in der Grillpfanne garen.',
      'Reis nach Packungsanleitung garen.',
      'Mit Tomatensalat, Reis und Skyr-Dip servieren.'
    ]
  }),
  R({
    id: 'r26', t: 'Sommer-Garnelen-Pfanne mit Reisnudeln, Zucchini & Feta',
    cat: 'fisch', s: 'fruehling_sommer', prep: 15, p: 'garnele',
    carb: ['reisnudeln', 100], veg: ['zucchini', 150], salad: ['tomaten', 80], extras: [['feta', 20]],
    steps: [
      'Reisnudeln nach Packungsanleitung garen und abgießen.',
      'Zucchini in Streifen in der Pfanne mit Öl 4 Minuten braten.',
      'Garnelen zugeben, 3 Minuten braten und mit Salz, Chili und Limette würzen.',
      'Nudeln untermischen, mit halbierten Tomaten und Feta light servieren.'
    ]
  }),
  R({
    id: 'r27', t: 'Caprese-Hähnchen mit Drillingen, Zucchini & Tomaten',
    cat: 'gefluegel', s: 'fruehling_sommer', prep: 25, p: 'huhn_brust',
    carb: ['drillinge', 150], veg: ['zucchini', 150], salad: ['tomaten', 100], extras: [['feta', 25]],
    steps: [
      'Drillinge halbieren und mit Öl und Salz 15 Minuten im Ofen bei 200 °C backen.',
      'Hähnchenbrust in Scheiben schneiden, würzen und mit Zucchini in der Pfanne 8 Minuten braten.',
      'Tomaten halbieren, mit Feta light und Basilikum vermengen.',
      'Hähnchen auf den Drillingen anrichten, Tomaten-Feta-Salat daneben servieren.'
    ]
  }),
  R({
    id: 'r28', t: 'Express-Hähnchen-Wok mit Asia-Gemüse & Reis',
    cat: 'gefluegel', s: 'all', prep: 15, p: 'huhn_innen',
    carb: ['reis', 100], veg: ['asia_tk', 200], salad: ['gurkensalat', 60], extras: [],
    steps: [
      'Reis nach Packungsanleitung garen.',
      'Hähnchen-Innenfilets in Streifen schneiden und im heißen Wok mit Öl 4 Minuten braten.',
      'Asia-Gemüse aus der Tiefkühltruhe zugeben und 4 Minuten mitbraten; mit Sojasauce abschmecken.',
      'Mit Reis und Gurkensalat servieren.'
    ]
  }),
  R({
    id: 'r29', t: 'Lachs-Spargel-Blech mit Kartoffeln & Feldsalat',
    cat: 'fisch', s: 'fruehling_sommer', prep: 30, p: 'lachs',
    carb: ['kartoffel', 150], veg: ['spargel', 200], salad: ['feldsalat', 60], extras: [['huettenkaese', 50]],
    steps: [
      'Kartoffeln vierteln und mit Öl und Salz 15 Minuten bei 200 °C vorbacken.',
      'Spargel unten schälen, zu den Kartoffeln geben und weitere 5 Minuten backen.',
      'Lachsfilets salzen, zu Gemüse und Kartoffeln legen und 10 Minuten fertig garen.',
      'Hüttenkäse mit Zitrone und Dill verrühren, zusammen mit dem Feldsalat servieren.'
    ]
  }),
  R({
    id: 'r30', t: 'Express-Rinderhack-Reispfanne mit Paprika & Gurkensalat',
    cat: 'rind', s: 'all', prep: 15, p: 'hack',
    carb: ['reis', 100], veg: ['paprika', 120], salad: ['gurkensalat', 60], extras: [['skyr', 40]],
    steps: [
      'Reis in der Pfanne mit Wasser nach Packungsanleitung garen; währenddessen Paprika in Würfel schneiden.',
      'Rinderhack in einer zweiten Pfanne krümelig braten, Paprika dazugeben und 3 Minuten mitgaren.',
      'Reis unterheben, mit Salz, Paprika und Kreuzkümmel abschmecken.',
      'Mit Gurkensalat und einem Klecks Skyr servieren.'
    ]
  }),
  R({
    id: 'r31', t: 'Express-Garnelen-Wok mit Asia-Gemüse & Reisnudeln',
    cat: 'fisch', s: 'all', prep: 12, p: 'garnele',
    carb: ['reisnudeln', 100], veg: ['asia_tk', 150], salad: ['tomaten', 60], extras: [],
    steps: [
      'Reisnudeln mit kochendem Wasser übergießen und 4 Minuten ziehen lassen, abgießen.',
      'Garnelen im heißen Wok mit Öl 2 Minuten braten, salzen.',
      'Asia-Gemüse aus der Tiefkühltruhe und Sojasauce dazu, 4 Minuten mitbraten.',
      'Nudeln untermischen und mit Tomaten servieren.'
    ]
  }),
  R({
    id: 'r32', t: 'Express-Hähnchen-Bowl mit Spinat & Eisbergsalat',
    cat: 'gefluegel', s: 'all', prep: 15, p: 'huhn_innen',
    carb: ['reis', 100], veg: ['spinat', 120], salad: ['eisberg', 60], extras: [['skyr', 40]],
    steps: [
      'Reis garen. Hähnchen-Innenfilets in dünne Scheiben schneiden und würzen.',
      'Hähnchen in der Pfanne mit Öl 5 Minuten braten.',
      'Babyspinat kurz in die Pfanne geben, bis er zusammenfällt.',
      'Reis, Hähnchen-Spinat und Eisbergsalat in der Bowl anrichten, Skyr mit Zitrone als Dip dazu.'
    ]
  }),
  R({
    id: 'r33', t: 'Schweinefilet mit Ofen-Zucchini, Drillingen & Skyr-Dip',
    cat: 'rind', s: 'fruehling_sommer', prep: 30, p: 'schwein',
    carb: ['drillinge', 150], veg: ['zucchini', 150], salad: ['gurkensalat', 60], extras: [['skyr', 50]],
    steps: [
      'Drillinge halbieren, mit Öl und Rosmarin auf das Blech legen und 15 Minuten bei 200 °C vorbacken.',
      'Zucchini in Stücke schneiden und mit auf das Blech geben.',
      'Schweinefilet würzen, auf das Blech legen und 15 bis 18 Minuten garen, bis der Kern 62 °C hat.',
      'Filet ruhen lassen, aufschneiden und mit Skyr-Dip und Gurkensalat servieren.'
    ]
  }),
  R({
    id: 'r34', t: 'Teriyaki-Lachs-Reis mit Asia-Gemüse & Gurkensalat',
    cat: 'tiktok', s: 'all', prep: 20, p: 'lachs',
    carb: ['reis', 100], veg: ['asia_tk', 150], salad: ['gurkensalat', 60], extras: [],
    steps: [
      'Reis garen. Lachsfilet in Würfel schneiden.',
      'Lachs in der Pfanne mit Öl 3 Minuten braten, mit Sojasauce und Honig glasieren.',
      'Asia-Gemüse aus der Tiefkühltruhe in einer zweiten Pfanne 5 Minuten braten.',
      'Reis, Gemüse, Lachs und Gurkensalat in der Bowl anrichten.'
    ]
  }),
  R({
    id: 'r35', t: 'Sommer-Linsen-Bowl mit Zucchini, Tomaten & Feta',
    cat: 'tiktok', s: 'fruehling_sommer', prep: 25, p: 'linsen',
    carb: ['reis', 80], veg: ['zucchini', 150], salad: ['tomaten', 80], extras: [['feta', 30]],
    steps: [
      'Rote Linsen in Wasser 10 bis 12 Minuten weich kochen und abgießen.',
      'Reis nach Packungsanleitung garen.',
      'Zucchini in Würfeln in der Pfanne mit Öl 5 Minuten braten; Tomaten halbieren.',
      'Linsen, Reis und Gemüse in der Bowl mischen; Feta light zerbröseln und mit Zitronen-Dressing servieren.'
    ]
  }),
  R({
    id: 'r36', t: 'Chili-Hack-Bowl mit Paprika, Eisbergsalat & Hüttenkäse-Dip',
    cat: 'rind', s: 'all', prep: 20, p: 'hack',
    carb: ['reis', 100], veg: ['paprika', 150], salad: ['eisberg', 60], extras: [['currypaste', 15], ['huettenkaese', 50]],
    steps: [
      'Reis nach Packungsanleitung garen.',
      'Rinderhack in der Pfanne krümelig braten, Paprikawürfel dazugeben und 5 Minuten mitbraten.',
      'Currypaste unterrühren und kurz mitrösten, bis es aromatisch duftet.',
      'Hüttenkäse mit Salz und Limette pürieren; alles mit Reis und Eisbergsalat in der Bowl anrichten.'
    ]
  })
];

/* ---------- Speicherlogik für eigene Nutzer-Rezepte (localStorage) ---------- */

const CUSTOM_RECIPES_KEY = 'mensa.v3.customRecipes';

function loadCustomRecipes() {
  try {
    const list = JSON.parse(localStorage.getItem(CUSTOM_RECIPES_KEY) || '[]');
    return Array.isArray(list) ? list.filter(r => r && r.id && r.components) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomRecipe(recipe) {
  try {
    const list = loadCustomRecipes().filter(r => r.id !== recipe.id);
    list.push({ ...recipe, custom: true });
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

function deleteCustomRecipe(id) {
  try {
    const list = loadCustomRecipes().filter(r => r.id !== id);
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

/* Leitet Merkmale ab: Tags aus allen Zutaten, Weizenfrei-Status, Protein-Tags */
function enrichRecipe(r) {
  const c = r.components;
  c.extras = c.extras || [];
  const uses = [c.protein.id, c.carb.id, c.veggie.id, c.salad.id, ...c.extras.map(e => e.id)];
  const tags = [...new Set(uses.flatMap(id => (CATALOG_BY_ID[id] ? CATALOG_BY_ID[id].tags : [])))];
  const proteinTags = CATALOG_BY_ID[c.protein.id] ? CATALOG_BY_ID[c.protein.id].tags : [];
  return {
    ...r,
    custom: !!r.custom,
    uses,
    tags,
    proteinTags,
    wheatFree: !tags.includes('weizen')
  };
}

/* Alle Rezepte: Basis-Datenbank + eigene Rezepte aus dem localStorage */
function getAllRecipes() {
  return [...RECIPES, ...loadCustomRecipes()].map(enrichRecipe);
}

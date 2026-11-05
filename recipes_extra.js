/* ==========================================================================
   recipes_extra.js – 23 weitere ausgeschriebene Rezepte (r37–r59)
   Themen (italienisch, asiatisch, mexikanisch, grill, herbst, vegetarisch)
   werden in app.js aus Titel und Protein abgeleitet.
   Lädt NACH recipes_db.js (nutzt die Funktion R()).
   ========================================================================== */

RECIPES.push(
  R({
    id: 'r37', t: 'Italienische Hähnchen-Penne mit Zucchini, Tomaten & Parmesan',
    cat: 'gefluegel', s: 'all', prep: 20, p: 'huhn_brust',
    carb: ['penne', 100], veg: ['zucchini', 150], salad: ['rucola', 40],
    extras: [['passierte_tomaten', 120], ['parmesan', 15]],
    steps: [
      'Penne in reichlich Salzwasser nach Packungsanleitung al dente kochen, abgießen und ein Tässchen Kochwasser aufheben.',
      'Hähnchenbrust in Würfel schneiden, würzen und in der Pfanne mit Olivenöl goldbraun braten.',
      'Zucchini-Würfel dazugeben, 4 Minuten mitbraten, dann passierte Tomaten und etwas Kochwasser einrühren.',
      'Penne untermischen, mit Parmesan bestreuen und auf Rucola servieren.'
    ]
  }),
  R({
    id: 'r38', t: 'Pasta-Garnelen-Pfanne mit Spinat & Kirschtomaten',
    cat: 'fisch', s: 'all', prep: 15, p: 'garnele',
    carb: ['penne', 100], veg: ['spinat', 120], salad: ['tomaten', 60],
    extras: [['passierte_tomaten', 100]],
    steps: [
      'Penne nach Packungsanleitung kochen und abgießen.',
      'Garnelen in der Pfanne mit etwas Öl und Knoblauchpulver 2 Minuten braten, salzen und herausnehmen.',
      'Passierte Tomaten in die Pfanne geben, aufkochen, Babyspinat einrühren, bis er zusammenfällt.',
      'Penne, Garnelen und halbierte Tomaten untermischen und sofort servieren.'
    ]
  }),
  R({
    id: 'r39', t: 'Caprese-Hähnchen-Penne mit Mozzarella light & Rucola',
    cat: 'gefluegel', s: 'all', prep: 25, p: 'huhn_brust',
    carb: ['penne', 100], veg: ['paprika', 150], salad: ['rucola', 40],
    extras: [['mozzarella_light', 60], ['passierte_tomaten', 100]],
    steps: [
      'Penne kochen. Hähnchenbrust in Streifen schneiden und mit Oregano und Salz würzen.',
      'Hähnchen in der Pfanne braten, Paprikastreifen dazugeben und 5 Minuten mitgaren.',
      'Passierte Tomaten angießen, 3 Minuten köcheln, Penne unterheben.',
      'Mozzarella light in Würfel schneiden, über die Pasta geben und auf Rucola servieren.'
    ]
  }),
  R({
    id: 'r40', t: 'Lasagne-Style Gnocchi-Auflauf mit Hack, Spinat & Mozzarella',
    cat: 'rind', s: 'all', prep: 30, p: 'hack',
    carb: ['gnocchi', 150], veg: ['spinat', 120], salad: ['rucola', 40],
    extras: [['passierte_tomaten', 120], ['mozzarella_light', 50]],
    steps: [
      'Ofen auf 200 °C vorheizen. Rinderhack in der Pfanne krümelig braten, würzen und mit passierten Tomaten 5 Minuten köcheln.',
      'Gnocchi und Babyspinat in eine Auflaufform schichten, Hack-Tomaten-Sauce darüber verteilen.',
      'Mozzarella light in Scheiben auf den Auflauf legen.',
      '20 Minuten backen, bis der Käse goldbraun ist. Mit Rucola servieren.'
    ]
  }),
  R({
    id: 'r41', t: 'Thunfisch-Pizza-Bowl mit Mais, Paprika & Rucola',
    cat: 'fisch', s: 'all', prep: 15, p: 'thunfisch',
    carb: ['reis', 100], veg: ['paprika', 150], salad: ['rucola', 40],
    extras: [['passierte_tomaten', 80], ['mozzarella_light', 40], ['mais_dose', 30]],
    steps: [
      'Reis nach Packungsanleitung garen.',
      'Paprika in der Pfanne mit Öl 4 Minuten braten; passierte Tomaten mit Oregano dazugeben und kurz einkochen.',
      'Thunfisch abtropfen lassen und mit Mais unter die Tomatensauce heben.',
      'Reis in die Bowl, Thunfisch-Sauce darauf, Mozzarella light und Rucola obendrauf.'
    ]
  }),
  R({
    id: 'r42', t: 'Risotto-Style Erbsen-Hähnchen mit Parmesan & Rucola',
    cat: 'gefluegel', s: 'fruehling_sommer', prep: 25, p: 'huhn_innen',
    carb: ['reis', 100], veg: ['erbsen_tk', 150], salad: ['rucola', 40],
    extras: [['parmesan', 15], ['quark', 60]],
    steps: [
      'Reis in einer Pfanne mit Zwiebelwürfeln anschwitzen, nach und nach mit Brühe ablöschen und 15 Minuten rühren.',
      'Hähnchen-Innenfilets würzen, separat goldbraun braten und in Stücke schneiden.',
      'Erbsen aus der Tiefkühltruhe 3 Minuten mitkochen, Magerquark und Parmesan unterrühren.',
      'Hähnchen auf dem cremigen Reis anrichten und mit Rucola servieren.'
    ]
  }),
  R({
    id: 'r43', t: 'Mexikanische Hähnchen-Burrito-Bowl mit Mais, Kidneybohnen & Avocado',
    cat: 'gefluegel', s: 'all', prep: 20, p: 'huhn_brust',
    carb: ['reis', 100], veg: ['paprika', 150], salad: ['avocado', 80],
    extras: [['kidneybohnen', 80], ['mais_dose', 60], ['salsa', 40], ['quark', 50]],
    steps: [
      'Reis garen. Hähnchenbrust in Würfel schneiden, mit Kreuzkümmel und Paprikapulver würzen und in der Pfanne braten.',
      'Paprika in Streifen dazugeben und 4 Minuten mitbraten.',
      'Kidneybohnen und Mais kurz erwärmen, Avocado in Würfel schneiden.',
      'Alles in der Bowl anrichten, Salsa darüber und Quark mit Limette als Dip dazu.'
    ]
  }),
  R({
    id: 'r44', t: 'Taco-Hack mit Kidneybohnen, Salsa & Eisbergsalat',
    cat: 'rind', s: 'all', prep: 20, p: 'hack',
    carb: ['tortilla_wraps', 80], veg: ['paprika', 120], salad: ['eisberg', 60],
    extras: [['kidneybohnen', 80], ['salsa', 50], ['schmand_light', 40]],
    steps: [
      'Rinderhack krümelig anbraten, mit Kreuzkümmel, Paprika und Salz würzen.',
      'Paprika in feinen Würfeln mitbraten und die abgetropften Kidneybohnen dazugeben.',
      'Wraps in der trockenen Pfanne kurz anwärmen.',
      'Hack in die Wraps füllen, Salsa, Eisbergsalat und Schmand light darauf geben.'
    ]
  }),
  R({
    id: 'r45', t: 'Fajita-Pute mit Paprika, Zwiebeln & Quark-Dip',
    cat: 'gefluegel', s: 'all', prep: 20, p: 'putenbrust',
    carb: ['tortilla_wraps', 80], veg: ['paprika', 150], salad: ['tomaten', 60],
    extras: [['zwiebeln', 40], ['quark', 60]],
    steps: [
      'Putenbrust in dünne Streifen schneiden, mit Paprikapulver, Kreuzkümmel und Salz marinieren.',
      'Fleisch in der heißen Pfanne 3 Minuten anbraten, Paprika- und Zwiebelstreifen dazugeben und weitere 5 Minuten braten.',
      'Quark mit Knoblauchpulver, Salz und Limette verrühren.',
      'Fajitas in den Wraps mit Tomatenwürfeln und Quark-Dip servieren.'
    ]
  }),
  R({
    id: 'r46', t: 'Hähnchenkeulen-Ofengemüse mit Karotten, Blumenkohl & Kichererbsen',
    cat: 'gefluegel', s: 'herbst_winter', prep: 40, p: 'haehnchen_keule',
    carb: ['kartoffel', 150], veg: ['blumenkohl', 200], salad: ['gurke', 60],
    extras: [['karotten', 150], ['kichererbsen', 80]],
    steps: [
      'Ofen auf 200 °C vorheizen. Kartoffeln vierteln, Karotten in Stücke und Blumenkohl in Röschen schneiden.',
      'Gemüse, Kartoffeln und abgetropfte Kichererbsen mit Öl, Paprika und Thymian auf dem Blech verteilen.',
      'Hähnchenkeulen würzen, obenauf legen und alles 35 bis 40 Minuten backen, bis das Fleisch durch ist.',
      'Mit Gurkenscheiben als frische Beilage servieren.'
    ]
  }),
  R({
    id: 'r47', t: 'Veggie-Curry mit Linsen, Kichererbsen & Spinat',
    cat: 'tiktok', s: 'all', prep: 25, p: 'linsen',
    carb: ['reis', 100], veg: ['spinat', 150], salad: ['pak_choi', 60],
    extras: [['kokosmilch', 80], ['currypaste', 15], ['kichererbsen', 60]],
    steps: [
      'Tofu trocken tupfen, in Würfel schneiden und in der Pfanne rundum knusprig braten. Herausnehmen.',
      'Currypaste in der Pfanne kurz anrösten, Kokosmilch angießen und Kichererbsen 8 Minuten köcheln.',
      'Babyspinat und Pak Choi einrühren, bis sie zusammenfallen.',
      'Tofu wieder dazugeben, mit Reis servieren.'
    ]
  }),
  R({
    id: 'r48', t: 'Asia-Linsen-Wok mit Pak Choi, Sojasprossen & Sojasauce',
    cat: 'tiktok', s: 'all', prep: 15, p: 'linsen',
    carb: ['reisnudeln', 100], veg: ['asia_tk', 150], salad: ['gurke', 60],
    extras: [['sojasauce', 20], ['sojasprossen', 100]],
    steps: [
      'Reisnudeln mit kochendem Wasser übergießen, 4 Minuten ziehen lassen und abgießen.',
      'Tofuwürfel im heißen Wok mit wenig Öl 5 Minuten knusprig braten.',
      'Asia-Gemüse und Sojasprossen dazugeben, 3 Minuten braten und mit Sojasauce ablöschen.',
      'Nudeln untermischen und mit Gurkenstreifen servieren.'
    ]
  }),
  R({
    id: 'r49', t: 'Sriracha-Hähnchen mit Mango-Reis & Pak Choi',
    cat: 'gefluegel', s: 'all', prep: 20, p: 'huhn_innen',
    carb: ['reis', 100], veg: ['pak_choi', 200], salad: ['mango', 60],
    extras: [['sriracha', 15], ['sojasauce', 15]],
    steps: [
      'Reis garen. Hähnchen-Innenfilets in Stücke schneiden und in der Pfanne 6 Minuten braten.',
      'Sriracha und Sojasauce dazugeben und das Hähnchen darin glasieren.',
      'Pak Choi halbiert in einer zweiten Pfanne 3 Minuten dünsten.',
      'Reis mit Mangowürfeln, Hähnchen und Pak Choi anrichten.'
    ]
  }),
  R({
    id: 'r50', t: 'Ananas-Teriyaki-Pute mit Paprika & Reis',
    cat: 'gefluegel', s: 'all', prep: 20, p: 'putenbrust',
    carb: ['reis', 100], veg: ['paprika', 120], salad: ['gurke', 60],
    extras: [['ananas_dose', 80], ['sojasauce', 20]],
    steps: [
      'Reis garen. Putenbrust in Würfel schneiden und in der Pfanne goldbraun braten.',
      'Paprikawürfel und abgetropfte Ananas dazugeben und 4 Minuten mitbraten.',
      'Mit Sojasauce ablöschen, kurz einkochen lassen, bis alles glänzt.',
      'Mit Reis und Gurkenscheiben servieren.'
    ]
  }),
  R({
    id: 'r51', t: 'Grill-Hähnchenspieße mit Zucchini, Paprika & Kräuter-Quark',
    cat: 'gefluegel', s: 'fruehling_sommer', prep: 25, p: 'huhn_brust',
    carb: ['drillinge', 150], veg: ['zucchini', 150], salad: ['tomaten', 80],
    extras: [['quark', 60]],
    steps: [
      'Hähnchenbrust in Würfel schneiden, mit Öl, Paprika und Oregano 15 Minuten marinieren.',
      'Hähnchen und Zucchinischeiben abwechselnd auf Spieße stecken.',
      'Spieße auf dem Grill oder in der Grillpfanne 10 bis 12 Minuten garen, dabei wenden.',
      'Quark mit Kräutern und Salz verrühren und mit Drillingen und Tomaten servieren.'
    ]
  }),
  R({
    id: 'r52', t: 'Grill-Lachs mit Fenchel, Kartoffeln & Rucola',
    cat: 'fisch', s: 'fruehling_sommer', prep: 30, p: 'lachs',
    carb: ['kartoffel', 150], veg: ['fenchel', 150], salad: ['rucola', 40],
    extras: [['schmand_light', 40]],
    steps: [
      'Kartoffeln in Spalten schneiden und in Salzwasser 10 Minuten vorgaren.',
      'Fenchel in Spalten schneiden, mit Kartoffeln mit Öl und Zitronenabrieb auf die Grillschale legen.',
      'Lachsfilets salzen und 8 bis 10 Minuten mit Fenchel und Kartoffeln grillen.',
      'Schmand light mit Dill verrühren und mit Rucola servieren.'
    ]
  }),
  R({
    id: 'r53', t: 'Auberginen-Hack-Pfanne mit Quinoa & Feta',
    cat: 'rind', s: 'all', prep: 25, p: 'hack',
    carb: ['quinoa', 100], veg: ['aubergine', 200], salad: ['gurke', 60],
    extras: [['feta', 25], ['passierte_tomaten', 80]],
    steps: [
      'Quinoa nach Packungsanleitung garen.',
      'Auberginenwürfel in der Pfanne mit reichlich Öl 8 Minuten goldbraun braten.',
      'Rinderhack dazugeben, krümelig braten, mit passierten Tomaten ablöschen und 5 Minuten köcheln.',
      'Mit Quinoa mischen, Feta darüber bröseln und Gurkenwürfel als Beilage servieren.'
    ]
  }),
  R({
    id: 'r54', t: 'Quinoa-Lachs-Bowl mit Avocado, Radieschen & Mais',
    cat: 'fisch', s: 'all', prep: 15, p: 'lachs',
    carb: ['quinoa', 100], veg: ['radieschen', 80], salad: ['avocado', 80],
    extras: [['mais_dose', 40]],
    steps: [
      'Quinoa garen, abkühlen lassen.',
      'Lachsfilet würzen und in der Pfanne 3 Minuten pro Seite braten.',
      'Radieschen in Scheiben schneiden, Avocado würfeln, Mais abtropfen lassen.',
      'Quinoa, Gemüse und Lachs in der Bowl anrichten und mit Zitrone beträufeln.'
    ]
  }),
  R({
    id: 'r55', t: 'Bulgur-Hähnchen-Bowl mit Kohlrabi, Gurke & Quark-Dip',
    cat: 'gefluegel', s: 'all', prep: 25, p: 'huhn_brust',
    carb: ['bulgur', 100], veg: ['kohlrabi', 150], salad: ['gurke', 80],
    extras: [['quark', 60]],
    steps: [
      'Bulgur mit der doppelten Menge heißem Wasser übergießen, 10 Minuten quellen lassen.',
      'Hähnchenbrust würzen, braten und in Stücke schneiden.',
      'Kohlrabi schälen, in Stifte schneiden und 4 Minuten in der Pfanne braten.',
      'Bulgur, Hähnchen, Kohlrabi und Gurkenwürfel anrichten; Quark mit Zitrone und Dill als Dip dazu.'
    ]
  }),
  R({
    id: 'r56', t: 'Herbst-Linsen-Eintopf mit Karotten, Lauch & Kartoffeln',
    cat: 'tiktok', s: 'herbst_winter', prep: 35, p: 'linsen',
    carb: ['kartoffel', 150], veg: ['lauch', 150], salad: ['feldsalat', 40],
    extras: [['karotten', 150], ['kuerbis_hokkaido', 100]],
    steps: [
      'Zwiebelwürfel in Öl glasig dünsten, Karottenscheiben und Kartoffelwürfel dazugeben.',
      'Rote Linsen, Kürbiswürfel und Lauchringe zugeben, mit Gemüsebrühe aufgießen und 20 Minuten köcheln.',
      'Mit Salz, Kreuzkümmel und Majoran abschmecken.',
      'Eintopf in Schalen füllen und mit Feldsalat servieren.'
    ]
  }),
  R({
    id: 'r57', t: 'Frühlings-Erbsen-Pfanne mit Pute, Schmand & Radieschen',
    cat: 'tiktok', s: 'fruehling_sommer', prep: 15, p: 'putenbrust',
    carb: ['drillinge', 150], veg: ['erbsen_tk', 150], salad: ['radieschen', 60],
    extras: [['schmand_light', 40]],
    steps: [
      'Drillinge in Scheiben schneiden und in der Pfanne mit Öl knusprig braten.',
      'Erbsen dazugeben und 3 Minuten mitgaren.',
      'Eier verquirlen, würzen, über das Gemüse gießen und stocken lassen.',
      'Omelett mit Schmand light und Radieschenscheiben servieren.'
    ]
  }),
  R({
    id: 'r58', t: 'Spargel-Erbsen-Pasta mit Putenbrust & Parmesan',
    cat: 'gefluegel', s: 'fruehling_sommer', prep: 25, p: 'putenbrust',
    carb: ['penne', 100], veg: ['spargel', 150], salad: ['rucola', 40],
    extras: [['erbsen_tk', 80], ['parmesan', 15]],
    steps: [
      'Penne in Salzwasser kochen; in den letzten 3 Minuten Erbsen mitkochen.',
      'Spargel schälen, in Stücke schneiden und 5 Minuten in der Pfanne braten.',
      'Putenbrust in Streifen würzen und goldbraun braten.',
      'Pasta, Gemüse und Pute mischen, mit Parmesan bestreuen und auf Rucola servieren.'
    ]
  }),
  R({
    id: 'r59', t: 'Avocado-Hähnchen-Wraps mit Tomaten & Salsa',
    cat: 'gefluegel', s: 'all', prep: 15, p: 'huhn_innen',
    carb: ['tortilla_wraps', 80], veg: ['paprika', 120], salad: ['avocado', 80],
    extras: [['salsa', 40], ['schmand_light', 30]],
    steps: [
      'Hähnchen-Innenfilets in Streifen schneiden, würzen und in der Pfanne 5 Minuten braten.',
      'Paprika in feine Streifen schneiden und mit anbraten.',
      'Avocado zerdrücken, mit Limette und Salz würzen.',
      'Wraps mit Hähnchen, Paprika, Avocado, Salsa und Schmand light füllen und einrollen.'
    ]
  })
);

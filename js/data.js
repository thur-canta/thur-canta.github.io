// ====================================================
// THUR HANDMADE — Të dhënat e dyqanit
// ====================================================
// PËR TË SHTUAR/NDRYSHUAR PRODUKTE:
//   Kopjo një objekt në listën PRODUCTS dhe ndrysho vlerat.
//   Shto fotot në dosjen img/ dhe referencoi ato në "images".
//
// PËR TË NDRYSHUAR INFORMACIONET E DYQANIT:
//   Ndrysho vlerat në objektin SITE më poshtë.
// ====================================================

const SITE = {
  name: "Thur Handmade",
  tagline: "Love stitched into every bag 👜💞",
  phone: "+383 44 123 456",          // NDRYSHO: numrin e telefonit
  whatsapp: "38344123456",            // NDRYSHO: numrin e WhatsApp (pa + dhe pa hapësira)
  email: "info@thurhandmade.com",     // NDRYSHO: email adresën
  instagram: "f_erahandmade",         // Llogaria e Instagram
  address: "Prishtinë, Kosovë",
  bank: {
    name: "TEB Bank",                 // NDRYSHO: emrin e bankës
    iban: "XK05 0000 0000 0000 0000", // NDRYSHO: IBAN numrin
    owner: "Emri Mbiemri",            // NDRYSHO: emrin e pronarit të llogarisë
    swift: "TABORXK"                  // NDRYSHO: SWIFT kodin
  },
  shipping: 2.50,                     // Çmimi i transportit në EUR
  freeShippingOver: 50,               // Transport falas mbi këtë shumë (EUR)
  currency: "€"
};

const PRODUCTS = [
  {
    id: "cante-shumengyryshe",
    name: "Çantë Shumëngjyrëshe",
    price: 30,
    description: "Çantë praktike për një vjeshtë plot ngjyra dhe stil. E krijuar me dashuri, çdo detaj i bërë me kujdes.",
    details: "Material: Fije cilësore · Madhësia: 35 × 30 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag1-1.jpeg",
      "img/bag1-2.jpeg",
      "img/bag1-3.jpeg",
      "img/bag1-4.jpeg",
      "img/bag1-5.jpeg",
      "img/bag1-6.jpeg",
      "img/bag1-7.jpeg"
    ],
    featured: true
  },
  {
    id: "cante-mini",
    name: "Çantë Mini Elegante",
    price: 25,
    description: "Made with love 💕 Çantë e vogël dhe elegante, e përsosur për dalje të shkurtra dhe mbrëmje speciale.",
    details: "Material: Fije cilësore · Madhësia: 20 × 15 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag2-1.jpeg",
      "img/bag2-2.jpeg"
    ],
    featured: true
  },
  {
    id: "cante-boho",
    name: "Çantë Boho",
    price: 40,
    description: "E bërë me dashuri, e përsosur për verë 🌸 Çantë unike, punuar me dorë — shoqëruesja juaj ideale për ditë të gjata jashtë.",
    details: "Material: Fije cilësore · Madhësia: 40 × 35 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag3-1.jpeg",
      "img/bag3-2.jpeg",
      "img/bag3-3.jpeg",
      "img/bag3-4.jpeg",
      "img/bag3-5.jpeg",
      "img/bag3-6.jpeg",
      "img/bag3-7.jpeg",
      "img/bag3-8.jpeg",
      "img/bag3-9.jpeg",
      "img/bag3-10.jpeg"
    ],
    featured: true
  },
  {
    id: "cante-leshi",
    name: "Çantë Leshi",
    price: 35,
    description: "Çdo detaj i bërë me kujdes, çdo qepje me dashuri 🧶🤍 E thjeshtë, por plot stil ✨",
    details: "Material: Fije cilësore · Madhësia: 25 × 20 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag4-1.jpeg",
      "img/bag4-2.jpeg"
    ],
    featured: false
  },
  {
    id: "cante-tregu",
    name: "Çantë e Tregut",
    price: 45,
    description: "Çanta që përshtatet lehtë me çdo stil. Minimaliste dhe funksionale — perfekte për pazarin e përditshëm.",
    details: "Material: Fije cilësore · Madhësia: 45 × 40 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag5-1.jpeg",
      "img/bag5-2.jpeg",
      "img/bag5-3.jpeg",
      "img/bag5-4.jpeg",
      "img/bag5-5.jpeg",
      "img/bag5-6.jpeg"
    ],
    featured: true
  },
  {
    id: "cante-femije",
    name: "Çantë për Fëmijë",
    price: 22,
    description: "Çantë e punuar me dorë, krijuar posaçërisht për fëmijë! 💜 Stil i lezetshëm me dizajn maceje.",
    details: "Material: Fije cilësore · Madhësia: 22 × 18 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag6-1.jpeg"
    ],
    featured: true
  },
  {
    id: "cante-verore",
    name: "Çantë Verore",
    price: 38,
    description: "Elegancë natyrale në çdo fije 🪡✨ Çantë e bukur me model gjeometrik, ideale për ditë vere.",
    details: "Material: Fije cilësore · Madhësia: 35 × 32 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag7-1.jpeg",
      "img/bag7-2.jpeg",
      "img/bag7-3.jpeg"
    ],
    featured: true
  },
  {
    id: "cante-perla",
    name: "Çantë me Perla",
    price: 42,
    description: "Natyrale. E pastër. E krijuar me kujdes 🤍 Çantë elegante me detaje perla — aksesori perfekt për çdo veshje.",
    details: "Material: Fije cilësore + Perla · Madhësia: 28 × 25 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag8-1.jpeg"
    ],
    featured: true
  },
  {
    id: "cante-lule",
    name: "Çantë me Lule",
    price: 35,
    description: "Çantë me detaje lule të thurura — stil i freskët dhe natyral për çdo ditë. Përshtatet lehtë me çdo veshje.",
    details: "Material: Fije cilësore · Madhësia: 30 × 28 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag9-1.jpeg",
      "img/bag9-2.jpeg",
      "img/bag9-3.jpeg"
    ],
    featured: false
  },
  {
    id: "cante-zinxhir",
    name: "Çantë me Zinxhir",
    price: 36,
    description: "Çantë elegante me zinxhir metalik — stil modern dhe i rafinuar. Perfekte për mbrëmje speciale.",
    details: "Material: Fije cilësore + Zinxhir · Madhësia: 22 × 18 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag10-1.jpeg"
    ],
    featured: false
  },
  {
    id: "cante-natyrore",
    name: "Çantë Natyrore",
    price: 40,
    description: "Çantë me dizajn të hapur — e lehtë, e freskët, perfekte për verë. Stil boho-chic natyral.",
    details: "Material: Fije cilësore · Madhësia: 38 × 35 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag11-1.jpeg",
      "img/bag11-2.jpeg"
    ],
    featured: false
  },
  {
    id: "cante-gri",
    name: "Çantë Gri Elegante",
    price: 38,
    description: "Çantë e thjeshtë por plot stil — ngjyrë gri elegante me dorezë rrethore. Minimaliste dhe funksionale.",
    details: "Material: Fije cilësore · Madhësia: 35 × 30 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag12-1.jpeg"
    ],
    featured: false
  },
  {
    id: "cante-bardhe",
    name: "Çantë e Bardhë me Motive",
    price: 32,
    description: "Çantë me motive të bukura gjeometrike në ngjyrë të bardhë. E krijuar me kujdes dhe dashuri për ditët tuaja speciale.",
    details: "Material: Fije cilësore · Madhësia: 25 × 22 cm · Punë dore (crochet) · Krijuar në Kosovë",
    images: [
      "img/bag13-1.jpeg"
    ],
    featured: false
  }
];

// Qytetet e Kosovës (për formularin e porosisë)
const CITIES = [
  "Prishtinë", "Prizren", "Pejë", "Gjakovë", "Mitrovicë",
  "Gjilan", "Ferizaj", "Podujevë", "Vushtrri", "Suharekë",
  "Rahovec", "Drenas", "Lipjan", "Malishevë", "Kamenicë",
  "Viti", "Deçan", "Istog", "Klinë", "Skenderaj",
  "Dragash", "Fushë Kosovë", "Kaçanik", "Shtime", "Obiliq",
  "Hani i Elezit", "Mamushë", "Junik"
];

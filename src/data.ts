export interface MoonData {
  name: string;
  distance: number; // Relative to planet center
  radius: number;
  orbitSpeed: number;
  color: string;
  description: string;
  textureUrl?: string;
}

export interface PlanetData {
  name: string;
  radius: number;
  distance: number; // Distance from Sun
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  description: string;
  facts: string[];
  totalMoons: number;
  moons: MoonData[];
  hasRings?: boolean;
  ringColor?: string;
  textureUrl?: string;
}

export const SOLAR_SYSTEM: PlanetData[] = [
  {
    name: "Mercure",
    radius: 0.8,
    distance: 15,
    orbitSpeed: 0.04,
    rotationSpeed: 0.01,
    color: "#A5A5A5",
    description: "La planète la plus proche du Soleil, Mercure est un monde rocheux et cratérisé, sans atmosphère significative.",
    facts: [
      "Plus petite planète du système solaire",
      "Plus proche du Soleil",
      "Aucune lune",
      "Températures extrêmes (≈ -180°C à 430°C)",
      "Une journée dure plus longtemps qu’une année",
      "Pas d’atmosphère significative"
    ],
    totalMoons: 0,
    moons: [],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mercury.jpg"
  },
  {
    name: "Vénus",
    radius: 1.2,
    distance: 22,
    orbitSpeed: 0.015,
    rotationSpeed: 0.005,
    color: "#E3BB76",
    description: "Souvent appelée la jumelle de la Terre, Vénus possède une atmosphère épaisse et toxique qui retient la chaleur.",
    facts: [
      "Taille similaire à la Terre (souvent appelée “jumelle”)",
      "Aucune lune",
      "Atmosphère très dense (CO₂) → effet de serre extrême",
      "Planète la plus chaude (~465°C)",
      "Rotation inversée (le Soleil se lève à l’ouest)",
      "Une journée est plus longue qu’une année"
    ],
    totalMoons: 0,
    moons: [],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/venus_surface.jpg"
  },
  {
    name: "Terre",
    radius: 1.3,
    distance: 30,
    orbitSpeed: 0.01,
    rotationSpeed: 0.02,
    color: "#2271B3",
    description: "Notre maison, la seule planète connue pour abriter la vie, avec de vastes océans et une atmosphère protectrice.",
    facts: [
      "Seule planète connue avec de la vie",
      "1 lune : la Lune",
      "70 % recouverte d’eau",
      "Atmosphère riche en oxygène",
      "Champ magnétique protecteur",
      "Plaques tectoniques actives"
    ],
    totalMoons: 1,
    moons: [
      { 
        name: "Lune", 
        distance: 2.5, 
        radius: 0.3, 
        orbitSpeed: 0.05, 
        color: "#D1D1D1", 
        description: "Le seul satellite naturel de la Terre, influençant les marées et stabilisant l'axe de rotation.",
        textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg"
      }
    ],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
  },
  {
    name: "Mars",
    radius: 0.9,
    distance: 40,
    orbitSpeed: 0.008,
    rotationSpeed: 0.018,
    color: "#E27B58",
    description: "La planète rouge, Mars abrite le plus grand volcan du système solaire et des preuves d'eau passée.",
    facts: [
      "Surnommée “planète rouge” (oxyde de fer)",
      "2 lunes : Phobos et Deimos",
      "Possède le plus grand volcan : Olympus Mons",
      "Traces d’eau ancienne",
      "Atmosphère très fine",
      "Températures froides (~ -60°C en moyenne)"
    ],
    totalMoons: 2,
    moons: [
      { name: "Phobos", distance: 1.5, radius: 0.15, orbitSpeed: 0.08, color: "#8E8E8E", description: "La plus grande et la plus proche des deux lunes de Mars." },
      { name: "Deimos", distance: 2.2, radius: 0.1, orbitSpeed: 0.06, color: "#A0A0A0", description: "La plus petite et la plus éloignée des lunes martiennes." }
    ],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars.jpg"
  },
  {
    name: "Jupiter",
    radius: 4.5,
    distance: 65,
    orbitSpeed: 0.004,
    rotationSpeed: 0.04,
    color: "#D39C7E",
    description: "Le géant gazeux, la plus grande planète du système solaire, célèbre pour sa Grande Tache Rouge.",
    facts: [
      "Plus grande planète du système solaire",
      "Plus de 95 lunes connues",
      "Les 4 principales : Io, Europe, Ganymède, Callisto",
      "Tempête géante : Grande Tache Rouge",
      "Géante gazeuse (pas de surface solide)",
      "Rotation très rapide (~10h)",
      "Champ gravitationnel énorme"
    ],
    totalMoons: 95,
    moons: [
      { name: "Io", distance: 6, radius: 0.4, orbitSpeed: 0.04, color: "#F3E03B", description: "Le corps le plus volcaniquement actif du système solaire.", textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg" },
      { name: "Europe", distance: 7.5, radius: 0.35, orbitSpeed: 0.03, color: "#C9C9C9", description: "Une lune glacée qui pourrait abriter un océan souterrain liquide." },
      { name: "Ganymède", distance: 9.5, radius: 0.5, orbitSpeed: 0.02, color: "#958677", description: "La plus grande lune du système solaire, plus grande que Mercure." },
      { name: "Callisto", distance: 12, radius: 0.45, orbitSpeed: 0.015, color: "#6B6054", description: "Une lune ancienne et fortement cratérisée." },
      { name: "Himalia", distance: 15, radius: 0.15, orbitSpeed: 0.01, color: "#8E8E8E", description: "La plus grande des lunes irrégulières de Jupiter." },
      { name: "Ananké", distance: 18, radius: 0.1, orbitSpeed: 0.008, color: "#7A7A7A", description: "Une petite lune irrégulière rétrograde." }
    ],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg"
  },
  {
    name: "Saturne",
    radius: 3.8,
    distance: 95,
    orbitSpeed: 0.002,
    rotationSpeed: 0.038,
    color: "#C5AB6E",
    description: "Célèbre pour son système d'anneaux spectaculaire, Saturne est un géant gazeux moins dense que l'eau.",
    facts: [
      "Célèbre pour ses anneaux spectaculaires",
      "Plus de 146 lunes connues",
      "Titan : lune avec atmosphère dense",
      "Densité très faible (pourrait flotter dans l’eau en théorie)",
      "Géante gazeuse",
      "Anneaux composés de glace et roches"
    ],
    totalMoons: 146,
    hasRings: true,
    ringColor: "#A49163",
    moons: [
      { name: "Titan", distance: 8, radius: 0.5, orbitSpeed: 0.025, color: "#E3BB76", description: "La seule lune avec une atmosphère dense et des lacs de méthane liquide." },
      { name: "Encelade", distance: 5.5, radius: 0.2, orbitSpeed: 0.045, color: "#FFFFFF", description: "Une petite lune glacée connue pour ses geysers d'eau." },
      { name: "Rhéa", distance: 6.5, radius: 0.3, orbitSpeed: 0.035, color: "#D1D1D1", description: "La deuxième plus grande lune de Saturne." },
      { name: "Japet", distance: 15, radius: 0.35, orbitSpeed: 0.01, color: "#4A4A4A", description: "Une lune bicolore avec une crête équatoriale massive." },
      { name: "Dioné", distance: 4.5, radius: 0.25, orbitSpeed: 0.05, color: "#C0C0C0", description: "Une lune glacée avec des falaises de glace brillantes." },
      { name: "Téthys", distance: 3.8, radius: 0.25, orbitSpeed: 0.06, color: "#E0E0E0", description: "Une lune glacée avec un cratère d'impact massif appelé Odyssée." }
    ],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/saturn.jpg"
  },
  {
    name: "Uranus",
    radius: 2.5,
    distance: 125,
    orbitSpeed: 0.001,
    rotationSpeed: 0.03,
    color: "#B5E3E3",
    description: "Un géant de glace qui tourne sur le côté, avec un système d'anneaux sombres et des vents violents.",
    facts: [
      "Couleur bleue-verte (méthane)",
      "28 lunes connues",
      "Rotation “couchée” (axe incliné à 98°)",
      "Très froide (~ -224°C)",
      "Anneaux fins",
      "Noms des lunes inspirés de Shakespeare"
    ],
    totalMoons: 28,
    moons: [
      { name: "Titania", distance: 5, radius: 0.3, orbitSpeed: 0.03, color: "#D1D1D1", description: "La plus grande lune d'Uranus." },
      { name: "Obéron", distance: 6.5, radius: 0.28, orbitSpeed: 0.02, color: "#A0A0A0", description: "La lune la plus éloignée des cinq lunes majeures." },
      { name: "Umbriel", distance: 4, radius: 0.25, orbitSpeed: 0.04, color: "#6B6054", description: "La plus sombre des grandes lunes d'Uranus." },
      { name: "Ariel", distance: 3, radius: 0.25, orbitSpeed: 0.05, color: "#E0E0E0", description: "La plus brillante des lunes d'Uranus." }
    ],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/uranus.jpg"
  },
  {
    name: "Neptune",
    radius: 2.4,
    distance: 150,
    orbitSpeed: 0.0008,
    rotationSpeed: 0.032,
    color: "#4B70DD",
    description: "La planète la plus éloignée du Soleil, Neptune est un monde bleu balayé par les vents les plus rapides du système solaire.",
    facts: [
      "Planète la plus éloignée",
      "16 lunes connues",
      "Triton : lune principale (orbite rétrograde)",
      "Vents les plus rapides du système solaire",
      "Couleur bleue intense (méthane)",
      "Découverte grâce aux mathématiques"
    ],
    totalMoons: 16,
    moons: [
      { name: "Triton", distance: 4.5, radius: 0.35, orbitSpeed: 0.04, color: "#E3DCCB", description: "La seule grande lune du système solaire avec une orbite rétrograde." },
      { name: "Protée", distance: 3, radius: 0.2, orbitSpeed: 0.06, color: "#8E8E8E", description: "Une lune irrégulière et très sombre." }
    ],
    textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/neptune.jpg"
  }
];

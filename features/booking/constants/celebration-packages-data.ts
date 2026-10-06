export const celebrationCategories = [
  {
    id: "birthday", name: "Birthday Celebration",
    description: "Pilihan perayaan ulang tahun yang hangat, dari surprise kecil hingga momen bersama keluarga besar.",
    image: "/images/birthday-room-decor.webp",
    packages: [
  {
    id: "birthday-simple",
    name: "Simple Birthday Setup",
    capacity: "2–4 orang",
    popular: false,
    description: "Pilihan sederhana untuk surprise kecil yang hangat dan personal selama menginap.",
    price: 399000,
    inclusions: [
      "Dekorasi kamar sederhana",
      "Birthday banner / signage",
      "Balloon accent dengan tone natural",
      "Mini birthday cake",
      "Greeting card personal",
      "Simple table decoration",
    ],
  },
  {
    id: "birthday-family",
    name: "Family Birthday Celebration",
    capacity: "5–10 orang",
    popular: true,
    description: "Pilihan lengkap untuk merayakan ulang tahun bersama keluarga dengan suasana yang lebih meriah namun tetap elegan.",
    price: 799000,
    inclusions: [
      "Dekorasi kamar atau dining area",
      "Birthday cake eksklusif",
      "Balloon arrangement alami",
      "Personalized birthday signage",
      "Table decoration elegan",
      "Simple family photo corner",
      "Welcome drink & greeting card",
    ],
  },
  {
    id: "birthday-highland",
    name: "Highland Birthday Experience",
    capacity: "10–15 orang",
    popular: false,
    description: "Perayaan lebih lengkap untuk momen spesial bersama keluarga besar atau tamu terdekat.",
    price: 1399000,
    inclusions: [
      "Premium room / dining decoration",
      "Larger birthday cake bertingkat",
      "Floral & natural foliage styling",
      "Curated balloon arrangement",
      "Private dining table setup",
      "Mini highland photo spot",
      "Welcome drinks & complete styling",
    ],
  },
],
  },
  {
  "id": "anniversary",
  "name": "Honeymoon / Anniversary",
  "description": "Dari kejutan sederhana di kamar hingga romantic dinner, setiap detail dipersiapkan untuk membuat waktu bersama terasa lebih personal dan berkesan.",
  "image": "/images/anniversary-room-decor.webp",
  "packages": [
    {
      "id": "anniversary-simple",
      "name": "Simple Anniversary Setup",
      "capacity": "Untuk 2 Tamu",
      "popular": false,
      "price": 449000,
      "description": "Pilihan sederhana untuk memberikan kejutan kecil yang hangat selama menginap.",
      "inclusions": [
        "Dekorasi kamar sederhana bernuansa hangat",
        "Personalized anniversary signage & greeting card",
        "Floral & foliage accent segar",
        "Simple bed styling & natural throw",
        "Mini anniversary cake atau dessert"
      ]
    },
    {
      "id": "anniversary-romantic",
      "name": "Romantic Highland Celebration",
      "capacity": "Untuk 2 Tamu",
      "popular": true,
      "price": 899000,
      "description": "Perayaan yang lebih lengkap dengan suasana romantis dan intimate.",
      "inclusions": [
        "Premium room decoration bernuansa pegunungan",
        "Personalized anniversary signage & custom greeting card",
        "Elegant floral arrangement (fresh flowers & foliage)",
        "Signature anniversary cake",
        "Warm candlelit table decoration",
        "Welcome drinks segar untuk 2 orang",
        "Simple romantic dining setup di kamar/teras"
      ]
    },
    {
      "id": "anniversary-signature",
      "name": "Signature Anniversary Experience",
      "capacity": "Untuk 2 Tamu",
      "popular": false,
      "price": 1499000,
      "description": "Pengalaman anniversary yang lebih lengkap dengan setup khusus untuk menikmati waktu berdua.",
      "inclusions": [
        "Premium suite setup dengan dekorasi menyeluruh",
        "Larger luxury floral centerpiece & botanical accents",
        "Personalized anniversary wooden signage & message",
        "Premium artisan anniversary cake",
        "Private romantic candlelit dining table for two",
        "Welcome drinks & champagne mocktail",
        "Elegant table styling (fine linen & tableware)",
        "Mini highland photo corner & special turndown setup"
      ]
    }
  ]
},
] as const;

export type CelebrationCategory = (typeof celebrationCategories)[number];
export type CelebrationPackageId = CelebrationCategory["packages"][number]["id"];
export const celebrationPackages = celebrationCategories.flatMap<CelebrationCategory["packages"][number]>((category) => [...category.packages]);
export const celebrationPackagePrices = Object.fromEntries(celebrationPackages.map((item) => [item.id, item.price])) as Record<CelebrationPackageId, number>;
export const celebrationPackageLabels = Object.fromEntries(celebrationPackages.map((item) => [item.id, item.name])) as Record<CelebrationPackageId, string>;

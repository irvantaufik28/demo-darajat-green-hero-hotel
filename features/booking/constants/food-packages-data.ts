export const foodCategories = [
  {
    id: "roast-goat", name: "Kambing Guling",
    description: "Hidangan istimewa dengan racikan rempah khas Priangan untuk keluarga besar dan gathering selama menginap.",
    packages: [
      { id: "goat-intimate", name: "Kambing Guling Intimate", capacity: "15–20 orang", price: 1850000, popular: false, description: "Pilihan sederhana untuk menikmati kambing guling bersama keluarga atau kelompok kecil.", inclusions: ["Kambing guling", "Lontong / nasi", "Sambal kecap & acar", "Perlengkapan penyajian"] },
      { id: "goat-family", name: "Kambing Guling Family", capacity: "25–35 orang", price: 2750000, popular: true, description: "Cocok untuk keluarga besar dan acara santai selama menginap.", inclusions: ["Kambing guling", "Lontong / nasi", "Sambal kecap & acar", "Perlengkapan penyajian", "Pendamping sajian"] },
      { id: "goat-gathering", name: "Kambing Guling Gathering", capacity: "40–50 orang", price: 3450000, popular: false, description: "Untuk gathering keluarga, komunitas, maupun acara kelompok.", inclusions: ["Kambing guling", "Lontong / nasi", "Sambal kecap & acar", "Perlengkapan penyajian", "Pendamping sajian", "Setup area penyajian"] },
      { id: "goat-celebration", name: "Kambing Guling Celebration", capacity: "55–70 orang", price: 4250000, popular: false, description: "Pilihan untuk perayaan dan acara dengan jumlah tamu lebih besar.", inclusions: ["Kambing guling", "Lontong / nasi", "Sambal kecap & acar", "Perlengkapan penyajian", "Pendamping sajian", "Setup penyajian"] },
    ],
  },
  {
    id: "grilled-chicken", name: "Ayam Bakar Family Set",
    description: "Santap bersama keluarga dengan ayam bakar, nasi hangat, lalapan segar, dan sambal khas Darajat.",
    packages: [
      { id: "chicken-family", name: "Ayam Bakar Family", capacity: "4–6 orang", price: 349000, popular: false, description: "Pilihan hangat untuk makan bersama keluarga kecil.", inclusions: ["2 ekor ayam kampung bakar bumbu manis gurih", "Nasi putih hangat pulen", "Sambal khas terasi & sambal dadak", "Lalapan segar kebun Garut", "Tahu & tempe goreng renyah", "Minuman teh hangat pendamping"] },
      { id: "chicken-gathering", name: "Ayam Bakar Gathering", capacity: "8–10 orang", price: 649000, popular: true, description: "Cocok untuk keluarga besar atau gathering kecil.", inclusions: ["3 ekor ayam kampung bakar bumbu rempah", "Nasi putih hangat pulen", "Sambal khas terasi & sambal ijo", "Lalapan segar kebun Garut", "Tahu & tempe goreng renyah", "Sayur pendamping (Sayur Asem Pasirwangi)", "Minuman teh & wedang hangat"] },
      { id: "chicken-celebration", name: "Ayam Bakar Celebration", capacity: "12–15 orang", price: 949000, popular: false, description: "Pilihan lengkap untuk keluarga besar dan momen spesial.", inclusions: ["5 ekor ayam kampung bakar bumbu rempah khas", "Nasi putih hangat pulen", "Sambal khas (3 varian sambal nusantara)", "Lalapan lengkap sayur segar", "Tahu & tempe goreng renyah", "Sayur pendamping (Sayur Asem & Lodeh)", "Minuman teh manis & wedang hangat", "Setup penyajian khusus di meja outdoor/villa"] },
    ],
  },
  {
    id: "grill", name: "BBQ & Grill Set",
    description: "Pilihan daging marinasi, sayuran segar, dan perlengkapan grill untuk menikmati udara sejuk Darajat bersama.",
    packages: [
      { id: "grill-highland", name: "Highland Grill", capacity: "6–8 orang", price: 649000, popular: false, description: "Pilihan ringkas untuk keluarga atau kelompok kecil yang menginginkan makan malam hangat penuh keakraban.", inclusions: ["Beef slice gurih", "Chicken fillet marinasi", "Beef sausage & Fishball", "Mixed fresh vegetables (jagung & selada)", "Pilihan saus cocolan & olesan", "Grill pan & arang setup lengkap"] },
      { id: "grill-family", name: "Family Grill", capacity: "12–15 orang", price: 1249000, popular: true, description: "Paket untuk makan bersama keluarga besar atau gathering kecil dengan variasi daging dan seafood lengkap.", inclusions: ["US Beef Shortplate premium", "Chicken Fillet & Marinated Beef", "Jumbo Beef Sausage & Fishball", "Mixed Seafood (udang & cumi marinasi)", "Fresh Vegetables & Jamur Enoki", "Pilihan Saus BBQ & Dabu-dabu", "Dual Grill & Hotpot / Suki Setup"] },
      { id: "grill-grand", name: "Grand Grill", capacity: "20–22 orang", price: 1899000, popular: false, description: "Pilihan lengkap untuk gathering perusahaan, reuni, dan momen bersama dalam jumlah tamu lebih besar.", inclusions: ["US Beef Shortplate & Saikoro Beef", "Chicken Fillet Marinasi Spesial", "Jumbo Beef Sausage & Assorted Fishball", "Mixed Seafood Platter Segar", "Pilihan 3 Jenis Saus & Sambal Tradisional", "Grill & Hotpot Setup Ganda", "Full Serving & Dedicated Staf Pendamping"] },
    ],
  },
] as const;

export type FoodCategory = (typeof foodCategories)[number];
export type FoodPackageId = FoodCategory["packages"][number]["id"];
export const foodPackages = foodCategories.flatMap<FoodCategory["packages"][number]>((category) => [...category.packages]);
export const foodPackagePrices = Object.fromEntries(foodPackages.map((item) => [item.id, item.price])) as Record<FoodPackageId, number>;
export const foodPackageLabels = Object.fromEntries(foodPackages.map((item) => [item.id, item.name])) as Record<FoodPackageId, string>;

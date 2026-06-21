import type { ActivityCategory, Spot } from "@/lib/types";

export const ACTIVITY_CATEGORIES = [
  "Belajar",
  "Nugas",
  "Diskusi",
  "Main",
  "Olahraga",
  "Hangout",
  "Kreatif",
  "Event kecil"
] as const;

export const SPOT_FACILITIES = [
  "Wi-Fi",
  "Colokan",
  "AC",
  "Sunyi",
  "Outdoor",
  "Indoor",
  "Luas",
  "Dekat kantin",
  "Boleh ngobrol"
] as const;

export const CATEGORY_STYLES: Record<ActivityCategory, string> = {
  Belajar: "bg-sky/15 text-blue-700 border-sky/25",
  Nugas: "bg-campus/15 text-emerald-700 border-campus/25",
  Diskusi: "bg-mango/25 text-yellow-800 border-mango/35",
  Main: "bg-coral/15 text-red-700 border-coral/25",
  Olahraga: "bg-lime-100 text-lime-800 border-lime-200",
  Hangout: "bg-pink-100 text-pink-700 border-pink-200",
  Kreatif: "bg-violet-100 text-violet-700 border-violet-200",
  "Event kecil": "bg-indigo-100 text-indigo-700 border-indigo-200"
};

export const demoSpots: Spot[] = [
  {
    id: "demo-perpustakaan",
    name: "Perpustakaan",
    description: "Spot tenang untuk fokus belajar, baca referensi, dan ngerjain tugas.",
    location: "Gedung Perpustakaan Pusat",
    facilities: ["Wi-Fi", "AC", "Colokan", "Sunyi", "Indoor"],
    suitable_for: ["Belajar", "Nugas"],
    image_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-taman-kampus",
    name: "Taman Kampus",
    description: "Area terbuka yang enak buat kumpul sore, main ringan, atau pemanasan.",
    location: "Taman tengah kampus",
    facilities: ["Outdoor", "Luas", "Boleh ngobrol"],
    suitable_for: ["Main", "Olahraga", "Hangout"],
    image_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-kantin",
    name: "Kantin",
    description: "Ramai, santai, dan dekat makanan buat diskusi sambil isi energi.",
    location: "Kantin fakultas",
    facilities: ["Dekat kantin", "Boleh ngobrol", "Indoor"],
    suitable_for: ["Hangout", "Diskusi", "Nugas"],
    image_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-selasar",
    name: "Selasar Gedung",
    description: "Tempat fleksibel untuk nugas bareng atau ngobrol setelah kelas.",
    location: "Selasar gedung kuliah",
    facilities: ["Colokan", "Boleh ngobrol", "Indoor"],
    suitable_for: ["Nugas", "Diskusi", "Hangout"],
    image_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-lapangan",
    name: "Lapangan",
    description: "Ruang luas untuk olahraga, main, atau acara kecil komunitas kampus.",
    location: "Lapangan utama",
    facilities: ["Outdoor", "Luas"],
    suitable_for: ["Olahraga", "Main", "Event kecil"],
    image_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-ruang-kelas-kosong",
    name: "Ruang Kelas Kosong",
    description: "Cocok untuk diskusi kelompok, belajar bareng, dan event kecil.",
    location: "Gedung kelas lantai 2",
    facilities: ["Indoor", "Luas", "AC", "Boleh ngobrol"],
    suitable_for: ["Diskusi", "Belajar", "Event kecil"],
    image_url: null,
    created_at: new Date().toISOString()
  }
];

# 🌟 SpotMate

SpotMate adalah platform inovatif yang menghubungkan mahasiswa dengan aktivitas kampus dan lokasi (*spot*) terbaik. Aplikasi ini dirancang untuk menciptakan ekosistem kampus yang lebih kolaboratif, memudahkan koordinasi antar mahasiswa, dan meningkatkan produktivitas belajar di luar kelas.

## 🚀 Fitur Unggulan
* **Smart Authentication:** Sistem login aman dengan Supabase Auth yang mendukung proteksi rute.
* **Spot Discovery:** Eksplorasi berbagai lokasi strategis di area kampus yang cocok untuk diskusi atau belajar mandiri.
* **Activity Planner:** Sistem manajemen aktivitas untuk membuat kegiatan dan mengelola partisipan.
* **Real-time Interaction:** Integrasi database yang memungkinkan data muncul secara instan.
* **Security & Privacy:** Perlindungan data user dengan kebijakan RLS (Row Level Security) yang ketat.

## 🛠️ Tech Stack & Dependencies
Aplikasi ini dibangun menggunakan teknologi modern:
- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Database/Auth:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

## 📂 Struktur Proyek
```text
src/
├── app/
│   ├── activities/      # Halaman utama aktivitas
│   ├── auth/            # Halaman reset password (update-password)
│   ├── login/           # Halaman login
│   ├── profile/         # Halaman profil pengguna
│   ├── register/        # Halaman pendaftaran
│   ├── spots/           # Halaman manajemen spot (create, dll)
│   ├── globals.css      # Styling global aplikasi
│   ├── layout.tsx       # Layout utama aplikasi
│   └── page.tsx         # Halaman landing/home
├── components/          # Komponen UI (SupabaseNotice, dll)
└── lib/                 # Konfigurasi Supabase dan utilitas
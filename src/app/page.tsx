import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  MapPinned,
  Sparkles,
  UsersRound
} from "lucide-react";

const stats = [
  { label: "Spot kampus", value: "6+" },
  { label: "Kategori aktivitas", value: "8" },
  { label: "Flow join", value: "1 klik" }
];

const highlights = [
  {
    title: "Cari spot yang pas",
    description: "Filter fasilitas seperti Wi-Fi, colokan, AC, indoor, outdoor, dan suasana.",
    icon: MapPinned
  },
  {
    title: "Buat aktivitas",
    description: "Tentukan kategori, spot, jadwal, deskripsi, dan kuota peserta.",
    icon: CalendarPlus
  },
  {
    title: "Join bareng teman",
    description: "Activity board menampilkan kuota dan mencegah join dobel atau melebihi kapasitas.",
    icon: UsersRound
  }
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/spotmate-hero.png"
            alt="Mahasiswa berkumpul di area kampus"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/52 to-ink/15" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />
        </div>

        <div className="container-page flex min-h-[74svh] items-center py-14 sm:py-20">
          <div className="max-w-3xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              <Sparkles size={17} aria-hidden />
              Temukan tempat, temukan teman
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
              SpotMate
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/88 sm:text-xl">
              Platform ringan untuk mahasiswa yang ingin mencari spot kampus,
              bikin aktivitas, dan join rencana seru tanpa ribet.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/activities" className="primary-button bg-coral hover:bg-red-500">
                Lihat Activity Board
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/spots" className="secondary-button border-white/20 bg-white/95">
                Cari Spot
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page -mt-12 pb-16 relative z-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="card p-5">
              <p className="text-3xl font-black text-campus">{item.value}</p>
              <p className="mt-1 text-sm font-bold text-ink/65">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="card p-6">
                <div className="grid size-12 place-items-center rounded-lg bg-campus/10 text-campus">
                  <Icon size={24} aria-hidden />
                </div>
                <h2 className="mt-5 text-xl font-black text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/65">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

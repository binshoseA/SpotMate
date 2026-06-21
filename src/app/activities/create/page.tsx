"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarPlus, LockKeyhole, MapPin, PlusCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { SupabaseNotice } from "@/components/SupabaseNotice";
import { ACTIVITY_CATEGORIES, demoSpots } from "@/lib/constants";
import { toLocalDateTimeInput } from "@/lib/format";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ActivityCategory, Spot } from "@/lib/types";

const defaultTime = () => {
  const nextHour = new Date(Date.now() + 60 * 60 * 1000);
  nextHour.setMinutes(0, 0, 0);
  return toLocalDateTimeInput(nextHour);
};

export default function CreateActivityPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("Main");
  const [spotId, setSpotId] = useState("");
  const [activityTime, setActivityTime] = useState(defaultTime);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSpots() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setSpots(demoSpots);
        setSpotId(demoSpots[1]?.id ?? "");
        return;
      }

      const { data } = await supabase.from("spots").select("*").order("name");
      const nextSpots = (data as Spot[]) ?? [];
      setSpots(nextSpots);
      setSpotId(nextSpots[0]?.id ?? "");
    }

    void loadSpots();
  }, []);

  const selectedSpot = useMemo(
    () => spots.find((spot) => spot.id === spotId),
    [spotId, spots]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const supabase = getSupabaseClient();

    if (!supabase || !user) {
      setStatus("Login dan konfigurasi Supabase dibutuhkan untuk membuat activity.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("activities")
      .insert({
        title,
        description,
        category,
        spot_id: spotId,
        creator_id: user.id,
        activity_time: new Date(activityTime).toISOString(),
        max_participants: maxParticipants
      })
      .select("id")
      .single();

    if (error || !data) {
      setLoading(false);
      setStatus(error?.message ?? "Activity gagal dibuat.");
      return;
    }

    const { error: participantError } = await supabase
      .from("activity_participants")
      .insert({
        activity_id: data.id,
        user_id: user.id
      });

    setLoading(false);

    if (participantError) {
      setStatus(participantError.message);
      return;
    }

    router.push(`/activities/${data.id}`);
  }

  if (!authLoading && !user) {
    return (
      <main className="container-page py-10">
        <div className="mx-auto max-w-lg rounded-lg border border-ink/10 bg-white p-7 text-center shadow-card">
          <div className="mx-auto grid size-14 place-items-center rounded-lg bg-ink text-white">
            <LockKeyhole size={26} aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl font-black text-ink">Login dulu</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Activity dibuat atas nama profil mahasiswa kamu.
          </p>
          <Link href="/login" className="primary-button mt-5">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-campus/10 px-4 py-2 text-sm font-black text-campus">
            <CalendarPlus size={17} aria-hidden />
            Activity baru
          </span>
          <h1 className="mt-4 text-4xl font-black text-ink">Buat aktivitas</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Siapkan judul, kategori, spot, jadwal, dan batas peserta.
          </p>
        </div>

        <SupabaseNotice />

        <form className="card mt-6 grid gap-5 p-5 sm:p-7" onSubmit={handleSubmit}>
          <label className="block">
            <span className="field-label">Judul activity</span>
            <input
              className="field-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Main Benteng Sore Ini"
              required
            />
          </label>

          <label className="block">
            <span className="field-label">Deskripsi</span>
            <textarea
              className="field-input min-h-28 resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Kumpul santai di Taman Kampus, mulai jam 16.00. Semua boleh ikut."
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Kategori</span>
              <select
                className="field-input"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as ActivityCategory)
                }
              >
                {ACTIVITY_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="field-label">Spot</span>
              <select
                className="field-input"
                value={spotId}
                onChange={(event) => setSpotId(event.target.value)}
                required
              >
                {spots.map((spot) => (
                  <option key={spot.id} value={spot.id}>
                    {spot.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedSpot ? (
            <div className="rounded-lg border border-campus/20 bg-campus/8 p-4">
              <p className="flex items-center gap-2 text-sm font-black text-campus">
                <MapPin size={17} aria-hidden />
                {selectedSpot.location}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSpot.facilities.map((facility) => (
                  <span key={facility} className="chip bg-white/80">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Waktu</span>
              <input
                className="field-input"
                type="datetime-local"
                value={activityTime}
                onChange={(event) => setActivityTime(event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="field-label">Kuota peserta</span>
              <input
                className="field-input"
                type="number"
                min={1}
                max={100}
                value={maxParticipants}
                onChange={(event) => setMaxParticipants(Number(event.target.value))}
                required
              />
            </label>
          </div>

          {status ? (
            <p className="rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-red-700">
              {status}
            </p>
          ) : null}

          <button
            type="submit"
            className="primary-button"
            disabled={loading || !user || !isSupabaseConfigured()}
          >
            <PlusCircle size={18} aria-hidden />
            {loading ? "Membuat..." : "Buat Activity"}
          </button>
        </form>
      </div>
    </main>
  );
}

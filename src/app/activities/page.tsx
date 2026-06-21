"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardList, PlusCircle } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { SupabaseNotice } from "@/components/SupabaseNotice";
import { useAuth } from "@/components/AuthProvider";
import { ACTIVITY_CATEGORIES } from "@/lib/constants";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { ActivityCategory, ActivityWithMeta } from "@/lib/types";

type ActivityRow = Omit<ActivityWithMeta, "participant_count" | "has_joined"> & {
  activity_participants?: { user_id: string }[];
};

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityWithMeta[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | "Semua">(
    "Semua"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadActivities() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setActivities([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("activities")
        .select("*, spots(name, location), activity_participants(user_id)")
        .order("activity_time", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        const mapped = ((data as ActivityRow[]) ?? []).map((activity) => {
          const participants = activity.activity_participants ?? [];

          return {
            ...activity,
            participant_count: participants.length,
            has_joined: user
              ? participants.some((participant) => participant.user_id === user.id)
              : false
          };
        });

        setActivities(mapped);
      }

      setLoading(false);
    }

    void loadActivities();
  }, [user]);

  const filteredActivities = useMemo(() => {
    if (selectedCategory === "Semua") {
      return activities;
    }

    return activities.filter((activity) => activity.category === selectedCategory);
  }, [activities, selectedCategory]);

  return (
    <main className="container-page py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-4 py-2 text-sm font-black text-coral">
            <CalendarDays size={17} aria-hidden />
            Activity board
          </span>
          <h1 className="mt-4 text-4xl font-black text-ink">Aktivitas kampus</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
            Lihat rencana yang sedang dibuka, cek kuota peserta, lalu join aktivitas
            yang cocok dengan jadwalmu.
          </p>
        </div>

        <Link href="/activities/create" className="primary-button">
          <PlusCircle size={18} aria-hidden />
          Buat Activity
        </Link>
      </div>

      <SupabaseNotice />

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {(["Semua", ...ACTIVITY_CATEGORIES] as const).map((category) => {
          const selected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`min-w-fit rounded-full border px-4 py-2 text-sm font-black transition ${
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 bg-white text-ink/65 hover:border-campus/40 hover:text-campus"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="mt-6 rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-lg bg-white/70 shadow-card"
            />
          ))}
        </div>
      ) : filteredActivities.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={ClipboardList}
            title="Belum ada aktivitas"
            description="Activity pertama bisa dibuat dari tombol di atas. Coba flow demo Bindu untuk melihat jumlah peserta bertambah."
            action={
              <Link href="/activities/create" className="primary-button">
                <PlusCircle size={18} aria-hidden />
                Buat Activity
              </Link>
            }
          />
        </div>
      )}
    </main>
  );
}

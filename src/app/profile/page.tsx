"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarPlus, LockKeyhole, UserRound } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { SupabaseNotice } from "@/components/SupabaseNotice";
import { useAuth } from "@/components/AuthProvider";
import { formatDate } from "@/lib/format";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { ActivityWithMeta } from "@/lib/types";

type ActivityRow = Omit<ActivityWithMeta, "participant_count" | "has_joined"> & {
  activity_participants?: { user_id: string }[];
};

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [createdActivities, setCreatedActivities] = useState<ActivityWithMeta[]>([]);
  const [joinedActivities, setJoinedActivities] = useState<ActivityWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileActivities() {
      if (!user) {
        setLoading(false);
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const select = "*, spots(name, location), activity_participants(user_id)";

      const [{ data: createdData }, { data: participantRows }] = await Promise.all([
        supabase
          .from("activities")
          .select(select)
          .eq("creator_id", user.id)
          .order("activity_time", { ascending: true }),
        supabase
          .from("activity_participants")
          .select("activity_id")
          .eq("user_id", user.id)
      ]);

      const joinedIds = ((participantRows as { activity_id: string }[]) ?? []).map(
        (row) => row.activity_id
      );

      const { data: joinedData } =
        joinedIds.length > 0
          ? await supabase
              .from("activities")
              .select(select)
              .in("id", joinedIds)
              .order("activity_time", { ascending: true })
          : { data: [] };

      setCreatedActivities(mapActivities((createdData as ActivityRow[]) ?? [], user.id));
      setJoinedActivities(mapActivities((joinedData as ActivityRow[]) ?? [], user.id));
      setLoading(false);
    }

    if (!authLoading) {
      void loadProfileActivities();
    }
  }, [authLoading, user]);

  if (!authLoading && !user) {
    return (
      <main className="container-page py-10">
        <div className="mx-auto max-w-lg rounded-lg border border-ink/10 bg-white p-7 text-center shadow-card">
          <div className="mx-auto grid size-14 place-items-center rounded-lg bg-ink text-white">
            <LockKeyhole size={26} aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl font-black text-ink">Login dulu</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Profil menampilkan data user, activity dibuat, dan activity diikuti.
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
      <SupabaseNotice />

      <section className="mt-6 rounded-lg bg-ink p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-lg bg-white text-2xl font-black text-ink">
              {(profile?.name ?? user?.email ?? "M").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white/65">Profil mahasiswa</p>
              <h1 className="mt-1 text-3xl font-black">{profile?.name ?? user?.email}</h1>
              <p className="mt-1 text-sm font-semibold text-white/70">
                {profile?.major ?? "Jurusan belum diisi"}
                {profile?.semester ? ` · Semester ${profile.semester}` : ""}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-4 text-sm font-semibold text-white/80">
            Bergabung sejak{" "}
            {profile?.created_at ? formatDate(profile.created_at) : "hari ini"}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-campus/10 px-4 py-2 text-sm font-black text-campus">
              <CalendarPlus size={17} aria-hidden />
              Dibuat
            </p>
            <h2 className="mt-3 text-2xl font-black text-ink">Activity dibuat</h2>
          </div>
          <Link href="/activities/create" className="secondary-button">
            Buat lagi
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="h-72 animate-pulse rounded-lg bg-white/70 shadow-card" />
          </div>
        ) : createdActivities.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {createdActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarPlus}
            title="Belum membuat activity"
            description="Activity yang kamu buat akan muncul di sini."
          />
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-4 py-2 text-sm font-black text-coral">
            <UserRound size={17} aria-hidden />
            Diikuti
          </p>
          <h2 className="mt-3 text-2xl font-black text-ink">Activity diikuti</h2>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="h-72 animate-pulse rounded-lg bg-white/70 shadow-card" />
          </div>
        ) : joinedActivities.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {joinedActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UserRound}
            title="Belum join activity"
            description="Activity yang kamu join dari board akan muncul di sini."
          />
        )}
      </section>
    </main>
  );
}

function mapActivities(rows: ActivityRow[], userId: string) {
  return rows.map((activity) => {
    const participants = activity.activity_participants ?? [];

    return {
      ...activity,
      participant_count: participants.length,
      has_joined: participants.some((participant) => participant.user_id === userId)
    };
  });
}

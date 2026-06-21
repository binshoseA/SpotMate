"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  UsersRound
} from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { EmptyState } from "@/components/EmptyState";
import { SupabaseNotice } from "@/components/SupabaseNotice";
import { useAuth } from "@/components/AuthProvider";
import { formatDateTime } from "@/lib/format";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  Activity,
  ParticipantWithProfile,
  Profile,
  Spot
} from "@/lib/types";

type ActivityDetail = Activity & {
  spots?: Pick<Spot, "name" | "location" | "facilities" | "suitable_for"> | null;
};

export default function ActivityDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadActivity = useCallback(async () => {
    const supabase = getSupabaseClient();

    if (!supabase || !params?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data: activityData, error: activityError } = await supabase
      .from("activities")
      .select("*, spots(name, location, facilities, suitable_for)")
      .eq("id", params.id)
      .single();

    if (activityError || !activityData) {
      setError(activityError?.message ?? "Activity tidak ditemukan.");
      setLoading(false);
      return;
    }

    const { data: participantRows } = await supabase
      .from("activity_participants")
      .select("user_id, joined_at")
      .eq("activity_id", params.id)
      .order("joined_at", { ascending: true });

    const participantData = (participantRows as ParticipantWithProfile[]) ?? [];
    const profileIds = Array.from(
      new Set([
        (activityData as Activity).creator_id,
        ...participantData.map((participant) => participant.user_id)
      ])
    );

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, user_id, name, major, semester, created_at")
      .in("user_id", profileIds);

    const profileList = (profiles as Profile[]) ?? [];
    const creatorProfile =
      profileList.find(
        (profile) => profile.user_id === (activityData as Activity).creator_id
      ) ?? null;

    setActivity(activityData as ActivityDetail);
    setCreator(creatorProfile);
    setParticipants(
      participantData.map((participant) => ({
        ...participant,
        profile:
          profileList.find((profile) => profile.user_id === participant.user_id) ??
          null
      }))
    );
    setLoading(false);
  }, [params?.id]);

  useEffect(() => {
    void loadActivity();
  }, [loadActivity]);

  const alreadyJoined = useMemo(
    () =>
      user
        ? participants.some((participant) => participant.user_id === user.id)
        : false,
    [participants, user]
  );

  const isFull = activity
    ? participants.length >= activity.max_participants
    : false;

  async function handleJoin() {
    setStatus(null);

    const supabase = getSupabaseClient();
    if (!supabase || !user || !activity) {
      setStatus("Login dibutuhkan untuk join activity.");
      return;
    }

    if (alreadyJoined) {
      setStatus("Kamu sudah join activity ini.");
      return;
    }

    if (isFull) {
      setStatus("Kuota activity sudah penuh.");
      return;
    }

    setJoining(true);
    const { error: joinError } = await supabase
      .from("activity_participants")
      .insert({
        activity_id: activity.id,
        user_id: user.id
      });
    setJoining(false);

    if (joinError) {
      if (joinError.code === "23505") {
        setStatus("Kamu sudah join activity ini.");
      } else if (joinError.message.toLowerCase().includes("quota")) {
        setStatus("Kuota activity sudah penuh.");
      } else {
        setStatus(joinError.message);
      }
      return;
    }

    setStatus("Berhasil join activity.");
    await loadActivity();
  }

  if (loading) {
    return (
      <main className="container-page py-10">
        <div className="h-[32rem] animate-pulse rounded-lg bg-white/70 shadow-card" />
      </main>
    );
  }

  if (error || !activity) {
    return (
      <main className="container-page py-10">
        <SupabaseNotice />
        <div className="mt-6">
          <EmptyState
            icon={CalendarDays}
            title="Activity tidak tersedia"
            description={error ?? "Activity ini belum bisa dimuat."}
            action={
              <Link href="/activities" className="primary-button">
                Kembali ke board
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <SupabaseNotice />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.85fr]">
        <section className="card overflow-hidden">
          <div className="bg-ink p-6 text-white sm:p-8">
            <CategoryBadge category={activity.category} />
            <h1 className="mt-5 text-4xl font-black leading-tight">
              {activity.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/78">
              {activity.description}
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-8">
            <div className="rounded-lg bg-paper p-4">
              <CalendarDays className="text-campus" size={22} aria-hidden />
              <p className="mt-3 text-xs font-black uppercase text-ink/45">
                Waktu
              </p>
              <p className="mt-1 text-sm font-black text-ink">
                {formatDateTime(activity.activity_time)}
              </p>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <MapPin className="text-coral" size={22} aria-hidden />
              <p className="mt-3 text-xs font-black uppercase text-ink/45">
                Spot
              </p>
              <p className="mt-1 text-sm font-black text-ink">
                {activity.spots?.name ?? "Spot belum tersedia"}
              </p>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <UsersRound className="text-sky" size={22} aria-hidden />
              <p className="mt-3 text-xs font-black uppercase text-ink/45">
                Peserta
              </p>
              <p className="mt-1 text-sm font-black text-ink">
                {participants.length}/{activity.max_participants}
              </p>
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-8">
            <div className="h-3 rounded-full bg-ink/8">
              <div
                className="h-3 rounded-full bg-campus"
                style={{
                  width: `${Math.min(
                    100,
                    (participants.length / activity.max_participants) * 100
                  )}%`
                }}
              />
            </div>

            {activity.spots ? (
              <div className="mt-6 rounded-lg border border-ink/10 bg-white p-4">
                <p className="font-black text-ink">{activity.spots.location}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activity.spots.facilities.map((facility) => (
                    <span key={facility} className="chip">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="card p-5">
            <h2 className="text-xl font-black text-ink">Join activity</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Dibuat oleh{" "}
              <span className="font-black text-ink">
                {creator?.name ?? "Mahasiswa"}
              </span>
              {creator?.major ? `, ${creator.major}` : ""}.
            </p>

            {!user ? (
              <Link href="/login" className="primary-button mt-5 w-full">
                <LockKeyhole size={18} aria-hidden />
                Login untuk join
              </Link>
            ) : (
              <button
                type="button"
                className="primary-button mt-5 w-full"
                onClick={handleJoin}
                disabled={joining || alreadyJoined || isFull}
              >
                <CheckCircle2 size={18} aria-hidden />
                {joining
                  ? "Joining..."
                  : alreadyJoined
                    ? "Sudah Join"
                    : isFull
                      ? "Kuota Penuh"
                      : "Join Activity"}
              </button>
            )}

            {status ? (
              <p
                className={`mt-4 rounded-lg px-4 py-3 text-sm font-semibold ${
                  status.includes("Berhasil")
                    ? "bg-campus/10 text-emerald-700"
                    : "bg-coral/10 text-red-700"
                }`}
              >
                {status}
              </p>
            ) : null}
          </section>

          <section className="card p-5">
            <h2 className="text-xl font-black text-ink">Peserta</h2>
            <div className="mt-4 space-y-3">
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <div
                    key={participant.user_id}
                    className="flex items-center gap-3 rounded-lg bg-paper p-3"
                  >
                    <div className="grid size-10 place-items-center rounded-lg bg-campus text-sm font-black text-white">
                      {(participant.profile?.name ?? "M").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-ink">
                        {participant.profile?.name ?? "Mahasiswa"}
                      </p>
                      <p className="text-xs font-semibold text-ink/55">
                        {participant.profile?.major ?? "Jurusan belum diisi"}
                        {participant.profile?.semester
                          ? ` · Semester ${participant.profile.semester}`
                          : ""}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-lg bg-paper p-4 text-sm font-semibold text-ink/60">
                  Belum ada peserta.
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

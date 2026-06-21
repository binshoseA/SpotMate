import Link from "next/link";
import { CalendarDays, MapPin, UsersRound } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDateTime } from "@/lib/format";
import type { ActivityWithMeta } from "@/lib/types";

export function ActivityCard({ activity }: { activity: ActivityWithMeta }) {
  const isFull = activity.participant_count >= activity.max_participants;

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="card group block overflow-hidden transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <CategoryBadge category={activity.category} />
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              isFull
                ? "bg-coral/15 text-red-700"
                : activity.has_joined
                  ? "bg-campus/15 text-emerald-700"
                  : "bg-ink/5 text-ink/65"
            }`}
          >
            {isFull ? "Penuh" : activity.has_joined ? "Joined" : "Open"}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-black text-ink transition group-hover:text-campus">
            {activity.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/65">
            {activity.description}
          </p>
        </div>

        <div className="mt-auto space-y-3 text-sm font-semibold text-ink/70">
          <p className="flex items-center gap-2">
            <CalendarDays size={17} className="text-campus" aria-hidden />
            {formatDateTime(activity.activity_time)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={17} className="text-coral" aria-hidden />
            {activity.spots?.name ?? "Spot belum tersedia"}
          </p>
          <div>
            <p className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <UsersRound size={17} className="text-sky" aria-hidden />
                Peserta
              </span>
              <span>
                {activity.participant_count}/{activity.max_participants}
              </span>
            </p>
            <div className="mt-2 h-2 rounded-full bg-ink/8">
              <div
                className="h-2 rounded-full bg-campus"
                style={{
                  width: `${Math.min(
                    100,
                    (activity.participant_count / activity.max_participants) *
                      100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

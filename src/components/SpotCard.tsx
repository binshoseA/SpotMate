import { Building2, MapPin } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Spot } from "@/lib/types";

const spotVisuals = [
  "linear-gradient(135deg, rgba(21, 165, 138, 0.90), rgba(90, 180, 246, 0.86))",
  "linear-gradient(135deg, rgba(255, 107, 95, 0.88), rgba(248, 193, 74, 0.88))",
  "linear-gradient(135deg, rgba(24, 36, 44, 0.90), rgba(21, 165, 138, 0.82))",
  "linear-gradient(135deg, rgba(90, 180, 246, 0.90), rgba(248, 193, 74, 0.82))"
];

export function SpotCard({ spot, index = 0 }: { spot: Spot; index?: number }) {
  const visual = spotVisuals[index % spotVisuals.length];
  const backgroundImage = spot.image_url
    ? `linear-gradient(135deg, rgba(24,36,44,0.55), rgba(24,36,44,0.18)), url(${spot.image_url})`
    : visual;

  return (
    <article className="card overflow-hidden">
      <div
        className="relative flex h-36 items-end bg-cover bg-center p-4 text-white"
        style={{ backgroundImage }}
      >
        <div className="absolute right-4 top-4 grid size-10 place-items-center rounded-lg bg-white/20 backdrop-blur">
          <Building2 size={21} aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-black">{spot.name}</h2>
          <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-white/90">
            <MapPin size={15} aria-hidden />
            {spot.location}
          </p>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <p className="text-sm leading-6 text-ink/70">{spot.description}</p>

        <div>
          <p className="mb-2 text-xs font-black uppercase text-ink/45">
            Cocok untuk
          </p>
          <div className="flex flex-wrap gap-2">
            {spot.suitable_for.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-black uppercase text-ink/45">
            Fasilitas
          </p>
          <div className="flex flex-wrap gap-2">
            {spot.facilities.map((facility) => (
              <span key={facility} className="chip">
                {facility}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

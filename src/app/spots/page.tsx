"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link"; // <--- INI PENTING! HARUS ADA
import { Filter, MapPinned, SearchX, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { SpotCard } from "@/components/SpotCard";
import { SupabaseNotice } from "@/components/SupabaseNotice";
import { demoSpots, SPOT_FACILITIES } from "@/lib/constants";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Spot, SpotFacility } from "@/lib/types";

export default function SpotsPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<SpotFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... (useEffect, filteredSpots, toggleFacility tetap sama)
  useEffect(() => {
    async function loadSpots() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setSpots(demoSpots);
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("spots")
        .select("*")
        .order("name");
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setSpots((data as Spot[]) ?? []);
      }
      setLoading(false);
    }
    void loadSpots();
  }, []);

  const filteredSpots = useMemo(() => {
    if (selectedFacilities.length === 0) return spots;
    return spots.filter((spot) =>
      selectedFacilities.every((facility) => spot.facilities.includes(facility))
    );
  }, [selectedFacilities, spots]);

  function toggleFacility(facility: SpotFacility) {
    setSelectedFacilities((current) =>
      current.includes(facility)
        ? current.filter((item) => item !== facility)
        : [...current, facility]
    );
  }

  return (
    <main className="container-page py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-campus/10 px-4 py-2 text-sm font-black text-campus">
            <MapPinned size={17} aria-hidden />
            Spot kampus
          </span>
          <h1 className="mt-4 text-4xl font-black text-ink">Cari spot yang cocok</h1>
        </div>

        {/* Struktur Div yang diperbaiki */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/spots/create" 
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-campus px-4 py-2 text-sm font-bold text-white transition hover:bg-campus/90"
          >
            <Plus size={17} />
            Tambah Spot
          </Link>

          <div className="card p-4">
            <p className="flex items-center gap-2 text-sm font-black text-ink">
              <Filter size={17} className="text-campus" aria-hidden />
              Filter fasilitas
            </p>
            <div className="mt-3 flex max-w-3xl flex-wrap gap-2">
              {SPOT_FACILITIES.map((facility) => {
                const selected = selectedFacilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                      selected
                        ? "border-campus bg-campus text-white"
                        : "border-ink/10 bg-white text-ink/65 hover:border-campus/40 hover:text-campus"
                    }`}
                  >
                    {facility}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ... (sisa kode SupabaseNotice, error, loading, dan list tetap sama) */}
      <SupabaseNotice />
      {/* ... (lanjutkan bagian bawah list spot kamu) ... */}
    </main>
  );
}
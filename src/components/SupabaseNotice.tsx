import { AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function SupabaseNotice({ compact = false }: { compact?: boolean }) {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border border-mango/50 bg-mango/15 text-yellow-950 ${
        compact ? "p-4 text-sm" : "p-5"
      }`}
    >
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden />
        <div>
          <p className="font-bold">Supabase belum dikonfigurasi.</p>
          <p className="mt-1 text-sm leading-6 text-yellow-950/80">
            Isi <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> dan{" "}
            <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> di
            file <span className="font-mono">.env.local</span> agar auth,
            activity, dan join tersambung ke database.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { SupabaseNotice } from "@/components/SupabaseNotice";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FUNGSI FORGOT PASSWORD ---
  async function handleForgotPassword() {
    if (!email) {
      alert("Masukkan email kamu terlebih dahulu!");
      return;
    }
    const supabase = getSupabaseClient();
    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) setStatus(error.message);
    else alert("Cek email kamu untuk link reset password!");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus("Supabase belum dikonfigurasi.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setStatus(error.message);
      return;
    }
    router.push("/activities");
  }

  return (
    <main className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-lg bg-campus text-white shadow-card">
            <ShieldCheck size={27} aria-hidden />
          </div>
          <h1 className="mt-5 text-3xl font-black text-ink">Masuk ke SpotMate</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Lanjutkan cari aktivitas kampus dan spot yang cocok buat rencana hari ini.
          </p>
        </div>

        <div className="card p-5 sm:p-7">
          <SupabaseNotice compact />

          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="field-label">Email</span>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="bindu@kampus.ac.id"
                required
              />
            </label>

            <label className="block">
              <span className="field-label">Password</span>
              <input
                className="field-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
              {/* --- LINK FORGOT PASSWORD DI SINI --- */}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-campus hover:underline"
                >
                  Lupa password?
                </button>
              </div>
            </label>

            {status ? (
              <p className="rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-red-700">
                {status}
              </p>
            ) : null}

            <button
              type="submit"
              className="primary-button w-full"
              disabled={loading || !isSupabaseConfigured()}
            >
              <Mail size={18} aria-hidden />
              {loading ? "Masuk..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink/65">
            Belum punya akun?{" "}
            <Link className="font-black text-campus" href="/register">
              Daftar sekarang <ArrowRight className="inline" size={14} aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
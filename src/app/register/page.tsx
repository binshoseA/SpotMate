"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Sparkles, UserPlus } from "lucide-react";
import { SupabaseNotice } from "@/components/SupabaseNotice";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [semester, setSemester] = useState("3");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setSuccess(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus("Supabase belum dikonfigurasi.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          major,
          semester
        }
      }
    });

    if (error) {
      setLoading(false);
      setStatus(error.message);
      return;
    }

    if (data.user && data.session) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          user_id: data.user.id,
          name,
          major,
          semester: Number(semester)
        },
        { onConflict: "user_id" }
      );

      if (profileError) {
        setLoading(false);
        setStatus(profileError.message);
        return;
      }
    }

    setLoading(false);

    if (data.session) {
      router.push("/spots");
      return;
    }

    setSuccess("Akun dibuat. Cek email kampus untuk konfirmasi sebelum login.");
  }

  return (
    <main className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-lg bg-coral text-white shadow-card">
            <UserPlus size={27} aria-hidden />
          </div>
          <h1 className="mt-5 text-3xl font-black text-ink">Buat akun mahasiswa</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Data profil dipakai agar peserta lain tahu nama, jurusan, dan semester kamu.
          </p>
        </div>

        <div className="card p-5 sm:p-7">
          <SupabaseNotice compact />

          <form className="mt-5 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block sm:col-span-2">
              <span className="field-label">Nama</span>
              <input
                className="field-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Bindu"
                required
              />
            </label>

            <label className="block">
              <span className="field-label">Jurusan</span>
              <input
                className="field-input"
                value={major}
                onChange={(event) => setMajor(event.target.value)}
                placeholder="Ilmu Komputer"
                required
              />
            </label>

            <label className="block">
              <span className="field-label">Semester</span>
              <input
                className="field-input"
                type="number"
                min={1}
                max={14}
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
                required
              />
            </label>

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
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
            </label>

            {status ? (
              <p className="rounded-lg bg-coral/10 px-4 py-3 text-sm font-semibold text-red-700 sm:col-span-2">
                {status}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-lg bg-campus/10 px-4 py-3 text-sm font-semibold text-emerald-700 sm:col-span-2">
                {success}
              </p>
            ) : null}

            <button
              type="submit"
              className="primary-button sm:col-span-2"
              disabled={loading || !isSupabaseConfigured()}
            >
              <Sparkles size={18} aria-hidden />
              {loading ? "Membuat akun..." : "Daftar"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink/65">
            Sudah punya akun?{" "}
            <Link className="font-black text-campus" href="/login">
              Login <ArrowRight className="inline" size={14} aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

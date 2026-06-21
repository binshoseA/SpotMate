"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const supabase = getSupabaseClient();
    const { error } = await supabase!.auth.updateUser({ password: password });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Password berhasil diubah!");
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <main className="container-page py-16 flex justify-center">
      <div className="card p-7 max-w-md w-full">
        <h1 className="text-2xl font-black mb-4">Buat Password Baru</h1>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            className="field-input w-full border p-2 rounded"
            placeholder="Masukkan password baru"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="primary-button w-full bg-campus text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
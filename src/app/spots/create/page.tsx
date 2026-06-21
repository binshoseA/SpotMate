"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateSpotPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
                                                
  async function handleAddSpot(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setLoading(true);

  // 1. Ambil client di sini, bukan di atas!
  const supabase = getSupabaseClient(); 
  if (!supabase) {
    alert("Supabase belum terkonfigurasi!");
    setLoading(false);
    return;
  }

  const formData = new FormData(event.currentTarget);
  const file = formData.get("image") as File;
  
  // 2. Cek file
  if (!file || file.size === 0) {
    alert("Pilih file gambar dulu!");
    setLoading(false);
    return;
  }

  // 3. Upload ke Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('spots')
    .upload(fileName, file);

  if (uploadError) {
    alert("Upload gagal: " + uploadError.message);
    setLoading(false);
    return;
  }

  // 4. Ambil URL & Insert ke Database
  const { data: urlData } = supabase.storage.from('spots').getPublicUrl(fileName);

  const { error: dbError } = await supabase.from('spots').insert({
    name: formData.get("name"),
    description: formData.get("description"),
    location: formData.get("location"),
    image_url: urlData.publicUrl,
  });

  if (dbError) {
    alert("Database error: " + dbError.message);
  } else {
    alert("Berhasil!");
    router.push("/spots");
  }
  setLoading(false);
}

  return (
    <main className="container-page py-16">
      <form onSubmit={handleAddSpot} className="max-w-lg mx-auto card p-8 space-y-4">
        <h1 className="text-2xl font-black">Tambah Spot Baru</h1>
        
        <div>
          <label className="block text-sm font-bold">Nama Spot</label>
          <input name="name" className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-bold">Lokasi</label>
          <input name="location" className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-bold">Deskripsi</label>
          <textarea name="description" className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-bold">Foto Spot</label>
          <input type="file" name="image" accept="image/*" className="w-full" required />
        </div>
        
        <button 
          disabled={loading} 
          className="w-full primary-button bg-campus text-white p-2 rounded"
        >
          {loading ? "Menyimpan..." : "Tambah Spot"}
        </button>
      </form>
    </main>
  );
}
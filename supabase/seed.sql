insert into public.spots (
  name,
  description,
  location,
  facilities,
  suitable_for,
  image_url
)
values
  (
    'Perpustakaan',
    'Spot tenang untuk fokus belajar, baca referensi, dan ngerjain tugas.',
    'Gedung Perpustakaan Pusat',
    array['Wi-Fi', 'AC', 'Colokan', 'Sunyi', 'Indoor'],
    array['Belajar', 'Nugas'],
    null
  ),
  (
    'Taman Kampus',
    'Area terbuka yang enak buat kumpul sore, main ringan, atau pemanasan.',
    'Taman tengah kampus',
    array['Outdoor', 'Luas', 'Boleh ngobrol'],
    array['Main', 'Olahraga', 'Hangout'],
    null
  ),
  (
    'Kantin',
    'Ramai, santai, dan dekat makanan buat diskusi sambil isi energi.',
    'Kantin fakultas',
    array['Dekat kantin', 'Boleh ngobrol', 'Indoor'],
    array['Hangout', 'Diskusi', 'Nugas'],
    null
  ),
  (
    'Selasar Gedung',
    'Tempat fleksibel untuk nugas bareng atau ngobrol setelah kelas.',
    'Selasar gedung kuliah',
    array['Colokan', 'Boleh ngobrol', 'Indoor'],
    array['Nugas', 'Diskusi', 'Hangout'],
    null
  ),
  (
    'Lapangan',
    'Ruang luas untuk olahraga, main, atau acara kecil komunitas kampus.',
    'Lapangan utama',
    array['Outdoor', 'Luas'],
    array['Olahraga', 'Main', 'Event kecil'],
    null
  ),
  (
    'Ruang Kelas Kosong',
    'Cocok untuk diskusi kelompok, belajar bareng, dan event kecil.',
    'Gedung kelas lantai 2',
    array['Indoor', 'Luas', 'AC', 'Boleh ngobrol'],
    array['Diskusi', 'Belajar', 'Event kecil'],
    null
  )
on conflict (name) do update
set description = excluded.description,
    location = excluded.location,
    facilities = excluded.facilities,
    suitable_for = excluded.suitable_for,
    image_url = excluded.image_url;

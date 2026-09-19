# AI Analisis Rambutan Lapangan

Aplikasi lapangan berbasis web untuk perencanaan, pemeriksaan, pengendalian, evaluasi, dan analisis kesehatan 12 pohon rambutan selama 365 hari.

## Fitur

- Jadwal pemeriksaan setiap 3 hari selama 365 hari
- Pencatatan kondisi 12 pohon dalam kelompok A-D
- Pemeriksaan tanah, daun, tunas, bunga, buah, hama, dan gulma
- Pengukuran tinggi, lingkar batang, dan kelembapan
- Skor kesehatan 0-100% untuk setiap pohon
- Analisis tren dan tingkat keyakinan data
- Deteksi risiko dan rekomendasi tindakan
- Laporan siap disimpan sebagai PDF
- Penyimpanan lokal dan pencadangan data JSON
- Progressive Web App dengan dukungan penggunaan offline

## Algoritma

Versi saat ini menggunakan **Explainable Hybrid AI Scoring**: sistem berbasis aturan agronomi, pembobotan indikator, normalisasi skor, analisis tren riwayat, dan penghitungan tingkat keyakinan data. Model ini transparan dan belum diklaim sebagai deep learning terlatih. Data pemeriksaan yang terkumpul dapat menjadi dasar pelatihan model machine learning pada tahap selanjutnya.

## Menjalankan

Buka proyek melalui web server lokal, misalnya:

```bash
python3 -m http.server 8080
```

Kemudian buka `http://localhost:8080`.

## Aplikasi aktif

https://rambutan-lapangan.xmuammar.chatgpt.site

## Pengembang

Muammar, SST, M.Kom

> Data pemeriksaan pengguna disimpan di browser perangkat dan tidak disertakan dalam repository ini.

# Bukittinggi Heritage

Situs pengalaman digital untuk menjelajahi sejarah, budaya, kuliner, dan pariwisata Bukittinggi. Proyek ini mengimplementasikan desain **Bukittinggi Heritage** dari Figma sebagai aplikasi React responsif, lengkap dengan AI Travel Planner dan RancakBot.

## Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router
- Vercel Serverless Functions
- Gemini API untuk RancakBot dan Travel Planner

## Menjalankan proyek

### Prasyarat

- Node.js 20 atau lebih baru
- npm

### Instalasi

```bash
npm ci
cp .env.example .env
```

Isi `GEMINI_API_KEY` di `.env` jika ingin menguji fitur AI. Jangan commit file `.env`.

### Development

Jalankan API lokal pada terminal pertama:

```bash
npm run dev:api
```

Jalankan frontend pada terminal kedua:

```bash
npm run dev
```

Buka `http://localhost:5173`. Vite meneruskan request `/api/*` ke server lokal pada port `3001`.

Frontend tetap dapat digunakan tanpa API key. RancakBot dan Travel Planner memiliki fallback lokal ketika endpoint AI tidak tersedia.

## Quality checks

```bash
npm run lint
npm run build
```

Build produksi tersedia di folder `dist/`.

## Struktur utama

```text
api/                    Serverless functions dan API server lokal
src/components/         Halaman dan komponen UI
src/context/            State mode, bahasa, dan musik
src/data/               Konten heritage
src/hooks/              Hook animasi dan interaksi
src/lib/                Klien AI dan generator PDF
src/assets/             Gambar, ikon, audio, dan model 3D
```

## Halaman

- `/` — landing page Bukittinggi Heritage
- `/sejarah` — linimasa sejarah
- `/budaya` — eksplorasi budaya
- `/kuliner` — kuliner khas
- `/travel-planner` — AI Travel Planner
- `/game` — permainan interaktif

## Environment variables

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `GEMINI_API_KEY` | Untuk fitur AI | API key Gemini; hanya digunakan di server |
| `GEMINI_MODEL` | Tidak | Model Gemini, default `gemini-3.1-flash-lite` |

## Deployment

Konfigurasi `vercel.json` sudah menyertakan SPA rewrite. Tambahkan `GEMINI_API_KEY` sebagai environment variable pada project Vercel sebelum deployment agar fitur AI aktif.

## Design source

Figma: [Bukittinggi Heritage](https://www.figma.com/design/6GmusBiaoRHmm20A1qslEm/Bukittinggi-Heritage)

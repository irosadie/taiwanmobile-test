# 🛒 Taiwan Mobile — Simple Shopping Cart (精品商店)

Aplikasi toko online dan keranjang belanja (Simple Shopping Cart) yang dibangun menggunakan arsitektur modern **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **TanStack React Query**, dan komponen **shadcn/ui berbasis Radix UI**, direkonstruksi berdasarkan spesifikasi desain referensi pada `docs/index.html`.

Aplikasi ini mencakup 8 produk orisinal dengan harga NT$, pencarian produk secara *debounced*, pengatur kuantitas (*stepper* & input numerik), notifikasi aksi belanja (*toast*), konfirmasi penghapusan item keranjang, dan simulasi *checkout* dengan validasi data di sisi server.

---

## 📋 Prasyarat Sistem (Prerequisites)

Pastikan lingkungan lokal Anda telah terpasang:

- **Node.js**: versi `20.9.0` atau yang lebih baru
- **npm**: package manager yang digunakan proyek ini
- **Git**

Periksa versi yang terpasang di terminal Anda:
```bash
node -v
npm -v
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Kloning Repository (Jika belum)

```bash
git clone https://github.com/irosadie/taiwanmobile-test.git
cd taiwanmobile-test
```

### 2. Instalasi Dependensi

Instal seluruh paket dependensi monorepo untuk aplikasi (`apps/web`) dan paket penunjang (`packages/*`):

```bash
npm install
```

### 3. Menjalankan Mode Pengembangan (Development)

Untuk menjalankan server pengembangan lokal:

```bash
npm run dev
```

Setelah server aktif, buka browser dan akses salah satu alamat berikut:

- **`http://localhost:3000`** (langsung menampilkan halaman toko/produk)
- **`http://localhost:3000/products`**

> **Catatan:** State keranjang belanja disimpan pada memory sesi browser (client state) dan akan ter-reset saat halaman di-reload penuh. Simulasi *checkout* tidak memproses pembayaran riil.

---

## 🏗️ Menjalankan Mode Produksi (Production Build)

Untuk menguji performa dan kesiapan produksi aplikasi:

```bash
# 1. Build aplikasi Next.js
npm run build

# 2. Jalankan server produksi
npm start
```

Aplikasi siap diakses pada `http://localhost:3000`.

---

## 🧪 Pengujian & Verifikasi Kualitas (Testing & QA)

Repositori ini dilengkapi dengan pengecekan statis (TypeScript), unit testing (Vitest), dan pengujian alur interaksi end-to-end (Playwright).

### 1. Pengecekan Type (TypeScript Typecheck)
Memvalidasi konsistensi tipe data di seluruh workspace (`apps/web`, `packages/types`, `packages/schemas`):
```bash
npm run typecheck
```

### 2. Unit Testing (Vitest)
Menjalankan pengujian fungsi utilitas, skema Zod, dan logika API toko:
```bash
# Jalankan test sekali (run mode)
npm test

# Atau jalankan test dengan mode pemantauan interaktif (watch mode)
npm run test:watch
```

### 3. End-to-End Testing (Playwright)
Menguji skenario pengguna secara nyata (pencarian, penambahan produk, perubahan kuantitas stepper, dialog hapus, dan checkout):

```bash
# Unduh binary browser Chromium untuk Playwright (hanya diperlukan sekali)
npx playwright install chromium

# Jalankan pengujian E2E
npm run test:e2e
```
Playwright secara otomatis menjalankan server pengujian di port 3100. Jika aplikasi sudah berjalan di port 3000, gunakan server tersebut agar tidak menjalankan dua server pengembangan pada workspace yang sama:

```bash
SHOP_E2E_BASE_URL=http://localhost:3000 npm run test:e2e
```

Cakupan E2E meliputi pencarian dan sinkronisasi URL, kuantitas kelipatan, dialog penghapusan, checkout berhasil/gagal, pemulihan katalog setelah request gagal, serta grid responsif tanpa overflow.

---

## 📁 Struktur Monorepo & Arsitektur

Proyek ini menggunakan struktur monorepo npm workspaces:

```text
taiwanmobile/
├── apps/
│   └── web/                               # Aplikasi utama Next.js (App Router)
│       ├── app/
│       │   ├── (shop)/products/           # Halaman utama produk & katalog
│       │   ├── api/proxy/[...path]/       # Route handler proxy untuk API simulasi toko
│       │   ├── layout.tsx                 # Root layout & penyedia styling
│       │   └── page.tsx                   # Suspense wrapper untuk halaman toko/produk
│       ├── components/
│       │   ├── ui/                        # Komponen UI primitif (Radix UI + Tailwind)
│       │   └── skeletons/                 # Skeleton loading states
│       ├── hooks/
│       │   ├── transactions/              # React Query hooks (katalog & checkout)
│       │   └── utility/                   # Debounce dan sinkronisasi parameter URL
│       ├── server/                        # Data katalog produk & business logic server
│       ├── services/axios/                # Klien HTTP Axios terintegrasi dengan endpoint proxy
│       └── utils/                         # Fungsi pembantu (format mata uang NT$, debounce, cn)
├── packages/
│   ├── schemas/                           # Validasi skema runtime menggunakan Zod
│   └── types/                             # Definisi tipe data TypeScript bersama
├── e2e/                                   # Skenario pengujian Playwright end-to-end
├── docs/
│   └── index.html                         # Mockup/dokumen referensi desain asli
├── playwright.config.ts                   # Konfigurasi Playwright E2E
└── vitest.config.mts                      # Konfigurasi Vitest Unit Testing
```

---

## 💡 Fitur Utama Aplikasi

1. **Katalog Produk**: Menampilkan 8 produk referensi dengan nama, harga NT$, dan placeholder gambar yang sama dengan HTML asli.
2. **Pencarian Produk (Debounced)**: Memfilter nama produk setelah jeda 300ms, menyinkronkan kata pencarian ke URL, dan menyediakan tombol untuk menghapus pencarian.
3. **Pengaturan Kuantitas Presisi**: Tombol penambahan/pengurangan kuantitas (*stepper*) dan input manual yang tervalidasi (rentang 1 - 99).
4. **Notifikasi Keranjang (Toast)**: Umpan balik visual interaktif menggunakan Sonner saat produk berhasil ditambahkan ke keranjang.
5. **Konfirmasi Penghapusan Item**: Dialog muncul saat pengguna memilih hapus atau mengurangi jumlah menjadi 0; membatalkan dialog mempertahankan item dan jumlah sebelumnya.
6. **Simulasi Checkout**: Dialog ringkasan pesanan, validasi kuantitas dan perhitungan harga di server, serta proses simulasi 2 detik. Keranjang dikosongkan saat berhasil dan dipertahankan saat request gagal.
7. **Desain Responsif**: Grid 1 kolom di ponsel, 2 kolom pada lebar ≥640px, dan 4 kolom pada lebar ≥1024px.
8. **Total Keranjang**: Badge dan ringkasan menghitung total unit seluruh produk, bukan hanya jumlah jenis produk, beserta total harga.


## Kesesuaian dengan Desain Asli

[docs/index.html](docs/index.html) menjadi acuan visual: container putih maksimal 1200px, header abu-abu gelap, harga/tombol keranjang berwarna coral, tombol tambah hijau, kartu sederhana dengan placeholder gambar, serta drawer putih selebar maksimal 400px.

Pencarian ditempatkan di header dan kontrol kuantitas di baris harga. Dialog dan toast melengkapi fitur wajib. Hero, footer, dan ilustrasi produk tambahan tidak digunakan. Perbandingan visual dan hasil verifikasi tersedia di [design-qa.md](design-qa.md).

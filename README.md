# NoteKu — Catatan Kuliah

Repository: https://github.com/fardanufibri25/NoteKu  
Produksi: https://noteku-rho.vercel.app

PWA catatan kuliah untuk mahasiswa. Catatan dibuat, dibaca, diedit, dihapus, dicari, dan
difilter berdasarkan mata kuliah. Seluruh data disimpan di **IndexedDB** perangkat sehingga
aplikasi tetap berfungsi saat offline.

Tugas akhir Praktikum Pengembangan Perangkat Bergerak (PPB) — Modul 5.

## Identitas

| | |
|---|---|
| Nama | Fardanu Fibri Alfarizi |
| NIM | 21120124110105 |
| Kelompok | 35 |
| Program Studi | Teknik Komputer |
| Universitas | Universitas Diponegoro |

## Teknologi

- **React 19** + **Vite 8**
- **Tailwind CSS 3.4** — token warna, tipografi, dan spacing mengikuti desain Stitch
- **vite-plugin-pwa 2** (Workbox) — manifest, service worker, precache
- **IndexedDB** native — penyimpanan catatan, tanpa backend
- **Hash routing** (`#/notes`, `#/profile`, ...) — refresh di Vercel tidak 404
- Font **Inter** dan **Material Symbols Outlined** di-self-host agar ikon tetap tampil offline
- `oxlint` + unit test Node (`node:test` + `fake-indexeddb`)

## Fitur

- **Dashboard** — ringkasan jumlah catatan & mata kuliah, catatan terbaru, akses cepat, pencarian.
- **Daftar Catatan** — daftar seluruh catatan, pencarian judul/isi, filter mata kuliah, edit, hapus.
- **Detail Catatan** — judul, mata kuliah, tanggal dibuat/diubah, estimasi baca, isi lengkap.
- **Form Tambah/Edit** — validasi judul (min. 5 karakter) dan isi wajib, pilihan mata kuliah
  (termasuk mata kuliah baru), simpan/batal dengan konfirmasi perubahan.
- **Profil Mahasiswa** — identitas, statistik catatan, status PWA, penyimpanan, install, export JSON.
- **CRUD** — create, read, update, delete dengan dialog konfirmasi; perubahan langsung terlihat di
  dashboard dan daftar.
- **Offline-first** — data tetap tersedia setelah refresh/tutup aplikasi; CRUD berjalan tanpa internet.
- **PWA** — dapat di-install, manifest valid, service worker mencache aset aplikasi.

## Menjalankan

Butuh Node.js 20.19+ (atau 22.12+).

```bash
npm install
npm run dev       # http://localhost:5173
```

Perintah lain:

```bash
npm run lint      # oxlint
npm test          # unit test IndexedDB
npm run build     # produksi ke dist/
npm run preview   # jalankan hasil build di http://localhost:4173
```

> Service worker hanya aktif di `localhost` (secure context) atau HTTPS. Untuk menguji PWA,
> gunakan `npm run preview` atau hasil deployment Vercel, bukan membuka file `dist/index.html`
> langsung.

## Rute

| Rute | Halaman |
|---|---|
| `#/` | Dashboard |
| `#/notes` | Daftar catatan |
| `#/notes/:id` | Detail catatan |
| `#/new` | Form catatan baru |
| `#/notes/:id/edit` | Form edit catatan |
| `#/profile` | Profil mahasiswa |

## Menguji offline

1. Jalankan `npm run preview`, buka `http://localhost:4173`.
2. Tunggu halaman selesai dimuat (service worker melakukan precache aset).
3. Buka DevTools → **Application → Service Workers**, pastikan status *activated*.
4. Di DevTools → **Network**, pilih **Offline**.
5. Refresh halaman. Aplikasi tetap terbuka, banner kuning "Mode luring aktif" muncul.
6. Tambah/edit/hapus catatan, lalu refresh lagi — perubahan tetap ada karena tersimpan di IndexedDB.
7. Matikan mode offline. Data tetap utuh (aplikasi tidak memakai server).

Catatan: buka aplikasi sekali saat online agar service worker dan aset ter-cache.

## Install sebagai PWA

- **Chrome/Edge desktop**: ikon install di address bar, atau menu ⋮ → *Install NoteKu*.
- **Android Chrome**: menu ⋮ → *Add to Home screen / Install app*.
- **iOS Safari**: Share → *Add to Home Screen*.

Tombol **Install NoteKu** di halaman Profil muncul saat browser mendukung prompt instalasi.

## Deploy ke Vercel

Aplikasi sudah dideploy ke produksi:

**https://noteku-rho.vercel.app**

Untuk men-deploy ulang dari folder ini:

1. Install Vercel CLI lalu login:
   ```bash
   npm i -g vercel
   vercel login
   ```
2. Dari folder proyek:
   ```bash
   vercel --name noteku        # deploy preview
   vercel --prod --name noteku # deploy produksi
   ```
   Opsi `--name` diperlukan karena nama folder `ResponsiMod5` mengandung huruf besar.
   Jika proyek sudah di-link (folder `.vercel` ada), cukup jalankan `vercel --prod`.
3. Atau import repository GitHub di [vercel.com/new](https://vercel.com/new). Vercel mendeteksi
   Vite otomatis:
   - Build command: `npm run build`
   - Output directory: `dist`

`vercel.json` sudah berisi SPA fallback dan header `Cache-Control` untuk `sw.js`, sehingga:
- refresh di rute apa pun tetap membuka aplikasi (tidak 404),
- service worker tidak tertahan cache lama.

PWA memerlukan HTTPS; Vercel menyediakannya otomatis. Manifest dan service worker dapat diakses di
`/manifest.webmanifest` dan `/sw.js`.

## Struktur

```
src/
  App.jsx                 # router hash + provider
  main.jsx                # entry, registrasi service worker
  index.css               # Tailwind + font ikon + safe-area
  context/                # NotesContext (data), ToastContext (notifikasi)
  hooks/                  # useHashRoute, useOnlineStatus, useInstallPrompt
  lib/
    db.js                 # IndexedDB: getAllNotes, putNote, deleteNoteById
    db.test.js            # unit test CRUD penyimpanan
    format.js             # tanggal id-ID, estimasi baca, warna mata kuliah
  components/             # Header, navigasi, kartu catatan, dialog, FAB, dll.
  pages/                  # Dashboard, NotesList, NoteDetail, NoteForm, Profile, NotFound
public/                   # logo, avatar, ikon PWA (192/512/maskable/apple)
```

Model data catatan:

```js
{ id, title, course, content, createdAt, updatedAt }
```

Data diurutkan berdasarkan `updatedAt` terbaru. Tidak ada data dummy — catatan dibuat oleh pengguna.

## Batasan

- Tidak ada backend/sinkronisasi cloud. Semua data hanya ada di browser/perangkat yang dipakai.
- Data tidak otomatis berpindah antar-browser atau antar-perangkat.
- Gunakan **Cadangkan Catatan (Export JSON)** di halaman Profil untuk backup manual.

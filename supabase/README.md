# Panduan Backend Supabase ChampionStore

Backend ChampionStore telah dikonfigurasikan dengan **Supabase** untuk menangani seluruh alur transaksi, katalog produk, data pelanggan, blacklist, dan pengaturan toko.

---

## 1. Menjalankan Database Migration (SQL Editor)

Agar semua tabel, indeks, RLS policy, bucket storage, dan initial seed data aktif di Supabase Anda:

1. Buka dashboard project Supabase Anda: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Masuk ke menu **SQL Editor** di sidebar kiri.
3. Buka file `supabase/schema.sql` di proyek ini, copy seluruh isinya, lalu paste ke SQL Editor.
4. Klik tombol **Run**.

---

## 2. Struktur Tabel Database

| Nama Tabel | Fungsi & Deskripsi |
| :--- | :--- |
| `products` | Katalog paket Robux, harga, nominal, kategori (`popular`, `promo`, `sultan`, `regular`), badge, stok, dan status aktif. |
| `orders` | Daftar semua pesanan masuk, username Roblox, nomor WhatsApp, paket yang dibeli, total bayar, metode pembayaran (`WEBSITE` / `WHATSAPP`), status (`Menunggu Bayar`, `Diproses`, `Selesai`, `Dibatalkan`), URL bukti transfer, dan catatan admin. |
| `customers` | Database pelanggan terdaftar, total pesanan, total belanja (GMV), tier (`Bronze`, `Silver`, `Gold`, `Sultan`), dan status blacklist. |
| `blacklist` | Daftar username Roblox / nomor WhatsApp yang diblokir oleh sistem atau admin karena pelanggaran / bukti transfer palsu. |
| `store_settings` | Konfigurasi toko, status buka/tutup toko, nomor WhatsApp CS, teks banner pengumuman promo, catatan admin, dan QRIS barcode URL. |
| `activity_logs` | Catatan histori aktivitas sistem dan aksi admin secara realtime. |

---

## 3. Storage Bucket

- **`payment-proofs`**: Menyimpan foto screenshot bukti transfer / QRIS yang diunggah oleh pelanggan saat checkout.

---

## 4. API Endpoints yang Tersedia

- `GET /api/orders` & `POST /api/orders` & `PATCH /api/orders`
- `GET /api/products` & `POST /api/products` & `DELETE /api/products`
- `GET /api/customers`
- `GET /api/blacklist` & `POST /api/blacklist` & `DELETE /api/blacklist`
- `GET /api/store` & `PATCH /api/store`
- `GET /api/admin/stats` & `GET /api/admin/logs`
- `POST /api/upload` (Upload foto bukti transfer ke Supabase Storage)
- `GET /api/setup-db` (Endpoint inisialisasi / re-seed data default ke Supabase)

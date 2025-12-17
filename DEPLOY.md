# 🚀 Deploy Portfolio ke Vercel

Panduan lengkap untuk deploy portfolio Next.js ke Vercel.

---

## 📋 Prasyarat

- Akun [GitHub](https://github.com)
- Akun [Vercel](https://vercel.com) (bisa login dengan GitHub)
- Project sudah di-push ke repository GitHub

---

## 🔧 Langkah 1: Push ke GitHub

Jika project belum ada di GitHub:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit - Portfolio website"

# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Push ke GitHub
git push -u origin main
```

---

## 🌐 Langkah 2: Deploy ke Vercel

### Opsi A: Via Website Vercel (Recommended)

1. **Buka [vercel.com](https://vercel.com)** dan login dengan GitHub

2. **Klik "Add New Project"**

3. **Import Repository**

   - Pilih repository portfolio dari daftar
   - Klik "Import"

4. **Configure Project**

   - **Project Name**: `portfolio` (atau nama yang diinginkan)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Klik "Deploy"**
   - Tunggu proses build selesai (± 1-3 menit)
   - Setelah selesai, kamu akan mendapat URL seperti: `https://portfolio-xxx.vercel.app`

### Opsi B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy (dari folder project)
cd D:\Vibing\portfolio
vercel

# Ikuti instruksi:
# - Set up and deploy? Y
# - Which scope? (pilih akun)
# - Link to existing project? N
# - Project name? portfolio
# - Directory? ./
# - Override settings? N

# Deploy ke production
vercel --prod
```

---

## ⚙️ Langkah 3: Konfigurasi Domain (Opsional)

### Custom Domain

1. Buka project di Vercel Dashboard
2. Pergi ke **Settings** → **Domains**
3. Tambahkan domain custom (contoh: `portfolio.com`)
4. Update DNS records sesuai instruksi Vercel:
   - **A Record**: `76.76.19.19`
   - **CNAME**: `cname.vercel-dns.com`

### Subdomain Gratis dari Vercel

Vercel memberikan subdomain gratis:

- `project-name.vercel.app`
- Bisa di-rename di Settings → Domains

---

## 🔄 Auto Deploy

Setelah terhubung dengan GitHub:

- ✅ **Production Deploy**: Otomatis saat push ke branch `main`
- ✅ **Preview Deploy**: Otomatis saat membuat Pull Request
- ✅ **Instant Rollback**: Bisa rollback ke deploy sebelumnya

---

## 📝 Environment Variables (Jika Diperlukan)

Jika project membutuhkan environment variables:

1. Buka Vercel Dashboard → Project → **Settings**
2. Pilih **Environment Variables**
3. Tambahkan variable yang diperlukan:

| Key                    | Value                     | Environment |
| ---------------------- | ------------------------- | ----------- |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Production  |

---

## 🐛 Troubleshooting

### Build Error

```bash
# Cek build lokal dulu
npm run build

# Jika error, fix errornya sebelum deploy
```

### Image Not Loading

Tambahkan domain di `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
```

### 404 on Refresh (Dynamic Routes)

Next.js App Router sudah handle ini otomatis di Vercel.

---

## 📊 Monitoring

Setelah deploy, kamu bisa monitor di Vercel Dashboard:

- **Analytics**: Traffic dan performa
- **Logs**: Runtime dan build logs
- **Speed Insights**: Core Web Vitals

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

## ✅ Checklist Deploy

- [ ] Code sudah di-push ke GitHub
- [ ] Build lokal berhasil (`npm run build`)
- [ ] Tidak ada error TypeScript
- [ ] Images menggunakan next/image
- [ ] Environment variables sudah di-set (jika ada)
- [ ] Domain sudah dikonfigurasi (jika custom domain)

---

**Happy Deploying! 🎉**

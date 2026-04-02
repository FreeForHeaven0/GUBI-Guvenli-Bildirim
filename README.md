# GÜBİ — Geliştirici Dokümantasyonu

> **Güvenli Bildir Anti-Zorbalık Platformu**  
> Bu döküman yazılım geliştiriciler için hazırlanmıştır.

---

## Projeye Genel Bakış

GÜBİ, 13–17 yaş arası öğrencilerin zorbalık olaylarını **tamamen anonim** olarak bildirmesine ve okul danışmanlarıyla **gizli randevu** almasına olanak tanıyan bir web uygulamasıdır. Sistem, öğrenci kimliğini hiçbir aşamada kaydetmez.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18 + Vite 8 |
| Yönlendirme | React Router v7 (HashRouter) |
| Stil | Vanilla CSS (özel tasarım sistemi) |
| Backend | json-server v1 (mock REST API) |
| Veritabanı | `db.json` (düz dosya) |
| Kimlik Oluşturma | uuid v4 |
| Deployment (Frontend) | GitHub Pages (`gh-pages` paketi) |
| Deployment (Backend) | Render.com (Web Service) |

---

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js v18+
- npm v9+

### 1. Repoyu klonla

```bash
git clone https://github.com/FreeForHeaven0/GUBI-Guvenli-Bildirim.git
cd GUBI-Guvenli-Bildirim
```

### 2. Bağımlılıkları yükle

```bash
npm install
```

### 3. Yerel geliştirme ortamı

Hem Vite hem de json-server aynı anda başlar:

```bash
npm run dev
```

| Servis | URL |
|--------|-----|
| Frontend (React) | http://localhost:5173 |
| Backend (json-server) | http://localhost:3001 |

> **Not:** `npm run dev` komutu her iki servisi `concurrently` ile aynı anda başlatır.

---

## Proje Yapısı

```
echo-app/
├── public/                    # Statik dosyalar (maskot görselleri)
│   ├── gubi-mascot.png
│   └── gubi-celebrate.png
├── src/
│   ├── components/
│   │   ├── MobileShell.jsx    # Tüm öğrenci sayfalarını saran mobil çerçeve
│   │   └── MobileShell.css
│   ├── context/
│   │   └── AuthContext.jsx    # Öğretmen kimlik doğrulama context'i
│   ├── pages/
│   │   ├── LandingPage.jsx    # Açılış sayfası
│   │   ├── StudentLogin.jsx   # TC Kimlik doğrulama
│   │   ├── TeacherLogin.jsx   # Öğretmen girişi
│   │   ├── student/
│   │   │   ├── Home.jsx               # Öğrenci ana sayfası
│   │   │   ├── FilterQuestions.jsx    # Zorbalık filtre soruları
│   │   │   ├── IncidentDetails.jsx    # Olay detayları formu
│   │   │   ├── PostReport.jsx         # Bildirim sonrası konfeti ekranı
│   │   │   ├── CounselorList.jsx      # Danışman seçim listesi
│   │   │   ├── Appointment.jsx        # Randevu saat seçimi
│   │   │   ├── AppointmentStatus.jsx  # Randevu durum sorgulama
│   │   │   ├── ThankYou.jsx           # Randevu tamamlama ekranı
│   │   │   └── NotBullying.jsx        # Zorbalık değil yönlendirmesi
│   │   └── admin/
│   │       ├── Dashboard.jsx           # Öğretmen kontrol paneli
│   │       ├── ReportDetail.jsx        # Rapor detay sayfası
│   │       ├── AppointmentManager.jsx  # Randevu yönetimi
│   │       └── AvailabilitySettings.jsx # Müsaitlik ayarları
│   ├── services/
│   │   └── api.js             # Tüm API çağrıları (json-server)
│   ├── App.jsx                # Rota tanımları
│   ├── main.jsx               # React kök bileşeni (HashRouter)
│   └── index.css              # Global CSS değişkenleri ve tokenlar
├── db.json                    # Mock veritabanı
├── render.yaml                # Render.com backend deployment ayarları
├── vite.config.js             # Vite yapılandırması
└── package.json
```

---

## Ortam Değişkenleri

### Yerel Geliştirme (`.env.development` — git'e dahil edilmez)

```env
VITE_API_URL=http://localhost:3001
```

### Üretim

Production build'inde `VITE_API_URL` tanımlı değilse `api.js` otomatik olarak Render URL'ini kullanır:

```js
const BASE = import.meta.env.VITE_API_URL || 'https://gubi-guvenli-bildirim.onrender.com'
```

---

## API Referansı

Tüm endpoint'ler `json-server` tarafından `db.json` üzerinden sunulur.

### Danışmanlar (`/counselors`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/counselors` | Tüm danışmanlar |
| GET | `/counselors/:id` | Tek danışman |
| PATCH | `/counselors/:id` | Müsaitlik veya bookedSlots güncelle |

### Raporlar (`/reports`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/reports?_sort=-createdAt` | Tüm raporlar (tarihe göre) |
| POST | `/reports` | Yeni bildirim oluştur |
| PATCH | `/reports/:id` | Rapor durumu güncelle |

### Randevular (`/appointments`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/appointments?_sort=-createdAt` | Tüm randevular |
| POST | `/appointments` | Yeni randevu talebi |
| PATCH | `/appointments/:id` | Durum / karşı teklif güncelle |

### Bildirimler (`/notifications`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/notifications?counselorId=c1` | Danışmana ait bildirimler |
| POST | `/notifications` | Yeni bildirim oluştur |
| PATCH | `/notifications/:id` | Okundu olarak işaretle |

### Öğrenciler (`/students`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/students` | TC doğrulama için tüm kayıtlar |

### Öğretmenler (`/teachers`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/teachers` | Giriş doğrulaması için |

---

## Veri Modelleri

### Counselor (Danışman)

```json
{
  "id": "c1",
  "name": "Ayşe Kaya",
  "title": "Psikolojik Danışman",
  "initials": "AK",
  "color": "#00BFA5",
  "email": "ayse.kaya@okul.edu.tr",
  "availability": {
    "Pazartesi": ["10:00", "10:15", "12:30"],
    "Salı": ["09:30", "15:15"]
  },
  "bookedSlots": [
    {
      "bookingId": "uuid-v4",
      "day": "Pazartesi",
      "slot": "10:00",
      "appointmentId": "appt-id",
      "bookedAt": "2026-04-03T..."
    }
  ]
}
```

### Report (Bildirim)

```json
{
  "id": "uuid",
  "anonymousCode": "ECH-2026-4521",
  "createdAt": "ISO8601",
  "isContinuous": true,
  "hasPowerImbalance": true,
  "isIntentional": true,
  "type": "Sözlü | Fiziksel | Siber | Sosyal Dışlama",
  "description": "...",
  "status": "Yeni | Doğrulandı | Takip Gerekiyor | Kapatıldı",
  "counselorId": "c1 | null"
}
```

### Appointment (Randevu)

```json
{
  "id": "uuid",
  "reportId": "report-id",
  "counselorId": "c1",
  "studentAnonymousCode": "ECH-2026-4521",
  "proposedSlot": "10:00",
  "day": "Pazartesi",
  "status": "Bekliyor | Onaylandı | Reddedildi | Karşı Teklif",
  "counterOfferSlots": ["10:15", "12:30"],
  "bookingId": "uuid-v4 | null",
  "duration": 15,
  "createdAt": "ISO8601"
}
```

---

## Önemli Tasarım Kararları

### Anonimlik Mimarisi

Öğrenci TC Kimlik numarası **sadece** okulun tespiti için kullanılır, hiçbir zaman kaydedilmez. Tüm raporlar ve randevular rastgele üretilen `anonymousCode` ile takip edilir. Danışman paneli yalnızca olay bilgilerini ve anonim kodu görebilir.

### Slot Kilit Sistemi (`bookingId`)

Bir randevu onaylandığında (`Onaylandı` statüsüne geçtiğinde):

1. `uuid()` ile benzersiz bir `bookingId` üretilir
2. Randevu kaydına `bookingId` eklenir
3. `bookSlot()` fonksiyonu ile danışmanın `bookedSlots` dizisine yeni giriş eklenir
4. Bu fonksiyon **idempotent**tir: aynı `appointmentId` için tekrar çağrılırsa işlem atlanır

Bu sayede:
- Öğrenci yeni randevu alırken dolu saatler görüntülenmez
- Danışman müsaitlik ekranında kilitli saatler 🔒 olarak gösterilir

### Karşı Teklif Akışı

```
Öğrenci     →  Bekliyor
Öğretmen    →  Karşı Teklif (max 3 saat önerilir)
Öğrenci     →  Saatlerden birini seçer → Onaylandı
              + bookSlot() çağrılır, saat kilitlenir
```

### Yönlendirme (HashRouter)

GitHub Pages, SPA yönlendirmesini desteklemediğinden `BrowserRouter` yerine `HashRouter` kullanılmaktadır. Tüm URL'ler `#` ile başlar (Örn: `/#/bildir/sorular`).

---

## Deployment

### Frontend — GitHub Pages

```bash
# Build ve deploy (tek komut)
$env:PATH = "D:\Git\bin;" + $env:PATH; npm run deploy
```

Bu komut sırasıyla:
1. `vite build` — `dist/` klasörünü oluşturur
2. `gh-pages -d dist` — `dist/` içeriğini `gh-pages` branch'ine push eder

> GitHub repo Ayarlar → Pages → Source: `gh-pages` branch olmalıdır.

**Canlı URL:** https://freeforheaven0.github.io/GUBI-Guvenli-Bildirim/

### Backend — Render.com

| Ayar | Değer |
|------|-------|
| Build Command | `npm install` |
| Start Command | `npm start` |
| Port | `$PORT` (Render tarafından otomatik atanır) |

`package.json` içindeki `start` scripti:
```json
"start": "json-server --watch db.json --port $PORT --host 0.0.0.0"
```

**Canlı URL:** https://gubi-guvenli-bildirim.onrender.com

> ⚠️ Render ücretsiz planda 15 dakika aktiflik olmadığında servis uyku moduna geçer. İlk istek ~30 saniye sürebilir.

---

## Scriptler

| Script | Açıklama |
|--------|----------|
| `npm run dev` | Frontend + backend eş zamanlı başlatır |
| `npm run dev:vite` | Sadece Vite frontend |
| `npm run dev:api` | Sadece json-server backend (port 3001) |
| `npm run build` | Production build (`dist/`) |
| `npm run deploy` | Build + GitHub Pages deploy |
| `npm start` | Render için backend başlatır |

---

## Demo Hesaplar

### Öğretmen Girişi

| Kullanıcı Adı | Şifre | Danışman |
|--------------|-------|---------|
| `ayse.kaya` | `demo123` | Ayşe Kaya (c1) |
| `mehmet.demir` | `demo123` | Mehmet Demir (c2) |
| `zeynep.arslan` | `demo123` | Zeynep Arslan (c3) |

### Öğrenci Girişi

`db.json` içindeki `students` dizisine TC numaraları eklenerek öğrenci hesapları oluşturulabilir:

```json
{
  "id": "s1",
  "tc": "12345678901",
  "schoolId": "OKL001"
}
```

---

## Katkıda Bulunmak

1. Bu repoyu fork'la
2. Yeni bir branch oluştur: `git checkout -b ozellik/yeni-ozellik`
3. Değişikliklerini commit'le: `git commit -m "Yeni özellik eklendi"`
4. Branch'ini push'la: `git push origin ozellik/yeni-ozellik`
5. Pull Request aç

---

*GÜBİ — Güvenli Bildir Anti-Zorbalık Platformu* 💜

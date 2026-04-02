# GÜBİ — Güvenli Bildir Anti-Zorbalık Platformu

<p align="center">
  <img src="public/gubi-mascot.png" width="100" alt="GÜBİ Maskot" />
</p>

GÜBİ is an anonymous anti-bullying reporting and counselor appointment platform designed for students aged 13–17. Students can report incidents completely anonymously and schedule confidential 15-minute sessions with school counselors.

---

## Features

- 🛡️ **Anonymous bullying reports** — no name, no ID stored
- 🤝 **Counselor appointment system** — propose, counter-offer, confirm
- 🔍 **Appointment status tracker** — students check status via anonymous code
- 📋 **Teacher dashboard** — manage reports, appointments, availability
- 🔒 **Slot booking** — confirmed appointments lock the time slot for both sides
- 📋 **Copy anonymous code** — one-click copy with animated feedback

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (custom design system) |
| Routing | React Router v6 |
| Backend | json-server (mock REST API) |
| Database | `db.json` (flat file) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/gubi-app.git
cd gubi-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

This starts both the Vite frontend and the json-server backend concurrently:

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:5173 |
| Backend (json-server) | http://localhost:3001 |

---

## Demo Accounts

### Teacher / Counselor Login (`/ogretmen-girisi`)

| Username | Password | Counselor |
|---|---|---|
| `ayse.kaya` | `demo123` | Ayşe Kaya |
| `mehmet.demir` | `demo123` | Mehmet Demir |
| `zeynep.arslan` | `demo123` | Zeynep Arslan |

### Student Login (`/giris`)

Students authenticate via TC Kimlik number. Demo entries can be added to `db.json` under the `students` array.

---

## Project Structure

```
echo-app/
├── public/              # Static assets (mascot images)
├── src/
│   ├── components/      # Shared components (MobileShell)
│   ├── context/         # Auth context
│   ├── pages/
│   │   ├── student/     # Student flow pages
│   │   └── admin/       # Teacher dashboard pages
│   └── services/
│       └── api.js       # All API calls to json-server
├── db.json              # Mock database (reports, appointments, counselors)
└── package.json
```

---

## Appointment Flow

```
Student submits report
  └─▶ Selects counselor + time slot ──▶ Status: Bekliyor
        │
        ▼ (Teacher reviews)
   ┌────┴────────────────────────────┐
   │ Accept → Onaylandı              │
   │ Counter-offer → Karşı Teklif ──▶ Student picks slot → Onaylandı
   │ Decline → Reddedildi            │
   └─────────────────────────────────┘
        │
        ▼ (On confirmation)
   Slot locked via bookingId hash on counselor.bookedSlots
```

---

## License

MIT

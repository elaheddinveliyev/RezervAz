# RezervAZ

**RezervAZ** is a production-ready, white-label reservation system MVP for appointment-based businesses in Azerbaijan. Built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Overview

RezervAZ provides a complete reservation management platform that can be branded and deployed for any appointment-based business — clinics, salons, barbers, tours, gyms, restaurants, game centers, lounges, and more. The system includes both a public booking page and a protected admin dashboard.

### Key Highlights

- **White-label ready** — Configure company name, business type, colors, logo, public slug, and domain per client
- **Demo presets included** — LaLiga Lounge Center (football lounge/game center), QGC (PlayStation cafe), Clinic, Salon, Tour
- **No paid APIs** — WhatsApp reminders via copyable message only
- **Vercel-ready** — Deploy to production in minutes
- **Supabase backend** — Auth + PostgreSQL with Row Level Security

---

## Features

### Public Booking Page (`/book`)
- Service and resource selection
- Date/time picker with availability checking
- Customer details form (name, phone, optional email)
- Pending booking submission
- Mobile-responsive design

### Admin Dashboard (`/dashboard`)
- **Statistics** — Today's reservations, pending/confirmed/cancelled counts
- **Reservations CRUD** — Create, confirm, cancel, delete with WhatsApp reminder copy
- **Calendar Views** — Daily and weekly calendar with drag-and-drop feel
- **Staff/Providers CRUD** — Manage resources (rooms, cabinets, practitioners)
- **Services CRUD** — Define packages with duration and pricing
- **Customers CRUD** — Customer database with notes
- **Business Settings** — Branding, colors, slug, domain, working hours, demo presets

### Technical Features
- Double-booking prevention with overlap detection
- Service duration-based end-time calculation
- Demo mode with in-memory data (no Supabase required for demos)
- Supabase schema with RLS policies
- Server Actions for mutations
- Tailwind CSS v4 with CSS variables for theming

---

## Demo Presets

| Preset | Business Type | Use Case |
|--------|---------------|----------|
| `laliga` | Lounge / Game Center | Football lounge with 26 rooms & PS5 |
| `qgc` | PlayStation Cafe | Gaming cabinets, VIP rooms, tournaments |
| `clinic` | Medical Clinic | Doctors, consultations, check-ups |
| `salon` | Beauty Salon | Hair, nails, styling |
| `tour` | Tour Operator | Walking tours, agro-tourism |

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm (use `npm.cmd` on Windows PowerShell)
- Supabase account (optional for demo mode)

### Local Development

```bash
# Clone and install
git clone <repository-url>
cd rezervaz
npm.cmd install

# Run demo mode (no Supabase needed)
npm.cmd run dev
```

Open:
- Admin app: <http://localhost:3000>
- Public booking: <http://localhost:3000/book>

### Demo Login

When `DEMO_LOGIN_ENABLED=true` (default in demo), the login page shows one-click demo buttons.

To run a specific preset:
```bash
# .env.local
DEMO_LOGIN_ENABLED=true
DEMO_DATA_ENABLED=true
DEMO_CLIENT_PRESET=laliga  # or qgc, clinic, salon, tour
```

---

## Supabase Setup (Production)

1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run:
   ```sql
   -- Run supabase/schema.sql first
   -- Then run a seed file (e.g., supabase/seed-laliga.sql)
   ```
3. Go to **Authentication → Users** → Create admin user
4. Set user metadata:
   ```json
   { "role": "admin", "full_name": "RezervAZ Admin" }
   ```
5. Create `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=***
   DEMO_LOGIN_ENABLED=false
   DEMO_DATA_ENABLED=false
   ```
6. Restart the dev server

---

## Project Structure

```
rezervaz/
├── public/
│   └── clients/
│       ├── laliga-logo.png
│       └── rooms/              # 26 room images for LaLiga demo
├── src/
│   ├── app/
│   │   ├── (auth)/login/       # Login page
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── admin/[token]/      # Magic link auth
│   │   ├── book/               # Public booking page
│   │   ├── globals.css         # Global styles + CSS variables
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable UI components
│   └── lib/
│       ├── actions.ts          # Server Actions
│       ├── auth.ts             # Supabase auth helpers
│       ├── client-theme.ts     # Theme CSS variable injection
│       ├── data.ts             # Data access layer (Supabase + demo)
│       ├── demo-store.ts       # In-memory demo store with presets
│       ├── env.ts              # Environment validation
│       ├── form.ts             # Form utilities
│       ├── reminders.ts        # WhatsApp message generator
│       ├── time.ts             # Time/date utilities
│       └── types.ts            # TypeScript types
├── supabase/
│   ├── schema.sql              # Database schema + RLS
│   ├── seed-laliga.sql         # LaLiga demo seed
│   ├── seed-qgc.sql            # QGC demo seed
│   └── seed.sql                # Generic clinic seed
├── docs/
│   └── laliga-proposal.md      # LaLiga Lounge Center pitch
├── Laliga Rooms/               # Source screenshots for rooms
├── .env.example                # Environment template
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Prod only | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Prod only | Supabase anon key |
| `DEMO_LOGIN_ENABLED` | No | Enable one-click demo login |
| `DEMO_DATA_ENABLED` | No | Use in-memory demo data |
| `DEMO_CLIENT_PRESET` | No | Demo preset: `laliga`, `qgc`, `clinic`, `salon`, `tour` |
| `DEMO_ADMIN_PASSWORD` | Demo only | Admin demo password |
| `DEMO_STAFF_PASSWORD` | Demo only | Staff demo password |

---

## Scripts

```bash
npm.cmd run dev      # Start dev server
npm.cmd run build    # Production build
npm.cmd run start    # Start production server
npm.cmd run lint     # Run ESLint
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [Vercel Deployment Guide](docs/vercel-deployment.md) (in New_Codex archive).

---

## Roadmap

- [ ] Branch/multi-location support
- [ ] Table/seat maps for rooms
- [ ] Online deposits (Stripe/PayPal)
- [ ] Automated WhatsApp/SMS notifications
- [ ] Recurring customer profiles & loyalty
- [ ] Multi-language (AZ/EN/RU) i18n
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting and security policies.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Supabase](https://supabase.com/), [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by real reservation needs of Azerbaijani businesses

---

**Made with ❤️ for Azerbaijan's appointment-based businesses**
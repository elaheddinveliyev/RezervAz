# LaLiga Lounge Center Reservation Demo Proposal

This is a ready pitch configuration for LaLiga Lounge Center using the RezervAZ
white-label base.

## Public Signals Checked

- Instagram page requested by customer prospect: https://www.instagram.com/laligaloungecenter/
- Navigator listing: https://navigator.az/en/la-liga-lounge-center/
- Marsol listing: https://marsol.az/laliga-game-center/
- Sluurpy branch listing: https://www.sluurpy.com/en/%D0%B1%D0%B0%D0%BA%D1%83/restaurant/9294501/laliga-lounge-center
- Tripadvisor listing: https://www.tripadvisor.co.uk/Attraction_Review-g293934-d27588137-Reviews-La_Liga_Lounge_Center-Baku_Absheron_Region.html

Use these only as starting points. Before publishing, confirm exact branch,
phone, logo, prices, rooms, tables, and colors with LaLiga Lounge Center.
The room list, capacities, logo, and price rules below were taken from the
screenshots supplied on July 23, 2026.

## Proposed Booking Model

LaLiga Lounge Center can use RezervAZ as a football lounge/game-center
reservation system:

- Business type: Lounge / game center
- Providers/resources: rooms and cabinets
- Services/packages: hourly room reservation and hourly PS5 room reservation
- Customer fields: name, phone, optional email
- Booking status: pending until admin confirms
- Reminder: copyable WhatsApp message, no paid WhatsApp API

## Demo Data Included

Local preset: `laliga`

Company:

- Name: LaLiga Lounge Center
- Domain note: instagram.com/laligaloungecenter
- Phone: +994 55 814 64 64
- Address: Zahid Xalilov 25B, Elmler, Baku
- Hours: 09:00-03:00, every day
- Logo: `/clients/laliga-logo.png`
- Colors: dark charcoal background, deep purple primary, white text, blue,
  yellow, orange/red, and green controller accents

Resources:

- Game Room, 6 nəfərlik
- La Liga Room, 6 nəfərlik
- Futurizm, 6 nəfərlik
- Paris Room, 6 nəfərlik
- London Room, 6 nəfərlik
- Morocco Room, 6 nəfərlik
- Loft Room, 6 nəfərlik
- Vintage Room, 6 nəfərlik
- Retro Room, 6 nəfərlik
- Athens Room, 7 nəfərlik
- Kabinet 504, 4-5 nəfərlik
- Kabinet 502, 4-5 nəfərlik
- Kabinet 501, 4-5 nəfərlik
- Kabinet 503, 5-6 nəfərlik
- Country Room, 7 nəfərlik
- Prizma Room, 8-15 nəfərlik
- Africa Room, 6 nəfərlik
- East Room, 6 nəfərlik
- Bakı Room, 8-10 nəfərlik
- Roma Room, 8-10 nəfərlik
- İstanbul, 8-10 nəfərlik
- Kiev, 8 nəfərlik
- Dubay, 8-10 nəfərlik
- Planet Room, 8-15 nəfərlik
- Macao Room, 6 nəfərlik
- Kabinet 505, 4-5 nəfərlik
- Şuşa Room, 8 nəfərlik

Services:

- Otaq rezervasiyası - 1 saat, 60 min, 8 AZN
- PS5 ilə otaq - 1 saat, 60 min, 10 AZN
- Otaq rezervasiyası - 2 saat, 120 min, 16 AZN
- PS5 ilə otaq - 2 saat, 120 min, 20 AZN

## How To Demo It

1. Start the local app with `npm.cmd run dev`.
2. Open `http://localhost:3000/login`.
3. Use one-click demo admin login.
4. Go to `/dashboard/settings`.
5. Click `LaLiga lounge` if the preset is not already active.
6. Open `http://localhost:3000/book`.
7. Show how a customer chooses a room, regular/PS5 package, date, and time.
8. Submit a pending booking with a name and phone.
9. Go to `/dashboard/reservations`.
10. Confirm or cancel the booking.
11. Click `Copy WhatsApp Message` for the reminder.

For the local LaLiga sales demo, `.env.local` should contain:

```bash
DEMO_LOGIN_ENABLED=true
DEMO_DATA_ENABLED=true
DEMO_CLIENT_PRESET=laliga
```

## Supabase Demo

For a persistent LaLiga demo database:

1. Run `supabase/schema.sql`.
2. Run `supabase/seed-laliga.sql`.
3. Create an admin user in Supabase Authentication.
4. Set `.env.local` with Supabase URL/key.
5. Restart the app.

## Questions For LaLiga Before Real Launch

- Should bookings be for one branch or all branches?
- If all branches, which branch should appear first in the booking flow?
- Exact list of rooms, screens, PS5 booths, and event areas
- Exact prices, minimum spend, and package durations
- Whether match nights need special time slots
- Whether bookings should be auto-confirmed or admin-confirmed
- Exact brand colors, logo file, and preferred public booking domain
- Which managers need admin/staff access

## Simple Offer

Start with a free-tier MVP:

- Public booking page
- Admin dashboard
- Manual confirmation
- Calendar
- WhatsApp copy reminder
- No payments
- No paid APIs

After real usage, paid upgrades can be branch selection, table maps, match-night
special schedules, online deposits, and automated notifications.

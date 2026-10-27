# Ruth Rentals

Borrow what you need. Lend what you own.

A peer to peer marketplace for hiring tools, cameras, event tents, sound gear, farm equipment, party supplies, sports kit and light vehicles across Kenya. Owners list gear for free and set their own rates. Renters book by the day, message the owner, and keep a handover checklist with the booking.

Built with Next.js 15 (App Router), React 19, Tailwind CSS 4 and Zod. Data lives in Vercel KV (Upstash compatible) with a seeded in memory fallback, and owner photos go to Vercel Blob or a small inline fallback for local work.

## Getting started

```bash
nvm use            # Node 24, see .nvmrc
npm ci
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

Sign in with a demo account to see the owner and renter flows:

| Email | Role |
| --- | --- |
| wanjiku@ruthrentals.co.ke | owner and renter |
| mwangi@ruthrentals.co.ke | owner |
| grace@ruthrentals.co.ke | renter |

Password for all three: `Borrow2026`. These accounts exist only in the seeded data, and the seed runs on first request when no KV credentials are set.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on 0.0.0.0:3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build on 0.0.0.0:3000 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run audit` | Production dependency audit, fails on high |

## Environment

Copy `.env.example` and fill in what you need.

- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SUPPORT_PHONE`, `NEXT_PUBLIC_SUPPORT_EMAIL` drive links, metadata and WhatsApp deep links.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` enable Google reCAPTCHA v2. Leave both blank for local demos: the forms then show a test checkbox that returns the token `demo-pass`, which the server accepts only when no secret is configured.
- `KV_REST_API_URL` and `KV_REST_API_TOKEN` switch the store from the in memory seed to Vercel KV.
- `BLOB_READ_WRITE_TOKEN` switches photo uploads from inline data URLs to Vercel Blob.
- `SESSION_SECRET` signs session cookies.
- `RESEND_API_KEY`, `FROM_EMAIL` and `ENQUIRY_EMAIL` send enquiry emails. Without them enquiries are still stored.

Deployment region is pinned to `cdg1` in `vercel.json`, along with security headers. A Content Security Policy is set in `next.config.ts` and allows Google reCAPTCHA, inline styles for the design tokens, and Vercel Blob images.

## Routes

Public pages: `/`, `/browse`, `/item/[slug]`, `/list-item`, `/pricing`, `/about`, `/login`, `/register`, `/legal/terms`, `/legal/kdpa`, `/legal/privacy`, `/legal/cookies`. Auth pages: `/dashboard`, `/dashboard/booking/[id]`.

API routes are all Node runtime, same origin checked and rate limited: `/api/register`, `/api/auth/login`, `/api/auth/logout`, `/api/items/create`, `/api/items/[id]/status`, `/api/bookings/create`, `/api/bookings/[id]/status`, `/api/messages/send`, `/api/messages/read`, `/api/send-enquiry`, `/api/upload`.

## Money and safety

Ruth Rentals is a platform, not an insurer. Hire fees and damage deposits are agreed and paid directly between owner and renter; the site does not collect, hold or refund deposits. Promoted listings cost KES 499 once, are optional, and do not use gold or premium colour styling. Basic listings are free and carry no commission.

## Photography

All photography comes from Pexels and is credited in [image-credits.md](./image-credits.md) (also served at `/image-credits.txt`). No AI generated stock is used.

## Licence

Application code for this build is provided for Ruth Rentals. Photography remains under the Pexels licence and the original photographers' copyright.

# FinSight 360 — Personal Finance Manager

FinSight 360 is a personal finance dashboard that aggregates accounts, parses bank and credit card statements (PDF, XLSX, CSV), auto-categorizes transactions, and visualizes your net worth and spending.

## Tech stack

- Next.js 14 App Router (Edge where possible)
- TypeScript
- Tailwind CSS + shadcn/ui
- Recharts for charts
- pdf-lib + pdfjs-dist for PDF parsing (including passwords)
- SheetJS (xlsx) for Excel/CSV
- Vercel KV for storage

## Environment variables

Create a `.env.local` (or set in Vercel):

- `FINSIGHT_PASSWORD` — master login password (required)
- `FINSIGHT_ENCRYPTION_KEY` — 32+ char secret used for AES-GCM encryption (required)
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` — Vercel KV credentials (auto when using KV add-on)

## Development

pnpm install
pnpm dev


## Deploy to Vercel

1. Push this repo to GitHub.
2. Click "New Project" in Vercel and import your repo.
3. Set environment variables as above.
4. Click Deploy. Vercel will detect Next.js automatically.

## Notes

- All financial data is stored encrypted at rest using your encryption key.
- PDF passwords are used only in memory for parsing and never stored.
- Uploaded files are kept in memory only and discarded after parsing.
- The app is designed for single-user personal use on the Vercel free tier.

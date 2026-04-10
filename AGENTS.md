<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Persistence Layer (2026 Update)
The project now uses Prisma + SQLite for data persistence. 
- **DB:** `prisma/dev.db`
- **Client:** `@/lib/prisma`
- **Actions:** `@/app/actions/` (Server Actions for CRUD)
- **Ingestion:** `scripts/seed.ts` (Parses batch files from Downloads)
<!-- END:nextjs-agent-rules -->

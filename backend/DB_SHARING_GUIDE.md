# Database Sharing Guide (Quickkart)

## What your friend gets by cloning this repo
- All backend and frontend code.
- Table creation from `backend/config/init.sql`.
- Starter product seed from `backend/config/seed_products.sql`.

## What your friend does NOT get automatically
- Your current live database rows (users, orders, cart, comments, etc.).
- Data currently stored in your local MySQL unless you export/import it.

## Option A: Share only starter data (recommended for normal setup)
1. Friend clones the project.
2. Friend creates `.env` in backend with their own MySQL settings.
3. Friend runs backend.
4. Backend startup runs:
   - `init.sql` (creates tables)
   - migrations in `server.js` (adds missing columns)
   - `seed_products.sql` (adds starter products)

Result:
- Project runs.
- Starter product data appears.
- Other tables start empty until app usage creates rows.

## Option B: Share exact current data snapshot (full data)
Use a MySQL dump from your machine and import on your friend's machine.

### Export on your machine
```bash
mysqldump -u root -p quickkart > quickkart_full_dump.sql
```

### Import on your friend's machine
```bash
mysql -u root -p quickkart < quickkart_full_dump.sql
```

Result:
- Friend gets the same data snapshot you had at export time.

## Notes
- Seed files are code and can be committed to GitHub.
- Actual database rows are not stored in GitHub unless you export them to SQL and share/import that file.
- Avoid committing sensitive production data to public repositories.

# Setup Instructions

## 1. Create Supabase project
Create a Supabase project and copy:
- Project URL
- anon key
- service role key

## 2. Run SQL
Open Supabase SQL editor and run `supabase/schema.sql`.

Then enable Realtime on:
- `weather_updates`

## 3. Create environment files

### apps/web/.env.local
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### apps/worker/.env
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POLL_INTERVAL_MS=300000
```

## 4. Install dependencies
From repo root:
```bash
npm install
```

## 5. Run frontend
```bash
npm run dev:web
```

## 6. Run worker
Open another terminal:
```bash
npm run dev:worker
```

## 7. Test flow
- sign up
- log in
- add a city on dashboard
- wait for worker poll
- watch weather update automatically

## 8. Deploy
- Push repo to GitHub
- Deploy `apps/web` to Vercel
- Deploy `apps/worker` to Railway
- Add environment variables in both dashboards

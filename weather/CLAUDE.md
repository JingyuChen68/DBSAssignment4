# CLAUDE.md

## Project
Live Weather Dashboard

## Goal
Build a multi-service system where a background worker polls live weather data, stores it in Supabase, and a Next.js frontend displays updates in real time.

## Architecture
External Data Source (Open-Meteo)
-> Worker (Node.js on Railway)
-> Supabase Database
-> Supabase Realtime
-> Next.js Frontend on Vercel

## Services

### Frontend
- Built with Next.js + Tailwind CSS
- Handles user authentication with Supabase Auth
- Allows users to add and remove favorite cities
- Reads weather data from Supabase
- Subscribes to Supabase Realtime updates on weather_updates
- Shows only the logged-in user's data

### Worker
- Runs on Railway
- Polls Open-Meteo every 5 minutes
- Reads all favorite cities from Supabase
- Fetches latest weather for each city
- Upserts results into weather_updates
- Logs errors and last successful poll time

### Database
Tables:
- profiles
- favorite_cities
- weather_updates

## Personalization
Each user has their own favorite cities.
The frontend filters data by authenticated user_id.

## Realtime
Supabase Realtime is enabled on weather_updates.
Whenever the worker updates a row, subscribed frontend clients receive the update automatically.

## Deployment
- Frontend deployed on Vercel
- Worker deployed on Railway
- Supabase for database, auth, and realtime

## Environment Variables
Frontend:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Worker:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- POLL_INTERVAL_MS

## Security
RLS enabled on user-facing tables.
Users can only read and modify their own favorites and weather rows.
Worker uses service role key to write updates.

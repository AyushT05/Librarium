# Librarium — Library Management System

A full-stack library management system built with React, Supabase, and Gemini AI.

## Features

- **Browse Catalog** — View all books with search, genre, and availability filters
- **Dashboard** — Statistics overview with genre breakdown and recent additions
- **AI Assistant** — Chat with Gemini AI about your library catalog: get recommendations, statistics, and insights
- **Admin Panel** — Full CRUD: add, edit, delete books with a clean table interface
- **Real-time data** — Powered by Supabase for instant updates

## Tech Stack

- React 19 + Vite
- React Router DOM (client-side routing)
- Supabase (PostgreSQL database)
- Google Gemini API (AI assistant)
- Lucide React (icons)

## Setup

### 1. Database Setup

Go to your Supabase project → SQL Editor and run:

```sql
create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  genre text,
  isbn text,
  year integer,
  description text,
  copies integer default 1,
  available integer default 1,
  created_at timestamptz default now()
);

alter table books enable row level security;
create policy "Allow all" on books for all using (true) with check (true);
```

> **Note:** The app will automatically detect if the table is missing and show you this SQL with a setup wizard.

### 2. Environment Variables

Create a `.env` file (already included):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats and recent books |
| `/books` | Browse full catalog with filters |
| `/ai` | AI Assistant powered by Gemini |
| `/admin` | Admin panel for managing books |

## AI Assistant Features

The AI assistant has full context of your library catalog and can:
- Answer statistical questions ("How many sci-fi books?", "How many unique authors?")
- Give personalized recommendations based on available books
- Help find books by genre, author, or topic
- Describe what's currently available vs borrowed

## Book Fields

| Field | Type | Description |
|-------|------|-------------|
| title | text | Book title (required) |
| author | text | Author name (required) |
| genre | text | Genre category |
| isbn | text | ISBN number |
| year | integer | Publication year |
| description | text | Brief synopsis |
| copies | integer | Total copies owned |
| available | integer | Copies currently available |

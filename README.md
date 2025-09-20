# 🎵 Songs App
submitted by Pe'er Harush

## What is this?
A tiny full-stack app to upload a CSV of songs, store them in PostgreSQL, and view them in a simple table.  
Click a song title to jump to a YouTube search and listen 🎧

## Tech used
- **Frontend:** React (Vite)
- **Backend:** NestJS
- **Database:** PostgreSQL
- **Runtime:** Docker & Docker Compose

## Environment
Copy **`backend/.env.example`** → **`backend/.env`** and fill your local values 

---

## Build & Run (Docker Compose)
docker compose down             # stop & clean
docker compose build            # build frontend + backend images
docker compose up -d            # start db, backend, frontend

### First time (or after Dockerfile/deps changes)
```bash
docker compose build          # builds frontend + backend images
docker compose up -d          # starts db, backend, frontend

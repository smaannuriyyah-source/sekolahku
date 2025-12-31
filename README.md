# Sekolahku CMS

Website sekolah dengan CMS (Content Management System) untuk mengelola artikel, kategori, laporan, dan pendaftaran siswa baru.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Express.js
- **Database**: SQLite (sql.js)
- **Auth**: JWT

## Development

```bash
# Install dependencies
npm install

# Run frontend dev server
npm run dev

# Run backend dev server (in another terminal)
npm run dev:server
```

## Production

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| JWT_SECRET | JWT signing secret | (required) |
| NODE_ENV | Environment | development |

## Default Admin

- Username: `admin`
- Password: `admin`

> ⚠️ Change the default password after first login!

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Connect GitHub repository
2. Set environment variable `JWT_SECRET`
3. Deploy!

# Marcus Book Store

A React (JSX) + Express (JavaScript) bookstore application. The frontend is served by Vite in development and by Express in production. MongoDB is optional: the API automatically falls back to an in-memory demo store when MongoDB is unavailable.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB (optional; local or MongoDB Atlas)

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update `MONGODB_URI` and `JWT_SECRET` if needed.
3. Start the app (Express API + Vite frontend):
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Production build

```bash
npm run build
NODE_ENV=production npm start
```

## Demo account

- Email: `reader@marcusbookstore.com`
- Password: `password123`

The demo account and sample catalogue are seeded automatically. Change the JWT secret before deploying publicly.

## Project structure

```text
client and server in one project
├── src/
│   ├── components/   React JSX components
│   ├── context/      React context providers
│   ├── App.jsx       Main React application
│   ├── main.jsx      React entry point
│   └── index.css
├── server.js         Express API and server
├── vite.config.js
├── index.html
└── package.json
```

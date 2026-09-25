# Product Admin Dashboard

A small admin dashboard to log in and manage products, built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4** and **Axios**, using the free [DummyJSON](https://dummyjson.com) API.

**Live demo:** _add your Vercel link here_
**Login:** `emilys` / `emilyspass`

## Setup

Requirements: Node.js 20.9 or newer.

```bash
git clone https://github.com/LNamita/Product-Admin-dashboard.git
cd Product-Admin-dashboard
npm install
cp .env.example .env.local   # optional, the default API URL is already https://dummyjson.com
npm run dev                  # http://localhost:3000
```

Production build: `npm run build && npm start`.

### Deploy to Vercel
1. Push the repo to GitHub.
2. On vercel.com → **Add New… → Project** → import the repo.
3. Keep the defaults (framework: Next.js) and click **Deploy**.

## What is finished

- [x] **Login** with `POST /auth/login`, field validation, "wrong username or password" message, session-expired message
- [x] **Route protection**: logged-out users are redirected to `/login` (and sent back to the page they wanted after login); logged-in users skip the login page
- [x] **Logout** button in the header
- [x] **Product list** with image, title, category, price, rating and stock — a **table on desktop** and **cards on mobile**
- [x] **Server pagination** with `limit` and `skip`: page numbers (with `…` gaps), Previous/Next, page size 10 / 20 / 50, "Showing 21–40 of 194"
- [x] **Search** with `/products/search?q=`, debounced (400 ms), goes back to page 1
- [x] **Category filter** (`/products/categories`) and **sort** by title, price or rating (both directions)
- [x] **Product details** at `/products/[id]` with image gallery, description, price, discount, stock and reviews
- [x] **"Product not found"** page for wrong ids (`/products/abc`, `/products/9999`)
- [x] **Add / edit** form with validation, **delete** with a confirm popup
- [x] **Loading, empty and error states**, with a **Retry** button on errors
- [x] **One shared Axios file** (`src/lib/axios.js`) that adds the token and handles all errors
- [x] **All list state in the URL** (`page`, `limit`, `q`, `category`, `sortBy`, `order`) — refresh or share the link and you get the same result
- [x] **No React Query / SWR / table or pagination libraries** — all logic is hand-written
- [x] **Stale search results can never replace new ones** (test with `?delay=2000`)
- [x] **Bad URL values are handled** (`?page=abc`, `?page=999`, `?limit=7`, `?sortBy=x`, unknown category)
- [x] **Double-click safe** Login, Save and Delete buttons

## Project structure

```
src/
├── proxy.js                  # Server-side route guard (Next 16's name for middleware)
├── app/                      # Routes only — thin files that render components
│   ├── login/page.js
│   └── products/
│       ├── layout.js         # Header + toasts for all product pages
│       ├── page.js           # List
│       ├── new/page.js       # Add
│       └── [id]/page.js      # Details
│           └── edit/page.js  # Edit
├── services/                 # All API calls (the only files that talk to the API)
│   ├── authService.js
│   └── productService.js
├── lib/                      # Plain JS logic, no React
│   ├── axios.js              # Shared Axios instance + interceptors
│   ├── token.js              # Cookie/session helpers
│   ├── productQuery.js       # Parse/clean/build URL query
│   ├── pagination.js         # Page-number logic
│   ├── localChanges.js       # Keeps add/edit/delete visible (API does not save them)
│   ├── validateProduct.js    # Form validation
│   ├── toast.js, format.js
├── hooks/                    # React hooks (data loading, URL state, debounce, submit guard)
└── components/               # Small UI components (ui/, products/, auth/, layout/)
```

## How to test the tricky parts

| What | How |
| --- | --- |
| Old search results never win | Open `/products?delay=2000`, type `laptop`, wait half a second, then change it to `watch`. Only watch results appear. |
| Bad URL values | Try `/products?page=abc`, `/products?page=999`, `/products?limit=7&sortBy=hack` |
| Double submit | Click **Sign in** or **Save** many times fast — the Network tab shows one request |
| Not found | `/products/abc` and `/products/9999` |
| Error + Retry | Turn on "Offline" in DevTools, change page, then go online and click **Retry** |

See [NOTES.md](NOTES.md) for the reasoning behind the main decisions.

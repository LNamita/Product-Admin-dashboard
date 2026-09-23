# Notes — choices, one problem, and AI use

## My choices

**1. Search and category filter work one at a time.**
DummyJSON has separate endpoints for search (`/products/search?q=`) and category (`/products/category/:slug`), and they cannot be combined. I could have fetched search results and filtered them by category in the browser, but then the server pagination would lie: "Showing 1–10 of 23" would count products that are then hidden, and some pages would come out half empty. So in my app **typing a search clears the category, and picking a category clears the search**. A small hint under the toolbar explains this to the user. If a shared link has both (`?q=phone&category=laptops`), search wins and the URL is cleaned. Sorting works with both, because every endpoint accepts `sortBy` and `order`.

**2. Add / edit / delete are kept in a local "changes" layer.**
DummyJSON answers as if the change worked, but saves nothing. So after the API call succeeds, I record the change in `src/lib/localChanges.js` (saved in `localStorage`, so it survives a refresh) and apply it on top of every API response:
- **Edited** products: the saved fields are merged over the API product (list and details).
- **Deleted** products: filtered out of the list; their details page shows "not found".
- **Added** products: the API always returns id `195`, so I give each one my own id (from 100001) and show them at the top of page 1 with a "New" badge, if they match the current search/category. Their details and edit pages read from the local store and never call the API (a `PUT /products/100001` would 404).
Page numbers and "Showing x–y of z" stay based on the server's numbers, so pagination is always correct. Logging out clears the local changes. The store uses `useSyncExternalStore`, so every component updates at once.

**3. The URL is the single source of truth for the list.**
`parseQuery` turns the URL into a clean object (bad values fall back to defaults), and `useProductQuery` rewrites the URL if it was cleaned. `?page=999` is fixed after the first response, when the real page count is known. Page changes use `router.push` (Back button works); search typing uses `router.replace` (no history entry per word).

**4. Old search results can never replace new ones.** `useProducts` does two things: it aborts the previous request with `AbortController`, and it numbers every request and ignores any answer that is not the latest. Together with the 400 ms debounce, only the last thing typed is shown.

**5. Route protection on the server.** The token is stored in a cookie so `src/proxy.js` can redirect before the page renders (no flash of protected content). The Axios interceptor adds `Authorization: Bearer <token>` to every request, and on a `401` it clears the session and sends the user to login.

**6. Double submit.** `useSubmitGuard` uses a `ref` as the lock, not only `useState`. State updates are async, so two very fast clicks could both see `loading === false`; the ref changes immediately. The button is also disabled while loading.

## One problem I faced and how I fixed it

**The search box kept jumping back while I was typing.** The input shows local text, and the debounced value is written to the URL. I also needed the reverse: when the URL changes from outside (Back button, picking a category that clears the search), the box should update. My first version simply copied the URL value into the box whenever it changed. But the URL updates 400 ms after typing, so if I typed "pho", paused, and kept typing "ne", the URL change for "pho" arrived and reset the box to "pho", deleting what I had just typed.

The fix was a `lastSent` ref in `SearchInput`: it remembers the last value *we* sent to the URL. When the URL value changes, the box is only updated if the new value is different from `lastSent` — meaning the change came from outside. Our own updates are ignored, so typing is never interrupted.

## Where AI helped me

- Setting up the project for Next.js 16, which renamed `middleware.js` to `proxy.js` and made page `params` a Promise.
- Reviewing edge cases for bad URL values and suggesting the "request number + AbortController" approach for race conditions.
- Writing the page-number logic with `…` gaps, and drafting parts of this README.
- Writing a browser test script I used to check the flows (login, pagination, race condition, add/edit/delete, mobile view).

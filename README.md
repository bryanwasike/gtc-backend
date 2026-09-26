# GTC backend (Vercel)

A tiny serverless API, deployed on Vercel, that receives driver sign-ups
from the Global Truckers Community website and saves them to your
Firebase database. Vercel's free tier is enough for this.

## What's in here
- `api/signup.js` — the one API route: `POST /api/signup`
- `public/index.html` — a placeholder homepage (the real website is on GitHub Pages, not here)
- `package.json` — nothing to install, this needs no dependencies

## Deploy it (once)
1. Go to github.com and create a **new, separate repository**, for example `gtc-backend`.
2. Upload every file in this folder to that repository (keep the `api` and `public` folders).
3. Go to vercel.com and sign in with your GitHub account.
4. Click **Add New → Project**, then **Import** your `gtc-backend` repository.
5. Leave the framework preset as **Other** and click **Deploy**.
6. Once it's deployed, go to the project's **Settings → Environment Variables** and add:
   - Name: `FIREBASE_DB_URL`
   - Value: your Firebase Realtime Database URL, e.g. `https://gtc-convoy-default-rtdb.firebaseio.com/`
7. Go to **Deployments**, open the latest one, and click **Redeploy** so it picks up the new variable.
8. Copy your project's address, shown at the top of the Vercel dashboard — it looks like
   `https://gtc-backend.vercel.app`.

## Connect it to the website
In the main website's `index.html`, find this line in the `CONFIG` block:

```js
signupApiUrl: "",
```

and set it to your Vercel address plus `/api/signup`, for example:

```js
signupApiUrl: "https://gtc-backend.vercel.app/api/signup",
```

Commit that change to the website's repository, and driver sign-ups will
be sent through this backend from then on.

## Why a separate backend at all
GitHub Pages can only serve files — it can't run code or keep secrets.
This small Vercel project runs the code that talks to Firebase, and
keeps the database address out of the website's public source code.

## Test it
Once deployed, you can test it from a terminal:

```
curl -X POST https://gtc-backend.vercel.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Driver","games":"ETS 2"}'
```

A reply like `{"ok":true,"id":"-Nxxxxxxxxxxxxxxxxxxxx"}` means it worked.
Check your Firebase Realtime Database — a new entry should appear under
`signups`.

# Louisville Slugger Signature Event — Website

Static site (plain HTML/CSS, no build step) for the REACT Robotics VEX V5RC Signature Event, Louisville KY, Dec 5–7, 2026.

## Structure

- `index.html`, `schedule.html`, `registration.html`, `venue.html`, `judging.html`, `volunteer.html`, `contact.html` — pages
- `assets/` — CSS, logo, favicon

No build tools, frameworks, or dependencies. It's ready to deploy as-is.

## Publish it (GitHub + Vercel)

### 1. Put it under git

Open this folder in VS Code, then in the integrated terminal:

```
git init
git add .
git commit -m "Initial commit: Slugger Sig website"
git branch -M main
```

(Skip `git init` if this folder is already a repo.)

### 2. Push to GitHub

If you have the GitHub CLI (`gh`) installed and are logged in:

```
gh repo create slugger-sig-website --public --source=. --remote=origin --push
```

Otherwise, create an empty repo at https://github.com/new (don't initialize it with a README), then:

```
git remote add origin https://github.com/<your-username>/slugger-sig-website.git
git push -u origin main
```

### 3. Connect Vercel

1. Go to https://vercel.com/new
2. Import the `slugger-sig-website` GitHub repo
3. Framework preset: **Other** (it's a static site — no build command, no output directory override needed)
4. Click **Deploy**

Vercel will give you a live URL immediately, and every future `git push` to `main` will auto-deploy.

### Alternative: Vercel CLI, no GitHub

```
npm i -g vercel
vercel login
vercel        # deploy a preview
vercel --prod # deploy to production
```

## Notes

- Priority registration opens August 24, 2026 — the countdown/date isn't automated, so double-check dates before launch if this repo sits for a while.
- The `RE-V5RC-26-4727` event code on the homepage is for the Middle School division; the High School code is marked "coming soon" — update `index.html` once RECF issues it.

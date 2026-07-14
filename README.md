# Check Alpha — Product Authentication (Next.js)

Front-end version of the original product authentication page, rebuilt with
Next.js (App Router). The original legacy HTML/JS form was converted while
keeping the original look (310×520 window, background image and image submit
button).

## What it does

- Reproduces the original form: **Mfg. Date**, **Serial Number**, **Authentication Code**.
- Serial Number only appears / is required for **"02 / 2022 or before"**, matching
  the original `display_serial_no` / `validatePage` logic.
- Client-side validation with the same red-border feedback as the legacy page.
- Front-end only: there is **no real verification back end yet**. On a valid submit
  it just echoes the submitted values. To wire up real checks later, add a Next.js
  API route (e.g. `app/api/verify/route.js`) and call it from `components/AuthForm.js`.

## Requirements

- Node.js 18.17+ (or 20+)

## Run locally

```bash
cd "check-alpha-nextjs"
npm install
npm run dev
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.js        Root layout + <html>/<body>
  page.js          Home page (renders the form)
  globals.css      Legacy typography + window/background styles
components/
  AuthForm.js      Client component: form, validation, serial toggle
public/            Original image assets (bg, submit button, spacer, icons)
```

> Note: `npm install` / `npm run build` could not be executed in the build
> sandbox (npm registry access was blocked there). Run the commands above on your
> own machine to install dependencies and start the app.
# check-alpha

# Complete Setup Guide — IPL Landing Page with Meta Pixel + CAPI

## Project Overview
Single HTML landing page for Meta (Facebook/Instagram) ads campaigns.
- Drives traffic to a Telegram group/channel
- Tracks visitors with Meta Pixel (browser) + Conversions API (server-side)
- Hosted free on Netlify with GitHub auto-deploy
- No WordPress, no paid plugins — total cost ₹0

---

## Project Structure

```
landingpage2/
  index.html                  ← entire landing page (HTML + CSS + JS)
  ipl-players.webp            ← hero image (WebP format, under 700KB)
  comelogo.png                ← Come brand logo shown in header
  netlify.toml                ← Netlify build config
  netlify/
    functions/
      capi.js                 ← Meta CAPI serverless function
  .gitignore
  SETUP-GUIDE.md              ← this file
  wordpress-setup-guide.md    ← alternative WordPress instructions
```

---

## STEP 0 — Prerequisites (Do This First)

Before anything else, make sure you have:

- [ ] A **Facebook account** with a Business Manager set up
- [ ] A **Meta Ad Account** (with billing added)
- [ ] A **Telegram channel or group** already created with an invite link
- [ ] **Git** installed → download from git-scm.com
- [ ] A **GitHub account** → github.com
- [ ] A **Netlify account** → netlify.com (free, sign up with Google)
- [ ] **VS Code** or any text editor to edit files

---

## STEP 1 — Replace Placeholders in index.html

Open `index.html` in VS Code and press `Ctrl+H` (Find & Replace).

### 1A — Meta Pixel ID
- Find:    `875692978767360`
- Replace: your actual Pixel ID (e.g. `1234567890123456`)
- Appears in **2 places** — replace both

### 1B — Telegram Link
- Find:    `https://t.me/+ix_7H6ll5n8xMzll`
- Replace: your actual Telegram link
  - Public channel → `https://t.me/yourchannelname`
  - Private invite → `https://t.me/+AbCdEfGhIjKl1234`

> **How to get your Telegram invite link:**
> - Open Telegram → your channel/group → Settings → Invite Links → Create Link → Copy

### 1C — Hero Image
The image is already set to `ipl-players.webp`.
- To change the image: save your new image as `ipl-players.webp` in the project folder (it will replace the old one)
- Image should be **WebP format, under 700KB**

> **How to convert any image to WebP:**
> - Easiest: go to **squoosh.app** → drag image → set format to WebP → quality 80 → Download
> - Or using Python: `python -c "from PIL import Image; Image.open('yourimage.png').save('ipl-players.webp', 'webp', quality=85)"`

### 1D — Page Title & Meta Tags (Optional)
In `index.html` lines 8–11, you can update:
```html
<title>IPL 2025 - आज की Best Team | Telegram Join करो</title>
<meta property="og:title" content="IPL 2025 - आज की 1st Rank Team पाओ">
<meta property="og:description" content="...">
```
These appear when the link is shared on WhatsApp/Facebook.

---

## STEP 2 — Create Your Meta Pixel & Get the Pixel ID

> If you already have a Pixel, skip to **2E** to copy the ID.

### 2A — Go to Events Manager
1. Open **business.facebook.com**
2. Make sure you are logged into the correct Facebook account
3. Click the **9-dot grid icon** (top left, looks like a waffle)
4. Click **"Events Manager"**

### 2B — Create a New Data Source
1. Click the **green "+ Connect Data Sources"** button (left sidebar)
2. Select **"Web"** → Click **"Connect"**

### 2C — Choose Meta Pixel
1. Select **"Meta Pixel"** → Click **"Connect"**

### 2D — Name Your Pixel
1. Enter a name e.g. `IPL Telegram Ads`
2. Website URL: your Netlify URL (you can add this later)
3. Click **"Create Pixel"**

### 2E — Copy Your Pixel ID
1. After creation, you see a 15-16 digit number at the top
2. That is your **Pixel ID** — copy it to Notepad

> **Find it later:** Events Manager → click pixel name in left sidebar → ID shown at top

### 2F — Skip the Automatic Install
1. Meta will prompt you to install the pixel code
2. Choose **"Install code manually"** → **ignore the code shown** (our index.html already has it built in)
3. Click Continue or close

---

## STEP 3 — Get Your CAPI Access Token

> This token lets the Netlify serverless function send events to Meta server-side.

### METHOD A — System User Token ⭐ Recommended

A System User is a bot account inside Meta Business Manager. Its token does not break if your personal account is disabled or has issues.

#### 3A — Go to Business Settings
1. Go to **business.facebook.com**
2. Click **gear icon ⚙️** (bottom left) → **Business Settings**

#### 3B — Create a System User
1. Left sidebar → **Users** → **System Users**
2. Click **"Add"**
3. Fill in:
   - **System Username:** `capi-bot`
   - **System User Role:** Standard
4. Click **"Create System User"**

#### 3C — Give Access to Your Pixel
1. Left sidebar → **Data Sources** → **Pixels**
2. Click your pixel name → **"Add People"**
3. Select `capi-bot` → Permission: **Manage** → **Save Changes**

#### 3D — Generate the Token
1. Left sidebar → **Users** → **System Users**
2. Click `capi-bot` → **"Generate New Token"**
3. Select your Ad Account
4. Check these permissions:
   - ✅ `ads_management`
   - ✅ `ads_read`
   - ✅ `pages_read_engagement`
5. Click **"Generate Token"**
6. **Copy the token immediately** (starts with `EAABx...`) and paste into Notepad
7. It is shown only once — if lost, generate a new one

---

### METHOD B — Events Manager Token (Quick & Easy)

Use this for quick testing. Token is tied to your personal account and expires in ~60 days.

#### 3E — Go to Pixel Settings
1. Events Manager → click your pixel name → **"Settings"** tab

#### 3F — Generate Token
1. Scroll to **"Conversions API"** section
2. Click **"Generate access token"**
3. Copy the token → paste into Notepad

> **Token expires after ~60 days.** If CAPI stops working later, come back here and regenerate.

---

### 3G — Save Both Values
```
Pixel ID:     1234567890123456
Access Token: EAABxyz123ABCdef...
```
You will paste these into Netlify in Step 6.

---

## STEP 4 — Push to GitHub

### 4A — First time setup
Open a terminal (Git Bash or Command Prompt) in your project folder:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> **Create a new GitHub repo first:**
> - Go to github.com → click "+" → New repository
> - Name it e.g. `ipl-landing-page`
> - Keep it **Private** (so your Telegram link stays hidden)
> - Don't initialize with README (your project already has files)
> - Copy the repo URL and use it in the command above

### 4B — Every update after that
```bash
git add .
git commit -m "describe what you changed"
git push
```
Netlify automatically redeploys in ~30 seconds after every push.

---

## STEP 5 — Deploy to Netlify

### 5A — Create Netlify Account
1. Go to **netlify.com** → Sign up free (use Google)

### 5B — First Deploy (Drag & Drop — Quickest Way)
1. After login you see a large drop area: "Deploy manually"
2. Drag your entire project folder into it
3. Wait 30 seconds → you get a URL like `https://amazing-fox-123.netlify.app`
4. Open it on your phone to verify everything looks correct

### 5C — Connect GitHub for Auto-Deploy (Do This Once)
1. Netlify dashboard → your site
2. **Site configuration** → **Build & deploy** → **Continuous deployment**
3. Click **"Link to Git provider"** → **GitHub**
4. Authorize Netlify → select your repo
5. Branch: **main** → click **Deploy site**

After this, every `git push` triggers an automatic redeploy.

### 5D — Set a Custom Site Name (Optional)
1. Netlify dashboard → your site → **Site configuration** → **General**
2. Click **"Change site name"**
3. Enter something like `ipl-come-telegram` → Save
4. Your URL becomes `https://ipl-come-telegram.netlify.app`

### 5E — Add a Custom Domain (Optional but looks professional)
1. Buy a domain from GoDaddy/Namecheap (e.g. `iplpredictions.in` — ~₹500/year)
2. Netlify → **Domain management** → **Add domain**
3. Follow the DNS instructions Netlify gives you
4. HTTPS is added automatically (free)

---

## STEP 6 — Add Environment Variables to Netlify

This makes the CAPI server function work with your Pixel.

1. Netlify dashboard → your site
2. **Site configuration** → **Environment variables**
3. Click **"Add a variable"** — add these two:

| Key | Value |
|---|---|
| `META_PIXEL_ID` | Your 15-16 digit Pixel ID |
| `META_ACCESS_TOKEN` | Your `EAABx...` access token |

4. Click **Save**
5. Go to **Deploys** → **Trigger deploy** → **Deploy site**

> **Important:** The function will not work until you redeploy after adding the variables.

---

## STEP 7 — Add Facebook Domain Verification

This tells Meta that this website belongs to your Business Manager, which is required before you can run conversion ads.

### 7A — Get Verification Code
1. Business Settings ⚙️ → **Brand Safety** → **Domains**
2. Click **"Add"** → enter your Netlify domain (e.g. `amazing-fox-123.netlify.app`)
3. Select **"DNS Verification"** or **"HTML Meta Tag"** method

### 7B — Using HTML Meta Tag Method (Easiest)
1. Meta gives you a code like:
   ```html
   <meta name="facebook-domain-verification" content="abcd1234xyz" />
   ```
2. Open `index.html` → line 7 already has this tag:
   ```html
   <meta name="facebook-domain-verification" content="8180s553iiqt6ljhi7d9lryo99k3go" />
   ```
3. Replace the `content` value with your own code
4. Push to GitHub → Netlify redeploys
5. Back in Meta Business Settings → click **"Verify"**
6. Status should change to ✅ Verified

---

## STEP 8 — Test Everything

### 8A — Test Browser Pixel
1. **business.facebook.com** → Events Manager → your pixel
2. Click **"Test Events"** tab
3. Paste your Netlify URL → click **"Open Website"**
4. Your page opens in a new tab
5. Back in Events Manager → you should see `PageView` appear ✅
6. Click JOIN TELEGRAM button → `Subscribe` event appears ✅

### 8B — Test CAPI (Server Events)
1. Same **Test Events** tab
2. Toggle to **"Server Events"**
3. Reload your page
4. `PageView` appears here too (from Netlify Function) ✅
5. Click button → `Subscribe` appears in server events ✅

### 8C — Confirm Deduplication
1. Events Manager → **Overview** tab
2. Both `PageView` and `Subscribe` are counted **once not twice** ✅
3. This means browser pixel + CAPI are working together correctly

### 8D — Mobile Test
1. Open your Netlify URL on your actual phone (not just browser dev tools)
2. Check the image loads correctly
3. Check the JOIN TELEGRAM button works and opens Telegram
4. Check the layout looks good on your phone's screen size

---

## STEP 9 — Create Your Meta Ad Campaign

Now that your landing page and pixel are working, create your ad.

### 9A — Go to Ads Manager
1. **business.facebook.com** → 9-dot menu → **Ads Manager**
2. Click **"+ Create"** (green button)

### 9B — Choose Campaign Objective
- Select **"Leads"** → this optimizes for people who click the Telegram button
- Or select **"Traffic"** → this optimizes for people who visit your page
- **Recommended: Leads** — Meta will find people most likely to click JOIN TELEGRAM

### 9C — Campaign Budget
1. Select **"Campaign Budget Optimization" (CBO)**
2. Start with **₹300–₹500/day** for testing
3. Click **"Next"**

### 9D — Ad Set Settings
1. **Conversion location:** Website
2. **Pixel:** select your pixel
3. **Conversion event:** Subscribe (or Lead)
4. **Audience:**
   - Location: India
   - Age: 18–45
   - Interests: IPL, Cricket, Dream11, Fantasy Sports, Indian Premier League
5. **Placements:** Select "Advantage+ placements" (Meta optimizes automatically)
6. Click **"Next"**

### 9E — Ad Creative
1. **Format:** Single image
2. **Media:** Upload your `ipl-players.webp` image
3. **Primary text (Hindi works best):**
   ```
   आज होने वाले IPL मैच की 1st Rank Team पाओ — FREE!
   सिर्फ Telegram Join करो और हर मैच की Best Team पाओ।
   50,000+ Members पहले से Join कर चुके हैं 🏏
   ```
4. **Headline:** `आज की 1st Rank Team — Free Join करो`
5. **Description:** `Limited Time — अभी Join करो!`
6. **Call to Action:** Select **"Learn More"** or **"Sign Up"**
7. **Website URL:** your Netlify URL

### 9F — Publish
1. Review everything → click **"Publish"**
2. Ad goes into review — usually approved within 1–24 hours
3. Once approved, it starts running

> **Ad Rejection Tips:**
> - Do not use words like "guaranteed win", "100% sahi team" — Meta rejects these
> - Avoid claiming specific financial returns
> - Keep the ad copy honest and curiosity-based

---

## STEP 10 — Final Checklist Before Running Ads

```
□ index.html — Pixel ID updated (2 places)
□ index.html — Telegram link updated to your real link
□ index.html — Facebook domain verification meta tag updated
□ ipl-players.webp — image in project folder, under 700KB
□ GitHub — all files pushed (git push)
□ Netlify — site is live and loading correctly
□ Netlify — META_PIXEL_ID environment variable set
□ Netlify — META_ACCESS_TOKEN environment variable set
□ Netlify — redeployed after adding env variables
□ Meta Events Manager — PageView fires on page load ✅
□ Meta Events Manager — Subscribe fires on button click ✅
□ Server Events tab — both events appear there too ✅
□ Tested on real mobile phone — layout looks correct
□ JOIN TELEGRAM button — opens correct Telegram link
□ Domain verification — verified in Meta Business Settings
□ Ad Account — billing method added
```

---

## How It Works (Technical Summary)

```
User visits page
    │
    ├─► Browser Pixel fires PageView (client-side)
    │     fbq('track', 'PageView', {}, { eventID: 'uuid-123' })
    │
    └─► Netlify Function fires PageView (server-side)
          POST /.netlify/functions/capi
          → Sends to Meta Graph API with same eventID 'uuid-123'
          → Meta deduplicates: counts as 1 event, not 2

User clicks JOIN TELEGRAM
    │
    ├─► Browser Pixel fires Subscribe (client-side)
    │     fbq('track', 'Subscribe', {...}, { eventID: 'uuid-456' })
    │
    └─► Netlify Function fires Subscribe (server-side)
          → Same eventID 'uuid-456' → deduplicated
          → Includes: IP address, User Agent, fbp/fbc cookies
```

**Result: ~90-95% of all visitors tracked** (vs ~60-65% browser-only due to ad blockers and iOS privacy)

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `ipl-players.webp 404` | Image not pushed to GitHub | `git add ipl-players.webp && git push` then wait for redeploy |
| Pixel not firing | Pixel ID placeholder still in HTML | Find & Replace in index.html → push |
| `CAPI 500 error` | Env variables not set in Netlify | Add `META_PIXEL_ID` + `META_ACCESS_TOKEN` in Netlify env vars |
| Image loads slowly | Image too large (over 1MB) | Compress at squoosh.app → WebP format → 80% quality |
| Netlify not redeploying | GitHub not connected | Link GitHub in Site config → Build & deploy |
| Token expired | Access tokens expire after ~60 days | Regenerate in Meta Business Manager → System Users |
| Ad rejected by Meta | Copy violates policies | Remove any "guaranteed" or "100% win" language |
| Domain not verified | Wrong meta tag content | Copy exact content value from Meta Business Settings → update index.html |
| Events counted twice | Missing eventID | Already handled in our code — deduplication is built in |

---

## Making Updates After Launch

### Change the Telegram link
```bash
# Edit index.html → update the href on the button → save
git add index.html
git commit -m "update telegram link"
git push
```

### Change the hero image
```bash
# Save new image as ipl-players.webp in the project folder (replaces old one)
git add ipl-players.webp
git commit -m "update hero image"
git push
```

### Change the headline text
```bash
# Edit index.html → find <h1 class="headline"> section → update text → save
git add index.html
git commit -m "update headline"
git push
```

### Change the Come logo
```bash
# Replace comelogo.png with your new logo (same filename)
git add comelogo.png
git commit -m "update logo"
git push
```

---

## Tracking Quality Comparison

| Setup | Coverage | Cost |
|---|---|---|
| Browser Pixel only | ~60-65% | ₹0 |
| **Browser Pixel + Netlify CAPI** | **~90-95%** | **₹0** |
| WordPress + PixelYourSite Pro | ~90-95% | ~₹10,000/year |

---

## Key URLs

| Service | URL |
|---|---|
| Your live site | `https://glistening-biscotti-d3f417.netlify.app` |
| GitHub repo | `https://github.com/vishaldreameleven-ops/metaPixelAds` |
| Netlify dashboard | `https://app.netlify.com` |
| Meta Events Manager | `https://business.facebook.com/events_manager` |
| Meta Ads Manager | `https://www.facebook.com/adsmanager` |
| Meta Business Settings | `https://business.facebook.com/settings` |
| Image compressor | `https://squoosh.app` |
| Image to WebP (Python) | `pip install Pillow` then use the command in Step 1C |

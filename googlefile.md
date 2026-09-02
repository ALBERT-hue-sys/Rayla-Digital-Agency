# Google Business Profile & search visibility — Rayla Digital Agency

Last updated: 2 September 2026

This file covers three things: what was changed on the website, what you need to
do inside Google (which only you can do), and the exact words the site is now
being built to rank for.

---

## 1. Read this first — what I could and could not do

**I could not create the Google Business Profile.** A Business Profile is
created inside a Google account and then verified — Google sends a postcard,
places a phone call, or asks for a short video of the premises and the work
being done. Both halves need someone signed in as Rayla with access to that
phone or address. No tool I have can do that on your behalf.

**What I did do** is the half that lives in the code: the technical signals
Google reads off the website when it decides whether the Business Profile and
the site are the same business, and whether that business is a credible answer
for "marketing agency in Kampala". Section 2 lists those changes. Section 3 is
the click-by-click setup with every field already written for you to paste —
it should take about 25 minutes.

---

## 2. What changed on the website

### Structured data (`index.html`)

The `AdvertisingAgency` block that tells Google what this business *is* was
thin. It now carries:

| Added | Why it matters |
|---|---|
| `@id` — a permanent identifier for the business | Lets every other page point at *one* business entity instead of six loose copies. This is what links the site to your Business Profile. |
| `geo` — Kampala coordinates (0.3476, 32.5825) | Supports "near me" and map-pack queries. City-level, since there is no verified street address yet. |
| `areaServed` — Kampala, Uganda, East Africa | Matches how you actually work (the FAQ already says remote across East Africa). |
| `hasOfferCatalog` — all six services with their URLs | Google can show your services as distinct things you sell rather than inferring them from body copy. |
| `knowsAbout` — the six practice areas | Topical signal tying the brand to those subjects. |
| `addressRegion: Central Region` | Completes the postal address. |

Each of the six service pages now declares `serviceType` and points its
`provider` at that same `@id`, so the whole site reads as one business with six
services instead of six unrelated pages.

### Page titles

Titles were brand-first, which only wins searches for the brand name — people
who already know you. They now lead with the term someone types when they *do
not* know you yet, brand still attached:

| Page | Before | Now |
|---|---|---|
| Home | Rayla Digital Agency — Marketing That People Actually Pay Attention To | Digital Marketing Agency in Kampala, Uganda \| Rayla Digital Agency |
| Digital content production | Digital Content Production \| Rayla… | Digital Content Production in Kampala \| Rayla… |
| Social media management | Social Media Management \| Rayla… | Social Media Management in Kampala \| Rayla… |
| Content strategy | Content Strategy \| Rayla… | Content Strategy Agency in Kampala \| Rayla… |
| Graphic design | Graphic Design \| Rayla… | Graphic Design Services in Kampala \| Rayla… |
| Brand consulting | Brand Consulting \| Rayla… | Brand Consulting in Kampala, Uganda \| Rayla… |
| Digital marketing | Digital Marketing \| Rayla… | Digital Marketing Agency in Kampala \| Rayla… |

The homepage tagline is gone from the tab title. It still opens the page as the
H1, where visitors read it. If you would rather keep it in the title, say so and
I will put it back — it is a real trade of personality against ranking.

### New files

- **`robots.txt`** — the site had none. Points crawlers at the sitemap and
  allows everything.
- **`404.html`** — see section 5.
- **`sitemap.xml`** — `lastmod` dates refreshed to today so the re-crawl is
  triggered.

---

## 3. Setting up the Business Profile — do this part yourself

Sign in as the account you want to own this forever (not a personal address you
might lose), then go to **google.com/business** → *Manage now*.

### Step 1 — Name and category

- **Business name:** `Rayla Digital Agency`
  Exactly that. Do not add "Kampala" or "Marketing" to the name. Keyword
  stuffing the name is against Google's guidelines and competitors can report
  it — the listing gets suspended, and suspension is far harder to undo than it
  is to avoid.
- **Primary category:** `Marketing agency`
- **Additional categories** (add the ones Google offers; the list changes):
  `Advertising agency`, `Internet marketing service`, `Graphic designer`,
  `Video production service`, `Business to business service`

The primary category does most of the ranking work. `Marketing agency` is the
broadest honest fit; change it only if a service becomes the bulk of the work.

### Step 2 — Location

You work with clients rather than receiving walk-ins, so:

- "Do you want to add a location customers can visit?" → **No**
- Set **service areas**: `Kampala`, `Wakiso`, `Entebbe`, `Mukono`, `Jinja`,
  and `Uganda`

Google still asks for a street address to verify you; enter the real one and
tick the box to keep it hidden. Only add a visitable address if someone is
actually there during the hours you publish.

### Step 3 — Contact details

These must match the website **character for character** — Google cross-checks
them, and a mismatch weakens both.

- **Phone:** `+256 764 065 441`
- **Website:** `https://www.rayladigitalagency.com/`

> ⚠️ **Confirm the phone number before you publish it.** The site's structured
> data carried `+256 746 065 441` while every visible link on every page says
> `+256 764 065 441` — the middle digits are swapped. I set the structured data
> to match the visible links, on the grounds that the version appearing three
> times in the markup is more likely the real one. If the other one is correct,
> tell me and I will correct all of them.

### Step 4 — Hours

I did not invent opening hours, and they are not in the structured data or the
site. Add real ones in the profile (they show in search results and affect
"open now" filtering), then tell me and I will mirror them into the site's
structured data. Remember to set holiday hours — a profile that says "open"
when you are shut earns one-star reviews.

### Step 5 — Description (750 characters max)

Paste this, or edit it — it is written to use the target terms naturally rather
than list them:

> Rayla Digital Agency is a creative marketing agency in Kampala, Uganda. We
> help brands build content, strategy and digital presence that earns real
> attention — not just more posts. Our team handles digital content production,
> social media management, content strategy, graphic design, brand consulting
> and digital marketing in-house, for businesses across Uganda and East Africa.
> Every project starts with one question: what will make this audience care?
> Whether you are launching a brand, entering a new market or sharpening how you
> show up online, we build work designed for business impact. Book a free
> consultation to talk it through.

(714 characters.) The first sentence matters most — it is what gets truncated
into previews.

### Step 6 — Services

Add all six as separate services. The names must match the site exactly so the
profile and the pages reinforce each other:

| Service | Description to paste |
|---|---|
| Digital content production | Product videos, photography, commercials and brand films, produced end to end in Kampala. |
| Social media management | Day-to-day management across Instagram, Facebook, TikTok, LinkedIn and X — planning, publishing, community and reporting. |
| Content strategy | Audience research, campaign planning and platform positioning for brands in Uganda and East Africa. |
| Graphic design | Corporate branding, marketing materials, social media graphics and event branding. |
| Brand consulting | Brand positioning, business strategy and marketing consultation for founders and teams. |
| Digital marketing | SEO, Google Ads, Meta Ads, email marketing and analytics, managed and measured. |

### Step 7 — Photos

Photos are the single biggest driver of profile engagement, and this is where
an agency should obviously outperform. Upload at the start:

- **Logo** — square, 720×720px minimum → `assests/images/RAYLALOGO2.png`
- **Cover** — landscape 1024×576px
- **At least 10 more**: the team working, a shoot in progress, studio setup,
  finished client work, the workspace. Real photos of real work. There are
  usable ones already in `assests/images/` (`rayla-photo-filmcrew.jpeg`,
  `rayla-photo-studio-setup.jpeg`, `rayla-photo-meeting.jpeg`,
  `rayla-photo-workspace-overhead.jpeg`).

Then add a few every month. Profiles that go quiet slide down.

### Step 8 — Verify

Google will offer postcard, phone, email or video. Take whichever it offers
first; the profile does not appear publicly until it is verified. Video
verification usually means a single unbroken clip showing the area, your
equipment, and you accessing something that proves the business is yours.

### Step 9 — After it is live

1. **Google Search Console** — search.google.com/search-console. Add
   `https://www.rayladigitalagency.com/`, verify by DNS, submit
   `https://www.rayladigitalagency.com/sitemap.xml`. This is where you will see
   the search terms you actually appear for, which beats any keyword list
   including the one below.
2. **Reviews.** Get the short review link from the profile dashboard and send
   it to every past client — Denri, Krystal Ice, the Future of Education in
   Africa Conference. Reviews are the strongest lever you have over map-pack
   position, and reply to every single one.
3. **Posts.** Publish a Google Post weekly — new work, an offer, a note about a
   shoot. They expire after 7 days, which is the point: it is a freshness
   signal.
4. **Q&A.** Ask and answer your own questions ("Do you work with brands outside
   Uganda?"). If you leave the section empty, strangers fill it in for you.

---

## 4. The words to rank for

Chosen from your services and market. **They are not volume-verified** — I have
no access to live search-volume data for Uganda, and anyone who hands you a
keyword list without saying that is guessing too. Treat this as the starting
hypothesis, then let Search Console tell you which ones are real after 4–6
weeks and drop the rest.

Uganda is a small enough search market that the tail matters more than the head:
"digital marketing agency in Kampala" is worth winning, but "social media
management for restaurants in Kampala" converts and is nearly uncontested.

### Tier 1 — primary, the homepage's job

These are the money terms. Hardest, slowest, worth it.

1. digital marketing agency in Kampala
2. marketing agency in Uganda
3. creative agency Kampala
4. advertising agency Kampala
5. digital agency Uganda

### Tier 2 — one per service page

Each page owns one term. Do not let two pages chase the same one; they compete
with each other and split the signal.

| Page | Primary term | Secondary terms |
|---|---|---|
| Digital content production | video production Kampala | commercial video production Uganda, product photography Kampala, brand film Uganda |
| Social media management | social media management Kampala | social media agency Uganda, Instagram management Kampala, TikTok marketing Uganda |
| Content strategy | content strategy agency Uganda | content marketing Kampala, social media strategy Uganda |
| Graphic design | graphic design services Kampala | branding design Uganda, logo design Kampala, event branding Kampala |
| Brand consulting | brand consulting Uganda | brand strategy Kampala, rebranding agency Uganda |
| Digital marketing | digital marketing services Kampala | SEO services Uganda, Google Ads management Kampala, Meta ads agency Uganda |

### Tier 3 — long-tail, where you will win first

Low competition, high intent. Each is worth a page or a substantial article,
and each is a question a client has actually asked you:

- how much does social media management cost in Uganda
- best marketing agency for small businesses in Kampala
- content creation services for businesses in Uganda
- product photography for e-commerce Uganda
- social media management for restaurants in Kampala
- marketing agency for startups Uganda
- corporate branding companies in Kampala
- how to grow a business on social media in Uganda

`pages/` currently holds only the six service pages. Tier 3 is what a blog or
insights section would be for — that is the next piece of work, and it is where
most of the traffic gain actually comes from.

### Branded — defend these

`Rayla Digital Agency`, `Rayla Agency Uganda`, `Rayla Kampala`. You should be
position one for all of them. The Business Profile is what puts a panel on the
right-hand side of the results when someone searches your name.

### One thing not to do

Do not stuff these phrases into the page copy. Google has penalised that since
2012, and the current site's writing is genuinely good — that is an asset. The
terms belong in titles, headings, the Business Profile, and in honest sentences
where they read naturally. Nowhere else.

---

## 5. The 404 page

`404.html` at the repository root. It matches the site's palette and type, and
carries the error message, a way home, a consultation link, links to all six
service pages, and your contact details — so a broken link becomes a fork in the
road rather than a dead end.

Three deliberate details:

- **`noindex`** in the head. A 404 that gets indexed can rank for your own brand
  name, which is embarrassing and hard to undo.
- **All CSS is inline and every path is root-absolute** (`/css/…`, `/pages/…`).
  The server returns this same file for a miss at *any* depth — `/nope`,
  `/pages/nope`, `/a/b/c/nope` — and a browser resolves relative paths against
  whatever URL was requested, so `css/style.css` would 404 as well and the error
  page would arrive unstyled. The cost of this is that the page carries its own
  copy of the colour and type tokens: **if the palette in `css/style.css`
  changes, change it in `404.html` too.**
- The logo is set as type (`RAYLA.`) rather than the image file, so the page has
  no asset dependency at all.

### ⚠️ It needs one line of host configuration

The file exists but your host has to be told to serve it. Which line depends on
where the site is hosted — tell me and I will add it:

| Host | What is needed |
|---|---|
| Netlify | Nothing. A root `404.html` is automatic. |
| Vercel | Nothing. Automatic. |
| GitHub Pages | Nothing. Automatic. |
| Apache / cPanel | An `.htaccess` at the root containing `ErrorDocument 404 /404.html` |
| Nginx | `error_page 404 /404.html;` in the server block |

Until that is set, a missing URL shows the host's default error page, not this
one. Note also that this handles *missing pages* — it cannot catch a JavaScript
error on a page that loaded. The site is built so that if the JavaScript fails
the page still works, which is the protection against that.

---

## 6. Still outstanding

1. **Confirm the phone number** — the digit-swap described in step 3.
2. **`og-cover.png` does not exist.** Every page points its `og:image` and
   `twitter:image` at
   `https://www.rayladigitalagency.com/assests/images/og-cover.png`, and there
   is no such file in `assests/images/`. Every link shared to WhatsApp,
   LinkedIn, X or Facebook is therefore showing no preview image at all. It
   needs a 1200×630px image. I can build one from the logo and brand colours if
   you want, or drop in a photo you prefer.
3. **Opening hours** — send them and they go into the structured data.
4. **Host configuration for the 404** — see the table above.
5. **A physical address**, if you ever take one. A verified street address
   unlocks the map pack properly, which is a large step up from a service-area
   listing.
6. **A blog / insights section** for the Tier 3 terms. The biggest remaining
   traffic opportunity, and the one that takes actual writing.

---

## 7. What to expect, honestly

The Business Profile can show up within days of verification and is the fastest
win available — for local searches it often matters more than the website.

The site changes are foundations, not switches. Titles and structured data need
a re-crawl, then Google needs to see engagement. Realistically: **6–12 weeks**
before movement on the Tier 2 terms, longer for Tier 1 where you are competing
with agencies who have been publishing for years. Anyone promising faster is
selling something.

The things that move the needle fastest, in order: reviews on the Business
Profile, photos on the Business Profile, and new pages that answer the Tier 3
questions. All three are content problems, not code problems — which, for a
content agency, is a good position to be in.

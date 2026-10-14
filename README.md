# Slugger Signature Event — website

Static HTML implementation of the `Slugger Signature Event` Claude Design
project. No build tools and no framework — open `index.html` in a browser or drop
the folder on any static host.

JavaScript is used in three places, all as progressive enhancement — with scripting
off the site still navigates and reads correctly:

- `assets/nav.js` on every page, to collapse the nav into a menu below 1080px.
- `assets/carousel.js` on `sponsors.html`, to rotate the sponsor logos.
- the Grasshopper sign-up embed's resize handler, inline on `volunteer.html`.

## Files

```
index.html          Overview       (hero, key numbers, staff/awards/holiday, museum band)
agenda-ms.html      Middle School Agenda
agenda-hs.html      High School Agenda   (identical content for now)
registration.html   Registration   (MS + HS entry, key dates, fees)
venue.html          Venue & Travel (KICC, airport, downtown, planning questions)
judging.html        Judging & Awards (notebook deadline, format, award list)
volunteer.html      Volunteer      (perks, roles, Grasshopper sign-up embed)
sponsors.html       Sponsors       (logo carousel)
faq.html            FAQ            (stacked question list, grows over time)
contact.html        Contact        (emails, webcast, live scoring)

assets/tokens.css   The "Modernist" design system — colours, type, spacing,
                    and the .btn / .card / .tag / .table component classes.
                    Imported from the design project; edit here to retune the look.
assets/site.css     Page layout: masthead, nav rail, editorial column, responsive rules.
assets/nav.js       Collapses the nav into a menu below 1080px. Enhancement only.
assets/carousel.js  Sponsor carousel on sponsors.html. Enhancement only.
assets/Henkel_Logo_RGB_Red.png   Sponsor logo, supplied.
assets/slugger-factory.png       Sponsor logo, black background knocked out.
assets/slugger.png         Event crest. Used in the masthead and as the Overview hero.
assets/Slugger_Signature_Event_Volunteer_Job_Descriptions_With_Org_Chart-1.pdf
                    Volunteer & staff job description manual, 630 KB.
                    Linked from the "Roles we need" section of volunteer.html.
assets/favicon.png         Tab icon (64x64, generated from slugger.png)
assets/apple-touch-icon.png  Home-screen icon (180x180, generated from slugger.png)

.build/             Optional page generator — see below.
sluggersig.png      Superseded 2026 logo, kept for reference.
```

## Editing

The ten pages are plain, self-contained HTML. For a content change, just edit
the page.

The masthead and nav rail are duplicated across all ten pages, so a change to
that shared chrome means ten edits. `.build/` exists to avoid that:

```bash
bash .build/build.sh
```

It stitches `.build/head.tpl` + `.build/body-<page>.html` + `.build/foot.tpl` into
the ten pages, stamping each page's `<title>`, meta description and active nav
item. Edit the template for chrome changes, edit a body file for content, then
rerun. The generated HTML has no dependency on `.build/` — you can delete the
folder and hand-edit from then on.

## Layout notes

- The masthead is pinned to **exactly 72px**: `.sidebar`'s sticky `top` and
  `.shell`'s `min-height` are both derived from `--hdr`. If you add anything to
  the header, keep it from wrapping or the sticky nav will slide underneath.
- Above 1080px the nav is a 288px rail — that layout is untouched by anything below.
- At 1080px and under it collapses to a single "Menu · <current section>" bar that
  opens a panel *overlaying* the page, so opening it never shoves content down.
  Closes on outside click and on Escape, which returns focus to the bar.
- Without JavaScript the `js` class is never set, the bar stays hidden, and the nav
  falls back to a horizontally scrolling strip of links. Uglier, but still complete
  navigation — so the menu is an enhancement, never a requirement.
- The collapsed bar is driven entirely from inside the `max-width: 1080px` block;
  the only base-level rule is `.nav-toggle { display: none }`.
- `--pad` is the single horizontal gutter (64px desktop → 22px phone). Full-bleed
  rows read it so the left and right edges of every section stay aligned.

## Deliberate departures from the design file

1. **Ten pages instead of one.** The design switches sections with in-page JS
   state; this is real navigation, so each section is a URL with its own title,
   description and back-button behaviour.
2. **`--color-accent-solid` (#dd2b0f).** The brand red #ec3013 only reaches
   4.20:1 against white, so body text on a filled red field missed WCAG AA. Filled
   fields behind text (`.btn-primary`, `.band`, `.skip-link`) use one step down the
   ramp at 4.74:1. Rules, borders and focus rings keep the true brand red. Revert
   by pointing `--color-accent-solid` back at `#ec3013` in `assets/tokens.css`.
   Small muted labels moved from `--color-neutral-600` (3.85:1) to `-700` (5.83:1)
   for the same reason.
3. **`.btn-pending` instead of a faded button.** The design faded not-yet-live CTAs
   to 45% opacity — 1.9:1, effectively unreadable. The replacement is a dashed-outline
   chip. No page uses it at present (both registration links and the volunteer
   sign-up are live); the class is kept in `site.css` for the next placeholder.
4. **Responsive rules.** The design is a fixed desktop composition; breakpoints at
   1180 / 1080 / 860 / 680 / 480px were added, plus a print stylesheet.

## Content added that is not in the design file

Delete these if you want a literal match:

- `index.html` — the "Start here" three-card row at the foot of the Overview.
  Splitting into pages removed the design's single-scroll affordance, so the
  Overview now points at the next steps.
- both agenda pages — the "Before you travel" checklist.
- `volunteer.html` — the closing footnote repeating the volunteer email and the
  judging-conflict rule.

## Still to fill in

| Item | Where | Status |
| --- | --- | --- |
| Both event codes + listing links | `registration.html` only | **Live** — verified against events.vex.com |
| Event name on events.vex.com | external | **Listings still say "Louisville Slugger Signature Event"** |
| Volunteer sign-up | `volunteer.html` | **Live** — Grasshopper form embedded at `#signup` |
| PO / invoicing instructions | *nowhere* | Was on Registration; card removed |
| Max 6 teams per org, 50% per-region cap | *nowhere* | Was on Registration; card removed |
| Smart Field Control, Skills for VURC/VAIRC | *nowhere* | Was on Registration; card removed |
| Sunday on-site registration | both agenda pages | **FAQ says yes; the agenda does not show it yet** |
| Hotel block names, rates, group codes | `venue.html` | "Coming soon" |
| YouTube livestream URL | `contact.html` | Published closer to the event |
| World Championship qualification spots | `judging.html` | Awaiting VEX Robotics allocation |
| Judge Advisor name | `index.html` | Being finalised |
| Floorplan, parking / trailer instructions, concessions | `venue.html` | Not in the source material |

## The two agendas

`agenda-ms.html` and `agenda-hs.html` are **byte-identical in content** right now,
deliberately: the split exists so the two schedules can diverge without another
restructure. They differ only in `<h1>`, `<title>`, meta description, active nav
item, and the switcher button pointing at the other one.

When they diverge, edit `.build/body-agenda-ms.html` and `.build/body-agenda-hs.html`
independently and rerun the build. Nothing else needs to change.

While they are identical there is a real risk of editing one and forgetting the
other, so anything meant to apply to both should be changed in both files in the
same sitting.

## Sponsors page

Logos live in `.build/body-sponsors.html` as `.carousel-slide` list items. To add
one, copy a block and rerun the build. No JS or CSS changes are needed; the dots
and rotation pick up the new slide automatically.

```html
<li class="carousel-slide">
  <img src="assets/their-logo.png" alt="" width="600" height="400">
  <span class="carousel-name">Their Name</span>
</li>
```

`alt=""` is deliberate: the visible `.carousel-name` caption underneath already
gives the sponsor's name, so alt text would make a screen reader say it twice.

### The drum

Faces sit evenly around a cylinder: each is turned `i * (360 / count)` degrees
and pushed out along Z by the radius where neighbouring faces just touch,
`(panelWidth / 2) / tan(PI / count)`. The drum is then rotated to bring a face
forward, and pulled back by that same radius so the front face lands on the
perspective plane and is never scaled by depth.

All of that is computed in `carousel.js` from the slide count, so **adding a
sponsor needs no CSS and no geometry changes**. Radius, face angle and panel
width all re-derive, including on resize.

### The padding copies

There are six faces but only two sponsors: each logo appears three times,
because a drum needs five or more faces before it reads as a drum rather than
two panels flapping. Two things keep that from looking like a bug, and both
matter if you edit the list:

- **The order alternates** (Henkel, Museum, Henkel, Museum, …) rather than
  grouping the copies. A drum shows three faces at once, so grouped copies would
  put Henkel next to Henkel in the same frame. Alternating guarantees the two
  faces flanking the front one are always the *other* brand.
- **Off-centre faces are dimmed to 28%.** It reads as depth, and it stops the
  copies competing with the logo actually being presented.

Copies carry `data-dupe`, which hides them in the flat fallback so a visitor
without JS sees one of each rather than the list stuttering. **When real
sponsors arrive, delete the `data-dupe` slides** and the drum keeps working
unchanged.

### Load-bearing, not decorative

- **The flat row is the default.** The markup renders sponsors side by side and
  `carousel.js` opts into the drum by adding `is-carousel`. If the script fails,
  every sponsor is still on screen, which is the failure mode a sponsor can live
  with.
- **The pause control is required.** Content that animates automatically for
  more than five seconds needs a way to stop it (WCAG 2.2.2). The controls are
  shown by CSS off `.is-carousel`, never by a `hidden` attribute: an author
  `display` rule beats the UA stylesheet's `[hidden] {display:none}`, which once
  left a dead Pause button on screen in the flat fallback.
- **Rotation runs regardless of `prefers-reduced-motion`.** A turning 3D drum is
  a lot of motion, so this is a deliberate trade against that preference, made
  because the alternative left anyone with Windows animations off seeing nothing
  move at all. WCAG 2.2.2 is still met through Pause. If strict reduced-motion
  behaviour is wanted later, gate the `run()` call on the media query.

`slugger-factory.png` was derived from the supplied `Slugger Factory.avif`, which
had an opaque black background that would have shown as a black rectangle on the
light page. The AVIF was decoded to PNG, the black field flood-filled to
transparency from the edges (so the black *inside* the oval survives), cropped to
the artwork and scaled to 600px wide. The original AVIF is left in `assets/` for
reference and does not need uploading.

## Branding

The event is **Slugger Signature Event**. "Louisville Slugger" survives in exactly
three places, all on `index.html`, all naming the museum rather than the event:
the Custom Awards trophy sentence, and the kicker and body of the factory-tour
band. Those were kept deliberately. Nothing else on the site carries the old name.

`assets/slugger.png` is drawn for a light ground: the wordmark is near-black, so
on the dark masthead it would all but vanish. Rather than lighten the whole
masthead, `.hdr-mark` carries a `--color-bg` plate, which reads as a deliberate
colour block at the left end of the bar. If a light-on-dark version of the crest
ever arrives, drop the `background` from `.hdr-mark` and use it directly.

The crest is 546x364. The Overview hero caps it at 400px wide, so it is always
displayed *below* native size and stays crisp; anything much larger than that
would start to soften. A bigger export would lift that ceiling.

## FAQ page

Entries live in `.build/body-faq.html`. To add one, copy the block and rerun the
build:

```html
<div class="faq-item">
  <dt class="faq-q">The question, as a team would ask it?</dt>
  <dd class="faq-a">The answer.</dd>
</div>
```

It is a plain stacked list on hairline rules, not an accordion. With one or two
entries an accordion would hide the only content on the page; once the list is
long enough that scanning it becomes work, that is the point to add collapsing.

Note the first entry says on-site registration will be available Sunday morning
and that an updated agenda is coming. Both agenda pages still show the original
Sunday schedule, so those two pages disagree until the new agenda lands.

## Volunteer sign-up embed

`volunteer.html` embeds the Grasshopper form in the `#signup` section. The vendor's
snippet is used as supplied, with two changes:

- `title="Volunteer sign-up form"` on the `<iframe>`, so screen readers announce it
  as something other than an unlabelled frame.
- The `message` listener checks `e.source === iframe.contentWindow` before acting.
  As supplied it accepted a `resize` message from *any* window, so any page that
  framed this one could drive the element's height. This is a source check rather
  than a hardcoded origin, so it keeps working if Grasshopper changes domains.
  Verified working: the form posts its height and the embed grows past the 800px
  starting box.

If the form ever fails to load, the section above it still carries the
`volunteer@reactrobotics.org` fallback, so the page never dead-ends.

## Event codes

The codes appear only on `registration.html` — the sidebar "Event codes" box and
the page footer that also carried them were removed.

Two separate listings on events.vex.com, one per grade level:

| | Code | Listing |
| --- | --- | --- |
| Middle School | `VE-26-65538` | `…/vex-robotics-competition/VE-26-65538.html#general-info` |
| High School | `RE-V5RC-26-4727` | `…/vex-robotics-competition/RE-V5RC-26-4727.html#general-info` |

Both verified live: 80 team capacity and $350 per team on each.

Note the two listings do **not** share a registration timeline, which is why the
Key Dates table breaks them out:

- Middle School has **no priority window** — standard registration opens 24 Aug 2026.
- High School has priority on 24 Aug 2026, standard on 7 Sep 2026.

Payment deadline (13 Nov), registration deadline (1 Dec) and competition dates are
common to both.

> The supplied `vex events info.md` labels `RE-V5RC-26-4727` as *Middle School*.
> The live listing says High School, and that is what the site follows. If that
> file is still circulating anywhere, it is stale.

## Dates: settled

The event runs **Dec 5–7, 2026**, and the site says so in all 23 places it states
a date: the masthead, the nav rail meta block, the Overview, the Key Dates table
and both agenda pages. No "Dec 6–7" wording exists anywhere in the site.

One thing is still out of the site's hands: both events.vex.com listings carry a
Date field of **6-Dec-2026 – 7-Dec-2026**, even though their own agenda opens with
"Saturday December 5th". A team cross-checking the listing will see a two-day
event where the site shows three, so the listing Date field is worth correcting
at the source.

If the dates ever do change, they live in `.build/head.tpl` (masthead and rail),
the Competition row of `.build/body-registration.html`, and the day headings in
both `.build/body-agenda-*.html`.

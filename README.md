# Owled Media · Diwali 2026

A personalised Diwali wish for Owled Media's clients. The owl (Lakshmi's vahana, and our name) holds a lit diya. The guest carries its flame to five diyas, and each one reveals one of our numbers. Fireworks go off, then the guest walks into the **Owled mela**: five stalls holding our work, one per division.

No framework and no build step: plain HTML, CSS and JavaScript, and all sound is synthesised in the browser.

## The flow

1. **Loader**: the owl blinks while fonts load, then one tap opens the wish (that tap is also what lets phones play sound).
2. **Light the diyas**: drag the flame from the owl's lamp to each diya, or tap a diya, or press "light them for me". Every diya you light makes the room brighter, plays a note and counts up a number.
3. **Reveal**: fireworks, then the greeting with the guest's name.
4. **The mela**: one continuous scroll. The owl walks to a stall, the stall opens on its own, scrolling runs through all its work, then it closes and the owl walks on. At the end of the lane an envelope opens with a personal note and a shareable story card. The way out has the wish back on WhatsApp.

## Personal links

```
index.html?name=Riya+Shah            → "happy diwali, Riya"
index.html?name=Riya+Shah&c=acme     → plus Acme's note and their picks
index.html                           → asks for a name on the loader
```

Make links in bulk with `tools/links.html`: paste one `Name, clientId` per line.

## Where to edit (no code needed)

| File | What's in it |
|---|---|
| `data/site.js` | Brand, every line of copy, the 5 numbers, the 5 stalls, contact, tracking |
| `data/work.js` | The portfolio: title, client, platform, month, views, thumbnail, link, one-line blurb |
| `data/clients.js` | Per-client note + which pieces to show in "made for you" |
| `assets/work/` | Thumbnails (WebP, 1080×1350). Leave `thumb: ''` for a generated cover |

Copy that uses `{name}` gets the guest's first name.

## Colours and fonts

Everything lives in `css/palettes.css`, taken from owledmedia.com: black, cream, signal red and amber, with Geist for body text. Headlines use Anton, the closest free match for OWLED's Mango Grotesque. To use the real font, add a licensed `@font-face` and put it first in `--display`.

## The note at the end of the lane

Past the last stall, the owl reaches an envelope. As the guest keeps scrolling it opens and their note rises out of it. The note comes from `data/clients.js` (`note`, or `copy.noteFallback` in `site.js` if the link has no client). The key after `c=` can be a company or one person, so each guest can have their own.

## Repo layout

```
index.html          the page
css/palettes.css    every colour and font, one block per palette
css/style.css       all styling (reads the tokens, no colours of its own)
js/core.js          guest, number formatting, synthesised sound, tracking
js/scene.js         loader, owl, diyas, night lighting, particles, fireworks
js/art.js           every mela illustration, as inline SVG
js/mela.js          the walk, stalls, work viewer, the note card, outro
js/share.js         1080×1920 share card
data/               the content (see above)
tools/links.html    bulk link maker
assets/             your images (thumbnails, og.jpg for link previews)
```

## Preview before publishing

- **GitHub Codespaces**: open the repo → Code → Codespaces → create, then run `python3 -m http.server 8080` and open the forwarded port.
- **On your computer**: double-click `index.html`. It works straight from the file, with no server.

## Publishing later (repo stays private)

Connect the private repo to **Cloudflare Pages**, **Netlify** or **Vercel** (all free, each gives a `*.pages.dev` / `*.netlify.app` / `*.vercel.app` address). No build command; the output directory is `/`. Every push to `main` goes live in about a minute.

## Tracking (optional)

1. Make a Google Form with four short-answer questions: name, client, event, detail.
2. Open the form's prefilled-link tool to find each question's `entry.123…` id.
3. Paste the form's `…/formResponse` URL and those ids into `site.js → track`.

Events: `open`, `reveal`, `stall`, `work`, `share`. Leave `form` empty and nothing is sent anywhere.

## Before you send it

- [ ] Real numbers in `site.js → stats`
- [ ] Real work in `data/work.js` (+ thumbnails in `assets/work/`)
- [ ] Contact email, WhatsApp number, website
- [ ] `assets/og.jpg` (1200×630) for the link preview on WhatsApp
- [ ] Test on an iPhone and an Android phone

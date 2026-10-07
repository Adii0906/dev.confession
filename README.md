# a tiny confession 💌

A small, interactive website for telling someone you like them.
It's meant to be cute, a little funny, and easy to say no to.

Plain HTML, CSS and JavaScript. No frameworks, no build step, no tracking.

## The flow

1. **The hook.** *"So… I made you a website."* One button: *Okay… I'm curious 👀*
2. **The setup.** He admits he's been trying to say something. Then he asks a favour: **hold the heart so I don't chicken out**. While she holds it, his "confidence" meter climbs and the page slowly blushes. If she lets go too early, it drains and he panics a little.
3. **The confession.** *"I like you."*, then a short, honest note, revealed line by line. Tap to skip ahead.
4. **The question.** Coffee, sometime? There are three answers, all the same size: **Yes**, **Let me think**, **I don't think so**.
5. **The ending.**
   - **Yes:** little hearts fly up and gather into one big heart, it beats once, and she gets a date "ticket" stamped *it's a date*.
   - **Maybe:** no rush, no timer.
   - **No:** the page calms to lavender. It thanks her for being honest and tells her she doesn't owe a reply.

The site never sends her answer anywhere, and it tells her so. On a yes, it asks her to send you a ☕.

## Make it yours

Open `script.js`. Everything at the top is optional:

```js
const CONFIG = {
  to: "",          // her name, e.g. "Riya". empty = "for you 💌"
  from: "",        // your name for the ticket. empty = "me"
  plan: "coffee",  // something you "grab": coffee, chai, boba, ice cream, dinner…
  planEmoji: "☕",
  extraLine: "",   // one line only you could write
  replyLink: "",   // optional one-tap reply link (WhatsApp, Instagram DM…)
};
```

`extraLine` is what makes it feel like it was written for *her*, so take a minute on it. Keep it specific and light, e.g. `"Also, your laugh is honestly unfair."`.

## Run it locally

Open `index.html` in a browser. That's it.

To test it on your phone, serve the folder and open it from your phone on the same Wi-Fi:

```bash
npx serve .          # or: python3 -m http.server 8080
```

## Deploy

Any static host works.

- **Vercel:** `npx vercel` in this folder, or import the repo at vercel.com.
- **Netlify:** drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages:** Settings → Pages → deploy from `main`.

### A nicer link preview

`og-image.jpg` is the card that shows up when the link is pasted into a chat. Link previews need an absolute URL. After deploying, uncomment the `og:image` line in `index.html` and put your real URL in it.

## Little details

- Works with touch, mouse or keyboard. Hold **Space/Enter** on the heart. Tapping fast also works, so nobody gets stuck.
- Respects **reduced motion**: same story, no floating or flying things.
- Still readable with **JavaScript off**: it shows the whole thing as a simple letter.
- `noindex`, so it won't show up in search results.
- Fonts: Fraunces, DM Sans and Caveat from Google Fonts, with good system fallbacks.

<details>
<summary>Easter eggs (spoilers)</summary>

- Tap the ♥ in the footer. It shows a different dev joke on every screen (`git commit -m "finally told her"`, `git stash`, `exit 0`…).
- Switch tabs mid-story and check the tab title.
- Let go of the heart early a few times. You'll get `404: courage not found`.
- Open devtools, or view the page source.
- Visit any page that doesn't exist.

</details>

## Files

```
index.html     the story (every screen is right there in the HTML)
style.css      the look + all the CSS animations
script.js      scene flow, the hold-the-heart bit, the heart animation
favicon.svg
og-image.jpg   link preview card
404.html       a tiny joke
```

Be kind, be honest, and good luck. 🫶

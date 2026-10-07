/* ==========================================================
   a tiny confession — script.js
   no frameworks, no tracking, nothing leaves this page.
   ========================================================== */

/* ✏️  make it yours. everything here is optional. */
const CONFIG = {
  to: "",                // her name, e.g. "Riya". empty = "for you 💌"
  from: "",              // your name for the ticket. empty = "me"
  plan: "coffee",        // something you "grab": coffee, chai, boba, ice cream, dinner…
  planEmoji: "☕",
  extraLine: "",         // one line only you could write, e.g. "Also, your laugh is honestly unfair."
  replyLink: "",         // optional one-tap reply, e.g. "https://wa.me/91XXXXXXXXXX?text=%E2%98%95" or your instagram DM link
};

/* ---------- tiny helpers ---------- */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const motionOK = () => !reducedMotion.matches;

const fx = $("#fx");
const PALETTE = ["#c4677d", "#e5a3ae", "#7b2d45", "#d98a9c", "#b9a6e6"];
const HEART_TONES = ["#c4677d", "#7b2d45", "#e08a9e", "#a8435f", "#d9a0ad", "#9b87d6"];

/* ---------- personalise ---------- */

function applyConfig() {
  $$("[data-fill]").forEach((el) => {
    const value = (CONFIG[el.dataset.fill] || "").trim();
    if (!value) return;
    el.textContent = value;
    el.hidden = false;
  });

  if (CONFIG.to) document.querySelector(".scene--hook").dataset.title = `for ${CONFIG.to} 💌`;

  if (CONFIG.replyLink) {
    $("#replyLink").href = CONFIG.replyLink;
    $$('[data-needs="replyLink"]').forEach((el) => (el.hidden = false));
  }
}

/* ---------- scenes ---------- */

const scenes = Object.fromEntries($$(".scene").map((el) => [el.dataset.scene, el]));
let current = null;
let busy = false;
let revealEndsAt = 0;

function indexReveals(scene) {
  const items = $$(".reveal", scene).filter((el) => !el.closest("[hidden]"));
  let i = 0;
  items.forEach((el) => {
    el.style.setProperty("--i", i);
    if (!el.hasAttribute("data-with-next")) i++; // e.g. the letter card arrives with its first line
  });
  const step = parseFloat(getComputedStyle(scene).getPropertyValue("--step")) || 120;
  return i * step + 900;
}

function enter(name, { focus = true } = {}) {
  const scene = scenes[name];
  const total = indexReveals(scene);
  scene.classList.remove("is-fast");
  scene.classList.add("is-current");
  current = scene;
  revealEndsAt = performance.now() + total;
  document.body.dataset.scene = name;
  document.title = scene.dataset.title || document.title;
  window.scrollTo(0, 0);
  if (focus) scene.focus({ preventScroll: true });
  egg.refresh();
  if (name === "setup") hold.reset();
}

async function go(name, { until } = {}) {
  if (busy || !scenes[name]) return;
  busy = true;
  const leaving = current;
  leaving.classList.add("is-leaving");
  await wait(motionOK() ? 420 : 150);
  leaving.classList.remove("is-current", "is-leaving");
  if (until) await until;
  enter(name);
  busy = false;
}

/* ---------- little heart bursts ---------- */

function spawnHeart(x, y, { size = rand(9, 16), color } = {}) {
  const el = document.createElement("span");
  el.className = "fx-heart";
  el.style.setProperty("--s", `${size.toFixed(1)}px`);
  el.style.setProperty("--c", color || PALETTE[(Math.random() * PALETTE.length) | 0]);
  el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  fx.append(el);
  return el;
}

function burst(target, count = 7, spread = 52) {
  if (!motionOK() || !target) return;
  const r = target.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + ((i / (count - 1 || 1)) - 0.5) * Math.PI * 1.2 + rand(-0.15, 0.15);
    const dist = spread * rand(0.7, 1.25);
    const tx = cx + Math.cos(angle) * dist;
    const ty = cy + Math.sin(angle) * dist;
    const el = spawnHeart(cx, cy);
    el.animate(
      [
        { transform: `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(.3)`, opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: `translate(${tx}px, ${ty}px) translate(-50%, -50%) scale(1) rotate(${rand(-25, 25)}deg)`, opacity: 0 },
      ],
      { duration: rand(650, 900), easing: "cubic-bezier(.2,.8,.3,1)" }
    ).onfinish = () => el.remove();
  }
}

/* ---------- the "yes" heart: little hearts gather into one big one ---------- */

// points spaced evenly along the classic heart curve (so the tip doesn't clump)
function heartPoints(count) {
  const curve = [];
  for (let i = 0; i <= 600; i++) {
    const t = (i / 600) * Math.PI * 2;
    curve.push([
      16 * Math.sin(t) ** 3,
      -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    ]);
  }
  const lengths = [0];
  for (let i = 1; i < curve.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(curve[i][0] - curve[i - 1][0], curve[i][1] - curve[i - 1][1]));
  }
  const total = lengths[lengths.length - 1];
  const points = [];
  let j = 0;
  for (let k = 0; k < count; k++) {
    const target = (k / count) * total;
    while (lengths[j + 1] < target) j++;
    points.push(curve[j]);
  }
  return points;
}

function formHeart(origin) {
  if (!motionOK()) return wait(250);

  return new Promise((resolve) => {
    const r = origin.getBoundingClientRect();
    const ox = r.left + r.width / 2;
    const oy = r.top + r.height / 2;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.44;
    const scale = Math.min(window.innerWidth * 0.62, 300) / 34;
    const count = window.innerWidth < 520 ? 36 : 44;
    const stagger = 20;
    const travel = 1050;

    const group = document.createElement("div");
    group.style.cssText = `position:absolute;inset:0;transform-origin:${cx}px ${cy}px`;
    fx.append(group);

    const parts = [];
    heartPoints(count).forEach(([hx, hy], i) => {
      const tx = cx + hx * scale;
      const ty = cy + (hy - 2.5) * scale;
      const rot = rand(-20, 20);
      const el = spawnHeart(ox, oy, { size: rand(11, 18), color: HEART_TONES[i % HEART_TONES.length] });
      group.append(el);
      el.animate(
        [
          { transform: `translate(${ox}px, ${oy}px) translate(-50%, -50%) scale(.2)`, opacity: 0 },
          { opacity: 1, offset: 0.15 },
          { transform: `translate(${tx}px, ${ty}px) translate(-50%, -50%) scale(1) rotate(${rot}deg)`, opacity: 1 },
        ],
        { duration: travel, delay: i * stagger, easing: "cubic-bezier(.2,.75,.25,1)", fill: "forwards" }
      );
      parts.push({ el, tx, ty, rot });
    });

    const formed = travel + count * stagger;

    // one proud heartbeat
    setTimeout(() => {
      group.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.1)", offset: 0.2 },
          { transform: "scale(.98)", offset: 0.42 },
          { transform: "scale(1.06)", offset: 0.62 },
          { transform: "scale(1)" },
        ],
        { duration: 900, easing: "ease-in-out" }
      );
      navigator.vibrate?.([12, 90, 12]);
    }, formed - 80);

    // then let them float away while the next screen arrives
    setTimeout(() => {
      resolve();
      parts.forEach(({ el, tx, ty, rot }) => {
        const dx = rand(-40, 40);
        const dy = rand(140, 320);
        el.animate(
          [
            { transform: `translate(${tx}px, ${ty}px) translate(-50%, -50%) scale(1) rotate(${rot}deg)`, opacity: 1 },
            { transform: `translate(${tx + dx}px, ${ty - dy}px) translate(-50%, -50%) scale(.5) rotate(${rot * 3}deg)`, opacity: 0 },
          ],
          { duration: rand(1300, 2000), delay: rand(0, 300), easing: "cubic-bezier(.4,0,.7,1)", fill: "forwards" }
        );
      });
      setTimeout(() => group.remove(), 2500);
    }, formed + 820);
  });
}

/* ---------- hold the heart so I don't chicken out ---------- */

const hold = (() => {
  const wrap = $("#hold");
  const btn = $("#holdBtn");
  const hint = $("#holdHint");
  const meter = $("#meter");

  const START = 0.12;
  const FILL = 0.6;   // per second while holding (~1.5s for the whole thing)
  const DRAIN = 0.22; // per second after letting go
  const TAP = 0.11;

  const IDLE_LINE = "hold the heart so I don't chicken\u00a0out\u00a0👉\u2060👈";
  const HOLD_LINES = [
    [0.32, "okay… okay…"],
    [0.55, "keep going 😭"],
    [0.8, "almost there…"],
    [1.01, "OKAY OKAY OKAY"],
  ];
  const LET_GO_LINES = [
    "noo, don't let go 😭",
    "my courage is leaking 😭",
    "404: courage not found",
    "okay, from the top\u00a0👉\u2060👈",
  ];

  let p = START;
  let holding = false;
  let done = false;
  let raf = 0;
  let last = 0;
  let pressedAt = 0;
  let releasedAt = 0;
  let letGos = 0;
  let taps = 0;
  let keyDown = false;

  const say = (text) => {
    if (hint.textContent !== text) hint.textContent = text;
  };

  function render() {
    wrap.style.setProperty("--p", p.toFixed(3));
    meter.textContent = Math.round(p * 100);
    document.body.style.setProperty("--blush", (((p - START) / (1 - START)) * 0.8).toFixed(3));
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (holding) {
      p = Math.min(1, p + FILL * dt);
      say(HOLD_LINES.find(([max]) => p < max)?.[1] || HOLD_LINES[HOLD_LINES.length - 1][1]);
    } else if (now - releasedAt > 550) {
      p = Math.max(START, p - DRAIN * dt);
    }

    render();

    if (p >= 1) return complete();
    raf = holding || p > START ? requestAnimationFrame(tick) : 0;
    if (!raf) wrap.classList.add("is-idle");
  }

  function run() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function press() {
    if (done || holding) return;
    holding = true;
    pressedAt = performance.now();
    wrap.classList.add("is-holding");
    wrap.classList.remove("is-idle");
    run();
  }

  function release() {
    if (!holding || done) return;
    holding = false;
    releasedAt = performance.now();
    wrap.classList.remove("is-holding");

    if (releasedAt - pressedAt < 220) {
      taps++;
      p = Math.min(1, p + TAP);
      say(taps < 3 ? "hold it, don't just tap 😌" : "…or tap really fast. that works too 😭");
    } else {
      say(LET_GO_LINES[Math.min(letGos, LET_GO_LINES.length - 1)]);
      letGos++;
    }
    run();
  }

  function complete() {
    done = true;
    holding = false;
    raf = 0;
    p = 1;
    render();
    wrap.classList.remove("is-holding", "is-idle");
    wrap.classList.add("is-done");
    say("okay. here goes nothing.");
    burst(btn, 12, 90);
    navigator.vibrate?.(18);
    setTimeout(() => go("confess"), 950);
  }

  function reset() {
    cancelAnimationFrame(raf);
    raf = 0;
    p = START;
    holding = done = keyDown = false;
    letGos = taps = 0;
    wrap.classList.remove("is-holding", "is-done");
    wrap.classList.add("is-idle");
    say(IDLE_LINE);
    render();
  }

  btn.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    btn.setPointerCapture?.(e.pointerId);
    press();
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => btn.addEventListener(type, release));
  btn.addEventListener("contextmenu", (e) => e.preventDefault());

  // keyboard: holding space / enter works just like holding a finger down
  btn.addEventListener("keydown", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (keyDown) return;
    keyDown = true;
    press();
  });
  btn.addEventListener("keyup", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    keyDown = false;
    release();
  });
  btn.addEventListener("blur", () => {
    keyDown = false;
    release();
  });

  // assistive tech "clicks" without pressing: just fill it up for them
  btn.addEventListener("click", (e) => {
    if (e.detail !== 0 || done) return;
    holding = true;
    run();
  });

  return { reset };
})();

/* ---------- the little secret in the footer ---------- */

const egg = (() => {
  const btn = $("#egg");
  const note = $("#eggNote");
  const LINES = {
    hook: "status: nervous\nconfidence: 12%\nfeelings: definitely not zero",
    setup: "status: nervous\nconfidence: 12%\nfeelings: definitely not zero",
    confess: '$ git commit -m "finally told her"\n 1 file changed, 1 feeling inserted(+)',
    ask: "$ git status\nwaiting for a response…\n(no pressure. really.)",
    yes: "$ git push origin coffee-date\n✓ done. zero merge conflicts ❤️",
    maybe: "$ git stash\nsaved for later. no rush.",
    no: "$ exit 0\n# no hard feelings. genuinely.",
  };

  const refresh = () => {
    note.textContent = LINES[document.body.dataset.scene] || LINES.hook;
  };

  btn.addEventListener("click", () => {
    const open = note.hidden;
    refresh();
    note.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if (!note.hidden && !e.target.closest(".footer")) {
      note.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });

  return { refresh };
})();

/* ---------- wiring ---------- */

document.addEventListener("click", async (e) => {
  const next = e.target.closest("[data-go]");
  if (next) {
    burst(next, 7);
    go(next.dataset.go);
    return;
  }

  const answer = e.target.closest("[data-answer]");
  if (answer && !busy) {
    const choice = answer.dataset.answer;
    $$("[data-answer]").forEach((b) => (b.disabled = true));
    document.body.dataset.scene = choice;
    if (choice === "yes") {
      go("yes", { until: formHeart(answer) });
    } else {
      go(choice);
    }
    await wait(1000);
    $$("[data-answer]").forEach((b) => (b.disabled = false));
    return;
  }

  if (e.target.closest("[data-restart]")) {
    document.body.style.setProperty("--blush", 0);
    go("hook");
    return;
  }

  // impatient? tap during the confession to show it all
  if (tapStartedOnConfession && current === scenes.confess && performance.now() < revealEndsAt) {
    current.classList.add("is-fast");
    revealEndsAt = 0;
  }
});

// (only counts taps that *start* on the confession, so letting go of the heart late doesn't skip it)
let tapStartedOnConfession = false;
document.addEventListener("pointerdown", (e) => {
  tapStartedOnConfession = current === scenes.confess;
});

// switch tabs mid-confession and the tab title notices
document.addEventListener("visibilitychange", () => {
  const midStory = ["hook", "setup", "confess", "ask"].includes(document.body.dataset.scene);
  if (document.hidden && midStory) document.title = "psst… come back 👉👈";
  else if (current) document.title = current.dataset.title;
});

// a faint trail of tiny hearts behind the cursor (mouse only)
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let lx = 0;
  let ly = 0;
  let lt = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!motionOK() || e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lt < 80 || Math.hypot(e.clientX - lx, e.clientY - ly) < 70) return;
      lx = e.clientX;
      ly = e.clientY;
      lt = now;
      const dot = document.createElement("span");
      dot.className = "fx-trail";
      dot.style.left = `${e.clientX + rand(-6, 6)}px`;
      dot.style.top = `${e.clientY + rand(-6, 6)}px`;
      dot.addEventListener("animationend", () => dot.remove());
      fx.append(dot);
    },
    { passive: true }
  );
}

console.log("%cpsst 👀", "font: italic 600 20px Georgia, serif; color: #7b2d45");
console.log(
  '%cyou opened devtools on a confession website. respect.\n\n$ git commit -m "finally told her"',
  "font: 12px ui-monospace, Menlo, monospace; color: #6a5760; line-height: 1.6"
);

/* ---------- start: wait (briefly) for the pretty fonts, then say hi ---------- */

applyConfig();

const fontsReady = document.fonts
  ? Promise.all(
      ["400 1em Fraunces", "italic 400 1em Fraunces", "400 1em 'DM Sans'", "500 1em Caveat"].map((f) =>
        document.fonts.load(f).catch(() => {})
      )
    )
  : Promise.resolve();

Promise.race([fontsReady, wait(1200)]).then(() => {
  document.documentElement.classList.add("is-ready");
  enter("hook", { focus: false });
});

// ===== script.js =====
// DOM elements
const output = document.getElementById("output");
const buttons = document.getElementById("buttons");
const heartContainer = document.getElementById("heartContainer");
const bootOverlay = document.getElementById("bootOverlay");
const mainContainer = document.getElementById("mainContainer");

// ---------- SIMPLE PINK LANDING PAGE – just "initializing..." – NO HEARTS, NO EXTRA ----------
setTimeout(() => {
  bootOverlay.classList.add('hidden');
  mainContainer.classList.add('visible');
  
  // init background hearts (only for confession part)
  initBackgroundHearts();
  
  // start confession flow
  setTimeout(() => {
    start();
  }, 100);
}, 1800); // 1.8 seconds – clean and simple

// ---------- ORIGINAL CONFESSION LOGIC (spacing fixed) ----------
let noClickCount = 0;
let yesButtonSize = 1;

function initBackgroundHearts() {
  const positions = [
    { top: '10%', left: '15%' }, { top: '25%', left: '85%' },
    { top: '60%', left: '10%' }, { top: '75%', left: '80%' },
    { top: '40%', left: '5%' },  { top: '20%', left: '92%' }
  ];
  positions.forEach((pos, i) => {
    const heart = document.createElement('div');
    heart.className = 'bg-heart';
    heart.innerHTML = '♡';
    heart.style.top = pos.top;
    heart.style.left = pos.left;
    heart.style.animationDelay = i * 2 + 's';
    document.body.appendChild(heart);
  });
}

function typeText(text, callback, speed = 25) {
  let i = 0;
  output.innerHTML = '';
  
  // remove any accidental leading newline
  const cleanText = text.startsWith('\n') ? text.substring(1) : text;
  
  const interval = setInterval(() => {
    if (i < cleanText.length) {
      if (cleanText.charAt(i) === '<') {
        const closingTag = cleanText.indexOf('>', i);
        output.innerHTML += cleanText.substring(i, closingTag + 1);
        i = closingTag + 1;
      } else {
        output.innerHTML += cleanText.charAt(i);
        i++;
      }
      output.scrollTop = output.scrollHeight;
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function clearButtons() { buttons.innerHTML = ""; }

function addButton(text, action, className = "") {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = action;
  if (className) btn.className = className;
  buttons.appendChild(btn);
}

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.innerHTML = "♡";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.color = Math.random() > 0.5 ? "#ffa6c1" : "#d47b96";
  heartContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}

function launchHearts() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createHeart(), i * 150);
  }
}

// ------- FLOW – no leading empty lines -------
function start() {
  typeText(
`<span class="prompt">$</span> <span class="command">systemctl status confession</span>
<span class="success">  ● loaded → developer_mode: on</span>
<span class="comment">  └─ init complete. hearts ready.</span>

<span class="prompt">$</span> ./confession.sh
<span class="comment"># Initializing...</span>

<span class="prompt">$</span> whoami
<span class="command">A fellow developer you met recently</span>

<span class="prompt">$</span> status --verbose
<span class="command">Overthinking: true
Nervous: definitely
Worth_the_risk: absolutely</span>

<span class="comment"># Here goes nothing...</span>
`,
    () => { addButton("run", init); }
  );
}

function init() {
  clearButtons();
  typeText(
`<span class="prompt">$</span> <span class="command">git init</span> new-connection
<span class="success">Initialized empty Git repository ♡</span>

<span class="prompt">$</span> cat honest-thoughts.md

Look, I'll be real with you.

We just met recently.
But some things you just... notice.

The way you talk about code.
Your energy when you explain things.
How natural conversations feel with you.

<span class="emphasis">That's not something I encounter often.</span>

<span class="prompt">$</span> <span class="command">git add</span> honest-thoughts.md
<span class="prompt">$</span> <span class="command">git commit -m</span> "being honest"
<span class="success">[main a1b2c3d] being honest</span>
`,
    () => { addButton("continue", devThoughts); }
  );
}

function devThoughts() {
  clearButtons();
  typeText(
`<div class="divider"></div>

<span class="prompt">$</span> cat why-this-matters.md

As developers, we spend a lot of time:
  <span class="command">→</span> Debugging code
  <span class="command">→</span> Optimizing performance  
  <span class="command">→</span> Solving problems

But finding someone who gets it?
Someone you can talk to about tech AND everything else?
Someone who makes you want to put down your IDE and just hang out?

<span class="emphasis">That's rare. You're that person.</span>

<span class="prompt">$</span> <span class="command">git add</span> why-this-matters.md
<span class="prompt">$</span> <span class="command">git commit -m</span> "shooting my shot"
<span class="success">[main e4f5a2b] shooting my shot</span>
`,
    () => { addButton("what are you getting at?", theIdea); }
  );
}

function theIdea() {
  clearButtons();
  typeText(
`<div class="divider"></div>

<span class="prompt">$</span> ./propose-idea.sh

Here's what I'm thinking:

  ♡ Coffee or chai (or debugging over food)
  ♡ Real conversation about code, life, everything
  ♡ See if this connection is as good as I think it is
  ♡ No pressure, just vibes

<span class="emphasis">Simple. Casual. Two devs hanging out.</span>

But like... as a date.

<span class="prompt">$</span> echo "thoughts?"
`,
    () => { addButton("go on...", finalQuestion); }
  );
}

function finalQuestion() {
  clearButtons();
  typeText(
`<div class="divider"></div>

<span class="emphasis" style="font-size: 19px;">
Want to grab coffee sometime?
</span>

Not as dev colleagues.
Not just as friends.
As a date.

I think we could have a really good time.
Let's see where this goes.

<span class="comment"># No promises, no pressure
# Just two people seeing if there's something here</span>

<span class="prompt">$</span> read response
`,
    () => { showYesNoButtons(); }
  );
}

function showYesNoButtons() {
  clearButtons();
  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Yeah, let's do it";
  yesBtn.className = "yes-btn";
  yesBtn.style.transform = `scale(${yesButtonSize})`;
  yesBtn.onclick = () => success();

  const noBtn = document.createElement("button");
  noBtn.textContent = "Not really";
  noBtn.className = "no-btn";
  noBtn.onclick = handleNo;

  buttons.appendChild(yesBtn);
  buttons.appendChild(noBtn);
}

function handleNo() {
  noClickCount++;
  clearButtons();

  const responses = [
    {
      text: `<span class="warning">$ exception: UnexpectedResponseError</span>

<span class="prompt">$</span> ./handle-rejection.sh --retry

Hold on, let me debug this.

It's just coffee. Low stakes.
Worst case: you get caffeine and good conversation.
Best case: we have an amazing time.

<span class="emphasis">Worth a try, right?</span>

<span class="prompt">$</span> retry? (y/n)
`,
      yesText: "Okay fine (y)",
      noText: "Still n"
    },
    {
      text: `<span class="warning">$ git revert HEAD~1</span>
<span class="comment"># Attempting to undo that "no"...</span>

<span class="prompt">$</span> cat reasons.json

{
  "we_already_vibe": true,
  "low_commitment": true,
  "could_be_fun": true,
  "you're_still_reading": true,
  "what_do_you_have_to_lose": "nothing"
}

<span class="emphasis">The data suggests you should say yes.</span>

<span class="prompt">$</span> recompute_answer()
`,
      yesText: "Alright, yes",
      noText: "Nope"
    },
    {
      text: `<span class="warning">$ npm install second-chance</span>

<span class="prompt">$</span> node final-attempt.js

Look, I respect your decision.
But I had to shoot my shot.

You're cool. You get the dev life.
And I'd kick myself for not asking.

<span class="emphasis">One coffee. One chance.
That's all I'm asking for.</span>

<span class="prompt">$</span> final_answer = ?
`,
      yesText: "YES, okay!",
      noText: "No"
    }
  ];

  if (noClickCount <= responses.length) {
    const response = responses[noClickCount - 1];
    typeText(response.text, () => {
      yesButtonSize += 0.3;
      addButton(response.yesText, success, "yes-btn");
      const noBtn = document.createElement("button");
      noBtn.textContent = response.noText;
      noBtn.className = "no-btn";
      noBtn.onclick = handleNo;
      if (noClickCount >= 2) {
        noBtn.onmouseover = () => {
          const x = Math.random() * 200 - 100;
          const y = Math.random() * 100 - 50;
          noBtn.style.transform = `translate(${x}px, ${y}px)`;
        };
      }
      buttons.appendChild(noBtn);
      const yesBtn = buttons.querySelector('.yes-btn');
      if (yesBtn) {
        yesBtn.style.transform = `scale(${yesButtonSize})`;
        yesBtn.style.transition = 'all 0.3s ease';
      }
    });
  } else {
    typeText(
`<span class="success">$ exit 0</span>

<span class="prompt">$</span> cat final-message.txt

I can take a hint.
But I don't regret asking.

You're awesome, and I think we could've had fun.
But no pressure, no hard feelings.

<span class="emphasis">If you change your mind,
you know where to find me.</span>

<span class="prompt">$</span> <span class="command">git commit -m</span> "respect the decision"
<span class="success">[main c7d8e9f] respect the decision</span>

♡
`,
    () => { clearButtons(); addButton("Wait... actually yes", success, "yes-btn"); }
    );
  }
}

function success() {
  clearButtons();
  launchHearts();
  typeText(
`<div class="divider"></div>

<span class="success">$ echo "SUCCESS!"</span>
SUCCESS!

<span class="prompt">$</span> <span class="command">git commit -m</span> "she said yes!"
<span class="success">[main ♡] she said yes!</span>

<span class="prompt">$</span> <span class="command">git log --oneline</span>

<span style="color: #d47b96;">f8a9b1c</span> first date planned
<span style="color: #d47b96;">e7d8c2b</span> inside jokes starting
<span style="color: #d47b96;">d6c7b1a</span> comfortable silences
<span style="color: #d47b96;">c5b6a09</span> code reviews together
<span style="color: #d47b96;">b4a5908</span> late night debugging sessions
<span style="color: #d47b96;">a394807</span> this exact moment

<span class="emphasis">Awesome! This is happening.</span>

<span class="prompt">$</span> <span class="command">echo</span> "Now text or DM me so we can plan this!"

<span class="command">Looking forward to it ♡</span>

<span class="prompt">$</span> <span class="command">git push origin</span> our-story
<span class="success">✓ Deployed successfully</span>

<span class="prompt">$</span> exit

♡
`,
  null, 28);
  console.log('🎉 SHE SAID YES!', new Date().toLocaleString());
}
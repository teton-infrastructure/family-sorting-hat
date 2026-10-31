/* The Family Sorting Hat — an original fan-made family game. */
(() => {
  "use strict";

  const HOUSES = {
    G: { name: "Gryffindor", a: "#7f0909", b: "#e8b830", animal: "🦁", traits: "Brave · Bold · Daring",
         desc: "You run toward adventure with a big, brave heart. You stand up for others, you try new things even when they are scary, and your courage helps everyone feel braver too." },
    H: { name: "Hufflepuff", a: "#8f6c0c", b: "#ffe27a", animal: "🦡", traits: "Kind · Loyal · Hard-working",
         desc: "You are a true friend. You share, you help, you never give up, and you make everyone feel welcome. Your warm, loyal heart is a kind of magic all its own." },
    R: { name: "Ravenclaw", a: "#13265c", b: "#d4ae6a", animal: "🦅", traits: "Clever · Curious · Creative",
         desc: "Your mind is full of wonder. You love questions, puzzles, books and big ideas, and you see the world in your own clever way. Keep wondering. It is your superpower!" },
    S: { name: "Slytherin", a: "#1a5232", b: "#d0d6d8", animal: "🐍", traits: "Ambitious · Clever · Determined",
         desc: "You dream big and you make a plan to get there. You are resourceful, determined and a natural leader, and you look out for the people who are on your team." }
  };
  const ORDER = ["G", "H", "R", "S"];

  // All-original questions. w = points per house.
  const FIRST = { id: "door", q: "You find a little door in a big tree. What do you do?", a: [
    { e: "🚪", t: "Open it and go in!", w: { G: 3 } },
    { e: "🔎", t: "Look for clues first", w: { R: 3 } },
    { e: "👫", t: "Get a friend to come too", w: { H: 3 } },
    { e: "🗝️", t: "Look for hidden treasure", w: { S: 3 } } ] };

  const LAST = { id: "say", q: "What do you want people to say about you?", a: [
    { e: "🦸", t: "“You are so brave!”", w: { G: 3 } },
    { e: "💡", t: "“You are so smart!”", w: { R: 3 } },
    { e: "💛", t: "“You are so kind!”", w: { H: 3 } },
    { e: "👑", t: "“You are a great leader!”", w: { S: 3 } } ] };

  const POOL = [
    { id: "pet", q: "Pick a magic pet.", a: [
      { e: "🐉", t: "A tiny dragon", w: { G: 3 } },
      { e: "🦉", t: "A wise owl", w: { R: 3 } },
      { e: "🐶", t: "A cuddly puppy", w: { H: 3 } },
      { e: "🐍", t: "A clever snake", w: { S: 3 } } ] },
    { id: "treat", q: "Which treat would you pick?", a: [
      { e: "🌶️", t: "Spicy fire candy", w: { G: 3 } },
      { e: "🧁", t: "A cupcake that changes color", w: { R: 2, G: 1 } },
      { e: "🍪", t: "Cookies to share", w: { H: 3 } },
      { e: "🍫", t: "The biggest chocolate bar", w: { S: 3 } } ] },
    { id: "sad", q: "Your friend is sad. What do you do?", a: [
      { e: "😂", t: "Make them laugh", w: { G: 2, H: 1 } },
      { e: "🧩", t: "Help fix the problem", w: { R: 3 } },
      { e: "🤗", t: "Give a big hug", w: { H: 3 } },
      { e: "📋", t: "Make a plan to cheer them up", w: { S: 2, R: 1 } } ] },
    { id: "power", q: "Pick a magic power.", a: [
      { e: "💪", t: "Super strong", w: { G: 3 } },
      { e: "🧠", t: "Know every answer", w: { R: 3 } },
      { e: "🌱", t: "Make plants grow", w: { H: 3 } },
      { e: "👻", t: "Turn invisible", w: { S: 3 } } ] },
    { id: "game", q: "Which game is the most fun?", a: [
      { e: "🏃", t: "A fast race", w: { G: 2, S: 1 } },
      { e: "🧩", t: "A tricky puzzle", w: { R: 3 } },
      { e: "⚽", t: "A team game", w: { H: 3 } },
      { e: "🙈", t: "Hide and seek", w: { S: 3 } } ] },
    { id: "storm", q: "A big storm is coming! What do you do?", a: [
      { e: "⚡", t: "Watch the lightning", w: { G: 3 } },
      { e: "🔭", t: "Learn how storms work", w: { R: 3 } },
      { e: "🛋️", t: "Build a cozy fort for everyone", w: { H: 3 } },
      { e: "🔦", t: "Grab the best supplies first", w: { S: 3 } } ] },
    { id: "home", q: "Where would you like to live?", a: [
      { e: "⛰️", t: "On top of a mountain", w: { G: 3 } },
      { e: "📚", t: "In a tower full of books", w: { R: 3 } },
      { e: "🌳", t: "In a cozy home under a hill", w: { H: 3 } },
      { e: "🌊", t: "In a secret palace under a lake", w: { S: 3 } } ] },
    { id: "coins", q: "You find a bag of gold coins! What do you do?", a: [
      { e: "🗺️", t: "Buy a map and go exploring", w: { G: 3 } },
      { e: "📖", t: "Buy a book of spells", w: { R: 3 } },
      { e: "🎁", t: "Share it with everyone", w: { H: 3 } },
      { e: "🏦", t: "Save it to grow more", w: { S: 3 } } ] },
    { id: "wand", q: "Which magic wand would you pick?", a: [
      { e: "🎆", t: "One that shoots sparks", w: { G: 3 } },
      { e: "✍️", t: "One that writes in the air", w: { R: 3 } },
      { e: "🌸", t: "One that grows flowers", w: { H: 3 } },
      { e: "🌙", t: "One that glows in secret", w: { S: 2, R: 1 } } ] },
    { id: "rain", q: "It's a rainy day. What do you do?", a: [
      { e: "🥾", t: "Jump in puddles", w: { G: 3 } },
      { e: "🎨", t: "Invent something new", w: { R: 3 } },
      { e: "🍲", t: "Cook with your family", w: { H: 3 } },
      { e: "🏰", t: "Build the tallest tower ever", w: { S: 3 } } ] }
  ];
  const QUIZ_LEN = 9; // first + 7 from pool + last

  // Tie-break: the person chooses between the tied houses (the hat lets you have a say!)
  const TIE = { q: "Hmm, it's a tie! The Hat lets YOU choose. What matters most to you?", a: {
    G: { e: "🦁", t: "Being brave" }, R: { e: "🦅", t: "Being wise" },
    H: { e: "🦡", t: "Being kind" }, S: { e: "🐍", t: "Dreaming big" } } };

  const STORE_KEY = "familySortingHat.v1";
  const $ = (id) => document.getElementById(id);
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const state = { name: "", questions: [], i: 0, scores: null, sound: false, voice: false, busy: false };

  /* ---------- screens ---------- */
  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === "screen-" + id));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ---------- sound (only after user turns it on) ---------- */
  let ctx = null;
  function tone(freq, start, dur, type = "sine", vol = 0.12) {
    if (!state.sound || !ctx) return;
    const t0 = ctx.currentTime + start, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  const sfx = {
    tap: () => tone(880, 0, 0.18, "triangle", 0.08),
    sparkle: () => [1320, 1568, 1760, 2093].forEach((f, i) => tone(f, i * 0.07, 0.4, "sine", 0.06)),
    hmm: () => { tone(110, 0, 1.2, "sawtooth", 0.03); tone(165, 0.1, 1.1, "sine", 0.05); },
    fanfare: () => [[523, 0], [659, 0.15], [784, 0.3], [1047, 0.5]].forEach(([f, t]) => { tone(f, t, 0.9, "triangle", 0.1); tone(f / 2, t, 0.9, "sine", 0.06); })
  };

  /* ---------- read aloud (only when the user asks) ---------- */
  function speak(text, force) {
    if (!(state.voice || force) || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.rate = 0.9; u.pitch = 0.85;
    speechSynthesis.speak(u);
  }
  const stopSpeak = () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); };

  /* ---------- quiz ---------- */
  function startQuiz(name) {
    state.name = name.trim().slice(0, 24);
    state.questions = [FIRST, ...shuffle(POOL).slice(0, QUIZ_LEN - 2), LAST];
    state.i = 0; state.scores = { G: 0, H: 0, R: 0, S: 0 };
    sfx.sparkle(); show("quiz"); renderQuestion();
  }

  function renderQuestion() {
    const q = state.questions[state.i], total = state.questions.length;
    $("qcount").textContent = `Question ${state.i + 1} of ${total}`;
    $("progress-bar").style.width = `${(state.i / total) * 100}%`;
    $("question-text").textContent = q.q;
    const box = $("answers"); box.innerHTML = ""; box.classList.remove("tie");
    const answers = shuffle(q.a);
    answers.forEach((a) => box.appendChild(answerBtn(a.e, a.t, () => choose(a.w))));
    state.busy = false;
    speak(readText(q.q, answers));
  }
  const readText = (q, answers) => q + " " + answers.map((a) => a.t.replace(/[“”]/g, "")).join(". Or, ") + ".";

  function answerBtn(emoji, text, onPick) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "answer";
    b.innerHTML = `<span class="emoji" aria-hidden="true">${emoji}</span><span>${esc(text)}</span>`;
    b.addEventListener("click", () => {
      if (state.busy) return; state.busy = true;
      b.classList.add("picked"); sfx.tap(); stopSpeak();
      setTimeout(onPick, 260);
    });
    return b;
  }

  function choose(weights) {
    for (const k in weights) state.scores[k] += weights[k];
    state.i++;
    if (state.i < state.questions.length) return renderQuestion();
    $("progress-bar").style.width = "100%";
    const max = Math.max(...ORDER.map((k) => state.scores[k]));
    const tied = ORDER.filter((k) => state.scores[k] === max);
    if (tied.length === 1) return think(tied[0]);
    tieBreak(tied);
  }

  function tieBreak(tied) {
    $("qcount").textContent = "One more question!";
    $("question-text").textContent = TIE.q;
    const box = $("answers"); box.innerHTML = ""; box.classList.add("tie");
    const opts = shuffle(tied);
    opts.forEach((k) => box.appendChild(answerBtn(TIE.a[k].e, TIE.a[k].t, () => think(k))));
    state.busy = false;
    speak(TIE.q + " " + opts.map((k) => TIE.a[k].t).join(". Or, ") + ".");
  }

  /* ---------- dramatic reveal ---------- */
  function think(house) {
    show("thinking");
    const ranked = ORDER.slice().sort((x, y) => state.scores[y] - state.scores[x]);
    const second = ranked.find((k) => k !== house);
    const word = (k) => HOUSES[k].traits.split(" · ")[0].toLowerCase();
    const lines = [
      "Hmm…",
      "Difficult. Very difficult…",
      `I see lots of ${word(house)}… and a good bit of ${word(second)} too…`,
      `Yes… I know just where you belong, ${state.name}!`
    ];
    sfx.hmm();
    const speech = $("hat-speech");
    lines.forEach((line, i) => setTimeout(() => {
      speech.textContent = line; speech.style.animation = "none"; void speech.offsetWidth; speech.style.animation = "";
      speak(line);
    }, i * 1700));
    setTimeout(() => reveal(house), lines.length * 1700 + 300);
  }

  function crestSVG(k, small) {
    const h = HOUSES[k], id = "c" + k + (small ? "s" : "") + Math.random().toString(36).slice(2, 6);
    return `<svg viewBox="0 0 200 240" role="img" aria-label="${h.name} crest">
      <defs>
        <clipPath id="${id}"><path d="M20 20 H180 V110 C180 170 140 205 100 225 C60 205 20 170 20 110 Z"/></clipPath>
        <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
      </defs>
      <g clip-path="url(#${id})">
        <rect x="0" y="0" width="200" height="240" fill="${h.a}"/>
        <path d="M0 0 L200 240 L200 0 Z" fill="${h.b}" opacity=".9"/>
        <path d="M0 0 L200 240 L200 0 Z" fill="${h.a}" opacity=".25"/>
        ${[0, 1, 2, 3, 4, 5].map((n) => `<circle cx="${30 + n * 28}" cy="${n % 2 ? 40 : 200}" r="3" fill="#fff" opacity=".35"/>`).join("")}
        <rect x="0" y="0" width="200" height="240" fill="url(#${id}g)"/>
      </g>
      <path d="M20 20 H180 V110 C180 170 140 205 100 225 C60 205 20 170 20 110 Z" fill="none" stroke="${h.b}" stroke-width="8"/>
      <path d="M20 20 H180 V110 C180 170 140 205 100 225 C60 205 20 170 20 110 Z" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="100" cy="112" r="48" fill="#fff8e6" stroke="${h.b}" stroke-width="6"/>
      <text x="100" y="132" text-anchor="middle" font-size="56">${h.animal}</text>
      ${small ? "" : `<path d="M8 22 L40 12 L160 12 L192 22 L160 32 L40 32 Z" fill="${h.b}" stroke="#000" stroke-opacity=".3"/>
      <text x="100" y="27" text-anchor="middle" font-family="Cinzel Decorative, Georgia, serif" font-size="14" font-weight="700" fill="${h.a}">${h.name.toUpperCase()}</text>`}
    </svg>`;
  }

  function reveal(k) {
    const h = HOUSES[k];
    const card = $("result-card");
    card.style.setProperty("--house-a", h.a); card.style.setProperty("--house-b", h.b);
    $("crest").innerHTML = crestSVG(k);
    $("result-pre").textContent = `${state.name}, you belong in…`;
    $("house-name").textContent = h.name + "!";
    $("house-traits").textContent = h.traits;
    $("house-desc").textContent = h.desc;
    saveMember(state.name, k);
    show("result");
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    sfx.fanfare(); confetti(h); speak(`${h.name}! ${h.desc}`);
  }

  function confetti(h) {
    const box = $("confetti"); box.innerHTML = "";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = [h.a, h.b, "#fff3c4"][i % 3];
      p.style.animationDuration = 2.2 + Math.random() * 2.5 + "s";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      box.appendChild(p);
    }
    setTimeout(() => (box.innerHTML = ""), 6000);
  }

  /* ---------- family board (localStorage) ---------- */
  function loadBoard() { try { const d = JSON.parse(localStorage.getItem(STORE_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }
  function saveBoard(list) { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {} }
  function saveMember(name, house) {
    // Same name sorted again? Update their house instead of adding a duplicate.
    const list = loadBoard().filter((m) => m.name.toLowerCase() !== name.toLowerCase());
    list.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, house, at: new Date().toISOString() });
    saveBoard(list);
  }
  function renderBoard() {
    const list = loadBoard(), wrap = $("board-houses");
    $("board-empty").style.display = list.length ? "none" : "block";
    $("reset-btn").style.display = list.length ? "block" : "none";
    wrap.innerHTML = ORDER.map((k) => {
      const h = HOUSES[k], members = list.filter((m) => m.house === k);
      return `<div class="board-house" data-house="${k}" style="--a:${h.a};--b:${h.b}">
        <h3><span class="mini-crest">${crestSVG(k, true)}</span>${h.name} <small>(${members.length})</small></h3>
        <ul>${members.length ? members.map((m) => `<li><span class="member-name">${esc(m.name)}</span>
          <button type="button" class="remove" data-id="${esc(m.id)}" aria-label="Remove ${esc(m.name)}">✕ Remove</button></li>`).join("")
          : `<li class="none">No one yet</li>`}</ul></div>`;
    }).join("");
  }

  /* ---------- wiring ---------- */
  $("name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("name-input").value.trim();
    if (!name) { $("name-input").focus(); return; }
    startQuiz(name);
  });
  $("sound-toggle").addEventListener("click", (e) => {
    state.sound = !state.sound;
    if (state.sound && !ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
    if (ctx && ctx.state === "suspended") ctx.resume();
    e.currentTarget.setAttribute("aria-pressed", state.sound);
    e.currentTarget.textContent = state.sound ? "🔔 Sound on" : "🔇 Sound off";
    sfx.sparkle();
  });
  $("voice-toggle").addEventListener("click", (e) => {
    state.voice = !state.voice;
    e.currentTarget.setAttribute("aria-pressed", state.voice);
    e.currentTarget.textContent = state.voice ? "🗣️ Read aloud: on" : "🗣️ Read aloud: off";
    if (!state.voice) stopSpeak(); else speak("I will read the questions out loud.");
  });
  if (!("speechSynthesis" in window)) { $("voice-toggle").hidden = true; $("speak-q").hidden = true; }
  $("speak-q").addEventListener("click", () => {
    const btns = [...document.querySelectorAll("#answers .answer span:last-child")].map((s) => ({ t: s.textContent }));
    speak(readText($("question-text").textContent, btns), true);
  });
  const sortAnother = () => { stopSpeak(); $("name-input").value = ""; show("welcome"); setTimeout(() => $("name-input").focus(), 50); };
  $("again-btn").addEventListener("click", sortAnother);
  $("board-sort-btn").addEventListener("click", sortAnother);
  const openBoard = () => { stopSpeak(); renderBoard(); show("board"); };
  $("to-board").addEventListener("click", openBoard);
  $("result-board-btn").addEventListener("click", openBoard);
  $("board-houses").addEventListener("click", (e) => {
    const btn = e.target.closest(".remove"); if (!btn) return;
    const m = loadBoard().find((x) => x.id === btn.dataset.id);
    if (m && confirm(`Remove ${m.name} from the Family Board?`)) { saveBoard(loadBoard().filter((x) => x.id !== m.id)); renderBoard(); }
  });
  $("reset-btn").addEventListener("click", () => {
    if (confirm("Clear the whole Family Board? This can't be undone.")) { saveBoard([]); renderBoard(); }
  });

  // exposed for automated tests only
  window.__sortingHat = { HOUSES, POOL, FIRST, LAST, QUIZ_LEN };
})();

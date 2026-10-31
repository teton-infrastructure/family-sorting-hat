/* The Family Sorting Ceremony — an original fan-made family game. */
(() => {
  "use strict";

  const HOUSES = {
    G: { name: "Gryffindor", a: "#7f0909", b: "#e8b830", bar: "#d0452f", animal: "🦁", motto: "Bold hearts go first.",
         traits: ["Courage", "Nerve", "Daring", "Heart"], word: "courage",
         desc: "You run toward adventure with a big, brave heart. You stand up for others, you try new things even when they are scary, and your courage helps everyone feel braver too." },
    H: { name: "Hufflepuff", a: "#8f6c0c", b: "#ffe27a", bar: "#e0ae22", animal: "🦡", motto: "Kind hearts, steady hands.",
         traits: ["Loyalty", "Patience", "Fairness", "Hard work"], word: "kindness",
         desc: "You are a true friend. You share, you help, you never give up, and you make everyone feel welcome. Your warm, loyal heart is a kind of magic all its own." },
    R: { name: "Ravenclaw", a: "#13265c", b: "#d4ae6a", bar: "#4a76d0", animal: "🦅", motto: "Curious minds light the way.",
         traits: ["Curiosity", "Wit", "Creativity", "Wisdom"], word: "a clever mind",
         desc: "Your mind is full of wonder. You love questions, puzzles, books and big ideas, and you see the world in your own clever way. Keep wondering. It is your superpower!" },
    S: { name: "Slytherin", a: "#1a5232", b: "#d0d6d8", bar: "#2f9a62", animal: "🐍", motto: "Ambition, cunning, and a plan.",
         traits: ["Ambition", "Resourcefulness", "Determination", "Leadership"], word: "ambition",
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
  // Grown-up questions (from Taylor's version), one point-set per answer.
  const GQ = (q, arr) => ({ q, a: arr.map(([t, h]) => ({ t, w: { [h]: 3 } })) });
  const GROWN_POOL = [
    GQ("A trunk in the attic is locked. What do you do?", [["Kick it open. Whatever is inside, I can handle it.", "G"], ["Look for clues about who owned it before touching anything.", "R"], ["Ask the family whose it is first. It might be special to someone.", "H"], ["Quietly figure out the combination and keep what I find to myself for now.", "S"]]),
    GQ("Pick a path through the dark forest.", [["The narrow one where something is howling.", "G"], ["The one with the strange glowing mushrooms.", "R"], ["The well-worn one, so nobody gets lost.", "H"], ["The one nobody else noticed.", "S"]]),
    GQ("Your team is losing at half-time. You…", [["Give a rousing speech and charge back out.", "G"], ["Study what the other team is doing and change the plan.", "R"], ["Make sure the kid who messed up knows it's okay.", "H"], ["Find their weak spot and exploit it.", "S"]]),
    GQ("Which would you most like to be remembered for?", [["Standing up when it counted.", "G"], ["Discovering something new.", "R"], ["Being someone people could always count on.", "H"], ["Building something that lasts.", "S"]]),
    GQ("Choose a potion.", [["One that makes you fearless for an hour.", "G"], ["One that lets you understand any language.", "R"], ["One that heals any friend.", "H"], ["One that tells you what others are really thinking.", "S"]]),
    GQ("A friend gets a better grade than you on a test you studied hard for.", [["Challenge them to a rematch.", "G"], ["Ask how they studied. Maybe their method is better.", "R"], ["Congratulate them. Truly.", "H"], ["Make a note. Next time is mine.", "S"]]),
    GQ("Which sound do you like best?", [["A crackling bonfire.", "G"], ["Pages turning in a quiet library.", "R"], ["A busy kitchen full of family.", "H"], ["Rain on a window while you plan.", "S"]]),
    GQ("You find a wallet full of money on the street.", [["Chase down the person who just dropped it.", "G"], ["Check the ID and work out how to return it.", "R"], ["Turn it in, every penny.", "H"], ["Return it, and make sure they know who did.", "S"]]),
    GQ("Pick a magical pet.", [["Something big that might bite.", "G"], ["A clever bird that can talk back.", "R"], ["A loyal, fluffy companion.", "H"], ["Something sleek that others underestimate.", "S"]]),
    GQ("Your idea of a perfect Saturday?", [["Something I've never tried before. Cliff jumping, maybe.", "G"], ["Building, tinkering, or a rabbit hole of reading.", "R"], ["Pancakes, family, and a long walk.", "H"], ["Getting ahead on a project nobody knows about yet.", "S"]]),
    GQ("In a group project you are usually the one who…", [["Volunteers to present.", "G"], ["Comes up with the clever idea.", "R"], ["Keeps everyone working together.", "H"], ["Quietly runs the whole thing.", "S"]])
  ];
  const GROWN_LAST = GQ("The Hat leans in and asks what you want most.", [["To be brave when it matters.", "G"], ["To understand how everything works.", "R"], ["To be a good friend.", "H"], ["To be great.", "S"]]);
  const QUIZ_LEN = 9;

  const TIE = { q: "It's a tie! The Hat leans in and lets YOU choose. What matters most to you?", a: {
    G: { e: "🦁", t: "Being brave" }, R: { e: "🦅", t: "Being wise" },
    H: { e: "🦡", t: "Being kind" }, S: { e: "🐍", t: "Dreaming big" } } };

  const STORE_KEY = "familySortingHat.v1";
  const $ = (id) => document.getElementById(id);
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const state = { name: "", mode: "kids", questions: [], i: 0, scores: null, house: null, sound: false, voice: false, busy: false };

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === "screen-" + id));
    window.scrollTo(0, 0);
    if (id === "welcome") renderTonight();
  }
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }

  /* ---------- sound (only after the user turns it on) ---------- */
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

  /* ---------- read aloud (only when asked) ---------- */
  function speak(text, force) {
    if (!(state.voice || force) || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.rate = 0.9; u.pitch = 0.85;
    speechSynthesis.speak(u);
  }
  const stopSpeak = () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); };
  const readText = (q, answers) => q + " " + answers.map((a) => a.t.replace(/[“”]/g, "")).join(". Or, ") + ".";

  /* ---------- quiz ---------- */
  function startQuiz(name) {
    state.name = name.trim().slice(0, 24);
    const pool = state.mode === "grown" ? GROWN_POOL : POOL;
    state.questions = state.mode === "grown"
      ? [...shuffle(pool).slice(0, QUIZ_LEN - 1), GROWN_LAST]
      : [FIRST, ...shuffle(pool).slice(0, QUIZ_LEN - 2), LAST];
    state.i = 0; state.scores = { G: 0, H: 0, R: 0, S: 0 };
    sfx.sparkle(); show("quiz"); renderQuestion();
  }
  function renderProgress(el, n, i) { el.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join(""); }

  function renderQuestion() {
    const q = state.questions[state.i], total = state.questions.length;
    $("qcount").textContent = `Question ${state.i + 1} of ${total}`;
    renderProgress($("progress"), total, state.i);
    $("question-text").textContent = q.q;
    const box = $("answers"); box.innerHTML = "";
    box.className = "answers" + (state.mode === "grown" ? " text-answers" : "");
    const answers = shuffle(q.a);
    answers.forEach((a) => box.appendChild(answerBtn(a.e, a.t, () => choose(a.w))));
    state.busy = false;
    speak(readText(q.q, answers));
  }

  function answerBtn(emoji, text, onPick, extra) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "answer";
    b.innerHTML = `${emoji ? `<span class="emoji" aria-hidden="true">${emoji}</span>` : ""}<span class="lbl">${esc(text)}</span>${extra || ""}`;
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
    const max = Math.max(...ORDER.map((k) => state.scores[k]));
    const tied = ORDER.filter((k) => state.scores[k] === max);
    if (tied.length === 1) return think(tied[0]);
    tieBreak(tied);
  }

  function tieBreak(tied) {
    $("qcount").textContent = "One more question!";
    $("question-text").textContent = TIE.q;
    const box = $("answers"); box.innerHTML = ""; box.className = "answers tie";
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
    const lines = [
      "Hmm…",
      "Difficult. Very difficult…",
      `Plenty of ${HOUSES[house].word}, I see… and ${HOUSES[second].word} too…`,
      `Yes… I know just where to put you, ${state.name}!`
    ];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, step = reduce ? 600 : 1700;
    sfx.hmm();
    const speech = $("hat-speech");
    lines.forEach((line, i) => setTimeout(() => {
      speech.textContent = line; speech.style.animation = "none"; void speech.offsetWidth; speech.style.animation = "";
      speak(line);
    }, i * step));
    setTimeout(() => reveal(house), lines.length * step + 300);
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
    state.house = k;
    const card = $("result-card");
    card.style.setProperty("--house-a", h.a); card.style.setProperty("--house-b", h.b);
    $("crest").innerHTML = crestSVG(k);
    $("result-pre").textContent = `${state.name}, the Hat has decided…`;
    $("house-name").textContent = h.name + "!";
    $("house-motto").textContent = h.motto;
    $("house-traits").innerHTML = h.traits.map((t) => `<span>${esc(t)}</span>`).join("");
    $("house-desc").textContent = h.desc;
    const total = ORDER.reduce((s, x) => s + state.scores[x], 0) || 1;
    $("bars").innerHTML = ORDER.map((x) => { const pct = Math.round((state.scores[x] / total) * 100);
      return `<div class="bar"><span aria-hidden="true">${HOUSES[x].animal}</span><span>${HOUSES[x].name}</span><div class="t"><div style="background:${HOUSES[x].bar}" data-w="${pct}"></div></div><span class="n">${pct}%</span></div>`; }).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll("#bars [data-w]").forEach((d) => (d.style.width = d.dataset.w + "%"))));
    $("result-wand-btn").textContent = `🪄 Design ${state.name}’s wand`;
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
  const findMember = (name) => loadBoard().find((m) => m.name.toLowerCase() === String(name).toLowerCase());
  function saveMember(name, house) {
    // Same name sorted again? Update their house (keep their wand) instead of adding a duplicate.
    const list = loadBoard(), m = list.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (m) { m.house = house; m.at = new Date().toISOString(); }
    else list.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, house, at: new Date().toISOString() });
    saveBoard(list);
  }
  function saveWand(name, cfg) {
    const list = loadBoard(), m = list.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (m) m.wand = cfg;
    else list.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, house: null, wand: cfg, at: new Date().toISOString() });
    saveBoard(list);
  }
  function renderBoard() {
    const list = loadBoard(), wrap = $("board-houses");
    $("board-empty").style.display = list.length ? "none" : "block";
    $("reset-btn").style.display = list.length ? "block" : "none";
    const groups = [...ORDER, null].map((k) => ({ k, members: list.filter((m) => (m.house || null) === k) }))
      .filter((g) => g.k || g.members.length);
    wrap.innerHTML = groups.map(({ k, members }) => {
      const h = k ? HOUSES[k] : { name: "Not sorted yet", a: "#3a3f55", b: "#e8c47a" };
      return `<div class="board-house" data-house="${k || "none"}" style="--a:${h.a};--b:${h.b}">
        <h3>${k ? `<span class="mini-crest">${crestSVG(k, true)}</span>` : "🎩 "}${h.name} <small>(${members.length})</small></h3>
        <ul>${members.length ? members.map((m) => `<li>
          <div class="who"><span class="member-name">${esc(m.name)}</span>
            ${m.wand ? `<span class="wand-thumb" title="${esc(Wand.describe(m.wand, m.name, m.house).spec)}">${Wand.render(m.wand, m.house, "b" + m.id, { width: 220, height: 57 })}</span>` : ""}</div>
          <div class="acts">
            <button type="button" class="mk" data-wand="${esc(m.name)}" aria-label="${m.wand ? "Change" : "Design"} ${esc(m.name)}'s wand">🪄 ${m.wand ? "Wand" : "Add wand"}</button>
            <button type="button" class="remove" data-id="${esc(m.id)}" aria-label="Remove ${esc(m.name)}">✕</button>
          </div></li>`).join("")
          : `<li class="none">No one yet</li>`}</ul></div>`;
    }).join("");
  }
  function renderTonight() {
    const list = loadBoard();
    $("tonight-empty").hidden = list.length > 0;
    $("tonight-list").innerHTML = list.map((m) => { const h = m.house ? HOUSES[m.house] : null;
      return `<span class="pill" style="--c:${h ? h.bar : "#8a8fa8"}">${h ? h.animal : "🎩"} ${esc(m.name)}${m.wand ? " 🪄" : ""}</span>`; }).join("");
  }
  function renderHousePreview() {
    $("house-preview").innerHTML = ORDER.map((k) => { const h = HOUSES[k];
      return `<li style="--c:${h.bar}"><span class="an" aria-hidden="true">${h.animal}</span><div><b>${h.name}</b><span class="t">${h.traits.slice(0, 2).join(" · ")}</span></div></li>`; }).join("");
  }

  /* ---------- wand shop ---------- */
  const W = { name: "", house: null, cfg: null, step: 0, suggested: null };
  function openWandShop(name) {
    stopSpeak(); show("wand");
    if (name) return startWand(name);
    $("wand-title").textContent = "Design a Wand";
    $("wand-who").hidden = false; $("wand-build").hidden = true; $("wand-done").hidden = true;
    const list = loadBoard();
    $("wand-who-list").innerHTML = list.map((m) => `<button type="button" data-name="${esc(m.name)}" style="--c:${m.house ? HOUSES[m.house].bar : "#a57b3c"}">${m.house ? HOUSES[m.house].animal : "🎩"} ${esc(m.name)}</button>`).join("");
    $("wand-name").value = "";
  }
  function startWand(name) {
    const m = findMember(name);
    W.name = (m ? m.name : name).trim().slice(0, 24); W.house = m ? m.house : null;
    W.suggested = W.house ? Wand.suggest(W.house) : null;
    W.cfg = Object.assign(Wand.defaults(), m && m.wand ? m.wand : W.suggested || {});
    W.step = 0;
    $("wand-title").textContent = `${W.name}’s Wand`;
    $("wand-who").hidden = true; $("wand-done").hidden = true; $("wand-build").hidden = false;
    renderWandStep();
  }
  function drawPreview() { $("wand-stage").innerHTML = Wand.render(W.cfg, W.house, "live"); }
  function renderWandStep() {
    const st = Wand.STEPS[W.step], n = Wand.STEPS.length;
    drawPreview();
    renderProgress($("wand-progress"), n, W.step);
    $("wand-count").textContent = `Step ${W.step + 1} of ${n}`;
    $("wand-q").textContent = st.q;
    $("wand-back").disabled = W.step === 0;
    const box = $("wand-opts"); box.innerHTML = "";
    st.opts.forEach((o) => {
      const isHat = W.suggested && W.suggested[st.key] === o.id;
      const b = answerBtn(o.e, o.t, () => { W.cfg[st.key] = o.id; nextWandStep(); },
        `<span class="hint">${esc(o.hint)}</span>${isHat ? `<span class="badge">⭐ Hat’s pick</span>` : ""}`);
      if (isHat) b.classList.add("suggested");
      if (W.cfg[st.key] === o.id) b.setAttribute("aria-current", "true");
      b.dataset.opt = o.id;
      // live preview while hovering/pressing
      b.addEventListener("pointerenter", () => { const old = W.cfg[st.key]; W.cfg[st.key] = o.id; drawPreview(); W.cfg[st.key] = old; });
      box.appendChild(b);
    });
    box.onpointerleave = drawPreview;
    state.busy = false;
    speak(st.q + " " + st.opts.map((o) => o.t).join(". Or, ") + ".");
  }
  function nextWandStep() {
    drawPreview();
    if (W.step < Wand.STEPS.length - 1) { W.step++; renderWandStep(); } else finishWand();
  }
  function finishWand() {
    $("wand-build").hidden = true; $("wand-done").hidden = false;
    $("wand-chosen").textContent = "✨ The wand has chosen you! ✨";
    $("wand-final").innerHTML = Wand.render(W.cfg, W.house, "final");
    const d = Wand.describe(W.cfg, W.name, W.house);
    $("wand-tag").innerHTML = `<h4>${esc(d.title)}</h4><p class="spec">${esc(d.spec)}</p><p>${esc(d.look)}</p><p><em>${esc(d.flavor)}</em></p><p class="sig">— The Family Wand Shop</p>`;
    $("wand-save").disabled = false; $("wand-save").textContent = "💾 Save to Family Board";
    window.scrollTo(0, 0); sfx.fanfare();
    speak(`The wand has chosen you! ${d.spec} ${d.look}`);
  }

  /* ---------- wiring ---------- */
  document.querySelectorAll(".mode-btn").forEach((b) => b.addEventListener("click", () => {
    state.mode = b.dataset.mode;
    document.querySelectorAll(".mode-btn").forEach((x) => x.setAttribute("aria-pressed", x === b));
    sfx.tap();
  }));
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
  if (!("speechSynthesis" in window)) ["voice-toggle", "speak-q", "wand-speak"].forEach((id) => ($(id).hidden = true));
  const readButtons = (boxId) => [...document.querySelectorAll(`#${boxId} .answer .lbl`)].map((s) => ({ t: s.textContent }));
  $("speak-q").addEventListener("click", () => speak(readText($("question-text").textContent, readButtons("answers")), true));
  $("wand-speak").addEventListener("click", () => speak(readText($("wand-q").textContent, readButtons("wand-opts")), true));

  const sortAnother = () => { stopSpeak(); $("name-input").value = ""; show("welcome"); setTimeout(() => $("name-input").focus(), 50); };
  $("again-btn").addEventListener("click", sortAnother);
  $("board-sort-btn").addEventListener("click", sortAnother);
  $("retake-btn").addEventListener("click", () => { stopSpeak(); startQuiz(state.name); });
  const openBoard = () => { stopSpeak(); renderBoard(); show("board"); };
  $("to-board").addEventListener("click", openBoard);
  $("result-board-btn").addEventListener("click", openBoard);
  $("wand-board").addEventListener("click", openBoard);
  $("board-home-btn").addEventListener("click", () => show("welcome"));
  $("wand-home").addEventListener("click", () => { stopSpeak(); show("welcome"); });
  $("home-wand-btn").addEventListener("click", () => openWandShop());
  $("board-wand-btn").addEventListener("click", () => openWandShop());
  $("result-wand-btn").addEventListener("click", () => openWandShop(state.name));
  $("wand-who-list").addEventListener("click", (e) => { const b = e.target.closest("button[data-name]"); if (b) startWand(b.dataset.name); });
  $("wand-who-form").addEventListener("submit", (e) => { e.preventDefault(); const n = $("wand-name").value.trim(); if (n) startWand(n); else $("wand-name").focus(); });
  $("wand-back").addEventListener("click", () => { if (W.step > 0) { W.step--; renderWandStep(); } });
  $("wand-surprise").addEventListener("click", () => { W.cfg = Wand.random(); sfx.sparkle(); finishWand(); });
  $("wand-redo").addEventListener("click", () => { W.step = 0; $("wand-done").hidden = true; $("wand-build").hidden = false; renderWandStep(); });
  $("wand-save").addEventListener("click", (e) => {
    saveWand(W.name, Object.assign({}, W.cfg));
    e.currentTarget.textContent = "✅ Saved to the Family Board"; sfx.sparkle(); toast(`${W.name}’s wand is on the Family Board!`);
  });
  $("wand-download").addEventListener("click", async () => {
    try {
      const blob = await Wand.toPNG(W.cfg, W.name, W.house);
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `${W.name.replace(/[^\w-]+/g, "-") || "my"}-wand.png`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (err) { toast("Sorry, this device couldn't make the picture."); }
  });
  $("board-houses").addEventListener("click", (e) => {
    const wb = e.target.closest(".mk"); if (wb) return openWandShop(wb.dataset.wand);
    const btn = e.target.closest(".remove"); if (!btn) return;
    const m = loadBoard().find((x) => x.id === btn.dataset.id);
    if (m && confirm(`Remove ${m.name} from the Family Board?`)) { saveBoard(loadBoard().filter((x) => x.id !== m.id)); renderBoard(); }
  });
  $("reset-btn").addEventListener("click", () => {
    if (confirm("Clear the whole Family Board? This can't be undone.")) { saveBoard([]); renderBoard(); }
  });

  /* ---------- starry enchanted ceiling (from Taylor's version) ---------- */
  (function stars() {
    const c = $("stars"), x = c.getContext("2d"); let Wd, Ht, list = [];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function size() { const d = devicePixelRatio || 1; Wd = innerWidth; Ht = innerHeight; c.width = Wd * d; c.height = Ht * d; x.setTransform(d, 0, 0, d, 0, 0);
      list = Array.from({ length: Math.round((Wd * Ht) / 5000) }, () => ({ x: Math.random() * Wd, y: Math.random() * Ht, r: Math.random() * 1.2 + 0.2, p: Math.random() * 6 })); }
    function draw(t) { x.clearRect(0, 0, Wd, Ht);
      for (const s of list) { x.globalAlpha = 0.35 + 0.35 * Math.sin(t / 900 + s.p); x.fillStyle = "#f3e9cf"; x.beginPath(); x.arc(s.x, s.y, s.r, 0, 7); x.fill(); }
      if (!reduce) requestAnimationFrame(draw); }
    addEventListener("resize", size); size(); requestAnimationFrame(draw);
  })();

  renderHousePreview(); renderTonight();
  // exposed for automated tests only
  window.__sortingHat = { HOUSES, POOL, FIRST, LAST, GROWN_POOL, GROWN_LAST, QUIZ_LEN };
})();

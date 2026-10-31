/* Wand Shop — draws an original SVG wand from a set of choices. */
(() => {
  "use strict";
  const GLOW = { G: "#ff6a3d", H: "#ffd84a", R: "#5aa8ff", S: "#3fe08a", none: "#fff1b8" };
  const GEM = { G: ["#d81e3a", "ruby"], H: ["#f2b40c", "topaz"], R: ["#2f6fe0", "sapphire"], S: ["#18a35a", "emerald"], none: ["#9b59d0", "amethyst"] };

  const STEPS = [
    { key: "wood", q: "What wood should your wand be made of?", opts: [
      { id: "oak", e: "🌳", t: "Oak", hint: "strong like a giant old tree", tags: ["H"], c: ["#8b5a2b", "#5e3a18", "#b98450"],
        flavor: "Oak wands stand by their owners through thick and thin." },
      { id: "holly", e: "🎄", t: "Holly", hint: "pale and bright, a little prickly", tags: ["G"], c: ["#e3d2ad", "#b39b6f", "#fff4dc"],
        flavor: "Holly wands love a brave heart and a big adventure." },
      { id: "birch", e: "🌲", t: "Silver birch", hint: "silvery white with dark stripes", tags: ["R"], c: ["#ddd6c6", "#4a4038", "#f7f3ea"],
        flavor: "Birch wands are curious and quick to learn new spells." },
      { id: "ebony", e: "🌑", t: "Ebony", hint: "dark and mysterious", tags: ["S"], c: ["#2e1f16", "#120b07", "#5a4232"],
        flavor: "Ebony wands choose owners who know their own mind." },
      { id: "cherry", e: "🍒", t: "Cherry", hint: "rosy red and lucky", tags: ["G", "H"], c: ["#8e3424", "#5a1d12", "#bf6a50"],
        flavor: "Cherry wands are warm, lucky and full of spark." },
      { id: "willow", e: "🌿", t: "Willow", hint: "bends but never breaks", tags: ["H", "R"], c: ["#c8a06a", "#94703f", "#ead2a2"],
        flavor: "Willow wands are gentle healers and great listeners." } ] },
    { key: "core", q: "What magic is hiding inside?", opts: [
      { id: "phoenix", e: "🔥", t: "Phoenix feather", hint: "fiery and bold", tags: ["G"], flavor: "Its phoenix feather gives it a fiery, never-give-up spirit." },
      { id: "unicorn", e: "🦄", t: "Unicorn hair", hint: "gentle and loyal", tags: ["H"], flavor: "Its unicorn hair makes it loyal, kind and steady." },
      { id: "starlight", e: "⭐", t: "Starlight", hint: "twinkly and clever", tags: ["R"], flavor: "Its starlight core is full of bright ideas." },
      { id: "dragon", e: "🐉", t: "Dragon heartstring", hint: "powerful and proud", tags: ["S"], flavor: "Its dragon heartstring makes it powerful and proud." } ] },
    { key: "length", q: "How long should it be?", opts: [
      { id: "9.25", e: "🤏", t: "9¼ inches", hint: "small and speedy", tags: [], inches: 9.25 },
      { id: "10.5", e: "✋", t: "10½ inches", hint: "nice and handy", tags: ["H", "R"], inches: 10.5 },
      { id: "12.75", e: "📏", t: "12¾ inches", hint: "long and elegant", tags: ["G", "S"], inches: 12.75 },
      { id: "14", e: "🦒", t: "14 inches", hint: "super long!", tags: [], inches: 14 } ] },
    { key: "flex", q: "How bendy should it be?", opts: [
      { id: "sturdy", e: "🪨", t: "Super sturdy", hint: "straight as an arrow", tags: ["S"], bend: 0, word: "super sturdy" },
      { id: "just", e: "👌", t: "Just right", hint: "a tiny bit of wiggle", tags: ["R"], bend: 8, word: "pleasantly firm" },
      { id: "springy", e: "🎾", t: "Slightly springy", hint: "a little bouncy", tags: ["G"], bend: 18, word: "slightly springy" },
      { id: "bendy", e: "🌊", t: "Wonderfully bendy", hint: "swishy and swoopy", tags: ["H"], bend: 34, word: "wonderfully bendy" } ] },
    { key: "handle", q: "Pick a handle.", opts: [
      { id: "smooth", e: "🥢", t: "Smooth & classic", hint: "simple and sleek", tags: ["R"], desc: "smooth, classic" },
      { id: "spiral", e: "🌀", t: "Twisty spiral", hint: "swirls round and round", tags: ["S"], desc: "twisting spiral" },
      { id: "knobbly", e: "🌰", t: "Knobbly branch", hint: "bumpy like a real twig", tags: ["H"], desc: "knobbly, branch-like" },
      { id: "rings", e: "🎚️", t: "Carved rings", hint: "grippy ridges", tags: ["G"], desc: "ring-carved" } ] },
    { key: "accent", q: "Add something sparkly!", opts: [
      { id: "gold", e: "🟡", t: "Gold bands", hint: "shiny and royal", tags: ["G", "H"], desc: "gold bands" },
      { id: "silver", e: "⚪", t: "Silver bands", hint: "cool and gleaming", tags: ["S", "R"], desc: "silver bands" },
      { id: "gem", e: "💎", t: "A magic gem", hint: "in your house color", tags: [], desc: "" },
      { id: "vine", e: "🍃", t: "Leafy vine", hint: "wrapped in green leaves", tags: [], desc: "a curling leafy vine" } ] }
  ];
  const opt = (key, id) => STEPS.find((s) => s.key === key).opts.find((o) => o.id === id);

  function suggest(house) {
    const cfg = {};
    STEPS.forEach((s) => { const o = s.opts.find((x) => x.tags.includes(house)) || s.opts[1]; cfg[s.key] = o.id; });
    if (house === "R") cfg.accent = "gem";
    return cfg;
  }
  function random() { const cfg = {}; STEPS.forEach((s) => (cfg[s.key] = s.opts[Math.floor(Math.random() * s.opts.length)].id)); return cfg; }
  function defaults() { return { wood: "oak", core: "phoenix", length: "12.75", flex: "just", handle: "smooth", accent: "gold" }; }

  function hash(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const f = (n) => n.toFixed(1);

  /* render(cfg, house, uid) -> SVG string (viewBox 640x170) */
  function render(cfg, house, uid, opts = {}) {
    cfg = Object.assign(defaults(), cfg || {});
    const H = house && GLOW[house] ? house : "none", glow = GLOW[H];
    const wood = opt("wood", cfg.wood), core = opt("core", cfg.core), len = opt("length", cfg.length),
          flex = opt("flex", cfg.flex), handle = cfg.handle, accent = cfg.accent;
    const [base, dark, light] = wood.c;
    const R = rng(hash(JSON.stringify(cfg) + H));
    const id = "w" + (uid || Math.random().toString(36).slice(2, 8));

    const K = 1.6, x0 = 34, total = 330 + (len.inches - 9) * 50, y0 = 112, bend = flex.bend, hf = 0.3;
    const N = 80;
    const center = (t) => [x0 + total * t, y0 - bend * t * t - (bend ? bend * 0.35 * Math.sin(Math.PI * t) : 0)];
    const radius = (t) => {
      if (t < hf) {
        const u = t / hf; let r = 9.5;
        if (handle === "smooth") r = 8.6 + 1.4 * Math.cos(u * Math.PI * 0.5) + (u < 0.06 ? 1.8 : 0);
        if (handle === "spiral") r = 9.2 + 0.9 * Math.sin(u * 40);
        if (handle === "knobbly") r = 8.8 + 1.8 * Math.abs(Math.sin(u * 13 + 0.7)) * (0.6 + 0.4 * Math.sin(u * 5));
        if (handle === "rings") r = 9 + (Math.sin(u * 46) > 0.55 ? 1.9 : 0);
        return K * (u > 0.93 ? r - (u - 0.93) * 30 : r);
      }
      const u = (t - hf) / (1 - hf);
      return K * (6.4 - 4.0 * u);
    };
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, [x, y] = center(t), [x2, y2] = center(Math.min(1, t + 0.01)), [x1, y1] = center(Math.max(0, t - 0.01));
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, r = radius(t);
      pts.push({ t, x, y, nx, ny, r });
    }
    const top = pts.map((p) => `${f(p.x + p.nx * p.r)},${f(p.y + p.ny * p.r)}`);
    const bot = pts.slice().reverse().map((p) => `${f(p.x - p.nx * p.r)},${f(p.y - p.ny * p.r)}`);
    const [ex, ey] = center(0), [tx, ty] = center(1);
    const body = `M${top.join(" L")} L${f(tx + 2.2)},${f(ty)} L${bot.join(" L")} A14 14 0 0 1 ${top[0]} Z`;
    const pathAt = (off, from = 0, to = 1) => pts.filter((p) => p.t >= from && p.t <= to).map((p, i) => `${i ? "L" : "M"}${f(p.x + p.nx * p.r * off)},${f(p.y + p.ny * p.r * off)}`).join(" ");
    const P = (t) => pts[Math.round(t * N)];

    let grain = "";
    if (cfg.wood === "birch") {
      for (let i = 0; i < 26; i++) { const t = 0.02 + R() * 0.96, p = P(t), off = (R() - 0.5) * 1.2, w = 4 + R() * 10;
        grain += `<line x1="${f(p.x - w / 2)}" y1="${f(p.y + p.ny * p.r * off)}" x2="${f(p.x + w / 2)}" y2="${f(p.y + p.ny * p.r * off)}" stroke="${dark}" stroke-width="${f(1 + R() * 1.6)}" stroke-linecap="round" opacity=".75"/>`; }
    } else {
      for (let i = 0; i < 6; i++) { const off = -0.75 + i * 0.3 + (R() - 0.5) * 0.1, a = R() * 0.2;
        grain += `<path d="${pathAt(off, a, 1)}" fill="none" stroke="${i % 2 ? dark : light}" stroke-width="${f(0.7 + R() * 0.8)}" opacity="${f(0.35 + R() * 0.3)}"/>`; }
      for (let i = 0; i < 2; i++) { const p = P(0.35 + R() * 0.55);
        grain += `<ellipse cx="${f(p.x)}" cy="${f(p.y + p.ny * (R() - 0.5) * 4)}" rx="${f(3 + R() * 3)}" ry="1.6" fill="${dark}" opacity=".55"/>`; }
    }

    let handleArt = "";
    if (handle === "spiral") for (let u = 0.02; u < hf - 0.01; u += 0.016) { const p = P(u), q = P(u + 0.014);
      handleArt += `<line x1="${f(p.x + p.nx * p.r)}" y1="${f(p.y + p.ny * p.r)}" x2="${f(q.x - q.nx * q.r)}" y2="${f(q.y - q.ny * q.r)}" stroke="${dark}" stroke-width="2.4" opacity=".7"/>`; }
    if (handle === "rings") for (let u = 0.03; u < hf - 0.02; u += 0.034) { const p = P(u);
      handleArt += `<line x1="${f(p.x + p.nx * (p.r + 1))}" y1="${f(p.y + p.ny * (p.r + 1))}" x2="${f(p.x - p.nx * (p.r + 1))}" y2="${f(p.y - p.ny * (p.r + 1))}" stroke="${dark}" stroke-width="2" opacity=".8"/>`; }
    if (handle === "knobbly") for (let i = 0; i < 4; i++) { const p = P(0.04 + i * 0.07 + R() * 0.02), s = i % 2 ? 1 : -1;
      handleArt += `<circle cx="${f(p.x + p.nx * p.r * s * 0.9)}" cy="${f(p.y + p.ny * p.r * s * 0.9)}" r="${f(3.8 + R() * 2.4)}" fill="${base}" stroke="${dark}" stroke-width="1"/>`; }
    if (handle === "smooth") { const p = P(0.012); handleArt += `<circle cx="${f(p.x - 4)}" cy="${f(p.y)}" r="15" fill="${base}" stroke="${dark}" stroke-width="1.2"/><circle cx="${f(p.x - 7)}" cy="${f(p.y - 5)}" r="4.5" fill="#fff" opacity=".25"/>`; }

    let acc = "";
    const metal = accent === "silver" ? ["#f4f6f8", "#9aa3ad"] : ["#ffe28a", "#b8861c"];
    const band = (t, w) => { const p = P(t), r = p.r + 1.6;
      return `<path d="M${f(p.x - w / 2 + p.nx * r)},${f(p.y + p.ny * r)} L${f(p.x + w / 2 + p.nx * r)},${f(p.y + p.ny * r)} L${f(p.x + w / 2 - p.nx * r)},${f(p.y - p.ny * r)} L${f(p.x - w / 2 - p.nx * r)},${f(p.y - p.ny * r)} Z" fill="url(#${id}m)" stroke="${metal[1]}" stroke-width=".8"/>`; };
    if (accent === "gold" || accent === "silver") acc = band(hf, 9) + band(hf - 0.02, 3) + band(0.04, 6) + band(0.62, 3);
    if (accent === "gem") { const [gc] = GEM[H], p = P(hf - 0.01);
      acc = band(hf + 0.012, 4) + `<g transform="translate(${f(p.x)},${f(p.y)}) scale(1.5)"><path d="M0,-12 L9,0 L0,12 L-9,0 Z" fill="${gc}" stroke="#fff" stroke-width="1.4"/><path d="M0,-12 L3,0 L0,12" fill="#fff" opacity=".35"/><circle cx="-2" cy="-5" r="1.8" fill="#fff" opacity=".9"/></g>`;
      const q = P(0.01); acc += `<circle cx="${f(q.x - 4)}" cy="${f(q.y)}" r="10" fill="${gc}" stroke="#fff" stroke-width="1.2"/><circle cx="${f(q.x - 6)}" cy="${f(q.y - 2)}" r="1.6" fill="#fff"/>`; }
    if (accent === "vine") { let d = ""; for (let i = 0; i <= 60; i++) { const t = 0.02 + (0.68 * i) / 60, p = P(t), s = Math.sin(i * 0.75);
        d += `${i ? "L" : "M"}${f(p.x + p.nx * p.r * s * 1.05)},${f(p.y + p.ny * p.r * s * 1.05)} `; }
      acc = `<path d="${d}" fill="none" stroke="#2f7a32" stroke-width="3"/>`;
      for (let i = 0; i < 7; i++) { const p = P(0.05 + i * 0.095), s = i % 2 ? 1 : -1, lx = p.x + p.nx * (p.r + 3) * s, ly = p.y + p.ny * (p.r + 3) * s;
        acc += `<ellipse cx="${f(lx)}" cy="${f(ly)}" rx="7" ry="3.6" transform="rotate(${s * 30} ${f(lx)} ${f(ly)})" fill="#4caf50" stroke="#2f7a32" stroke-width=".8"/>`; } }

    // tip magic depends on the core
    let magic = "";
    const T = (opts.animate === false) ? "" : "";
    if (core.id === "phoenix") {
      magic = `<path d="M${f(tx + 2)},${f(ty)} C${f(tx + 12)},${f(ty - 6)} ${f(tx + 14)},${f(ty - 20)} ${f(tx + 8)},${f(ty - 30)} C${f(tx + 22)},${f(ty - 18)} ${f(tx + 26)},${f(ty - 4)} ${f(tx + 2)},${f(ty)} Z" fill="#ffb347" opacity=".9"/>
               <path d="M${f(tx + 3)},${f(ty)} C${f(tx + 10)},${f(ty - 4)} ${f(tx + 12)},${f(ty - 12)} ${f(tx + 9)},${f(ty - 18)} C${f(tx + 17)},${f(ty - 10)} ${f(tx + 17)},${f(ty - 2)} ${f(tx + 3)},${f(ty)} Z" fill="#fff3b0"/>`;
      for (let i = 0; i < 6; i++) magic += `<circle cx="${f(tx + 6 + R() * 30)}" cy="${f(ty - 8 - R() * 34)}" r="${f(1 + R() * 1.8)}" fill="${i % 2 ? "#ffcf5a" : glow}"/>`;
    } else if (core.id === "dragon") {
      for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2 + R() * 0.3, l = 12 + R() * 16;
        magic += `<path d="M${f(tx + 3)},${f(ty)} L${f(tx + 3 + Math.cos(a) * l * 0.5 + 3)},${f(ty + Math.sin(a) * l * 0.5 - 2)} L${f(tx + 3 + Math.cos(a) * l)},${f(ty + Math.sin(a) * l)}" fill="none" stroke="${i % 2 ? "#fff" : glow}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`; }
    } else if (core.id === "unicorn") {
      const rb = ["#ff7eb6", "#ffd36e", "#8ef0a0", "#7ec8ff", "#c79bff"];
      rb.forEach((c, i) => (magic += `<circle cx="${f(tx + 4)}" cy="${f(ty)}" r="${10 + i * 5}" fill="none" stroke="${c}" stroke-width="2" opacity="${f(0.75 - i * 0.12)}"/>`));
      for (let i = 0; i < 5; i++) magic += `<circle cx="${f(tx + 10 + R() * 28)}" cy="${f(ty - 18 + R() * 36)}" r="1.8" fill="#fff"/>`;
    } else {
      const star = (cx, cy, s, c) => `<path d="M${f(cx)},${f(cy - s)} Q${f(cx)},${f(cy)} ${f(cx + s)},${f(cy)} Q${f(cx)},${f(cy)} ${f(cx)},${f(cy + s)} Q${f(cx)},${f(cy)} ${f(cx - s)},${f(cy)} Q${f(cx)},${f(cy)} ${f(cx)},${f(cy - s)} Z" fill="${c}"/>`;
      magic = star(tx + 4, ty, 14, "#fff");
      for (let i = 0; i < 5; i++) magic += star(tx + 10 + R() * 34, ty - 24 + R() * 48, 3 + R() * 5, i % 2 ? glow : "#fff6c8");
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 180" width="${opts.width || 700}" height="${opts.height || 180}" role="img" aria-label="${wood.t} wand with ${core.t} core">
  <defs>
    <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".45" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
    <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${metal[0]}"/><stop offset=".5" stop-color="${metal[1]}"/><stop offset="1" stop-color="${metal[0]}"/></linearGradient>
    <radialGradient id="${id}g"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="${glow}" stop-opacity=".85"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
    <clipPath id="${id}c"><path d="${body}"/></clipPath>
  </defs>
  ${opts.bg ? `<rect width="700" height="180" rx="14" fill="#0f1424"/>` : ""}
  <ellipse cx="${f((ex + tx) / 2)}" cy="${f(y0 + 40)}" rx="${f(total / 2)}" ry="6" fill="#000" opacity=".35"/>
  <circle cx="${f(tx + 4)}" cy="${f(ty)}" r="50" fill="url(#${id}g)" class="wand-glow"/>
  <path d="${body}" fill="url(#${id}w)" stroke="${dark}" stroke-width="1.3"/>
  <g clip-path="url(#${id}c)">${grain}<path d="${pathAt(0.45, 0.01, 0.98)}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".28"/></g>
  ${handleArt}${acc}
  <circle cx="${f(tx + 1)}" cy="${f(ty)}" r="3.2" fill="#fff"/>
  ${magic}
</svg>`;
  }

  function describe(cfg, name, house) {
    cfg = Object.assign(defaults(), cfg || {});
    const H = house && GEM[house] ? house : "none";
    const wood = opt("wood", cfg.wood), core = opt("core", cfg.core), len = opt("length", cfg.length),
          flex = opt("flex", cfg.flex), handle = opt("handle", cfg.handle), accent = opt("accent", cfg.accent);
    const acc = cfg.accent === "gem" ? `a sparkling ${GEM[H][1]}` : accent.desc;
    const woodName = wood.t.toLowerCase();
    return {
      spec: `${len.t}, ${woodName}, ${core.t.toLowerCase()} core, ${flex.word}.`,
      look: `A ${handle.desc} handle with ${acc}.`,
      flavor: `${wood.flavor} ${core.flavor}`,
      title: `${name ? name + "’s" : "Your"} wand`
    };
  }

  async function toPNG(cfg, name, house) {
    const d = describe(cfg, name, house), W = 1200, Hh = 760;
    const svg = render(cfg, house, "png", { width: 1120, height: 288 });
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const c = document.createElement("canvas"); c.width = W; c.height = Hh; const x = c.getContext("2d");
    const g = x.createRadialGradient(W / 2, -100, 50, W / 2, 200, 900); g.addColorStop(0, "#2b3557"); g.addColorStop(1, "#0f1424");
    x.fillStyle = g; x.fillRect(0, 0, W, Hh);
    const r2 = rng(hash(name || "wand")); x.fillStyle = "#f3e9cf";
    for (let i = 0; i < 160; i++) { x.globalAlpha = 0.2 + r2() * 0.6; x.beginPath(); x.arc(r2() * W, r2() * Hh, r2() * 1.6 + 0.3, 0, 7); x.fill(); }
    x.globalAlpha = 1;
    x.textAlign = "center"; x.fillStyle = "#e8c47a"; x.font = "bold 54px Georgia, serif";
    x.fillText(d.title, W / 2, 90);
    x.drawImage(img, 40, 125, 1120, 288); URL.revokeObjectURL(url);
    const cg = x.createLinearGradient(0, 450, 0, 700); cg.addColorStop(0, "#171e33"); cg.addColorStop(1, "#232b45");
    x.fillStyle = cg; x.beginPath(); x.roundRect ? x.roundRect(100, 450, 1000, 250, 6) : x.rect(100, 450, 1000, 250); x.fill();
    x.strokeStyle = "rgba(232,196,122,.4)"; x.lineWidth = 2; x.stroke();
    x.fillStyle = "#ece6d6"; x.font = "bold 36px Georgia, serif"; x.fillText(d.spec, W / 2, 510);
    x.font = "30px Georgia, serif"; x.fillText(d.look, W / 2, 560);
    x.fillStyle = "#a3a7b8";
    wrap(x, d.flavor, W / 2, 610, 920, 36, "italic 26px Georgia, serif");
    x.fillStyle = "#a3a7b8"; x.font = "20px Georgia, serif"; x.fillText("The Family Sorting Ceremony · a fan-made family game", W / 2, 740);
    return new Promise((res) => c.toBlob(res, "image/png"));
  }
  function wrap(x, text, cx, y, maxW, lh, font) {
    x.font = font; const words = text.split(" "); let line = "";
    for (const w of words) { const t = line ? line + " " + w : w; if (x.measureText(t).width > maxW && line) { x.fillText(line, cx, y); y += lh; line = w; } else line = t; }
    if (line) x.fillText(line, cx, y);
  }

  window.Wand = { STEPS, render, describe, suggest, random, defaults, toPNG, GLOW };
})();

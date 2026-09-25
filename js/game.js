const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const canvas = $("#canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const WORLD_W = 2600;
const WORLD_H = 1900;

const rnd = (a, b) => a + Math.random() * (b - a);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const ang = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const G = {
  state: "menu",
  ch: null,
  chIdx: 0,
  loc: LOCATIONS.escola,
  player: null,
  enemies: [],
  allies: [],
  particles: [],
  floats: [],
  pickups: [],
  decor: [],
  keys: {},
  cam: { x: 0, y: 0 },
  time: 0,
  shake: 0,
  paused: false,
  unlocked: 1,
  done: [],
  spawnQueue: [],
  spawnTimer: 0,
  msgTimer: 0,
  activeSeason: 1,
  ended: false
};

const PLAYER_CHAR = Object.assign({ id: "eleven" }, CHARACTERS.eleven);
const ALLY_SETS = {
  1: ["mike", "dustin", "lucas", "will"],
  2: ["mike", "dustin", "lucas", "will"],
  3: ["max", "mike", "dustin", "lucas"],
  4: ["max", "mike", "dustin", "will"],
  5: ["max", "mike", "dustin", "lucas", "will"]
};
const WEAPON_BY_SEASON = {
  1: ["faca", "taco"],
  2: ["faca", "taco", "tacoPregos", "machete"],
  3: ["faca", "taco", "tacoPregos", "machete", "espada"],
  4: ["faca", "taco", "tacoPregos", "machete", "espada", "punhal"],
  5: ["faca", "taco", "tacoPregos", "machete", "espada", "punhal"]
};

/* ============ PROGRESSO ============ */

function loadProgress() {
  try {
    const raw = localStorage.getItem("st_progress");
    if (raw) {
      const d = JSON.parse(raw);
      G.unlocked = d.unlocked || 1;
      G.done = d.done || [];
    }
  } catch (e) {}
}

function saveProgress() {
  try {
    localStorage.setItem("st_progress", JSON.stringify({ unlocked: G.unlocked, done: G.done }));
  } catch (e) {}
}

/* ============ SOM ============ */

let AC = null;
function ac() {
  if (!AC) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (C) AC = new C();
  }
  if (AC && AC.state === "suspended") AC.resume();
  return AC;
}

function beep(freq, dur, type, vol) {
  const a = ac();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type || "square";
  o.frequency.value = freq;
  g.gain.value = vol == null ? 0.05 : vol;
  o.connect(g);
  g.connect(a.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.stop(a.currentTime + dur);
}

let musicTimer = null;
function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function startMusic() {
  stopMusic();
  const notes = [220, 261.63, 329.63, 392, 523.25, 392, 329.63, 261.63];
  let i = 0;
  musicTimer = setInterval(() => {
    if (G.state !== "playing" || G.paused || G.ended) return;
    beep(notes[i % notes.length], 0.32, "triangle", 0.045);
    i++;
  }, 340);
}

const sfx = {
  swing: () => beep(190, 0.07, "sawtooth", 0.035),
  hit: () => beep(90, 0.09, "square", 0.05),
  power: () => beep(660, 0.22, "sine", 0.06),
  hurt: () => beep(140, 0.2, "sawtooth", 0.06),
  die: () => beep(70, 0.35, "sawtooth", 0.05),
  win: () => [523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => beep(f, 0.28, "triangle", 0.06), i * 130))
};

/* ============ DESENHO ============ */

function drawHuman(c, x, y, s, face, opt) {
  opt = opt || {};
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(face > Math.PI / 2 || face < -Math.PI / 2 ? -s : s, s);

  const bob = opt.bob || 0;
  const atk = opt.atk || 0;

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 3, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (opt.hurt > 0) ctx.globalAlpha = 0.4 + 0.4 * Math.sin(opt.hurt * 40);

  ctx.fillStyle = c.pants;
  ctx.fillRect(-7, -9, 5, 11 + bob);
  ctx.fillRect(2, -9, 5, 11 - bob);

  ctx.fillStyle = c.shirt;
  ctx.fillRect(-9, -22, 18, 14);

  if (c.id === "max") {
    ctx.fillStyle = c.shirt2;
    for (let i = 0; i < 4; i++) ctx.fillRect(-9, -21 + i * 3.5, 18, 1.6);
    ctx.fillStyle = c.pants;
    ctx.fillRect(-8, -9, 16, 6);
  } else if (c.id === "eleven") {
    ctx.fillStyle = c.shirt2;
    ctx.fillRect(-9, -22, 8, 14);
  } else if (c.shirt2 !== c.shirt) {
    ctx.fillStyle = c.shirt2;
    ctx.fillRect(-9, -15, 18, 7);
  }
  if (c.id === "will") {
    ctx.strokeStyle = c.shirt2;
    ctx.lineWidth = 2;
    ctx.strokeRect(-9, -22, 18, 14);
  }

  ctx.fillStyle = c.shirt;
  ctx.fillRect(-15, -21 - atk * 5, 6, 11);
  ctx.fillRect(9, -21 + atk * 5, 6, 11);
  if (atk > 0) {
    ctx.fillStyle = c.skin;
    ctx.fillRect(11, -26 + atk * 10, 8, 8);
  }

  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.arc(0, -28, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = c.hair;
  ctx.beginPath();
  ctx.arc(0, -30, 8.5, Math.PI, Math.PI * 2);
  ctx.fill();

  if (c.id === "eleven") {
    ctx.beginPath();
    ctx.moveTo(-7, -31);
    ctx.quadraticCurveTo(-15, -24, -12, -13);
    ctx.lineTo(-7, -16);
    ctx.quadraticCurveTo(-10, -24, -5, -30);
    ctx.fill();
  } else if (c.id === "max") {
    [-1, 1].forEach((sd) => {
      ctx.beginPath();
      ctx.moveTo(sd * 8, -31);
      ctx.quadraticCurveTo(sd * 16, -21, sd * 12, -9);
      ctx.lineTo(sd * 8, -12);
      ctx.quadraticCurveTo(sd * 11, -23, sd * 6, -30);
      ctx.fill();
    });
  } else if (c.id === "dustin" || c.id === "will") {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(i * 5, -32, 4.2, Math.PI, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(2.5, -28, 2.5, 2.5);

  ctx.restore();
}

function drawMonster(m, x, y, s, hurt, t) {
  const sz = m.size;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, sz * 0.42, sz * 0.75, sz * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();

  if (hurt > 0) ctx.globalAlpha = 0.45 + 0.45 * Math.sin(hurt * 45);
  const col = m.color;

  if (m.kind === "demogorgon" || m.kind === "demogorgonJovem") {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.15, sz * 0.62, sz * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a0508";
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.2, sz * 0.4, sz * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8a2530";
    ctx.lineWidth = Math.max(1.5, sz * 0.07);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + t * 0.4;
      ctx.beginPath();
      ctx.moveTo(0, -sz * 0.2);
      ctx.quadraticCurveTo(Math.cos(a) * sz * 0.55, -sz * 0.2 + Math.sin(a) * sz * 0.55, Math.cos(a) * sz * 0.74, -sz * 0.2 + Math.sin(a) * sz * 0.74);
      ctx.stroke();
    }
    ctx.fillStyle = "#e8e0d0";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * sz * 0.28, -sz * 0.2 + Math.sin(a) * sz * 0.2);
      ctx.lineTo(Math.cos(a) * sz * 0.38, -sz * 0.2 + Math.sin(a) * sz * 0.3);
      ctx.lineTo(Math.cos(a + 0.4) * sz * 0.28, -sz * 0.2 + Math.sin(a + 0.4) * sz * 0.2);
      ctx.fill();
    }
  } else if (m.kind === "demodog" || m.kind === "dart") {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.1, sz * 0.85, sz * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sz * 0.75, -sz * 0.35, sz * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff5252";
    ctx.beginPath();
    ctx.arc(sz * 0.62, -sz * 0.42, sz * 0.09, 0, Math.PI * 2);
    ctx.arc(sz * 0.88, -sz * 0.42, sz * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = sz * 0.14;
    [-0.5, 0, 0.5].forEach((o) => {
      ctx.beginPath();
      ctx.moveTo(o * sz * 0.9, -sz * 0.05);
      ctx.lineTo(o * sz * 1.05, sz * 0.3);
      ctx.stroke();
    });
  } else if (m.kind === "mindFlayer" || m.kind === "oldOne") {
    ctx.fillStyle = col;
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const r = sz * (0.62 + 0.16 * Math.sin(t * 2.2 + i));
      const px = Math.cos(a) * r;
      const py = -sz * 0.35 + Math.sin(a) * r * 0.75;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = sz * 0.11;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + t * 0.7;
      const sway = Math.sin(t * 3 + i) * sz * 0.35;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * sz * 0.35, -sz * 0.35 + Math.sin(a) * sz * 0.3);
      ctx.quadraticCurveTo(Math.cos(a) * sz * 0.8 + sway, -sz * 0.2, Math.cos(a) * sz * 1.25, sz * 0.15 + sway);
      ctx.stroke();
    }
    ctx.fillStyle = m.kind === "oldOne" ? "#ff1744" : "#ba68c8";
    ctx.beginPath();
    ctx.arc(0, -sz * 0.35, sz * 0.16, 0, Math.PI * 2);
    ctx.fill();
  } else if (m.kind === "spiderMonster") {
    ctx.strokeStyle = col;
    ctx.lineWidth = sz * 0.1;
    for (let i = 0; i < 8; i++) {
      const side = i < 4 ? -1 : 1;
      const k = i % 4;
      const wob = Math.sin(t * 3 + i) * sz * 0.2;
      ctx.beginPath();
      ctx.moveTo(side * sz * 0.2, -sz * 0.2);
      ctx.quadraticCurveTo(side * sz * 0.8, -sz * 0.5 + k * sz * 0.2, side * sz * 1.1, -sz * 0.1 + k * sz * 0.35 + wob);
      ctx.stroke();
    }
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.25, sz * 0.6, sz * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff1744";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(-sz * 0.3 + i * sz * 0.15, -sz * 0.3, sz * 0.055, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (m.kind === "demobat") {
    const flap = Math.sin(t * 14) * sz * 0.35;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.3, sz * 0.28, sz * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(90,50,90,0.9)";
    [-1, 1].forEach((sd) => {
      ctx.beginPath();
      ctx.moveTo(sd * sz * 0.2, -sz * 0.35);
      ctx.quadraticCurveTo(sd * sz * 0.8, -sz * 0.75 - flap, sd * sz * 1.05, -sz * 0.15);
      ctx.quadraticCurveTo(sd * sz * 0.6, -sz * 0.1, sd * sz * 0.2, -sz * 0.2);
      ctx.fill();
    });
    ctx.strokeStyle = col;
    ctx.lineWidth = sz * 0.07;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(sz * 0.2, sz * 0.4, -sz * 0.1, sz * 0.6);
    ctx.stroke();
    ctx.fillStyle = "#ff5252";
    ctx.beginPath();
    ctx.arc(-sz * 0.1, -sz * 0.36, sz * 0.07, 0, Math.PI * 2);
    ctx.arc(sz * 0.1, -sz * 0.36, sz * 0.07, 0, Math.PI * 2);
    ctx.fill();
  } else if (m.kind === "vecna") {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.3, sz * 0.4, sz * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c62828";
    ctx.beginPath();
    ctx.arc(0, -sz * 0.95, sz * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4a0e0e";
    ctx.lineWidth = sz * 0.08;
    for (let i = 0; i < 5; i++) {
      const sway = Math.sin(t * 2.5 + i) * sz * 0.3;
      ctx.beginPath();
      ctx.moveTo(0, -sz * 0.5);
      ctx.quadraticCurveTo(sway, -sz * 0.1, sway * 1.6, sz * 0.2);
      ctx.stroke();
    }
    ctx.fillStyle = "#ffd54f";
    ctx.beginPath();
    ctx.arc(-sz * 0.1, -sz * 0.98, sz * 0.06, 0, Math.PI * 2);
    ctx.arc(sz * 0.1, -sz * 0.98, sz * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else if (m.kind === "vine") {
    ctx.strokeStyle = col;
    ctx.lineWidth = sz * 0.13;
    for (let i = 0; i < 4; i++) {
      const sway = Math.sin(t * 2 + i) * sz * 0.3;
      ctx.beginPath();
      ctx.moveTo((i - 1.5) * sz * 0.2, sz * 0.3);
      ctx.quadraticCurveTo(sway, -sz * 0.2, sway * 1.5, -sz * 0.7);
      ctx.stroke();
    }
    ctx.fillStyle = "#1b3a1b";
    ctx.beginPath();
    ctx.arc(0, sz * 0.3, sz * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (m.kind === "hospitalMonster") {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.2, sz * 0.6, sz * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = sz * 0.05;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(-sz * 0.5, -sz * 0.7 + i * sz * 0.25);
      ctx.quadraticCurveTo(0, -sz * 0.6 + i * sz * 0.25, sz * 0.5, -sz * 0.7 + i * sz * 0.25);
      ctx.stroke();
    }
    ctx.fillStyle = "#4a1a1a";
    ctx.beginPath();
    ctx.arc(0, -sz * 0.4, sz * 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -sz * 0.2, sz * 0.45, sz * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a6a5a";
    ctx.beginPath();
    ctx.arc(0, -sz * 0.75, sz * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff5252";
    ctx.fillRect(-sz * 0.18, -sz * 0.8, sz * 0.1, sz * 0.08);
    ctx.fillRect(sz * 0.08, -sz * 0.8, sz * 0.1, sz * 0.08);
  }

  ctx.restore();
}

/* ============ MENUS ============ */

function showScreen(id) {
  $$(".screen").forEach((s) => s.classList.add("hidden"));
  if (id) $("#" + id).classList.remove("hidden");
}

function buildChapterSelect() {
  const tabs = $("#seasonTabs");
  tabs.innerHTML = "";
  for (let s = 1; s <= 5; s++) {
    const b = document.createElement("button");
    const locked = (s - 1) * 6 + 1 > G.unlocked;
    b.className = "stab" + (s === G.activeSeason ? " active" : "") + (locked ? " locked" : "");
    b.textContent = "T" + s;
    b.onclick = () => {
      if (locked) return;
      G.activeSeason = s;
      buildChapterSelect();
    };
    tabs.appendChild(b);
  }

  const grid = $("#chapterGrid");
  grid.innerHTML = "";
  CHAPTERS.filter((c) => c.s === G.activeSeason).forEach((c) => {
    const idx = CHAPTERS.indexOf(c) + 1;
    const locked = idx > G.unlocked;
    const done = G.done.includes(idx);
    const b = document.createElement("button");
    b.className = "cbtn" + (locked ? " locked" : "") + (done ? " done" : "");
    b.innerHTML = '<div class="cn">CAPÍTULO ' + c.n + (done ? " ✓" : "") + '</div><div class="ct">' + c.title + "</div>";
    if (!locked) b.onclick = () => startChapter(idx - 1);
    grid.appendChild(b);
  });
}

function previewCanvas(color, w, h) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const c2 = cv.getContext("2d");
  const g = c2.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, color || "#221a2a");
  g.addColorStop(1, "#0a0a12");
  c2.fillStyle = g;
  c2.fillRect(0, 0, w, h);
  return { cv, c2 };
}

function buildGallery() {
  const cg = $("#charGrid");
  cg.innerHTML = "";
  Object.keys(CHARACTERS).forEach((id) => {
    const c = Object.assign({ id: id }, CHARACTERS[id]);
    const card = document.createElement("div");
    card.className = "ccard" + (c.villain ? " villain" : "");
    const p = previewCanvas(c.villain ? "#2a1018" : "#1a1a2a", 66, 74);
    drawHuman(p.c2, 33, 62, 1.2, 0, {});
    card.appendChild(p.cv);
    const info = document.createElement("div");
    info.className = "cinfo";
    info.innerHTML = "<h4>" + c.name + '</h4><div class="role">' + c.role + (c.power ? " · " + c.power : "") + "</div><p>" + c.desc + "</p>";
    card.appendChild(info);
    cg.appendChild(card);
  });

  const mg = $("#monsterGrid");
  mg.innerHTML = "";
  Object.keys(MONSTERS).forEach((id) => {
    const m = Object.assign({ kind: id }, MONSTERS[id]);
    const card = document.createElement("div");
    card.className = "ccard villain";
    const p = previewCanvas("#2a0a12", 72, 74);
    drawMonster(m, 36, 58, Math.min(1.1, 26 / m.size), 0, 0);
    card.appendChild(p.cv);
    const info = document.createElement("div");
    info.className = "cinfo";
    info.innerHTML = "<h4>" + m.name + '</h4><div class="role">VIDA ' + m.hp + " · DANO " + m.damage + '</div><p>' + m.desc + "</p>";
    card.appendChild(info);
    mg.appendChild(card);
  });

  const ig = $("#itemGrid");
  ig.innerHTML = "";
  Object.keys(ITEMS).forEach((id) => {
    const it = ITEMS[id];
    const card = document.createElement("div");
    card.className = "ccard";
    const p = previewCanvas("#1a1a2a", 66, 66);
    p.c2.fillStyle = "#f5c518";
    p.c2.font = "24px monospace";
    p.c2.textAlign = "center";
    p.c2.fillText({ melee: "⚔", ranged: "➶", special: "🔥", light: "🔦", utility: "✦" }[it.type] || "✦", 33, 40);
    card.appendChild(p.cv);
    const info = document.createElement("div");
    info.className = "cinfo";
    info.innerHTML = "<h4>" + it.name + '</h4><div class="role">' + String(it.type || "").toUpperCase() + (it.damage ? " · DANO " + it.damage : "") + "</div><p>" + it.desc + "</p>";
    card.appendChild(info);
    ig.appendChild(card);
  });
}

/* ============ PARTIDA ============ */

function makeEnemy(kind, x, y) {
  const base = MONSTERS[kind];
  const tier = 1 + (G.ch.s - 1) * 0.14;
  return {
    kind: kind,
    name: base.name,
    x: x,
    y: y,
    vx: 0,
    vy: 0,
    hp: Math.round(base.hp * tier),
    maxHp: Math.round(base.hp * tier),
    speed: base.speed,
    damage: Math.round(base.damage * tier),
    color: base.color,
    size: base.size,
    xp: base.xp,
    boss: G.ch.boss === kind,
    atkCd: 0,
    hurt: 0,
    knock: 0,
    lifted: 0,
    dead: false
  };
}

function makeAlly(id, x, y) {
  const c = CHARACTERS[id];
  return {
    id: id,
    char: Object.assign({ id: id }, c),
    x: x,
    y: y,
    face: 0,
    hp: c.hp,
    maxHp: c.hp,
    atkCd: 0,
    atkT: 0,
    walk: 0
  };
}

function startChapter(idx) {
  clearOverlay();
  G.chIdx = idx;
  G.ch = CHAPTERS[idx];
  G.loc = LOCATIONS[G.ch.loc];
  G.state = "playing";
  G.ended = false;
  G.paused = false;
  G.enemies = [];
  G.allies = [];
  G.particles = [];
  G.floats = [];
  G.pickups = [];
  G.decor = [];
  G.spawnQueue = [];
  G.spawnTimer = 0;
  G.time = 0;
  G.shake = 0;
  stopMusic();

  const s = G.ch.s;
  G.player = {
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    hp: 100 + (s - 1) * 25,
    maxHp: 100 + (s - 1) * 25,
    power: 100,
    maxPower: 100,
    face: -Math.PI / 2,
    size: G.ch.size,
    atkCd: 0,
    atkT: 0,
    hitDone: false,
    inv: 0,
    hurt: 0,
    weapons: WEAPON_BY_SEASON[s].slice(),
    wi: 0,
    charge: 0,
    charging: false,
    grabbed: [],
    score: 0
  };

  const set = ALLY_SETS[s];
  const count = 2 + Math.min(2, Math.floor((G.ch.n - 1) / 2));
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    G.allies.push(makeAlly(set[i % set.length], G.player.x + Math.cos(a) * 70, G.player.y + Math.sin(a) * 70));
  }

  for (let i = 0; i < 100; i++) {
    G.decor.push({ x: rnd(0, WORLD_W), y: rnd(0, WORLD_H), r: rnd(10, 48) });
  }

  const roster = G.ch.enemies.slice();
  const target = 3 + Math.floor(G.ch.n / 2) + (G.ch.s - 1);
  const queueKinds = [];
  for (let i = 0; i < target; i++) queueKinds.push(roster[i % roster.length]);
  if (G.ch.boss) queueKinds.push(G.ch.boss);

  queueKinds.forEach((k, i) => {
    const a = (i / queueKinds.length) * Math.PI * 2;
    const r = 320 + (i % 3) * 60;
    G.spawnQueue.push({
      kind: k,
      x: G.player.x + Math.cos(a) * r,
      y: G.player.y + Math.sin(a) * r,
      at: 0.5 + i * 0.9
    });
  });

  $("#enemyBarWrap").classList.add("hidden");
  $("#pauseMenu").classList.add("hidden");
  showScreen("game");
  resizeCanvas();
  showMessage("CAPÍTULO " + G.ch.n + " — " + G.ch.title + "\n" + G.ch.text, 7);
  if (G.ch.music) startMusic();
  updateHud();
}

function resizeCanvas() {
  const ar = W / H;
  let cw = window.innerWidth;
  let chh = cw / ar;
  if (chh > window.innerHeight) {
    chh = window.innerHeight;
    cw = chh * ar;
  }
  canvas.style.width = Math.floor(cw) + "px";
  canvas.style.height = Math.floor(chh) + "px";
}

window.addEventListener("resize", resizeCanvas);

function showMessage(txt, secs) {
  const m = $("#message");
  m.textContent = txt;
  m.style.whiteSpace = "pre-line";
  m.classList.remove("hidden");
  G.msgTimer = secs || 4;
}

function updateHud() {
  const p = G.player;
  if (!p) return;
  $("#hpBar").style.width = clamp((p.hp / p.maxHp) * 100, 0, 100) + "%";
  $("#powerBar").style.width = clamp((p.power / p.maxPower) * 100, 0, 100) + "%";
  const se = SEASONS[G.ch.s];
  $("#chapterInfo").innerHTML = "<b>" + se.name + "</b> — Cap " + G.ch.n + "<br><span style='color:#9a9ab0'>" + G.ch.title + "</span>";
  const w = ITEMS[p.weapons[p.wi]];
  const allyNames = G.allies.map((a) => a.char.name.split(" ")[0]).join(", ");
  $("#weaponInfo").textContent = "ARMA: " + w.name + " (Q)";
  $("#scoreInfo").innerHTML = "PONTOS: " + p.score + (allyNames ? "<br><span style='color:#81c784'>EQUIPE: " + allyNames + "</span>" : "");
  const alive = G.enemies.length + G.spawnQueue.length;
  $("#objective").textContent = "OBJETIVO: derrote todos os monstros (" + alive + " restantes)";
}

function addFloats(x, y, txt, color) {
  G.floats.push({ x: x, y: y, t: txt, c: color || "#fff", life: 0.9 });
}

function burst(x, y, color, n) {
  for (let i = 0; i < (n || 12); i++) {
    const a = rnd(0, Math.PI * 2);
    const sp = rnd(1, 6);
    G.particles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rnd(0.3, 0.7), c: color, r: rnd(2, 5) });
  }
}

/* ============ CONTROLES ============ */

const KEYMAP = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" };

window.addEventListener("keydown", (e) => {
  if (G.state !== "playing") return;
  if (KEYMAP[e.code]) {
    G.keys[KEYMAP[e.code]] = true;
    e.preventDefault();
  }
  if (e.code === "Space") {
    doAttack();
    e.preventDefault();
  }
  if (e.code === "KeyE") startCharge();
  if (e.code === "KeyQ") swapWeapon();
  if (e.code === "Escape" || e.code === "KeyP") togglePause();
});

window.addEventListener("keyup", (e) => {
  if (G.state !== "playing") return;
  if (KEYMAP[e.code]) G.keys[KEYMAP[e.code]] = false;
  if (e.code === "KeyE") releaseCharge();
});

function bindHold(el, on, off) {
  const start = (e) => {
    e.preventDefault();
    el.classList.add("active");
    on();
  };
  const end = (e) => {
    e.preventDefault();
    el.classList.remove("active");
    off();
  };
  el.addEventListener("mousedown", start);
  el.addEventListener("touchstart", start, { passive: false });
  el.addEventListener("mouseup", end);
  el.addEventListener("mouseleave", end);
  el.addEventListener("touchend", end);
  el.addEventListener("touchcancel", end);
}

$$(".dbtn").forEach((b) => {
  const d = b.dataset.dir;
  bindHold(b, () => (G.keys[d] = true), () => (G.keys[d] = false));
});

bindHold($("#btnAttack"), doAttack, () => {});
bindHold($("#btnPower"), startCharge, releaseCharge);

$("#btnSwap").onclick = swapWeapon;
$("#btnPause").onclick = togglePause;
$("#btnResume").onclick = togglePause;
$("#btnRestart").onclick = () => startChapter(G.chIdx);
$("#btnQuit").onclick = () => {
  G.state = "menu";
  G.paused = false;
  stopMusic();
  showScreen("menu");
};

function aimAngle() {
  const p = G.player;
  const ax = (G.keys.right ? 1 : 0) - (G.keys.left ? 1 : 0);
  const ay = (G.keys.down ? 1 : 0) - (G.keys.up ? 1 : 0);
  if (!ax && !ay) return p.face;
  return Math.atan2(ay, ax);
}

function doAttack() {
  const p = G.player;
  if (!p || p.atkCd > 0 || G.paused || G.ended) return;
  const w = ITEMS[p.weapons[p.wi]];
  if (!w || !w.damage) return;
  p.atkCd = w.cooldown;
  p.atkT = 0.22;
  p.hitDone = false;
  p.face = aimAngle();
  sfx.swing();
}

function startCharge() {
  const p = G.player;
  if (!p || G.paused || G.ended) return;
  p.charging = true;
  p.charge = 0;
}

function releaseCharge() {
  const p = G.player;
  if (!p || !p.charging) return;
  p.charging = false;
  if (p.charge < 0.3) tkBlast();
  else tkThrow();
  p.charge = 0;
  p.grabbed = [];
}

function swapWeapon() {
  const p = G.player;
  if (!p) return;
  p.wi = (p.wi + 1) % p.weapons.length;
  updateHud();
}

function togglePause() {
  if (G.state !== "playing" || G.ended) return;
  G.paused = !G.paused;
  $("#pauseMenu").classList.toggle("hidden", !G.paused);
}

function tkBlast() {
  const p = G.player;
  if (p.power < 12) return;
  p.power -= 12;
  G.shake = 10;
  sfx.power();
  G.particles.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.35, c: "#ba68c8", r: 130, ring: true });
  G.enemies.forEach((e) => {
    if (e.dead) return;
    if (dist(p, e) < 130) {
      const a = ang(p, e);
      damageEnemy(e, 26, a);
      e.vx += Math.cos(a) * 7;
      e.vy += Math.sin(a) * 7;
    }
  });
}

function tkThrow() {
  const p = G.player;
  if (p.power < 8) return;
  p.power -= 8;
  const a = aimAngle();
  G.shake = 8;
  sfx.power();
  p.grabbed.forEach((e) => {
    if (e.dead) return;
    e.lifted = 0;
    e.vx = Math.cos(a) * 14;
    e.vy = Math.sin(a) * 14;
    e.knock = 0.55;
    damageEnemy(e, 45 + p.power * 0.4, a);
  });
  G.particles.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.3, c: "#e1bee7", r: 70, ring: true });
}

function damageEnemy(e, dmg, fromAng) {
  if (e.dead) return;
  e.hp -= dmg;
  e.hurt = 0.35;
  e.vx += Math.cos(fromAng || 0) * 2.2;
  e.vy += Math.sin(fromAng || 0) * 2.2;
  addFloats(e.x, e.y - e.size, "-" + Math.round(dmg), "#ff5252");
  burst(e.x, e.y, e.color, 8);
  sfx.hit();
  if (e.hp <= 0) {
    e.dead = true;
    G.player.score += e.xp;
    burst(e.x, e.y, e.color, 26);
    G.shake = Math.max(G.shake, e.boss ? 18 : 6);
    sfx.die();
    const r = Math.random();
    if (r < 0.28) G.pickups.push({ x: e.x, y: e.y, t: "hp", life: 15 });
    else if (r < 0.4) G.pickups.push({ x: e.x, y: e.y, t: "power", life: 15 });
  }
}

function hurtPlayer(dmg, a) {
  const p = G.player;
  if (p.inv > 0 || G.ended) return;
  p.hp -= dmg;
  p.inv = 0.7;
  p.hurt = 0.5;
  p.vx = Math.cos(a) * 6;
  p.vy = Math.sin(a) * 6;
  G.shake = Math.max(G.shake, 8);
  sfx.hurt();
  addFloats(p.x, p.y - 34, "-" + Math.round(dmg), "#ff1744");
  if (p.hp <= 0) {
    p.hp = 0;
    gameOver();
  }
}

/* ============ LOOP ============ */

function update(dt) {
  if (G.paused || G.ended || G.state !== "playing") return;
  const p = G.player;
  G.time += dt;

  if (G.msgTimer > 0) {
    G.msgTimer -= dt;
    if (G.msgTimer <= 0) $("#message").classList.add("hidden");
  }

  if (p.atkCd > 0) p.atkCd -= dt;
  if (p.atkT > 0) p.atkT -= dt;
  if (p.inv > 0) p.inv -= dt;
  if (p.hurt > 0) p.hurt -= dt;

  const ax = (G.keys.right ? 1 : 0) - (G.keys.left ? 1 : 0);
  const ay = (G.keys.down ? 1 : 0) - (G.keys.up ? 1 : 0);
  if (ax || ay) {
    p.face = Math.atan2(ay, ax);
    const sp = 3.4 * (1 + (G.ch.s - 1) * 0.06);
    p.x += ax * sp * dt * 60;
    p.y += ay * sp * dt * 60;
  }
  p.x = clamp(p.x, 30, WORLD_W - 30);
  p.y = clamp(p.y, 30, WORLD_H - 30);

  if (p.charging) {
    p.charge += dt;
    if (p.charge > 0.3 && p.power > 0) {
      p.power = Math.max(0, p.power - 16 * dt);
      G.enemies.forEach((e) => {
        if (e.dead || e.boss || e.lifted) return;
        if (dist(p, e) < 150) {
          e.lifted = 1;
          const a = ang(e, p);
          e.x += Math.cos(a) * 7;
          e.y += Math.sin(a) * 7;
          if (p.grabbed.indexOf(e) === -1) p.grabbed.push(e);
        }
      });
      if (Math.random() < 0.4) G.particles.push({ x: p.x + rnd(-20, 20), y: p.y + rnd(-20, 20), vx: 0, vy: -1, life: 0.5, c: "#ba68c8", r: rnd(2, 4) });
    }
  }
  p.power = Math.min(p.maxPower, p.power + 7 * dt);
  p.hp = Math.min(p.maxHp, p.hp + 0.7 * dt);

  if (p.atkT > 0 && !p.hitDone) {
    const w = ITEMS[p.weapons[p.wi]];
    if (w.damage) {
      let hit = false;
      G.enemies.forEach((e) => {
        if (e.dead) return;
        if (dist(p, e) < w.range + e.size * 0.5) {
          const a = ang(p, e);
          const diff = Math.abs(((a - p.face + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
          if (diff < 1.25) {
            damageEnemy(e, w.damage * (1 + (G.ch.s - 1) * 0.12), a);
            hit = true;
          }
        }
      });
      if (hit) {
        p.hitDone = true;
        G.shake = Math.max(G.shake, 5);
      }
    }
  }

  G.allies.forEach((al) => updateAlly(al, dt));

  G.spawnTimer += dt;
  if (G.spawnQueue.length && G.spawnTimer > G.spawnQueue[0].at) {
    const s = G.spawnQueue.shift();
    G.enemies.push(makeEnemy(s.kind, clamp(s.x, 60, WORLD_W - 60), clamp(s.y, 60, WORLD_H - 60)));
    G.spawnTimer = 0;
  }

  G.enemies.forEach((e) => {
    if (e.dead) return;
    if (e.hurt > 0) e.hurt -= dt;
    if (e.knock > 0) e.knock -= dt;
    if (e.atkCd > 0) e.atkCd -= dt;

    e.x += e.vx;
    e.y += e.vy;
    e.vx *= 0.9;
    e.vy *= 0.9;

    if (e.knock <= 0 && !e.lifted) {
      const a = ang(e, p);
      const d = dist(e, p);
      const stop = e.boss ? e.size * 1.1 : e.size * 0.75;
      if (d > stop) {
        e.x += Math.cos(a) * e.speed * dt * 60;
        e.y += Math.sin(a) * e.speed * dt * 60;
      }
      if (d < stop + e.size + 26 && e.atkCd <= 0) {
        e.atkCd = e.boss ? 1.1 : 1.6;
        hurtPlayer(e.damage, a);
      }
      if (e.boss && d < 340 && e.atkCd <= 0) {
        e.atkCd = 2.4;
        G.particles.push({ x: e.x, y: e.y, vx: 0, vy: 0, life: 0.4, c: "#ff5252", r: 90, ring: true });
        G.enemies.forEach((o) => {
          if (!o.dead && o !== e && dist(e, o) < 190) damageEnemy(o, 25, ang(e, o));
        });
        G.shake = 12;
      }
    }

    e.x = clamp(e.x, 20, WORLD_W - 20);
    e.y = clamp(e.y, 20, WORLD_H - 20);
  });

  G.enemies = G.enemies.filter((e) => !e.dead);

  const boss = G.enemies.find((e) => e.boss);
  if (boss) {
    $("#enemyBarWrap").classList.remove("hidden");
    $("#enemyName").textContent = boss.name.toUpperCase();
    $("#enemyBar").style.width = clamp((boss.hp / boss.maxHp) * 100, 0, 100) + "%";
  } else {
    $("#enemyBarWrap").classList.add("hidden");
  }

  G.particles.forEach((q) => {
    if (q.ring) return;
    q.x += q.vx;
    q.y += q.vy;
    q.life -= dt;
  });
  G.particles = G.particles.filter((q) => q.life > 0);

  G.floats.forEach((f) => {
    f.y -= dt * 34;
    f.life -= dt;
  });
  G.floats = G.floats.filter((f) => f.life > 0);

  G.pickups.forEach((k) => {
    k.life -= dt;
    if (dist(k, p) < 34) {
      if (k.t === "hp") p.hp = Math.min(p.maxHp, p.hp + 22);
      else p.power = Math.min(p.maxPower, p.power + 45);
      k.life = 0;
      addFloats(p.x, p.y - 34, k.t === "hp" ? "+VIDA" : "+TELECINESE", "#81c784");
    }
  });
  G.pickups = G.pickups.filter((k) => k.life > 0);

  if (G.shake > 0) G.shake -= dt * 40;

  G.cam.x += (clamp(p.x - W / 2, 0, WORLD_W - W) - G.cam.x) * Math.min(1, dt * 8);
  G.cam.y += (clamp(p.y - H / 2, 0, WORLD_H - H) - G.cam.y) * Math.min(1, dt * 8);

  updateHud();

  if (!G.ended && !G.enemies.length && !G.spawnQueue.length) chapterComplete();
}

function updateAlly(al, dt) {
  const p = G.player;
  if (al.atkCd > 0) al.atkCd -= dt;
  if (al.atkT > 0) al.atkT -= dt;

  let target = null;
  let best = 190;
  G.enemies.forEach((e) => {
    if (e.dead) return;
    const d = dist(al, e);
    if (d < best) {
      best = d;
      target = e;
    }
  });

  let tx;
  let ty;
  if (target) {
    tx = target.x;
    ty = target.y;
  } else {
    const a = (G.time * 0.6 + al.x) % (Math.PI * 2);
    tx = p.x + Math.cos(a) * 70;
    ty = p.y + Math.sin(a) * 70;
  }

  const d = dist(al, { x: tx, y: ty });
  if (d > 40) {
    const a = ang(al, { x: tx, y: ty });
    const sp = CHARACTERS[al.id].speed * dt * 60;
    al.x += Math.cos(a) * sp;
    al.y += Math.sin(a) * sp;
    al.walk += dt * 9;
  }
  al.face = ang(al, target || p);
  al.x = clamp(al.x, 20, WORLD_W - 20);
  al.y = clamp(al.y, 20, WORLD_H - 20);

  if (target && d < 70 && al.atkCd <= 0) {
    al.atkCd = 0.75;
    al.atkT = 0.18;
    const dmg = 9 + (G.ch.s - 1) * 3;
    damageEnemy(target, dmg, ang(al, target));
  }
}

function draw() {
  if (G.state !== "playing" || !G.player) return;
  const p = G.player;
  const loc = G.loc;

  ctx.save();
  if (G.shake > 0) ctx.translate(rnd(-G.shake, G.shake) * 0.4, rnd(-G.shake, G.shake) * 0.4);

  ctx.fillStyle = loc.sky;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  ctx.save();
  ctx.translate(-G.cam.x, -G.cam.y);

  ctx.fillStyle = loc.ground;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  ctx.strokeStyle = "rgba(0,0,0,0.16)";
  ctx.lineWidth = 2;
  for (let gx = 0; gx <= WORLD_W; gx += 100) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, WORLD_H);
    ctx.stroke();
  }
  for (let gy = 0; gy <= WORLD_H; gy += 100) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(WORLD_W, gy);
    ctx.stroke();
  }

  G.decor.forEach((d) => {
    if (d.x < G.cam.x - 80 || d.x > G.cam.x + W + 80 || d.y < G.cam.y - 80 || d.y > G.cam.y + H + 80) return;
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (G.ch.loc === "mundoInvertido" || G.ch.loc === "abismo") {
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    for (let i = 0; i < 45; i++) {
      const vx = (i * 311) % WORLD_W;
      const vy = (i * 577) % WORLD_H;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx + 18, vy + 90);
      ctx.lineTo(vx - 10, vy + 150);
      ctx.closePath();
      ctx.fill();
    }
  }

  G.pickups.forEach((k) => {
    const bob = Math.sin(G.time * 4 + k.x) * 4;
    ctx.fillStyle = k.t === "hp" ? "#4caf50" : "#ba68c8";
    ctx.beginPath();
    ctx.arc(k.x, k.y + bob, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(k.t === "hp" ? "+" : "P", k.x, k.y + bob + 4);
  });

  const items = [];
  G.enemies.forEach((e) => items.push({ y: e.y, f: () => drawMonster(e, e.x, e.y, 1, e.hurt, G.time) }));
  G.allies.forEach((al) =>
    items.push({
      y: al.y,
      f: () => {
        drawHuman(al.char, al.x, al.y, p.size * 0.95, al.face, { atk: al.atkT > 0 ? 1 : 0, bob: Math.sin(al.walk) * 0.5 });
        ctx.fillStyle = "#81c784";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(al.char.name.split(" ")[0], al.x, al.y - 44);
      }
    })
  );
  items.push({
    y: p.y,
    f: () => {
      if (p.inv > 0 && Math.floor(G.time * 20) % 2 === 0) ctx.globalAlpha = 0.5;
      if (p.charging) {
        ctx.strokeStyle = "rgba(186,104,200," + (0.4 + 0.4 * Math.sin(G.time * 18)) + ")";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 150, 0, Math.PI * 2);
        ctx.stroke();
      }
      drawHuman(PLAYER_CHAR, p.x, p.y, p.size, p.face, { atk: p.atkT > 0 ? 1 : 0, hurt: p.hurt, bob: Math.sin(G.time * 8) * 0.5 });
      ctx.globalAlpha = 1;
      const w = ITEMS[p.weapons[p.wi]];
      if (w.damage && p.atkT > 0) {
        ctx.strokeStyle = w === ITEMS.machete || w === ITEMS.espada || w === ITEMS.punhal ? "#eceff1" : "#8d6e63";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, w.range * 0.72, p.face - 0.9, p.face + 0.9);
        ctx.stroke();
      }
      ctx.fillStyle = "#ba68c8";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("ELEVEN", p.x, p.y - 44 * p.size);
    }
  });
  items.sort((a, b) => a.y - b.y).forEach((i) => i.f());

  G.particles.forEach((q) => {
    ctx.globalAlpha = clamp(q.life, 0, 1);
    ctx.fillStyle = q.c;
    if (q.ring) {
      ctx.strokeStyle = q.c;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r * (1 - q.life) * 2.2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;

  G.floats.forEach((f) => {
    ctx.globalAlpha = clamp(f.life, 0, 1);
    ctx.fillStyle = f.c;
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(f.t, f.x, f.y);
  });
  ctx.globalAlpha = 1;

  ctx.restore();
  ctx.restore();

  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

let last = 0;
function loop(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000 || 0);
  last = ts;
  if (G.state === "playing") {
    update(dt);
    draw();
  }
  requestAnimationFrame(loop);
}

/* ============ FIM DE CAPÍTULO ============ */

function endOverlay(title, msg, buttons) {
  const o = document.createElement("div");
  o.className = "overlay";
  o.id = "endOverlay";
  const p = document.createElement("div");
  p.className = "panel";
  p.innerHTML = "<h2>" + title + '</h2><p style="color:#9a9ab0;font-size:13px;line-height:1.6;margin-bottom:10px">' + msg + "</p>";
  buttons.forEach((b) => {
    const btn = document.createElement("button");
    btn.className = "btn " + (b.primary ? "btn-primary" : "");
    btn.textContent = b.label;
    btn.onclick = b.fn;
    p.appendChild(btn);
  });
  o.appendChild(p);
  $("#game").appendChild(o);
}

function clearOverlay() {
  const o = $("#endOverlay");
  if (o) o.remove();
}

function chapterComplete() {
  if (G.ended) return;
  G.ended = true;
  stopMusic();
  sfx.win();
  const num = G.chIdx + 1;
  if (!G.done.includes(num)) G.done.push(num);
  if (G.unlocked < num + 1) G.unlocked = Math.min(CHAPTERS.length, num + 1);
  saveProgress();

  const hasNext = G.chIdx + 1 < CHAPTERS.length;
  const se = SEASONS[G.ch.s];
  const btns = [];
  if (hasNext) btns.push({ label: "PRÓXIMO CAPÍTULO", primary: true, fn: () => startChapter(G.chIdx + 1) });
  btns.push({ label: "REPETIR", fn: () => startChapter(G.chIdx) });
  btns.push({ label: "SELECIONAR CAPÍTULO", fn: () => { G.state = "menu"; buildChapterSelect(); showScreen("chapterSelect"); } });
  endOverlay("CAPÍTULO " + G.ch.n + " CONCLUÍDO", "VITÓRIA! " + G.player.score + " pontos. " + se.name + " (" + se.subtitle + ") concluída.", btns);
}

function gameOver() {
  if (G.ended) return;
  G.ended = true;
  stopMusic();
  endOverlay("VOCÊ CAIU", "Os monstros venceram esta batalha. Tente de novo, Eleven.", [
    { label: "TENTAR DE NOVO", primary: true, fn: () => startChapter(G.chIdx) },
    { label: "SELECIONAR CAPÍTULO", fn: () => { G.state = "menu"; buildChapterSelect(); showScreen("chapterSelect"); } }
  ]);
}

/* ============ INICIALIZAÇÃO ============ */

$("#btnPlay").onclick = () => startChapter(clamp(G.unlocked - 1, 0, CHAPTERS.length - 1));
$("#btnChapters").onclick = () => { buildChapterSelect(); showScreen("chapterSelect"); };
$("#btnCharacters").onclick = () => { buildGallery(); showScreen("characters"); };
$("#btnMonsters").onclick = () => { buildGallery(); showScreen("monsters"); };
$("#btnItems").onclick = () => { buildGallery(); showScreen("items"); };
$$("[data-back]").forEach((b) => (b.onclick = () => showScreen("menu")));

loadProgress();
showScreen("menu");
requestAnimationFrame(loop);

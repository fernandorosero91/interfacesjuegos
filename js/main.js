// ============================================================
// AUDIO ENGINE (UI sounds only — no background music)
// ============================================================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playTone(freq, type, duration, vol=0.18) {
  try {
    const ac = getAudio();
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type; o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    o.start(); o.stop(ac.currentTime + duration);
  } catch(e) {}
}

function sfxClick()    { playTone(880,'square',0.08,0.15); setTimeout(()=>playTone(1100,'square',0.06,0.1),60); }
function sfxStart()    { [261,329,392,523].forEach((f,i)=>setTimeout(()=>playTone(f,'sawtooth',0.18,0.22),i*80)); }
function sfxWin()      { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,'square',0.22,0.25),i*90)); }
function sfxAccordion(){ playTone(660,'sine',0.12,0.18); setTimeout(()=>playTone(880,'sine',0.1,0.12),80); }
function sfxExpo()     { [392,494,587].forEach((f,i)=>setTimeout(()=>playTone(f,'triangle',0.15,0.2),i*70)); }
function sfxVictory()  { [523,659,784,1047,1319,1568].forEach((f,i)=>setTimeout(()=>playTone(f,'square',0.3,0.3),i*80)); }
function sfxMap()      { playTone(440,'sine',0.1,0.12); }

// ============================================================
// CLOCK TICK (suena solo en los últimos 15 segundos)
// ============================================================
let _clockTickInterval = null;

function startClockTicks() {
  stopClockTicks();
  _clockTickInterval = setInterval(() => {
    try {
      const ac = getAudio();
      // Tick: golpe corto de metal, tipo reloj de arena urgente
      const o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.type = 'square';
      o.frequency.setValueAtTime(1200, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.06);
      g.gain.setValueAtTime(0.22, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.12);
      o.start(); o.stop(ac.currentTime + 0.15);
      // Eco suave del tick
      setTimeout(() => {
        try {
          const o2 = ac.createOscillator(), g2 = ac.createGain();
          o2.connect(g2); g2.connect(ac.destination);
          o2.type = 'sine';
          o2.frequency.setValueAtTime(900, ac.currentTime);
          g2.gain.setValueAtTime(0.08, ac.currentTime);
          g2.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.08);
          o2.start(); o2.stop(ac.currentTime + 0.1);
        } catch(e) {}
      }, 80);
    } catch(e) {}
  }, 1000);
}

function stopClockTicks() {
  if (_clockTickInterval) { clearInterval(_clockTickInterval); _clockTickInterval = null; }
}

// ============================================================
// CONFETTI
// ============================================================
let confettiPieces = [];
let confettiCanvas = null;
let confettiCtx = null;
let confettiAnim = null;

function launchConfetti() {
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;';
    document.body.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext('2d');
  }
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiPieces = [];
  const colors = ['#00ffff','#ff00ff','#ffd700','#00ff88','#ff6600','#ff4488','#88ff00'];
  for (let i = 0; i < 180; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random()-0.5)*5, vy: 2+Math.random()*5,
      w: 8+Math.random()*12, h: 5+Math.random()*8,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*Math.PI*2, rv: (Math.random()-0.5)*0.2, life: 1
    });
  }
  if (confettiAnim) cancelAnimationFrame(confettiAnim);
  function loop() {
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    confettiPieces = confettiPieces.filter(p => {
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.rv; p.vy+=0.12;
      confettiCtx.save();
      confettiCtx.translate(p.x,p.y); confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle=p.color; confettiCtx.globalAlpha=p.life;
      confettiCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      confettiCtx.restore();
      if (p.y > confettiCanvas.height+20) p.life -= 0.05;
      return p.life > 0;
    });
    if (confettiPieces.length > 0) confettiAnim = requestAnimationFrame(loop);
    else confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  }
  loop();
}

// ============================================================
// SCORE
// ============================================================
let sessionScore = 0;
let sessionStartTime = null;
function calcScore() {
  const elapsed = sessionStartTime ? Math.floor((Date.now()-sessionStartTime)/1000) : 0;
  return 5000 + Math.max(0, 600 - elapsed) * 2;
}

// ============================================================
// STATE
// ============================================================
let completedModules = new Set();
let currentModuleIdx = 0;
let clockInterval = null;
let clockStart = null;
let countdownInterval = null;
let countdownSeconds = 180;
const COUNTDOWN_TOTAL = 180;

// ============================================================
// NAVIGATION
// ============================================================
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function restartAll() {
  sfxClick();
  stopClockTicks();
  completedModules.clear();
  currentModuleIdx = 0;
  sessionScore = 0;
  sessionStartTime = Date.now();
  if (countdownInterval) clearInterval(countdownInterval);
  if (clockInterval) clearInterval(clockInterval);
  renderMap();
  goTo('s-map');
}

// ============================================================
// BOOT
// ============================================================
const bootLines = [
  '> Inicializando GAME UI EXPO v2.0...',
  '> Cargando módulos de diseño [■■■■■■■■] OK',
  '> Motor de juegos Canvas API... OK',
  '> 5 escenarios detectados',
  '> Sistema listo. ¡Que empiece el juego!'
];

function runBoot() {
  const terminal = document.getElementById('boot-terminal');
  const btn = document.getElementById('btn-boot-start');
  terminal.textContent = '';
  let lineIdx = 0;
  function nextLine() {
    if (lineIdx >= bootLines.length) { setTimeout(() => btn.classList.remove('hidden'), 300); return; }
    const line = bootLines[lineIdx++];
    let charIdx = 0;
    const cur = document.createElement('span'); cur.style.display = 'block';
    terminal.appendChild(cur);
    const t = setInterval(() => {
      if (charIdx >= line.length) { clearInterval(t); setTimeout(nextLine, 200); return; }
      cur.textContent += line[charIdx++];
    }, 28);
  }
  nextLine();
}

document.getElementById('btn-boot-start').addEventListener('click', () => {
  try { getAudio().resume(); } catch(e) {}
  sfxStart();
  sessionStartTime = Date.now();
  startClock();
  renderMap();
  goTo('s-map');
});

// ============================================================
// MAP CLOCK
// ============================================================
function startClock() {
  clockStart = Date.now();
  clockInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - clockStart) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2,'0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2,'0');
    const s = String(elapsed % 60).padStart(2,'0');
    const el = document.getElementById('map-clock');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ============================================================
// MAP RENDER
// ============================================================
function renderMap() {
  const container = document.getElementById('level-map');
  container.innerHTML = '';
  MODULES.forEach((mod, i) => {
    const node = document.createElement('div');
    node.className = 'level-node';
    const isCompleted = completedModules.has(i);
    const isAvailable = i === 0 || completedModules.has(i - 1);
    if (isCompleted) node.classList.add('completed');
    else if (isAvailable) { node.classList.add('available'); node.classList.add('active-pulse'); }
    else node.classList.add('locked');
    node.style.borderColor = isCompleted ? 'var(--green)' : (isAvailable ? mod.color : '#1a2a3a');
    node.innerHTML = `
      <div class="node-icon">${mod.icon}</div>
      <div class="node-num">MÓDULO 0${i + 1}</div>
      <div class="node-name" style="color:${isCompleted ? 'var(--green)' : isAvailable ? mod.color : '#1a2a3a'}">${mod.scenarioName}</div>
      <div class="node-member" style="color:${isCompleted ? 'var(--green)' : isAvailable ? mod.color : '#1a2a3a'}">${mod.member}</div>
    `;
    if (isAvailable && !isCompleted) {
      node.addEventListener('click', () => { sfxClick(); startGame(i); });
    } else if (isCompleted) {
      node.addEventListener('click', () => { sfxMap(); openExpo(i); });
    }
    container.appendChild(node);
  });
  const done = completedModules.size;
  document.getElementById('map-prog-txt').textContent = `${done} / 5`;
  document.getElementById('map-prog-fill').style.width = `${(done / 5) * 100}%`;
}

// ============================================================
// GAME ENGINE
// ============================================================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let gameState = null;
let animFrame = null;
let keys = {};

function resizeCanvas() {
  const avail = { w: window.innerWidth, h: window.innerHeight - 50 };
  canvas.width = Math.min(800, avail.w);
  canvas.height = Math.min(600, avail.h);
}
window.addEventListener('resize', () => { resizeCanvas(); if (gameState) gameState.resize && gameState.resize(); });

window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

['mob-up','mob-down','mob-left','mob-right','mob-action'].forEach(id => {
  const el = document.getElementById(id);
  const code = {'mob-up':'ArrowUp','mob-down':'ArrowDown','mob-left':'ArrowLeft','mob-right':'ArrowRight','mob-action':'Space'}[id];
  el.addEventListener('touchstart', e => { e.preventDefault(); keys[code] = true; }, {passive:false});
  el.addEventListener('touchend', e => { e.preventDefault(); keys[code] = false; }, {passive:false});
  el.addEventListener('mousedown', () => keys[code] = true);
  el.addEventListener('mouseup', () => keys[code] = false);
});

document.getElementById('btn-game-back').addEventListener('click', () => { sfxClick(); stopGame(); goTo('s-map'); });

function startGame(modIdx) {
  currentModuleIdx = modIdx;
  const mod = MODULES[modIdx];
  document.getElementById('game-instructions').textContent = mod.gameInstructions;
  document.getElementById('game-objective').textContent = mod.gameObjective;
  showGameMember(mod);
  resizeCanvas();
  goTo('s-game');
  stopGame();
  keys = {};
  // Ensure AudioContext is active for game sounds
  try { getAudio().resume(); if (window._gameAC) window._gameAC.resume(); } catch(e) {}
  switch (mod.game) {
    case 'collector':  gameState = new CollectorGame(mod); break;
    case 'maze':       gameState = new MazeGame(mod); break;
    case 'shooter':    gameState = new ShooterGame(mod); break;
    case 'platformer': gameState = new PlatformerGame(mod); break;
    case 'runner':     gameState = new RunnerGame(mod); break;
  }
  function loop() {
    gameState.update();
    gameState.draw(ctx);
    if (gameState.won) {
      sfxWin();
      setTimeout(() => {
        stopGame();
        completedModules.add(modIdx);
        renderMap();
        openExpo(modIdx);
      }, 900);
      return;
    }
    animFrame = requestAnimationFrame(loop);
  }
  animFrame = requestAnimationFrame(loop);
}

function showGameMember(mod) {
  let el = document.getElementById('game-member-badge');
  if (!el) {
    el = document.createElement('div');
    el.id = 'game-member-badge';
    document.getElementById('s-game').appendChild(el);
  }
  el.innerHTML = `<span class="gm-icon">${mod.icon}</span><span class="gm-name">${mod.member}</span><span class="gm-tag">${mod.modTag}</span>`;
  el.style.borderColor = mod.color;
  el.style.color = mod.color;
  el.style.boxShadow = `0 0 20px ${mod.color}55`;
}

function stopGame() {
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  gameState = null;
}

// ============================================================
// EXPO RENDERER
// ============================================================
function openExpo(modIdx) {
  sfxExpo();
  const mod = MODULES[modIdx];
  const c = mod.color;
  const hexToRgb = hex => {
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  };
  const rgb = hexToRgb(c);

  document.getElementById('expo-icon').textContent = mod.icon;
  document.getElementById('expo-mod-tag').textContent = mod.modTag;
  document.getElementById('expo-title').textContent = mod.title;
  document.getElementById('expo-scenario-name').textContent = `ESCENARIO: ${mod.scenarioName}`;
  document.getElementById('expo-question').textContent = `❓ ${mod.question}`;

  let mb = document.getElementById('expo-member-badge');
  if (!mb) {
    mb = document.createElement('div');
    mb.id = 'expo-member-badge';
    document.getElementById('expo-mod-tag').parentNode.insertBefore(mb, document.getElementById('expo-mod-tag'));
  }
  mb.innerHTML = `🎮 <span style="color:${c};font-family:'Press Start 2P',monospace;font-size:0.65rem;">${mod.member}</span>`;
  mb.style.cssText = `display:inline-flex;align-items:center;gap:6px;background:rgba(${rgb},.15);border:1px solid rgba(${rgb},.4);border-radius:4px;padding:3px 10px;margin-bottom:6px;font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:#fff;`;

  const expoHeaderCard = document.querySelector('.expo-header-card');
  expoHeaderCard.style.borderColor = `rgba(${rgb},.3)`;
  expoHeaderCard.style.boxShadow = `0 4px 40px rgba(0,0,0,.6), 0 0 30px rgba(${rgb},.25), inset 0 1px 0 rgba(255,255,255,.05)`;

  const sectionTag = document.querySelector('.section-tag');
  sectionTag.style.color = c;
  sectionTag.style.background = `rgba(${rgb},.1)`;
  sectionTag.style.borderColor = `rgba(${rgb},.3)`;

  const expoTitle = document.getElementById('expo-title');
  expoTitle.style.textShadow = `0 0 20px rgba(${rgb},.6), 0 0 40px rgba(${rgb},.3)`;
  expoTitle.style.color = c;

  const questionHighlight = document.querySelector('.question-highlight');
  questionHighlight.style.background = `linear-gradient(135deg, rgba(${rgb},.15), rgba(${rgb},.06))`;
  questionHighlight.style.borderColor = `rgba(${rgb},.3)`;
  questionHighlight.style.borderLeftColor = c;
  questionHighlight.style.color = c;

  document.querySelector('.expo-bg').style.background = `radial-gradient(ellipse at 20% 50%, rgba(${rgb},.18) 0%, #020610 60%)`;
  document.getElementById('cd-bar-fill').style.background = `linear-gradient(90deg, ${c}, #ffd700)`;

  const container = document.getElementById('expo-content');
  container.innerHTML = '';
  mod.content.forEach((block, bi) => {
    const card = document.createElement('div');
    card.className = 'expo-card';
    card.style.animationDelay = `${bi * 0.12}s`;
    card.style.borderColor = `rgba(${rgb},.25)`;
    card.style.boxShadow = `0 0 15px rgba(${rgb},.1)`;
    let html = '';
    if (block.title && block.type !== 'accordion') {
      html += `<h3 style="color:${c}; border-bottom-color:rgba(${rgb},.2)">${block.title}</h3>`;
    }
    switch (block.type) {
      case 'intro':
        html += `<p>${block.text}</p>`;
        break;
      case 'accordion':
        html += `<div class="accordion-wrap">
          <button class="accordion-btn" style="border-color:rgba(${rgb},.4);color:${c};background:rgba(${rgb},.08);" onclick="toggleAccordion(this,'${rgb}','${c}')">
            <span>${block.title}</span>
            <span class="acc-arrow">▼</span>
          </button>
          <div class="accordion-body" style="border-color:rgba(${rgb},.2);">
            <ul>${block.items.map(it => `<li style="background:rgba(${rgb},.06);border-color:rgba(${rgb},.15)"><span style="color:${c};flex-shrink:0">▸</span>${it}</li>`).join('')}</ul>
          </div>
        </div>`;
        break;
      case 'rules2col':
        html += `<div class="rules-grid">${block.items.map(it => `<div class="rule-chip" style="border-color:rgba(${rgb},.3);background:rgba(${rgb},.07);color:${c};"><span class="rule-dot" style="background:${c};box-shadow:0 0 6px ${c};"></span>${it}</div>`).join('')}</div>`;
        break;
      case 'highlight':
        html += `<div class="highlight-box" style="border-color:rgba(${rgb},.3);background:linear-gradient(135deg,rgba(${rgb},.12),rgba(${rgb},.05));color:${c};">${block.text}</div>`;
        break;
    }
    card.innerHTML = html;
    container.appendChild(card);
  });

  startCountdown(modIdx);
  goTo('s-expo');
}

function toggleAccordion(btn, rgb, c) {
  sfxAccordion();
  const body = btn.nextElementSibling;
  const arrow = btn.querySelector('.acc-arrow');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
}

// ============================================================
// COUNTDOWN — reloj suena en últimos 15 segundos
// ============================================================
function startCountdown(modIdx) {
  if (countdownInterval) clearInterval(countdownInterval);
  stopClockTicks(); // Detener ticks anteriores si los hay
  countdownSeconds = COUNTDOWN_TOTAL;
  const display = document.getElementById('countdown-display');
  const bar = document.getElementById('cd-bar-fill');
  const isLast = modIdx === MODULES.length - 1;
  document.getElementById('auto-status').style.display = 'none';

  const btnNext = document.getElementById('btn-next-scene');
  btnNext.textContent = isLast ? '🏆 VER RESULTADO FINAL' : 'SIGUIENTE ESCENARIO →';
  btnNext.onclick = () => { sfxClick(); advance(modIdx, isLast); };

  function updateDisplay() {
    const m = String(Math.floor(countdownSeconds / 60)).padStart(2,'0');
    const s = String(countdownSeconds % 60).padStart(2,'0');
    display.textContent = `${m}:${s}`;
    bar.style.width = `${(countdownSeconds / COUNTDOWN_TOTAL) * 100}%`;
    if (countdownSeconds <= 15) {
      display.classList.add('urgent');
      bar.style.background = 'linear-gradient(90deg, #ff4444, #ff8800)';
    } else if (countdownSeconds <= 30) {
      display.classList.add('urgent');
      bar.style.background = 'linear-gradient(90deg, #ff4444, #ff8800)';
    } else {
      display.classList.remove('urgent');
      bar.style.background = 'linear-gradient(90deg, #00ff88, #ffd700)';
    }
  }
  updateDisplay();

  countdownInterval = setInterval(() => {
    countdownSeconds--;
    updateDisplay();

    // 🔊 Activar ticks de reloj al llegar a 15 segundos
    if (countdownSeconds === 15) startClockTicks();

    if (countdownSeconds <= 0) {
      clearInterval(countdownInterval);
      stopClockTicks();
      advance(modIdx, isLast);
    }
  }, 1000);
}

function advance(modIdx, isLast) {
  if (countdownInterval) clearInterval(countdownInterval);
  stopClockTicks();
  const statusBox = document.getElementById('auto-status');
  const statusTxt = document.getElementById('auto-status-txt');
  statusBox.style.display = 'block';
  statusTxt.textContent = isLast ? '🏆 CARGANDO RESULTADO FINAL...' : '⚡ CARGANDO SIGUIENTE ESCENARIO...';
  setTimeout(() => {
    if (isLast) { buildVictory(); goTo('s-victory'); }
    else { renderMap(); goTo('s-map'); setTimeout(() => startGame(modIdx + 1), 400); }
  }, 1200);
}

// ============================================================
// VICTORY
// ============================================================
function buildVictory() {
  sfxVictory();
  launchConfetti();
  const score = calcScore();

  const container = document.getElementById('victory-cards');
  container.innerHTML = '';
  MODULES.forEach((mod, i) => {
    const card = document.createElement('div');
    card.className = 'v-card';
    card.style.animationDelay = `${i * 0.15}s`;
    card.style.borderColor = mod.color;
    card.style.boxShadow = `0 0 15px ${mod.color}44`;
    card.innerHTML = `
      <div class="vc-icon">${mod.icon}</div>
      <div class="vc-num">MÓDULO 0${i+1}</div>
      <div class="vc-title">${mod.scenarioName}</div>
      <div class="vc-member" style="color:${mod.color}">${mod.member}</div>
    `;
    container.appendChild(card);
  });

  let scoreEl = document.getElementById('final-score');
  if (!scoreEl) {
    scoreEl = document.createElement('div');
    scoreEl.id = 'final-score';
    const victoryDiv = document.querySelector('#s-victory > div[style]');
    const btn = victoryDiv.querySelector('.btn-neon');
    victoryDiv.insertBefore(scoreEl, btn);
  }
  scoreEl.innerHTML = `
    <div class="score-wrap">
      <div class="score-label">🏆 PUNTUACIÓN FINAL</div>
      <div class="score-num" id="score-anim">0</div>
      <div class="score-sub">5 / 5 MÓDULOS COMPLETADOS</div>
    </div>
  `;
  let curr = 0;
  const step = Math.ceil(score / 60);
  const t = setInterval(() => {
    curr = Math.min(curr + step, score);
    const el = document.getElementById('score-anim');
    if (el) el.textContent = curr.toLocaleString();
    if (curr >= score) clearInterval(t);
  }, 30);
}

// ============================================================
// INIT
// ============================================================
runBoot();
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

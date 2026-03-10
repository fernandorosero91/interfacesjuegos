// ============================================================
// STATE
// ============================================================
let completedModules = new Set();
let currentModuleIdx = 0;
let clockInterval = null;
let clockStart = null;
let countdownInterval = null;
let countdownSeconds = 180; // 3 min
const COUNTDOWN_TOTAL = 180;

// ============================================================
// NAVIGATION
// ============================================================
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function restartAll() {
  completedModules.clear();
  currentModuleIdx = 0;
  if (countdownInterval) clearInterval(countdownInterval);
  if (clockInterval) clearInterval(clockInterval);
  renderMap();
  goTo('s-map');
}

// ============================================================
// BOOT SEQUENCE
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
    if (lineIdx >= bootLines.length) {
      setTimeout(() => btn.classList.remove('hidden'), 300);
      return;
    }
    const line = bootLines[lineIdx++];
    let charIdx = 0;
    const cur = document.createElement('span');
    cur.style.display = 'block';
    terminal.appendChild(cur);
    const t = setInterval(() => {
      if (charIdx >= line.length) {
        clearInterval(t);
        setTimeout(nextLine, 200);
        return;
      }
      cur.textContent += line[charIdx++];
    }, 28);
  }
  nextLine();
}

document.getElementById('btn-boot-start').addEventListener('click', () => {
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
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    document.getElementById('map-clock').textContent = `${h}:${m}:${s}`;
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
    `;
    if (isAvailable && !isCompleted) {
      node.addEventListener('click', () => startGame(i));
    } else if (isCompleted) {
      node.addEventListener('click', () => openExpo(i));
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

// Key listeners
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// Mobile controls
['mob-up','mob-down','mob-left','mob-right','mob-action'].forEach(id => {
  const el = document.getElementById(id);
  const code = { 'mob-up':'ArrowUp','mob-down':'ArrowDown','mob-left':'ArrowLeft','mob-right':'ArrowRight','mob-action':'Space' }[id];
  el.addEventListener('touchstart', e => { e.preventDefault(); keys[code] = true; }, { passive: false });
  el.addEventListener('touchend', e => { e.preventDefault(); keys[code] = false; }, { passive: false });
  el.addEventListener('mousedown', () => keys[code] = true);
  el.addEventListener('mouseup', () => keys[code] = false);
});

document.getElementById('btn-game-back').addEventListener('click', () => {
  stopGame();
  goTo('s-map');
});

function startGame(modIdx) {
  currentModuleIdx = modIdx;
  const mod = MODULES[modIdx];
  document.getElementById('game-instructions').textContent = mod.gameInstructions;
  document.getElementById('game-objective').textContent = mod.gameObjective;
  resizeCanvas();
  goTo('s-game');
  stopGame();
  keys = {};
  switch (mod.game) {
    case 'collector': gameState = new CollectorGame(mod); break;
    case 'maze':      gameState = new MazeGame(mod); break;
    case 'shooter':   gameState = new ShooterGame(mod); break;
    case 'platformer':gameState = new PlatformerGame(mod); break;
    case 'runner':    gameState = new RunnerGame(mod); break;
  }
  function loop() {
    gameState.update();
    gameState.draw(ctx);
    if (gameState.won) {
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

function stopGame() {
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  gameState = null;
}



// ============================================================
// EXPO RENDERER
// ============================================================
function openExpo(modIdx) {
  const mod = MODULES[modIdx];
  const c = mod.color; // module accent color
  // Helper: convert hex to rgb for rgba() usage
  const hexToRgb = hex => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  };
  const rgb = hexToRgb(c);

  document.getElementById('expo-icon').textContent = mod.icon;
  document.getElementById('expo-mod-tag').textContent = mod.modTag;
  document.getElementById('expo-title').textContent = mod.title;
  document.getElementById('expo-scenario-name').textContent = `ESCENARIO: ${mod.scenarioName}`;
  document.getElementById('expo-question').textContent = `❓ ${mod.question}`;

  // Apply module color to expo UI elements
  const expoHeaderCard = document.querySelector('.expo-header-card');
  expoHeaderCard.style.borderColor = `rgba(${rgb},.3)`;
  expoHeaderCard.style.boxShadow = `0 4px 40px rgba(0,0,0,.6), 0 0 30px rgba(${rgb},.15), inset 0 1px 0 rgba(255,255,255,.05)`;

  const sectionTag = document.querySelector('.section-tag');
  sectionTag.style.color = c;
  sectionTag.style.background = `rgba(${rgb},.1)`;
  sectionTag.style.borderColor = `rgba(${rgb},.3)`;

  const expoTitle = document.getElementById('expo-title');
  expoTitle.style.textShadow = `0 0 20px rgba(${rgb},.4)`;

  const questionHighlight = document.querySelector('.question-highlight');
  questionHighlight.style.background = `linear-gradient(135deg, rgba(${rgb},.1), rgba(${rgb},.05))`;
  questionHighlight.style.borderColor = `rgba(${rgb},.3)`;
  questionHighlight.style.borderLeftColor = c;
  questionHighlight.style.color = c;

  const expoBg = document.querySelector('.expo-bg');
  expoBg.style.background = `radial-gradient(ellipse at 20% 50%, rgba(${rgb},.12) 0%, #020610 60%)`;

  // Countdown bar color
  const cdBarFill = document.getElementById('cd-bar-fill');
  cdBarFill.style.background = `linear-gradient(90deg, ${c}, #ffd700)`;

  // render content
  const container = document.getElementById('expo-content');
  container.innerHTML = '';
  mod.content.forEach((block, bi) => {
    const card = document.createElement('div');
    card.className = 'expo-card';
    card.style.animationDelay = `${bi * 0.12}s`;
    card.style.borderColor = `rgba(${rgb},.18)`;
    let html = '';
    if (block.title) html += `<h3 style="color:${c}; border-bottom-color:rgba(${rgb},.2)">${block.title}</h3>`;
    switch (block.type) {
      case 'intro':
        html += `<p>${block.text}</p>`;
        break;
      case 'list':
        html += `<ul>${block.items.map(it => `<li style="background:rgba(${rgb},.05);border-color:rgba(${rgb},.15)"><span style="color:${c};flex-shrink:0">▸</span>${it}</li>`).join('')}</ul>`;
        break;
      case 'highlight':
        html += `<div class="highlight-box">${block.text}</div>`;
        break;
      case 'examples':
        html += `<div class="example-grid">${block.items.map(it => `
          <div class="example-item">
            <div class="ex-icon">${it.icon}</div>
            <div class="ex-title">${it.title}</div>
            <div class="ex-desc">${it.desc}</div>
          </div>`).join('')}</div>`;
        break;
      case 'tools':
        html += `<div class="tool-grid">${block.items.map(it => `
          <div class="tool-chip">
            <div class="t-icon">${it.icon}</div>
            <div class="t-name">${it.name}</div>
            <div class="t-cat">${it.category}</div>
          </div>`).join('')}</div>`;
        break;
    }
    card.innerHTML = html;
    container.appendChild(card);
  });
  // countdown
  startCountdown(modIdx);
  goTo('s-expo');
}

function startCountdown(modIdx) {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownSeconds = COUNTDOWN_TOTAL;
  const display = document.getElementById('countdown-display');
  const bar = document.getElementById('cd-bar-fill');
  const isLast = modIdx === MODULES.length - 1;
  document.getElementById('auto-status').style.display = 'none';

  // update button label
  const btnNext = document.getElementById('btn-next-scene');
  btnNext.textContent = isLast ? '🏆 VER RESULTADO FINAL' : 'SIGUIENTE ESCENARIO →';
  btnNext.onclick = () => advance(modIdx, isLast);

  function updateDisplay() {
    const m = String(Math.floor(countdownSeconds / 60)).padStart(2, '0');
    const s = String(countdownSeconds % 60).padStart(2, '0');
    display.textContent = `${m}:${s}`;
    bar.style.width = `${(countdownSeconds / COUNTDOWN_TOTAL) * 100}%`;
    if (countdownSeconds <= 30) {
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
    if (countdownSeconds <= 0) {
      clearInterval(countdownInterval);
      advance(modIdx, isLast);
    }
  }, 1000);
}

function advance(modIdx, isLast) {
  if (countdownInterval) clearInterval(countdownInterval);
  const statusBox = document.getElementById('auto-status');
  const statusTxt = document.getElementById('auto-status-txt');
  statusBox.style.display = 'block';
  statusTxt.textContent = isLast ? '🏆 CARGANDO RESULTADO FINAL...' : '⚡ CARGANDO SIGUIENTE ESCENARIO...';
  setTimeout(() => {
    if (isLast) {
      buildVictory();
      goTo('s-victory');
    } else {
      renderMap();
      goTo('s-map');
      setTimeout(() => startGame(modIdx + 1), 400);
    }
  }, 1200);
}

// ============================================================
// VICTORY
// ============================================================
function buildVictory() {
  const container = document.getElementById('victory-cards');
  container.innerHTML = '';
  MODULES.forEach((mod, i) => {
    const card = document.createElement('div');
    card.className = 'v-card';
    card.style.animationDelay = `${i * 0.15}s`;
    card.innerHTML = `<div class="vc-icon">${mod.icon}</div><div class="vc-num">MÓDULO 0${i+1}</div><div class="vc-title">${mod.scenarioName}</div>`;
    container.appendChild(card);
  });
}

// ============================================================
// INIT
// ============================================================
runBoot();
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
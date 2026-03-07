// ============================================================
// GAME 1 — COLLECTOR (Cyber City)
// ============================================================
class CollectorGame {
  constructor(mod) {
    this.mod = mod; this.won = false;
    this.W = canvas.width; this.H = canvas.height;
    this.player = { x: 60, y: this.H / 2, w: 28, h: 28, vx: 0, vy: 0, speed: 3.2 };
    this.prize = { x: this.W - 80, y: this.H / 2, r: 16 };
    this.drones = [];
    this.particles = [];
    this.time = 0;
    for (let i = 0; i < 4; i++) {
      this.drones.push({
        x: 100 + Math.random() * (this.W - 200),
        y: 60 + Math.random() * (this.H - 120),
        vx: (Math.random() - .5) * 2.5,
        vy: (Math.random() - .5) * 2.5,
        r: 18
      });
    }
  }
  resize() { this.W = canvas.width; this.H = canvas.height; }
  update() {
    this.time++;
    const p = this.player;
    // AI: move straight toward prize, avoid drones
    const tx = this.prize.x, ty = this.prize.y;
    let ax = tx - p.x, ay = ty - p.y;
    const dist = Math.sqrt(ax*ax + ay*ay);
    if (dist > 1) { ax /= dist; ay /= dist; }
    // steer away from nearest drone
    this.drones.forEach(d => {
      const ex = p.x - d.x, ey = p.y - d.y;
      const ed = Math.sqrt(ex*ex + ey*ey);
      if (ed < 80) { ax += (ex/ed) * (80-ed)/40; ay += (ey/ed) * (80-ed)/40; }
    });
    p.vx = ax * p.speed; p.vy = ay * p.speed;
    p.x = Math.max(p.w/2, Math.min(this.W - p.w/2, p.x + p.vx));
    p.y = Math.max(p.h/2, Math.min(this.H - p.h/2, p.y + p.vy));
    // drones
    this.drones.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < d.r || d.x > this.W - d.r) d.vx *= -1;
      if (d.y < d.r || d.y > this.H - d.r) d.vy *= -1;
    });
    // check prize
    const dx = p.x - this.prize.x, dy = p.y - this.prize.y;
    if (Math.sqrt(dx*dx + dy*dy) < p.w/2 + this.prize.r) {
      this.won = true;
      for (let i = 0; i < 30; i++) this.particles.push({ x: this.prize.x, y: this.prize.y, vx: (Math.random()-0.5)*6, vy: (Math.random()-0.5)*6, life: 60, color: this.mod.color });
    }
  }
  draw(ctx) {
    const W = this.W, H = this.H;
    ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = 'rgba(0,245,255,0.04)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    // prize glow
    if (!this.won) {
      const pulse = Math.sin(this.time * 0.08) * 6;
      ctx.save();
      ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20 + pulse;
      ctx.fillStyle = this.mod.color;
      ctx.beginPath(); ctx.arc(this.prize.x, this.prize.y, this.prize.r + pulse * 0.3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '18px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('💎', this.prize.x, this.prize.y);
      ctx.restore();
    }
    // drones
    this.drones.forEach(d => {
      ctx.save();
      ctx.shadowColor = '#ff4444'; ctx.shadowBlur = 15;
      ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,68,68,0.2)'; ctx.fill();
      ctx.fillStyle = '#ff6666'; ctx.font = '16px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🤖', d.x, d.y);
      ctx.restore();
    });
    // player
    ctx.save();
    ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20;
    ctx.fillStyle = this.mod.color;
    ctx.beginPath(); ctx.arc(this.player.x, this.player.y, 14, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '16px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🧑', this.player.x, this.player.y);
    ctx.restore();
    // particles
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life--;
      ctx.globalAlpha = p.life / 60;
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    });
    if (this.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = this.mod.color; ctx.textAlign = 'center';
      ctx.font = 'bold 36px Orbitron'; ctx.fillText('¡PREMIO RECOGIDO!', W/2, H/2 - 20);
      ctx.font = '20px Rajdhani'; ctx.fillStyle = '#fff'; ctx.fillText('Cargando exposición...', W/2, H/2 + 20);
    }
  }
}

// ============================================================
// GAME 2 — MAZE (Dungeon)
// ============================================================
class MazeGame {
  constructor(mod) {
    this.mod = mod; this.won = false;
    this.W = canvas.width; this.H = canvas.height;
    this.COLS = 12; this.ROWS = 9;
    this.cellW = Math.floor(this.W / this.COLS);
    this.cellH = Math.floor(this.H / this.ROWS);
    this.maze = this.buildMaze();
    this.playerCell = { col: 0, row: 0 };
    this.exitCell = { col: this.COLS - 1, row: this.ROWS - 1 };
    this.px = this.cellW / 2; this.py = this.cellH / 2;
    this.speed = 3;
    this.moveTimer = 0;
    this.time = 0;
  }
  buildMaze() {
    const C = this.COLS, R = this.ROWS;
    // grid of cells with walls: N, E, S, W
    const cells = Array.from({length: R}, () => Array.from({length: C}, () => ({ n:true, e:true, s:true, w:true, visited: false })));
    const stack = [];
    let cur = { col: 0, row: 0 };
    cells[0][0].visited = true;
    stack.push(cur);
    while (stack.length) {
      const neighbors = [];
      const dirs = [{dc:0,dr:-1,wall:'n',opp:'s'},{dc:1,dr:0,wall:'e',opp:'w'},{dc:0,dr:1,wall:'s',opp:'n'},{dc:-1,dr:0,wall:'w',opp:'e'}];
      dirs.forEach(d => {
        const nc = cur.col + d.dc, nr = cur.row + d.dr;
        if (nc >= 0 && nc < C && nr >= 0 && nr < R && !cells[nr][nc].visited) {
          neighbors.push({...d, nc, nr});
        }
      });
      if (neighbors.length) {
        const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
        cells[cur.row][cur.col][chosen.wall] = false;
        cells[chosen.nr][chosen.nc][chosen.opp] = false;
        cells[chosen.nr][chosen.nc].visited = true;
        stack.push(cur);
        cur = { col: chosen.nc, row: chosen.nr };
      } else {
        cur = stack.pop();
      }
    }
    return cells;
  }
  update() {
    this.time++;
    this.moveTimer--;
    if (this.moveTimer > 0) return;
    // AI: BFS to find next step toward exit
    if (!this.path || this.path.length === 0) this.path = this.bfs();
    if (this.path && this.path.length > 0) {
      const next = this.path.shift();
      this.playerCell = { col: next.col, row: next.row };
      this.moveTimer = 10;
      if (this.playerCell.col === this.exitCell.col && this.playerCell.row === this.exitCell.row) {
        this.won = true;
      }
    }
  }
  bfs() {
    const start = this.playerCell, end = this.exitCell;
    const queue = [{ col: start.col, row: start.row, path: [] }];
    const visited = new Set([`${start.col},${start.row}`]);
    const dirs = [{ dc:0, dr:-1, wall:'n' },{ dc:1, dr:0, wall:'e' },{ dc:0, dr:1, wall:'s' },{ dc:-1, dr:0, wall:'w' }];
    while (queue.length) {
      const cur = queue.shift();
      const cell = this.maze[cur.row][cur.col];
      for (const d of dirs) {
        const nc = cur.col + d.dc, nr = cur.row + d.dr;
        const key = `${nc},${nr}`;
        if (nc >= 0 && nc < this.COLS && nr >= 0 && nr < this.ROWS && !cell[d.wall] && !visited.has(key)) {
          visited.add(key);
          const newPath = [...cur.path, { col: nc, row: nr }];
          if (nc === end.col && nr === end.row) return newPath;
          queue.push({ col: nc, row: nr, path: newPath });
        }
      }
    }
    return [];
  }
  draw(ctx) {
    const W = this.W, H = this.H;
    const cW = this.cellW, cH = this.cellH;
    ctx.fillStyle = '#060408'; ctx.fillRect(0, 0, W, H);
    // Draw maze
    ctx.strokeStyle = 'rgba(255,100,0,0.6)'; ctx.lineWidth = 2;
    this.maze.forEach((row, r) => {
      row.forEach((cell, c) => {
        const x = c * cW, y = r * cH;
        if (cell.n) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cW, y); ctx.stroke(); }
        if (cell.e) { ctx.beginPath(); ctx.moveTo(x + cW, y); ctx.lineTo(x + cW, y + cH); ctx.stroke(); }
        if (cell.s) { ctx.beginPath(); ctx.moveTo(x, y + cH); ctx.lineTo(x + cW, y + cH); ctx.stroke(); }
        if (cell.w) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cH); ctx.stroke(); }
      });
    });
    // Exit
    const ex = this.exitCell.col * cW + cW / 2, ey = this.exitCell.row * cH + cH / 2;
    const pulse = Math.sin(this.time * 0.1) * 5;
    ctx.save();
    ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 20 + pulse;
    ctx.font = `${Math.min(cW, cH) * 0.6}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('⚔️', ex, ey);
    ctx.restore();
    // Player
    const px = this.playerCell.col * cW + cW / 2, py = this.playerCell.row * cH + cH / 2;
    ctx.save();
    ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff8800';
    ctx.beginPath(); ctx.arc(px, py, Math.min(cW, cH) * 0.3, 0, Math.PI*2); ctx.fill();
    ctx.font = `${Math.min(cW, cH) * 0.45}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🧙', px, py);
    ctx.restore();
    if (this.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#ff6600'; ctx.textAlign = 'center';
      ctx.font = 'bold 32px Orbitron'; ctx.fillText('¡DUNGEON SUPERADO!', W/2, H/2 - 20);
      ctx.font = '20px Rajdhani'; ctx.fillStyle = '#fff'; ctx.fillText('Cargando exposición...', W/2, H/2 + 20);
    }
  }
}

// ============================================================
// GAME 3 — SHOOTER (Espacio)
// ============================================================
class ShooterGame {
  constructor(mod) {
    this.mod = mod; this.won = false;
    this.W = canvas.width; this.H = canvas.height;
    this.ship = { x: this.W / 2, y: this.H - 60, speed: 4 };
    this.bullets = [];
    this.asteroids = [];
    this.prize = null;
    this.particles = [];
    this.shootTimer = 0;
    this.time = 0;
    this.phase = 'fight'; // fight -> prize
    for (let i = 0; i < 6; i++) this.spawnAsteroid();
  }
  spawnAsteroid() {
    this.asteroids.push({
      x: Math.random() * this.W, y: -30,
      vx: (Math.random() - .5) * 2,
      vy: 1 + Math.random() * 2,
      r: 16 + Math.random() * 18,
      hp: 1
    });
  }
  update() {
    this.time++;
    this.shootTimer--;
    const s = this.ship;
    if (this.phase === 'fight') {
      // AI: aim at nearest asteroid, move under it
      let target = null, minD = Infinity;
      this.asteroids.forEach(a => { const d = Math.abs(a.x - s.x); if (d < minD) { minD = d; target = a; } });
      if (target) {
        if (s.x < target.x - 4) s.x = Math.min(this.W - 20, s.x + s.speed);
        else if (s.x > target.x + 4) s.x = Math.max(20, s.x - s.speed);
      }
      // auto-shoot
      if (this.shootTimer <= 0) {
        this.bullets.push({ x: s.x, y: s.y - 20, vy: -9 });
        this.shootTimer = 12;
      }
    } else {
      // AI: move toward prize
      if (s.x < this.prize.x - 4) s.x = Math.min(this.W - 20, s.x + s.speed);
      else if (s.x > this.prize.x + 4) s.x = Math.max(20, s.x - s.speed);
      s.y -= 1.5;
      if (s.y < this.prize.y + 40) s.y = this.prize.y + 40;
    }
    // bullets
    this.bullets = this.bullets.filter(b => { b.y += b.vy; return b.y > 0; });
    // asteroids
    this.asteroids = this.asteroids.filter(a => {
      a.x += a.vx; a.y += a.vy;
      if (a.y > this.H + 40) { this.spawnAsteroid(); return false; }
      this.bullets = this.bullets.filter(b => {
        const dx = b.x - a.x, dy = b.y - a.y;
        if (Math.sqrt(dx*dx + dy*dy) < a.r + 5) {
          a.hp--;
          for (let i = 0; i < 8; i++) this.particles.push({ x: a.x, y: a.y, vx:(Math.random()-0.5)*5, vy:(Math.random()-0.5)*5, life: 30, color: '#ff6600' });
          return false;
        }
        return true;
      });
      return a.hp > 0;
    });
    if (this.asteroids.length === 0 && this.phase === 'fight') {
      this.phase = 'prize';
      this.prize = { x: this.W / 2, y: 80, r: 18 };
    }
    if (this.prize && this.phase === 'prize') {
      const dx = s.x - this.prize.x, dy = s.y - this.prize.y;
      if (Math.sqrt(dx*dx + dy*dy) < 30 + this.prize.r) this.won = true;
    }
    this.particles = this.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.life--; return p.life > 0; });
  }
  draw(ctx) {
    const W = this.W, H = this.H;
    ctx.fillStyle = '#020308'; ctx.fillRect(0, 0, W, H);
    // stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 80; i++) {
      const sx = (i * 137.5 + this.time * 0.5) % W;
      const sy = (i * 97.3 + this.time) % H;
      ctx.globalAlpha = 0.3 + Math.sin(i + this.time * 0.05) * 0.3;
      ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // prize
    if (this.prize && this.phase === 'prize') {
      const pulse = Math.sin(this.time * 0.1) * 6;
      ctx.save(); ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20 + pulse;
      ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🌟', this.prize.x, this.prize.y); ctx.restore();
    }
    // asteroids
    this.asteroids.forEach(a => {
      ctx.save();
      ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#663300';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = `${a.r * 1.2}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('☄️', a.x, a.y);
      ctx.restore();
    });
    // bullets
    this.bullets.forEach(b => {
      ctx.save(); ctx.shadowColor = '#00f5ff'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#00f5ff';
      ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
    // ship
    ctx.save(); ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20;
    ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🚀', this.ship.x, this.ship.y);
    ctx.restore();
    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(8, 8, 180, 36);
    ctx.fillStyle = '#00f5ff'; ctx.font = '12px Share Tech Mono';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    if (this.phase === 'fight') ctx.fillText(`ASTEROIDES: ${this.asteroids.length} restantes`, 16, 18);
    else ctx.fillText('¡DESTRUIDOS! Recoge la estrella ↑', 16, 18);
    // particles
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life / 30;
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (this.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = this.mod.color; ctx.textAlign = 'center';
      ctx.font = 'bold 32px Orbitron'; ctx.fillText('¡SECTOR DESPEJADO!', W/2, H/2 - 20);
      ctx.font = '20px Rajdhani'; ctx.fillStyle = '#fff'; ctx.fillText('Cargando exposición...', W/2, H/2 + 20);
    }
  }
}

// ============================================================
// GAME 4 — PLATFORMER (Neon)
// ============================================================
class PlatformerGame {
  constructor(mod) {
    this.mod = mod; this.won = false;
    this.W = canvas.width; this.H = canvas.height;
    this.gravity = 0.5;
    this.player = { x: 60, y: this.H - 80, w: 28, h: 28, vx: 0, vy: 0, onGround: false };
    this.cameraX = 0;
    this.time = 0;
    this.platforms = this.buildPlatforms();
    this.prize = { x: this.platforms[this.platforms.length-1].x + 40, y: this.platforms[this.platforms.length-1].y - 60, r: 16 };
    // AI state machine
    this.targetPlatIdx = 1; // next platform to jump to
    this.aiState = 'walk'; // 'walk' | 'jump' | 'wait'
    this.jumped = false;
  }
  buildPlatforms() {
    const H = this.H;
    return [
      { x: 0,    y: H - 40,  w: 200, h: 20 },
      { x: 240,  y: H - 100, w: 120, h: 20 },
      { x: 420,  y: H - 170, w: 120, h: 20 },
      { x: 600,  y: H - 130, w: 100, h: 20 },
      { x: 760,  y: H - 200, w: 120, h: 20 },
      { x: 940,  y: H - 160, w: 100, h: 20 },
      { x: 1100, y: H - 240, w: 120, h: 20 },
      { x: 1280, y: H - 190, w: 140, h: 20 },
    ];
  }
  update() {
    this.time++;
    const p = this.player;
    const plats = this.platforms;

    // Detect which platform the player is standing on
    let currentPlatIdx = -1;
    plats.forEach((pl, i) => {
      if (p.x + p.w/2 > pl.x && p.x - p.w/2 < pl.x + pl.w && Math.abs((p.y + p.h) - pl.y) < 6 && p.onGround) {
        currentPlatIdx = i;
      }
    });

    // Advance target when we land on it
    if (currentPlatIdx >= this.targetPlatIdx) {
      this.targetPlatIdx = currentPlatIdx + 1;
      this.jumped = false;
      this.aiState = 'walk';
    }

    const target = this.targetPlatIdx < plats.length ? plats[this.targetPlatIdx] : null;
    // Jump point: walk to 80% of current platform toward the gap
    const curPlat = currentPlatIdx >= 0 ? plats[currentPlatIdx] : plats[0];
    const jumpX = curPlat.x + curPlat.w - 22; // near right edge

    if (this.aiState === 'walk') {
      // Walk right toward jump point
      if (p.x < jumpX - 4) {
        p.vx = 3;
      } else {
        p.vx = 3; // keep walking through edge
        if (p.onGround && !this.jumped && target) {
          p.vy = -13;
          p.onGround = false;
          this.jumped = true;
          this.aiState = 'wait';
        }
      }
    } else {
      // 'wait': keep moving right while in the air
      p.vx = 3;
      if (p.onGround) {
        this.aiState = 'walk';
      }
    }

    // Physics
    p.vy += this.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.onGround = false;

    plats.forEach(pl => {
      if (p.x + p.w/2 > pl.x && p.x - p.w/2 < pl.x + pl.w &&
          p.y + p.h > pl.y && p.y + p.h - p.vy <= pl.y + 4) {
        p.y = pl.y - p.h; p.vy = 0; p.onGround = true;
      }
    });

    // Fell — reset to beginning
    if (p.y > this.H + 20) {
      p.x = 60; p.y = this.H - 80; p.vy = 0; p.vx = 0;
      this.targetPlatIdx = 1; this.jumped = false; this.aiState = 'walk';
    }

    this.cameraX = Math.max(0, Math.min(p.x - this.W * 0.35, plats[plats.length-1].x + 200 - this.W));
    const dx = p.x - this.prize.x, dy = (p.y + p.h/2) - this.prize.y;
    if (Math.sqrt(dx*dx + dy*dy) < 50) this.won = true;
  }
  draw(ctx) {
    const W = this.W, H = this.H;
    ctx.fillStyle = '#060412'; ctx.fillRect(0, 0, W, H);
    // bg stars
    for (let i = 0; i < 60; i++) {
      ctx.globalAlpha = 0.2 + Math.sin(i * 7.3 + this.time * 0.02) * 0.2;
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath(); ctx.arc((i * 293) % W, (i * 157) % H, 1, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(-this.cameraX, 0);
    // platforms
    this.platforms.forEach((pl, i) => {
      ctx.save();
      ctx.shadowColor = this.mod.color; ctx.shadowBlur = 10;
      const grad = ctx.createLinearGradient(pl.x, pl.y, pl.x, pl.y + pl.h);
      grad.addColorStop(0, this.mod.color);
      grad.addColorStop(1, 'rgba(0,255,136,0.1)');
      ctx.fillStyle = grad;
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.restore();
    });
    // prize
    const pulse = Math.sin(this.time * 0.1) * 5;
    ctx.save(); ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20 + pulse;
    ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🔮', this.prize.x, this.prize.y); ctx.restore();
    // player
    ctx.save(); ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20;
    ctx.fillStyle = this.mod.color;
    ctx.beginPath(); ctx.arc(this.player.x, this.player.y + this.player.h/2, 14, 0, Math.PI*2); ctx.fill();
    ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🧝', this.player.x, this.player.y + this.player.h/2); ctx.restore();
    ctx.restore();
    if (this.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = this.mod.color; ctx.textAlign = 'center';
      ctx.font = 'bold 32px Orbitron'; ctx.fillText('¡ORBE ALCANZADO!', W/2, H/2 - 20);
      ctx.font = '20px Rajdhani'; ctx.fillStyle = '#fff'; ctx.fillText('Cargando exposición...', W/2, H/2 + 20);
    }
  }
}

// ============================================================
// GAME 5 — RUNNER (Reactor)
// ============================================================
class RunnerGame {
  constructor(mod) {
    this.mod = mod; this.won = false;
    this.W = canvas.width; this.H = canvas.height;
    this.GROUND = this.H - 70;
    this.player = { x: 100, y: this.GROUND - 30, w: 30, h: 30, vy: 0, onGround: true };
    this.obstacles = [];   // each: { worldX, w, h }
    this.prize = null;     // { worldX }
    this.cameraX = 0;
    this.speed = 3.5;
    this.spawnTimer = 80;
    this.worldDist = 0;    // how far camera has scrolled
    this.PRIZE_WORLD = 1800;
    this.time = 0;
  }
  update() {
    this.time++;
    const p = this.player;

    // Camera always scrolls right
    this.cameraX += this.speed;
    this.worldDist = this.cameraX;
    this.speed = Math.min(6, 3.5 + this.worldDist / 1200);

    // Spawn obstacles in world space ahead of camera
    this.spawnTimer--;
    if (this.spawnTimer <= 0 && this.worldDist < this.PRIZE_WORLD - 200) {
      const wx = this.cameraX + this.W + 60;
      this.obstacles.push({ worldX: wx, w: 24, h: 38 + Math.random() * 24 });
      this.spawnTimer = 55 + Math.random() * 45;
    }

    // Spawn prize when far enough
    if (!this.prize && this.worldDist >= this.PRIZE_WORLD - 300) {
      this.prize = { worldX: this.cameraX + this.W + 100 };
    }

    // AI: detect obstacle on screen within jump range
    const pScreenX = p.x;
    const danger = this.obstacles.find(o => {
      const sx = o.worldX - this.cameraX;
      return sx - (pScreenX + p.w) > 0 && sx - (pScreenX + p.w) < 130;
    });
    if (danger && p.onGround) { p.vy = -14; p.onGround = false; }

    // Also jump for prize if needed (prize is at ground level - just run into it)
    // Physics
    p.vy += 0.65;
    p.y += p.vy;
    if (p.y >= this.GROUND - p.h) { p.y = this.GROUND - p.h; p.vy = 0; p.onGround = true; }

    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter(o => o.worldX - this.cameraX > -80);

    // Collision with obstacles — just jump over (push back up if hit)
    this.obstacles.forEach(o => {
      const sx = o.worldX - this.cameraX;
      if (pScreenX + p.w * 0.7 > sx && pScreenX + p.w * 0.1 < sx + o.w &&
          p.y + p.h > this.GROUND - o.h) {
        if (p.onGround || p.vy >= 0) { p.vy = -14; p.onGround = false; }
      }
    });

    // Check prize collection
    if (this.prize) {
      const sx = this.prize.worldX - this.cameraX;
      if (Math.abs(sx - pScreenX) < 60) this.won = true;
    }
  }
  draw(ctx) {
    const W = this.W, H = this.H;
    ctx.fillStyle = '#080410'; ctx.fillRect(0, 0, W, H);

    // Scrolling bg lines
    ctx.strokeStyle = 'rgba(255,215,0,0.04)'; ctx.lineWidth = 1;
    const offset = this.cameraX % 60;
    for (let x = -offset; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

    // Ground
    ctx.save();
    ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8;
    const ggrad = ctx.createLinearGradient(0, this.GROUND, 0, H);
    ggrad.addColorStop(0, 'rgba(255,215,0,0.5)'); ggrad.addColorStop(1, 'rgba(255,165,0,0)');
    ctx.fillStyle = ggrad; ctx.fillRect(0, this.GROUND, W, H - this.GROUND);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, this.GROUND); ctx.lineTo(W, this.GROUND); ctx.stroke();
    ctx.restore();

    // Progress bar
    const progress = Math.min(1, this.worldDist / this.PRIZE_WORLD);
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(W * 0.1, 14, W * 0.8, 10);
    const pgrad = ctx.createLinearGradient(W*0.1, 0, W*0.9, 0);
    pgrad.addColorStop(0, '#ffd700'); pgrad.addColorStop(1, '#ff6600');
    ctx.fillStyle = pgrad; ctx.fillRect(W * 0.1, 14, W * 0.8 * progress, 10);
    ctx.fillStyle = '#ffd700'; ctx.font = '10px Share Tech Mono'; ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(progress * 100)}% — LLEGA AL REACTOR`, W/2, 12);

    // Obstacles
    this.obstacles.forEach(o => {
      const sx = o.worldX - this.cameraX;
      ctx.save(); ctx.shadowColor = '#ff4444'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#440011'; ctx.fillRect(sx, this.GROUND - o.h, o.w, o.h);
      ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1.5; ctx.strokeRect(sx, this.GROUND - o.h, o.w, o.h);
      ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚡', sx + o.w/2, this.GROUND - o.h/2);
      ctx.restore();
    });

    // Prize
    if (this.prize) {
      const sx = this.prize.worldX - this.cameraX;
      const pulse = Math.sin(this.time * 0.12) * 6;
      ctx.save(); ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20 + pulse;
      ctx.font = '34px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚡', sx, this.GROUND - 36);
      ctx.restore();
      ctx.fillStyle = this.mod.color; ctx.font = '11px Share Tech Mono'; ctx.textAlign = 'center';
      ctx.fillText('¡RECOGE LA ENERGÍA!', sx, this.GROUND - 70);
    }

    // Player
    const p = this.player;
    ctx.save(); ctx.shadowColor = this.mod.color; ctx.shadowBlur = 20;
    ctx.fillStyle = this.mod.color;
    ctx.beginPath(); ctx.arc(p.x + p.w/2, p.y + p.h/2, 14, 0, Math.PI*2); ctx.fill();
    ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🏃', p.x + p.w/2, p.y + p.h/2);
    ctx.restore();

    if (this.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = this.mod.color; ctx.textAlign = 'center';
      ctx.font = 'bold 32px Orbitron'; ctx.fillText('¡REACTOR ACTIVADO!', W/2, H/2 - 20);
      ctx.font = '20px Rajdhani'; ctx.fillStyle = '#fff'; ctx.fillText('Cargando exposición...', W/2, H/2 + 20);
    }
  }
}
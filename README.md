# 🎮 Diseño de Interfaces para Juegos — Exposición Jugable
### Materia: Diseño de Interfaces
### Modalidad: Experiencia interactiva gamificada

---

## 📋 Descripción General

**Diseño de Interfaces para Juegos** es una aplicación web interactiva que enseña el tema principal a través de 5 mini-videojuegos. Cada escenario presenta un juego automático seguido de una exposición de 15 minutos que responde una de las 5 preguntas clave del tema.

La lógica es simple: **el juego engancha, la exposición enseña**. El estudiante observa cómo la IA completa cada nivel y luego lee el contenido educativo correspondiente.

---

## ✅ Preguntas Respondidas por Módulo

El tema central es **Diseño de Interfaces para Juegos**. Cada módulo aborda una pregunta específica en el orden establecido:

| # | Escenario | Pregunta del módulo |
|---|-----------|---------------------|
| 01 | 💎 CYBER CITY | ¿Cómo ayudan las interfaces para juegos a mejorar la experiencia del usuario? |
| 02 | ⚔️ DUNGEON PROFUNDO | ¿Cuáles son las principales ventajas de una buena interfaz de juego para los usuarios? |
| 03 | 🌟 ESPACIO PROFUNDO | ¿Cuáles son las buenas prácticas en el diseño de interfaces para videojuegos? |
| 04 | 🔮 PLATAFORMAS NEON | ¿Cuáles son los ejemplos más icónicos de interfaces en videojuegos? |
| 05 | ⚡ REACTOR DIGITAL | ¿Qué herramientas se utilizan para diseñar interfaces de videojuegos? |

---

## 🗺️ Flujo de la Experiencia

```
BOOT SCREEN
    ↓  (animación de terminal typewriter)
MAPA DE ESCENARIOS
    ↓  (inicia automáticamente el primer nivel disponible)
MINI-JUEGO — IA juega sola
    ↓  (al completar el nivel → transición automática)
EXPOSICIÓN — countdown 15 minutos
    ↓  (al llegar a 0:00 → avanza solo / botón para adelantar)
[se repite para los 5 módulos]
    ↓
PANTALLA DE VICTORIA
```

**Todo el recorrido es automático.** Los mini-juegos los resuelve una IA. El estudiante solo observa y lee.

---

## 🎮 Los 5 Escenarios

### 01 — Collector · CYBER CITY · 💎
El personaje recoge un cristal mientras esquiva drones enemigos.
**Responde:** ¿Cómo ayudan las interfaces para juegos a mejorar la experiencia del usuario?
**Contenido:** qué es una Game UI, cómo reduce la carga cognitiva, genera inmersión y comunica el estado del juego.

### 02 — Maze · DUNGEON PROFUNDO · ⚔️
La IA navega un laberinto generado proceduralmente hasta encontrar la salida.
**Responde:** Ventajas de una buena interfaz de juego para los usuarios.
**Contenido:** aprendizaje acelerado, retención, accesibilidad, satisfacción de feedback, reducción de errores.

### 03 — Shooter · ESPACIO PROFUNDO · 🌟
La IA destruye asteroides y recoge la estrella de energía.
**Responde:** Buenas prácticas en el diseño de interfaces para videojuegos.
**Contenido:** las 8 reglas de oro del diseño de Game UI, desde claridad hasta prototipado.

### 04 — Platformer · PLATAFORMAS NEON · 🔮
La IA salta entre plataformas de neón hasta alcanzar el orbe mágico.
**Responde:** Ejemplos icónicos de interfaces en videojuegos.
**Contenido:** Dead Space, The Last of Us, Metroid Prime, Super Mario Bros, Dark Souls, Monument Valley.

### 05 — Runner · REACTOR DIGITAL · ⚡
La IA corre, salta obstáculos y recoge el núcleo de energía.
**Responde:** Herramientas para diseñar interfaces de videojuegos.
**Contenido:** Figma, Adobe XD, Photoshop, Illustrator, Unity UI, Unreal UMG, Spine 2D, Zeplin — con flujo de trabajo profesional.

---

## 🧠 Patrones de Diseño Implementados

### 1. Strategy Pattern — Motor de juegos intercambiable
Todos los mini-juegos implementan la misma interfaz (`update()` y `draw(ctx)`), permitiendo que el game loop sea idéntico para los 5 juegos. Cada clase es una estrategia intercambiable:

```javascript
// Game loop universal — funciona para los 5 juegos sin cambios
function loop() {
  gameState.update();  // estrategia específica de cada juego
  gameState.draw(ctx); // estrategia específica de cada juego
  if (gameState.won) { abrirExpo(); return; }
  requestAnimationFrame(loop);
}
```

### 2. State Machine — Navegación global y IA del Platformer
La aplicación completa es una máquina de estados:
```
boot → map → game → expo → [map → game → expo] × 5 → victory
```
La IA del módulo 04 también usa una máquina de estados interna:
```
'walk' (camina al borde) → 'jump' (salta una vez) → 'wait' (espera aterrizar) → 'walk'
```
Esto garantiza exactamente un salto por plataforma, sin comportamientos erráticos.

### 3. BFS Pathfinding — IA del Maze (Módulo 02)
El laberinto se genera con DFS (Depth-First Search) aleatorizado y se resuelve con BFS (Breadth-First Search), que garantiza el camino más corto:

```javascript
bfs() {
  // Explora el laberinto celda por celda
  // Solo atraviesa conexiones donde no hay pared
  // Retorna el camino óptimo desde inicio hasta salida
}
```

### 4. Potential Fields AI — IA del Collector (Módulo 01)
Usa campos de potencial vectoriales: el premio genera atracción y los drones generan repulsión. El vector suma determina la dirección de movimiento, produciendo evasión suave:

```javascript
// Atracción al premio
ax = (prize.x - player.x) / dist;
// Repulsión de drones cercanos
if (droneDist < 80) ax += (repelX / droneDist) * fuerza;
```

### 5. World-Space Coordinates — Runner (Módulo 05)
Separa las coordenadas del mundo (`worldX`) de las coordenadas de pantalla (`worldX - cameraX`). La cámara scrollea independientemente del jugador, patrón estándar en juegos de scroll lateral.

### 6. Procedural Generation — Maze (Módulo 02)
El laberinto se genera aleatoriamente en cada partida usando DFS con backtracking, garantizando que siempre haya exactamente un camino entre cualquier par de celdas (laberinto perfecto).

### 7. Game Loop con requestAnimationFrame
Motor de renderizado basado en el estándar web:
```javascript
function loop() {
  update();  // lógica del juego
  draw();    // renderizado en canvas
  requestAnimationFrame(loop); // sincronizado con el monitor (60fps)
}
```

---

## 🏗️ Estructura del Proyecto

El proyecto está organizado en múltiples archivos para mayor claridad y mantenibilidad:

```
interfacesjuegos/
│
├── index.html          ← Punto de entrada y estructura HTML de las 4 pantallas
│
├── css/
│   └── styles.css      ← CSS completo
│       ├── Variables CSS (:root) — paleta de colores
│       ├── Animaciones — glitch, scanlines, fadeIn, pulsos neon
│       ├── Pantallas — boot, map, game, expo, victory
│       └── Componentes — cards, countdown, progress bars, botones
│
└── js/
    ├── data.js         ← Datos de los 5 módulos (MODULES[])
    │   ├── scenarioName, icon, color
    │   ├── title, question
    │   └── content[]   ← bloques de exposición tipados
    │
    ├── games.js        ← Motores de los 5 mini-juegos (JavaScript vanilla)
    │   ├── CollectorGame  ← IA: potential fields
    │   ├── MazeGame       ← IA: BFS + generación DFS
    │   ├── ShooterGame    ← IA: targeting + auto-shoot
    │   ├── PlatformerGame ← IA: state machine
    │   └── RunnerGame     ← IA: obstacle detection anticipada
    │
    └── main.js         ← Lógica principal de la aplicación
        ├── Navegación     ← goTo(), restartAll()
        ├── Boot sequence  ← typewriter animado
        ├── Mapa           ← renderMap(), nodos locked/available/completed
        ├── Game Engine    ← startGame(), stopGame(), game loop
        ├── openExpo()     ← renderizado dinámico del contenido
        └── startCountdown() ← timer 15min + avance automático
```

---

## ⏱️ Sistema de Countdown

- Al completar el mini-juego → expo se abre automáticamente
- Countdown de **15 minutos** con barra de progreso visual
- Últimos 60 segundos: timer en rojo con animación de urgencia
- Al llegar a 00:00 → avanza automáticamente al siguiente módulo
- Botón **"SIGUIENTE ESCENARIO →"** para avanzar antes de tiempo

---

## 🎨 Diseño Visual

**Tema: Cyberpunk / Retro-Futurista**

| Elemento | Valor |
|----------|-------|
| Fondo principal | `#050810` negro azulado profundo |
| Color primario | `#00f5ff` cyan |
| Color secundario | `#ff00ff` magenta |
| Acento | `#ffd700` amarillo dorado |
| Éxito | `#00ff88` verde neón |
| Fuente títulos | Orbitron (geométrica futurista) |
| Fuente contenido | Rajdhani (legible, semi-condensada) |
| Fuente datos/HUD | Share Tech Mono (monoespaciada) |

**Efectos especiales:** efecto glitch en títulos, scanlines en toda la pantalla, glow neón en elementos interactivos, animaciones fadeInUp en cards, grid animado en fondos.

**El diseño aplica los mismos principios que enseña:** jerarquía clara, feedback inmediato, consistencia y mínima fricción.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 Canvas API | Motor de renderizado de los 5 mini-juegos |
| CSS3 + Variables | Animaciones, tema visual, layout responsivo |
| JavaScript ES6+ Vanilla | Lógica, IA, navegación — sin frameworks |
| Google Fonts CDN | Orbitron + Rajdhani + Share Tech Mono |

**Cero dependencias de JavaScript externas.**

---

## ▶️ Cómo Ejecutar

```
Doble clic en index.html → se abre en cualquier navegador moderno
```

No requiere servidor ni instalación.
Requiere internet solo para cargar las tipografías de Google Fonts.

**Compatibilidad:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

---

*Proyecto desarrollado para la materia **Diseño de Interfaces** — tema: Diseño de Interfaces para Juegos.*

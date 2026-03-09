// Configuración del juego
const config = {
    tileSize: 30,
    canvasWidth: 900,
    canvasHeight: 600,
    playerSpeed: 2,  // Velocidad reducida para mejor control
    ghostSpeed: 1.5,  // Fantasmas más lentos
    pelletPoints: 10,
    educationalZonePoints: 100,
    turboMultiplier: 1.5,  // Turbo menos agresivo
    autoPilotSpeed: 2.5  // Velocidad específica para navegación automática
};

// Estado del juego
const gameState = {
    score: 0,
    level: 1,
    totalPellets: 0,
    collectedPellets: 0,
    isPaused: false,
    currentZone: null,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    comboTimer: null,
    turboActive: false,
    visitedZones: new Set(),
    levelsCompleted: 0,
    autoPilot: false,
    targetZone: null,
    targetX: null,
    targetY: null,
    path: [],  // Ruta calculada para seguir
    pathIndex: 0  // Índice actual en la ruta
};

// Partículas
const particles = [];

// Elementos del DOM
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
const clickCanvas = document.getElementById('clickCanvas');
const clickCtx = clickCanvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const educationalPanel = document.getElementById('educationalPanel');
const closePanel = document.getElementById('closePanel');
const nextLevel = document.getElementById('nextLevel');
const notifications = document.getElementById('notifications');
const comboIndicator = document.getElementById('comboIndicator');
const autoPilotBtn = document.getElementById('autoPilotBtn');
const nextZoneIndicator = document.getElementById('nextZoneIndicator');

// Configurar canvas
canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;
particleCanvas.width = config.canvasWidth;
particleCanvas.height = config.canvasHeight;
clickCanvas.width = config.canvasWidth;
clickCanvas.height = config.canvasHeight;

// Mapa del laberinto (0 = pared, 1 = camino, 2 = pellet, 3-7 = zonas educativas para los 5 presentadores)
const mazeMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2,0],
    [0,2,0,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,0,2,0,2,0],
    [0,2,0,3,3,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,4,4,0,2,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0],
    [0,2,2,2,2,2,0,0,2,2,2,2,2,0,0,2,2,2,2,2,2,0,0,2,2,2,2,2,2,0],
    [0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,2,0],
    [0,2,0,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,6,0,2,0,2,0],
    [0,2,0,5,5,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,6,6,0,2,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2,0],
    [0,2,0,7,7,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,7,7,0,2,0,2,0],
    [0,2,0,7,7,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,7,7,0,2,0,2,0],
    [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// ZONAS EDUCATIVAS EN EL MAPA:
// Zona 3 (Valentina) - Fila 3-4, Columna 3-4 (Arriba izquierda)
// Zona 4 (Fernando) - Fila 3-4, Columna 23-24 (Arriba derecha)
// Zona 5 (Vanesa) - Fila 11-12, Columna 3-4 (Centro izquierda)
// Zona 6 (Alejandro) - Fila 11-12, Columna 23-24 (Centro derecha)
// Zona 7 (Juan Pablo) - Fila 17-18, Columna 3-4 y 23-24 (Abajo)

// Coordenadas centrales de cada zona educativa
const zoneLocations = {
    3: { x: 3.5 * config.tileSize, y: 3.5 * config.tileSize, name: 'Nivel 1', presenter: 'Jugador: Valentina' },
    4: { x: 23.5 * config.tileSize, y: 3.5 * config.tileSize, name: 'Nivel 2', presenter: 'Jugador: Fernando' },
    5: { x: 3.5 * config.tileSize, y: 11.5 * config.tileSize, name: 'Nivel 3', presenter: 'Jugador: Vanessa' },
    6: { x: 23.5 * config.tileSize, y: 11.5 * config.tileSize, name: 'Nivel 4', presenter: 'Jugador: Alejandro' },
    7: { x: 3.5 * config.tileSize, y: 17.5 * config.tileSize, name: 'Nivel 5', presenter: 'Jugador: Juan Pablo' }
};

// Jugador - Posición inicial en el centro del mapa
const player = {
    x: 14.5 * config.tileSize,  // Centro horizontal (en píxeles)
    y: 10.5 * config.tileSize,  // Centro vertical (en píxeles)
    size: config.tileSize - 6,
    color: '#ffff00',
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 }
};

// Fantasmas
const ghosts = [
    { x: 14 * config.tileSize, y: 10 * config.tileSize, color: '#ff0000', direction: { x: 1, y: 0 } },
    { x: 15 * config.tileSize, y: 10 * config.tileSize, color: '#ff00ff', direction: { x: -1, y: 0 } },
    { x: 14 * config.tileSize, y: 11 * config.tileSize, color: '#00ffff', direction: { x: 0, y: 1 } }
];

// Contenido educativo por nivel (5 niveles para 5 jugadores) - MEJORADO Y EXPANDIBLE
const educationalContent = {
    3: {
        title: 'NIVEL 1: ¿Cómo ayudan las interfaces?',
        presenter: '🎮 Jugador: Valentina',
        content: `
            <ul class="interactive-list">
                <li data-detail="Las interfaces actúan como puente entre el jugador y el sistema, traduciendo acciones complejas en interacciones simples e intuitivas. Permiten que cualquier persona, sin importar su experiencia técnica, pueda disfrutar del juego desde el primer momento.">
                    <span class="main-point">💡 Comprensión fácil del juego</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Una buena interfaz organiza la información de manera lógica, usando menús claros, iconos reconocibles y flujos de navegación predecibles. Esto reduce la curva de aprendizaje y permite a los jugadores encontrar lo que necesitan rápidamente.">
                    <span class="main-point">🧭 Navegación intuitiva</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="En momentos críticos del juego, la interfaz debe presentar información vital de forma instantánea: vida restante, munición, objetivos. Un diseño eficiente permite tomar decisiones estratégicas en fracciones de segundo sin distraer del gameplay.">
                    <span class="main-point">⚡ Decisiones rápidas</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="La interfaz debe ser una extensión natural del juego, no un obstáculo. Elementos bien diseñados responden inmediatamente a las acciones del jugador, proporcionando feedback visual y auditivo que hace que cada interacción se sienta satisfactoria y precisa.">
                    <span class="main-point">🎯 Mejor interacción</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Una interfaz inmersiva se integra perfectamente con el mundo del juego, usando estilos visuales coherentes y elementos diegéticos cuando es posible. Esto mantiene al jugador dentro de la experiencia sin romper la ilusión del mundo virtual.">
                    <span class="main-point">🌟 Mayor inmersión</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
            </ul>
        `
    },
    4: {
        title: 'NIVEL 2: Ventajas para Usuarios',
        presenter: '🎮 Jugador: Fernando',
        content: `
            <ul class="interactive-list">
                <li data-detail="La facilidad de uso se logra mediante patrones de diseño familiares, controles consistentes y retroalimentación clara. Los jugadores no deberían necesitar un manual para entender cómo interactuar con el juego - todo debe ser autoexplicativo.">
                    <span class="main-point">✨ Facilidad de uso</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="El HUD (Heads-Up Display) debe mostrar solo la información esencial en el momento adecuado. Elementos como salud, minimapa y objetivos deben estar siempre visibles pero sin saturar la pantalla, permitiendo acceso rápido sin distracciones.">
                    <span class="main-point">📊 Acceso rápido a información</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Tutoriales integrados, tooltips contextuales y sistemas de progresión claros ayudan a los jugadores a entender las mecánicas gradualmente. La interfaz debe enseñar sin ser intrusiva, revelando complejidad a medida que el jugador avanza.">
                    <span class="main-point">🎓 Comprensión de mecánicas</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Una experiencia agradable combina estética atractiva con funcionalidad eficiente. Animaciones suaves, transiciones fluidas y feedback satisfactorio hacen que cada interacción sea placentera, aumentando el tiempo de juego y la satisfacción general.">
                    <span class="main-point">😊 Experiencia agradable</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
            </ul>
        `
    },
    5: {
        title: 'NIVEL 3: Buenas Prácticas',
        presenter: '🎮 Jugador: Vanessa',
        content: `
            <ul class="interactive-list">
                <li data-detail="Menos es más: elimina elementos innecesarios y enfócate en lo esencial. Cada elemento debe tener un propósito claro. El espacio en blanco (o negativo) es tan importante como los elementos visibles, ayudando a reducir la carga cognitiva.">
                    <span class="main-point">🎨 Simplicidad visual</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Mantén patrones consistentes en toda la interfaz: mismos colores para acciones similares, iconos coherentes, ubicación predecible de elementos. Esto crea familiaridad y reduce el tiempo de aprendizaje en diferentes secciones del juego.">
                    <span class="main-point">🔄 Consistencia de elementos</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Organiza la información por importancia: elementos críticos deben ser más grandes y prominentes, información secundaria puede ser más pequeña o accesible mediante menús. Usa tamaño, color y posición para guiar la atención del jugador.">
                    <span class="main-point">📐 Jerarquía clara</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Los colores comunican significado: rojo para peligro/vida baja, verde para éxito/salud, azul para información. Usa contraste adecuado para legibilidad y considera la accesibilidad para personas con daltonismo mediante patrones adicionales.">
                    <span class="main-point">🌈 Uso correcto de colores</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Diseña para todos: tamaños de texto ajustables, opciones de contraste, subtítulos, controles remapeables, y soporte para tecnologías asistivas. La accesibilidad no es opcional - amplía tu audiencia y mejora la experiencia para todos.">
                    <span class="main-point">♿ Accesibilidad universal</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
            </ul>
        `
    },
    6: {
        title: 'NIVEL 4: Ejemplos de Interfaces',
        presenter: '🎮 Jugador: Alejandro',
        content: `
            <ul class="interactive-list">
                <li data-detail="La barra de vida es uno de los elementos más críticos. Puede ser numérica, visual (barra), o integrada en el personaje. Debe ser visible sin ser intrusiva, con colores que indiquen claramente el estado (verde=bien, amarillo=precaución, rojo=peligro).">
                    <span class="main-point">❤️ Barra de vida</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="El marcador de puntos motiva al jugador y muestra progreso. Puede incluir multiplicadores, combos y efectos visuales al aumentar. En juegos competitivos, también muestra rankings y comparaciones con otros jugadores en tiempo real.">
                    <span class="main-point">🏆 Marcador de puntos</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="El minimapa proporciona orientación espacial sin interrumpir el juego. Debe mostrar objetivos, aliados, enemigos y puntos de interés con iconos claros. Puede ser estático o rotatorio según las necesidades del juego.">
                    <span class="main-point">🗺️ Minimapa</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="El inventario organiza objetos, armas y recursos. Debe ser fácil de navegar con categorías claras, búsqueda rápida y comparación de ítems. Iconos distintivos y tooltips informativos son esenciales para una buena experiencia.">
                    <span class="main-point">🎒 Inventario</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Los indicadores de misión guían al jugador sin ser intrusivos. Pueden ser marcadores en pantalla, flechas direccionales o integrados en el mundo del juego. Deben actualizarse dinámicamente y ser fáciles de seguir.">
                    <span class="main-point">🎯 Indicadores de misión</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
            </ul>
        `
    },
    7: {
        title: 'NIVEL 5: Herramientas de Diseño',
        presenter: '🎮 Jugador: Juan Pablo',
        content: `
            <ul class="interactive-list">
                <li data-detail="Figma es el líder actual en diseño UI/UX. Basado en navegador, permite colaboración en tiempo real, prototipado interactivo, sistemas de diseño compartidos y plugins extensivos. Ideal para equipos distribuidos y flujos de trabajo ágiles. Es gratuito para uso personal.">
                    <span class="main-point">🎨 Figma</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Adobe XD está en modo mantenimiento desde 2024, pero sigue siendo útil para quienes usan el ecosistema Adobe. Ofrece integración con Photoshop e Illustrator, prototipado rápido y diseño responsivo. Adobe recomienda migrar a Figma para nuevos proyectos.">
                    <span class="main-point">🔷 Adobe XD</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Unity UI System (uGUI y UI Toolkit) permite crear interfaces directamente en el motor. Soporta Canvas escalable, eventos interactivos, animaciones y es perfecto para HUDs dinámicos. UI Toolkit usa USS (similar a CSS) para estilos más flexibles y reutilizables.">
                    <span class="main-point">🎮 Unity UI System</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Unreal Engine UI usa UMG (Unreal Motion Graphics) con Blueprint visual scripting. Potente para interfaces 3D, efectos visuales avanzados y animaciones complejas. Ideal para juegos AAA con interfaces cinemáticas y altamente estilizadas.">
                    <span class="main-point">🔵 Unreal Engine UI</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
                <li data-detail="Photoshop sigue siendo esencial para crear assets visuales: iconos, texturas, mockups y concept art. Aunque no es una herramienta de prototipado, es indispensable para la creación de elementos gráficos de alta calidad que luego se integran en las interfaces.">
                    <span class="main-point">🖼️ Photoshop</span>
                    <span class="expand-hint">▼ Click para más info</span>
                </li>
            </ul>
        `
    }
};

// Inicializar juego
function init() {
    countPellets();
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    closePanel.addEventListener('click', closeEducationalPanel);
    nextLevel.addEventListener('click', closeEducationalPanel);
    autoPilotBtn.addEventListener('click', toggleAutoPilot);
    clickCanvas.addEventListener('click', handleCanvasClick);
    clickCanvas.addEventListener('mousemove', handleCanvasHover);
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
    updateNextZoneIndicator();
    drawClickableZones();
}

// Manejar clic en el canvas
function handleCanvasClick(e) {
    const rect = clickCanvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convertir a coordenadas del grid
    const gridX = Math.floor(clickX / config.tileSize);
    const gridY = Math.floor(clickY / config.tileSize);
    
    console.log(`\n=== CLIC DETECTADO ===`);
    console.log(`Posición: X=${gridX}, Y=${gridY}`);
    console.log(`Celda: ${mazeMap[gridY]?.[gridX]}`);
    
    // Verificar si se hizo clic en una zona educativa
    if (gridY >= 0 && gridY < mazeMap.length && gridX >= 0 && gridX < mazeMap[0].length) {
        const cell = mazeMap[gridY][gridX];
        
        // Si es una zona educativa (3-7) y no ha sido visitada
        if (cell >= 3 && cell <= 7 && !gameState.visitedZones.has(cell)) {
            console.log(`✅ Zona ${cell} seleccionada`);
            console.log(`Posición jugador actual: X=${Math.floor(player.x / config.tileSize)}, Y=${Math.floor(player.y / config.tileSize)}`);
            console.log(`Objetivo: X=${gridX}, Y=${gridY}`);
            
            // Activar navegación automática hacia esta zona
            gameState.targetZone = cell;
            gameState.autoPilot = true;
            gameState.targetX = gridX * config.tileSize;  // Usar la posición exacta del clic
            gameState.targetY = gridY * config.tileSize;
            
            // Limpiar ruta anterior
            gameState.path = [];
            gameState.pathIndex = 0;
            
            console.log(`Objetivo en píxeles: X=${gameState.targetX}, Y=${gameState.targetY}`);
            console.log(`Piloto automático: ${gameState.autoPilot}`);
            
            const zoneName = zoneLocations[cell].name;
            const presenter = zoneLocations[cell].presenter;
            showNotification(`🎯 Navegando hacia ${zoneName} - ${presenter}`);
            playSound(600, 100);
            
            return;
        } else if (cell >= 3 && cell <= 7 && gameState.visitedZones.has(cell)) {
            showNotification('✅ Esta zona ya fue completada');
            playSound(300, 100);
        } else {
            showNotification('⚠️ Haz clic en una zona educativa (cuadros de colores)');
            playSound(200, 100);
        }
    }
}

// Dibujar zonas clicables (overlay invisible)
function drawClickableZones() {
    clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    
    // Dibujar indicadores visuales sobre las zonas
    for (let y = 0; y < mazeMap.length; y++) {
        for (let x = 0; x < mazeMap[y].length; x++) {
            const cell = mazeMap[y][x];
            
            if (cell >= 3 && cell <= 7 && !gameState.visitedZones.has(cell)) {
                const posX = x * config.tileSize;
                const posY = y * config.tileSize;
                
                // Dibujar borde brillante para indicar que es clicable
                clickCtx.strokeStyle = cell === gameState.targetZone ? '#ff0000' : 
                                       cell === getNextZone() ? '#ffff00' : '#ff00ff';
                clickCtx.lineWidth = 3;
                clickCtx.strokeRect(posX + 2, posY + 2, config.tileSize - 4, config.tileSize - 4);
            }
        }
    }
}

// Detectar hover sobre zonas
function handleCanvasHover(e) {
    const rect = clickCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const gridX = Math.floor(mouseX / config.tileSize);
    const gridY = Math.floor(mouseY / config.tileSize);
    
    if (gridY >= 0 && gridY < mazeMap.length && gridX >= 0 && gridX < mazeMap[0].length) {
        const cell = mazeMap[gridY][gridX];
        
        if (cell >= 3 && cell <= 7 && !gameState.visitedZones.has(cell)) {
            clickCanvas.style.cursor = 'pointer';
            return;
        }
    }
    
    clickCanvas.style.cursor = 'default';
}

// Alternar piloto automático
function toggleAutoPilot() {
    const nextZone = getNextZone();
    
    if (!nextZone) {
        showNotification('✅ Todas las zonas han sido visitadas');
        return;
    }
    
    console.log(`\n=== BOTÓN SIGUIENTE ZONA ===`);
    console.log(`Zona objetivo: ${nextZone}`);
    
    // Activar navegación automática a la siguiente zona
    const target = zoneLocations[nextZone];
    const targetGridX = Math.floor(target.x / config.tileSize);
    const targetGridY = Math.floor(target.y / config.tileSize);
    
    gameState.targetZone = nextZone;
    gameState.autoPilot = true;
    gameState.targetX = targetGridX * config.tileSize;
    gameState.targetY = targetGridY * config.tileSize;
    
    // Forzar dirección inicial
    const dx = gameState.targetX - player.x;
    const dy = gameState.targetY - player.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        player.nextDirection = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    } else {
        player.nextDirection = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
    }
    
    console.log(`Objetivo: X=${gameState.targetX}, Y=${gameState.targetY}`);
    console.log(`Piloto automático activado: ${gameState.autoPilot}`);
    
    showNotification(`🎯 Desplazándose hacia ${zoneLocations[nextZone].name} - ${zoneLocations[nextZone].presenter}`);
}

// Obtener siguiente zona no visitada
function getNextZone() {
    for (let zone = 3; zone <= 7; zone++) {
        if (!gameState.visitedZones.has(zone)) {
            return zone;
        }
    }
    return null;
}

// Actualizar indicador de siguiente zona
function updateNextZoneIndicator() {
    const nextZone = getNextZone();
    if (nextZone && zoneLocations[nextZone]) {
        const location = zoneLocations[nextZone];
        document.getElementById('nextZoneName').textContent = `Siguiente: ${location.name}`;
        document.getElementById('nextZonePresenter').textContent = `👤 ${location.presenter}`;
        nextZoneIndicator.style.display = 'block';
    } else {
        nextZoneIndicator.style.display = 'none';
    }
}

// Algoritmo BFS (Breadth-First Search) para encontrar el camino más corto
function findPath(startX, startY, targetX, targetY) {
    const startGridX = Math.floor(startX / config.tileSize);
    const startGridY = Math.floor(startY / config.tileSize);
    const targetGridX = Math.floor(targetX / config.tileSize);
    const targetGridY = Math.floor(targetY / config.tileSize);
    
    // Cola para BFS
    const queue = [[startGridX, startGridY, []]];
    const visited = new Set();
    visited.add(`${startGridX},${startGridY}`);
    
    const directions = [
        [0, -1], // Arriba
        [0, 1],  // Abajo
        [-1, 0], // Izquierda
        [1, 0]   // Derecha
    ];
    
    while (queue.length > 0) {
        const [x, y, path] = queue.shift();
        
        // Si llegamos al objetivo
        if (x === targetGridX && y === targetGridY) {
            return path;
        }
        
        // Explorar vecinos
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            const key = `${newX},${newY}`;
            
            // Verificar límites y si no está visitado
            if (newY >= 0 && newY < mazeMap.length && 
                newX >= 0 && newX < mazeMap[0].length &&
                !visited.has(key) &&
                mazeMap[newY][newX] !== 0) {  // No es pared
                
                visited.add(key);
                queue.push([newX, newY, [...path, [newX, newY]]]);
            }
        }
    }
    
    return [];
}

// Verificar si el jugador llegó a la zona objetivo en piloto automático
function checkAutoPilotZoneReached() {
    const playerCenterX = player.x + (config.tileSize - 6) / 2;
    const playerCenterY = player.y + (config.tileSize - 6) / 2;
    const playerGridX = Math.floor(playerCenterX / config.tileSize);
    const playerGridY = Math.floor(playerCenterY / config.tileSize);
    const currentCell = mazeMap[playerGridY]?.[playerGridX];
    
    // Si el jugador está en la zona objetivo
    if (currentCell === gameState.targetZone && !gameState.visitedZones.has(gameState.targetZone)) {
        console.log(`✅ ¡ZONA ALCANZADA! Zona ${gameState.targetZone} en posición (${playerGridX}, ${playerGridY})`);
        
        // Desactivar piloto automático
        gameState.autoPilot = false;
        
        // Detener movimiento
        player.direction = { x: 0, y: 0 };
        player.nextDirection = { x: 0, y: 0 };
        
        // Marcar zona como visitada
        const targetZone = gameState.targetZone;
        gameState.visitedZones.add(targetZone);
        gameState.currentZone = targetZone;
        gameState.levelsCompleted++;
        
        // Mostrar panel educativo
        showEducationalPanel(targetZone);
        updateNextZoneIndicator();
        
        // NO terminar el juego automáticamente - esperar a que el usuario cierre el panel
        
        // Limpiar objetivo
        gameState.targetX = null;
        gameState.targetY = null;
        gameState.targetZone = null;
        gameState.path = [];
        gameState.pathIndex = 0;
    }
}

// Movimiento automático siguiendo la ruta calculada
function autoPilotMovement() {
    if (!gameState.autoPilot || gameState.targetX === null || gameState.targetY === null) {
        return;
    }
    
    // Obtener posición actual en grid
    const playerGridX = Math.floor((player.x + config.tileSize / 2) / config.tileSize);
    const playerGridY = Math.floor((player.y + config.tileSize / 2) / config.tileSize);
    const targetGridX = Math.floor(gameState.targetX / config.tileSize);
    const targetGridY = Math.floor(gameState.targetY / config.tileSize);
    
    // Calcular diferencias en píxeles
    const dx = gameState.targetX - player.x;
    const dy = gameState.targetY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Si está muy cerca, moverse directamente
    if (distance < config.tileSize * 1.5) {
        if (Math.abs(dx) > 5) {
            player.nextDirection = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
            player.direction = { ...player.nextDirection };
        } else if (Math.abs(dy) > 5) {
            player.nextDirection = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
            player.direction = { ...player.nextDirection };
        }
        return;
    }
    
    // Si no hay ruta calculada, calcular una nueva
    if (gameState.path.length === 0) {
        const path = findPath(player.x, player.y, gameState.targetX, gameState.targetY);
        
        if (path.length === 0) {
            console.log('⚠️ Sin ruta - Movimiento directo');
            // Movimiento directo cuando no hay ruta
            if (Math.abs(dx) > Math.abs(dy)) {
                player.nextDirection = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
            } else {
                player.nextDirection = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
            }
            player.direction = { ...player.nextDirection };
            return;
        }
        
        console.log(`✅ Ruta calculada: ${path.length} pasos`);
        gameState.path = path;
        gameState.pathIndex = 0;
    }
    
    // Seguir la ruta - NO recalcular hasta completarla
    if (gameState.pathIndex < gameState.path.length) {
        const [nextGridX, nextGridY] = gameState.path[gameState.pathIndex];
        const nextPixelX = nextGridX * config.tileSize;
        const nextPixelY = nextGridY * config.tileSize;
        
        const stepDx = nextPixelX - player.x;
        const stepDy = nextPixelY - player.y;
        const stepDistance = Math.sqrt(stepDx * stepDx + stepDy * stepDy);
        
        // Si llegó al punto actual, avanzar al siguiente
        if (stepDistance < config.tileSize / 3) {
            gameState.pathIndex++;
            if (gameState.pathIndex >= gameState.path.length) {
                // Ruta completada, limpiar para recalcular
                gameState.path = [];
                gameState.pathIndex = 0;
            }
        } else {
            // Moverse hacia el siguiente punto - mantener la dirección
            if (Math.abs(stepDx) > Math.abs(stepDy)) {
                player.nextDirection = stepDx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
            } else {
                player.nextDirection = stepDy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
            }
            player.direction = { ...player.nextDirection };
        }
    } else {
        // Si completó la ruta, limpiar para recalcular
        gameState.path = [];
        gameState.pathIndex = 0;
    }
}

// Crear partículas
function createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 1,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

// Actualizar partículas
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy += 0.1; // Gravedad
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Dibujar partículas
function drawParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
        particleCtx.globalAlpha = p.life;
        particleCtx.fillStyle = p.color;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        particleCtx.fill();
    });
    particleCtx.globalAlpha = 1;
}

// Mostrar notificación
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notifications.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// Mostrar combo
function showCombo() {
    if (gameState.combo >= 5) {
        const comboText = document.getElementById('comboText');
        comboText.textContent = `COMBO x${gameState.combo}!`;
        comboIndicator.classList.add('show');
        
        setTimeout(() => {
            comboIndicator.classList.remove('show');
        }, 500);
    }
}

// Reproducir sonido (simulado con Web Audio API)
function playSound(frequency, duration = 100) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        // Silenciar errores de audio
    }
}

// Contar pellets totales
function countPellets() {
    gameState.totalPellets = 0;
    for (let row of mazeMap) {
        for (let cell of row) {
            if (cell === 2) gameState.totalPellets++;
        }
    }
}

// Iniciar juego
function startGame() {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    gameLoop();
}

// Reiniciar juego
function restartGame() {
    // Resetear estado
    gameState.score = 0;
    gameState.level = 1;
    gameState.collectedPellets = 0;
    gameState.lives = 3;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.levelsCompleted = 0;
    gameState.visitedZones.clear();
    gameState.path = [];
    gameState.pathIndex = 0;
    player.x = 14 * config.tileSize;  // Centro
    player.y = 10 * config.tileSize;  // Centro
    player.direction = { x: 0, y: 0 };
    player.nextDirection = { x: 0, y: 0 };
    
    // Limpiar partículas
    particles.length = 0;
    
    // Restaurar pellets
    for (let y = 0; y < mazeMap.length; y++) {
        for (let x = 0; x < mazeMap[y].length; x++) {
            if (mazeMap[y][x] >= 3 && mazeMap[y][x] <= 7) {
                // Las zonas educativas se mantienen
            } else if (mazeMap[y][x] === 1) {
                mazeMap[y][x] = 2; // Restaurar pellets
            }
        }
    }
    
    countPellets();
    endScreen.classList.remove('active');
    startGame();
}

// Manejar teclas
function handleKeyPress(e) {
    if (gameState.isPaused) return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            player.nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            e.preventDefault();
            player.nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            e.preventDefault();
            player.nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            e.preventDefault();
            player.nextDirection = { x: 1, y: 0 };
            break;
        case ' ':
            e.preventDefault();
            gameState.turboActive = true;
            break;
    }
}

function handleKeyUp(e) {
    if (e.key === ' ') {
        gameState.turboActive = false;
    }
}

// Verificar colisión con pared
function canMove(x, y) {
    // Usar el centro del jugador para la verificación
    const centerX = x + (config.tileSize - 6) / 2;
    const centerY = y + (config.tileSize - 6) / 2;
    
    const gridX = Math.floor(centerX / config.tileSize);
    const gridY = Math.floor(centerY / config.tileSize);
    
    if (gridY < 0 || gridY >= mazeMap.length || gridX < 0 || gridX >= mazeMap[0].length) {
        return false;
    }
    
    return mazeMap[gridY][gridX] !== 0;
}

// Actualizar jugador
function updatePlayer() {
    // Piloto automático - desplazamiento hacia zona objetivo
    if (gameState.autoPilot && !gameState.isPaused) {
        autoPilotMovement();
    }
    
    // Velocidad según el modo
    let speed;
    if (gameState.autoPilot) {
        speed = config.autoPilotSpeed;  // Velocidad moderada para navegación
    } else if (gameState.turboActive) {
        speed = config.playerSpeed * config.turboMultiplier;
    } else {
        speed = config.playerSpeed;
    }
    
    // Intentar cambiar dirección
    const nextX = player.x + player.nextDirection.x * speed;
    const nextY = player.y + player.nextDirection.y * speed;
    
    if (canMove(nextX, nextY)) {
        player.direction = { ...player.nextDirection };
    }
    
    // Mover en la dirección actual
    const newX = player.x + player.direction.x * speed;
    const newY = player.y + player.direction.y * speed;
    
    const canMoveResult = canMove(newX, newY);
    
    // Log de debug ocasional
    if (gameState.autoPilot && Math.random() < 0.02) {
        console.log(`🔧 Pos: (${player.x.toFixed(1)},${player.y.toFixed(1)}), Dir: (${player.direction.x},${player.direction.y}), NewPos: (${newX.toFixed(1)},${newY.toFixed(1)}), CanMove: ${canMoveResult}`);
    }
    
    if (canMoveResult) {
        player.x = newX;
        player.y = newY;
    } else if (gameState.autoPilot) {
        // Si está bloqueado en piloto automático, recalcular ruta
        if (Math.random() < 0.02) {
            console.log('⚠️ Bloqueado, recalculando ruta');
        }
        gameState.path = [];
        gameState.pathIndex = 0;
    }
    
    // Verificar colisión con pellets y zonas
    checkCollisions();
    
    // VERIFICACIÓN ADICIONAL: Si está en piloto automático, verificar si llegó a la zona
    if (gameState.autoPilot && gameState.targetZone) {
        checkAutoPilotZoneReached();
    }
    
    // Verificar colisión con fantasmas (solo si no está en piloto automático)
    if (!gameState.autoPilot) {
        checkGhostCollision();
    }
}

// Verificar colisiones
function checkCollisions() {
    const gridX = Math.floor(player.x / config.tileSize);
    const gridY = Math.floor(player.y / config.tileSize);
    const cell = mazeMap[gridY][gridX];
    
    // Recoger pellet
    if (cell === 2) {
        mazeMap[gridY][gridX] = 1;
        
        // Sistema de combo
        gameState.combo++;
        if (gameState.combo > gameState.maxCombo) {
            gameState.maxCombo = gameState.combo;
        }
        
        clearTimeout(gameState.comboTimer);
        gameState.comboTimer = setTimeout(() => {
            gameState.combo = 0;
        }, 2000);
        
        const points = config.pelletPoints * Math.max(1, Math.floor(gameState.combo / 5));
        gameState.score += points;
        gameState.collectedPellets++;
        
        // Efectos
        createParticles(player.x + config.tileSize / 2, player.y + config.tileSize / 2, '#ffff00', 8);
        playSound(440 + gameState.combo * 20, 50);
        showCombo();
        
        updateHUD();
    }
    
    // Zona educativa (5 zonas para 5 presentadores)
    if (cell >= 3 && cell <= 7 && !gameState.visitedZones.has(cell)) {
        gameState.visitedZones.add(cell);
        gameState.currentZone = cell;
        gameState.levelsCompleted++;
        
        console.log(`✅ Zona visitada: ${cell}, Total visitadas: ${gameState.visitedZones.size}/5`);
        
        showEducationalPanel(cell);
        updateNextZoneIndicator();
        
        // NO terminar el juego automáticamente - esperar a que el usuario cierre el panel
    }
}

// Verificar colisión con fantasmas
function checkGhostCollision() {
    ghosts.forEach(ghost => {
        const dx = player.x - ghost.x;
        const dy = player.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.tileSize - 5) {
            // Colisión con fantasma
            gameState.lives--;
            updateHUD();
            
            if (gameState.lives <= 0) {
                endGame();
            } else {
                // Resetear posición del jugador
                player.x = 1 * config.tileSize;
                player.y = 1 * config.tileSize;
                player.direction = { x: 0, y: 0 };
                
                createParticles(player.x + config.tileSize / 2, player.y + config.tileSize / 2, '#ff0000', 20);
                playSound(200, 200);
                showNotification('¡Perdiste una vida!');
            }
        }
    });
}

// Mostrar panel educativo
function showEducationalPanel(zone) {
    gameState.isPaused = true;
    const content = educationalContent[zone];
    
    document.getElementById('panelTitle').textContent = content.title;
    
    // Actualizar el presentador en el lugar correcto
    const presenterDiv = document.getElementById('panelPresenter');
    if (presenterDiv) {
        presenterDiv.textContent = content.presenter;
    }
    
    document.getElementById('panelContent').innerHTML = content.content;
    
    educationalPanel.classList.add('show');
    
    // Añadir funcionalidad de clic a los elementos de la lista
    setTimeout(() => {
        const listItems = document.querySelectorAll('.interactive-list li');
        listItems.forEach(item => {
            item.addEventListener('click', function() {
                const detail = this.getAttribute('data-detail');
                const isExpanded = this.classList.contains('expanded');
                
                // Cerrar todos los demás elementos
                listItems.forEach(li => {
                    li.classList.remove('expanded');
                    const existingDetail = li.querySelector('.detail-text');
                    if (existingDetail) {
                        existingDetail.remove();
                    }
                });
                
                if (!isExpanded && detail) {
                    // Expandir este elemento
                    this.classList.add('expanded');
                    const detailDiv = document.createElement('div');
                    detailDiv.className = 'detail-text';
                    detailDiv.textContent = detail;
                    this.appendChild(detailDiv);
                    
                    // Sonido de expansión
                    playSound(800, 100);
                    
                    // Scroll suave al elemento expandido
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    // Sonido de cierre
                    playSound(600, 80);
                }
            });
        });
    }, 300);
    
    // Añadir puntos por aprender
    gameState.score += config.educationalZonePoints;
    gameState.level = zone - 2;
    
    // Efectos épicos
    createParticles(player.x + config.tileSize / 2, player.y + config.tileSize / 2, '#ff00ff', 50);
    
    // Sonido de nivel desbloqueado
    playLevelUpSound();
    
    showNotification(`🎓 ¡Nivel ${gameState.level} desbloqueado! +${config.educationalZonePoints} puntos`);
    
    updateHUD();
}

// Sonido de subida de nivel
function playLevelUpSound() {
    const melody = [523, 659, 784, 1047];
    melody.forEach((freq, i) => {
        setTimeout(() => playSound(freq, 150), i * 100);
    });
}

// Cerrar panel educativo
function closeEducationalPanel() {
    educationalPanel.classList.remove('show');
    gameState.isPaused = false;
    
    // Verificar si completó los 5 niveles DESPUÉS de cerrar el panel
    if (gameState.visitedZones.size >= 5) {
        console.log('🎉 ¡Todos los niveles completados! Finalizando juego...');
        showNotification('🎉 ¡Has completado los 5 niveles! La exposición ha terminado');
        setTimeout(() => {
            endGame();
        }, 2000);
    } else {
        // Actualizar indicador de siguiente zona
        updateNextZoneIndicator();
        
        // Redibujar zonas clicables
        drawClickableZones();
    }
}

// Actualizar fantasmas
function updateGhosts() {
    ghosts.forEach(ghost => {
        const newX = ghost.x + ghost.direction.x * config.ghostSpeed;
        const newY = ghost.y + ghost.direction.y * config.ghostSpeed;
        
        if (canMove(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;
        } else {
            // Cambiar dirección aleatoria
            const directions = [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 }
            ];
            ghost.direction = directions[Math.floor(Math.random() * directions.length)];
        }
    });
}

// Dibujar laberinto
function drawMaze() {
    for (let y = 0; y < mazeMap.length; y++) {
        for (let x = 0; x < mazeMap[y].length; x++) {
            const cell = mazeMap[y][x];
            const posX = x * config.tileSize;
            const posY = y * config.tileSize;
            
            if (cell === 0) {
                // Pared
                ctx.fillStyle = '#0000ff';
                ctx.fillRect(posX, posY, config.tileSize, config.tileSize);
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, posY, config.tileSize, config.tileSize);
            } else if (cell === 2) {
                // Pellet
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(posX + config.tileSize / 2, posY + config.tileSize / 2, 4, 0, Math.PI * 2);
                ctx.fill();
            } else if (cell >= 3 && cell <= 7) {
                // Zona educativa
                const isVisited = gameState.visitedZones.has(cell);
                const isNext = cell === getNextZone();
                const isTarget = cell === gameState.targetZone;
                
                if (isVisited) {
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                    ctx.strokeStyle = '#00ff00';
                } else if (isTarget) {
                    // Zona objetivo (pulsante)
                    const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.6;
                    ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
                    ctx.strokeStyle = '#ff0000';
                } else if (isNext) {
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
                    ctx.strokeStyle = '#ffff00';
                } else {
                    ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                    ctx.strokeStyle = '#ff00ff';
                }
                
                ctx.fillRect(posX, posY, config.tileSize, config.tileSize);
                ctx.lineWidth = (isNext || isTarget) ? 3 : 2;
                ctx.strokeRect(posX, posY, config.tileSize, config.tileSize);
                
                // Indicador visual
                if (!isVisited) {
                    ctx.fillStyle = isTarget ? '#ff0000' : (isNext ? '#ffff00' : '#ff00ff');
                    ctx.font = 'bold 20px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    if (isTarget) {
                        ctx.fillText('🎯', posX + config.tileSize / 2, posY + config.tileSize / 2);
                    } else if (isNext) {
                        ctx.fillText('!', posX + config.tileSize / 2, posY + config.tileSize / 2);
                    } else {
                        // Mostrar número de nivel
                        const levelNum = cell - 2;
                        ctx.font = 'bold 16px Arial';
                        ctx.fillText(levelNum, posX + config.tileSize / 2, posY + config.tileSize / 2);
                    }
                } else {
                    ctx.fillStyle = '#00ff00';
                    ctx.font = 'bold 18px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('✓', posX + config.tileSize / 2, posY + config.tileSize / 2);
                }
            }
        }
    }
}

// Dibujar jugador
function drawPlayer() {
    // Efecto visual durante navegación automática
    if (gameState.autoPilot) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#00ffff';
        
        // Estela de navegación automática
        for (let i = 1; i <= 4; i++) {
            ctx.globalAlpha = 0.4 / i;
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(
                player.x + config.tileSize / 2 - player.direction.x * i * 4,
                player.y + config.tileSize / 2 - player.direction.y * i * 4,
                player.size / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    
    // Efecto de turbo
    if (gameState.turboActive) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ffff00';
        
        // Estela de turbo
        for (let i = 1; i <= 3; i++) {
            ctx.globalAlpha = 0.3 / i;
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(
                player.x + config.tileSize / 2 - player.direction.x * i * 5,
                player.y + config.tileSize / 2 - player.direction.y * i * 5,
                player.size / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.beginPath();
    
    // Determinar ángulo según dirección
    let startAngle = 0.2 * Math.PI;
    let endAngle = 1.8 * Math.PI;
    
    if (player.direction.x > 0) { // Derecha
        startAngle = 0.2 * Math.PI;
        endAngle = 1.8 * Math.PI;
    } else if (player.direction.x < 0) { // Izquierda
        startAngle = 1.2 * Math.PI;
        endAngle = 0.8 * Math.PI;
    } else if (player.direction.y > 0) { // Abajo
        startAngle = 0.7 * Math.PI;
        endAngle = 0.3 * Math.PI;
    } else if (player.direction.y < 0) { // Arriba
        startAngle = 1.7 * Math.PI;
        endAngle = 1.3 * Math.PI;
    }
    
    ctx.arc(player.x + config.tileSize / 2, player.y + config.tileSize / 2, player.size / 2, startAngle, endAngle);
    ctx.lineTo(player.x + config.tileSize / 2, player.y + config.tileSize / 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Dibujar fantasmas
function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ghost.color;
        
        // Cuerpo del fantasma
        ctx.beginPath();
        ctx.arc(ghost.x + config.tileSize / 2, ghost.y + config.tileSize / 2, config.tileSize / 2 - 3, Math.PI, 0, false);
        ctx.lineTo(ghost.x + config.tileSize - 3, ghost.y + config.tileSize - 3);
        ctx.lineTo(ghost.x + config.tileSize - 8, ghost.y + config.tileSize / 2 + 5);
        ctx.lineTo(ghost.x + config.tileSize / 2, ghost.y + config.tileSize - 3);
        ctx.lineTo(ghost.x + 8, ghost.y + config.tileSize / 2 + 5);
        ctx.lineTo(ghost.x + 3, ghost.y + config.tileSize - 3);
        ctx.closePath();
        ctx.fill();
        
        // Ojos
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ghost.x + config.tileSize / 2 - 5, ghost.y + config.tileSize / 2 - 2, 3, 0, Math.PI * 2);
        ctx.arc(ghost.x + config.tileSize / 2 + 5, ghost.y + config.tileSize / 2 - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    });
}

// Actualizar HUD
function updateHUD() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;
    
    // Actualizar vidas
    const hearts = '❤️'.repeat(gameState.lives);
    document.getElementById('lives').textContent = hearts || '💀';
    
    const progress = (gameState.collectedPellets / gameState.totalPellets) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Finalizar juego
function endGame() {
    // Crear explosión de partículas de victoria
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createParticles(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                ['#ffff00', '#00ffff', '#ff00ff'][Math.floor(Math.random() * 3)],
                5
            );
        }, i * 20);
    }
    
    // Sonido de victoria
    playVictorySound();
    
    // Mostrar pantalla final
    setTimeout(() => {
        gameScreen.classList.remove('active');
        endScreen.classList.add('active');
        
        // Actualizar estadísticas
        document.getElementById('finalScore').textContent = gameState.score;
        document.getElementById('levelsCompleted').textContent = gameState.levelsCompleted;
        document.getElementById('pelletsCollected').textContent = gameState.collectedPellets;
        document.getElementById('maxCombo').textContent = gameState.maxCombo;
    }, 1500);
}

// Sonido de victoria
function playVictorySound() {
    const notes = [523, 587, 659, 698, 784, 880, 988];
    notes.forEach((freq, i) => {
        setTimeout(() => playSound(freq, 200), i * 150);
    });
}

// Loop principal del juego
function gameLoop() {
    if (!gameState.isPaused) {
        updatePlayer();
        updateGhosts();
        updateParticles();
    }
    
    // Dibujar
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawMaze();
    drawPlayer();
    drawGhosts();
    drawParticles();
    drawClickableZones(); // Actualizar overlay de zonas clicables
    
    if (gameScreen.classList.contains('active')) {
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar cuando cargue la página
window.addEventListener('load', init);

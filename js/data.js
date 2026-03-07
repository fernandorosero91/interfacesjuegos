// ============================================================
// DATA — 5 MÓDULOS
// ============================================================
const MODULES = [
  {
    id: 1,
    icon: '💎',
    scenarioName: 'CYBER CITY',
    modTag: 'MÓDULO 01',
    title: 'Diseño de Interfaces para Juegos',
    question: '¿Cómo ayudan las interfaces para juegos a mejorar la experiencia del usuario?',
    game: 'collector',
    gameInstructions: 'MUÉVETE CON FLECHAS O WASD • RECOGE EL CRISTAL • EVITA LOS DRONES',
    gameObjective: '💎 Recoge el cristal azul',
    color: '#00f5ff',
    content: [
      {
        type: 'intro',
        title: '¿Qué es una Game UI?',
        text: 'La interfaz de usuario en videojuegos (Game UI) es el conjunto de elementos visuales, auditivos e interactivos que comunican información al jugador y le permiten tomar decisiones. Es el puente entre el jugador y el mundo virtual, traduce datos complejos en señales comprensibles al instante.'
      },
      {
        type: 'list',
        title: 'Cómo mejoran la experiencia',
        items: [
          'Reducen la carga cognitiva: presentan la información esencial sin saturar la pantalla, permitiendo al jugador enfocarse en el gameplay.',
          'Generan inmersión: las interfaces bien diseñadas se integran naturalmente al mundo del juego, manteniendo la ilusión sin interrupciones.',
          'Comunican estado del juego: vida, munición, objetivos, tiempo — todo accesible de un vistazo sin pausar la acción.',
          'Orientan la toma de decisiones: indicadores claros guían al jugador hacia acciones correctas en momentos críticos.',
          'Crean identidad visual: la UI refuerza el estilo artístico del juego, haciendo cada título reconocible y memorable.'
        ]
      },
      {
        type: 'highlight',
        text: '💡 Estadística clave: El 73% de los jugadores reporta que una UI confusa o mal diseñada es la principal razón para abandonar un juego en las primeras 30 minutos de juego.'
      }
    ]
  },
  {
    id: 2,
    icon: '⚔️',
    scenarioName: 'DUNGEON PROFUNDO',
    modTag: 'MÓDULO 02',
    title: 'Ventajas de las Interfaces para Juegos',
    question: '¿Cuáles son las principales ventajas de una buena interfaz de juego para los usuarios?',
    game: 'maze',
    gameInstructions: 'NAVEGA EL LABERINTO • LLEGA A LA SALIDA MARCADA CON ⚔️',
    gameObjective: '⚔️ Encuentra la salida del dungeon',
    color: '#ff6600',
    content: [
      {
        type: 'intro',
        title: 'Ventajas fundamentales',
        text: 'Una UI bien construida no es solo estética: es funcionalidad pura. Las ventajas se extienden tanto al jugador como al desarrollador, creando un ecosistema donde el diseño trabaja a favor del juego.'
      },
      {
        type: 'list',
        title: 'Ventajas principales',
        items: [
          'Aprendizaje acelerado: el jugador comprende los mecánismos del juego más rápido con una UI intuitiva, reduciendo el tiempo de tutorial.',
          'Mayor retención: los jugadores permanecen más tiempo en juegos con interfaces claras. Un buen HUD reduce la frustración y prolonga sesiones.',
          'Accesibilidad ampliada: diseños inclusivos con opciones de daltonismo, tamaño de texto y contraste abren el juego a más audiencias.',
          'Satisfacción de feedback: cada acción del jugador recibe una respuesta visual o auditiva, creando un ciclo de gratificación constante.',
          'Reducción de errores: indicadores claros previenen acciones no deseadas, como usar el item equivocado en un momento crítico.',
          'Confianza en el sistema: cuando el jugador entiende la UI, confía en el juego y se siente en control de sus decisiones.'
        ]
      },
      {
        type: 'highlight',
        text: '🎮 Dato de industria: Los juegos con UI clasificada como "excelente" por sus usuarios tienen un 40% más de probabilidad de recibir reseñas positivas y recomendaciones.'
      }
    ]
  },
  {
    id: 3,
    icon: '🌟',
    scenarioName: 'ESPACIO PROFUNDO',
    modTag: 'MÓDULO 03',
    title: 'Buenas Prácticas en Interfaces para Juegos',
    question: '¿Cuáles son las buenas prácticas en el diseño de interfaces para videojuegos?',
    game: 'shooter',
    gameInstructions: 'DISPARA CON ESPACIO • MUÉVETE CON FLECHAS • DESTRUYE ASTEROIDES • RECOGE LA ESTRELLA',
    gameObjective: '🌟 Destruye todo y recoge la estrella',
    color: '#ff00ff',
    content: [
      {
        type: 'intro',
        title: 'Principios del buen diseño',
        text: 'Las buenas prácticas en Game UI nacen de la intersección entre diseño UX, psicología cognitiva y comprensión profunda del gameplay. No se trata de seguir reglas, sino de entender por qué cada decisión de diseño afecta la experiencia del jugador.'
      },
      {
        type: 'list',
        title: 'Las 8 reglas de oro',
        items: [
          'Claridad ante todo: el jugador nunca debe dudar sobre qué significa un elemento de la UI. Si hay confusión, hay un problema de diseño.',
          'Consistencia visual: colores, iconografía y tipografías deben seguir un sistema coherente en toda la interfaz.',
          'Jerarquía de información: la información más crítica (vida, tiempo) debe ser más visible que la secundaria (puntuación, estadísticas).',
          'Feedback inmediato: toda acción debe tener respuesta visual en menos de 100ms para que el cerebro la asocie como consecuencia.',
          'Mínima fricción: la UI no debe requerir más de 2-3 clics para acceder a cualquier función importante.',
          'Diseño contextual: la UI debe adaptarse al estado del juego, mostrando más información en momentos de calma y menos en combate.',
          'Prueba con usuarios reales: el juicio del diseñador no reemplaza las pruebas con jugadores reales de diferentes perfiles.',
          'Prototipa antes de implementar: los wireframes y mockups permiten validar decisiones antes de invertir tiempo en desarrollo.'
        ]
      },
      {
        type: 'highlight',
        text: '⚡ Regla fundamental: "La mejor UI es la que no se nota". Cuando el jugador está completamente inmerso y no piensa en la interfaz, el diseñador ha logrado su objetivo.'
      }
    ]
  },
  {
    id: 4,
    icon: '🔮',
    scenarioName: 'PLATAFORMAS NEON',
    modTag: 'MÓDULO 04',
    title: 'Ejemplos Icónicos de Interfaces para Juegos',
    question: '¿Cuáles son los ejemplos más icónicos de interfaces en videojuegos?',
    game: 'platformer',
    gameInstructions: 'MUÉVETE CON FLECHAS • SALTA CON Z O ESPACIO • LLEGA AL ORBE',
    gameObjective: '🔮 Salta hasta el orbe mágico',
    color: '#00ff88',
    content: [
      {
        type: 'intro',
        title: 'Referentes históricos',
        text: 'La historia del diseño de interfaces en videojuegos está llena de momentos revolucionarios donde un solo juego cambió para siempre la forma en que los demás diseñaban sus interfaces.'
      },
      {
        type: 'examples',
        title: 'Casos icónicos',
        items: [
          { icon: '🔴', title: 'Dead Space', desc: 'El HUD integrado en el personaje (barra de vida en la columna vertebral) revolucionó la UI diegética — sin romper la inmersión.' },
          { icon: '🟡', title: 'The Last of Us', desc: 'UI minimalista extrema que muestra solo lo esencial. Las animaciones del personaje comunican el estado de salud sin barras visibles.' },
          { icon: '🔵', title: 'Metroid Prime', desc: 'El visor del casco crea una UI completamente diegética donde el jugador ve lo que ve el personaje.' },
          { icon: '🟢', title: 'Super Mario Bros', desc: 'Inventó el lenguaje visual de videojuegos: barras de vida con bloques, monedas contadas, tiempo con números. Base de toda UI moderna.' },
          { icon: '🟣', title: 'Dark Souls', desc: 'Minimal HUD que confía en el jugador. La información de estado se muestra solo cuando es relevante, respetando la inteligencia del jugador.' },
          { icon: '⚪', title: 'Monument Valley', desc: 'UI invisible: no tiene botones ni indicadores. El nivel entero es la interfaz. Redefinió qué puede ser una game UI.' }
        ]
      },
      {
        type: 'highlight',
        text: '🏆 La UI diegética (integrada en el mundo del juego) es la tendencia más influyente del diseño moderno. Dead Space, publicado en 2008, sigue siendo el referente que todos los diseñadores estudian.'
      }
    ]
  },
  {
    id: 5,
    icon: '⚡',
    scenarioName: 'REACTOR DIGITAL',
    modTag: 'MÓDULO 05',
    title: 'Herramientas para Diseñar Interfaces de Juegos',
    question: '¿Qué herramientas se utilizan para diseñar interfaces de videojuegos?',
    game: 'runner',
    gameInstructions: 'SALTA CON ESPACIO O FLECHA ARRIBA • ESQUIVA OBSTÁCULOS • RECOGE LA ENERGÍA',
    gameObjective: '⚡ Recoge el núcleo de energía',
    color: '#ffd700',
    content: [
      {
        type: 'intro',
        title: 'El arsenal del diseñador',
        text: 'Los profesionales del diseño de Game UI trabajan con un conjunto específico de herramientas que van desde el diseño visual hasta el prototipado interactivo y la implementación en motores de juego. El dominio de estas herramientas es esencial para un pipeline eficiente.'
      },
      {
        type: 'tools',
        title: 'Herramientas esenciales',
        items: [
          { icon: '🎨', name: 'FIGMA', category: 'Diseño UI/Prototipado' },
          { icon: '✏️', name: 'ADOBE XD', category: 'Diseño & Wireframes' },
          { icon: '🖼️', name: 'PHOTOSHOP', category: 'Assets gráficos' },
          { icon: '📐', name: 'ILLUSTRATOR', category: 'Iconografía & Vectores' },
          { icon: '🎮', name: 'UNITY UI', category: 'Implementación en juego' },
          { icon: '🔧', name: 'UNREAL UMG', category: 'UI en Unreal Engine' },
          { icon: '🌊', name: 'SPINE 2D', category: 'Animación de UI' },
          { icon: '📱', name: 'ZEPLIN', category: 'Handoff a desarrollo' }
        ]
      },
      {
        type: 'list',
        title: 'Flujo de trabajo profesional',
        items: [
          'Investigación y referentes: análisis de UIs existentes, benchmarking con la competencia y definición del estilo visual del juego.',
          'Wireframing: bocetos de baja fidelidad para validar la estructura y flujo de información antes de invertir en diseño visual.',
          'Diseño visual en Figma/XD: creación de mockups de alta fidelidad con el sistema de diseño completo (colores, tipografías, componentes).',
          'Prototipado interactivo: simulación del comportamiento de la UI con animaciones y transiciones para validar con el equipo.',
          'Implementación en motor: exportación de assets y recreación en Unity Canvas, Unreal UMG o el motor específico del proyecto.',
          'Testing y iteración: pruebas de usabilidad con jugadores reales y ajustes basados en datos de analítica y feedback cualitativo.'
        ]
      },
      {
        type: 'highlight',
        text: '💼 Pipeline moderno: Figma para diseño → Zeplin para handoff → Unity/Unreal para implementación → Spine 2D para animaciones complejas. Este flujo es el estándar en estudios AAA y mid-size.'
      }
    ]
  }
];
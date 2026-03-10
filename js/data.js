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
        text: 'La Game UI es el conjunto de elementos visuales e interactivos que comunican información al jugador. Es el puente entre el jugador y el mundo virtual.'
      },
      {
        type: 'list',
        title: 'Cómo mejoran la experiencia',
        items: [
          'Reducen la carga cognitiva: presentan solo la información esencial.',
          'Generan inmersión: se integran al mundo del juego sin interrupciones.',
          'Comunican estado: vida, munición y objetivos accesibles de un vistazo.',
          'Orientan decisiones: indicadores claros guían al jugador en momentos críticos.',
          'Crean identidad visual: refuerzan el estilo artístico del juego.'
        ]
      },
      {
        type: 'highlight',
        text: '💡 El 73% de los jugadores abandona un juego en los primeros 30 minutos si la UI es confusa.'
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
        text: 'Una UI bien construida no es solo estética: es funcionalidad pura. Sus ventajas benefician tanto al jugador como al desarrollador.'
      },
      {
        type: 'list',
        title: 'Ventajas principales',
        items: [
          'Aprendizaje acelerado: el jugador comprende los mecánismos más rápido, reduciendo el tutorial.',
          'Mayor retención: interfaces claras reducen la frustración y prolongan sesiones de juego.',
          'Accesibilidad ampliada: opciones de daltonismo, tamaño de texto y contraste llegan a más audiencias.',
          'Feedback satisfactorio: cada acción recibe respuesta visual o auditiva, creando ciclos de gratificación.',
          'Reducción de errores: indicadores claros previenen acciones no deseadas en momentos críticos.',
          'Confianza en el sistema: cuando el jugador entiende la UI, se siente en control.'
        ]
      },
      {
        type: 'highlight',
        text: '🎮 Los juegos con UI "excelente" tienen un 40% más de probabilidad de recibir reseñas positivas.'
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
        text: 'Las buenas prácticas en Game UI nacen de la intersección entre diseño UX y psicología cognitiva. Cada decisión de diseño afecta directamente la experiencia del jugador.'
      },
      {
        type: 'list',
        title: 'Las 8 reglas de oro',
        items: [
          'Claridad ante todo: el jugador nunca debe dudar sobre qué significa un elemento.',
          'Consistencia visual: colores, iconos y tipografías siguen un sistema coherente.',
          'Jerarquía de información: lo más crítico (vida, tiempo) debe ser más visible.',
          'Feedback inmediato: toda acción debe tener respuesta visual en menos de 100ms.',
          'Mínima fricción: máximo 2-3 clics para acceder a cualquier función importante.',
          'Diseño contextual: adaptar la UI al estado del juego (calma vs combate).',
          'Prueba con usuarios reales: el juicio del diseñador no reemplaza las pruebas reales.',
          'Prototipa antes de implementar: los wireframes validan decisiones antes del desarrollo.'
        ]
      },
      {
        type: 'highlight',
        text: "⚡ Regla de oro: La mejor UI es la que no se nota. Cuando el jugador está inmerso y no piensa en la interfaz, el diseñador logró su objetivo."
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
        text: 'La historia del diseño de interfaces en videojuegos tiene momentos revolucionarios donde un solo juego cambió la forma en que todos diseñaban sus UIs.'
      },
      {
        type: 'examples',
        title: 'Casos icónicos',
        items: [
          { icon: '🔴', title: 'Dead Space', desc: 'HUD integrado en el personaje (barra de vida en la columna vertebral). UI diegética sin romper la inmersión.' },
          { icon: '🟡', title: 'The Last of Us', desc: 'UI minimalista extrema. Las animaciones del personaje comunican salud sin barras visibles.' },
          { icon: '🔵', title: 'Metroid Prime', desc: 'El visor del casco es una UI diegética completa: el jugador ve lo que ve el personaje.' },
          { icon: '🟢', title: 'Super Mario Bros', desc: 'Inventó el lenguaje visual de videojuegos: barras de vida, monedas, tiempo. Base de toda UI moderna.' },
          { icon: '🟣', title: 'Dark Souls', desc: 'HUD minimal que muestra el estado solo cuando es relevante, respetando la inteligencia del jugador.' },
          { icon: '⚪', title: 'Monument Valley', desc: 'UI invisible: sin botones ni indicadores. El nivel entero es la interfaz.' }
        ]
      },
      {
        type: 'highlight',
        text: '🏆 La UI diegética es la tendencia más influyente del diseño moderno. Dead Space (2008) sigue siendo el referente que todos estudian.'
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
        text: 'Los profesionales del Game UI trabajan con herramientas específicas: desde diseño visual hasta prototipado e implementación en motores de juego.'
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
          'Investigación: análisis de UIs existentes y definición del estilo visual del juego.',
          'Wireframing: bocetos de baja fidelidad para validar estructura antes del diseño visual.',
          'Diseño en Figma/XD: mockups de alta fidelidad con sistema de diseño completo.',
          'Prototipado interactivo: simulación con animaciones para validar con el equipo.',
          'Implementación en motor: exportación de assets y recreación en Unity o Unreal.',
          'Testing e iteración: pruebas con jugadores reales y ajustes basados en feedback.'
        ]
      },
      {
        type: 'highlight',
        text: '💼 Pipeline estándar en estudios AAA: Figma → Zeplin → Unity/Unreal → Spine 2D.'
      }
    ]
  }
];
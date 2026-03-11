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
    darkColor: '#006688',
    member: 'Valentina',
    content: [
      {
        type: 'intro',
        title: '¿Qué es una Game UI?',
        text: 'El conjunto de elementos visuales e interactivos que comunican información al jugador — el puente entre el jugador y el mundo virtual.'
      },
      {
        type: 'accordion',
        title: 'Cómo mejoran la experiencia',
        items: [
          'Reducen la carga cognitiva presentando solo info esencial.',
          'Generan inmersión integrada al mundo del juego.',
          'Comunican estado: vida, munición y objetivos de un vistazo.',
          'Crean identidad visual que refuerza el estilo artístico.'
        ]
      },
      {
        type: 'highlight',
        text: '💡 El 73% de jugadores abandona un juego si la UI es confusa en los primeros 30 min.'
      }
    ]
  },
  {
    id: 2,
    icon: '⚔️',
    scenarioName: 'DUNGEON PROFUNDO',
    modTag: 'MÓDULO 02',
    title: 'Ventajas de las Interfaces para Juegos',
    question: '¿Cuáles son las principales ventajas de una buena interfaz de juego?',
    game: 'maze',
    gameInstructions: 'NAVEGA EL LABERINTO • LLEGA A LA SALIDA MARCADA CON ⚔️',
    gameObjective: '⚔️ Encuentra la salida del dungeon',
    color: '#ff6600',
    darkColor: '#994400',
    member: 'Fernando',
    content: [
      {
        type: 'intro',
        title: 'Ventajas fundamentales',
        text: 'Una UI bien construida no es solo estética: es funcionalidad pura que beneficia al jugador y al desarrollador.'
      },
      {
        type: 'accordion',
        title: 'Principales ventajas',
        items: [
          'Aprendizaje acelerado: menos tutoriales, más juego.',
          'Mayor retención: menos frustración, sesiones más largas.',
          'Accesibilidad: opciones de daltonismo y contraste.',
          'Feedback satisfactorio en cada acción del jugador.'
        ]
      },
      {
        type: 'highlight',
        text: '🎮 Los juegos con UI excelente tienen 40% más probabilidad de reseñas positivas.'
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
    gameInstructions: 'DISPARA CON ESPACIO • MUÉVETE CON FLECHAS • DESTRUYE ASTEROIDES',
    gameObjective: '🌟 Destruye todo y recoge la estrella',
    color: '#ff00ff',
    darkColor: '#880088',
    member: 'Vanessa',
    content: [
      {
        type: 'intro',
        title: 'Principios del buen diseño',
        text: 'Las buenas prácticas nacen de la intersección entre diseño UX y psicología cognitiva.'
      },
      {
        type: 'rules2col',
        title: 'Las 8 reglas de oro',
        items: [
          'Claridad ante todo',
          'Consistencia visual',
          'Jerarquía de información',
          'Feedback inmediato',
          'Mínima fricción',
          'Diseño contextual',
          'Prueba de usuarios',
          'Prototipo antes de implementar'
        ]
      },
      {
        type: 'highlight',
        text: '⚡ La mejor UI es la que no se nota. Cuando el jugador está inmerso, el diseñador logró su objetivo.'
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
    darkColor: '#006633',
    member: 'Alejandro',
    content: [
      {
        type: 'intro',
        title: 'Referentes históricos',
        text: 'La historia del Game UI tiene momentos donde un solo juego cambió cómo todos diseñaban sus interfaces.'
      },
      {
        type: 'accordion',
        title: 'Casos icónicos',
        items: [
          '🔴 Dead Space — HUD en el cuerpo del personaje, UI diegética.',
          '🟡 The Last of Us — UI minimalista extrema sin barras visibles.',
          '🟢 Super Mario Bros — Inventó el lenguaje visual moderno.',
          '🟣 Dark Souls — HUD minimal que respeta la inteligencia del jugador.'
        ]
      },
      {
        type: 'highlight',
        text: '🏆 La UI diegética es la tendencia más influyente. Dead Space (2008) sigue siendo el referente.'
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
    darkColor: '#996600',
    member: 'Juan Pablo',
    content: [
      {
        type: 'intro',
        title: 'El arsenal del diseñador',
        text: 'Los profesionales del Game UI trabajan con herramientas específicas desde diseño hasta implementación en motores.'
      },
      {
        type: 'accordion',
        title: 'Herramientas esenciales',
        items: [
          '🎨 FIGMA — Diseño UI y prototipado interactivo.',
          '🖼️ PHOTOSHOP / ILLUSTRATOR — Assets gráficos e iconografía.',
          '🎮 UNITY UI / UNREAL UMG — Implementación en motores.',
          '🌊 SPINE 2D — Animación de elementos de UI.'
        ]
      },
      {
        type: 'highlight',
        text: '💼 Pipeline AAA: Figma → Zeplin → Unity/Unreal → Spine 2D.'
      }
    ]
  }
];

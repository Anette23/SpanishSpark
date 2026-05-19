// Grammar exercises for SpanishSpark — A1/A2 level for Slovak learners

export const GRAMMAR_EXERCISES = [

  // ─── SER / ESTAR ──────────────────────────────────────────────────────────

  { id: 'se-01', category: 'ser/estar', level: 'A1', phrase: 'Mi hermana ___ estudiante de medicina.', answer: ['es'], hint: 'Profesión o identidad → ser', explanation: 'Usamos "ser" para profesiones, identidad y características permanentes.' },
  { id: 'se-02', category: 'ser/estar', level: 'A1', phrase: 'Hoy ___ muy cansada porque no dormí bien.', answer: ['estoy'], hint: 'Estado temporal → estar', explanation: 'Usamos "estar" para estados temporales como el cansancio.' },
  { id: 'se-03', category: 'ser/estar', level: 'A1', phrase: 'El café ___ frío, no me gusta así.', answer: ['está'], hint: 'Condición actual → estar', explanation: '"Estar" describe la condición actual de algo.' },
  { id: 'se-04', category: 'ser/estar', level: 'A1', phrase: 'Nosotros ___ de España, somos madrileños.', answer: ['somos'], hint: 'Origen → ser', explanation: '"Ser" se usa para el origen o la procedencia.' },
  { id: 'se-05', category: 'ser/estar', level: 'A1', phrase: 'La reunión ___ en la sala número 3.', answer: ['es', 'está'], hint: '¿Dónde tiene lugar un evento? Las dos formas son posibles.', explanation: 'Con eventos/reuniones: "ser" indica cuándo/dónde ocurre, "estar" señala ubicación.' },
  { id: 'se-06', category: 'ser/estar', level: 'A1', phrase: '¿Cómo ___ tú hoy?', answer: ['estás'], hint: 'Pregunta sobre estado actual → estar', explanation: '"¿Cómo estás?" pregunta por el estado o la salud actual.' },
  { id: 'se-07', category: 'ser/estar', level: 'A1', phrase: 'La paella ___ un plato típico español.', answer: ['es'], hint: 'Definición o característica permanente → ser', explanation: '"Ser" se usa para definir qué es algo.' },
  { id: 'se-08', category: 'ser/estar', level: 'A1', phrase: 'Mis padres ___ en el supermercado ahora.', answer: ['están'], hint: 'Ubicación temporal → estar', explanation: '"Estar" indica la ubicación de personas y cosas en un momento dado.' },
  { id: 'se-09', category: 'ser/estar', level: 'A2', phrase: 'La fruta ___ muy buena en esta tienda.', answer: ['está'], hint: 'Calidad percibida en el momento → estar', explanation: '"Estar buena/malo" describe la calidad tal como se percibe ahora.' },
  { id: 'se-10', category: 'ser/estar', level: 'A2', phrase: 'Mi jefe ___ muy simpático con todo el mundo.', answer: ['es'], hint: 'Rasgo de personalidad permanente → ser', explanation: '"Ser" describe características de personalidad habituales.' },

  // ─── ARTÍCULOS ────────────────────────────────────────────────────────────

  { id: 'ar-01', category: 'Artículos', level: 'A1', phrase: 'Quiero ___ libro, no ese sino el otro.', answer: ['el'], hint: 'libro = masculino singular, referencia específica → el', explanation: '"El" es el artículo determinado masculino singular.' },
  { id: 'ar-02', category: 'Artículos', level: 'A1', phrase: 'Tengo ___ gato negro en casa.', answer: ['un'], hint: 'Primera mención, indefinido, masculino → un', explanation: '"Un" es el artículo indefinido masculino singular.' },
  { id: 'ar-03', category: 'Artículos', level: 'A1', phrase: 'Me gustan ___ películas de acción.', answer: ['las'], hint: 'películas = femenino plural, referencia general → las', explanation: '"Las" es el artículo determinado femenino plural.' },
  { id: 'ar-04', category: 'Artículos', level: 'A1', phrase: 'Hay ___ tienda nueva en el centro.', answer: ['una'], hint: 'Primera mención, indefinido, femenino → una', explanation: '"Una" es el artículo indefinido femenino singular.' },
  { id: 'ar-05', category: 'Artículos', level: 'A1', phrase: 'Voy ___ supermercado a comprar leche.', answer: ['al'], hint: 'a + el = al (contracción obligatoria)', explanation: '"Al" es la contracción de "a + el", obligatoria en español.' },
  { id: 'ar-06', category: 'Artículos', level: 'A1', phrase: 'Vengo ___ trabajo muy cansada.', answer: ['del'], hint: 'de + el = del (contracción obligatoria)', explanation: '"Del" es la contracción de "de + el".' },
  { id: 'ar-07', category: 'Artículos', level: 'A1', phrase: '___ agua está muy fría hoy.', answer: ['El'], hint: 'agua es femenino pero usa "el" → excepción ortográfica', explanation: 'Los sustantivos femeninos que empiezan por "a-" tónica usan "el" (no "la") en singular para evitar el hiato.' },
  { id: 'ar-08', category: 'Artículos', level: 'A2', phrase: 'Estudio ___ español para viajar.', answer: ['el', ''], hint: 'Con nombres de idiomas: se puede usar el artículo o no', explanation: 'Con idiomas, el artículo es opcional: "Estudio español" y "Estudio el español" son correctos.' },
  { id: 'ar-09', category: 'Artículos', level: 'A2', phrase: 'Me gustan ___ perros grandes.', answer: ['los'], hint: 'Referencia general a todos los perros → los', explanation: 'En español, las generalizaciones llevan artículo definido: "Me gustan los perros."' },
  { id: 'ar-10', category: 'Artículos', level: 'A2', phrase: 'Trabajo de ___ a ___ viernes.', answer: ['lunes', 'lunes'], hint: 'Los días de la semana no llevan artículo con "de lunes a viernes"', explanation: 'En la expresión "de lunes a viernes" no se usa artículo.' },

  // ─── PRESENTE ─────────────────────────────────────────────────────────────

  { id: 'pr-01', category: 'Presente', level: 'A1', phrase: 'Yo ___ en Madrid desde hace dos años.', answer: ['vivo'], hint: 'vivir: yo vivo', explanation: 'Conjugación de "vivir" en presente: yo vivo.' },
  { id: 'pr-02', category: 'Presente', level: 'A1', phrase: '¿A qué hora ___ tú normalmente?', answer: ['comes', 'desayunas', 'llegas', 'te levantas'], hint: 'Verbos regulares en presente: tú + -as o -es', explanation: 'Los verbos regulares -ar: tú + -as. Los verbos -er: tú + -es.' },
  { id: 'pr-03', category: 'Presente', level: 'A1', phrase: 'Nosotros ___ español todos los dias.', answer: ['estudiamos'], hint: 'estudiar: nosotros estudiamos', explanation: '"Estudiar" es un verbo -ar regular. Nosotros: -amos.' },
  { id: 'pr-04', category: 'Presente', level: 'A1', phrase: 'Ellos ___ a las nueve de la noche.', answer: ['comen', 'cenan', 'llegan', 'salen'], hint: 'Verbos regulares en 3ª persona plural', explanation: 'Verbos -er en 3ª persona plural: -en. Verbos -ar: -an.' },
  { id: 'pr-05', category: 'Presente', level: 'A1', phrase: 'Yo ___ mucho el café con leche.', answer: ['quiero', 'tomo', 'bebo', 'prefiero'], hint: 'Verbos comunes en presente: yo', explanation: 'Practica estos verbos comunes en 1ª persona singular.' },
  { id: 'pr-06', category: 'Presente', level: 'A1', phrase: '¿___ usted español?', answer: ['habla'], hint: 'hablar: usted habla (= él/ella)', explanation: '"Usted" es formal y se conjuga como "él/ella": habla.' },
  { id: 'pr-07', category: 'Presente', level: 'A2', phrase: 'Yo ___ que llegar temprano mañana.', answer: ['tengo'], hint: 'tener que + infinitivo = obligación', explanation: '"Tener que + infinitivo" expresa obligación. Yo: tengo.' },
  { id: 'pr-08', category: 'Presente', level: 'A2', phrase: 'Ella siempre ___ lo que promete.', answer: ['hace', 'cumple'], hint: 'hacer (irregular): ella hace', explanation: '"Hacer" es un verbo irregular. Ella hace.' },
  { id: 'pr-09', category: 'Presente', level: 'A2', phrase: '¿Qué ___ tú los domingos por la mañana?', answer: ['haces', 'comes', 'desayunas'], hint: 'haces = tú + hacer (irregular)', explanation: '"Hacer" en presente: yo hago, tú haces, él hace.' },
  { id: 'pr-10', category: 'Presente', level: 'A2', phrase: 'Vosotros ___ a la fiesta esta noche, ¿verdad?', answer: ['venís', 'vais', 'llegáis'], hint: 'Vosotros + verbo: -áis, -éis, -ís', explanation: 'La forma vosotros: -ar → -áis, -er/-ir → -éis/-ís.' },

  // ─── PASADO ───────────────────────────────────────────────────────────────

  { id: 'pa-01', category: 'Pasado', level: 'A2', phrase: 'Ayer ___ al cine con mis amigos.', answer: ['fui'], hint: 'ir en pretérito indefinido: yo fui', explanation: '"Ir" y "ser" tienen la misma forma en pretérito: fui, fuiste, fue...' },
  { id: 'pa-02', category: 'Pasado', level: 'A2', phrase: 'La semana pasada ___ mucho en la oficina.', answer: ['trabajé', 'estudié', 'dormí'], hint: 'Verbo -ar en 1ª persona singular → -é', explanation: 'Pretérito indefinido: verbos -ar → yo -é. Ej: trabajé.' },
  { id: 'pa-03', category: 'Pasado', level: 'A2', phrase: 'Ayer ___ con María en el café.', answer: ['quedé', 'estuve', 'hablé', 'comí'], hint: 'Verbo -ar en pretérito: yo -é', explanation: 'Verbos -ar en pretérito indefinido: yo + -é.' },
  { id: 'pa-04', category: 'Pasado', level: 'A2', phrase: '¿Dónde ___ tú el verano pasado?', answer: ['estuviste', 'fuiste'], hint: 'estar → yo estuve, tú estuviste', explanation: '"Estar" en pretérito es irregular: estuve, estuviste, estuvo...' },
  { id: 'pa-05', category: 'Pasado', level: 'A2', phrase: 'Esta mañana ___ un café y luego salí.', answer: ['tomé', 'bebí', 'desayuné'], hint: 'Pretérito indefinido, yo, -ar → -é', explanation: 'Acción concreta y terminada en el pasado → pretérito indefinido.' },

  // ─── PREPOSICIONES ────────────────────────────────────────────────────────

  { id: 'pp-01', category: 'Preposiciones', level: 'A1', phrase: 'Estudio ___ la tarde, no por la mañana.', answer: ['por'], hint: 'por la tarde / por la mañana / por la noche', explanation: 'Para las partes del día usamos "por": por la mañana, por la tarde, por la noche.' },
  { id: 'pp-02', category: 'Preposiciones', level: 'A1', phrase: 'Voy ___ clase de español los lunes.', answer: ['a'], hint: 'ir a = destino', explanation: '"Ir a + lugar" indica el destino.' },
  { id: 'pp-03', category: 'Preposiciones', level: 'A1', phrase: 'Hablo ___ mi madre cada día.', answer: ['con'], hint: 'hablar con = hablar junto a alguien', explanation: '"Hablar con" indica compañía en la conversación.' },
  { id: 'pp-04', category: 'Preposiciones', level: 'A1', phrase: 'El hotel está ___ la playa.', answer: ['cerca de', 'al lado de'], hint: '¿Qué indica proximidad?', explanation: '"Cerca de" y "al lado de" indican proximidad.' },
  { id: 'pp-05', category: 'Preposiciones', level: 'A2', phrase: 'Me interesa mucho aprender ___ la cultura española.', answer: ['sobre', 'acerca de'], hint: '¿Qué preposición indica el tema?', explanation: '"Sobre" y "acerca de" se usan para indicar el tema.' },

  // ─── PRONOMBRES ───────────────────────────────────────────────────────────

  { id: 'pn-01', category: 'Pronombres', level: 'A1', phrase: '___ gusta mucho el chocolate.', answer: ['Me'], hint: 'A mí → me gusta', explanation: '"Me gusta" = a mí me gusta. Usamos el pronombre indirecto con "gustar".' },
  { id: 'pn-02', category: 'Pronombres', level: 'A1', phrase: '¿___ gusta el deporte?', answer: ['Te'], hint: 'A ti → te gusta', explanation: '"¿Te gusta?" pregunta si a ti te gusta algo.' },
  { id: 'pn-03', category: 'Pronombres', level: 'A1', phrase: '___ llamo María, mucho gusto.', answer: ['Me'], hint: 'llamarse: yo me llamo', explanation: '"Me llamo" es reflexivo: yo me llamo (mi nombre es).' },
  { id: 'pn-04', category: 'Pronombres', level: 'A2', phrase: 'El libro ___ lo di ayer a mi amigo.', answer: ['se', 'te', 'le'], hint: '¿Qué pronombre indirecto corresponde aquí?', explanation: 'Le/Se = pronombre indirecto de 3ª persona cuando va antes de lo/la/los/las.' },
  { id: 'pn-05', category: 'Pronombres', level: 'A2', phrase: 'Ellos ___ están duchando ahora.', answer: ['se'], hint: 'ducharse es reflexivo: ellos se duchan', explanation: 'Los verbos reflexivos llevan pronombre: me, te, se, nos, os, se.' },

]
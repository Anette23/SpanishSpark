// Spanish A1/A2 bonus exercises

function dailyStart(arr) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  return seed % arr.length
}

export const SYNONYM_WORDS = [
  // A1
  { word: 'bonito',      level: 'A1', synonyms: ['hermoso', 'lindo', 'bello', 'precioso'],       example: 'Qué dia tan hermoso hace hoy.' },
  { word: 'grande',      level: 'A1', synonyms: ['enorme', 'amplio', 'inmenso', 'vasto'],         example: 'La ciudad es enorme y tiene mucha vida.' },
  { word: 'pequeño',     level: 'A1', synonyms: ['diminuto', 'minúsculo', 'reducido', 'compacto'], example: 'Vivo en un apartamento diminuto pero acogedor.' },
  { word: 'bueno',       level: 'A1', synonyms: ['excelente', 'estupendo', 'magnífico', 'fantástico'], example: 'Es un restaurante excelente, la comida es increíble.' },
  { word: 'malo',        level: 'A1', synonyms: ['terrible', 'horrible', 'pésimo', 'espantoso'],  example: 'Tuve un dia terrible, todo salió mal.' },
  { word: 'contento',    level: 'A1', synonyms: ['feliz', 'alegre', 'satisfecho', 'dichoso'],     example: 'Estoy muy feliz porque aprendí muchas palabras nuevas.' },
  { word: 'triste',      level: 'A1', synonyms: ['melancólico', 'apesadumbrado', 'desanimado', 'abatido'], example: 'Se sentía melancólico cuando la música terminó.' },
  { word: 'rápido',      level: 'A1', synonyms: ['veloz', 'ágil', 'ligero', 'presto'],            example: 'El tren es muy veloz y llega en pocos minutos.' },
  { word: 'lento',       level: 'A1', synonyms: ['pausado', 'tranquilo', 'despacio', 'calmo'],    example: 'Hablemos más despacio para entendernos mejor.' },
  { word: 'cansado',     level: 'A1', synonyms: ['agotado', 'extenuado', 'fatigado', 'rendido'],  example: 'Después del partido estaba completamente agotado.' },
  { word: 'hablar',      level: 'A1', synonyms: ['conversar', 'charlar', 'dialogar', 'platicar'], example: 'Me gusta charlar con mis amigos en el café.' },
  { word: 'comer',       level: 'A1', synonyms: ['alimentarse', 'ingerir', 'degustar', 'probar'], example: 'Me gusta degustar platos nuevos cuando viajo.' },
  { word: 'ver',         level: 'A1', synonyms: ['observar', 'mirar', 'contemplar', 'apreciar'],  example: 'Me encanta contemplar el mar al atardecer.' },
  { word: 'pensar',      level: 'A1', synonyms: ['reflexionar', 'considerar', 'meditar', 'creer'], example: 'Necesito reflexionar antes de tomar esa decisión.' },
  { word: 'querer',      level: 'A1', synonyms: ['desear', 'anhelar', 'necesitar', 'esperar'],    example: 'Deseo aprender español para hablar con más personas.' },
  // A2
  { word: 'importante',  level: 'A2', synonyms: ['esencial', 'fundamental', 'crucial', 'significativo'], example: 'Es esencial practicar cada día para mejorar.' },
  { word: 'difícil',     level: 'A2', synonyms: ['complicado', 'arduo', 'laborioso', 'complejo'], example: 'La gramática española es complicada pero interesante.' },
  { word: 'fácil',       level: 'A2', synonyms: ['sencillo', 'simple', 'elemental', 'accesible'], example: 'Este ejercicio es muy sencillo una vez que lo entiendes.' },
  { word: 'nuevo',       level: 'A2', synonyms: ['reciente', 'moderno', 'actual', 'fresco'],      example: 'Hoy aprendí vocabulario reciente sobre el trabajo.' },
  { word: 'viejo',       level: 'A2', synonyms: ['antiguo', 'añejo', 'veterano', 'clásico'],      example: 'Este edificio antiguo tiene mucha historia.' },
  { word: 'interesante', level: 'A2', synonyms: ['fascinante', 'atractivo', 'apasionante', 'curioso'], example: 'El libro es fascinante, no puedo parar de leerlo.' },
  { word: 'empezar',     level: 'A2', synonyms: ['comenzar', 'iniciar', 'arrancar', 'ponerse a'], example: 'Voy a comenzar a estudiar gramática ahora mismo.' },
  { word: 'terminar',    level: 'A2', synonyms: ['acabar', 'finalizar', 'concluir', 'completar'], example: 'Acabo de finalizar mis deberes de español.' },
  { word: 'ayudar',      level: 'A2', synonyms: ['apoyar', 'asistir', 'colaborar', 'socorrer'],   example: 'Mi profesora siempre me apoya cuando tengo dudas.' },
  { word: 'aprender',    level: 'A2', synonyms: ['estudiar', 'practicar', 'dominar', 'asimilar'], example: 'Con práctica constante puedes dominar el español.' },
]

export const PREPOSITION_PHRASES = [
  // A1
  { phrase: 'Vivo ___ Madrid desde hace dos años.', answer: ['en'], hint: 'en = ubicación en ciudades y países', level: 'A1' },
  { phrase: 'Voy ___ la escuela todos los días.', answer: ['a'], hint: 'ir a = dirección o destino', level: 'A1' },
  { phrase: 'Hablo ___ mi amigo por teléfono.', answer: ['con'], hint: 'hablar con = hablar junto a alguien', level: 'A1' },
  { phrase: 'Vengo ___ Eslovaquia.', answer: ['de'], hint: 'venir de = origen', level: 'A1' },
  { phrase: 'Este regalo es ___ ti.', answer: ['para'], hint: 'para = destinatario', level: 'A1' },
  { phrase: 'Camino ___ el parque cada mañana.', answer: ['por'], hint: 'por = movimiento a través de un lugar', level: 'A1' },
  { phrase: 'La reunión es ___ las diez de la mañana.', answer: ['a'], hint: 'a las + hora = la hora exacta', level: 'A1' },
  { phrase: 'Vivo ___ mis padres en casa.', answer: ['con'], hint: 'con = compañía', level: 'A1' },
  { phrase: 'El café está ___ la derecha.', answer: ['a'], hint: 'a la derecha / a la izquierda', level: 'A1' },
  { phrase: 'Trabajo ___ las nueve ___ las cinco.', answer: ['de', 'a'], hint: 'de...a = indica el rango horario', level: 'A1' },
  { phrase: 'Estudio español ___ aprender más cosas.', answer: ['para'], hint: 'para + infinitivo = finalidad o propósito', level: 'A1' },
  { phrase: 'El libro está ___ la mesa.', answer: ['sobre', 'encima de'], hint: 'sobre / encima de = posición superior', level: 'A1' },
  { phrase: 'Salgo ___ casa a las ocho.', answer: ['de'], hint: 'salir de = punto de partida', level: 'A1' },
  { phrase: 'Voy ___ autobús al trabajo.', answer: ['en'], hint: 'en + transporte = medio de transporte', level: 'A1' },
  { phrase: 'La farmacia está ___ el supermercado.', answer: ['al lado de', 'cerca de'], hint: 'al lado de / cerca de = proximidad', level: 'A1' },
  // A2
  { phrase: 'Te llamo ___ un momento, ahora estoy ocupada.', answer: ['en'], hint: 'en + tiempo = dentro de ese tiempo', level: 'A2' },
  { phrase: 'Quedamos ___ las seis ___ la tarde.', answer: ['a', 'de'], hint: 'a las + hora, de la tarde', level: 'A2' },
  { phrase: 'Estudio español ___ las mañanas.', answer: ['por'], hint: 'por la mañana / por la tarde / por la noche', level: 'A2' },
  { phrase: 'Hablé ___ el médico ayer.', answer: ['con'], hint: 'hablar con = conversar con alguien', level: 'A2' },
  { phrase: 'Fui ___ Madrid el fin de semana pasado.', answer: ['a'], hint: 'ir a = destino', level: 'A2' },
  { phrase: 'Llegué ___ casa muy tarde anoche.', answer: ['a'], hint: 'llegar a = llegada a un lugar', level: 'A2' },
  { phrase: 'Espero tu respuesta ___ el viernes.', answer: ['para', 'antes del'], hint: 'para / antes del = plazo límite', level: 'A2' },
  { phrase: 'Me gusta el café ___ leche.', answer: ['con'], hint: 'con = combinación o acompañamiento', level: 'A2' },
  { phrase: 'Pienso ___ viajar a España este verano.', answer: ['en'], hint: 'pensar en = idea o plan que se considera', level: 'A2' },
  { phrase: 'El banco está ___ el hotel y el restaurante.', answer: ['entre'], hint: 'entre = en medio de dos cosas', level: 'A2' },
]

export const IDIOM_PHRASES = [
  // A1
  { phrase: 'Tengo ___ — necesito comer algo.', answer: ['hambre'], hint: 'tener hambre = estar hambriento', level: 'A1' },
  { phrase: 'Tengo ___ — quiero beber agua.', answer: ['sed'], hint: 'tener sed = estar sediento', level: 'A1' },
  { phrase: 'Tengo ___ — quiero dormir.', answer: ['sueño'], hint: 'tener sueño = estar somnoliento', level: 'A1' },
  { phrase: 'Tengo ___ — necesito una chaqueta.', answer: ['frío'], hint: 'tener frío = sentir frío', level: 'A1' },
  { phrase: 'Tengo ___ — voy a abrir la ventana.', answer: ['calor'], hint: 'tener calor = sentir calor', level: 'A1' },
  { phrase: 'Tengo ___ años.', answer: ['veinte', 'veinticinco', 'treinta'], hint: 'tener + años = expresar la edad', level: 'A1' },
  { phrase: '¿Cuántos años ___?', answer: ['tienes'], hint: 'tener = expresar la edad en español', level: 'A1' },
  { phrase: 'Me ___ igual — puedes elegir tú.', answer: ['da'], hint: 'dar igual = no importar, no tener preferencia', level: 'A1' },
  { phrase: 'Tienes ___ — eso es exactamente correcto.', answer: ['razón'], hint: 'tener razón = estar en lo correcto', level: 'A1' },
  { phrase: 'No te ___ — es muy fácil.', answer: ['preocupes'], hint: 'preocuparse = to worry; no te preocupes = don\'t worry', level: 'A1' },
  // A2
  { phrase: 'Tengo ___ de ir al baño — un momento.', answer: ['ganas'], hint: 'tener ganas de + infinitivo = querer hacer algo', level: 'A2' },
  { phrase: '¡Qué ___! No pude venir a tu fiesta.', answer: ['pena', 'lástima'], hint: 'qué pena / qué lástima = what a shame', level: 'A2' },
  { phrase: 'Se me ___ el nombre — no lo recuerdo.', answer: ['olvidó'], hint: 'se me olvidó = I forgot (accidental forgetting)', level: 'A2' },
  { phrase: '¡Buena ___! Espero que todo salga bien.', answer: ['suerte'], hint: 'buena suerte = good luck', level: 'A2' },
  { phrase: 'Estoy ___ de acuerdo contigo.', answer: ['de', 'completamente'], hint: 'estar de acuerdo = to agree with someone', level: 'A2' },
  { phrase: 'No me ___ la gana — prefiero quedarme en casa.', answer: ['da'], hint: 'no me da la gana = I don\'t feel like it (informal)', level: 'A2' },
  { phrase: 'Hay que ___ las maletas antes de salir.', answer: ['hacer'], hint: 'hacer las maletas = to pack your bags', level: 'A2' },
  { phrase: 'Me doy ___ de que cometí un error.', answer: ['cuenta'], hint: 'darse cuenta = to realize something', level: 'A2' },
  { phrase: 'Voy a echar ___ a la abuela este fin de semana.', answer: ['una mano', 'una visita'], hint: 'echar una mano = to give a hand / help; echar una visita = to pay a visit', level: 'A2' },
  { phrase: 'No te queda ___ — el examen es mañana.', answer: ['otra', 'más remedio'], hint: 'no te queda otra = you have no other choice', level: 'A2' },
]

export const SHADOWING_SENTENCES = [
  // A1
  { sentence: 'Me llamo Ana y soy de España.', level: 'A1' },
  { sentence: 'Tengo veintitrés años y estudio español.', level: 'A1' },
  { sentence: 'Vivo en una ciudad pequeña pero muy bonita.', level: 'A1' },
  { sentence: 'Me gusta comer pizza y ver películas.', level: 'A1' },
  { sentence: 'Trabajo de lunes a viernes.', level: 'A1' },
  { sentence: 'Mi familia es muy importante para mí.', level: 'A1' },
  { sentence: 'Cada día aprendo palabras nuevas en español.', level: 'A1' },
  { sentence: 'Me gusta mucho el café por la mañana.', level: 'A1' },
  { sentence: '¿Qué haces los fines de semana normalmente?', level: 'A1' },
  { sentence: 'Mi color favorito es el azul.', level: 'A1' },
  { sentence: 'Tengo dos hermanos y una hermana.', level: 'A1' },
  { sentence: 'Hablo un poco de inglés y algo de francés.', level: 'A1' },
  { sentence: 'Mi ciudad tiene muchos parques y restaurantes.', level: 'A1' },
  { sentence: 'Los fines de semana me gusta pasear por el centro.', level: 'A1' },
  { sentence: 'El español es muy bonito y me encanta aprenderlo.', level: 'A1' },
  { sentence: '¿Cuántos años tienes? Yo tengo veinticinco.', level: 'A1' },
  { sentence: 'Hoy hace buen tiempo, voy a salir a caminar.', level: 'A1' },
  { sentence: 'Me llamo Jorge y soy estudiante de idiomas.', level: 'A1' },
  { sentence: '¿Tienes hermanos? Yo tengo una hermana mayor.', level: 'A1' },
  { sentence: 'Quiero aprender español para viajar a México.', level: 'A1' },
  // A2
  { sentence: 'El fin de semana pasado fui al supermercado con mi madre.', level: 'A2' },
  { sentence: 'Me gustaría visitar España el próximo verano.', level: 'A2' },
  { sentence: 'Cuando tengo tiempo libre, me gusta escuchar música.', level: 'A2' },
  { sentence: '¿Puedes decirme cómo se llega a la estación?', level: 'A2' },
  { sentence: 'Necesito practicar más porque todavía cometo muchos errores.', level: 'A2' },
  { sentence: 'El año pasado empecé a estudiar español y me encantó.', level: 'A2' },
  { sentence: '¿A qué hora abre el supermercado por las mañanas?', level: 'A2' },
  { sentence: 'Me levanto a las siete y desayuno café con tostadas.', level: 'A2' },
  { sentence: 'Ayer estuve en el médico porque no me sentía bien.', level: 'A2' },
  { sentence: 'El español es difícil pero con práctica todo es posible.', level: 'A2' },
  { sentence: 'Mañana tengo una reunión importante a las nueve.', level: 'A2' },
  { sentence: 'Me gusta mucho la comida italiana, especialmente la pasta.', level: 'A2' },
  { sentence: 'Esta semana tengo muchas cosas que hacer en el trabajo.', level: 'A2' },
  { sentence: '¿Qué hiciste ayer por la tarde después del trabajo?', level: 'A2' },
  { sentence: 'Fui al cine con unos amigos y la película fue muy buena.', level: 'A2' },
  { sentence: 'Normalmente cocino en casa porque es más barato y sano.', level: 'A2' },
  { sentence: 'El próximo mes voy a empezar un curso de cocina española.', level: 'A2' },
  { sentence: 'Me encanta leer libros en español para mejorar mi vocabulario.', level: 'A2' },
  { sentence: 'Los fines de semana me gusta quedar con mis amigos para tomar algo.', level: 'A2' },
  { sentence: 'Estoy aprendiendo español desde hace seis meses y noto mucha mejoría.', level: 'A2' },
]

export function getListForLevel(fullList, level) {
  const filtered = fullList.filter(item => item.level === level)
  return filtered.length > 0 ? filtered : fullList
}

export function getDailySynonymWord(level) {
  const list = getListForLevel(SYNONYM_WORDS, level)
  return list[dailyStart(list)]
}
export function getDailyPhrase(level) {
  const list = getListForLevel(PREPOSITION_PHRASES, level)
  return list[dailyStart(list)]
}
export function getDailyIdiom(level) {
  const list = getListForLevel(IDIOM_PHRASES, level)
  return list[dailyStart(list)]
}
export function getDailyShadowSentence(level) {
  const list = getListForLevel(SHADOWING_SENTENCES, level)
  return list[dailyStart(list)]
}
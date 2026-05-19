export const WEEKLY_CHALLENGES = [
  { title: 'Preséntate', prompt: 'Escribe una presentación corta sobre ti mismo. Di tu nombre, de dónde eres, cuántos años tienes, en qué trabajas o estudias, y qué te gusta hacer. Intenta escribir 5-7 frases.', type: 'writing' },
  { title: 'Mi familia', prompt: 'Describe a tu familia. ¿Cuántas personas hay? ¿Tienes hermanos? ¿Cómo se llaman? ¿Qué hacen? Escribe 5-8 frases sencillas.', type: 'writing' },
  { title: 'Mi rutina diaria', prompt: 'Describe tu rutina de un día normal de semana. ¿A qué hora te levantas? ¿Qué desayunas? ¿Qué haces por la tarde y por la noche? Usa palabras como: primero, después, luego, finalmente.', type: 'writing' },
  { title: 'Mi comida favorita', prompt: 'Escribe sobre tu comida favorita. ¿Qué es? ¿Por qué te gusta? ¿Cuándo la comes? ¿Sabes cocinarla? Escribe al menos 5 frases.', type: 'writing' },
  { title: 'Mi ciudad', prompt: 'Describe tu ciudad o pueblo. ¿Es grande o pequeño? ¿Qué hay allí - parques, tiendas, restaurantes? ¿Qué te gusta y qué no te gusta? Escribe 5-7 frases.', type: 'writing' },
  { title: 'Mis hobbies', prompt: 'Habla de tus pasatiempos. ¿Qué te gusta hacer en tu tiempo libre? ¿Por qué te gustan? ¿Cuándo los practicas? Intenta usar: me gusta, me encanta, prefiero...', type: 'writing' },
  { title: 'El fin de semana pasado', prompt: 'Cuenta qué hiciste el fin de semana pasado. ¿A dónde fuiste? ¿Con quién? ¿Qué comiste? ¿Lo pasaste bien? Usa el pasado: fui, comí, estuve, vi...', type: 'writing' },
  { title: 'Mi lugar favorito', prompt: 'Describe tu lugar favorito - puede ser un sitio en tu ciudad, un café, un parque, una playa o un lugar de vacaciones. ¿Por qué te gusta tanto? Escribe 5-7 frases.', type: 'writing' },
  { title: 'Un día perfecto', prompt: 'Imagina tu día perfecto. ¿A qué hora te levantas? ¿Qué haces? ¿Con quién lo pasas? ¿Qué comes? No hay límites. Escribe al menos 6 frases.', type: 'writing' },
  { title: 'Hablar de ti mismo', prompt: 'Preséntate en voz alta como si hablaras con alguien nuevo. Di tu nombre, de dónde eres, qué haces, qué te gusta. Intenta hablar durante al menos 45 segundos sin parar.', type: 'speaking' },
  { title: 'Mis planes para esta semana', prompt: 'Escribe sobre tus planes para esta semana o el próximo fin de semana. ¿Qué vas a hacer? ¿Con quién? Usa: voy a..., quiero..., tengo que... Escribe 5-7 frases.', type: 'writing' },
  { title: 'Describir una foto', prompt: 'Imagina que tienes una foto de tu habitación o de tu lugar favorito. Descríbela en voz alta. ¿Qué hay en la foto? ¿Qué colores ves? ¿Qué objetos hay? Habla durante 45 segundos.', type: 'speaking' },
  { title: 'Email a un amigo', prompt: 'Escribe un email corto a un amigo español que no has visto en un tiempo. Cuéntale cómo estás, qué has hecho últimamente, y pregúntale cómo está él. Escribe 60-80 palabras.', type: 'writing' },
  { title: 'La temporada favorita', prompt: 'Escribe sobre tu estación del año favorita (primavera, verano, otoño, invierno). ¿Por qué te gusta? ¿Qué haces en esa época? ¿Qué tiempo hace? Escribe 5-7 frases.', type: 'writing' },
  { title: 'Hablando del tiempo', prompt: 'Habla del tiempo que hace hoy y del tiempo que generalmente hace en tu ciudad en cada estación. ¿Qué tiempo prefieres? ¿Por qué? Habla durante 45 segundos.', type: 'speaking' },
  { title: 'Una persona especial', prompt: 'Escribe sobre una persona importante para ti - un amigo, un familiar, un profesor. ¿Cómo es? ¿Qué hacéis juntos? ¿Por qué es especial para ti? Escribe 5-7 frases.', type: 'writing' },
  { title: '¿Qué quieres aprender?', prompt: 'Escribe sobre algo que quieres aprender este año - puede ser español, un deporte, cocinar, un instrumento... ¿Por qué quieres aprenderlo? ¿Cómo lo vas a hacer? Escribe 5-7 frases.', type: 'writing' },
  { title: 'En el restaurante', prompt: 'Imagina que estás en un restaurante español. Habla en voz alta: pide la mesa, mira el menú, pide la comida y la bebida, y pide la cuenta.', type: 'speaking' },
  { title: 'Las compras', prompt: 'Escribe sobre tus hábitos de compras. ¿Dónde compras normalmente - en tiendas o por internet? ¿Qué tipos de cosas compras? ¿Te gusta ir de compras? ¿Por qué sí o por qué no? Escribe 5-7 frases.', type: 'writing' },
  { title: 'Mi animal favorito', prompt: 'Escribe sobre tu animal favorito. ¿Cuál es? ¿Por qué te gusta? ¿Tienes una mascota? Si no, ¿te gustaría tener una? ¿Por qué? Escribe al menos 5 frases.', type: 'writing' },
]

export function getCurrentWeekNumber() {
  const d = new Date()
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  return Math.floor((d - startOfYear) / 86400000 / 7)
}

export function getCurrentWeekKey() {
  const d = new Date()
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const week = Math.floor((d - startOfYear) / 86400000 / 7)
  return d.getFullYear() + '-' + week
}

export function getCurrentChallenge() {
  const week = getCurrentWeekNumber()
  const weekKey = getCurrentWeekKey()
  return { ...WEEKLY_CHALLENGES[week % WEEKLY_CHALLENGES.length], weekKey }
}

export function isWeeklyChallengeComplete(state) {
  const weekKey = getCurrentWeekKey()
  return (state.weeklyDone || []).includes(weekKey)
}
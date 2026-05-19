const TAGGED_WRITING_PROMPTS = [
  { text: "Preséntate en 5-7 frases: nombre, edad, ciudad, trabajo o estudios, y un hobby.", tags: ['presente', 'vocabulario'] },
  { text: "Describe a tu familia. ¿Cuántos sois? ¿Qué hacen? ¿Cómo son?", tags: ['presente', 'artículos'] },
  { text: "¿Cuál es tu comida favorita y por qué te gusta tanto?", tags: ['vocabulario', 'artículos'] },
  { text: "Describe tu rutina diaria de lunes a viernes.", tags: ['presente', 'preposiciones'] },
  { text: "¿Qué haces los fines de semana normalmente?", tags: ['presente'] },
  { text: "Escribe sobre tu ciudad o pueblo. ¿Qué hay allí?", tags: ['artículos', 'preposiciones'] },
  { text: "¿Qué te gusta hacer en tu tiempo libre?", tags: ['presente', 'vocabulario'] },
  { text: "Describe tu casa o apartamento en detalle.", tags: ['artículos', 'preposiciones'] },
  { text: "¿Qué tiempo hace en tu ciudad? Describe las cuatro estaciones.", tags: ['presente', 'vocabulario'] },
  { text: "Escribe 5 cosas que te gustan y 5 que no te gustan.", tags: ['presente'] },
  { text: "¿Cuáles son tus planes para este fin de semana?", tags: ['futuro', 'presente'] },
  { text: "Describe a tu mejor amigo o amiga. ¿Cómo es? ¿Qué hacéis juntos?", tags: ['presente', 'ser/estar'] },
  { text: "Escribe sobre algo que hiciste ayer o el fin de semana pasado.", tags: ['pasado'] },
  { text: "¿Qué te gustaría aprender este año? ¿Por qué?", tags: ['vocabulario'] },
  { text: "Describe tu película o serie favorita en pocas frases.", tags: ['pasado', 'vocabulario'] },
  { text: "¿Cómo es una semana típica para ti?", tags: ['presente', 'preposiciones'] },
  { text: "Escribe sobre una persona importante en tu vida.", tags: ['ser/estar', 'vocabulario'] },
  { text: "¿Qué comiste ayer? Describe tus comidas del día.", tags: ['pasado', 'artículos'] },
  { text: "¿Adónde fuiste de vacaciones? ¿Qué hiciste allí?", tags: ['pasado', 'preposiciones'] },
  { text: "Escribe sobre tu animal favorito. ¿Por qué te gusta?", tags: ['artículos', 'vocabulario'] },
  { text: "¿Qué vas a hacer este verano?", tags: ['futuro'] },
  { text: "Describe tu deporte o actividad física favorita.", tags: ['presente', 'artículos'] },
  { text: "Escribe sobre un día que recuerdas bien. ¿Qué pasó?", tags: ['pasado'] },
  { text: "¿Qué música te gusta? ¿Cuándo la escuchas?", tags: ['presente', 'vocabulario'] },
  { text: "¿Cómo es tu lugar favorito para estudiar o trabajar?", tags: ['ser/estar', 'artículos'] },
  { text: "Escribe sobre algo que aprendiste en español esta semana.", tags: ['pasado', 'vocabulario'] },
  { text: "¿Qué haces cuando estás de mal humor?", tags: ['presente', 'ser/estar'] },
  { text: "Describe el supermercado o la tienda donde compras normalmente.", tags: ['presente', 'artículos'] },
  { text: "¿Qué tipo de libros o películas te gustan? ¿Por qué?", tags: ['vocabulario'] },
  { text: "Escribe un mensaje de texto a un amigo español para quedar esta semana.", tags: ['presente', 'futuro'] },
]

const TAGGED_SPEAKING_PROMPTS = [
  { text: "Preséntate en voz alta: nombre, edad, de dónde eres, qué haces.", tags: ['presente', 'ser/estar'] },
  { text: "Describe a tu familia hablando durante 30 segundos.", tags: ['presente', 'artículos'] },
  { text: "Habla de tu comida favorita — ¿qué es y por qué te gusta?", tags: ['vocabulario'] },
  { text: "Describe tu rutina de mañana hablando en voz alta.", tags: ['presente', 'preposiciones'] },
  { text: "Habla de tu ciudad — ¿qué hay allí, qué te gusta?", tags: ['presente', 'artículos'] },
  { text: "¿Qué hiciste el fin de semana pasado? Cuéntalo en voz alta.", tags: ['pasado'] },
  { text: "Habla de tus hobbies durante 30-45 segundos.", tags: ['presente', 'vocabulario'] },
  { text: "Describe dónde vives — tu casa o apartamento.", tags: ['preposiciones', 'ser/estar'] },
  { text: "Habla sobre el tiempo que hace hoy y en tu ciudad en general.", tags: ['presente'] },
  { text: "Habla de tu película o serie favorita — el argumento y por qué te gusta.", tags: ['pasado', 'vocabulario'] },
  { text: "¿Qué vas a hacer este fin de semana? Habla durante 30 segundos.", tags: ['futuro'] },
  { text: "Describe a una persona importante para ti.", tags: ['ser/estar', 'vocabulario'] },
  { text: "Cuenta qué desayunaste hoy y qué sueles desayunar normalmente.", tags: ['pasado', 'presente'] },
  { text: "Imagina que estás en un restaurante. Pide la comida en voz alta.", tags: ['presente', 'vocabulario'] },
  { text: "Habla de algo que quieres aprender o mejorar en el futuro.", tags: ['futuro', 'vocabulario'] },
  { text: "Describe tu deporte o actividad favorita para hacer ejercicio.", tags: ['presente', 'artículos'] },
  { text: "Habla de tu día de ayer — lo que hiciste desde la mañana.", tags: ['pasado', 'preposiciones'] },
  { text: "¿Cómo es tu ciudad en verano y en invierno? Compara las dos estaciones.", tags: ['ser/estar', 'vocabulario'] },
  { text: "Cuenta algo que aprendiste en español esta semana.", tags: ['pasado'] },
  { text: "Habla durante 30 segundos sobre qué tipo de música te gusta y cuándo la escuchas.", tags: ['presente', 'vocabulario'] },
]

export const WRITING_PROMPTS = TAGGED_WRITING_PROMPTS.map(p => p.text)
export const SPEAKING_PROMPTS = TAGGED_SPEAKING_PROMPTS.map(p => p.text)

export function getDailyPrompt(prompts) {
  const dayIndex = Math.floor(Date.now() / 86400000) % prompts.length
  return prompts[dayIndex]
}

const CATEGORY_TAG = {
  'ser/estar': 'ser/estar',
  'Artículos': 'artículos',
  'Presente': 'presente',
  'Pasado': 'pasado',
  'Preposiciones': 'preposiciones',
  'Vocabulario': 'vocabulario',
}

export function getAdaptivePrompt(type, topWeakSpotCategory) {
  const dayIdx = Math.floor(Date.now() / 86400000)
  const tagged = type === 'writing' ? TAGGED_WRITING_PROMPTS : TAGGED_SPEAKING_PROMPTS

  const tag = CATEGORY_TAG[topWeakSpotCategory]
  if (tag && (dayIdx % 5) < 3) {
    const matching = tagged.filter(p => p.tags.includes(tag))
    if (matching.length > 0) {
      return { text: matching[dayIdx % matching.length].text, targetedAt: topWeakSpotCategory }
    }
  }

  return { text: tagged[dayIdx % tagged.length].text, targetedAt: null }
}
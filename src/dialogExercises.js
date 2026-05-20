// Scripted dialogue exercises for A1/A2 Spanish learners

export const DIALOG_EXERCISES = [
  {
    id: 'dlg-01',
    level: 'A1',
    title: 'En la cafetería',
    description: 'Ordering in a café',
    turns: [
      { role: 'ai', text: 'Buenos días. ¿Qué desea?', sk: 'Dobré ráno. Čo si prajete?' },
      { role: 'user', prompt: 'Say you want a coffee with milk and a croissant.', expected: ['quiero un café con leche y un cruasán', 'me pone un café con leche y un cruasán', 'quisiera un café con leche y un cruasán', 'un café con leche y un cruasán por favor'], hint: 'Use "Quiero..." or "Me pone..." to order.' },
      { role: 'ai', text: '¿Para tomar aquí o para llevar?', sk: 'Na mieste alebo so sebou?' },
      { role: 'user', prompt: 'Say you will have it here.', expected: ['para tomar aquí', 'aquí', 'para aquí', 'me lo tomo aquí'], hint: '"Para tomar aquí" = to have here.' },
      { role: 'ai', text: 'Ahora mismo. Son cuatro euros con cincuenta.', sk: 'Hneď to prinesiem. Spolu štyri eurá päťdesiat.' },
      { role: 'user', prompt: 'Ask if you can pay by card.', expected: ['puedo pagar con tarjeta', 'se puede pagar con tarjeta', 'acepta tarjeta', 'aceptan tarjeta'], hint: '"¿Puedo pagar con tarjeta?" = Can I pay by card?' },
    ],
  },
  {
    id: 'dlg-02',
    level: 'A1',
    title: 'Presentaciones',
    description: 'Meeting someone new',
    turns: [
      { role: 'ai', text: 'Hola, soy Marcos. ¿Cómo te llamas?', sk: 'Ahoj, som Marcos. Ako sa voláš?' },
      { role: 'user', prompt: 'Say your name and that you are pleased to meet him.', expected: ['me llamo', 'mucho gusto', 'encantada', 'encantado'], hint: '"Me llamo..." + "Mucho gusto" or "Encantada/o".' },
      { role: 'ai', text: '¿De dónde eres?', sk: 'Odkiaľ si?' },
      { role: 'user', prompt: 'Say you are from Slovakia and you live in Spain now.', expected: ['soy de eslovaquia', 'soy eslovaca', 'vivo en españa', 'ahora vivo'], hint: '"Soy de Eslovaquia" + "pero ahora vivo en España".' },
      { role: 'ai', text: '¡Qué interesante! ¿Y a qué te dedicas?', sk: 'To je zaujímavé! A čo robíš?' },
      { role: 'user', prompt: 'Say what you do for work (or that you are a student).', expected: ['trabajo', 'soy estudiante', 'soy', 'me dedico'], hint: '"Soy estudiante" or "Trabajo de..." or "Trabajo en...".' },
    ],
  },
  {
    id: 'dlg-03',
    level: 'A1',
    title: '¿Cómo llego?',
    description: 'Asking for directions',
    turns: [
      { role: 'ai', text: 'Perdona, ¿sabes dónde está la estación de metro más cercana?', sk: 'Prepáč, vieš kde je najbližšia stanica metra?' },
      { role: 'user', prompt: 'Say sorry, you are not from here.', expected: ['lo siento', 'perdona', 'no soy de aquí', 'no conozco bien', 'no soy de esta ciudad'], hint: '"Lo siento, no soy de aquí."' },
      { role: 'ai', text: 'No pasa nada. ¿Puedes ayudarme a buscar en el móvil?', sk: 'Nevadí. Môžeš mi pomôcť vyhľadať to na mobile?' },
      { role: 'user', prompt: 'Say yes of course, and that it is two streets from here.', expected: ['claro', 'por supuesto', 'sí', 'está a dos calles', 'dos calles'], hint: '"Claro, está a dos calles de aquí."' },
      { role: 'ai', text: 'Muchas gracias. ¡Muy amable!', sk: 'Veľmi pekne ďakujem. Veľmi milé!' },
      { role: 'user', prompt: 'Say no problem and have a good day.', expected: ['de nada', 'no hay de qué', 'buen día', 'buen día', 'que tengas un buen día', 'igualmente'], hint: '"De nada. ¡Que tengas un buen día!"' },
    ],
  },
  {
    id: 'dlg-04',
    level: 'A2',
    title: 'En el médico',
    description: 'At the doctor\'s',
    turns: [
      { role: 'ai', text: 'Buenos días. ¿Qué le pasa?', sk: 'Dobré ráno. Čo vám je?' },
      { role: 'user', prompt: 'Say you have a headache and feel tired since yesterday.', expected: ['me duele la cabeza', 'estoy cansada', 'desde ayer', 'tengo dolor de cabeza'], hint: '"Me duele la cabeza y estoy cansada desde ayer."' },
      { role: 'ai', text: '¿Tiene fiebre?', sk: 'Máte horúčku?' },
      { role: 'user', prompt: 'Say you think so, it was 38 degrees this morning.', expected: ['creo que sí', 'tenía', '38 grados', 'esta mañana', 'creo'], hint: '"Creo que sí. Esta mañana tenía 38 grados."' },
      { role: 'ai', text: 'Voy a recetarle un analgésico. Tome uno cada ocho horas.', sk: 'Predpíšem vám liek na bolesť. Berte jeden každých osem hodín.' },
      { role: 'user', prompt: 'Thank the doctor and ask if you can go to work.', expected: ['gracias', 'puedo ir', 'al trabajo', 'ir a trabajar'], hint: '"Muchas gracias. ¿Puedo ir a trabajar?"' },
    ],
  },
  {
    id: 'dlg-05',
    level: 'A2',
    title: 'Reservar un hotel',
    description: 'Booking a hotel room',
    turns: [
      { role: 'ai', text: 'Hotel Mediterráneo, buenas tardes. ¿En qué puedo ayudarle?', sk: 'Hotel Mediterráneo, dobrý deň. Čím vám môžem pomôcť?' },
      { role: 'user', prompt: 'Say you want to book a double room for two nights.', expected: ['quiero reservar', 'una habitación doble', 'dos noches', 'quisiera'], hint: '"Quisiera reservar una habitación doble para dos noches."' },
      { role: 'ai', text: '¿Para qué fechas?', sk: 'Na aké termíny?' },
      { role: 'user', prompt: 'Say from the 15th to the 17th of July.', expected: ['del quince', 'quince de julio', 'al diecisiete', '15', '17', 'julio'], hint: '"Del quince al diecisiete de julio."' },
      { role: 'ai', text: 'Perfecto. Son 120 euros por noche. ¿El desayuno está incluido?', sk: 'Perfektné. Je to 120 eur za noc. Sú raňajky v cene?' },
      { role: 'user', prompt: 'Ask if breakfast is included and whether there is free parking.', expected: ['desayuno', 'aparcamiento', 'parking', 'incluido', 'gratuito', 'hay'], hint: '"¿Está incluido el desayuno? ¿Y hay aparcamiento gratuito?"' },
    ],
  },
]
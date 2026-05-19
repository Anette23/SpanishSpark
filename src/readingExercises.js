// Reading comprehension exercises for SpanishSpark — A1/A2 level

export const READING_EXERCISES = [
  {
    id: 'read-1',
    level: 'A1',
    title: 'Mi rutina diaria',
    passage: `Me llamo Ana. Soy estudiante y vivo en Valencia con mi familia. Todos los días me levanto a las siete de la mañana. Primero me ducho y luego desayuno. Normalmente desayuno tostadas con mantequilla y un café con leche.

A las ocho y media salgo de casa y voy a la universidad en autobús. Las clases empiezan a las nueve. Tengo cuatro clases por la mañana y una hora para comer al mediodía.

Por la tarde, a veces estudio en la biblioteca o quedo con mis amigos en un café. Por la noche ceno con mi familia a las ocho y media. Después veo un poco la televisión o leo un libro. Me acuesto a las once de la noche.`,
    questions: [
      {
        q: 'What time does Ana wake up?',
        options: ['At six in the morning', 'At seven in the morning', 'At eight in the morning', 'At nine in the morning'],
        answer: 1,
      },
      {
        q: 'How does Ana get to university?',
        options: ['By car', 'By bicycle', 'By bus', 'On foot'],
        answer: 2,
      },
      {
        q: 'What does Ana do in the afternoons?',
        options: ['She works at a café', 'She studies or meets friends', 'She sleeps', 'She cooks dinner'],
        answer: 1,
      },
      {
        q: 'What time does Ana go to bed?',
        options: ['At nine', 'At ten', 'At eleven', 'At midnight'],
        answer: 2,
      },
    ],
  },

  {
    id: 'read-2',
    level: 'A1',
    title: 'El mercado',
    passage: `En España, los mercados son muy populares. En el mercado puedes comprar fruta, verduras, carne, pescado y muchas otras cosas. Los mercados están abiertos todos los días de la semana, normalmente de nueve de la mañana a dos de la tarde.

El mercado de San Miguel está en Madrid y es muy famoso. Allí puedes comer tapas, beber vino y comprar productos típicos españoles. También hay mercados en otros barrios de la ciudad.

Muchas personas van al mercado porque la comida es fresca y de buena calidad. Es también un lugar para encontrar a los vecinos y charlar un poco. Los mercados son una parte importante de la cultura española.`,
    questions: [
      {
        q: 'What can you buy at a Spanish market?',
        options: ['Only vegetables', 'Clothes and shoes', 'Fruit, meat, fish and more', 'Only typical Spanish products'],
        answer: 2,
      },
      {
        q: 'What are the typical opening hours of a market?',
        options: ['7am to 1pm', '9am to 2pm', '10am to 5pm', '8am to 3pm'],
        answer: 1,
      },
      {
        q: 'Where is the Mercado de San Miguel?',
        options: ['In Valencia', 'In Seville', 'In Madrid', 'In Barcelona'],
        answer: 2,
      },
      {
        q: 'Why do many people prefer markets?',
        options: ['Because they are cheaper', 'Because the food is fresh and good quality', 'Because they sell international food', 'Because they are open at night'],
        answer: 1,
      },
    ],
  },

  {
    id: 'read-3',
    level: 'A1',
    title: 'Mi familia',
    passage: `Hola. Me llamo Carlos y tengo veinticinco años. Soy de Sevilla, una ciudad del sur de España. Vivo con mis padres y mi hermana pequeña, Lucía. Lucía tiene dieciséis años y estudia en el instituto.

Mi madre se llama Carmen y trabaja en un hospital. Es enfermera y trabaja muchas horas. Mi padre se llama Antonio y tiene un restaurante pequeño en el centro de la ciudad.

Los domingos, toda la familia come junta en casa. Mi abuela también viene a comer. Preparamos platos típicos andaluces. Me encanta pasar tiempo con mi familia — es lo más importante para mí.`,
    questions: [
      {
        q: 'How old is Carlos?',
        options: ['16', '20', '25', '30'],
        answer: 2,
      },
      {
        q: 'What does Carlos\'s mother do for work?',
        options: ['She is a teacher', 'She is a nurse', 'She owns a restaurant', 'She works in a school'],
        answer: 1,
      },
      {
        q: 'What does the family do on Sundays?',
        options: ['They go to a restaurant', 'They eat together at home', 'They visit friends', 'They go to the cinema'],
        answer: 1,
      },
      {
        q: 'Where is Carlos from?',
        options: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
        answer: 3,
      },
    ],
  },

  {
    id: 'read-4',
    level: 'A2',
    title: 'Un fin de semana en Madrid',
    passage: `El fin de semana pasado, mi amiga Sara y yo visitamos Madrid por primera vez. Llegamos el viernes por la tarde en tren y fuimos directamente al hotel. El hotel estaba muy bien situado — a cinco minutos a pie del centro.

El sábado por la mañana fuimos al Museo del Prado, uno de los museos más famosos del mundo. Había muchas pinturas de artistas como Velázquez y Goya. Después comimos en un restaurante típico donde probamos la cocina madrileña: cocido madrileño y churros con chocolate.

Por la tarde paseamos por el Parque del Retiro y nos sentamos junto al lago a tomar el sol. Por la noche fuimos a un espectáculo de flamenco — fue increíble. El domingo visitamos el Rastro, un mercadillo muy famoso, y compramos algunas cosas como recuerdo. Fue un fin de semana perfecto.`,
    questions: [
      {
        q: 'How did they travel to Madrid?',
        options: ['By plane', 'By car', 'By train', 'By bus'],
        answer: 2,
      },
      {
        q: 'What did they visit on Saturday morning?',
        options: ['The Royal Palace', 'The Retiro Park', 'The Prado Museum', 'A flamenco show'],
        answer: 2,
      },
      {
        q: 'What did they do at the Parque del Retiro?',
        options: ['They went swimming', 'They sat by the lake in the sun', 'They visited a museum', 'They had dinner'],
        answer: 1,
      },
      {
        q: 'What is "El Rastro"?',
        options: ['A famous restaurant', 'A large park', 'A famous outdoor market', 'A flamenco show'],
        answer: 2,
      },
    ],
  },

  {
    id: 'read-5',
    level: 'A2',
    title: 'El transporte en España',
    passage: `En España hay diferentes formas de transporte. Las ciudades grandes como Madrid y Barcelona tienen metro, autobús y tranvía. El metro es rápido y cómodo para moverse por la ciudad. Los billetes de transporte público son bastante baratos — puedes comprar un bono de diez viajes para ahorrar dinero.

Entre ciudades, la opción más popular es el tren. España tiene una red de trenes de alta velocidad llamada AVE. El AVE conecta ciudades como Madrid, Barcelona, Sevilla y Valencia en pocas horas. Es caro pero muy cómodo y puntual.

También hay muchas personas que viajan en coche porque en algunas zonas rurales no hay transporte público. Sin embargo, aparcar en las ciudades puede ser difícil y caro. Los españoles también usan bicicleta en las ciudades, especialmente en ciudades como Sevilla, que tiene muchos carriles bici.`,
    questions: [
      {
        q: 'How is the metro described?',
        options: ['Slow but cheap', 'Fast and comfortable', 'Expensive but reliable', 'The only option in big cities'],
        answer: 1,
      },
      {
        q: 'What is the AVE?',
        options: ['A type of bus', 'A high-speed train network', 'A cycling route', 'A discount travel card'],
        answer: 1,
      },
      {
        q: 'Why do some people travel by car?',
        options: ['Because it is cheaper', 'Because trains are often late', 'Because public transport does not reach rural areas', 'Because parking is free'],
        answer: 2,
      },
      {
        q: 'Which city is mentioned for having many cycle lanes?',
        options: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
        answer: 3,
      },
    ],
  },

  {
    id: 'read-6',
    level: 'A2',
    title: 'La comida española',
    passage: `La gastronomía española es famosa en todo el mundo. Hay platos muy diferentes según la región. En el norte de España, como en el País Vasco, se come mucho pescado y marisco. En la zona mediterránea, como Valencia, el plato más famoso es la paella, que se hace con arroz, verduras y, a veces, pollo o mariscos.

En toda España es muy popular tomar tapas. Las tapas son pequeños platos de comida que puedes tomar mientras bebes algo. En algunas regiones, como Andalucía, las tapas son gratuitas si pides una bebida.

El horario de las comidas en España es diferente al de otros países. Los españoles desayunan poco por la mañana, comen al mediodía — entre las dos y las cuatro de la tarde — y cenan tarde, normalmente entre las nueve y las diez de la noche.`,
    questions: [
      {
        q: 'What is paella traditionally made with?',
        options: ['Fish and seafood only', 'Rice, vegetables and sometimes chicken or seafood', 'Meat and potatoes', 'Pasta and tomatoes'],
        answer: 1,
      },
      {
        q: 'What are tapas?',
        options: ['A type of dessert', 'A large main course', 'Small dishes of food to share', 'A traditional Spanish drink'],
        answer: 2,
      },
      {
        q: 'In which region can you get free tapas with a drink?',
        options: ['Catalonia', 'The Basque Country', 'Andalusia', 'Valencia'],
        answer: 2,
      },
      {
        q: 'What time do Spanish people typically have dinner?',
        options: ['At 6–7pm', 'At 7–8pm', 'At 8–9pm', 'At 9–10pm'],
        answer: 3,
      },
    ],
  },
]
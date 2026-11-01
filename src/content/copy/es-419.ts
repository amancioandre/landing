import type { Copy } from "./copy";

// AI translation of en.ts for Latin America (2026-10-29), awaiting Andre's review.
export const ES_419: Copy = {
  site: {
    summary: "El hub de André Amnc. Mi manera de presentarme al mundo, de forma creativa y lúdica: mis intereses, lo que puedo hacer por ti y lo que le devuelvo a la naturaleza y a la sociedad.",
    more: "Espero que vivas mis intereses como yo los vivo, a través de los enlaces y contenidos que te traigo: la ingeniería de software y el código en el que estoy trabajando (¡o con el que estoy jugando!), los videos y artículos de un aventurero al aire libre, las novelas y los cuentos que estoy creando, aventuras de caza por toda la Columbia Británica y las dificultades de emprender en la era de la IA.",
    imageAlt: "La cordillera en ASCII de andreamnc.com",
  },
  sections: { latest: "Lo último", interests: "Intereses", now: "Ahora", write: "escríbeme", nav: "Secciones", menu: "Menú" },
  interests: {
    Engineer: {
      label: "Ingeniero",
      line: "La ingeniería ha sido mi forma de ganarme la vida, y la disfruto muchísimo. Casi no ha habido un día en que no la haya practicado, en software o resolviendo problemas, dondequiera que esté.",
      alt: "Dos vagones tanque en un patio ferroviario, vistos desde arriba",
    },
    Outdoorsman: {
      label: "Aventurero",
      line: "La pasión que me llegó tarde, y la razón por la que estoy redescubriendo mi vida. La naturaleza salvaje ha sido una gran amiga y maestra.",
      alt: "André con gorro y chaqueta a cuadros, mirando hacia el agua",
    },
    Writer: {
      label: "Escritor",
      line: "Escribir es una forma de ahondar en mi vida, procesar mis experiencias y darles libertad a mis pensamientos. Contar historias es el vehículo de la tradición.",
      alt: "Una cabaña en un bosque oscuro sobre el agua",
    },
    Hunter: {
      label: "Cazador",
      line: "La caza me conecta con la tierra y con lo salvaje, allá afuera y dentro de mí. Ser responsable de una vida, y de tu propio sustento, es una práctica de reverencia espiritual hacia la naturaleza.",
      alt: "André con sombrero de ala ancha y una bolsa de pecho, con montañas detrás",
    },
    Entrepreneur: {
      label: "Emprendedor",
      line: "Ser mi propio jefe siempre ha sido mi sueño, y también mi némesis. Es una experiencia abrumadora que te enseña humildad, y pone en perspectiva lo que significa aportarle valor a la sociedad.",
      alt: "Mirando hacia arriba una torre de concreto hasta su mirador",
    },
  },
  links: { "Code on GitHub": "Código en GitHub", "Films on YouTube": "Videos en YouTube", "Stories on Substack": "Historias en Substack" },
  range: { label: "La cordillera: cinco intereses", index: "Intereses", photoToCome: "foto próximamente", lineToCome: "[una frase con tus palabras]" },
  settings: {
    name: "Configuración", weather: "Clima", fog: "Niebla", wind: "Viento", from: "Desde", west: "oeste",
    east: "este", clouds: "Nubes", time: "Hora", clock: "Mi reloj", day: "Día", night: "Noche",
    campfire: "Fogata", fire: "Fuego", smoke: "Humo", ink: "Tinta", moonlight: "Luz de luna",
    starlight: "Luz de estrellas", faint: "Tenue", stars: "Estrellas", ascii: "ASCII", glyphs: "Glifos",
    characters: "Caracteres", asDrawn: "Como está", full: "Completos", round: "Redondos", contrast: "Contraste",
    mist: "Bruma",
  },
  carousel: { carouselRole: "carrusel", slideRole: "diapositiva" },   // the Now carousel's roles, for screen readers
  latest: { nothingYet: "[todavía no hay nada publicado]" },
  now: {
    kinds: { note: "Nota", story: "Relato", post: "Publicación", code: "Código" },
    previous: "Anterior", next: "Siguiente", strip: "Ahora, uno a la vez; usa las flechas", slide: "{n} de {total}: {kind}",
    open: { note: "Leer en {where}", story: "Leer en {where}", post: "Ver en {where}", code: "Código en GitHub" },
  },
  letter: {
    opening: "escríbeme",
    message: "Tu mensaje", email: "Tu correo", emailPlaceholder: "Tu correo, para poder responderte", enter: "enter",
    edit: "Editar mensaje", another: "Otra pregunta", orWriteTo: "o escribe a",
    badEmail: "Ese correo no parece correcto.",
    failed: "No se pudo enviar. Escribe a {address}.",
    sent: "Enviado. Gracias.",
  },
  prompts: [
    "Medita unas palabras",
    "¿Qué escribiría tu modelo a seguir?",
    "¿Saliste hoy al aire libre?",
    "¿Viste el amanecer hoy?",
    "¿Miras hacia atrás a tu casa, cuando sales a trabajar, y piensas: ‘Qué suerte tengo’?",
    "¿Te convence?",
    "¿Te tomaste hoy un momento para reflexionar antes de envejecer un poco más?",
    "¿Vives en paz?",
    "¿Qué esperas lograr?",
    "¿Alguna vez te quedaste mirando el fondo de la tierra?",
    "¿Cuál es esa canción que te encanta?",
    "Cuéntame una historia",
    "Excavando recuerdos",
    "¡Hola!",
    "¿Qué te quita el sueño?",
    "¿A ti también te gusta el canal de YouTube OutdoorBoyz?",
    "¿Necesitas ayuda para encontrar lo que realmente estás buscando?",
  ],
  asks: {
    Engineer: "¿Qué le preguntarías al ingeniero?",
    Outdoorsman: "¿Qué le preguntarías al aventurero?",
    Writer: "¿Qué le preguntarías al escritor?",
    Hunter: "¿Qué le preguntarías al cazador?",
    Entrepreneur: "¿Qué le preguntarías al emprendedor?",
  },
  offer: "Leer en español",
  footer: { channels: "Canales", languages: "Idiomas" },
};

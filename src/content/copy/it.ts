import type { Copy } from "./copy";

// AI translation of en.ts (2026-10-29), awaiting Andre's review.
export const IT: Copy = {
  site: {
    summary: "L’hub di André Amnc. Il mio modo di presentarmi al mondo, in modo creativo e giocoso: i miei interessi, cosa posso fare per te e cosa restituisco alla natura e alla società.",
    more: "Spero che tu viva i miei interessi come li vivo io, attraverso i link e i contenuti che ti porto: l’ingegneria del software e il codice su cui sto lavorando (o con cui sto giocando!), i video e gli articoli di un avventuriero all’aria aperta, i romanzi e i racconti che sto creando, avventure di caccia in tutta la Columbia Britannica e le fatiche dell’imprenditoria nell’era dell’IA.",
    imageAlt: "La catena montuosa in ASCII di andreamnc.com",
  },
  sections: { latest: "Ultimi", interests: "Interessi", write: "scrivimi", nav: "Sezioni", menu: "Menu" },
  interests: {
    Engineer: {
      label: "Ingegnere",
      line: "L’ingegneria è stata il mio modo di guadagnarmi il pane, e mi dà grande piacere. Non c’è quasi stato un giorno in cui non l’abbia praticata, nel software o nel risolvere problemi, ovunque io sia.",
      alt: "Due carri cisterna in uno scalo ferroviario, visti dall’alto",
    },
    Outdoorsman: {
      label: "Avventuriero",
      line: "La mia passione arrivata tardi, e il motivo per cui sto riscoprendo la mia vita. La natura selvaggia è stata una grande amica e maestra.",
      alt: "André con un berretto e una giacca a quadri, che guarda verso l’acqua",
    },
    Writer: {
      label: "Scrittore",
      line: "Scrivere è un modo per scavare a fondo nella mia vita, elaborare le mie esperienze e dare libertà ai miei pensieri. Raccontare storie è il veicolo della tradizione.",
      alt: "Una baita in un bosco scuro sopra l’acqua",
    },
    Hunter: {
      label: "Cacciatore",
      line: "La caccia mi connette con la terra e con il selvaggio, là fuori e dentro di me. Essere responsabili di una vita, e del proprio sostentamento, è una pratica di reverenza spirituale verso la natura.",
      alt: "André con un cappello a tesa larga e una borsa da petto, le montagne alle spalle",
    },
    Entrepreneur: {
      label: "Imprenditore",
      line: "Essere il capo di me stesso è sempre stato il mio sogno, e anche la mia nemesi. È un’esperienza scoraggiante che insegna l’umiltà, e mette in prospettiva cosa significa portare valore alla società.",
      alt: "Lo sguardo che risale una torre di cemento fino alla sua terrazza panoramica",
    },
  },
  links: { "Code on GitHub": "Codice su GitHub", "Films on YouTube": "Film su YouTube", "Stories on Substack": "Storie su Substack" },
  range: { label: "La catena: cinque interessi", index: "Interessi", photoToCome: "foto in arrivo", lineToCome: "[una frase con le tue parole]" },
  carousel: {
    all: "Tutti gli interessi", previous: "Interesse precedente", next: "Interesse successivo",
    strip: "Interessi, uno alla volta; usa le frecce", slide: "{n} di {total}: {name}", show: "Mostra {name}",
    carouselRole: "carosello", slideRole: "diapositiva",
  },
  latest: { nothingYet: "[ancora niente di pubblicato]" },
  letter: {
    opening: "scrivimi",
    message: "Il tuo messaggio", email: "La tua email", emailPlaceholder: "La tua email, così posso risponderti", enter: "invio",
    edit: "Modifica il messaggio", another: "Un’altra domanda", orWriteTo: "oppure scrivi a",
    badEmail: "Quell’email non sembra giusta.",
    failed: "Non è andata a buon fine. Scrivi invece a {address}.",
    sent: "Inviato. Grazie.",
  },
  prompts: [
    "Medita qualche parola",
    "Cosa scriverebbe il tuo modello?",
    "Hai passato del tempo all’aperto oggi?",
    "Hai visto l’alba oggi?",
    "Ti volti a guardare casa tua, quando esci per andare al lavoro, e pensi: ‘Che fortuna che ho’?",
    "Ti convince?",
    "Hai trovato un momento oggi per riflettere prima di invecchiare ancora?",
    "Vivi in pace?",
    "Cosa speri di realizzare?",
    "Hai mai fissato il fondo della terra?",
    "Qual è quella canzone che ami e basta?",
    "Raccontami una storia",
    "Scavando tra i ricordi",
    "Ciao!",
    "Cosa ti toglie il sonno la notte?",
    "Ti piace anche il canale YouTube OutdoorBoyz?",
    "Hai bisogno di aiuto per trovare ciò che stai davvero cercando?",
  ],
  asks: {
    Engineer: "Cosa chiederesti all’ingegnere?",
    Outdoorsman: "Cosa chiederesti all’avventuriero?",
    Writer: "Cosa chiederesti allo scrittore?",
    Hunter: "Cosa chiederesti al cacciatore?",
    Entrepreneur: "Cosa chiederesti all’imprenditore?",
  },
  offer: "Leggi in italiano",
  footer: { channels: "Canali", languages: "Lingue" },
};

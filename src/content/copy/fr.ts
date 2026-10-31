import type { Copy } from "./copy";

// AI translation of en.ts (2026-10-29), awaiting Andre's review.
export const FR: Copy = {
  site: {
    summary: "Le hub d’André Amnc. Ma façon de me présenter au monde, avec créativité et légèreté : mes centres d’intérêt, ce que je peux faire pour toi, et ce que je rends à la nature et à la société.",
    more: "J’espère que tu vivras mes centres d’intérêt comme je les vis, à travers les liens et les contenus que je t’apporte : le génie logiciel et le code sur lequel je travaille (ou avec lequel je m’amuse !), les vidéos et articles d’un aventurier du plein air, les romans et nouvelles que j’écris, des aventures de chasse à travers la Colombie-Britannique, et les difficultés de l’entrepreneuriat à l’ère de l’IA.",
    imageAlt: "La chaîne de montagnes en ASCII d’andreamnc.com",
  },
  sections: { latest: "Récent", interests: "Centres d’intérêt", now: "Maintenant", write: "écris-moi", nav: "Sections", menu: "Menu" },
  interests: {
    Engineer: {
      label: "Ingénieur",
      line: "L’ingénierie a été mon gagne-pain, et j’y prends un grand plaisir. Il n’y a guère eu de jour où je ne l’aie pas pratiquée, dans le logiciel ou la résolution de problèmes, où que je sois.",
      alt: "Deux wagons-citernes dans une gare de triage, vus d’en haut",
    },
    Outdoorsman: {
      label: "Aventurier",
      line: "Ma passion tardive, et la raison pour laquelle je redécouvre ma vie. La nature sauvage a été une grande amie et une grande enseignante.",
      alt: "André en bonnet et veste à carreaux, regardant au loin sur l’eau",
    },
    Writer: {
      label: "Écrivain",
      line: "Écrire est un moyen de creuser profondément ma vie, de digérer mes expériences et de donner de la liberté à mes pensées. Raconter des histoires est le véhicule de la tradition.",
      alt: "Une cabane dans une forêt sombre au-dessus de l’eau",
    },
    Hunter: {
      label: "Chasseur",
      line: "La chasse me relie à la terre et au sauvage, dehors et en moi. Être responsable d’une vie, et de sa propre subsistance, est une pratique de révérence spirituelle envers la nature.",
      alt: "André avec un chapeau à large bord et un sac de poitrine, des montagnes derrière lui",
    },
    Entrepreneur: {
      label: "Entrepreneur",
      line: "Être mon propre patron a toujours été mon rêve, et aussi ma némésis. C’est une expérience intimidante qui rend humble, et elle met en perspective ce que signifie apporter de la valeur à la société.",
      alt: "Une tour de béton vue d’en bas, jusqu’à sa plateforme d’observation",
    },
  },
  links: { "Code on GitHub": "Code sur GitHub", "Films on YouTube": "Films sur YouTube", "Stories on Substack": "Histoires sur Substack" },
  range: { label: "La chaîne : cinq centres d’intérêt", index: "Centres d’intérêt", photoToCome: "photo à venir", lineToCome: "[une phrase avec tes mots]" },
  carousel: {
    all: "Tous les centres d’intérêt", previous: "Centre d’intérêt précédent", next: "Centre d’intérêt suivant",
    strip: "Centres d’intérêt, un à la fois ; utilise les flèches du clavier", slide: "{n} sur {total} : {name}", show: "Afficher {name}",
    carouselRole: "carrousel", slideRole: "diapositive",
  },
  latest: { nothingYet: "[rien de publié pour l’instant]" },
  now: {
    kinds: { note: "Note", story: "Récit", post: "Publication", code: "Code" },
    previous: "Précédent", next: "Suivant", strip: "Maintenant, un à la fois ; utilise les flèches", slide: "{n} sur {total} : {kind}",
    open: { note: "Lire sur {where}", story: "Lire sur {where}", post: "Voir sur {where}", code: "Code sur GitHub" },
  },
  letter: {
    opening: "écris-moi",
    message: "Ton message", email: "Ton e-mail", emailPlaceholder: "Ton e-mail, pour que je puisse répondre", enter: "entrée",
    edit: "Modifier le message", another: "Une autre question", orWriteTo: "ou écris à",
    badEmail: "Cet e-mail ne semble pas correct.",
    failed: "L’envoi a échoué. Écris plutôt à {address}.",
    sent: "Envoyé. Merci.",
  },
  prompts: [
    "Médite quelques mots",
    "Qu’écrirait ton modèle ?",
    "As-tu mis le nez dehors aujourd’hui ?",
    "As-tu vu le lever du soleil aujourd’hui ?",
    "Te retournes-tu vers ta maison, en partant au travail, en pensant : « Quelle chance j’ai » ?",
    "Ça te convainc ?",
    "As-tu pris un moment aujourd’hui pour réfléchir avant de vieillir encore ?",
    "Vis-tu en paix ?",
    "Qu’espères-tu accomplir ?",
    "As-tu déjà contemplé le fond de la terre ?",
    "Quelle est cette chanson que tu adores ?",
    "Raconte-moi une histoire",
    "Fouiller dans les souvenirs",
    "Bonjour !",
    "Qu’est-ce qui t’empêche de dormir ?",
    "Tu aimes aussi la chaîne YouTube OutdoorBoyz ?",
    "As-tu besoin d’aide pour trouver ce que tu cherches vraiment ?",
  ],
  asks: {
    Engineer: "Que demanderais-tu à l’ingénieur ?",
    Outdoorsman: "Que demanderais-tu à l’aventurier ?",
    Writer: "Que demanderais-tu à l’écrivain ?",
    Hunter: "Que demanderais-tu au chasseur ?",
    Entrepreneur: "Que demanderais-tu à l’entrepreneur ?",
  },
  offer: "Lire en français",
  footer: { channels: "Chaînes", languages: "Langues" },
};

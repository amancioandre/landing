import type { Copy } from "./copy";

// AI translation of en.ts (2026-10-29), awaiting Andre's review.
export const PT_BR: Copy = {
  site: {
    summary: "O hub de André Amnc. Minha forma de me apresentar ao mundo, de um jeito criativo e lúdico: meus interesses, o que posso fazer por você e o que devolvo à natureza e à sociedade.",
    more: "Espero que você viva meus interesses como eu vivo, pelos links e conteúdos que trago para você: engenharia de software e o código em que estou trabalhando (ou brincando!), vídeos e artigos de um aventureiro ao ar livre, os romances e contos que estou criando, aventuras de caça por toda a Colúmbia Britânica e as dificuldades de empreender na era da IA.",
    imageAlt: "A cordilheira em ASCII de andreamnc.com",
  },
  sections: { latest: "Recentes", interests: "Interesses", now: "Agora", write: "escreva para mim", nav: "Seções", menu: "Menu" },
  interests: {
    Engineer: {
      label: "Engenheiro",
      line: "A engenharia tem sido o meu ganha-pão, e tenho grande prazer nela. Quase não houve um dia em que eu não a praticasse, em software ou resolvendo problemas, onde quer que eu esteja.",
      alt: "Dois vagões-tanque num pátio ferroviário, vistos de cima",
    },
    Outdoorsman: {
      label: "Aventureiro",
      line: "A paixão que chegou tarde na minha vida, e a razão pela qual estou redescobrindo a minha vida. A natureza selvagem tem sido uma grande amiga e mestra.",
      alt: "André de gorro e jaqueta xadrez, olhando para a água",
    },
    Writer: {
      label: "Escritor",
      line: "Escrever é um meio de mergulhar fundo na minha vida, processar minhas experiências e dar liberdade aos meus pensamentos. Contar histórias é o veículo da tradição.",
      alt: "Uma cabana numa floresta escura acima da água",
    },
    Hunter: {
      label: "Caçador",
      line: "A caça me conecta com a terra e com o selvagem, lá fora e dentro de mim. Ser responsável por uma vida, e pelo próprio sustento, é uma prática de reverência espiritual pela natureza.",
      alt: "André de chapéu de aba larga e bolsa peitoral, com montanhas atrás",
    },
    Entrepreneur: {
      label: "Empreendedor",
      line: "Ser meu próprio chefe sempre foi o meu sonho, e também a minha nêmesis. É uma experiência assustadora e que ensina humildade, e coloca em perspectiva o que é gerar valor para a sociedade.",
      alt: "Olhando para o alto de uma torre de concreto até o seu mirante",
    },
  },
  links: { "Code on GitHub": "Código no GitHub", "Films on YouTube": "Filmes no YouTube", "Stories on Substack": "Histórias no Substack" },
  range: { label: "A cordilheira: cinco interesses", index: "Interesses", photoToCome: "foto em breve", lineToCome: "[uma frase com suas palavras]" },
  carousel: {
    all: "Todos os interesses", previous: "Interesse anterior", next: "Próximo interesse",
    strip: "Interesses, um de cada vez; use as setas do teclado", slide: "{n} de {total}: {name}", show: "Mostrar {name}",
    carouselRole: "carrossel", slideRole: "slide",
  },
  latest: { nothingYet: "[nada publicado ainda]" },
  now: {
    kinds: { note: "Nota", story: "Conto", post: "Post", code: "Código" },
    previous: "Anterior", next: "Próximo", strip: "Agora, um de cada vez; use as setas", slide: "{n} de {total}: {kind}",
    open: { note: "Leia no {where}", story: "Leia no {where}", post: "Veja no {where}", code: "Código no GitHub" },
  },
  letter: {
    opening: "escreva para mim",
    message: "Sua mensagem", email: "Seu e-mail", emailPlaceholder: "Seu e-mail, para eu responder", enter: "enter",
    edit: "Editar mensagem", another: "Outra pergunta", orWriteTo: "ou escreva para",
    badEmail: "Esse e-mail não parece certo.",
    failed: "Não foi possível enviar. Escreva para {address}.",
    sent: "Enviado. Obrigado.",
  },
  prompts: [
    "Medite algumas palavras",
    "O que o seu ídolo escreveria?",
    "Você saiu ao ar livre hoje?",
    "Você viu o nascer do sol hoje?",
    "Você olha para trás, para a sua casa, quando sai para o trabalho, e pensa: ‘Que sorte eu tenho’?",
    "Isso te convence?",
    "Você parou um momento hoje para refletir antes de envelhecer mais um pouco?",
    "Você está vivendo em paz?",
    "O que você espera alcançar?",
    "Você já olhou fixamente para o fundo da terra?",
    "Qual é aquela música que você simplesmente ama?",
    "Me conte uma história",
    "Garimpando memórias",
    "Olá!",
    "O que tira o seu sono?",
    "Você também curte o canal OutdoorBoyz no YouTube?",
    "Você precisa de ajuda para encontrar o que realmente procura?",
  ],
  asks: {
    Engineer: "O que você perguntaria ao engenheiro?",
    Outdoorsman: "O que você perguntaria ao aventureiro?",
    Writer: "O que você perguntaria ao escritor?",
    Hunter: "O que você perguntaria ao caçador?",
    Entrepreneur: "O que você perguntaria ao empreendedor?",
  },
  offer: "Ler em português",
  footer: { channels: "Canais", languages: "Idiomas" },
};

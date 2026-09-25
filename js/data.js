const CHARACTERS = {
  eleven: {
    name: "Eleven",
    role: "Principal",
    desc: "Garota com poderes telecinéticos. Cabelo castanho preso e ondulado, roupa amarela com preto, calça preta.",
    skin: "#e8b48c", hair: "#4a2c1a", shirt: "#f2c12e", shirt2: "#1a1a1a", pants: "#141414",
    hairPonytail: true, hairWavy: true,
    hp: 100, speed: 3.0, power: "Telecinese", playable: true
  },
  max: {
    name: "Max Mayfield",
    role: "Aliada",
    desc: "Cabelo ruivo, pele branca, roupa listrada e short jeans.",
    skin: "#f2d0b8", hair: "#c1440e", shirt: "#e8e8e8", shirt2: "#d62828", pants: "#3a5a8c",
    hairLong: true, shirtStripes: true,
    hp: 80, speed: 3.4, power: "Coragem"
  },
  mike: {
    name: "Mike Wheeler",
    role: "Aliado",
    desc: "Cabelo preto, roupa amarela. Líder do grupo.",
    skin: "#e8b48c", hair: "#141414", shirt: "#f2c12e", shirt2: "#f2c12e", pants: "#c9a227",
    hp: 90, speed: 3.2, power: "Estratégia"
  },
  lucas: {
    name: "Lucas Sinclair",
    role: "Aliado",
    desc: "Pele marrom, cabelo preto, roupa verde.",
    skin: "#8d5524", hair: "#141414", shirt: "#2e8b57", shirt2: "#276749", pants: "#1f4d2e",
    hp: 105, speed: 3.0, power: "Força"
  },
  dustin: {
    name: "Dustin Henderson",
    role: "Aliado",
    desc: "Cabelo marrom ondulado, roupa vermelha.",
    skin: "#e8b48c", hair: "#5c3a21", shirt: "#c1121f", shirt2: "#9d0208", pants: "#780000",
    hp: 85, speed: 3.3, power: "Ciência"
  },
  will: {
    name: "Will Byers",
    role: "Aliada",
    desc: "Cabelo loiro escuro, jaqueta laranja.",
    skin: "#f2d0b8", hair: "#b8860b", shirt: "#ff7f00", shirt2: "#e65100", pants: "#37474f",
    jacket: true,
    hp: 75, speed: 3.1, power: "Visão"
  },
  nancy: { name: "Nancy Wheeler", role: "Aliada", desc: "Irmã mais velha de Mike, investigadora.", skin: "#f2d0b8", hair: "#8b5a2b", shirt: "#c9a227", shirt2: "#a8842b", pants: "#4a3728", hp: 90, speed: 3.2, power: "Pesquisa" },
  steve: { name: "Steve Harrington", role: "Aliado", desc: "O melhor babá de todos.", skin: "#e8b48c", hair: "#5c3a21", shirt: "#1e88e5", shirt2: "#1565c0", pants: "#263238", hp: 95, speed: 3.1, power: "Briga" },
  robin: { name: "Robin Buckley", role: "Aliada", desc: "Amiga de Steve, trabalha na locadora.", skin: "#f2d0b8", hair: "#a0522d", shirt: "#6a1b9a", shirt2: "#4a148c", pants: "#263238", hp: 85, speed: 3.3, power: "Raparidade" },
  joyce: { name: "Joyce Byers", role: "Aliada", desc: "Mãe de Will, luta com qualquer coisa.", skin: "#f2d0b8", hair: "#8b4513", shirt: "#2e7d32", shirt2: "#1b5e20", pants: "#4e342e", hp: 90, speed: 3.0, power: "Fuzil" },
  hopper: { name: "Jim Hopper", role: "Aliado", desc: "Delegado, figura paterna de Eleven.", skin: "#d7a06a", hair: "#7a7a7a", shirt: "#1a237e", shirt2: "#283593", pants: "#1a1a1a", hp: 130, speed: 2.9, power: "Combate" },
  jonathan: { name: "Jonathan Byers", role: "Aliado", desc: "Irmão de Will, fotógrafo.", skin: "#e8b48c", hair: "#3e2723", shirt: "#6d4c41", shirt2: "#4e342e", pants: "#3e2723", hp: 85, speed: 3.1, power: "Fotografia" },
  erica: { name: "Erica Sinclair", role: "Aliada", desc: "Irmã mais nova de Lucas, esperta e sarcástica.", skin: "#8d5524", hair: "#141414", shirt: "#00bcd4", shirt2: "#0097a7", pants: "#37474f", hp: 70, speed: 3.5, power: "Tecnologia" },
  vickie: { name: "Vickie", role: "Aliada", desc: "Paixão da Robin.", skin: "#f2d0b8", hair: "#c1440e", shirt: "#ec407a", shirt2: "#d81b60", pants: "#5d4037", hp: 70, speed: 3.2, power: "Coragem" },
  kali: { name: "Kali", role: "Aliada", desc: "Oito, a irmã da Eleven.", skin: "#8d5524", hair: "#1a1a1a", shirt: "#5e35b1", shirt2: "#4527a0", pants: "#212121", hp: 80, speed: 3.2, power: "Visão" },
  mrsTurnbow: { name: "Sra. Turnbow", role: "Aliada", desc: "Mãe do Derek.", skin: "#8d5524", hair: "#1a1a1a", shirt: "#795548", shirt2: "#5d4037", pants: "#3e2723", hp: 75, speed: 2.8, power: "Cuidado" },
  drKay: { name: "Dra. Kay", role: "Vilã", desc: "Cientista militar que lidera a ocupação de Hawkins e persegue a Eleven.", skin: "#e0b090", hair: "#7a4a2a", shirt: "#263238", shirt2: "#37474f", pants: "#1b1b1b", hp: 220, speed: 2.6, power: "Experimentos", villain: true },
  akers: { name: "Tenente Akers", role: "Vilão", desc: "Braço operacional da Dra. Kay.", skin: "#d7a06a", hair: "#3a3a3a", shirt: "#4a5a2a", shirt2: "#37451f", pants: "#2b2b1f", hp: 160, speed: 3.0, power: "Tática", villain: true },
  derek: { name: "Derek Turnbow", role: "Vilã", desc: "Colega de classe da Holly, intimidador.", skin: "#f2d0b8", hair: "#8b5a2b", shirt: "#9e9e9e", shirt2: "#757575", pants: "#424242", hp: 90, speed: 3.2, power: "Intimidação", villain: true },
  sullivan: { name: "Tenente Coronel Sullivan", role: "Vilão", desc: "Militar envolvido na caçada à Eleven.", skin: "#d7a06a", hair: "#5a5a5a", shirt: "#33691e", shirt2: "#1b5e20", pants: "#212121", hp: 200, speed: 2.7, power: "Comando", villain: true },
  brenner: { name: "Dr. Brenner", role: "Vilã", desc: "Cientista do Laboratório Hawkins, responsável pelos experimentos.", skin: "#e0c0a0", hair: "#6a6a6a", shirt: "#eceff1", shirt2: "#cfd8dc", pants: "#455a64", hp: 120, speed: 2.8, power: "Laboratório", villain: true },
  henry: { name: "Henry Creel", role: "Vilã", desc: "O Um. Primeiro experimento do laboratório, se tornou Vecna.", skin: "#d7a06a", hair: "#3e2723", shirt: "#6d4c41", shirt2: "#4e342e", pants: "#3e2723", hp: 150, speed: 3.0, power: "Telecinese", villain: true }
};

const MONSTERS = {
  demogorgon: { name: "Demogorgon", desc: "Criatura humanóide coberta de gosma, sem rosto, com pétalas que se abrem numa boca cheia de dentes.", hp: 320, speed: 1.5, damage: 22, color: "#5c1a2b", size: 34, xp: 100 },
  demogorgonJovem: { name: "Demogorgon Jovem", desc: "Filhote de Demogorgon, ainda pequeno.", hp: 90, speed: 2.4, damage: 10, color: "#7a2a3a", size: 18, xp: 30 },
  demodog: { name: "Demodog", desc: "Demogorgon de quatro patas. O Dart era um deles.", hp: 130, speed: 3.4, damage: 16, color: "#6b2737", size: 22, xp: 50 },
  dart: { name: "Dart", desc: "D'Artagnan, o Demodog de Dustin.", hp: 160, speed: 3.6, damage: 18, color: "#8a3542", size: 24, xp: 60 },
  mindFlayer: { name: "Devorador de Mentes", desc: "Monstro de sombra e fumaça, controla tudo pela mente colmeia.", hp: 520, speed: 1.3, damage: 28, color: "#1a0d2b", size: 42, xp: 250 },
  flayed: { name: "Esfolado", desc: "Humano possuído pelo Devorador de Mentes.", hp: 110, speed: 2.6, damage: 14, color: "#8a6a5a", size: 22, xp: 45 },
  spiderMonster: { name: "Monstro Aranha", desc: "Corpo físico do Devorador de Mentes feito de corpos derretidos.", hp: 600, speed: 1.4, damage: 30, color: "#2b0f2b", size: 46, xp: 300 },
  demobat: { name: "Demobat", desc: "Criatura alada com dentes afiados e caudas que enlaçam vítimas.", hp: 80, speed: 3.8, damage: 12, color: "#3b1a3b", size: 16, xp: 35 },
  vecna: { name: "Vecna", desc: "Henry Creel, o Um. Assassino do Mundo Invertido que ataca a mente antes do corpo.", hp: 850, speed: 1.8, damage: 35, color: "#6b1f1f", size: 38, xp: 500 },
  hospitalMonster: { name: "Monstro do Hospital", desc: "Feito de ossos e cartilagem humanos, se reformando sempre.", hp: 240, speed: 2.2, damage: 20, color: "#d4c8b8", size: 30, xp: 120 },
  vine: { name: "Cipó do Mundo Invertido", desc: "Sistema nervoso do Mundo Invertido, prende e sufoca.", hp: 150, speed: 2.0, damage: 18, color: "#2d4a2d", size: 26, xp: 60 },
  oldOne: { name: "O Antigo / Dark One", desc: "O Devorador de Mentes do Abismo que quer fundir os dois mundos.", hp: 1200, speed: 1.2, damage: 40, color: "#0d0d1a", size: 50, xp: 1000 }
};

const ITEMS = {
  faca: { name: "Faca", desc: "Lâmina de caça. Arma básica contra monstros.", type: "melee", damage: 18, cooldown: 320, range: 52 },
  taco: { name: "Taco de Beisebol", desc: "Arma improvisada do Mike.", type: "melee", damage: 30, cooldown: 480, range: 60 },
  tacoPregos: { name: "Taco com Pregos", desc: "Arma improvisada dos nerds.", type: "melee", damage: 42, cooldown: 560, range: 62 },
  machete: { name: "Machete", desc: "Lâmina pesada, causa muito dano.", type: "melee", damage: 58, cooldown: 700, range: 70 },
  espada: { name: "Espada", desc: "Espada usada contra o Vecna.", type: "melee", damage: 75, cooldown: 780, range: 78 },
  punhal: { name: "Punhal Ritual", desc: "Arma do ritual do Mundo Invertido.", type: "melee", damage: 52, cooldown: 520, range: 58 },
  lanterna: { name: "Lanterna", desc: "Ilumina o Mundo Invertido.", type: "light", desc2: "Revela o caminho", power: 2 },
  walkie: { name: "Walkie-Talkie", desc: "Comunicação com o grupo.", type: "utility", power: 1 },
  camera: { name: "Câmera", desc: "Revela o Mundo Invertido nas fotos.", type: "utility", power: 1 },
  fita: { name: "Fita Cassete", desc: "A música de Kate Bush enfraquece o Vecna.", type: "utility", power: 5 },
  coktelMolotov: { name: "Coquetel Molotov", desc: "Incêndio que fere o Demogorgon.", type: "special", damage: 60, cooldown: 900, range: 120 },
  spray: { name: "Spray de Pimenta", desc: "Desorienta monstros. Vence Martin Brenner.", type: "special", damage: 15, cooldown: 1000, range: 80 },
  chiclete: { name: "Chiclete", desc: "Isca os Monstros Koold-Aid Man.", type: "utility", power: 1 },
  diarioVecna: { name: "Diario de Vecna", desc: "Diário com as páginas arrancadas.", type: "utility", power: 1 }
};

const LOCATIONS = {
  escola: { name: "Escola de Hawkins", ground: "#3a4a2e", sky: "#5a7a4a" },
  floresta: { name: "Floresta de Hawkins", ground: "#2a3a1e", sky: "#456b2c" },
  casaWill: { name: "Casa do Will", ground: "#4a3a2e", sky: "#6b5240" },
  casaMike: { name: "Casa do Mike", ground: "#4a422e", sky: "#6b5f40" },
  casaDustinLucas: { name: "Casa do Dustin e Lucas", ground: "#3e3a2e", sky: "#5e5640" },
  mundoInvertido: { name: "Mundo Invertido", ground: "#2b1a2e", sky: "#4a2b4a" },
  abismo: { name: "O Abismo", ground: "#0a0a14", sky: "#1a0a1a" },
  lab: { name: "Laboratório Hawkins", ground: "#2a2e3a", sky: "#40485a" },
  creel: { name: "Casa Creel", ground: "#332a24", sky: "#4a3a2e" },
  hawkins: { name: "Cidade de Hawkins", ground: "#384038", sky: "#556055" }
};

const CHAPTERS = [
  // TEMPORADA 1 — 6 capítulos
  { s: 1, n: 1, title: "O Desaparecimento de Will", loc: "escola", text: "Will Byers desapareceu. Na escola de Hawkins, a luz piscou e ele sumiu. Mike, Dustin, Lucas e você, Eleven, começam a procurar.", enemies: ["demogorgonJovem"], boss: null, music: false, size: 0.9 },
  { s: 1, n: 2, title: "Na Floresta Sombria", loc: "floresta", text: "O rastro de folhas levou vocês à floresta. Demogorgons patrulham entre as árvores. Cuidado com o que se move no escuro.", enemies: ["demogorgonJovem", "demogorgon"], boss: null, music: false, size: 0.92 },
  { s: 1, n: 3, title: "A Casa dos Byers", loc: "casaWill", text: "JoyceByers recebeu vocês em casa. As luzes de Natal de Will piscam: um código para dizer que ele ainda está vivo, em outro lugar.", enemies: ["demogorgonJovem"], boss: null, music: false, size: 0.94 },
  { s: 1, n: 4, title: "A Casa do Dustin e Lucas", loc: "casaDustinLucas", text: "Vocês se reuniram na casa do Dustin e Lucas para montar o plano. O demogorgon está se aproximando de Hawkins.", enemies: ["demogorgonJovem", "demodog"], boss: null, music: false, size: 0.96 },
  { s: 1, n: 5, title: "O Mundo Invertido", loc: "mundoInvertido", text: "Através de uma fenda, vocês entram no Mundo Invertido. Não confunda a realidade: as paredes observam.", enemies: ["vine", "demodog"], boss: null, music: false, size: 0.98 },
  { s: 1, n: 6, title: "O Demogorgon", loc: "mundoInvertido", text: "O monstro de Hawkins se revela. Somente a telecinese da Eleven pode derrotá-lo. Use seus poderes para destruir o Demogorgon.", enemies: ["demogorgon"], boss: "demogorgon", music: false, size: 1.0 },

  // TEMPORADA 2 — 6 capítulos
  { s: 2, n: 1, title: "Um Ano Depois", loc: "casaMike", text: "Um ano se passou. Will ainda tem sequelas do Mundo Invertido. Vocês estão na casa do Mike quando o Devorador de Mentes se manifesta.", enemies: ["flayed"], boss: null, music: false, size: 1.05 },
  { s: 2, n: 2, title: "Dart, o Demodog", loc: "casaDustinLucas", text: "Dustin encontrou uma pequena criatura no lixo. Ele chamou de Dart. Mas Dart está crescendo rápido demais.", enemies: ["dart", "demogorgonJovem"], boss: null, music: false, size: 1.08 },
  { s: 2, n: 3, title: "A Casa do Will", loc: "casaWill", text: "Will está sendo controlado pelo Devorador de Mentes. A família Byers luta para trazê-lo de volta com lembranças boas.", enemies: ["flayed", "vine"], boss: null, music: false, size: 1.1 },
  { s: 2, n: 4, title: "Os Túneis de Hawkins", loc: "mundoInvertido", text: "Sob Hawkins há túneis infestado de Demodogs. Eles mataram Bob Newby. Vengeance é a missão.", enemies: ["demodog", "demogorgonJovem", "vine"], boss: null, music: false, size: 1.12 },
  { s: 2, n: 5, title: "O Portal do Mind Flayer", loc: "mundoInvertido", text: "Um portal massivo se abriu com o Devorador de Mentes atrás. Você deve fechar a fenda para cortar o monstro do seu exército.", enemies: ["demodog", "flayed", "vine"], boss: null, music: false, size: 1.14 },
  { s: 2, n: 6, title: "O Devorador de Mentes", loc: "mundoInvertido", text: "O Shadow Monster se manifesta. Use a telecinese para romper o hive mind e expulsar o Devorador de Mentes de Hawkins.", enemies: ["mindFlayer"], boss: "mindFlayer", music: false, size: 1.16 },

  // TEMPORADA 3 — 6 capítulos
  { s: 3, n: 1, title: "O Verão de 1985", loc: "escola", text: "Novo ano, novas confusões. O Mall Starcourt abriu. Debaixo dele, os russos querem reabrir o portal.", enemies: ["flayed", "demodog"], boss: null, music: false, size: 1.2 },
  { s: 3, n: 2, title: "Máquinas de Doces", loc: "hawkins", text: "Steve e Robin trabalham no fliperama Scoops Ahoy. O Chegouays do Mind Flayer está se formando com corpos derretidos.", enemies: ["flayed", "demogorgonJovem"], boss: null, music: false, size: 1.22 },
  { s: 3, n: 3, title: "A Casa do Dustin e Lucas", loc: "casaDustinLucas", text: "O grupo se reúne na casa dos meninos. Billy Hargrove foi possuído pelo Devorador de Mentes e virou um Esfolado.", enemies: ["flayed", "demodog", "vine"], boss: null, music: false, size: 1.24 },
  { s: 3, n: 4, title: "A Floresta em Chamas", loc: "floresta", text: "Atacam o vale do Hawkins. Perigosos esfolados surgem entre as árvores. Max e o grupo lutam lado a lado.", enemies: ["flayed", "demodog", "demogorgon"], boss: null, music: false, size: 1.26 },
  { s: 3, n: 5, title: "Starcourt e o Russian Gate", loc: "lab", text: "A operação russa quer abrir o portal do Mundo Invertido sob o shopping. Vença os guardas e feche a passagem.", enemies: ["flayed", "demodog", "vine", "demogorgon"], boss: null, music: false, size: 1.28 },
  { s: 3, n: 6, title: "O Monstro Aranha", loc: "lab", text: "O Monstro Aranha, formado dos Esfolados, ataca! Na cabana do Hopper, a batalha final. Use a telecinese para vencê-lo.", enemies: ["spiderMonster"], boss: "spiderMonster", music: false, size: 1.3 },

  // TEMPORADA 4 — 6 capítulos
  { s: 4, n: 1, title: "A Volta de Max", loc: "escola", text: "Max Mayfield chegou à Hawkins. Mas seus sonhosocom Vecna, que ataca a mente de jovens antes de matar o corpo.", enemies: ["flayed", "demobat"], boss: null, music: false, size: 1.34 },
  { s: 4, n: 2, title: "Chrissy Cunningham", loc: "casaWill", text: "Chrissy foi morta por Vecna na Casa Creel. Os Restos de Chrissy se levantaram como Demobats. Não deixe que a Darkness tome conta.", enemies: ["demobat", "vine", "flayed"], boss: null, music: false, size: 1.36 },
  { s: 4, n: 3, title: "A Floresta de Vecna", loc: "floresta", text: "Eddie Munson sacrificeu-se para salvar o grupo dos Demobats. O Vecna agora sabe que vocês estão vindo.", enemies: ["demobat", "demodog", "demogorgon"], boss: null, music: false, size: 1.38 },
  { s: 4, n: 4, title: "O Clube Hellfire", loc: "casaMike", text: "O grupo se reúne na casa do Mike. Os sobreviventes do Hellfire lutam juntos. Prepare-se: o portal do lago está prestes a abrir.", enemies: ["demobat", "flayed", "hospitalMonster"], boss: null, music: false, size: 1.4 },
  { s: 4, n: 5, title: "Dentro do Mundo Invertido", loc: "mundoInvertido", text: "A equipe mergulha no Mundo Invertido em busca de Max. A Residência Creel é a base do Vecna. Sobreviva à escuridão.", enemies: ["demobat", "vine", "hospitalMonster", "flayed"], boss: null, music: true, size: 1.42 },
  { s: 4, n: 6, title: "Vecna", loc: "creel", text: "Henry Creel, o Um, é o Vecna. Ele mata quebra ossos e implode os olhos das vítimas. Use a fita de Kate Bush e a telecinese para destruí-lo.", enemies: ["vecna"], boss: "vecna", music: true, size: 1.44 },

  // TEMPORADA 5 — 6 capítulos
  { s: 5, n: 1, title: "A Quarentena", loc: "hawkins", text: "1987. Hawkins está sob lockdown militar. Fendas abertas. Caos total. A Dra. Kay chegou para capturado a Eleven.", enemies: ["flayed", "demobat", "demodog"], boss: null, music: false, size: 1.46 },
  { s: 5, n: 2, title: "O Exec-Kill de Vecna", loc: "escola", text: "Vecna sequestrou Holly Wheeler e outras onze crianças para fundir os mundos com o Abismo. O grupo se reúne para salvá-las.", enemies: ["flayed", "demobat", "demogorgon"], boss: null, music: false, size: 1.48 },
  { s: 5, n: 3, title: "A Casa do Will", loc: "casaWill", text: "Will voltou para casa. Sua conexão com o Mundo Invertido é a chave. O Mind Flayer despertou com as fendas abertas.", enemies: ["vine", "mindFlayer", "flayed"], boss: null, music: true, size: 1.5 },
  { s: 5, n: 4, title: "A Casa do Dustin e Lucas", loc: "casaDustinLucas", text: "O grupo se prepara na casa dos meninos. Dr. Kay e Tenente Akers chegaram. Não confiem em ninguém de farda.", enemies: ["flayed", "demobat", "dart", "demodog"], boss: null, music: false, size: 1.52 },
  { s: 5, n: 5, title: "No Coração do Abismo", loc: "abismo", text: "Dentro do Abismo, a dimensão do Dark One. As fendas se multiplicam. O time está quase no coração de Vecna.", enemies: ["mindFlayer", "hospitalMonster", "vine", "demogorgon", "demobat"], boss: null, music: true, size: 1.54 },
  { s: 5, n: 6, title: "O Fim do Mundo Invertido", loc: "abismo", text: "O confronto final. Vecna e o Antigo lutam pela fusão dos mundos. Eleven, use tudo que tem. Acabe com o Abismo e salve Hawkins.", enemies: ["vecna", "oldOne"], boss: "oldOne", music: true, size: 1.56 }
];

const SEASONS = {
  1: { name: "Temporada 1", subtitle: "O Desaparecimento", year: "1983" },
  2: { name: "Temporada 2", subtitle: "Will", year: "1984" },
  3: { name: "Temporada 3", subtitle: "O Shopping", year: "1985" },
  4: { name: "Temporada 4", subtitle: "Vecna", year: "1986" },
  5: { name: "Temporada 5", subtitle: "O Abismo", year: "1987" }
};

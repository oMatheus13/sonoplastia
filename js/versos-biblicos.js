/**
 * Script para gerenciar os versos bíblicos rotativos
 */

// Array com os versos bíblicos sobre música e louvor
const versosBiblicos = [
  {
    texto: "Louvem o Senhor com harpa; ofereçam-lhe música com instrumento de dez cordas. Cantem-lhe uma nova canção; toquem com habilidade ao aclamá-lo.",
    referencia: "Salmos 33:2-3"
  },
  {
    texto: "Pôs um novo cântico na minha boca, um hino de louvor ao nosso Deus. Muitos verão isso e temerão, e confiarão no Senhor.",
    referencia: "Salmos 40:3"
  },
  {
    texto: "Meu coração está firme, ó Deus, meu coração está firme; cantarei e farei música.",
    referencia: "Salmos 57:7"
  },
  {
    texto: "Como é bom render graças ao Senhor e cantar louvores ao teu nome, ó Altíssimo, anunciar de manhã o teu amor leal e de noite a tua fidelidade, ao som da lira de dez cordas e da cítara, e da melodia da harpa.",
    referencia: "Salmos 92:1-3"
  },
  {
    texto: "Venham, cantemos ao Senhor com alegria, aclamemos a Rocha da nossa salvação. Vamos à presença dele com ações de graças; vamos aclamá-lo com cânticos de louvor.",
    referencia: "Salmos 95:1-2"
  },
  {
    texto: "Aclamem o Senhor todos os habitantes da terra, cantem louvores, alegrem-se e façam música. Façam música ao Senhor com a harpa, com a harpa e ao som de canções, com cornetas e ao som da trombeta; exultem diante do Senhor, o Rei.",
    referencia: "Salmos 98:4-6"
  },
  {
    texto: "Cantarei ao Senhor toda a minha vida; louvarei ao meu Deus enquanto eu viver.",
    referencia: "Salmos 104:33"
  },
  {
    texto: "Louvarei ao Senhor durante a minha vida; cantarei louvores ao meu Deus enquanto eu viver.",
    referencia: "Salmos 146:2"
  },
  {
    texto: "Louvem eles o seu nome com danças; ofereçam-lhe música com tamborim e harpa.",
    referencia: "Salmos 149:3"
  },
  {
    texto: "Louvem-no ao som de trombeta, louvem-no com a lira e a harpa, louvem-no com tamborins e danças, louvem-no com instrumentos de cordas e com flautas, louvem-no com címbalos sonoros, louvem-no com címbalos ressonantes. Tudo o que tem vida louve o Senhor! Aleluia!",
    referencia: "Salmos 150:3-6"
  },
  {
    texto: "Habite ricamente em vocês a palavra de Cristo; ensinem e aconselhem-se uns aos outros com toda a sabedoria, e cantem salmos, hinos e cânticos espirituais com gratidão a Deus em seu coração.",
    referencia: "Colossenses 3:16"
  },
  {
    texto: "Falando entre vós com salmos, entoando e louvando de coração ao Senhor com hinos e cânticos espirituais.",
    referencia: "Efésios 5:19"
  }
];

// Variáveis para controlar o verso atual e o intervalo de rotação
let versoAtualIndex = 0;
let intervaloRotacao = null;

/**
 * Inicializa o componente de versos bíblicos rotativos
 */
function inicializarVersosRotativos() {
  // Seleciona os elementos do DOM
  const versoTextoElement = document.getElementById('verso-texto');
  const versoReferenciaElement = document.getElementById('verso-referencia');
  
  if (!versoTextoElement || !versoReferenciaElement) {
    console.error('Elementos de verso bíblico não encontrados no DOM');
    return;
  }
  
  // Exibe o primeiro verso
  atualizarVersoExibido();
  
  // Configura a rotação automática a cada 10 segundos
  intervaloRotacao = setInterval(proximoVerso, 10000);
  
  // Adiciona eventos para os botões de navegação
  const btnAnterior = document.getElementById('verso-anterior');
  const btnProximo = document.getElementById('verso-proximo');
  
  if (btnAnterior) {
    btnAnterior.addEventListener('click', versoAnterior);
  }
  
  if (btnProximo) {
    btnProximo.addEventListener('click', proximoVerso);
  }
}

/**
 * Atualiza o verso exibido na página
 */
function atualizarVersoExibido() {
  const versoTextoElement = document.getElementById('verso-texto');
  const versoReferenciaElement = document.getElementById('verso-referencia');
  
  if (versoTextoElement && versoReferenciaElement) {
    // Obtém o verso atual
    const versoAtual = versosBiblicos[versoAtualIndex];
    
    // Atualiza o conteúdo com animação de fade
    versoTextoElement.style.opacity = 0;
    versoReferenciaElement.style.opacity = 0;
    
    setTimeout(() => {
      versoTextoElement.textContent = `"${versoAtual.texto}"`;
      versoReferenciaElement.textContent = versoAtual.referencia;
      
      versoTextoElement.style.opacity = 1;
      versoReferenciaElement.style.opacity = 1;
    }, 500);
  }
}

/**
 * Avança para o próximo verso
 */
function proximoVerso() {
  versoAtualIndex = (versoAtualIndex + 1) % versosBiblicos.length;
  atualizarVersoExibido();
}

/**
 * Retorna ao verso anterior
 */
function versoAnterior() {
  versoAtualIndex = (versoAtualIndex - 1 + versosBiblicos.length) % versosBiblicos.length;
  atualizarVersoExibido();
}

// Inicializa os versos rotativos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarVersosRotativos);


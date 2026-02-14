/**
 * Script para a página de vídeos
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializa a funcionalidade de vídeo em tela cheia
  initVideoExpand();
  
  // Inicializa a funcionalidade de filtro de vídeos
  initVideoFilter();
});

/**
 * Inicializa a funcionalidade de expandir vídeos em tela cheia
 */
function initVideoExpand() {
  const videoContainers = document.querySelectorAll('.video-container');
  
  videoContainers.forEach(container => {
    container.addEventListener('click', function() {
      expandVideo(this);
    });
  });
}

/**
 * Expande um vídeo em tela cheia
 * @param {HTMLElement} el - Elemento contendo o iframe do vídeo
 */
function expandVideo(el) {
  const iframe = el.querySelector("iframe");
  if (!iframe) return;
  
  const src = iframe.getAttribute("src");
  
  // Cria o elemento de tela cheia
  const fullscreenDiv = document.createElement("div");
  fullscreenDiv.classList.add("fullscreen");
  
  // Cria o botão de fechar
  const closeBtn = document.createElement("div");
  closeBtn.classList.add("close-btn");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => document.body.removeChild(fullscreenDiv);
  
  // Cria o iframe em tela cheia
  const fullIframe = document.createElement("iframe");
  
  // Adiciona parâmetro de autoplay se não existir
  if (src.includes('?')) {
    if (!src.includes('autoplay=')) {
      fullIframe.src = src + "&autoplay=1";
    } else {
      fullIframe.src = src;
    }
  } else {
    fullIframe.src = src + "?autoplay=1";
  }
  
  fullIframe.allowFullscreen = true;
  
  // Adiciona os elementos ao DOM
  fullscreenDiv.appendChild(closeBtn);
  fullscreenDiv.appendChild(fullIframe);
  document.body.appendChild(fullscreenDiv);
  
  // Adiciona evento para fechar com a tecla ESC
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(fullscreenDiv);
      document.removeEventListener('keydown', escHandler);
    }
  });
}

/**
 * Inicializa a funcionalidade de filtro de vídeos por categoria
 */
function initVideoFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove a classe active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adiciona a classe active ao botão clicado
        this.classList.add('active');
        
        // Obtém a categoria a ser filtrada
        const category = this.getAttribute('data-category');
        
        // Filtra os vídeos
        filterVideosByCategory(category);
      });
    });
  }
}

/**
 * Filtra os vídeos por categoria
 * @param {string} category - Categoria a ser filtrada ('all' para mostrar todos)
 */
function filterVideosByCategory(category) {
  const videoItems = document.querySelectorAll('.video-item');
  
  videoItems.forEach(item => {
    if (category === 'all') {
      item.style.display = 'block';
    } else {
      const itemCategory = item.getAttribute('data-category');
      if (itemCategory === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    }
  });
  
  // Anima os itens visíveis
  animateFilteredItems();
}

/**
 * Anima os itens filtrados com efeito de fade-in
 */
function animateFilteredItems() {
  const visibleItems = document.querySelectorAll('.video-item[style="display: block"]');
  
  visibleItems.forEach((item, index) => {
    // Reset da animação
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    
    // Aplica a animação com delay baseado no índice
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
    }, index * 100);
  });
}


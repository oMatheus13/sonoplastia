/**
 * Script principal para o site de sonoplastia
 */

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa o menu mobile
  initMobileMenu();
  
  // Adiciona classe active ao link atual
  highlightCurrentPage();
  
  // Inicializa animações de entrada
  initFadeInAnimations();
});

/**
 * Inicializa o menu mobile
 */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Alterna o ícone do botão entre hambúrguer e X
      const icon = this.querySelector('i');
      if (icon) {
        if (icon.classList.contains('fa-bars')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
    
    // Fecha o menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        
        // Restaura o ícone para hambúrguer
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
}

/**
 * Destaca o link da página atual no menu de navegação
 */
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') || 
        (currentPage === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Inicializa animações de fade-in para elementos com a classe 'fade-in'
 */
function initFadeInAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  // Configura o observador de interseção para animar elementos quando entrarem na viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Inicializa os elementos com opacidade 0
  fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
  });
}

/**
 * Função para alternar entre modo claro e escuro (a ser implementada)
 */
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  // Salva a preferência do usuário
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

/**
 * Função para criar um toast de notificação
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de notificação (success, error, warning, info)
 * @param {number} duration - Duração em milissegundos
 */
function showToast(message, type = 'info', duration = 3000) {
  // Cria o elemento toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Adiciona ao corpo do documento
  document.body.appendChild(toast);
  
  // Exibe o toast com animação
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove o toast após a duração especificada
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}


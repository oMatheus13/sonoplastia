/**
 * Script para o curso Som de Fé
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar o quiz
  initQuiz();
  
  // Inicializar a navegação do curso
  initCursoNav();
  
  // Inicializar o progresso do curso
  updateProgress();
});

/**
 * Inicializa a funcionalidade do quiz
 */
function initQuiz() {
  const quizSubmitBtns = document.querySelectorAll('.curso-quiz button');
  
  quizSubmitBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const quizContainer = this.closest('.curso-quiz');
      const questions = quizContainer.querySelectorAll('.curso-quiz-question');
      let correctAnswers = 0;
      let totalQuestions = questions.length;
      
      questions.forEach(question => {
        const options = question.querySelectorAll('.curso-quiz-option');
        const feedback = question.querySelector('.curso-quiz-feedback');
        let selectedOption = null;
        let isCorrect = false;
        
        options.forEach(option => {
          if (option.classList.contains('selected')) {
            selectedOption = option;
            if (option.getAttribute('data-correct') === 'true') {
              option.classList.add('correct');
              isCorrect = true;
              correctAnswers++;
            } else {
              option.classList.add('incorrect');
            }
          } else if (option.getAttribute('data-correct') === 'true') {
            option.classList.add('correct');
          }
        });
        
        // Mostrar feedback
        if (feedback) {
          if (selectedOption) {
            if (isCorrect) {
              feedback.textContent = 'Correto! Muito bem!';
              feedback.classList.add('correct');
            } else {
              feedback.textContent = 'Incorreto. Tente novamente.';
              feedback.classList.add('incorrect');
            }
          } else {
            feedback.textContent = 'Por favor, selecione uma opção.';
            feedback.classList.add('incorrect');
          }
          feedback.style.display = 'block';
        }
      });
      
      // Atualizar progresso
      updateModuleProgress(quizContainer, correctAnswers, totalQuestions);
    });
  });
  
  // Adicionar evento de clique nas opções do quiz
  const quizOptions = document.querySelectorAll(".curso-quiz-option");
  quizOptions.forEach(option => {
    option.addEventListener("click", function() {
      // Remover seleção das outras opções na mesma pergunta
      const questionOptions = this.parentElement.querySelectorAll(".curso-quiz-option");
      questionOptions.forEach(opt => {
        opt.classList.remove("selected");
      });
      
      // Selecionar esta opção
      this.classList.add("selected");
    });
  });
}

/**
 * Atualiza o progresso de um módulo específico
 * @param {HTMLElement} quizContainer - Container do quiz
 * @param {number} correctAnswers - Número de respostas corretas
 * @param {number} totalQuestions - Número total de perguntas
 */
function updateModuleProgress(quizContainer, correctAnswers, totalQuestions) {
  const moduleId = quizContainer.closest(".curso-module").id;
  const moduleProgress = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Salvar progresso no localStorage
  let progress = JSON.parse(localStorage.getItem("cursoProgress")) || {};
  progress[moduleId] = moduleProgress;
  localStorage.setItem("cursoProgress", JSON.stringify(progress));
  
  // Atualizar progresso geral
  updateProgress();
  
  // Desbloquear próximo módulo se completou pelo menos 70%
  if (moduleProgress >= 70) {
    unlockNextModule(moduleId);
  }
}

/**
 * Atualiza o progresso geral do curso
 */
function updateProgress() {
  const progressFill = document.querySelector(".curso-progress-fill");
  const progressText = document.querySelector(".curso-progress-text");
  
  if (progressFill && progressText) {
    const progress = JSON.parse(localStorage.getItem("cursoProgress")) || {};
    const modules = document.querySelectorAll(".curso-module");
    let totalProgress = 0;
    
    modules.forEach(module => {
      totalProgress += progress[module.id] || 0;
    });
    
    const averageProgress = Math.round(totalProgress / modules.length);
    progressFill.style.width = `${averageProgress}%`;
    progressText.textContent = `${averageProgress}% Completo`;
  }
}

/**
 * Desbloqueia o próximo módulo
 * @param {string} currentModuleId - ID do módulo atual
 */
function unlockNextModule(currentModuleId) {
  const currentModule = document.getElementById(currentModuleId);
  const nextModule = currentModule.nextElementSibling;
  
  if (nextModule && nextModule.classList.contains("curso-module")) {
    // Remover mensagem de bloqueio
    const blockMessage = nextModule.querySelector("p:contains(\"Este módulo será desbloqueado\")");
    if (blockMessage) {
      blockMessage.remove();
    }
    
    // Habilitar botão de próximo
    const nextBtn = currentModule.querySelector(".curso-btn-next");
    if (nextBtn) {
      nextBtn.classList.remove("disabled");
    }
    
    // Salvar estado de desbloqueio
    let unlockedModules = JSON.parse(localStorage.getItem("unlockedModules")) || [];
    if (!unlockedModules.includes(nextModule.id)) {
      unlockedModules.push(nextModule.id);
      localStorage.setItem("unlockedModules", JSON.stringify(unlockedModules));
    }
  }
}

/**
 * Inicializa a navegação do curso
 */
function initCursoNav() {
  const navLinks = document.querySelectorAll(".curso-nav-link");
  
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Remover classe active de todos os links
      navLinks.forEach(l => l.classList.remove("active"));
      
      // Adicionar classe active ao link clicado
      this.classList.add("active");
      
      // Obter o ID do módulo
      const moduleId = this.getAttribute("href").substring(1);
      
      // Verificar se o módulo está desbloqueado
      const unlockedModules = JSON.parse(localStorage.getItem("unlockedModules")) || ["modulo1"];
      if (unlockedModules.includes(moduleId)) {
        // Rolar até o módulo
        const moduleElement = document.getElementById(moduleId);
        if (moduleElement) {
          moduleElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        alert("Este módulo ainda não está disponível. Complete os módulos anteriores para desbloqueá-lo.");
      }
    });
  });
  
  // Botões de navegação entre módulos
  const navButtons = document.querySelectorAll(".curso-nav-buttons a:not(.disabled)");
  
  navButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Obter o ID do módulo
      const moduleId = this.getAttribute("href").substring(1);
      
      // Verificar se o módulo está desbloqueado
      const unlockedModules = JSON.parse(localStorage.getItem("unlockedModules")) || ["modulo1"];
      if (unlockedModules.includes(moduleId)) {
        // Rolar até o módulo
        const moduleElement = document.getElementById(moduleId);
        if (moduleElement) {
          moduleElement.scrollIntoView({ behavior: "smooth" });
          
          // Atualizar navegação
          const navLink = document.querySelector(`.curso-nav-link[href="#${moduleId}"]`);
          if (navLink) {
            navLinks.forEach(l => l.classList.remove("active"));
            navLink.classList.add("active");
          }
        }
      } else {
        alert("Este módulo ainda não está disponível. Complete os módulos anteriores para desbloqueá-lo.");
      }
    });
  });
}

/**
 * Carrega o estado do curso ao iniciar
 */
function loadCursoState() {
  // Carregar módulos desbloqueados
  const unlockedModules = JSON.parse(localStorage.getItem("unlockedModules")) || ["modulo1"];
  
  unlockedModules.forEach(moduleId => {
    const moduleElement = document.getElementById(moduleId);
    if (moduleElement) {
      // Remover mensagem de bloqueio
      const blockMessage = moduleElement.querySelector("p:contains(\"Este módulo será desbloqueado\")");
      if (blockMessage) {
        blockMessage.remove();
      }
      
      // Habilitar botão de próximo no módulo anterior
      const prevModuleId = `modulo${parseInt(moduleId.replace("modulo", "")) - 1}`;
      const prevModule = document.getElementById(prevModuleId);
      if (prevModule) {
        const nextBtn = prevModule.querySelector(".curso-btn-next");
        if (nextBtn) {
          nextBtn.classList.remove("disabled");
        }
      }
    }
  });
}

// Inicializar o estado do curso ao carregar a página
document.addEventListener("DOMContentLoaded", loadCursoState);

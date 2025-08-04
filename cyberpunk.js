/**
 * Cyberpunk 2077 Interactive Framework
 * Professional Futuristic Portfolio Features
 */

// DOM Ready Function
document.addEventListener("DOMContentLoaded", function () {
  initCyberpunkEffects();
  initThemeToggle();
  initTypingAnimation();
  initLoadingScreen();
  initMatrixBackground();
  initScrollEffects();
});

// Initialize Cyberpunk Loading Screen
function initLoadingScreen() {
  const loadingScreen = document.querySelector(".cyber-loading");

  if (loadingScreen) {
    // Simulate loading for 3 seconds
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 3000);
  }
}

// Initialize Theme Toggle
function initThemeToggle() {
  const themeToggle = document.querySelector(".cyber-toggle");
  const body = document.body;

  if (themeToggle) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    body.setAttribute("data-theme", savedTheme);

    // Update toggle icon
    updateToggleIcon(themeToggle, savedTheme);

    themeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      updateToggleIcon(themeToggle, newTheme);

      // Add glitch effect on theme change
      body.classList.add("theme-switching");
      setTimeout(() => {
        body.classList.remove("theme-switching");
      }, 300);
    });
  }
}

function updateToggleIcon(toggle, theme) {
  const icon = toggle.querySelector("i") || toggle;
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// Initialize Typing Animation
function initTypingAnimation() {
  const typingElements = document.querySelectorAll(".typing-text");

  typingElements.forEach((element) => {
    const text = element.getAttribute("data-text") || element.textContent;
    element.textContent = "";

    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  });
}

// Initialize Matrix Background Effect
function initMatrixBackground() {
  const matrixBg = document.querySelector(".matrix-bg");

  if (matrixBg) {
    // Create floating particles
    for (let i = 0; i < 20; i++) {
      createMatrixParticle(matrixBg);
    }
  }
}

function createMatrixParticle(container) {
  const particle = document.createElement("div");
  particle.className = "matrix-particle";

  // Random position and size
  particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: var(--cyber-primary);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.2};
        animation: float ${Math.random() * 10 + 10}s linear infinite;
        box-shadow: 0 0 ${Math.random() * 10 + 5}px var(--cyber-primary);
    `;

  container.appendChild(particle);

  // Remove and recreate after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
      createMatrixParticle(container);
    }
  }, (Math.random() * 10 + 10) * 1000);
}

// Initialize Scroll Effects
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const animateElements = document.querySelectorAll(
    ".glass-card, .terminal-window, .cyber-heading"
  );
  animateElements.forEach((el) => {
    el.classList.add("animate-on-scroll");
    observer.observe(el);
  });
}

// Initialize Cyberpunk Effects
function initCyberpunkEffects() {
  // Add glitch effect to title
  const title = document.querySelector(".cyber-title");
  if (title) {
    title.setAttribute("data-text", title.textContent);
    title.classList.add("glitch");

    // Periodic glitch activation
    setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance every 2 seconds
        title.classList.add("glitch-active");
        setTimeout(() => {
          title.classList.remove("glitch-active");
        }, 200);
      }
    }, 2000);
  }

  // Add hover effects to interactive elements
  const interactiveElements = document.querySelectorAll(
    ".nav-link, .cyber-link, .channel-item"
  );
  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      element.style.textShadow = "0 0 10px var(--cyber-primary)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.textShadow = "";
    });
  });

  // Add terminal cursor blinking
  const cursors = document.querySelectorAll(".cursor-blink");
  cursors.forEach((cursor) => {
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
    }, 500);
  });
}

// Terminal Command Simulation
function simulateTerminalCommand(command, output, delay = 1000) {
  const terminalBody = document.querySelector(".terminal-body");
  if (!terminalBody) return;

  // Create command line
  const commandLine = document.createElement("div");
  commandLine.className = "terminal-line";
  commandLine.innerHTML = `
        <span class="prompt">user@cyberpunk:~$</span>
        <span class="command">${command}</span>
    `;

  terminalBody.appendChild(commandLine);

  // Add output after delay
  setTimeout(() => {
    const outputDiv = document.createElement("div");
    outputDiv.className = "terminal-output";
    outputDiv.innerHTML = output;
    terminalBody.appendChild(outputDiv);

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }, delay);
}

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code);

  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    activateEasterEgg();
    konamiCode = [];
  }
});

function activateEasterEgg() {
  // Rainbow effect
  document.body.style.animation = "rainbow 2s infinite";

  // Show special message
  const message = document.createElement("div");
  message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--cyber-primary);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            z-index: 10000;
            font-family: var(--font-primary);
            color: var(--cyber-primary);
            text-shadow: var(--neon-glow);
        ">
            <h2>🎉 CYBERPUNK MODE ACTIVATED! 🎉</h2>
            <p>Welcome to the Matrix, Neo...</p>
        </div>
    `;

  document.body.appendChild(message);

  setTimeout(() => {
    document.body.style.animation = "";
    document.body.removeChild(message);
  }, 3000);
}

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Window resize handler
window.addEventListener(
  "resize",
  debounce(() => {
    // Recalculate matrix particles if needed
    initMatrixBackground();
  }, 250)
);

// Export functions for potential external use
window.CyberpunkFramework = {
  simulateTerminalCommand,
  initCyberpunkEffects,
  initThemeToggle,
  activateEasterEgg,
};

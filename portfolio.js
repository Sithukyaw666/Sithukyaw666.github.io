/* ================================== */
/* HYBRID PORTFOLIO JAVASCRIPT */
/* Landing + Traditional + Terminal Integration */
/* ================================== */

class HybridPortfolio {
  constructor() {
    this.currentTheme = "mocha";
    this.currentInterface = "landing";
    this.terminalHistory = [];
    this.historyIndex = -1;
    this.terminalCommands = {
      help: () => this.showHelp(),
      clear: () => this.clearTerminal(),
      whoami: () => this.whoami(),
      about: () => this.aboutCommand(),
      skills: () => this.skillsCommand(),
      projects: () => this.projectsCommand(),
      contact: () => this.contactCommand(),
      theme: (args) => this.changeTheme(args[0]),
      website: () => this.switchToTraditional(),
      terminal: () => this.switchToTerminal(),
      exit: () => this.closeTerminalWidget(),
      ls: () => this.listFiles(),
      cat: (args) => this.catFile(args[0]),
      pwd: () => this.currentPath(),
      history: () => this.showHistory(),
      date: () => this.showDate(),
      echo: (args) => args.join(" "),
    };

    this.init();
  }

  init() {
    this.loadTheme();
    this.bindEvents();
    this.setupThemeSelector();
    this.setupNavigation();
    this.typewriterEffect();
    this.renderSkills();
    this.renderProjects();
    this.renderContact();
    this.renderLandingSocials();

    // Initialize with landing screen
    this.showInterface("landing");
  }

  renderLandingSocials() {
    const el = document.getElementById("landing-social-links");
    if (!el) return;
    const p = window.PORTFOLIO_DATA.profile;
    el.innerHTML = `
      <a href="${p.social.github.url}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
      <a href="mailto:${p.email}" title="Email"><i class="fas fa-envelope"></i></a>
    `;
  }

  renderContact() {
    const el = document.getElementById("contact-methods");
    if (!el) return;
    const p = window.PORTFOLIO_DATA.profile;
    const cards = [
      { icon: "fas fa-envelope", label: "Email", value: p.email, href: `mailto:${p.email}`, external: false },
      { icon: "fab fa-github",   label: "GitHub", value: `/${p.social.github.handle}`, href: p.social.github.url, external: true },
      { icon: "fab fa-linkedin", label: "LinkedIn", value: `/${p.social.linkedin.handle}`, href: p.social.linkedin.url, external: true },
    ];
    el.innerHTML = cards.map((c) => `
      <a href="${c.href}" ${c.external ? 'target="_blank"' : ""} class="contact-card">
        <div class="contact-card-icon"><i class="${c.icon}"></i></div>
        <div class="contact-card-body">
          <span class="contact-card-label">${c.label}</span>
          <span class="contact-card-value">${c.value}</span>
        </div>
        <i class="fas fa-arrow-right contact-card-arrow"></i>
      </a>
    `).join("");
  }

  renderSkills() {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;
    grid.innerHTML = window.PORTFOLIO_DATA.skills.categories
      .map(
        (cat) => `
      <div class="skill-category">
        <h3 class="category-title"><i class="${cat.icon}"></i> ${cat.title}</h3>
        <div class="skill-list">
          ${cat.tags.map((tag) => `<span class="skill-tag">${tag}</span>`).join("")}
        </div>
      </div>`
      )
      .join("");
  }

  renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    grid.innerHTML = window.PORTFOLIO_DATA.projects
      .map((p) => {
        const typeBadge =
          p.type === "fork"
            ? `<span class="project-badge fork">fork</span>`
            : `<span class="project-badge personal">personal</span>`;
        const liveLink = p.url
          ? `<a href="${p.url}" target="_blank" class="project-link" title="Live site"><i class="fas fa-external-link-alt"></i></a>`
          : "";
        const repoLink = p.repo
          ? `<a href="${p.repo}" target="_blank" class="project-link" title="GitHub repo"><i class="fab fa-github"></i></a>`
          : "";
        return `
        <div class="project-card">
          <div class="project-header">
            <div>
              <h3 class="project-title">${p.name}</h3>
              ${typeBadge}
            </div>
            <div class="project-links">${liveLink}${repoLink}</div>
          </div>
          <p class="project-description">${p.description}</p>
          <div class="project-tech">
            ${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
          </div>
        </div>`;
      })
      .join("");
  }

  /* ===== THEME MANAGEMENT ===== */
  loadTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme") || "mocha";
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
    this.updateActiveThemeButton();
  }

  setupThemeSelector() {
    const themeButtons = document.querySelectorAll(".theme-btn");
    themeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;
        this.setTheme(theme);
      });
    });
  }

  updateActiveThemeButton() {
    const themeButtons = document.querySelectorAll(".theme-btn");
    themeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === this.currentTheme);
    });
  }

  changeTheme(themeName) {
    const validThemes = ["mocha", "latte", "frappe", "macchiato"];
    if (validThemes.includes(themeName)) {
      this.setTheme(themeName);
      return `Theme changed to ${themeName}`;
    } else {
      return `Invalid theme. Available themes: ${validThemes.join(", ")}`;
    }
  }

  /* ===== INTERFACE MANAGEMENT ===== */
  showInterface(interfaceType) {
    const interfaces = {
      landing: document.getElementById("landing-screen"),
      traditional: document.getElementById("traditional-interface"),
    };

    // Hide all interfaces
    Object.values(interfaces).forEach((el) => {
      if (el) el.classList.add("hidden");
    });

    // Show requested interface
    if (interfaces[interfaceType]) {
      interfaces[interfaceType].classList.remove("hidden");
      this.currentInterface = interfaceType;
    }
  }

  switchToTraditional() {
    this.showInterface("traditional");
    this.updateUrl("#hero");
    return "Switching to traditional website interface...";
  }

  switchToTerminal() {
    window.location.href = "./terminal.html";
    return "Launching terminal interface...";
  }

  /* ===== NAVIGATION ===== */
  setupNavigation() {
    // Smooth scrolling for anchor links
    document.addEventListener("click", (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          this.updateActiveNavLink(targetId);
        }
      }
    });

    // Update active nav link on scroll
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        this.updateActiveNavLinkOnScroll();
      }, 100)
    );
  }

  updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll(".section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        this.updateActiveNavLink(sectionId);
      }
    });
  }

  updateUrl(hash) {
    if (history.pushState) {
      history.pushState(null, null, hash);
    } else {
      location.hash = hash;
    }
  }

  //   /* ===== TERMINAL WIDGET ===== */
  //   openTerminalWidget() {
  //     const widget = document.getElementById("terminal-widget");
  //     if (widget) {
  //       widget.classList.remove("hidden");
  //       const input = document.getElementById("widget-input");
  //       if (input) input.focus();

  //       // Initialize terminal widget if not already done
  //       if (!widget.dataset.initialized) {
  //         this.initTerminalWidget();
  //         widget.dataset.initialized = "true";
  //       }
  //     }
  //   }

  closeTerminalWidget() {
    const widget = document.getElementById("terminal-widget");
    if (widget) {
      widget.classList.add("hidden");
    }
    return "Terminal widget closed.";
  }

  initTerminalWidget() {
    const input = document.getElementById("widget-input");
    const output = document.getElementById("widget-output");

    if (!input || !output) return;

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = input.value.trim();
        if (command) {
          this.executeTerminalCommand(command, output);
          this.terminalHistory.push(command);
          this.historyIndex = this.terminalHistory.length;
        }
        input.value = "";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          input.value = this.terminalHistory[this.historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.terminalHistory.length - 1) {
          this.historyIndex++;
          input.value = this.terminalHistory[this.historyIndex];
        } else {
          this.historyIndex = this.terminalHistory.length;
          input.value = "";
        }
      }
    });

    // Display welcome message
    this.appendToTerminal(output, this.getWelcomeMessage());
  }

  executeTerminalCommand(command, output) {
    // Display command
    this.appendToTerminal(
      output,
      `<div class="terminal-command">guest@portfolio:~$ ${command}</div>`
    );

    const [cmd, ...args] = command.toLowerCase().split(" ");

    let result;
    if (this.terminalCommands[cmd]) {
      try {
        result = this.terminalCommands[cmd](args);
      } catch (error) {
        result = `Error executing command: ${error.message}`;
      }
    } else {
      result = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    if (result) {
      this.appendToTerminal(
        output,
        `<div class="terminal-response">${result}</div>`
      );
    }

    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
  }

  appendToTerminal(output, content) {
    output.innerHTML += content + "\n";
  }

  clearTerminal() {
    const output = document.getElementById("widget-output");
    if (output) {
      output.innerHTML = "";
      this.appendToTerminal(output, this.getWelcomeMessage());
    }
    return "";
  }

  /* ===== TERMINAL COMMANDS ===== */
  getWelcomeMessage() {
    return `<div class="terminal-welcome">
╭─ Terminal Widget - Sithu Kyaw Portfolio ─╮
│  Type 'help' for available commands       │
│  Type 'website' to return to main site    │
╰───────────────────────────────────────────╯
</div>`;
  }

  showHelp() {
    return `<div class="terminal-help">
Available commands:
  help        - Show this help message
  clear       - Clear the terminal
  whoami      - Display user information
  about       - About Sithu Kyaw
  skills      - List technical skills
  projects    - Show featured projects
  contact     - Display contact information
  theme <name> - Change theme (mocha|latte|frappe|macchiato)
  website     - Switch to traditional website
  terminal    - Open full terminal interface
  ls          - List directory contents
  cat <file>  - Display file contents
  pwd         - Show current directory
  history     - Show command history
  date        - Display current date
  echo <text> - Echo text
  exit        - Close terminal widget
</div>`;
  }

  whoami() {
    const p = window.PORTFOLIO_DATA.profile;
    return `<div class="terminal-info">
User: ${p.name}
Role: ${p.title}
Status: ${p.status}
Location: ~/portfolio
Shell: /bin/bash
</div>`;
  }

  aboutCommand() {
    const p = window.PORTFOLIO_DATA.profile;
    return `<div class="terminal-info">
About ${p.name}:
━━━━━━━━━━━━━━━━━━
${p.bio.join("\n\n")}
</div>`;
  }

  skillsCommand() {
    const constellation = window.PORTFOLIO_DATA.skills.constellation;
    const bar = (level) => {
      const filled = Math.round((level / 100) * 12);
      const label = level >= 90 ? "Expert" : level >= 80 ? "Advanced" : "Intermediate";
      return `${"█".repeat(filled)}${"░".repeat(12 - filled)} ${label}`;
    };

    const lines = ["<div class=\"terminal-skills\">Technical Skills:\n━━━━━━━━━━━━━━━━"];
    Object.entries(constellation).forEach(([category, data]) => {
      lines.push(`\n${category}:`);
      data.skills.forEach((skill, i) => {
        const prefix = i === data.skills.length - 1 ? "└──" : "├──";
        lines.push(`${prefix} ${skill.name.padEnd(16)} ${bar(skill.level)}`);
      });
    });
    lines.push("</div>");
    return lines.join("\n");
  }

  projectsCommand() {
    const projects = window.PORTFOLIO_DATA.projects;
    const lines = ["<div class=\"terminal-projects\">Projects:\n━━━━━━━━━━"];
    projects.forEach((p, i) => {
      const typeTag = p.type === "fork" ? "[fork]" : "[personal]";
      const statusIcon = p.status === "live" ? "✅" : "🚧";
      lines.push(`\n${i + 1}. ${p.name} ${typeTag}`);
      lines.push(`   ├── ${p.description}`);
      lines.push(`   ├── Tech: ${p.tech.join(", ")}`);
      if (p.url) lines.push(`   ├── Live: ${p.url}`);
      if (p.repo) lines.push(`   ├── Repo: ${p.repo}`);
      lines.push(`   └── Status: ${statusIcon} ${p.status}`);
    });
    lines.push("</div>");
    return lines.join("\n");
  }

  contactCommand() {
    const p = window.PORTFOLIO_DATA.profile;
    return `<div class="terminal-contact">
Contact Information:
━━━━━━━━━━━━━━━━━━━

📧 Email:    ${p.email}
🐙 GitHub:   github.com/${p.social.github.handle}
💼 LinkedIn: linkedin.com/in/${p.social.linkedin.handle}

Status: 🟢 Available for projects
Response Time: Usually within 24 hours
Timezone: ${p.timezone}
</div>`;
  }

  listFiles() {
    return `<div class="terminal-files">
Directory contents:
━━━━━━━━━━━━━━━━━━
drwxr-xr-x  about.txt
drwxr-xr-x  skills.md
drwxr-xr-x  projects/
drwxr-xr-x  contact.txt
drwxr-xr-x  resume.pdf
-rw-r--r--  readme.md
-rw-r--r--  .gitignore
-rwxr-xr-x  portfolio.exe

Use 'cat <filename>' to read file contents.
</div>`;
  }

  catFile(filename) {
    const files = {
      "about.txt": this.aboutCommand(),
      "skills.md": this.skillsCommand(),
      "contact.txt": this.contactCommand(),
      "readme.md": `# Sithu Kyaw's Portfolio

Welcome to my interactive portfolio! This site showcases my work as a full-stack developer and digital architect.

## Features
- Hybrid interface (traditional + terminal)
- Multiple theme options
- Interactive command-line experience
- Responsive design
- Modern web technologies

## Navigation
- Use the landing page to choose your preferred interface
- Terminal mode for technical users
- Traditional website for general users
- Embedded terminal widget for quick access

## Contact
Feel free to reach out for collaborations or opportunities!`,
      ".gitignore": `node_modules/
.env
dist/
build/
*.log
.DS_Store`,
      "resume.pdf":
        "This is a binary file. Please use the website interface to download the full resume.",
    };

    if (files[filename.toLowerCase()]) {
      return files[filename.toLowerCase()];
    } else {
      return `cat: ${filename}: No such file or directory`;
    }
  }

  currentPath() {
    return "/home/sithu/portfolio";
  }

  showHistory() {
    if (this.terminalHistory.length === 0) {
      return "No commands in history.";
    }

    return `<div class="terminal-history">
Command History:
━━━━━━━━━━━━━━━
${this.terminalHistory
  .map((cmd, index) => `${(index + 1).toString().padStart(3, " ")}  ${cmd}`)
  .join("\n")}
</div>`;
  }

  showDate() {
    const now = new Date();
    return now.toLocaleString();
  }

  /* ===== ANIMATIONS & EFFECTS ===== */
  typewriterEffect() {
    const elements = document.querySelectorAll("[data-typewriter]");
    elements.forEach((element) => {
      const text = element.textContent;
      element.textContent = "";
      element.style.borderRight = "2px solid";
      element.style.animation = "blink 1s infinite";

      let index = 0;
      const timer = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index >= text.length) {
          clearInterval(timer);
          element.style.borderRight = "none";
          element.style.animation = "none";
        }
      }, 100);
    });
  }

  /* ===== EVENT HANDLING ===== */
  bindEvents() {
    // Global event listeners
    document.addEventListener("DOMContentLoaded", () => {
      this.setupFormHandling();
      this.setupScrollEffects();
    });

    // Contact form
    const contactForm = document.querySelector(".form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleContactForm(e.target);
      });
    }
  }

  setupFormHandling() {
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission(form);
      });
    });
  }

  handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simple form validation
    if (!data.name || !data.email || !data.message) {
      this.showNotification("Please fill in all fields.", "error");
      return;
    }

    if (!this.isValidEmail(data.email)) {
      this.showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Simulate form submission
    this.showNotification("Message sent successfully!", "success");
    form.reset();
  }

  handleFormSubmission(form) {
    // Generic form handler
    console.log("Form submitted:", form);
    this.showNotification("Form submitted successfully!", "success");
  }

  setupScrollEffects() {
    // Parallax and scroll animations can be added here
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observe elements for animations
    const animateElements = document.querySelectorAll(
      ".project-card, .skill-category, .stat-item"
    );
    animateElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  /* ===== UTILITY FUNCTIONS ===== */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      backgroundColor:
        type === "success"
          ? "#a6e3a1"
          : type === "error"
          ? "#f38ba8"
          : "#89b4fa",
      color: "#1e1e2e",
      borderRadius: "8px",
      fontWeight: "500",
      zIndex: "9999",
      opacity: "0",
      transform: "translateY(-20px)",
      transition: "all 0.3s ease",
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    });

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-20px)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  debounce(func, wait) {
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
}

/* ===== GLOBAL FUNCTIONS (for inline event handlers) ===== */
let portfolioInstance;

function enterTerminal() {
  if (portfolioInstance) {
    portfolioInstance.switchToTerminal();
  }
}

function enterTraditional() {
  if (portfolioInstance) {
    portfolioInstance.switchToTraditional();
  }
}

function showLanding() {
  if (portfolioInstance) {
    portfolioInstance.showInterface("landing");
  }
}

function openTerminalWidget() {
  if (portfolioInstance) {
    portfolioInstance.openTerminalWidget();
  }
}

function closeTerminalWidget() {
  if (portfolioInstance) {
    portfolioInstance.closeTerminalWidget();
  }
}

/* ===== INITIALIZATION ===== */
document.addEventListener("DOMContentLoaded", () => {
  portfolioInstance = new HybridPortfolio();

  // Handle URL hash navigation
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Show traditional interface if navigating to a section
      portfolioInstance.showInterface("traditional");
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }
});

// Handle back/forward navigation
window.addEventListener("popstate", (e) => {
  if (portfolioInstance && window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      portfolioInstance.showInterface("traditional");
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  } else if (portfolioInstance) {
    portfolioInstance.showInterface("landing");
  }
});

/* ===== EXPORT FOR MODULE USE ===== */
if (typeof module !== "undefined" && module.exports) {
  module.exports = HybridPortfolio;
}

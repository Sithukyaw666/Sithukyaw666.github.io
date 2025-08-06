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

    // Initialize with landing screen
    this.showInterface("landing");
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

  /* ===== TERMINAL WIDGET ===== */
  openTerminalWidget() {
    const widget = document.getElementById("terminal-widget");
    if (widget) {
      widget.classList.remove("hidden");
      const input = document.getElementById("widget-input");
      if (input) input.focus();

      // Initialize terminal widget if not already done
      if (!widget.dataset.initialized) {
        this.initTerminalWidget();
        widget.dataset.initialized = "true";
      }
    }
  }

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
    return `<div class="terminal-info">
User: Sithu Kyaw
Role: Professional Trash Pretending to be Engineer-ish
Status: Available for projects
Location: ~/portfolio
Shell: /bin/bash
</div>`;
  }

  aboutCommand() {
    return `<div class="terminal-info">
About Sithu Kyaw:
━━━━━━━━━━━━━━━━━━
I'm a passionate full-stack developer with 3+ years of experience
building modern web applications. I enjoy creating efficient, 
scalable solutions and exploring new technologies.

Expertise:
• Frontend: React, Vue.js, JavaScript, TypeScript
• Backend: Node.js, Python, Django, Express
• Database: PostgreSQL, MongoDB, Redis
• Tools: Docker, AWS, Git, Linux

When not coding, I contribute to open source projects and
share knowledge with the developer community.
</div>`;
  }

  skillsCommand() {
    return `<div class="terminal-skills">
Technical Skills:
━━━━━━━━━━━━━━━━

Frontend Technologies:
├── HTML5/CSS3        ████████████ Expert
├── JavaScript        ████████████ Expert  
├── TypeScript        ██████████░░ Advanced
├── React.js          ████████████ Expert
├── Vue.js            ██████████░░ Advanced
└── Sass/Less         ████████████ Expert

Backend Technologies:
├── Node.js           ████████████ Expert
├── Python            ██████████░░ Advanced
├── Express.js        ████████████ Expert
├── Django            ████████░░░░ Intermediate
└── REST APIs         ████████████ Expert

Databases:
├── PostgreSQL        ██████████░░ Advanced
├── MongoDB           ████████████ Expert
├── Redis             ████████░░░░ Intermediate
└── MySQL             ██████████░░ Advanced

DevOps & Tools:
├── Git               ████████████ Expert
├── Docker            ██████████░░ Advanced
├── AWS               ████████░░░░ Intermediate
├── Linux             ████████████ Expert
└── CI/CD             ████████░░░░ Intermediate
</div>`;
  }

  projectsCommand() {
    return `<div class="terminal-projects">
Featured Projects:
━━━━━━━━━━━━━━━━━

1. Terminal Portfolio
   ├── Description: Interactive terminal-style portfolio
   ├── Tech Stack: JavaScript, CSS3, HTML5
   ├── Features: Command-line interface, theme switching
   └── Status: ✅ Complete

2. Full-Stack Web Application  
   ├── Description: Modern web app with responsive design
   ├── Tech Stack: React, Node.js, MongoDB
   ├── Features: Authentication, real-time updates
   └── Status: ✅ Complete

3. RESTful API Service
   ├── Description: Scalable API with comprehensive docs
   ├── Tech Stack: Python, Django, PostgreSQL
   ├── Features: JWT auth, caching, rate limiting
   └── Status: ✅ Complete

4. DevOps Automation
   ├── Description: CI/CD pipeline automation
   ├── Tech Stack: Docker, AWS, GitHub Actions
   ├── Features: Auto deployment, monitoring
   └── Status: 🚧 In Progress

Type 'website' to view detailed project information.
</div>`;
  }

  contactCommand() {
    return `<div class="terminal-contact">
Contact Information:
━━━━━━━━━━━━━━━━━━━

📧 Email:    sithukyaw27500@gmail.com
🐙 GitHub:   github.com/Sithukyaw666  
🐦 Twitter:  @Sithukyaw666
💼 LinkedIn: (Available on request)

Status: 🟢 Available for projects
Response Time: Usually within 24 hours

Feel free to reach out for:
• Project collaborations
• Freelance opportunities  
• Technical discussions
• Open source contributions

PGP Key: Available on request
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
-rw-r--r--  README.md
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

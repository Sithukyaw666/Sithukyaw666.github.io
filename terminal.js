// =====================================
// CATPPUCCIN TERMINAL PORTFOLIO ENGINE
// Interactive Command Line Interface
// =====================================

class TerminalPortfolio {
  constructor() {
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentPath = "~";
    this.currentUser = "guest";
    this.currentHost = "fedora";

    // Available commands
    this.commands = {
      help: this.showHelp.bind(this),
      man: this.showManual.bind(this),
      clear: this.clearTerminal.bind(this),
      cls: this.clearTerminal.bind(this),
      ls: this.listFiles.bind(this),
      dir: this.listFiles.bind(this),
      cat: this.catFile.bind(this),
      whoami: this.whoami.bind(this),
      about: this.about.bind(this),
      contact: this.contact.bind(this),
      skills: this.showSkills.bind(this),
      projects: this.showProjects.bind(this),
      cv: this.showCV.bind(this),
      resume: this.showCV.bind(this),
      history: this.showHistory.bind(this),
      theme: this.changeTheme.bind(this),
      pwd: this.showCurrentDir.bind(this),
      date: this.showDate.bind(this),
      uptime: this.showUptime.bind(this),
      neofetch: this.showSystemInfo.bind(this),
      exit: this.exitTerminal.bind(this),
      sudo: this.sudoCommand.bind(this),
      echo: this.echo.bind(this),
      tree: this.showTree.bind(this),
      website: this.switchToWebsite.bind(this),
    };

    // File system simulation
    this.fileSystem = {
      "about.md": {
        type: "file",
        content: this.getAboutContent(),
        size: "2.1K",
        modified: "2024-08-06",
      },
      "contact.md": {
        type: "file",
        content: this.getContactContent(),
        size: "1.5K",
        modified: "2024-08-06",
      },
      "skills.json": {
        type: "file",
        content: this.getSkillsContent(),
        size: "3.2K",
        modified: "2024-08-06",
      },
      "cv.pdf": {
        type: "file",
        content: this.getCVContent(),
        size: "245K",
        modified: "2024-08-06",
      },
      "status.txt": {
        type: "file",
        content: (() => {
          const p = window.PORTFOLIO_DATA.profile;
          return `Status: ${p.moodStatus}\nMode: ${p.title}\nLast seen: Just now`;
        })(),
        size: "156B",
        modified: "2024-08-06",
      },
      "readme.md": {
        type: "file",
        content: this.getReadmeContent(),
        size: "1.8K",
        modified: "2024-08-06",
      },
      "projects.json": {
        type: "file",
        content: this.getProjectsContent(),
        size: "2.4K",
        modified: "2024-08-06",
      },
    };

    this.themes = ["mocha", "latte", "frappe", "macchiato"];
    this.currentTheme = "mocha";
    this.startTime = Date.now();

    this.init();
  }

  init() {
    // Set initial theme
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    this.loadingScreen();
    this.setupEventListeners();
    this.setupAutocomplete();
  }

  loadingScreen() {
    const loading = document.getElementById("loading");
    const terminal = document.getElementById("terminal-container");

    // Show loading for 2 seconds
    setTimeout(() => {
      loading.style.opacity = "0";
      setTimeout(() => {
        loading.classList.add("hidden");
        terminal.classList.remove("hidden");
        this.focusInput();
        this.typeWelcomeMessage();
      }, 500);
    }, 2000);
  }

  typeWelcomeMessage() {
    const messages = [
      "System initialized successfully...",
      "Loading user profile...",
      "Mounting virtual file system...",
      "Starting portfolio services...",
      "",
      "Welcome to STK Terminal Portfolio v2.1",
      'Type "help" for available commands.',
      "",
    ];

    let index = 0;
    const typeMessage = () => {
      if (index < messages.length) {
        this.addOutput(messages[index], "info");
        index++;
        setTimeout(typeMessage, 300);
      }
    };

    setTimeout(typeMessage, 500);
  }

  setupEventListeners() {
    const input = document.getElementById("command-input");
    const terminal = document.getElementById("terminal");

    // Handle command input
    input.addEventListener("keydown", (e) => this.handleKeyDown(e));
    input.addEventListener("input", (e) => this.handleInput(e));

    // Focus input when clicking on terminal
    terminal.addEventListener("click", () => this.focusInput());

    // Window focus
    window.addEventListener("focus", () => this.focusInput());

    // Help panel close
    const closeHelp = document.getElementById("close-help");
    if (closeHelp) {
      closeHelp.addEventListener("click", () => this.hideHelp());
    }

    // Terminal buttons
    document.querySelector(".close")?.addEventListener("click", () => {
      this.addOutput("Connection closed by user.", "warning");
      setTimeout(() => window.close(), 1000);
    });

    document.querySelector(".minimize")?.addEventListener("click", () => {
      this.addOutput("Terminal minimized (simulation only)", "info");
    });

    document.querySelector(".maximize")?.addEventListener("click", () => {
      document.documentElement.requestFullscreen?.();
    });
  }

  setupAutocomplete() {
    this.suggestionsList = document.getElementById("suggestions");
    this.selectedSuggestion = -1;
  }

  handleKeyDown(e) {
    const input = e.target;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        this.executeCommand(input.value.trim());
        input.value = "";
        this.hideSuggestions();
        break;

      case "Tab":
        e.preventDefault();
        this.handleTabCompletion(input);
        break;

      case "ArrowUp":
        e.preventDefault();
        this.navigateHistory(-1, input);
        break;

      case "ArrowDown":
        e.preventDefault();
        this.navigateHistory(1, input);
        break;

      case "Escape":
        this.hideSuggestions();
        this.hideHelp();
        break;
    }
  }

  handleInput(e) {
    const input = e.target.value;
    if (input.length > 0) {
      this.showSuggestions(input);
    } else {
      this.hideSuggestions();
    }
  }

  executeCommand(commandLine) {
    if (!commandLine) return;

    // Add to history
    this.commandHistory.push(commandLine);
    this.historyIndex = this.commandHistory.length;

    // Echo command
    this.addCommandEcho(commandLine);

    // Parse command and arguments
    const [command, ...args] = commandLine.toLowerCase().split(" ");

    // Execute command
    if (this.commands[command]) {
      try {
        this.commands[command](args, commandLine);
      } catch (error) {
        this.addOutput(`Error executing command: ${error.message}`, "error");
      }
    } else {
      this.addOutput(`command not found: ${command}`, "error");
      this.addOutput(`Type 'help' to see available commands.`, "info");
    }

    this.scrollToBottom();
  }

  // Command implementations
  showHelp(args) {
    if (args.length === 0) {
      const helpPanel = document.getElementById("help-panel");
      helpPanel.classList.remove("hidden");
      return;
    }

    const command = args[0];
    const manuals = {
      ls: "Usage: ls\\nList files and directories in the current location.",
      cat: "Usage: cat <filename>\\nDisplay the contents of a file.",
      skills:
        "Usage: skills [--view=list|graph]\\nDisplay technical skills. Use --view=graph for interactive constellation visualization.",
      projects:
        "Usage: projects [--sort=date|name]\\nShow project portfolio. Sort by date (default) or name.",
      theme:
        "Usage: theme [mocha|latte|frappe|macchiato]\\nChange the terminal theme (Catppuccin flavors).",
      clear: "Usage: clear\\nClear the terminal screen.",
      history: "Usage: history\\nShow command history.",
      whoami: "Usage: whoami\\nDisplay current user information.",
      contact: "Usage: contact\\nShow contact information.",
      cv: "Usage: cv\\nDisplay CV/Resume information.",
    };

    if (manuals[command]) {
      this.addOutput(manuals[command], "info");
    } else {
      this.addOutput(`No manual entry for ${command}`, "error");
    }
  }

  showManual(args) {
    this.showHelp(args);
  }

  clearTerminal() {
    const output = document.getElementById("output");
    output.innerHTML = "";
  }

  listFiles() {
    this.addOutput("total " + Object.keys(this.fileSystem).length, "info");

    const fileListContainer = document.createElement("div");
    fileListContainer.className = "file-list";

    Object.entries(this.fileSystem).forEach(([filename, fileInfo]) => {
      const fileItem = document.createElement("div");
      fileItem.className = "file-item";

      const icon = document.createElement("i");
      icon.className = "icon fas ";

      if (filename.endsWith(".md")) {
        icon.className += "fa-file-alt";
      } else if (filename.endsWith(".json")) {
        icon.className += "fa-file-code";
      } else if (filename.endsWith(".pdf")) {
        icon.className += "fa-file-pdf";
      } else if (filename.endsWith(".txt")) {
        icon.className += "fa-file-text";
      } else {
        icon.className += "fa-file";
      }

      const name = document.createElement("span");
      name.className = "name";
      name.textContent = filename;

      fileItem.appendChild(icon);
      fileItem.appendChild(name);

      fileItem.addEventListener("click", () => {
        this.executeCommand(`cat ${filename}`);
      });

      fileListContainer.appendChild(fileItem);
    });

    this.addOutputElement(fileListContainer);
  }

  catFile(args) {
    if (args.length === 0) {
      this.addOutput("Usage: cat <filename>", "error");
      return;
    }

    const filename = args[0];
    const file = this.fileSystem[filename];

    if (file) {
      if (filename.endsWith(".json")) {
        this.addOutput("```json", "info");
        this.addOutput(file.content, "");
        this.addOutput("```", "info");
      } else if (filename.endsWith(".md")) {
        this.renderMarkdown(file.content);
      } else {
        this.addOutput(file.content, "");
      }
    } else {
      this.addOutput(`cat: ${filename}: No such file or directory`, "error");
    }
  }

  whoami() {
    const p = window.PORTFOLIO_DATA.profile;
    this.addOutput(`${this.currentUser}`, "");
    this.addOutput("", "");
    this.addOutput(`User: ${p.name}`, "info");
    this.addOutput(`Role: [PROFESSIONAL TRASH]`, "info");
    this.addOutput(`Status: ${p.moodStatus}`, "success");
    this.addOutput("Shell: /bin/bash", "info");
    this.addOutput("Home: /home/stk", "info");
  }

  about() {
    this.catFile(["about.md"]);
  }

  contact() {
    const p = window.PORTFOLIO_DATA.profile;
    const contactContainer = document.createElement("div");
    contactContainer.className = "contact-container";

    const contacts = [
      {
        icon: "fa-envelope",
        label: "Email",
        value: p.email,
        link: `mailto:${p.email}`,
      },
      {
        icon: "fa-brands fa-github-alt",
        label: "GitHub",
        value: `github.com/${p.social.github.handle}`,
        link: p.social.github.url,
      },
      {
        icon: "fa-brands fa-linkedin",
        label: "LinkedIn",
        value: "Connect with me",
        link: p.social.linkedin.url,
      },
    ];

    contacts.forEach((contact) => {
      const contactItem = document.createElement("div");
      contactItem.className = "contact-item";

      contactItem.innerHTML = `
                <i class="contact-icon fas ${contact.icon}"></i>
                <strong>${contact.label}:</strong>
                <a href="${contact.link}" target="_blank" class="contact-link">${contact.value}</a>
            `;

      contactContainer.appendChild(contactItem);
    });

    this.addOutputElement(contactContainer);
  }

  showSkills(args) {
    const viewType =
      args.find((arg) => arg.startsWith("--view="))?.split("=")[1] || "list";

    if (viewType === "graph") {
      this.showSkillsGraph();
    } else {
      this.showSkillsList();
    }
  }

  showSkillsList() {
    const skills = JSON.parse(this.getSkillsContent());
    const skillsContainer = document.createElement("div");
    skillsContainer.className = "skills-container";

    Object.entries(skills).forEach(([category, categoryData]) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "skill-category";

      const header = document.createElement("div");
      header.className = "skill-category-header";
      header.innerHTML = `<i class="fas fa-code"></i> ${category}`;

      const skillList = document.createElement("div");
      skillList.className = "skill-list";

      categoryData.skills.forEach((skill) => {
        const skillItem = document.createElement("div");
        skillItem.className = "skill-item";

        skillItem.innerHTML = `
                    <span class="skill-name">${skill.name}</span>
                    <div class="skill-level">
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${skill.level}%"></div>
                        </div>
                        <span class="skill-percentage">${skill.level}%</span>
                    </div>
                `;

        skillList.appendChild(skillItem);
      });

      categoryDiv.appendChild(header);
      categoryDiv.appendChild(skillList);
      skillsContainer.appendChild(categoryDiv);
    });

    this.addOutputElement(skillsContainer);
  }

  showSkillsGraph() {
    // Check if D3 is available
    if (typeof d3 === "undefined") {
      this.addOutput(
        "❌ D3.js library not found. Loading constellation skills...",
        "error"
      );
      this.showSkillsList();
      return;
    }

    this.addOutput("🚀 Initializing skills constellation...", "info");
    this.addOutput("", "");

    // Create constellation container
    const constellationContainer = document.createElement("div");
    constellationContainer.className = "constellation-container";
    constellationContainer.id = `constellation-${Date.now()}`;

    // Add hint text
    const hintDiv = document.createElement("div");
    hintDiv.className = "constellation-hint";
    hintDiv.textContent =
      "Interactive skill constellation // Click nodes for details // Drag to explore";

    // Add legend
    const legendDiv = document.createElement("div");
    legendDiv.className = "constellation-legend";
    legendDiv.innerHTML = `
      <span style="color: #F0DB4F">●</span> Backend &nbsp;
      <span style="color: #339933">●</span> JS Frameworks &nbsp;
      <span style="color: #2496ed">●</span> Containers &nbsp;
      <span style="color: #f46800">●</span> CNCF &nbsp;
      <span style="color: #466bb0">●</span> Service Mesh &nbsp;
      <span style="color: #2088ff">●</span> CI/CD &nbsp;
      <span style="color: #fcc624">●</span> Linux &nbsp;
      <span style="color: #f05032">●</span> Git/VCS
    `;

    // Add elements to output
    this.addOutputElement(hintDiv);
    this.addOutputElement(legendDiv);
    this.addOutputElement(constellationContainer);

    // Initialize constellation with delay
    setTimeout(() => {
      this.createSkillConstellation(constellationContainer.id);
    }, 100);
  }

  showProjects(args) {
    const sortType =
      args.find((arg) => arg.startsWith("--sort="))?.split("=")[1] || "date";

    const projects = [...window.PORTFOLIO_DATA.projects];
    if (sortType === "name") {
      projects.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      projects.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const container = document.createElement("div");
    container.className = "projects-container";

    projects.forEach((project) => {
      const item = document.createElement("div");
      item.className = "project-item";

      const techTags = project.tech
        .map((t) => `<span class="tech-tag">${t}</span>`)
        .join("");

      const typeBadge =
        project.type === "fork"
          ? `<span class="project-type-badge fork">fork</span>`
          : `<span class="project-type-badge personal">personal</span>`;

      const liveLink = project.url
        ? `<a href="${project.url}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Live</a>`
        : "";
      const repoLink = project.repo
        ? `<a href="${project.repo}" target="_blank" class="project-link"><i class="fab fa-github"></i> GitHub</a>`
        : "";

      item.innerHTML = `
        <div class="project-header">
          <h3 class="project-title">${project.name} ${typeBadge}</h3>
          <span class="project-date">${project.date}</span>
        </div>
        <div class="project-description">${project.description}</div>
        <div class="project-tech">${techTags}</div>
        <div class="project-links">${liveLink}${repoLink}</div>
      `;

      container.appendChild(item);
    });

    this.addOutputElement(container);
  }

  showCV() {
    const p = window.PORTFOLIO_DATA.profile;
    this.addOutput("=".repeat(60), "info");
    this.addOutput("                     CURRICULUM VITAE", "info");
    this.addOutput("=".repeat(60), "info");
    this.addOutput("", "");

    this.addOutput("PERSONAL INFORMATION", "info");
    this.addOutput(`Name: ${p.name}`, "");
    this.addOutput(`Role: ${p.title}`, "");
    this.addOutput("Location: Myanmar", "");
    this.addOutput(`Email: ${p.email}`, "");
    this.addOutput("", "");

    this.addOutput("EDUCATION", "info");
    this.addOutput("University of Information Technology (UIT)", "");
    this.addOutput("Bachelor of Computer Science", "");
    this.addOutput("", "");

    this.addOutput("EXPERIENCE", "info");
    this.addOutput("• Full-Stack Development", "");
    this.addOutput("• DevOps & Infrastructure", "");
    this.addOutput("• Container Orchestration", "");
    this.addOutput("• Microservices Architecture", "");
    this.addOutput("", "");

    this.addOutput("KEY SKILLS", "info");
    this.addOutput("Backend: JavaScript, Go, Python, TypeScript", "");
    this.addOutput("Frontend: React, Node.js", "");
    this.addOutput("DevOps: Docker, Kubernetes, CI/CD", "");
    this.addOutput("Cloud: AWS, GCP, Monitoring", "");
    this.addOutput("", "");

    this.addOutput("For detailed CV, contact me via email.", "success");
  }

  showHistory() {
    if (this.commandHistory.length === 0) {
      this.addOutput("No commands in history.", "info");
      return;
    }

    this.commandHistory.forEach((command, index) => {
      this.addOutput(`${String(index + 1).padStart(4)}: ${command}`, "");
    });
  }

  changeTheme(args) {
    if (args.length === 0) {
      this.addOutput(`Current theme: ${this.currentTheme}`, "info");
      this.addOutput(`Available themes: ${this.themes.join(", ")}`, "info");
      return;
    }

    const newTheme = args[0];
    if (this.themes.includes(newTheme)) {
      this.currentTheme = newTheme;
      document.documentElement.setAttribute("data-theme", newTheme);
      this.addOutput(`Theme changed to: ${newTheme}`, "success");
    } else {
      this.addOutput(
        `Invalid theme. Available: ${this.themes.join(", ")}`,
        "error"
      );
    }
  }

  showCurrentDir() {
    this.addOutput(this.currentPath, "");
  }

  showDate() {
    const now = new Date();
    this.addOutput(now.toString(), "");
  }

  showUptime() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    this.addOutput(`up ${hours}h ${minutes}m ${seconds}s`, "");
  }

  showSystemInfo() {
    this.addOutput(
      `
╭─────────────────────────────────────────────────────────────╮
│                       STK Terminal v2.1                    │
├─────────────────────────────────────────────────────────────┤
│ OS: Fedora Linux (Terminal Simulation)                     │
│ Shell: Cyberpunk Terminal v2.1                            │
│ Theme: ${this.currentTheme.padEnd(48)} │
│ Uptime: ${Math.floor((Date.now() - this.startTime) / 1000)}s${" ".repeat(45)}│
│ User: ${this.currentUser}@${this.currentHost}${" ".repeat(41)} │
│ Directory: ${this.currentPath}${" ".repeat(48)} │
╰─────────────────────────────────────────────────────────────╯`,
      "info"
    );
  }

  exitTerminal() {
    this.addOutput(
      "Goodbye! Thanks for visiting my terminal portfolio.",
      "success"
    );
    this.addOutput("Closing connection in 3 seconds...", "info");

    setTimeout(() => {
      const terminal = document.getElementById("terminal-container");
      terminal.style.opacity = "0";
      setTimeout(() => {
        window.location.href = "https://github.com/Sithukyaw666";
      }, 1000);
    }, 3000);
  }

  switchToWebsite() {
    this.addOutput("Switching to traditional website interface...", "success");
    this.addOutput("Redirecting in 2 seconds...", "info");

    setTimeout(() => {
      window.location.href = "./index.html";
    }, 2000);
  }

  sudoCommand(args) {
    this.addOutput(
      "Nice try! But this is a portfolio, not a real terminal. 😄",
      "warning"
    );
    this.addOutput("sudo access denied: insufficient coffee levels", "error");
  }

  echo(args) {
    this.addOutput(args.join(" "), "");
  }

  showTree() {
    this.addOutput(".", "info");
    Object.keys(this.fileSystem).forEach((filename, index, arr) => {
      const isLast = index === arr.length - 1;
      const prefix = isLast ? "└── " : "├── ";
      this.addOutput(prefix + filename, "");
    });
  }

  // Utility methods
  addOutput(text, className = "") {
    const output = document.getElementById("output");
    const line = document.createElement("div");
    line.className = `output-line ${className}`;
    line.textContent = text;
    output.appendChild(line);
  }

  addOutputElement(element) {
    const output = document.getElementById("output");
    const container = document.createElement("div");
    container.className = "output-line";
    container.appendChild(element);
    output.appendChild(container);
  }

  addCommandEcho(command) {
    const output = document.getElementById("output");
    const echo = document.createElement("div");
    echo.className = "command-echo";
    echo.innerHTML = `<span class="prompt">${this.currentUser}@${this.currentHost}:${this.currentPath}$ </span><span class="command">${command}</span>`;
    output.appendChild(echo);
  }

  renderMarkdown(content) {
    // Simple markdown rendering for headers, lists, and emphasis
    const lines = content.split("\\n");
    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        this.addOutput(line.replace("# ", ""), "info strong-glow");
      } else if (line.startsWith("## ")) {
        this.addOutput(line.replace("## ", ""), "info glow");
      } else if (line.startsWith("- ")) {
        this.addOutput(line, "");
      } else if (line.includes("**") && line.includes("**")) {
        this.addOutput(line.replace(/\\*\\*(.*?)\\*\\*/g, "$1"), "success");
      } else {
        this.addOutput(line, "");
      }
    });
  }

  focusInput() {
    const input = document.getElementById("command-input");
    input.focus();
  }

  scrollToBottom() {
    const terminal = document.getElementById("terminal");
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Tab completion
  handleTabCompletion(input) {
    const currentInput = input.value.trim();
    const matches = Object.keys(this.commands).filter((cmd) =>
      cmd.startsWith(currentInput)
    );

    if (currentInput.startsWith("cat ")) {
      const filename = currentInput.split(" ")[1] || "";
      const fileMatches = Object.keys(this.fileSystem).filter((file) =>
        file.startsWith(filename)
      );

      if (fileMatches.length === 1) {
        input.value = `cat ${fileMatches[0]}`;
      } else if (fileMatches.length > 1) {
        this.addOutput("Available files:", "info");
        this.addOutput(fileMatches.join("  "), "");
      }
      return;
    }

    if (matches.length === 1) {
      input.value = matches[0];
    } else if (matches.length > 1) {
      this.addOutput("Available commands:", "info");
      this.addOutput(matches.join("  "), "");
    }
  }

  // Command history navigation
  navigateHistory(direction, input) {
    if (this.commandHistory.length === 0) return;

    this.historyIndex += direction;

    if (this.historyIndex < 0) {
      this.historyIndex = 0;
    } else if (this.historyIndex >= this.commandHistory.length) {
      this.historyIndex = this.commandHistory.length;
      input.value = "";
      return;
    }

    input.value = this.commandHistory[this.historyIndex] || "";
  }

  // Suggestions
  showSuggestions(input) {
    const matches = Object.keys(this.commands).filter((cmd) =>
      cmd.startsWith(input.toLowerCase())
    );

    if (matches.length > 0 && matches.length < 10) {
      this.suggestionsList.innerHTML = "";
      matches.forEach((match) => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.textContent = match;
        item.addEventListener("click", () => {
          document.getElementById("command-input").value = match;
          this.hideSuggestions();
          this.focusInput();
        });
        this.suggestionsList.appendChild(item);
      });
      this.suggestionsList.classList.remove("hidden");
    } else {
      this.hideSuggestions();
    }
  }

  hideSuggestions() {
    this.suggestionsList.classList.add("hidden");
    this.selectedSuggestion = -1;
  }

  hideHelp() {
    document.getElementById("help-panel").classList.add("hidden");
  }

  // File content generators
  getAboutContent() {
    const p = window.PORTFOLIO_DATA.profile;
    return `# About ${p.name}

## Who Am I?

${p.bio.join("\n\n")}

## Status
**Current**: ${p.title}
**Mood**: ${p.moodStatus}
**Coffee Level**: ${p.coffeeLevel}`;
  }

  getContactContent() {
    const p = window.PORTFOLIO_DATA.profile;
    return `# Contact Information

## Get in Touch

Feel free to reach out through any of these channels:

**Email**: ${p.email}
**GitHub**: github.com/${p.social.github.handle}
**LinkedIn**: Connect with me for professional networking

## Response Time
- Email: Within 24 hours
- Social Media: Usually pretty quick
- Carrier Pigeon: Not recommended

## Time Zone
Currently operating in ${p.timezone}

## Availability
Available for:
${p.availability.map((a) => `- ${a}`).join("\n")}

## Note
I'm always ready for nothing, but somehow manage to get things done. Feel free to drop a message!`;
  }

  getSkillsContent() {
    const constellation = window.PORTFOLIO_DATA.skills.constellation;
    const simplified = {};
    Object.entries(constellation).forEach(([cat, data]) => {
      simplified[cat] = {
        category: data.category,
        skills: data.skills.map((s) => ({ name: s.name, level: s.level })),
      };
    });
    return JSON.stringify(simplified, null, 2);
  }

  getProjectsContent() {
    return JSON.stringify(window.PORTFOLIO_DATA.projects, null, 2);
  }

  //   getProjectsContent() {
  //     return JSON.stringify(
  //       [
  //         {
  //           name: "Terminal Portfolio",
  //           description:
  //             "Interactive terminal-style portfolio website with cyberpunk aesthetics. Features command-line interface, file system simulation, and multiple themes.",
  //           technologies: ["JavaScript", "CSS3", "HTML5", "Terminal UI"],
  //           date: "2024-08",
  //           links: [
  //             {
  //               name: "GitHub",
  //               url: "https://github.com/Sithukyaw666/Sithukyaw666.github.io",
  //               icon: "fa-github",
  //             },
  //             { name: "Live Demo", url: "#", icon: "fa-external-link-alt" },
  //           ],
  //         },
  //         {
  //           name: "Microservices Platform",
  //           description:
  //             "Scalable microservices architecture with service mesh, monitoring, and automated deployment pipelines.",
  //           technologies: ["Go", "Docker", "Kubernetes", "Istio", "Prometheus"],
  //           date: "2024-06",
  //           links: [
  //             {
  //               name: "GitHub",
  //               url: "https://github.com/Sithukyaw666",
  //               icon: "fa-github",
  //             },
  //           ],
  //         },
  //         {
  //           name: "DevOps Automation Suite",
  //           description:
  //             "Complete CI/CD pipeline automation with infrastructure as code, security scanning, and deployment strategies.",
  //           technologies: ["GitHub Actions", "Terraform", "Ansible", "Python"],
  //           date: "2024-04",
  //           links: [
  //             {
  //               name: "GitHub",
  //               url: "https://github.com/Sithukyaw666",
  //               icon: "fa-github",
  //             },
  //           ],
  //         },
  //         {
  //           name: "Container Orchestration",
  //           description:
  //             "Multi-cloud container orchestration platform with auto-scaling, service discovery, and health monitoring.",
  //           technologies: ["Kubernetes", "Docker", "Helm", "Grafana"],
  //           date: "2024-02",
  //           links: [
  //             {
  //               name: "GitHub",
  //               url: "https://github.com/Sithukyaw666",
  //               icon: "fa-github",
  //             },
  //           ],
  //         },
  //       ],
  //       null,
  //       2
  //     );
  //   }

  getCVContent() {
    return `Binary file (PDF) - Use 'cv' command to view formatted version`;
  }

  getReadmeContent() {
    const p = window.PORTFOLIO_DATA.profile;
    return `# STK Terminal Portfolio

Welcome to my interactive terminal portfolio!

## Features
- Interactive command-line interface
- File system simulation
- Multiple cyberpunk themes
- Command history and autocomplete
- Mobile-responsive design

## Quick Start
Type 'help' to see all available commands.

## Contact
- Email: ${p.email}
- GitHub: github.com/${p.social.github.handle}

## Version
Terminal Portfolio v2.1

Built with ❤️ and lots of coffee ☕`;
  }

  // Enhanced Skills Data for Constellation
  getConstellationSkillsData() {
    return window.PORTFOLIO_DATA.skills.constellation;
  }

  createSkillConstellation(containerId) {
    const skillsData = this.getConstellationSkillsData();
    const container = d3.select(`#${containerId}`);

    if (container.empty()) {
      console.error("Constellation container not found!");
      return;
    }

    // Clear any existing content
    container.selectAll("*").remove();

    const containerRect = container.node().getBoundingClientRect();
    const width = Math.max(800, containerRect.width || 800);
    const height = 600;

    // Create SVG
    const svg = container
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", "transparent");

    // Define gradients for cyberpunk effect
    const defs = svg.append("defs");

    // Catppuccin gradient for links
    const linkGradient = defs
      .append("linearGradient")
      .attr("id", "linkGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    linkGradient
      .append("stop")
      .attr("offset", "0%")
      .style("stop-color", "#89b4fa")
      .style("stop-opacity", 0.3);

    linkGradient
      .append("stop")
      .attr("offset", "50%")
      .style("stop-color", "#cba6f7")
      .style("stop-opacity", 0.8);

    linkGradient
      .append("stop")
      .attr("offset", "100%")
      .style("stop-color", "#89b4fa")
      .style("stop-opacity", 0.3);

    // Create zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        skillsGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Main group for skills constellation
    const skillsGroup = svg.append("g").attr("class", "skills-group");

    // Process data for D3
    const nodes = [];
    const links = [];
    const categories = Object.keys(skillsData);

    // Create category centers distributed in a circle
    const categoryPositions = {};
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150; // Radius for better spacing

    // Add central main node (representing STK)
    const mainNode = {
      id: "main-stk",
      type: "main",
      name: "STK",
      description: "Architect & Full-Stack Developer",
      level: 100,
      color: "#89b4fa", // Catppuccin blue
      x: centerX,
      y: centerY,
      fx: centerX, // Fix position at center
      fy: centerY,
    };
    nodes.push(mainNode);

    categories.forEach((category, i) => {
      const angle = (i / categories.length) * 2 * Math.PI;
      categoryPositions[category] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    // Create nodes
    categories.forEach((category) => {
      const categoryData = skillsData[category];

      // Add category node
      const categoryNode = {
        id: category,
        type: "category",
        category: categoryData.category,
        name: category,
        level: 100,
        color: categoryData.color,
        x: categoryPositions[category].x,
        y: categoryPositions[category].y,
        fx: categoryPositions[category].x, // Fix position
        fy: categoryPositions[category].y,
      };
      nodes.push(categoryNode);

      // Create link from main node to category
      links.push({
        source: "main-stk",
        target: category,
      });

      // Add skill nodes
      categoryData.skills.forEach((skill, i) => {
        const skillNode = {
          id: `${category}-${skill.name}`,
          type: "skill",
          category: categoryData.category,
          parent: category,
          name: skill.name,
          level: skill.level,
          description: skill.description,
          icon: skill.icon,
          color: skill.color,
        };
        nodes.push(skillNode);

        // Create link to category
        links.push({
          source: category,
          target: `${category}-${skill.name}`,
        });
      });
    });

    // Color scale for categories
    const getNodeColor = (d) => {
      return d.color || "#cdd6f4";
    };

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(80)
          .strength(0.5)
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => {
          // Main node has stronger attraction
          if (d.type === "main") return -300;
          return -150;
        })
      )
      .force("center", d3.forceCenter(centerX, centerY))
      .force(
        "collision",
        d3.forceCollide().radius((d) => {
          if (d.type === "main") return 35;
          if (d.type === "category") return 25;
          return Math.max(22, d.level / 5 + 15);
        })
      );

    // Create links
    const link = skillsGroup
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "constellation-link")
      .style("stroke", (d) => {
        if (d.source === "main-stk" || d.target === "main-stk") {
          return "url(#linkGradient)";
        }
        return "rgba(205, 214, 244, 0.4)";
      })
      .style("stroke-opacity", (d) => {
        if (d.source === "main-stk" || d.target === "main-stk") {
          return 0.8;
        }
        return 0.6;
      })
      .style("stroke-width", (d) => {
        if (d.source === "main-stk" || d.target === "main-stk") {
          return 3;
        }
        return 2;
      });

    // Create nodes
    const node = skillsGroup
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", (d) => `constellation-node ${d.type}`)
      .style("cursor", "pointer")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Add circles for nodes
    node
      .append("circle")
      .attr("r", (d) => {
        if (d.type === "main") return 30;
        if (d.type === "category") return 20;
        return Math.max(18, d.level / 5 + 12);
      })
      .style("fill", (d) => getNodeColor(d))
      .style("stroke", (d) => (d.type === "main" ? "#cba6f7" : "#cdd6f4"))
      .style("stroke-width", (d) => (d.type === "main" ? 3 : 2))
      .style("filter", (d) => {
        if (d.type === "main")
          return "drop-shadow(0 0 20px rgba(137, 180, 250, 0.8))";
        return "drop-shadow(0 0 10px rgba(205, 214, 244, 0.3))";
      });

    // Add special icon for main node
    node
      .filter((d) => d.type === "main")
      .append("foreignObject")
      .attr("width", 24)
      .attr("height", 24)
      .attr("x", -12)
      .attr("y", -12)
      .html(
        '<i class="fas fa-user-astronaut" style="font-size: 20px; color: white; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;"></i>'
      );

    // Add Font Awesome icons for skills
    node
      .filter((d) => d.type === "skill" && d.icon)
      .append("foreignObject")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", -10)
      .attr("y", -10)
      .html(
        (d) =>
          `<i class="${d.icon}" style="font-size: 16px; color: white; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;"></i>`
      );

    // Add text labels for main node
    node
      .filter((d) => d.type === "main")
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 45)
      .style("fill", "#89b4fa")
      .style("font-size", "16px")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-weight", "bold")
      .style("text-shadow", "0 0 10px rgba(137, 180, 250, 0.8)");

    // Add text labels for categories
    node
      .filter((d) => d.type === "category")
      .append("text")
      .text((d) => d.name.split(" ")[0])
      .attr("text-anchor", "middle")
      .attr("dy", 30)
      .style("fill", "#cdd6f4")
      .style("font-size", "12px")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-weight", "bold");

    // Add hover effects
    node
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => {
            if (d.type === "main") return 35;
            if (d.type === "category") return 25;
            return Math.max(22, d.level / 4 + 15);
          })
          .style("filter", (d) => {
            if (d.type === "main")
              return "drop-shadow(0 0 25px rgba(137, 180, 250, 1))";
            return "drop-shadow(0 0 15px rgba(205, 214, 244, 0.6))";
          });
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => {
            if (d.type === "main") return 30;
            if (d.type === "category") return 20;
            return Math.max(18, d.level / 5 + 12);
          })
          .style("filter", (d) => {
            if (d.type === "main")
              return "drop-shadow(0 0 20px rgba(137, 180, 250, 0.8))";
            return "drop-shadow(0 0 10px rgba(205, 214, 244, 0.3))";
          });
      })
      .on("click", (event, d) => {
        if (d.type === "skill") {
          this.showSkillDetails(d, containerId);
        } else if (d.type === "main") {
          this.showMainNodeDetails(d, containerId);
        }
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep main node and category nodes fixed
      if (event.subject.type === "main" || event.subject.type === "category") {
        // Restore original position for main and category nodes
        if (event.subject.type === "main") {
          event.subject.fx = centerX;
          event.subject.fy = centerY;
        } else {
          // Restore category positions
          event.subject.fx = categoryPositions[event.subject.id].x;
          event.subject.fy = categoryPositions[event.subject.id].y;
        }
      } else {
        event.subject.fx = null;
        event.subject.fy = null;
      }
    }
  }

  showSkillDetails(skill, containerId) {
    // Remove existing detail panel if any
    const existingPanel = document.querySelector(".skill-details-panel");
    if (existingPanel) {
      existingPanel.remove();
    }

    // Create skill details panel
    const panel = document.createElement("div");
    panel.className = "skill-details-panel";
    panel.innerHTML = `
      <div class="detail-header">
        <h4><i class="${skill.icon}" style="color: ${skill.color}; margin-right: 8px;"></i>${skill.name}</h4>
        <button class="close-btn">×</button>
      </div>
      <div class="detail-content">
        <div>${skill.description}</div>
        <div class="skill-level">
          <div class="level-bar">
            <div class="level-progress" style="width: ${skill.level}%; background-color: ${skill.color};"></div>
          </div>
        </div>
      </div>
    `;

    // Position panel relative to constellation container
    const container = document.getElementById(containerId);
    container.style.position = "relative";
    container.appendChild(panel);

    // Add close button functionality
    panel.querySelector(".close-btn").addEventListener("click", () => {
      panel.remove();
    });
  }

  showMainNodeDetails(mainNode, containerId) {
    // Remove existing detail panel if any
    const existingPanel = document.querySelector(".skill-details-panel");
    if (existingPanel) {
      existingPanel.remove();
    }

    // Create main node details panel
    const panel = document.createElement("div");
    panel.className = "skill-details-panel";
    panel.innerHTML = `
      <div class="detail-header">
        <h4><i class="fas fa-user-astronaut" style="color: #89b4fa; margin-right: 8px;"></i>${mainNode.name}</h4>
        <button class="close-btn">×</button>
      </div>
      <div class="detail-content">
        <div>${mainNode.description}</div>
        <div class="skill-level">
          <div class="level-bar">
            <div class="level-progress" style="width: 100%; background-color: #89b4fa;"></div>
          </div>
        </div>
      </div>
    `;

    // Position panel relative to constellation container
    const container = document.getElementById(containerId);
    container.style.position = "relative";
    container.appendChild(panel);

    // Add close button functionality
    panel.querySelector(".close-btn").addEventListener("click", () => {
      panel.remove();
    });
  }
}

// Initialize terminal when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TerminalPortfolio();
});

// Global keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl+L to clear (like real terminal)
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    const terminal = window.terminal;
    if (terminal) {
      terminal.clearTerminal();
    }
  }

  // Ctrl+C to interrupt (simulation)
  if (e.ctrlKey && e.key === "c") {
    e.preventDefault();
    const output = document.getElementById("output");
    const line = document.createElement("div");
    line.className = "output-line warning";
    line.textContent = "^C";
    output.appendChild(line);
  }
});

// Export for global access
window.TerminalPortfolio = TerminalPortfolio;

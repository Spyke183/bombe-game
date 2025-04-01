export function createModule(container, state) {
  const codes = ["Delta-9", "Omega-3", "Zeta-0", "Sigma-7"];
  const selectedCode = codes[Math.floor(Math.random() * codes.length)];

  container.innerHTML = `
    <style>
      .debugger-container {
        font-family: 'Courier New', Courier, monospace;
        background: #f4f4f4;
        border: 2px solid #333;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }
      .lights-row {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
      }
      .light {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        border: 2px solid black;
        background-color: #c62828;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
        flex-direction: column;
      }
      .light.green {
        background-color: #2e7d32;
      }
      input, button {
        display: block;
        margin: 10px auto;
        padding: 10px;
        font-family: inherit;
        font-size: 14px;
      }
      .log-box, #cmdOutput {
        background: #111;
        color: #0f0;
        padding: 10px;
        font-size: 12px;
        white-space: pre-wrap;
        overflow-y: auto;
        max-height: 100px;
        margin-top: 10px;
      }
      .status-message {
        text-align: center;
        font-weight: bold;
        margin-top: 10px;
      }
        h2 {
text-align: center;
margin-bottom: 10px;
color: #000;
}
h3 {
text-align: center;
margin-top: 0;
color: #000;
}

    </style>

    <div class="debugger-container">
      <h2 style="text-align: center; font-size: 24px; margin-bottom: 5px;">🧪 MODULE DEBUGGER</h2>
      <h3 style="text-align: center; font-size: 16px; color: #ff9800; margin-top: 0;">
        Code Système : <span>${selectedCode}</span>
      </h3>

      <div class="lights-row">
        <div class="light" id="light-override">override</div>
        <div class="light" id="light-systemReady">systemReady</div>
        <div class="light" id="light-errorCount">errorCount</div>
        <div class="light" id="light-canLaunch">canLaunch</div>
      </div>

      <button id="launchBtn" disabled>Lancer le système</button>
      <input type="text" id="keyInput" placeholder="Entrez la clé..." disabled />
      <button id="validateBtn">Valider</button>
      <div id="codeReveal" class="status-message"></div>

      <div class="log-box">
LOGS :
Uncaught ReferenceError: initConfig is not defined
    at <anonymous>:1:1
    at window.onload (debugger.js:99)
      </div>

      <label for="cmdInput"><strong>Terminal :</strong></label>
      <input id="cmdInput" type="text" placeholder="> Tapez une commande JS..." />
      <pre id="cmdOutput"></pre>
    </div>
  `;

  // Variables simulées dans le contexte
  window.systemReady = false;
  window.override = false;
  window.errorCount = 4;
  window.canLaunch = false;
  window.unlockKey = '';
  window.resetModule = () => {
    console.log("🔄 resetModule() exécuté");
    window.systemReady = true;
  };

  const launchBtn = container.querySelector("#launchBtn");
  const keyInput = container.querySelector("#keyInput");
  const validateBtn = container.querySelector("#validateBtn");
  const codeReveal = container.querySelector("#codeReveal");

  function updateIndicators() {
    container.querySelector("#light-override").classList.toggle("green", window.override === true);
    container.querySelector("#light-systemReady").classList.toggle("green", window.systemReady === true);
    container.querySelector("#light-errorCount").classList.toggle("green", window.errorCount < 3);
    container.querySelector("#light-canLaunch").classList.toggle("green", window.canLaunch === true);
  }

  setInterval(() => {
    updateIndicators();
    if (
      window.systemReady &&
      window.override &&
      window.errorCount < 3 &&
      window.canLaunch
    ) {
      launchBtn.disabled = false;
      launchBtn.textContent = "🚀 Prêt au Lancement";
    }
  }, 1000);

  launchBtn.onclick = () => {
    keyInput.disabled = false;
  };

  validateBtn.onclick = () => {
    const val = keyInput.value.trim();
    const isCorrect =
      (selectedCode === "Zeta-0" && val === "ZX42") ||
      (selectedCode !== "Zeta-0" && val === "42XY");

    if (isCorrect) {
      window.unlockKey = val;
      codeReveal.textContent = "✅ Code : DEV-007";
      state.onSuccess();
    } else {
      codeReveal.textContent = "❌ Clé invalide";
      state.logError();
    }
  };

  // Terminal intégré
  const cmdInput = container.querySelector("#cmdInput");
  const cmdOutput = container.querySelector("#cmdOutput");

  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = cmdInput.value.trim();
      if (!command) return;

      try {
        const result = eval(command);
        cmdOutput.textContent += `> ${command}\n← ${result}\n`;
      } catch (err) {
        cmdOutput.textContent += `> ${command}\n⚠️ ${err.message}\n`;
      }

      cmdInput.value = "";
      cmdOutput.scrollTop = cmdOutput.scrollHeight;
    }
  });

  console.error("Uncaught ReferenceError: initConfig is not defined");
  console.log("%c💡 Indice :", "color: orange;");
  console.log("Tapez les commandes directement dans le terminal intégré.");
}

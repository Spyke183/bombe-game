export function createModule(container, state) {
    const words = [
      "BLANC", "CLONAT", "CABLON", "BALTON", "TALONC",
      "COBALT", "BLONCA", "CLONAB", "BOTLAN", "TOLCAN"
    ];
  
    const rules = [
      {
        description: "Le mot doit contenir un T mais pas en début ou fin",
        validate: word => word.includes("T") && !word.startsWith("T") && !word.endsWith("T")
      },
      {
        description: "Le mot ne doit pas avoir de lettre répétée",
        validate: word => new Set(word).size === word.length
      },
      {
        description: "Le mot doit commencer par une consonne et finir par une voyelle",
        validate: word => {
          const voyelles = "AEIOU";
          return !"AEIOU".includes(word[0]) && "AEIOU".includes(word[word.length - 1]);
        }
      },
      {
        description: "Le mot doit avoir plus de 5 lettres et contenir un O",
        validate: word => word.length > 5 && word.includes("O")
      },
      {
        description: "Le mot doit être formé uniquement de lettres symétriques verticalement",
        validate: word => {
          const valides = new Set(["A", "H", "I", "M", "O", "T", "U", "V", "W", "X", "Y", "B"]);
          return [...word].every(l => valides.has(l));
        }
      }
    ];
  
    // On choisit une règle au hasard
    const activeRule = rules[Math.floor(Math.random() * rules.length)];
  
    // Certaines lettres sont désactivées
    const blockedLetters = ["L", "N"]; // exemple piégé
  
    // HTML
    container.innerHTML = `
      <h2>Module des Mots Piégés</h2>
      <p><strong>Règle :</strong> ${activeRule.description}</p>
      <div id="keyboard" style="margin: 1rem 0;"></div>
      <input type="text" id="wordInput" readonly style="font-size: 1.5rem; text-align: center;" />
      <br/>
      <button id="validateBtn">Valider le mot</button>
      <p id="feedback"></p>
    `;
  
    const input = container.querySelector("#wordInput");
    const feedback = container.querySelector("#feedback");
    const validateBtn = container.querySelector("#validateBtn");
  
    // Clavier virtuel
    const keyboard = container.querySelector("#keyboard");
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
    letters.forEach(letter => {
      const btn = document.createElement("button");
      btn.textContent = letter;
      btn.style.margin = "2px";
      btn.disabled = blockedLetters.includes(letter);
      btn.onclick = () => {
        input.value += letter;
      };
      keyboard.appendChild(btn);
    });
  
    // Valider
    validateBtn.onclick = () => {
      const word = input.value.toUpperCase();
  
      if (!words.includes(word)) {
        feedback.textContent = "❌ Ce mot n’est pas dans la liste autorisée.";
        state.logError();
        return;
      }
  
      if (activeRule.validate(word)) {
        feedback.innerHTML = "✅ Mot accepté ! Module désamorcé.";
        input.disabled = true;
        validateBtn.disabled = true;
        state.onSuccess();
      } else {
        feedback.innerHTML = "💥 Mauvais mot selon la règle !";
        state.logError();
      }
    };
  }
  
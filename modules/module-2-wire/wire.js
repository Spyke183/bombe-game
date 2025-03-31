export function createModule(container, state) {
    // Liste des couleurs des câbles à afficher
    const cables = [
      "Rouge", "Bleu", "Jaune", "Jaune", "Blanc"
    ];
  
    // HTML
    container.innerHTML = `
      <h2>Module des Câbles à Couper</h2>
      <div id="cableContainer" style="display: flex; justify-content: space-between; margin-bottom: 1rem;"></div>
      <button id="validateBtn">Valider la coupe</button>
      <p id="feedback"></p>
    `;
  
    const feedback = container.querySelector("#feedback");
    const validateBtn = container.querySelector("#validateBtn");
    const cableContainer = container.querySelector("#cableContainer");
  
    // Affichage des câbles
    cables.forEach((cable, index) => {
      const cableDiv = document.createElement("div");
      cableDiv.textContent = cable;
      cableDiv.style.padding = "5px 10px";
      cableDiv.style.border = "2px solid black";
      cableDiv.style.cursor = "pointer";
      cableDiv.dataset.index = index;
      cableDiv.onclick = () => {
        cableDiv.classList.toggle("selected");
      };
      cableContainer.appendChild(cableDiv);
    });
  
    // Validation de la coupe
    validateBtn.onclick = () => {
      // Récupérer les câbles sélectionnés
      const selectedCables = Array.from(cableContainer.querySelectorAll(".selected"))
        .map(div => cables[div.dataset.index]);
  
      // Les bons câbles à couper sont le "Blanc" et le "Bleu"
      const correctCables = ["Bleu", "Jaune"];
  
      // Vérifier si le joueur a bien sélectionné les bons câbles
      const isValidCut = selectedCables.length === correctCables.length &&
        selectedCables.every(cable => correctCables.includes(cable));
  
      if (isValidCut) {
        feedback.innerHTML = "✅ Couper les câbles Blanc et Bleu réussis ! Module désamorcé.";
        // Marquer les câbles comme coupés
        selectedCables.forEach(cable => {
          const cableDivs = Array.from(cableContainer.querySelectorAll("div"));
          cableDivs.forEach(div => {
            if (div.textContent === cable && div.classList == "selected") {
              div.classList.add("cut");
            }
          });
        });
  
        validateBtn.disabled = true;
        state.onSuccess();
      } else {
        feedback.textContent = "💥 Mauvaise sélection de câbles ! Essayez à nouveau.";
        state.logError();
      }
    };
  }
  
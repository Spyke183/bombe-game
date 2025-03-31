export function createModule(container, state) {
    container.innerHTML = `
      <h2>Module des Câbles</h2>
      <div id="cableContainer" class="cable-grid"></div>
      <p id="rule"></p>
      <button id="validateBtn">Valider la coupe</button>
      <p id="feedback"></p>
    `;

    // Scénarios différents
    const scenarios = [
        {
            cables: ["Rouge", "Bleu", "Jaune"],
            correctCables: ["Jaune"]
        },
        {
            cables: ["Rouge", "Bleu", "Jaune", "Blanc"],    
            correctCables: ["Bleu", "Blanc"]
        },
        {
            cables: ["Jaune", "Bleu", "Jaune", "Rouge", "Vert"],
            correctCables: ["Rouge"]
        },
        {
            cables: ["Rouge", "Bleu", "Jaune", "Blanc", "Vert", "Blanc"],
            correctCables: ["Vert"]
        }
    ];

    // Choisir un scénario au hasard
    let currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    // Définir feedback et bouton de validation
    const feedback = container.querySelector("#feedback");
    const validateBtn = container.querySelector("#validateBtn");
    const cableContainer = container.querySelector("#cableContainer");

    // Mise à jour du module avec les câbles et la règle
    function updateModule(scenario) {
        // Mettre à jour les câbles affichés
        cableContainer.innerHTML = ""; // Effacer les câbles précédents
        scenario.cables.forEach((cable, index) => {
            const cableDiv = document.createElement("div");
            cableDiv.classList.add("cable");
            cableDiv.dataset.index = index;
            cableDiv.textContent = cable;
            cableDiv.onclick = () => cableDiv.classList.toggle("selected");
            cableContainer.appendChild(cableDiv);
        });

        // Mettre à jour la règle affichée
        const ruleElement = container.querySelector("#rule");
        ruleElement.textContent = scenario.rule;
    }

    // Initialiser le module avec un scénario
    updateModule(currentScenario);

    // Validation de la coupe
    validateBtn.onclick = () => {
        const selectedCables = Array.from(cableContainer.querySelectorAll(".selected"))
            .map(div => ({ div, color: div.textContent }));

        const isValidCut = selectedCables.length === currentScenario.correctCables.length &&
            selectedCables.every(({ color }) => currentScenario.correctCables.includes(color));

        if (isValidCut) {
            feedback.innerHTML = "✅ Câbles correctement coupés ! Module désamorcé.";
            selectedCables.forEach(({ div }) => div.classList.add("cut"));
            validateBtn.disabled = true;
            state.onSuccess();
        } else {
            feedback.textContent = "💥 Mauvaise sélection ! Essayez encore.";
            state.logError();

            // Changer le scénario si la coupe est incorrecte
            currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            updateModule(currentScenario);
        }
    };
}

export function createModule(container, state) {
    container.innerHTML = `
      <h2>Module des Câbles</h2>
      <div id="cableContainer" class="cable-grid"></div>
      <button id="validateBtn">Valider la coupe</button>
      <p id="feedback"></p>
    `;

    const cables = ["Rouge", "Bleu", "Jaune", "Jaune", "Blanc"];
    const feedback = container.querySelector("#feedback");
    const validateBtn = container.querySelector("#validateBtn");
    const cableContainer = container.querySelector("#cableContainer");

    // Création des câbles dans le module
    cables.forEach((cable, index) => {
        const cableDiv = document.createElement("div");
        cableDiv.classList.add("cable");
        cableDiv.dataset.index = index;
        cableDiv.textContent = cable;
        cableDiv.onclick = () => cableDiv.classList.toggle("selected");
        cableContainer.appendChild(cableDiv);
    });

    validateBtn.onclick = () => {
        const selectedCables = Array.from(cableContainer.querySelectorAll(".selected"))
            .map(div => ({ div, color: div.textContent }));

        const correctCables = ["Bleu", "Jaune"];
        const isValidCut = selectedCables.length === correctCables.length &&
            selectedCables.every(({ color }) => correctCables.includes(color));

        if (isValidCut) {
            feedback.innerHTML = "✅ Câbles correctement coupés ! Module désamorcé.";
            selectedCables.forEach(({ div }) => div.classList.add("cut"));
            validateBtn.disabled = true;
            state.onSuccess();
        } else {
            feedback.textContent = "💥 Mauvaise sélection ! Essayez encore.";
            state.logError();
        }
    };
}

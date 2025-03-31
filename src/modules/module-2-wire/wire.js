import React, { useState } from "react";
import { createRoot } from "react-dom/client";

export default function WireGame({ onSuccess, logError }) {
  const scenarios = [
    { cables: ["Rouge", "Bleu", "Jaune"], correctCables: ["Jaune"] },
    { cables: ["Rouge", "Bleu", "Jaune", "Blanc"], correctCables: ["Bleu", "Blanc"] },
    { cables: ["Jaune", "Bleu", "Jaune", "Rouge", "Vert"], correctCables: ["Rouge"] },
    { cables: ["Rouge", "Bleu", "Jaune", "Blanc", "Vert", "Blanc"], correctCables: ["Vert"] },
  ];

  const generateScenario = () => {
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    return {
      cables: scenario.cables.map((color, index) => ({ id: `${color}-${index}`, color })),
      correctCables: scenario.correctCables,
    };
  };

  const [currentScenario, setCurrentScenario] = useState(generateScenario());
  const [selectedCables, setSelectedCables] = useState([]);
  const [feedback, setFeedback] = useState("");

  const toggleCable = (id) => {
    setSelectedCables((prev) =>
      prev.includes(id) ? prev.filter((cableId) => cableId !== id) : [...prev, id]
    );
  };

  const validateCut = () => {
    const correctIds = currentScenario.cables
      .filter((cable) => currentScenario.correctCables.includes(cable.color))
      .map((cable) => cable.id);

    const isValidCut =
      selectedCables.length === correctIds.length &&
      selectedCables.every((id) => correctIds.includes(id));

    if (isValidCut) {
      setFeedback("✅ Câbles correctement coupés ! Module désamorcé.");
      onSuccess();
    } else {
      setFeedback("💥 Mauvaise sélection ! Essayez encore.");
      logError();
      resetScenario();
    }
  };

  const resetScenario = () => {
    setCurrentScenario(generateScenario());
    setSelectedCables([]);
  };

  return (
    <div className="module-container">
      <h2 className="module-title">Module des Câbles</h2>
      <div className="cable-grid">
        {currentScenario.cables.map(({ id, color }) => (
          <div
            key={id}
            className={`cable ${selectedCables.includes(id) ? "selected" : ""}`}
            onClick={() => toggleCable(id)}
          >
            {color}
          </div>
        ))}
      </div>
      <button className="validate-button" onClick={validateCut}>
        Valider la coupe
      </button>
      <p className="feedback">{feedback}</p>
    </div>
  );
}

const container = document.getElementById("game2");
if (container) {
  const root = createRoot(container);
  root.render(<WireGame onSuccess={() => {}} logError={() => {}} />);
} else {
  console.error("L'élément avec l'ID 'game2' n'existe pas.");
}
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// Timer principal
const realTimeInitial = 900; // temps réel: 15 minutes
const fakeTimeInitial = 900; // faux temps affiché
let slowFactor = 1;
let sequence = [];
const correctSequence = ["blue", "yellow", "red"];
let fastInterval = 100; // Réduction rapide (en millisecondes, ex: 300ms = 0.3s)
let accelTime = false; // Mode accéléré activé ou non

export default function BombDefuser() {
  const [realTime, setRealTime] = useState(realTimeInitial);
  const [fakeTime, setFakeTime] = useState(fakeTimeInitial);
  const timerIntervalRef = useRef(null);
  const [result, setResult] = useState("");
  const [sequenceDisplay, setSequenceDisplay] = useState("");
  const [currentModule, setCurrentModule] = useState("module1");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonRestoreDisabled, setButtonRestoreDisabled] = useState(true); // Initialement désactivé

  // Référence pour l'élément 'game5'
  const game5Element = useRef(null);

  useEffect(() => {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
      timerElement.textContent = `Temps restant: ${fakeTime}s`;
    }

    timerIntervalRef.current = setInterval(() => {
      if (realTime > 0) {
        setRealTime((prev) => prev - 1);
        if (!accelTime && realTime % slowFactor === 0) {
          setFakeTime((prev) => prev - 1);
        }
      } else {
        clearInterval(timerIntervalRef.current);
        setResult("💥BOOM!💥 La bombe a explosé");
      }
    }, 1000); // Mise à jour toutes les 1s

    // Vérification de fakeTime pour enlever "hidden" de game5
    if (fakeTime === 120 && game5Element.current) {
      game5Element.current.removeAttribute("hidden");
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [realTime, accelTime, fakeTime]);

  useEffect(() => {
    // Si l'accélération est activée, on met à jour fakeTime toutes les 300ms
    const fastTimerInterval = setInterval(() => {
      if (accelTime && fakeTime > 0) {
        setFakeTime((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }
      if (fakeTime <= 0) {
        setButtonRestoreDisabled(false);
      }
    }, fastInterval); // Réduit toutes les 100ms si accelTime est true

    return () => clearInterval(fastTimerInterval);
  }, [accelTime, fakeTime]);

  const startFastReduction = () => {
    accelTime = true;
  };

  const stopFastReduction = () => {
    accelTime = false;
  };

  const toggleAcceleration = (state) => {
    accelTime = state;
    if (accelTime) {
      startFastReduction();
    } else {
      stopFastReduction();
    }
  };

  const showModule = (moduleId) => {
    setCurrentModule(moduleId);
  };

  const hideAllModules = () => {
    setCurrentModule("");
  };

  const checkTimer = () => {
    const currentTime = Math.floor(fakeTime);
    if (currentTime % 5 === 0) {
      setResult("🎉 Bombe désamorcée! 🎉");
      hideAllModules();
      setButtonDisabled(true);
      clearInterval(timerIntervalRef.current);
    } else {
      setResult(`Erreur de timing! Le temps (${currentTime}s) n'est pas un multiple de 5!`);
      slowFactor *= 2;
    }
  };

  const handleSequencePress = (color) => {
    sequence.push(color);
    setSequenceDisplay(sequence.join(" → "));
    if (sequence.length === 3) {
      if (JSON.stringify(sequence) !== JSON.stringify(correctSequence)) {
        setResult("Mauvaise séquence!");
        slowFactor *= 2;
        sequence = [];
        setSequenceDisplay("Mauvaise séquence...");
      } else {
        setResult("Séquence correcte!");
        sequence = [];
        setSequenceDisplay("");
        showModule("module3");
      }
    }
  };

  const checkCode = () => {
    let code = document.getElementById("codeInput").value;

    if (code !== "3589") {
      setResult("Mauvais code!");
      slowFactor *= 2;
      document.getElementById("codeInput").value = "";
    } else {
      setResult("Code correct!");
      showModule("module4");
      activatePanicMode();
    }
  };

  const activatePanicMode = () => {
    toggleAcceleration(true);
    document.getElementById("timer").classList.add("shake-element");

    // Vérifier si l'élément 'fake-submit' existe avant de manipuler
    const fakeSubmitButton = document.getElementById("fake-submit");
    if (fakeSubmitButton) {
      fakeSubmitButton.disabled = true;
      fakeSubmitButton.classList.add("disabled");
    } else {
      console.error("L'élément avec l'ID 'fake-submit' n'a pas été trouvé.");
    }

    setButtonRestoreDisabled(true); // Activer le bouton de restauration
  };

  const restoreTime = () => {
    stopFastReduction();
    setFakeTime(120); // Remettre à 120 secondes ou à un autre temps choisi
    slowFactor = 1;
    document.getElementById("timer").classList.remove("shake-element");

    // Vérifier à nouveau l'existence de l'élément avant de manipuler
    const fakeSubmitButton = document.getElementById("fake-submit");
    if (fakeSubmitButton) {
      fakeSubmitButton.disabled = false;
      fakeSubmitButton.classList.remove("disabled");
    } else {
      console.error("L'élément avec l'ID 'fake-submit' n'a pas été trouvé.");
    }

    setResult("Le système s'est auto-réparé! Prépare-toi pour le désamorçage final!");
    showModule("module5");
    setButtonRestoreDisabled(true); // Désactiver après restauration
  };

  const resetGame = () => {
    setResult("");
    setSequenceDisplay("");
    slowFactor = 1;
    setCurrentModule("module1");
    setButtonDisabled(false);
    setButtonRestoreDisabled(true); // Réinitialiser à désactivé
  };

  return (
    <div className="container">
      <h1>Défi Désamorçage</h1>

      {currentModule === "module1" && (
        <div>
          <h2>Trouve le bon bouton</h2>
          <p className="instruction">Evite de te tromper 😈</p>
          <div className="button-container">
            <button onClick={() => { setResult("Bon choix!"); showModule("module2"); }}>👻</button>
            <button onClick={() => { setResult("Mauvais choix!"); }}>🫥</button>
            <button onClick={() => { setResult("Mauvais choix!"); }}>😶‍🌫️</button>
          </div>
        </div>
      )}

      {currentModule === "module2" && (
        <div>
          <h2>Entre la bonne séquence</h2>
          <div id="sequence-display">{sequenceDisplay}</div>
          <div className="button-container">
            <button onClick={() => handleSequencePress("blue")}>🔵</button>
            <button onClick={() => handleSequencePress("red")}>🔴</button>
            <button onClick={() => handleSequencePress("yellow")}>🟡</button>
          </div>
        </div>
      )}

      {currentModule === "module3" && (
        <div>
          <h2>Entre le code secret</h2>
          <input type="text" id="codeInput" maxLength="4" placeholder="----" />
          <button onClick={checkCode}>Valider</button>
        </div>
      )}

      {currentModule === "module4" && (
        <div>
          <h2>Système critique!</h2>
          <p id="panic-message">Le compte à rebours s'accélère drastiquement!</p>
          <div className="fake-puzzle">
            <p>"Je grandis mais ne vieillis jamais, qu'est-ce que je suis ?"</p>
            <input type="text" id="fake-answer" placeholder="Ta réponse..." />
            <button id="fake-submit">Valider</button>
          </div>
          <button id="buttonRestore" onClick={restoreTime} disabled={buttonRestoreDisabled}>Désactiver</button>
        </div>
      )}

      {currentModule === "module5" && (
        <div>
          <h2>Désamorce la bombe!</h2>
          <button onClick={checkTimer} disabled={buttonDisabled}>Désamorcer</button>
        </div>
      )}

      <p>{result}</p>

      <button onClick={resetGame}>Recommencer</button>

      {/* Game5 avec hidden */}
      <div id="game5" ref={game5Element} hidden>
        {/* Contenu de votre game5 */}
      </div>
    </div>
  );
}

const container = document.getElementById("game5");
if (container) {
  const root = createRoot(container);
  root.render(<BombDefuser />);
} else {
  console.error("L'élément avec l'ID 'root' n'existe pas.");
}

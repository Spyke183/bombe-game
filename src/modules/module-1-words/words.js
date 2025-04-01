import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { createRoot } from 'react-dom/client';
import App from '../../App'; // Assurez-vous que le chemin est correct
import BlurOverlay from "../blur"; // Assurez-vous du bon chemin

const disabledPhysicalKeys = ["B", "L", "A", "N", "C"];
const disabledVirtualKeys = ["O", "T", "V", "E", "R", "S", "I", "M", "P", "J", "K", "Q", "U", "W", "X"];
const timeLimit = 30;

export default function TrapGame() {
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [message, setMessage] = useState("Début du jeu !");
  const [showPopup, setShowPopup] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key != null) {
        const key = event.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
          handleKeyPress(key);
        } else if (event.key === "Backspace") {
          handleBackspace();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerError = (errorMsg, type) => {
    setMessage(errorMsg);
    if(type != 'key'){
      setShowOverlay(true);
    }
    setTimeout(() => {
      setShowOverlay(false);
    }, 5000);
  };

  const handleKeyPress = (key) => {
    if (disabledPhysicalKeys.includes(key)) {
      triggerError(`La touche ${key} est cassée sur le clavier physique !`, 'key');
      return;
    }
    setInput((prev) => prev + key);
  };

  const handleVirtualKeyPress = (key) => {
    if (disabledVirtualKeys.includes(key)) {
      triggerError(`La touche ${key} est cassée sur le clavier virtuel !`);
      return;
    }
    setInput((prev) => prev + key);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const checkWord = () => {
    if (input === "COBALT") {
      setShowPopup(true);
    } else if (input === "TOLCAN") {
      setMessage("Bravo, bon mot !");
    } else {
      triggerError("Mauvais mot ! La bombe se rapproche de l'explosion !");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="p-6 flex flex-col items-start gap-4">
      <h1 className="text-xl font-bold">🌌 LE MOT COSMIQUE 🌌</h1>
      <p>Temps Max recommandé : 3min</p>
      <p className="text-red-500">{message}</p>
      <input className="border p-2 text-lg" value={input} readOnly />
      <div className="flex flex-wrap gap-2 mt-4">
        {"AMQYJEGSHRIKOPCBNWZXVDFLTU".split("").map((letter) => (
          <Button
            key={letter}
            onClick={() => handleVirtualKeyPress(letter)}
            disabled={disabledVirtualKeys.includes(letter)}
            className="w-12 h-12"
          >
            {letter}
          </Button>
        ))}
      </div>
      <Button className="mt-4 bg-gray-500 text-white" onClick={handleBackspace}>⌫ Effacer</Button>
      <Button className="mt-4 bg-green-500 text-white" onClick={checkWord}>Vérifier</Button>

      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border p-4 shadow-lg z-50">
          <p>😄 T'es trop naïf, sale noob !!!</p>
          <Button onClick={closePopup} className="mt-2 bg-red-500 text-white">Fermer</Button>
        </div>
      )}

      {showOverlay && <BlurOverlay />}
    </div>
  );
}

const container = document.getElementById('game');
if (container) {
    const root = createRoot(container);
    root.render(<TrapGame />);
} else {
    console.error();
}

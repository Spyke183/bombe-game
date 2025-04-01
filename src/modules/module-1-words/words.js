import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { createRoot } from 'react-dom/client';
import App from '../../App';

const allLetters = "AZERTYUIOPQSDFGHJKLMWXCVBN".split(''); // Toutes les lettres possibles
const timeLimit = 30;

export default function TrapGame() {
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [message, setMessage] = useState("Début du jeu !");
  const [showPopup, setShowPopup] = useState(false);
  const [physicalKeys, setPhysicalKeys] = useState([]);
  const [virtualKeys, setVirtualKeys] = useState([]);

  // Initialisation et mélange des touches
  useEffect(() => {
    shuffleKeys();
  }, []);

  const shuffleKeys = () => {
    const shuffled = [...allLetters].sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(shuffled.length / 2);
    
    setPhysicalKeys(shuffled.slice(0, splitIndex));
    setVirtualKeys(shuffled.slice(splitIndex));
  };

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
          if (physicalKeys.includes(key)) {
            handleKeyPress(key);
          } else {
            setMessage(`La touche ${key} n'est pas disponible sur le clavier physique !`);
          }
        } else if (event.key === "Backspace") {
          handleBackspace();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [physicalKeys]);

  const handleKeyPress = (key) => {
    setInput((prev) => prev + key);
    shuffleKeys(); // Re-mélange après chaque action
  };

  const handleVirtualKeyPress = (key) => {
    setInput((prev) => prev + key);
    shuffleKeys(); // Re-mélange après chaque action
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
    shuffleKeys(); // Re-mélange après chaque action
  };

  const checkWord = () => {
    if (input === "COBALT") {
      setShowPopup(true);
    } else if (input === "TOLCAN") {
      setMessage("Bravo, bon mot !");
    } else {
      setMessage("Mauvais mot ! La bombe se rapproche de l'explosion !");
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
      <p>Touches physiques disponibles: {physicalKeys.join(', ')}</p>
      <input className="border p-2 text-lg" value={input} readOnly />
      
      <div className="flex flex-wrap gap-2 mt-4">
        {virtualKeys.map((letter) => (
          <Button
            key={letter}
            onClick={() => handleVirtualKeyPress(letter)}
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
    </div>
  );
}

// Code de rendu
const container = document.getElementById('game');
if (container) {
    const root = createRoot(container);
    root.render(<TrapGame />);
} else {
    console.error('L\'élément avec l\'ID "game" n\'existe pas.');
}
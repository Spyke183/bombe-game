import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import BlurOverlay from "../blur"; // Assurez-vous que le chemin est correct

export default function Simon() {
  const colors = ["red", "green", "blue", "yellow"];
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isSequenceVisible, setIsSequenceVisible] = useState(true);
  const [round, setRound] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false); // 🔹 Ajout de l'état pour le flou

  const buttonRefs = useRef({
    red: null,
    green: null,
    blue: null,
    yellow: null,
  });

  const generateSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prevSequence) => [...prevSequence, randomColor]);
    setRound((prevRound) => prevRound + 1);
  };

  const startGame = () => {
    setIsPlaying(true);
    setMessage("");
    setUserSequence([]);
    setSequence([]);
    setRound(0);
    setIsSequenceVisible(true);
  };

  useEffect(() => {
    if (isPlaying && sequence.length === 0) {
      generateSequence();
    }
  }, [sequence, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !isSequenceVisible) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const color = sequence[i];
        const buttonRef = buttonRefs.current[color];

        if (buttonRef) {
          buttonRef.classList.add("active");
          setTimeout(() => {
            buttonRef.classList.remove("active");
          }, speed / 2);
        }
        i++;
      } else {
        clearInterval(interval);
        setIsUserTurn(true);
        setIsSequenceVisible(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [sequence, isPlaying, isSequenceVisible]);

  const handleColorClick = (color) => {
    if (!isUserTurn) return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (newUserSequence.join("") === sequence.slice(0, newUserSequence.length).join("")) {
      if (newUserSequence.length === sequence.length) {
        setMessage("Séquence correcte !");
        setTimeout(() => {
          if (round < 8) {
            setUserSequence([]);
            setIsUserTurn(false);
            setIsSequenceVisible(true);
            generateSequence();
            setMessage("Nouvelle séquence...");
          } else {
            setMessage("Bravo ! Vous avez complété toutes les séquences.");
            setIsPlaying(false);
          }
        }, 1000);
      }
    } else {
      setMessage("Mauvaise séquence !");
      setShowOverlay(true); // 🔹 Active l'effet flou

      setTimeout(() => {
        setShowOverlay(false); // 🔹 Désactive l'effet flou après 5 secondes
        setIsPlaying(false);
        startGame();
      }, 5000);
    }
  };

  return (
    <div className="simon-game">
      <h2>Jeu Simon</h2>
      <p>{message}</p>

      <div className="buttons-container">
        {colors.map((color) => (
          <button
            key={color}
            ref={(el) => (buttonRefs.current[color] = el)}
            id={color}
            className={`simon-button ${color} ${isUserTurn ? "" : "disabled"}`}
            onClick={() => handleColorClick(color)}
            disabled={!isUserTurn}
          >
            {color}
          </button>
        ))}
      </div>

      <button onClick={startGame} disabled={isPlaying}>
        Démarrer le jeu
      </button>

      {/* 🔹 Affichage de l'overlay en cas d'erreur */}
      {showOverlay && <BlurOverlay />}
    </div>
  );
}

const container = document.getElementById("game3");
if (container) {
  const root = createRoot(container);
  root.render(<Simon />);
} else {
  console.error("L'élément avec l'ID 'game3' n'existe pas.");
}

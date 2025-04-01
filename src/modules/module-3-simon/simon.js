import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// Composant Simon
export default function Simon() {
  const colors = ["red", "green", "blue", "yellow"]; // Les couleurs possibles
  const [sequence, setSequence] = useState([]); // Séquence générée
  const [userSequence, setUserSequence] = useState([]); // Séquence entrée par l'utilisateur
  const [isUserTurn, setIsUserTurn] = useState(false); // Si c'est le tour de l'utilisateur
  const [message, setMessage] = useState(""); // Message d'état (gagné, perdu, etc.)
  const [isPlaying, setIsPlaying] = useState(false); // Si le jeu est en cours ou non
  const [speed, setSpeed] = useState(1000); // Vitesse de clignotement des boutons
  const [isSequenceVisible, setIsSequenceVisible] = useState(true); // Si la séquence doit être visible
  const [round, setRound] = useState(0); // Nombre de séquences jouées
  
  // Références pour chaque bouton
  const buttonRefs = useRef({
    red: null,
    green: null,
    blue: null,
    yellow: null,
  });

  // Fonction pour générer une séquence aléatoire
  const generateSequence = () => {
    if (round < 5) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setSequence((prevSequence) => [...prevSequence, randomColor]);
      setRound((prevRound) => prevRound + 1); // Incrémenter le nombre de séquences
    }
  };

  // Fonction pour démarrer ou redémarrer le jeu
  const startGame = () => {
    setIsPlaying(true);
    setMessage("");
    setUserSequence([]);
    setSequence([]);
    setRound(0); // Réinitialiser le compteur de séquences
    generateSequence(); // Démarrer la première séquence
  };

  // Fonction pour clignoter les couleurs de la séquence
  useEffect(() => {
    if (!isPlaying || !isSequenceVisible) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const color = sequence[i];
        const buttonRef = buttonRefs.current[color];

        // Vérification si le bouton existe avant de manipuler son état
        if (buttonRef) {
          buttonRef.classList.add("active");
          setTimeout(() => {
            buttonRef.classList.remove("active");
          }, speed / 2);
        }
        i++;
      } else {
        clearInterval(interval);
        setIsUserTurn(true); // Passer à la phase où l'utilisateur doit entrer sa séquence
        setIsSequenceVisible(false); // Cacher la séquence affichée
      }
    }, speed);
  }, [sequence, isPlaying, isSequenceVisible]);

  // Fonction appelée lors du clic sur un bouton
  const handleColorClick = (color) => {
    if (!isUserTurn) return;

    setUserSequence((prevSequence) => [...prevSequence, color]);

    // Vérification si l'utilisateur a entré la séquence correctement
    if (userSequence.length + 1 === sequence.length) {
      if (userSequence.join("") + color === sequence.join("")) {
        setMessage("Séquence correcte !");
        setTimeout(() => {
          if (round < 5) {
            setUserSequence([]);
            setIsUserTurn(false);
            setIsSequenceVisible(true);
            generateSequence(); // Générer la séquence suivante
          } else {
            setMessage("Bravo ! Vous avez complété toutes les séquences.");
            setIsPlaying(false); // Fin du jeu après 5 séquences réussies
          }
        }, 1000);
      } else {
        setMessage("Mauvaise séquence !");
        setTimeout(() => {
          setIsPlaying(false); // Fin du jeu en cas d'erreur
        }, 1000);
      }
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
            ref={(el) => (buttonRefs.current[color] = el)} // Associe chaque bouton à sa référence
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
    </div>
  );
}

const container = document.getElementById("game3");
if (container) {
  const root = createRoot(container);
  root.render(<Simon />);
} else {
  console.error("L'élément avec l'ID 'root' n'existe pas.");
}

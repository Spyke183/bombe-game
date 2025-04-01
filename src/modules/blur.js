import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const BlurOverlay = ({ message = "Mauvaise réponse... 5 sec de perdu", duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return createPortal(
    <div className="blur-overlay">
      <div className="overlay-content">{message}</div>
    </div>,
    document.body
  );
};

export default BlurOverlay;

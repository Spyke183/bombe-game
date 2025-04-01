import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const VictoryOverlay = ({ message = "Vous avez désamorcer la bombe !!!", duration = 5000, onClose }) => {
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
    <div className="victory-overlay">
      <div className="victory-content">{message}</div>
    </div>,
    document.body
  );
};

export default VictoryOverlay;

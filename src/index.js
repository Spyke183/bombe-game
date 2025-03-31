import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assurez-vous que le chemin vers votre composant App est correct

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

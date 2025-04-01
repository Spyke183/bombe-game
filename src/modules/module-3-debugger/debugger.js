import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { createRoot } from 'react-dom/client';

const scenarios = {
  "Delta-9": { override: true, systemReady: true, errorCount: 0, unlockKey: "42XY" },
  "Omega-3": { requiresReset: true, unlockKey: "42XY" },
  "Zeta-0": { specialKey: "ZX42" },
  "Sigma-7": { override: true, systemReady: true, errorCount: 2, unlockKey: "42XY" }
};

export default function DebuggerGame() {
  const [codeSysteme, setCodeSysteme] = useState("");
  const [systemReady, setSystemReady] = useState(false);
  const [override, setOverride] = useState(false);
  const [errorCount, setErrorCount] = useState(1);
  const [unlockKey, setUnlockKey] = useState("");
  const [command, setCommand] = useState("");
  const [log, setLog] = useState("Bienvenue dans le terminal du module débuggué.");
  const [launchEnabled, setLaunchEnabled] = useState(false);

  useEffect(() => {
    const keys = Object.keys(scenarios);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCodeSysteme(randomKey);
    logMessage(`Code système détecté : ${randomKey}`);
  }, []);

  useEffect(() => {
    const scenario = scenarios[codeSysteme];
    if (!scenario) return;

    const expectedKey = codeSysteme === "Zeta-0" ? "ZX42" : "42XY";

    const conditionsOK =
      (scenario.override === undefined || override === scenario.override) &&
      (scenario.systemReady === undefined || systemReady === scenario.systemReady) &&
      (scenario.errorCount === undefined || errorCount === scenario.errorCount) &&
      (scenario.requiresReset ? systemReady : true) &&
      unlockKey === expectedKey;

    setLaunchEnabled(conditionsOK);
  }, [systemReady, override, errorCount, unlockKey, codeSysteme]);

  const logMessage = (msg) => {
    setLog((prev) => `${prev}\n> ${msg}`);
  };

  const runCommand = () => {
    try {
      const func = new Function(
        "setSystemReady",
        "setOverride",
        "setErrorCount",
        "logMessage",
        command
      );
      func(setSystemReady, setOverride, setErrorCount, logMessage);
    } catch (e) {
      logMessage("❌ Erreur : " + e.message);
    }
    setCommand("");
  };

  const launch = () => {
    logMessage("🚀 MODULE LANCÉ AVEC SUCCÈS !");
  };

  return (
    <div className="p-6 font-mono text-green-400 bg-black min-h-screen">
      <h1 className="text-xl font-bold mb-4">🛠️ MODULE DEBUGGER</h1>
      <p className="mb-2">Code système : <strong>{codeSysteme}</strong></p>

      <div className="flex gap-4 mb-4">
        <div className={`px-2 py-1 rounded ${systemReady ? "bg-green-600" : "bg-red-600"}`}>
          System Ready
        </div>
        <div className={`px-2 py-1 rounded ${override ? "bg-green-600" : "bg-red-600"}`}>
          Override
        </div>
        <div className={`px-2 py-1 rounded ${errorCount === 0 ? "bg-green-600" : "bg-red-600"}`}>
          Errors: {errorCount}
        </div>
      </div>

      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Commande JS (ex: setSystemReady(true))"
        className="w-full p-2 mb-2 bg-zinc-900 text-green-300 border border-green-600"
      />
      <Button className="bg-green-500 text-black mb-4" onClick={runCommand}>
        ▶️ Exécuter
      </Button>

      <input
        type="text"
        placeholder="Clé de lancement"
        className="w-full p-2 mb-2 bg-zinc-900 text-green-300 border border-green-600"
        onChange={(e) => setUnlockKey(e.target.value)}
      />
      <Button
        disabled={!launchEnabled}
        className={`mb-4 ${launchEnabled ? "bg-green-400 text-black" : "bg-gray-600 text-white"}`}
        onClick={launch}
      >
        🚀 Lancer
      </Button>

      <pre className="bg-zinc-950 border border-green-600 p-4 h-60 overflow-y-scroll">{log}</pre>
    </div>
  );
}
// Déplacez le code de création du conteneur ici
const container = document.getElementById('game3'); // Utilisation de l'ID
if (container) {
  const root = createRoot(container);
  root.render(<DebuggerGame />); // Rendre le composant DebuggerGame ici
} else {
  console.error('L\'élément avec l\'ID "game3" n\'existe pas.');
}

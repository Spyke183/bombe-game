import React from 'react';
import TrapGame from './modules/module-1-words/words';
import WireGame from './modules/module-2-wire/wire';
import DebuggerGame from './modules/module-3-debugger/debugger';
import BombDefuser from './modules/module-5-panic/panic';

function App() {
  return (
    <div>
      <h1>Jeu de Mots</h1>
      <TrapGame />
      <WireGame />
      <DebuggerGame />
      <BombDefuser />
    </div>
  );
}

export default App; 
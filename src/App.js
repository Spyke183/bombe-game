import React from 'react';
import TrapGame from './modules/module-1-words/words';
import WireGame from './modules/module-2-wire/wire'
import BombDefuser from './modules/module-5-panic/panic';
import Simon from './modules/module-3-simon/simon';
import Blur from './modules/blur';

function App() {
  return (
    <div>
      <h1>Jeu de Mots</h1>
      <TrapGame />
      <WireGame />
      <BombDefuser />
      <Simon />
      <Blur />
    </div>
  );
}

export default App; 
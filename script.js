import { sharedState } from './shared/sharedState.js';
import { createModule as words } from './modules/module-1-words/words.js';
// import { createModule as wire } from './modules/module-2-wire/wire.js';
// import { createModule as dom } from './modules/module-3-""/"".js';
// import { createModule as puzzle } from './modules/module-4-""/"".js';
// import { createModule as chaos } from './modules/module-5-""/"".js';

const modules = [words];

modules.forEach((mod, i) => {
    const zone = document.createElement('div');
    zone.id = `module-${i}`;
    document.getElementById('game').appendChild(zone);
    mod(zone, sharedState);
  });
  

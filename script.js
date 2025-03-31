import { sharedState } from './shared/sharedState.js';
import { createModule as words } from './modules/module-1-words/words.js';
import { createModule as wire } from './modules/module-2-wire/wire.js';

// Associe chaque module à son conteneur spécifique
const moduleMapping = {
    "module-cables": wire,
    "module-words": words,
};

Object.entries(moduleMapping).forEach(([id, mod]) => {
    const zone = document.getElementById(id);
    if (zone) {
        mod(zone, sharedState);
    }
});

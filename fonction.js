// TIMER PROGRESS
let realTime = 900; //temps réel: 15 minutes
let fakeTime = 100; //faux temps affiché
let slowFactor = 1; //multiplie le ralentissement (vitesse normale = 1)
let sequence = [];
let savedFakeTime = fakeTime; //stocke le dernier temps affiché avant le ralentissement
const correctSequence = ["blue", "yellow", "red"];
let fastInterval = 300; // Réduction rapide (en millisecondes, ex: 300ms = 0.3s)
let accelTime = false; // Mode accéléré activé ou non
let timerInterval, fastTimerInterval;

function startTimer() {
    document.getElementById("module1").classList.remove("hidden");
    updateTimeDisplay();

    // Timer principal (chaque seconde)
    timerInterval = setInterval(() => {
        if (realTime > 0) {
            realTime--;

            if (!accelTime && realTime % slowFactor === 0) { 
                fakeTime--;
                console.log(`🔵 Réduction normale: -1 (tous les ${slowFactor}s)`);
            }

            updateTimeDisplay();
        } else {
            stopTimers();
            document.getElementById("result").innerText = "💥BOOM!💥 La bombe a explosé";
        }
    }, 1000); // Mise à jour toutes les 1s
}

function startFastReduction() {
    if (!fastTimerInterval) {
        fastTimerInterval = setInterval(() => {
            if (realTime > 0) {
                fakeTime--;
                console.log(`🔴 Réduction rapide: -1 toutes les ${fastInterval / 1000}s`);
                updateTimeDisplay();
            }
            if (fakeTime <= 0) {
                document.getElementById("buttonRestore").classList.remove("disabled");
                document.getElementById("buttonRestore").disabled = false;
            }
        }, fastInterval);
    }
}

function stopFastReduction() {
    accelTime = false;
    if (fastTimerInterval) {
        clearInterval(fastTimerInterval);
        fastTimerInterval = null;
    }
}

function toggleAcceleration(state) {
    accelTime = state;
    if (accelTime) {
        console.log("⚡ Mode accéléré activé");
        startFastReduction(); // Démarre la réduction rapide
    } else {
        console.log("🐢 Mode normal activé");
        stopFastReduction(); // Stoppe la réduction rapide
    }
}

function stopTimers() {
    clearInterval(timerInterval);
    stopFastReduction();
}

// Ralentir le timer si le joueur échoue
function updateTimeDisplay() {
    document.getElementById("timer").innerText = "Temps restant : " + Math.max(Math.floor(fakeTime), 0) + "s";
}

// Cacher tous les modules
function hideAllModules() {
    const modules = document.querySelectorAll('[id^="module"]');
    modules.forEach(module => {
        module.classList.add("hidden");
    });
}

//--------------MODULES----------------//

// Module: désamorcer la bombe
function checkTimer() {
    const currentTime = Math.floor(fakeTime); // Vérifie que le temps est strictement un multiple de 5
    if (currentTime % 5 === 0) {
        clearInterval(timerInterval);
        document.getElementById("result").innerText = "🎉Bombe désamorcée!🎉";
        hideAllModules();
        document.getElementById("reset-button").classList.remove("hidden");
    } else {
        document.getElementById("result").innerText = `Erreur de timing! Le temps (${currentTime}s) n'est pas un multiple de 5!`; // Mauvais timing, pénalité de temps
        slowFactor *= 2;
    }
}

// Module: trouver le bon bouton
function slowTimer(success, nextModule) {
    savedFakeTime = fakeTime; // Sauvegarde du temps avant ralentissement
    if (!success) {
        document.getElementById("result").innerText = "Mauvais choix";
        slowFactor *= 2; // Le faux temps ralentit 2 fois plus vite
    } else {
        document.getElementById("result").innerText = "Bon choix!";
        showModule(nextModule);
    }
}

// Module: suivre une séquence
function press(color) {
    sequence.push(color);
    document.getElementById("sequence-display").innerText = sequence.join(" → ");
    if (sequence.length === 3) {
        if (JSON.stringify(sequence) !== JSON.stringify(correctSequence)) {
            document.getElementById("result").innerText = "Mauvaise séquence!";
            slowFactor *= 2;
            sequence = []; // Réinitialise la séquence pour réessayer
            document.getElementById("sequence-display").innerText = "Mauvaise séquence..."
        } else {
            document.getElementById("result").innerText = "Séquence correcte!";
            sequence = [];
            document.getElementById("sequence-display").innerText = "";
            showModule('module3');
        }
    }
}

// Module: code secret
function checkCode() {
    let code = document.getElementById("codeInput").value;

    if (code !== "3589") {
        document.getElementById("result").innerText = "Mauvais code!";
        slowFactor *= 2;
        document.getElementById("codeInput").value = ""; // On vide la saisie
    } else {
        document.getElementById("result").innerText = "Code correct!";
        showModule('module4');
        activatePanicMode(); // On active le mode panique
    }
}

// Module: inutile
function activatePanicMode() {
    toggleAcceleration(true);

    document.getElementById("timer").classList.add("shake-element"); // Secoue le timer pour un effet dramatique

    document.getElementById("fake-submit").disabled = true; // Désactive le bouton désactiver pendant un laps de temps
    document.getElementById("fake-submit").classList.add("disabled");
    document.getElementById("buttonRestore").disabled = true; // Désactive le bouton de restauration
    document.getElementById("buttonRestore").classList.add("disabled");

    let waitTime = 5; // Temps d'attente en secondes
    document.getElementById("panic-message").innerText = `Système bloqué ${waitTime} secondes`;

    let waitInterval = setInterval(() => { // Active la fausse énigme
        waitTime--;
        document.getElementById("panic-message").innerText = `Système bloqué ${waitTime} secondes`;

        if (waitTime <= 0) {
            clearInterval(waitInterval);
            document.getElementById("panic-message").innerText = "Résoud l'énigme!";
            document.getElementById("fake-submit").disabled = false;
            document.getElementById("fake-submit").classList.remove("disabled");
        }
        if (fakeTime <= 0) {
            document.getElementById("buttonRestore").classList.remove("disabled");
            document.getElementById("buttonRestore").disabled = false;
        }
    }, 1000);
}

function restoreTime() {
    stopFastReduction(); // Arrête la réduction rapide
    fakeTime = 120; // Réinitialise le temps affiché
    slowFactor = 1; // Remet la vitesse normale

    document.getElementById("timer").classList.remove("shake-element");
    document.getElementById("result").innerText = "Le système s'est auto-réparé! Prépare-toi pour le désamorçage final!";
    updateTimeDisplay();
    showModule('module5'); // Affiche le module suivant

    // 🔥 Vérifie si le timer principal est déjà lancé, si ce n'est pas le cas, redémarre-le.
    if (!timerInterval) {
        startTimer(); // Redémarre le timer si nécessaire
    }
}

function showModule(moduleId) { // Montre les modules
    hideAllModules();
    document.getElementById(moduleId).classList.remove("hidden");
}

// Permet de réinitialiser le jeu
function resetGame() {
    clearInterval(timerInterval);
    realTime = 900;
    fakeTime = 900;
    slowFactor = 1;
    sequence = [];
    savedFakeTime = fakeTime;
    document.getElementById("result").innerText = "";
    document.getElementById("sequence-display").innerText = "";
    document.getElementById("codeInput").value = "";

    // Réinitialise les champs d'entrée
    if (document.getElementById("codeInput")) {
        document.getElementById("codeInput").value = "";
    }
    if (document.getElementById("fake-answer")) {
        document.getElementById("fake-answer").value = "";
    }

    // Enlève les animations
    if (document.getElementById("timer")) {
        document.getElementById("timer").classList.remove("shake-element");
    }

    // Réactive tous les boutons
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove("disabled");
    });

    startTimer(); // Redémarre le jeu
}

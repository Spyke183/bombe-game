let mode = "normal";
let timeLeft = 30; // Temps par défaut
let rules = [];
let userChoices = {};
let score = 0;
let gameInterval;

// Fonction pour choisir le mode
function setMode(selectedMode) {
    mode = selectedMode;
    if (mode === "extreme") {
        timeLeft = 10; // ⏳ Mode extrême : temps réduit à 10s
    } else {
        timeLeft = (mode === "difficile") ? 15 : 30; // ⏳ Mode difficile : temps réduit à 15s
    }
    generateRules(); // Génère de nouvelles règles selon le mode
    startTimer();
}

function getRandomIP() {
    let part1 = Math.floor(Math.random() * 256);
    let part2 = Math.floor(Math.random() * 256);
    let part3 = Math.floor(Math.random() * 256);
    let part4 = Math.floor(Math.random() * 256);
    return `${part1}.${part2}.${part3}.${part4}`;
}

function getRandomPort() {
    let commonPorts = [22, 80, 443, 3306, 8080, 21, 53, 25];
    return commonPorts[Math.floor(Math.random() * commonPorts.length)];
}

// Génération des règles selon le mode
function generateRules() {
    rules = [];
    for (let i = 0; i < (mode === "extreme" ? 8 : 5); i++) { // Plus de règles en mode extrême
        let ip = getRandomIP();
        let port = getRandomPort();
        let correctChoice = Math.random() > 0.5 ? "autoriser" : "bloquer";

        if (mode === "difficile" || mode === "extreme") {
            // Ajout de règles piégeuses (IP similaires, ports bas)
            if (ip.startsWith("192.168") && ip.endsWith(".13")) {
                correctChoice = "bloquer"; // Exemple : IP piégée
            }
            if (port < 1024) {
                correctChoice = "bloquer"; // Ports bas souvent critiques
            }
        }

        if (mode === "extreme") {
            // Règles encore plus complexes : adresses IP plus proches et choix ambigus
            if (ip.startsWith("192.168.1")) {
                correctChoice = Math.random() > 0.5 ? "bloquer" : "autoriser";
            }
            if (port === 443) {
                correctChoice = "autoriser"; // Port HTTPS par défaut
            }
        }

        rules.push({ ip, port, correct: correctChoice });
    }
    displayRules();
}

function displayRules() {
    const firewallContainer = document.getElementById("firewall-rules");
    firewallContainer.innerHTML = ''; // Clear existing rules

    rules.forEach((rule, index) => {
        const ruleDiv = document.createElement("div");
        ruleDiv.classList.add("rule");

        ruleDiv.innerHTML = `
            <span>${rule.ip}:${rule.port}</span>
            <button onclick="choose(${index}, 'autoriser')">Autoriser</button>
            <button onclick="choose(${index}, 'bloquer')">Bloquer</button>
        `;

        firewallContainer.appendChild(ruleDiv);
    });
}

function choose(index, choice) {
    userChoices[index] = choice;
}

function startTimer() {
    clearInterval(gameInterval);
    document.getElementById("timer").innerText = timeLeft;

    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            document.getElementById("result").innerText = "⏳ Temps écoulé ! Mission échouée ❌";
        }
    }, 1000);
}

// Vérification des réponses
document.getElementById("validate").addEventListener("click", () => {
    let correct = true;
    let correctCount = 0;

    rules.forEach((rule, index) => {
        if (userChoices[index] === rule.correct) {
            correctCount++;
        } else {
            correct = false;
        }
    });

    score = correctCount * 10; // 10 points par bonne réponse
    document.getElementById("score").innerText = score;
    document.getElementById("result").innerText = correct ? 
        "Bravo ! Configuration correcte ✅" : 
        "Erreur ! Vérifiez vos règles ❌";
});

// Démarrer en mode normal par défaut
setMode("normal");

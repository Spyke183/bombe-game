

//TIMER PROGRESS
let realTime = 900; //temps réel: 15 minutes
let fakeTime = 900; //faux temps affiché
let slowFactor = 1; //multiplie le ralentissement (vitese normal = 1)
let sequence = [];
let savedFakeTime = fakeTime; //stock le dernier temps affiché avant le ralentissement
let timerInterval; //stock l'intervalle du timer
const correctSequence = ["blue", "yellow", "red"];

/*timer à rebours et timer réel masqué*/
function startTimer(){
    document.getElementById("module1").classList.remove("hidden");
    updateTimeDisplay();
    timerInterval = setInterval(() => {
        if(realTime > 0){
            realTime--;

            if (realTime % slowFactor === 0) { // Réduit fakeTime moins souvent
                fakeTime--;
                console.log(slowFactor)
            }

            updateTimeDisplay();
        }else{
            clearInterval(timerInterval);
            document.getElementById("result").innerText = "💥BOOM!💥 La bombe a explosé";
        }
    }, 1000);
}




//ralentir le timer si le joueur échoue
function updateTimeDisplay(){
    document.getElementById("timer").innerText = "Temps restant : " + Math.max(fakeTime, 0) + "s";
}

//--------------MODULES----------------//

//module: désamorcer la bombe
function checkTimer(){
    clearInterval(timerInterval);
    if (fakeTime % 5 === 0){
        document.getElementById("result").innerText = "Bombe désamorcée!";
    }else{
        document.getElementById("result").innerText = "💥BOOM!💥 la bombe à explosé"
    }
}

//module: trouver le bon bouton
function slowTimer(success, nextModule){
    savedFakeTime = fakeTime; //sauvgarde du temps avant ralentissemnt
    if (!success){
        document.getElementById("result").innerText = "Mauvais choix";
        slowFactor *= 2; //le faux temps ralentit 2 foix plus vite
    }else{
        document.getElementById("result").innerText = "Bon choix!";
    }
    showModule(nextModule);
}

//module: suivre une séquence
function press(color){
    sequence.push(color);
    document.getElementById("result").innerText = "Couleur ajoutée: " + color;
    if(sequence.length === 3){
        if(JSON.stringify(sequence) !== JSON.stringify(correctSequence)){
            document.getElementById("result").innerText = "Mauvaise séquence!";
            slowFactor *= 2;
        }else{
            document.getElementById("result").innerText = "Séquence correcte!";
        }
        sequence = [];
        showModule('module3');
    }
}

//module: code secret
function checkCode(){
    let code = document.getElementById("codeInput").value;
    if (code !== "3589"){
        document.getElementById("result").innerText = "Mauvais code!"
        slowFactor *= 2;
    }else{
        document.getElementById("result").innerText = "Code correct!"
    }
    showModule('module4');
}

//module: inutile
function restoreTime(nextModule){
    fakeTime = savedFakeTime;
    slowFactor = 1;
    document.getElementById("result").innerText = "Temps restauré!";
    updateTimeDisplay();
    showModule('module5');
}

function showModule(moduleId){
    const modules = document.querySelectorAll('[id="module"]');
    modules.forEach(module => {
        module.classList.add("hidden");
    });
    document.getElementById(moduleId).classList.remove("hidden");
}


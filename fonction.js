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
    document.getElementById("timer").innerText = "Temps restant : " + Math.max(Math.floor(fakeTime), 0) + "s";
}

//cacher tous les modules
function hideAllModules(){
    const modules = document.querySelectorAll('[id^="module"]');
    modules.forEach(module => {
        module.classList.add("hidden");
    });
}
//--------------MODULES----------------//

//module: désamorcer la bombe
function checkTimer(){
    const currentTime = Math.floor(fakeTime); //vérifie que le temps et strictement un multiple de 5
    if (currentTime % 5 === 0){
        clearInterval(timerInterval);
        document.getElementById("result").innerText = "🎉Bombe désamorcée!🎉";
        hideAllModules();
        document.getElementById("reset-button").classList.remove("hidden");
    }else{
        document.getElementById("result").innerText = `Erreur de timing! Le temps (${currentTime}s) n'est pas un multiple de 5!`; //mauvais timing, pénalité de temps
        slowFactor *= 2;
    }
}

//module: trouver le bon bouton
function slowTimer(success, nextModule){
    savedFakeTime = fakeTime; //sauvgarde du temps avant ralentissemnt
    if (!success){
        document.getElementById("result").innerText = "Mauvais choix";
        slowFactor *= 2; //le faux temps ralentit 2 fois plus vite
    }else{
        document.getElementById("result").innerText = "Bon choix!";
        showModule(nextModule);
    }
}

//module: suivre une séquence
function press(color){
    sequence.push(color);
    document.getElementById("sequence-display").innerText = sequence.join(" → ");
    if(sequence.length === 3){
        if(JSON.stringify(sequence) !== JSON.stringify(correctSequence)){
            document.getElementById("result").innerText = "Mauvaise séquence!";
            slowFactor *= 2;
            sequence = []; //réinitialise la séquence pour réessayer
            document.getElementById("sequence-display").innerText = "Mauvaise séquence..."
        }else{
            document.getElementById("result").innerText = "Séquence correcte!";
            sequence = [];
            document.getElementById("sequence-display").innerText = "";
            showModule('module3');
        }
        
    }
}

//module: code secret
function checkCode(){
    let code = document.getElementById("codeInput").value;
    
    if (code !== "3589"){
        document.getElementById("result").innerText = "Mauvais code!"
        slowFactor *= 2;
        document.getElementById("codeInput").value =""; //on vide la saisie
    }else{
        document.getElementById("result").innerText = "Code correct!"
    showModule('module4');
    activatePanicMode(); //on active le mode panique
    }
}

//module: inutile
function activatePanicMode(){
    slowFactor = 5; //accélération brutale

    document.getElementById("timer").classList.add("shake-element"); //secoue le timer pour un effet dramatique 

    document.getElementById("fake-submit").disabled = true; //désactive le bouton désactiver pendant un laps de temps
    document.getElementById("fake-submit").classList.add("disabled");
    document.getElementById("buttonRestore").disabled = true; //désactive le bouton de restauration
    document.getElementById("buttonRestore").classList.add("disabled");

    let waitTime = 30; //temps d'attente en secondes
    document.getElementById("panic-message").innerText = `Système bloqué ${waitTime} secondes`;

    let waitInterval = setInterval(() => { //active la fausse énigme
        waitTime--;
        document.getElementById("panic-message").innerText = `Système bloqué ${waitTime} secondes`;

        let attempts = 0; //ajout d'un compteur de tentatives

        if (waitTime <= 0) {
            clearInterval(waitInterval);
            document.getElementById("panic-message").innerText = "Résoud l'énigme!"
            document.getElementById("fake-submit").disabled = false;
            document.getElementById("fake-submit").classList.remove("disabled");

            //ajoute un gestionnaire d'évènement si aucun n'existe déja
            if(!document.getElementById("fake-submit").hasAttribute("listener")){
                document.getElementById("fake-submit").setAttribute("listener", "true");
                document.getElementById("fake-submit").addEventListener("click", function(){ 
                    attempts++;
                    document.getElementById("fake-submit").disabled = true;
                    document.getElementById("fake-submit").innerText = "Traitement...";
                    document.getElementById("panic-message").innerText = "Vérification de la réponse...";

        setTimeout(() => {//fait semblant d'analyser pendant un laps de temps
            document.getElementById("panic-message").innerText = "Réponse incorrecte!"; 
            document.getElementById("fake-submit").disabled = false;
            document.getElementById("fake-submit").innerText = "Valider";
        
        if(attempts >= 4){ //active le bouton de restauration
            document.getElementById("buttonRestore").disabled = false;
            document.getElementById("buttonRestore").classList.remove("disabled");
            document.getElementById("panic-message").innerText = "ALERTE CRITIQUE! Utilise le bouton désactivé maintenant!";
        }

        if (attempts >= 5)
            setTimeout(() => { //apres quelques tentatives, restauré automatiquement
                document.getElementById("buttonRestore").disabled = true;
                restoreTime();
            }, 15000); //15 secondes de panique totale
        },3000);   
        });
        }
    }
    }, 1000);
}

function restoreTime(){
    fakeTime = 120; //on réinitialise le compte à rebours à 2 minutes
    slowFactor = 1; //avec une seconde d'intervale

    document.getElementById("timer").classList.remove("shake-element"); //restaure l'affiche normal

    document.getElementById("result").innerText = "le système s'est auto-réparé! prépare toi pour le désamorçage final!";
    updateTimeDisplay();
    showModule('module5'); //passe au module final
}

function showModule(moduleId){ //montre les modules
    hideAllModules();
    document.getElementById(moduleId).classList.remove("hidden");
}

//permet de réinitialiser le jeu
function resetGame(){
    clearInterval(timerInterval);
    realTime = 900;
    fakeTime = 900;
    slowFactor = 1;
    sequence = [];
    savedFakeTime = fakeTime;
    document.getElementById("result").innerText = "";
    document.getElementById("sequence-display").innerText = "";
    document.getElementById("codeInput").value = "";

    //réinitialise les champs d'entrée
    if(document.getElementById("codeInput")){ 
        document.getElementById("codeInput").value = "";
    }
    if(document.getElementById("fake-answer")){
        document.getElementById("fake-answer").value = "";
    }

    //enlève les animations
    if(document.getElementById("timer")){
        document.getElementById("timer").classList.remove("shake-element");
    }

    //réacive tous les boutons
    const buttons = document.querySelectorAll("button"); 
    buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove("disabled");
    });

    startTimer(); //redémarre le jeu
}
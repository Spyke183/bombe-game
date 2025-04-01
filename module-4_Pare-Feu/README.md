# P.1 Règles du Jeu

# 🎯 Objectif : Désamorcer une menace en configurant correctement le pare-feu.
L’Équipe A (le joueur) voit une liste d’adresses IP et de ports.
L’Équipe B (hors écran) a un manuel contenant les règles pour savoir si chaque IP doit être bloquée ou autorisée.
L’Équipe A doit interroger l’équipe B, puis prendre des décisions en cliquant sur "Autoriser" ou "Bloquer".
# Score : +10 points par bonne réponse en Mode Normal ; +15 points par bonne réponse en Mode Difficile ; +20 points par bonne réponse en Mode Expert ; - points
# Temps : ⏳ Mode Normal = 30 secondes ; Mode Difficile = 15 secondes ; Mode = Expert = 10 secondes ===> Sinon échec.


# P.2 Déroulement d’une Partie


# Étape 1 : Démarrer 
Le jeu génère 5 IP et ports aléatoires.

# Étape 2 : Résolution de l'Énigme
L’Équipe A voit les adresses IP et doit poser des questions à l’Équipe B.
L’Équipe B lit les règles (exemple : "Toute IP commençant par 192.168 est sûre sauf .13").
L’Équipe A clique sur "Autoriser" ou "Bloquer" pour chaque IP.

# Étape 3 : Validation : Clique sur "Valider" pour soumettre tes réponses.
Si toutes les réponses sont bonnes ➡️ 🎉 "Bravo ! Configuration correcte ✅".
Si une ou plusieurs sont fausses ➡️ ❌ "Erreur ! Vérifiez vos règles".
Si le temps expire ➡️ ⏳ "Temps écoulé ! Mission échouée".


# P.3 Règles Piégeuses en Mode Difficile

IP proches mais une seule est mauvaise (ex: 192.168.1.12 ✔️ mais 192.168.1.13 ❌).
Ports inférieurs à 1024 = interdits, sauf exceptions.
Changement aléatoire des bonnes réponses pour piéger les joueurs.


# P.4 Règles Piégeuses et Complexes en Mode Extrême

# 8 règles à gérer :
Augmenter le nombre de règles pour rendre le mode plus difficile. IP très proches mais avec des décisions ambiguës (par exemple, 192.168.1.1 vs 192.168.1.2).
# Ports critiques :
Certains ports peuvent sembler sûrs mais ne le sont pas (comme 443 pour HTTPS, qui pourrait être bloqué). Changements rapides dans les réponses pour tester la rapidité des décisions.

# P.4 Exemples de Parties

✅ Exemple de Bonne Configuration

IP/Port	Action prise	Correcte ?
192.168.1.5:8080	Autoriser	✅
192.168.1.13:443	Bloquer	✅
10.0.0.45:22	Bloquer	✅
172.16.0.8:3306	Autoriser	✅
Score obtenu : 40 points 🎯		


❌ Exemple d'Échec

IP/Port	Action prise	Correcte ?
192.168.1.5:8080	Bloquer	❌
192.168.1.13:443	Autoriser	❌
10.0.0.45:22	Bloquer	✅
172.16.0.8:3306	Autoriser	✅
Score obtenu : 20 points 🚨		


# 🚀 Résultat Final avec le Mode :

# Mode Normal 🟢
Temps : 30 secondes
Règles : Simples.
Score : Standard.

# Mode Difficile 🔴
Temps : 15 secondes
Règles : IP similaires, ports critiques.
Score : Augmenté pour la difficulté.

# Mode Extrême 🔥
Temps : 10 secondes
Règles : 8 règles à gérer; IP très proches avec choix ambiguës; Ports complexes (ex : HTTPS, ports critiques); Décisions ultra-rapides.
Score : Basé sur la rapidité, la précision et la complexité des choix.
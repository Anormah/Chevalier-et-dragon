'use strict';   // Mode strict du JavaScript
/*************************************************************************************************/
/* **************************************** DONNEES JEU **************************************** */
/*************************************************************************************************/
let difficulty = "";
let playerHealth = 0;
let dragonHealth = 0;
let initialPlayerHealth = 0; // Ajout de la variable pour stocker les points de vie initiaux du joueur
let initialDragonHealth = 0; // Ajout de la variable pour stocker les points de vie initiaux du dragon
let gameRound = 1;


/*************************************************************************************************/
/* *************************************** FONCTIONS JEU *************************************** */
/*************************************************************************************************/
function chooseDifficulty() {
    // Prompt the user to choose the difficulty level
    return requestInteger("Choisissez la difficulté du level: \n1-facile \n2-normal \n3-difficile", 1, 3);
}

function getInitialHealth(difficulty, character) {
    let health = 0;

    if (difficulty === 1) {
        if (character === "dragon") {
            health = 100 + throwDices(5, 10);
        } else {
            health = 100 + throwDices(10, 10);
        }
    } else if (difficulty === 2) {
        health = 100 + throwDices(10, 10);
    } else if (difficulty === 3) {
        if (character === "dragon") {
            health = 100 + throwDices(10, 10);
        } else {
            health = 100 + throwDices(7, 10);
        }
    } else {
        console.error("Invalid difficulty level");
    }

    return health;
}

function initiative() {
    let playerInitiative = throwDices(10, 6);
    let dragonInitiative = throwDices(10, 6);

    if (playerInitiative > dragonInitiative) {
        characterAttack("player");
    } else if (dragonInitiative > playerInitiative) {
        characterAttack("dragon");
    }
}

function characterAttack(character) {
    let playerDamage = 0;
    let dragonDamage = 0;
    let damage = 0;

    if (character === "dragon") {
        dragonDamage = throwDices(3, 6);
        if (difficulty === 1) {
            dragonDamage -= Math.floor(dragonDamage * throwDices(2, 6) / 100);
        } else if (difficulty === 3) {
            dragonDamage += Math.floor(dragonDamage * throwDices(1, 6) / 100);
        }
        playerHealth -= dragonDamage;
        damage = dragonDamage;
    } else if (character === "player") {
        playerDamage = throwDices(3, 6);
        if (difficulty === 1) {
            playerDamage += Math.floor(playerDamage * throwDices(2, 6) / 100);
        } else if (difficulty === 3) {
            playerDamage -= Math.floor(playerDamage * throwDices(1, 6) / 100);
        }
        dragonHealth -= playerDamage;
        damage = playerDamage;
    }

    displayGameJournal(character, damage);
}

function displayGameJournal(attacker, damage) {
    document.write(`<h3>Tour n°${gameRound}</h3>`);
    document.write(`<figure class="game-round">`);
    if (attacker === "player") {
        document.write(`<img src="images/knight-winner.png" alt="Chevalier vainqueur">`);
        document.write(`<figcaption>Vous êtes le plus rapide, vous attaquez le dragon et lui infligez ${damage} points de dommage !</figcaption>`);
    } else {
        document.write(`<img src="images/dragon-winner.png" alt="Dragon vainqueur">`);
        document.write(`<figcaption>Le dragon prend l'initiative, vous attaque et vous inflige ${damage} points de dommage !</figcaption>`);
    }
    document.write(`</figure>`);
    document.write(`<!-- Etat du jeu -->`);
    document.write(`<div class="game-state">`);
    document.write(`<figure class="game-state_player">`);
    if (playerHealth > 0) {
        if (playerHealth < initialPlayerHealth * 0.30) { // Utilisation des points de vie initiaux
            document.write(`<img src="images/knight-wounded.png" alt="Chevalier">`);
            document.write(`<figcaption><progress max="${initialPlayerHealth}" value="${playerHealth}"> </progress> ${playerHealth} PV</figcaption>`);
        } else if (dragonHealth <= 0) {
            document.write(`<img src="images/knight-winner.png" alt="Chevalier">`);
            document.write(`<figcaption><progress max="${initialPlayerHealth}" value="${playerHealth}"> </progress> ${playerHealth} PV</figcaption>`);
        } else {
            document.write(`<img src="images/knight.png" alt="Chevalier">`);
            document.write(`<figcaption><progress max="${initialPlayerHealth}" value="${playerHealth}"> </progress> ${playerHealth} PV</figcaption>`);
        }
    } else {
        document.write(`<img src="images/knight-wounded.png" alt="Chevalier">`);
        document.write(`<figcaption>Game Over</figcaption>`);
    }
    document.write(`</figure>`);
    document.write(`<figure class="game-state_player">`);
    if (dragonHealth > 0) {
        if (dragonHealth < initialDragonHealth * 0.30) { // Utilisation des points de vie initiaux
            document.write(`<img src="images/dragon-wounded.png" alt="Dragon">`);
            document.write(`<figcaption><progress max="${initialDragonHealth}" value="${dragonHealth}"> </progress> ${dragonHealth} PV</figcaption>`);
        } else if (playerHealth <= 0) {
            document.write(`<img src="images/dragon-winner.png" alt="Dragon">`);
            document.write(`<figcaption><progress max="${initialDragonHealth}" value="${dragonHealth}"> </progress> ${dragonHealth} PV</figcaption>`);
        } else {
            document.write(`<img src="images/dragon.png" alt="Dragon">`);
            document.write(`<figcaption><progress max="${initialDragonHealth}" value="${dragonHealth}"> </progress> ${dragonHealth} PV</figcaption>`);
        }
    } else {
        document.write(`<img src="images/dragon-wounded.png" alt="Dragon">`);
        document.write(`<figcaption>Game Over</figcaption>`);
    }
    document.write(`</figure>`);
    document.write(`</div>`);
    gameRound++;
}

function endGame() {
    if (playerHealth <= 0) {
        document.write(`
        <footer>
            <h3>Fin de la partie</h3>
            <figure class="game-end">
                <figcaption>Vous avez perdu le combat, le dragon vous a carbonisé !</figcaption>
                <img src="images/dragon-winner.png" alt="Dragon vainqueur">
            </figure>
        </footer>
        `);
    } else {
        document.write(`
        <footer>
            <h3>Fin de la partie</h3>
            <figure class="game-end">
                <figcaption>Vous avez vaincu le dragon, vous êtes un véritable chevalier !</figcaption>
                <img src="images/knight-winner.png" alt="Chevalier vainqueur">
            </figure>
        </footer>
        `);
    }
}

/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/
function main() {
    difficulty = chooseDifficulty();
    console.log(`Niveau de difficulté choisi: ${difficulty}`);
    initialDragonHealth = getInitialHealth(difficulty, "dragon");
    dragonHealth = initialDragonHealth; // Stockage des points de vie initiaux
    initialPlayerHealth = getInitialHealth(difficulty, "player");
    playerHealth = initialPlayerHealth; // Stockage des points de vie initiaux

    while (playerHealth > 0 && dragonHealth > 0) {
        initiative();
    }

    endGame();
}

main();

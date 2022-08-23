// Different parts of core gameplay functionality are all defined as parameters of its associated object. The object reference is then imported below and
//      passed down to any function that requires it.
import alienFun from "./functionality/alien.js";
import barrierFun from "./functionality/barrier.js";
import playerFun from "./functionality/player.js";
import projectileFun from "./functionality/projectile.js";


// Game functionality - tracks the current round, score, high score and provides the mechanisms to start a new game,
//      start the next round and end the game.
let gameFun = {
    currentRound: 0,
    playerScore: 0,
    highScore: 0,


    // Starts a new game, hiding the start div and game-over div using a css class, and showing the game div by removing said class.
    //      Alien speed, alien fire rate, alien movement direction, score, round and  lives remaining are all reset. The function also spawns the player,
    //      the aliens and the barriers, then sets the intervals used to cause aliens and projectiles to move, as well controlling how aliens fire.
    startGame: function() {
        document.getElementById("start-screen").classList.add("hidden");
        document.getElementById("game-screen").classList.remove("hidden");
        document.getElementById("game-over-screen").classList.add("hidden");
    
        alienFun.speed = alienFun.baseSpeed;
        alienFun.fireRate = alienFun.baseFireRate;
        alienFun.direction = "right";
    
        playerFun.livesRemaining = 3;
        gameFun.currentRound = 0;
        gameFun.playerScore = 0;

        playerFun.setLives()
        document.getElementById("score").textContent = gameFun.playerScore;
        document.getElementById("high-score").textContent = gameFun.highScore;
    
        playerFun.spawnPlayer();
        barrierFun.spawnAllBarriers();
        alienFun.spawnNewAliens();
    
        alienFun.movementInterval = setInterval(() => {alienFun.moveAllAliens(barrierFun, gameFun)}, alienFun.speed);
        projectileFun.movementInterval = setInterval(() => {projectileFun.moveAllProjectiles(alienFun, barrierFun, gameFun, playerFun)}, projectileFun.speed);
        alienFun.launchProjectileInterval = setInterval(() => {alienFun.aliensLaunchProjectiles()}, alienFun.fireRate);
    },


    // Starts the next round, incrementing the currentRound property, resetting the alien movement direction, increasing how frequently aliens move and fire
    //      (up to the difficulty limit at round 5). All projectiles are removed, alien and projectile intervals are temporarily cleared, then after a
    //      one second pause, new aliens are spawned and the relevant alien and projectile intervals are set.
    startNextRound: function() {
        gameFun.currentRound++;
        alienFun.direction = "right";
        if (this.currentRound < 4) {
            alienFun.speed = alienFun.baseSpeed - (300 * gameFun.currentRound);
            alienFun.fireRate = alienFun.baseFireRate - (400 * gameFun.currentRound);
        } else {
            alienFun.speed = 600;
            alienFun.fireRate = 800;
        }
        projectileFun.removeAllProjectiles();
        clearInterval(alienFun.movementInterval);
        clearInterval(projectileFun.movementInterval);
        clearInterval(alienFun.launchProjectileInterval);
        setTimeout(() => {
            alienFun.spawnNewAliens();
            alienFun.movementInterval = setInterval(() => {alienFun.moveAllAliens(barrierFun, gameFun)}, alienFun.speed);
            projectileFun.movementInterval = setInterval(() => {projectileFun.moveAllProjectiles(alienFun, barrierFun, gameFun, playerFun)}, projectileFun.speed);
            alienFun.launchProjectileInterval = setInterval(() => {alienFun.aliensLaunchProjectiles()}, alienFun.fireRate);
        }, 1000);
    },


    // Checks if an alien has successfully reached the player, causing game over.
    checkForGameOver: function(alienId) {
        const alienRef = document.getElementById(alienId);
        const playerRef = document.getElementById("player");
        if (parseInt(alienRef.style.gridRowEnd) > parseInt(playerRef.style.gridRowStart)) {
            return true;
        } else {
            return false;
        }
    },

    // Triggers game over, hiding the game div and showing the game-over div, displaying the players score. The player and all aliens, barriers, projectiles
    //      are removed, all intervals are cleared and event listeners are removed.
    gameOver: function() {
        document.getElementById("final-score").textContent = gameFun.playerScore;
        document.getElementById("game-screen").classList.add("hidden");
        document.getElementById("game-over-screen").classList.remove("hidden");
        document.getElementById("player").remove();
        alienFun.removeAllAliens();
        barrierFun.removeAllBarriers();
        projectileFun.removeAllProjectiles();
    
        clearInterval(alienFun.movementInterval);
        clearInterval(projectileFun.movementInterval);
        clearInterval(alienFun.launchProjectileInterval);
        clearInterval(playerFun.moveLeftInterval);
        clearInterval(playerFun.moveRightInterval);
        clearInterval(playerFun.launchProjectileInterval);
        document.removeEventListener("keydown", playerFun.playerKeyDown);
        document.removeEventListener("keyup", playerFun.playerKeyUp);
    }
};


// Adds event listeners to the Play and Play Again buttons which execute the startGame function when clicked.
Array.from(document.getElementsByClassName("start-button")).map(button => button.addEventListener("click", gameFun.startGame));
// Player functionality - the funcitonality for spawning the player, controlling the player, exploding the player and respawning the player.
let playerFun = {
    livesRemaining: 3,
    moveLeftInterval: null,
    moveRightInterval: null,
    launchProjectileInterval: null,
    launcherCooldown: false,


    // Spawns the player as a 4x3rem img element on the #game-grid div, then sets up the player controls.
    spawnPlayer: function() {
        document.getElementById("game-grid").innerHTML += `<img
            id="player"
            src="./images/playership.png"
            style="
                grid-column-start: 48;
                grid-column-end: 52;
                grid-row-start: 60;
                grid-row-end: 63;
            "
        />`;
        this.setupPlayerControls();
    },


    // Adds two event listeners to the document, one which executes on keydown, one which executes on key up.
    setupPlayerControls: function() {
        document.addEventListener("keydown", this.playerKeyDown);
        document.addEventListener("keyup", this.playerKeyUp);
    },


    // Whenever a key is pressed down, if it is the ArrowLeft or ArrowRight key, the player moves in that direction and then an interval is set to
    //      move the player in that direction every 80 milliseconds. If the spacebar is pressed, the player launches a projectile and an interval is set to
    //      launch a projectile every 600 milliseconds. This prevents any movement bugs caused by the player holding down multiple keys at once.
    playerKeyDown: function(e) {
        switch(e.code) {
            case "ArrowLeft":
                if (!playerFun.moveLeftInterval) {
                    playerFun.movePlayer("left");
                    playerFun.moveLeftInterval = setInterval(() => {playerFun.movePlayer("left");}, 80);
                }
                break;
            case "ArrowRight":
                if (!playerFun.moveRightInterval) {
                    playerFun.movePlayer("right");
                    playerFun.moveRightInterval = setInterval(() => {playerFun.movePlayer("right");}, 80);
                }
                break;
            case "Space":
                if (!playerFun.launchProjectileInterval) {
                    playerFun.launchProjectile();
                    playerFun.launchProjectileInterval = setInterval(() => {playerFun.launchProjectile();}, 600);
                }
                break;
        }
    },


    // Whenever the ArrowLeft, ArrowRight or Space key is released, the associated interval is cleared and set to null.
    playerKeyUp: function(e) {
        switch(e.code) {
            case "ArrowLeft":
                clearInterval(playerFun.moveLeftInterval);
                playerFun.moveLeftInterval = null;
                break;
            case "ArrowRight":
                clearInterval(playerFun.moveRightInterval);
                playerFun.moveRightInterval = null;
                break;
            case "Space":
                clearInterval(playerFun.launchProjectileInterval);
                playerFun.launchProjectileInterval = null;
                break;
        }
    },


    // Spawns a single projectile at the center of the player, if the launcherCooldown property is false. After launching a projectile, the launcher
    //      cooldown is set to true, then set to false after 500 milliseconds. This prevents the player from button mashing spacebar to fire many
    //      projectiles.
    launchProjectile: function() {
        if (!this.launcherCooldown) {
            const playerRef = document.getElementById("player");
            document.getElementById("game-grid").innerHTML += `<div
                    class="projectile player-projectile"
                    style="
                        grid-column-start: ${parseInt(playerRef.style.gridColumnStart) + 2};
                        grid-column-end: ${parseInt(playerRef.style.gridColumnStart) + 2};
                        grid-row-start: ${parseInt(playerRef.style.gridRowStart) };
                        grid-row-end: ${parseInt(playerRef.style.gridRowStart) };
                    "
                ></div>`;
            this.launcherCooldown = true;
            setTimeout(() => this.launcherCooldown = false, 500);
        }
    },


    // Changes the number of img elements in the lives div to be equal to the number of lives remaining.
    setLives: function() {
        const lifeSprite = `<img class="life" src="./images/playership.png"/>`;
        let lifeSprites = "";
        for (let i=0; i < this.livesRemaining; i++) {
            lifeSprites += lifeSprite;
        }
        document.getElementById("lives").innerHTML = lifeSprites;
    },


    // Moves the player in the given direction.
    movePlayer: function(direction) {
        if (document.getElementById("player")) {
            const playerRef = document.getElementById("player");
            if (direction === "left") {
                if (parseInt(playerRef.style.gridColumnStart) - 2 > 0) {
                    playerRef.style.gridColumnStart = parseInt(playerRef.style.gridColumnStart) - 2;
                    playerRef.style.gridColumnEnd = parseInt(playerRef.style.gridColumnEnd) - 2;
                }
            } else if (direction === "right") {
                if (parseInt(playerRef.style.gridColumnEnd) + 2 < 100) {
                    playerRef.style.gridColumnStart = parseInt(playerRef.style.gridColumnStart) + 2;
                    playerRef.style.gridColumnEnd = parseInt(playerRef.style.gridColumnEnd) + 2;
                } 
            }
        }
    },


    // Called when after the player is hit by an alien projectile. If the player has any lives remaining, the player respawns. Otherwise, it is game over.
    playerHit: function(alienFun, barrierFun, gameFun, projectileFun) {
        if (this.livesRemaining > 0) {
            this.respawnPlayer(alienFun, barrierFun, gameFun, projectileFun);
        } else {
            gameFun.gameOver();
        }
    },


    // Clears all intervals, removes the event listeners used to control the player and then exploes the player. After a one second pause, all projectiles
    //      are removed, the player loses a life, respawns and the alien and projectile intervals are set.
    respawnPlayer: function(alienFun, barrierFun, gameFun, projectileFun) {
        clearInterval(alienFun.movementInterval);
        clearInterval(projectileFun.movementInterval);
        clearInterval(alienFun.launchProjectileInterval);
        clearInterval(this.moveLeftInterval);
        clearInterval(this.moveRightInterval);
        clearInterval(this.launchProjectileInterval);
        document.removeEventListener("keydown", this.playerKeyDown);
        document.removeEventListener("keyup", this.playerKeyUp);
        this.explodePlayer();
        setTimeout(() => {
            projectileFun.removeAllProjectiles();
            this.livesRemaining -= 1;
            this.setLives();
            this.spawnPlayer();
            alienFun.movementInterval = setInterval(() => {alienFun.moveAllAliens(barrierFun, gameFun)}, alienFun.speed);
            projectileFun.movementInterval = setInterval(() => {projectileFun.moveAllProjectiles(alienFun, barrierFun, gameFun, this)}, projectileFun.speed);
            alienFun.launchProjectileInterval = setInterval(() => {alienFun.aliensLaunchProjectiles()}, alienFun.fireRate);
        }, 1000);
    },


    // Replaces the current player image and style with that of an explosion. After 300 milliseconds, the element is removed.
    explodePlayer: function() {
        document.getElementById("player").classList.add("explosion");
        document.getElementById("player").src = "./images/explosion.png";
        setTimeout(() => {
            document.getElementById("player").remove();
        }, 1000);
    },
};

export default playerFun;
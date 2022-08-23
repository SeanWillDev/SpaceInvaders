// Alien functionality - the functionality for spawning aliens, moving aliens, causing aliens to fire and causing aliens to explode.
let alienFun = {
    direction: "right",
    movementDistance: 2,
    movementInterval: null,
    baseSpeed: 1500,
    speed: 1500,
    launchProjectileInterval: null,
    baseFireRate: 2000,
    fireRate: 2000,


    // Spawns 5 rows of 12 aliens, by using loops and the alienFun.spawnAlien() function/property.
    spawnNewAliens: function() {
        let count = 1;
        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= 12; col++) {
                alienFun.spawnAlien(count, row, col);
                count++;
            }
        }
    },


    // Spawn a 4x3rem alien within the #game-grid div, within the specified grid-columns/grid-rows.
    spawnAlien: function(alienNo, alienRow, alienCol) {
        document.getElementById("game-grid").innerHTML +=  `<img
            id="alien-${alienNo}"
            class="alien ${alienRow}"
            src="./images/alien.png"
            style="
                grid-column-start: ${6*alienCol - 4};
                grid-column-end: ${6*alienCol};
                grid-row-start: ${5*alienRow - 3};
                grid-row-end: ${5*alienRow};
            "
        />`;

    },


    // Moves all aliens. It maps through the aliens to check if there is a wall stopping them from moving. If any aliens would collide with a wall,
    //      all aliens the movement direction changes, alien movement frequency increases (up to a limit) and all aliens descend. Otherwise, all aliens move
    //      in the direction specified by the alienFun.direction property. After each alien moves, gameFun.checkForGameOver() checks if the alien has reached
    //      the player (which would trigger game over), then barrerFun.checkForContact() checks if the alien has reached the barrier (which would damage the
    //      barrier).
    moveAllAliens: function(barrierFun, gameFun) {
        const aliens = document.getElementsByClassName("alien");
        let descend = false;
        let isGameOver = false;

        Array.from(aliens).map(alien => {
            if (this.checkForWall(alien.getAttribute("id"))) {
                descend = true;
            }
        })

        if (descend === true) {
            this.direction = this.direction === "right" ? "left" : "right";
            clearInterval(this.movementInterval);
            if (this.speed > 800) {
                this.speed = this.speed - 200;
            } else {
                this.speed = 600;
            }
            this.movementInterval = setInterval(() => {this.moveAllAliens(barrierFun, gameFun)}, this.speed);
        }

        Array.from(aliens).map(alien => {
            const currentAlienId = alien.getAttribute("id");
            this.moveAlien(currentAlienId, descend);
            if(gameFun.checkForGameOver(currentAlienId)) {
                isGameOver = true;
            }
            barrierFun.checkForContact(currentAlienId);
        })

        descend = false;

        if (isGameOver === true) {
            gameFun.gameOver();
        }
    },


    //  Check whether an alien would clip outside of the #game-grid div based on the aliens current position, the direction property and the
    //      movementDistance property.
    checkForWall: function(alienId) {
        const alienRef = document.getElementById(alienId);

        if (this.direction === "right") {
            if (parseInt(alienRef.style.gridColumnEnd) + this.movementDistance > 100) {
                return true;
            } else {
                return false;
            }
        } else if (this.direction === "left") {
            if (parseInt(alienRef.style.gridColumnStart) - this.movementDistance < this.movementDistance) {
                return true;
            } else {
                return false;
            }
        }
    },


    // Moves a single alien either downwards, left or right.
    moveAlien: function(alienId, descend) {
        const alienRef = document.getElementById(alienId);

        if (descend === true) {
            alienRef.style.gridRowStart = parseInt(alienRef.style.gridRowStart) + 5;
            alienRef.style.gridRowEnd = parseInt(alienRef.style.gridRowEnd) + 5;
        } else if (this.direction === "right") {
            alienRef.style.gridColumnStart = parseInt(alienRef.style.gridColumnStart) + this.movementDistance;
            alienRef.style.gridColumnEnd = parseInt(alienRef.style.gridColumnEnd) + this.movementDistance;
        } else if (this.direction === "left") {
            alienRef.style.gridColumnStart = parseInt(alienRef.style.gridColumnStart) - this.movementDistance;
            alienRef.style.gridColumnEnd = parseInt(alienRef.style.gridColumnEnd) - this.movementDistance;
        }   
    },


    // Maps through all aliens, each alien having a 1 in 20 chance to launch a projectile.
    aliensLaunchProjectiles: function() {
        const aliens = document.getElementsByClassName("alien");
        Array.from(aliens).map(alien => {
            if (Math.floor(Math.random() * 20) === 0) {
                this.launchProjectile(alien.getAttribute("id"));
            }
        })
    },
    

    // Spawns a single projectile below the center of the alien that fired it.
    launchProjectile: function(alienId) {
        const alienRef = document.getElementById(alienId);
        document.getElementById("game-grid").innerHTML += `<div
                class="projectile alien-projectile"
                style="
                    grid-column-start: ${parseInt(alienRef.style.gridColumnStart) + 2};
                    grid-column-end: ${parseInt(alienRef.style.gridColumnStart) + 2};
                    grid-row-start: ${parseInt(alienRef.style.gridRowStart) + 5};
                    grid-row-end: ${parseInt(alienRef.style.gridRowStart) + 5};
                "
            ></div>`;
    },


    // Maps through all aliens and removes each one.
    removeAllAliens: function() {
        Array.from(document.getElementsByClassName("alien")).map(alien => alien.remove());
    },


    // Replaces the current aliens image and style with that of an explosion. After 300 milliseconds, the element is removed. A function is then run to
    //      check how many aliens remain.
    explodeAlien: function(alienId, gameFun) {
        document.getElementById(alienId).classList.add("explosion");
        document.getElementById(alienId).src = "./images/explosion.png";
        setTimeout(() => {
            if(document.getElementById(alienId)) {
                document.getElementById(alienId).remove();
                this.checkRemainingAliens(gameFun);
            }
        }, 300)
    },


    // Checks the number of remaining aliens. If there are no aliens left, the next round is started, spawning more aliens.
    checkRemainingAliens: function(gameFun) {
        const aliens = document.getElementsByClassName("alien");
        if (Array.from(aliens).length === 0) {
            gameFun.startNextRound();
        }
    }
};

export default alienFun;
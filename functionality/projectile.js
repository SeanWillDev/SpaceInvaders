// Projectile functionality - the functionality for moving projectiles, removing projectiles and checking if a projectile has hit a barrier, an alien or
//      the player.

let projectileFun = {
    speed: 50,
    movementInterval: null,


    // Maps through all projectiles, first checking whether the projectile has hit a barrier. Then, an if statement verifies the projectile was fired by
    //      the player or an alien. If the player launched the projectile and the projectile would not move past the top of the #game-grid, then the
    //      projectile moves upwards and checks are run to determine whether or not it has hit a barrier or an alien. If an alien launched the projectile
    //      and the projectile would not move past the bottom of the #game-grid, the projectile moves downwards and checks are run to determine whether or
    //      not it has hit a barrier or the player. Any projectiles that would move outside the #game-grid are removed.
    moveAllProjectiles: function(alienFun, barrierFun, gameFun, playerFun) {
        Array.from(document.getElementsByClassName("projectile")).map(projectile => {
            this.checkForBarrierHit(projectile);
            if(projectile.classList.contains("player-projectile")) {
                if(parseInt(projectile.style.gridRowStart) - 2 > 0) {
                    projectile.style.gridRowStart = parseInt(projectile.style.gridRowStart) - 2;
                    projectile.style.gridRowEnd = parseInt(projectile.style.gridRowEnd) - 2;
                    this.checkForAlienHit(projectile, alienFun, gameFun);
                } else {
                    projectile.remove();
                }
            } else if(projectile.classList.contains("alien-projectile")) {
                if (parseInt(projectile.style.gridRowStart) + 2 < 100) {
                    projectile.style.gridRowStart = parseInt(projectile.style.gridRowStart) + 2;
                    projectile.style.gridRowEnd = parseInt(projectile.style.gridRowEnd) + 2;
                    this.checkForPlayerHit(projectile, alienFun, barrierFun, gameFun, playerFun);
                } else {
                    projectile.remove();
                }
            }
        })
    },


    // Checks if a projectile has made contact with a barrier. If it has, the barrier div element and the projectile are removed.
    checkForBarrierHit: function(anyProjectile) {
        Array.from(document.getElementsByClassName("barrier")).map(barrier => {
            if (this.checkColumnOverlap(barrier, anyProjectile) && this.checkRowOverlap(barrier, anyProjectile)) {
                barrier.remove();
                anyProjectile.remove();
            }
        })
    },


    // Checks if a projectile has made contact with an alien. If it has, the alien explodes and the player gains points based on what "row" the alien
    //      spawned on and the projectile is removed. If the current score is now higher than the highscore, the new high score is set as the current
    //      score.
    checkForAlienHit: function(playerProjectile, alienFun, gameFun) {
        Array.from(document.getElementsByClassName("alien")).map(alien => {
            if (this.checkColumnOverlap(alien, playerProjectile) && this.checkRowOverlap(alien, playerProjectile)) {
                alienFun.explodeAlien(alien.id, gameFun);
                playerProjectile.remove();
                if (alien.classList.contains("row-1")) {
                    gameFun.playerScore += 50;
                } else if (alien.classList.contains("row-2")) {
                    gameFun.playerScore += 40;
                } else if (alien.classList.contains("row-3")) {
                    gameFun.playerScore += 30;
                } else if (alien.classList.contains("row-4")) {
                    gameFun.playerScore += 20;
                } else if (alien.classList.contains("row-5")) {
                    gameFun.playerScore += 10;
                }
                document.getElementById("score").textContent = gameFun.playerScore;
                if (gameFun.playerScore > gameFun.highScore) {
                    gameFun.highScore = gameFun.playerScore;
                    document.getElementById("high-score").textContent = gameFun.highScore;
                }
            }
        })
    },


    // Checks if a projectile has made contact with the player. If it has, the projectile is removed and the playerFun.playerHit() property/function is
    //      called.
    checkForPlayerHit: function(alienProjectile, alienFun, barrierFun, gameFun, playerFun) {
        const playerRef = document.getElementById("player");
        if (this.checkColumnOverlap(playerRef, alienProjectile) && this.checkRowOverlap(player, alienProjectile)) {
            alienProjectile.remove();
            playerFun.playerHit(alienFun, barrierFun, gameFun, this);
        }
    },


    // Checks whether a character and a projectile occupy the same column. If checkColumnOverlap and checkRowOverlap both return true, then there has
    //      been a collision.
    checkColumnOverlap : function(characterRef, projectileRef) {
        if (!characterRef || !projectileRef) {
            return false;
        } else {
            const characterColumnStart = parseInt(characterRef.style.gridColumnStart);
            const characterColumnEnd = parseInt(characterRef.style.gridColumnEnd);
            const projectileColumn = parseInt(projectileRef.style.gridColumnStart);
            let columnOverlap = false;
            if (characterColumnStart <= projectileColumn) {
                if (characterColumnEnd >= projectileColumn) {
                    columnOverlap = true;
                }
            }
            return columnOverlap;
        }
    },


    // Checks whether a character and a projectile occupy the same row.If checkColumnOverlap and checkRowOverlap both return true, then there has
    //      been a collision.
    checkRowOverlap: function(characterRef, projectileRef) {
        const characterRowStart = parseInt(characterRef.style.gridRowStart);
        const characterRowEnd = parseInt(characterRef.style.gridRowEnd);
        const projectileRowStart = parseInt(projectileRef.style.gridRowStart);
        const projectileRowEnd = parseInt(projectileRef.style.gridRowEnd);
        let rowOverlap = false;
        if (characterRowStart <= projectileRowStart) {
            if (characterRowEnd >= projectileRowStart) {
                rowOverlap = true;
            }
        }
        if (characterRowStart <= projectileRowEnd) {
            if (characterRowEnd >= projectileRowEnd) {
                rowOverlap = true;
            }
        }
        return rowOverlap;
    },


    // Maps through all projectiles and removes each one.
    removeAllProjectiles: function() {
        Array.from(document.getElementsByClassName("projectile")).map(projectile => projectile.remove());
    }
};

export default projectileFun;
// Barrier functionality - the functionality for spawning barriers, removing barriers and checking if an alien has reached a barrier.
let barrierFun = {
    // Spawns four new undamaged barriers.
    spawnAllBarriers: function() {
        this.spawnBarrier(9, 48);
        this.spawnBarrier(33, 48);
        this.spawnBarrier(57, 48);
        this.spawnBarrier(81, 48);
    },


    // Spawns a new barrier, which itself is made up of smaller div elements in the shape of an arch. The below loops and logic creates the arch shape.
    //      By creating the barrier out of smaller div elements, it is able to be damaged by projectiles.
    spawnBarrier: function(xStart, yStart) {
        for (let i=0; i<3; i++) {
            for (let j=0; j<2; j++) {
                if (i !== 1 || j === 0) {
                    for (let k=0; k<4; k++) {
                        for (let l=0; l<4; l++) {
                            document.getElementById("game-grid").innerHTML += `<div
                                    class="barrier"
                                    style="
                                        grid-column-start: ${xStart + 4*i + k};
                                        grid-column-end: ${xStart + 4*i + k + 1};
                                        grid-row-start: ${yStart + 4*j + l};
                                        grid-row-end: ${yStart + 4*j + l + 1};
                                    "                            
                                ></div>`;
                        }
                    }
                }
            }
        }
    },


    // Maps through all the smaller barrier div elements to determine whether an alien has made contact with it, which if true, removes the barrier element.
    checkForContact: function(alienId) {
        const barriers = document.getElementsByClassName("barrier");
        const alienRowEnd = parseInt(document.getElementById(alienId).style.gridRowEnd);
        Array.from(barriers).map(barrier => {
            if (alienRowEnd > parseInt(barrier.style.gridRowStart)) {
                barrier.remove();
            }
        })
    },


    // Removes all the smaller barrier div elements.
    removeAllBarriers: function() {
        Array.from(document.getElementsByClassName("barrier")).map(barrier => barrier.remove());
    }
};

export default barrierFun;
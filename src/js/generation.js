/*
 * Lieu        : ETML, Lausanne
 * Auteur      : Hugo Ducommun
 * Date        : 19.06.2020
 * Description : Fonctions concernant la génération du labyrinthe
 * Inspiration : https://www.youtube.com/watch?v=HyK_Q5rrcr4
*/

/*
 * Active la génération du labyrinthe
 */
function generate() {
    redraw();
    document.getElementById("generationBtn").disabled = true;
    document.getElementById("clearBtn").disabled = true;
    document.getElementById("animationDisabled").disabled = true;
    document.getElementById("sideNumber").disabled = true;
    generation = true;
    chronoStart();
    setup();
    document.getElementById("stopStartBtn").disabled = false;
}

/*
 * Vérifie que le labyrinthe est terminé pour activer le bouton Solve
 */
function isFinished() {
    let finished = true;
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            if (cells[i][j].visited == false) {
                finished = false;
                return finished;
            }
        }
    }
    if (current.i != start[0] || current.j != start[1]) {
        finished = false;
    }
    return finished;
}

/*
 * Fonction qui enlève les murs entre la cellule current et next
 * @param current, case actuelle
 * @param next, prochaine case vers laquelle bouger
 */
function removeWalls(current, next) {
    if (current.i - next.i === 1) {
        current.walls[0] = false;
        next.walls[2] = false;
    }
    else if (next.j - current.j === 1) {
        current.walls[1] = false;
        next.walls[3] = false;
    }
    else if (next.i - current.i === 1) {
        current.walls[2] = false;
        next.walls[0] = false;
    }
    else if (current.j - next.j === 1) {
        current.walls[3] = false;
        next.walls[1] = false;
    }
}
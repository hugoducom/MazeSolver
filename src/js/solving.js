/*
 * Calcule la distance entre deux cases
 * @param start, case de départ [Cell]
 * @param goal, case objectif [Cell]
 * @return : nombre de pixels entre les deux coins haut gauche des cases
 */
function distance(start, goal) {
    let x = goal.x - start.x;
    let y = goal.y - start.y;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) // Pythagore
}

/*
 * Active la résolution du labyrinthe
 */
function solveMaze() {
    document.getElementById("solveBtn").disabled = true;
    document.getElementById("stopStartBtn").disabled = false;
    targetNode = cells[target[0]][target[1]]; // reset le noeud objectif si l'utilisateur l'a déplacé après génération
    startNode = cells[start[0]][start[1]]; // reset aussi le noeud de départ
    chronoStart();
    currentNode = startNode; // reset le noeud actuel
    solveLoop = true;
}
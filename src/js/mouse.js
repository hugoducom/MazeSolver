/*
 * Lorsque l'utilisateur clique (et reste appuyé)
 */
function mousePressed() {
    // seulement si le labyrinthe n'est pas en génération ou en résolution
    if (!generation && !solveLoop && !isSolved) {
        for (let i = 0; i < side; i++) {
            for (let j = 0; j < side; j++) {
                if (cells[i][j].x < mouseX && mouseX < cells[i][j].x + cells[i][j].w) {
                    if (cells[i][j].y < mouseY && mouseY < cells[i][j].y + cells[i][j].h) {
                        if (cells[i][j] === startNode) {
                            isMovingNode = true;
                            movingNode = startNode;
                        } else if (cells[i][j] === targetNode) {
                            isMovingNode = true;
                            movingNode = targetNode;
                        }
                    }
                }
            }
        }
    }
}

/*
 * Lorsque l'utilisateur glisse un noeud pour le changer de place
 */
function mouseDragged() {
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            if (cells[i][j].x < mouseX && mouseX < cells[i][j].x + cells[i][j].w) {
                if (cells[i][j].y < mouseY && mouseY < cells[i][j].y + cells[i][j].h) {
                    if (cells[i][j] !== startNode && movingNode === startNode && cells[i][j] !== targetNode) {
                        startNode = cells[i][j];
                        movingNode = startNode;
                        start[0] = i;
                        start[1] = j;
                    } else if (cells[i][j] !== targetNode && movingNode === targetNode && cells[i][j] !== startNode) {
                        targetNode = cells[i][j];
                        movingNode = targetNode;
                        target[0] = i;
                        target[1] = j;
                    }
                    document.getElementById("startCoord").innerHTML = "(" + start[0] + ", " + start[1] + ")";
                    document.getElementById("targetCoord").innerHTML = "(" + target[0] + ", " + target[1] + ")";
                }
            }
        }
    }
}

/*
 * Lorsque l'utilisateur relâche la souris
 */
function mouseReleased() {
    // désactive toutes les variables
    if (movingNode) {
        isMovingNode = false;
        movingNode = null;
    }
}
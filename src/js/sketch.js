/*
 * Lieu        : ETML, Lausanne
 * Auteur      : Hugo Ducommun
 * Date        : 11.06.2020
 * Description : Fichier de base de la librairie p5.js
*/

// GENERAL VARIABLES
var canvas;
var side = document.getElementById("sideNumber").value; // nombre de cellules sur les côtls du labyrinthe (labyrinthe carré)
var cells = create2dArray(side, side); // tableau de toutes les cellules
var isMovingNode = false; // si le joueur glisse un noeud (start ou target) pour le déplacer
var movingNode; // le noeud que l'utilisateur est en train de bouger
var isStopped = false; // si le processus est arrêté ou non

// ANIMATION VARIABLES
var animationDisabledBtn = document.getElementById("animationDisabled"); // checkbox de désactivation des animations
var rate = 60; // frameRate

// GENERATION VARIABLES
var generation = false; // lance la génération du labyrinthe
var current; // cellule qui est actuellement "analysée"
var generatedCells = 1; // nombre de cellules générées (data)
var cellStack = []; // stack pour le backtrack (revenir en arrière dans une impasse)

// SOLVING VARIABLES
var isSolved = false; // éviter de répéter le code de résolution après résolution
var solveLoop = false; // lance la résolution du labyrinthe
var start = [0, 0]; // coordonnées du noeud de départ
var target = [side - 1, side - 1]; // coordonnées du noeud objectif
var currentNode; // noeud actuellement analysé
var targetNode; // noeud objectif
var startNode; // noeud de départ

/*
 * Fonction setup de la librairie p5.js
 */
function setup() {
    canvas = createCanvas(600, 600);
    canvas.parent("mazeParent");
    // Désactive les boutons qu'il faut
    document.getElementById("solveBtn").disabled = true;
    document.getElementById("clearBtn").disabled = true;
    document.getElementById("downloadBtn").disabled = true;
    document.getElementById("stopStartBtn").disabled = true;
    
    // Création de chaque cellule (cases)
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            cells[i][j] = new Cell(i, j);
        }
    }

    // SOLVING
    targetNode = cells[target[0]][target[1]];
    startNode = cells[start[0]][start[1]];
    currentNode = cells[start[0]][start[1]];
    // END SOLVING

    current = cells[start[0]][start[1]]; // par défaut, on commence à la case de départ
}

/*
 * Fonction draw de la librairie p5.js
 */
function draw() {
    background(50);

    // SET THE FRAMERATE
    if (document.getElementById("slow").checked == true) {
        rate = 10;
    } else if (document.getElementById("fast").checked == true) {
        rate = 60;
    } else {
        rate = 30;
    }
    frameRate(rate);
    // END SET THE FRAMERATE

    // DRAW THE CELLS
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            cells[i][j].draw();
        }
    }
    // END DRAW THE CELLS
    
    // MAZE GENERATOR
    if (generation) {
        current.visited = true;
        if (!isFinished()) {
            current.highlight();
        }
    
        var nextCell = current.checkNeighbours();
        if (nextCell) {
            nextCell.visited = true;
            cellStack.push(current);
            removeWalls(current, nextCell);
            current = nextCell;
            generatedCells += 1;
            document.getElementById("visitedCells").innerHTML = generatedCells;
            document.getElementById("generationPercent").innerHTML = floor((generatedCells / (side * side)) * 100) + " %";
        } else if (cellStack.length > 0) {
            current = cellStack.pop();
        }
        startAnimation(current);
        document.getElementById("clearBtn").disabled = false;
    }
    // END MAZE GENERATOR

    if (isFinished() && current.i == start[0] && current.j == start[1] && !solveLoop) {
        generation = false;
        document.getElementById("solveBtn").disabled = false;
        document.getElementById("stopStartBtn").disabled = true;
        chronoStop();
    }

    // MAZE SOLVING
    if (solveLoop && !isSolved) {
        let neighbours = currentNode.getReachableNeighbours();

        currentNode.open = -1; // ferme le noeud
        startAnimation(currentNode);

        if (neighbours) {
            // s'il n'y a qu'une possibilité
            if (neighbours.length == 1) {
                neighbours[0].parent = currentNode;
                neighbours[0].open = 1; // open
                currentNode = neighbours[0];
            } else {
                let dist = Infinity;
                for (let i = 0; i < neighbours.length; i++) {
                    // si la valeur g est plus petite, on a trouvé un meilleur chemin pour le voisin
                    if (dist > distance(neighbours[i], targetNode)) {
                        dist = distance(neighbours[i], targetNode);
                        bestCell = neighbours[i];
                    }
                }
                bestCell.parent = currentNode;
                bestCell.open = 1; // open
                currentNode = bestCell;
            }
        } else {
            currentNode.open = 2; // on bannit la cellule, car cul-de-sac
            currentNode = currentNode.parent;
        }
        
        // si le noeud obtenu est la cible, on arrête
        if (currentNode == targetNode) {
            currentNode.open = -1;
            isSolved = true;
            chronoStop();
            document.getElementById("downloadBtn").disabled = false;
            document.getElementById("stopStartBtn").disabled = true;
        }
    }
    // END MAZE SOLVING

    // UPDATE THE OPEN CELLS COUNT
    let openCells = 0;
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            if (cells[i][j].open == -1) {
                openCells++;
            }
        }
    }
    document.getElementById("routeLength").innerHTML = openCells;
    // END UPDATE THE OPEN CELLS COUNT
}

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
/*
 * Lieu        : ETML, Lausanne
 * Auteur      : Hugo Ducommun
 * Date        : 11.06.2020
 * Description : Script de base de la librairie p5.js
*/

// GENERAL VARIABLES
var canvas; // canvas du labyrinthe
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
var generatedCells = 1; // nombre de cellules générées (pour les données)
var cellStack = []; // stack pour le backtrack (revenir en arrière dans une impasse)

// SOLVING VARIABLES
var openCells = 0; // longueur du chemin de résolution
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
    // Création du canvas
    canvas = createCanvas(600, 600);
    canvas.parent("mazeParent");
    windowResized();
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

    // Met en place les noeuds après création de la grille
    targetNode = cells[target[0]][target[1]];
    startNode = cells[start[0]][start[1]];
    currentNode = cells[start[0]][start[1]];

    // Par défaut, la génération commence à la case de départ
    current = cells[start[0]][start[1]]; 
}

/*
 * Fonction draw de la librairie p5.js (activée toute les frameRate)
 */
function draw() {
    background(50);

    // FRAMERATE
    if (document.getElementById("slow").checked == true) {
        rate = 10;
    } else if (document.getElementById("fast").checked == true) {
        rate = 60;
    } else {
        rate = 30;
    }
    frameRate(rate);
    // FIN FRAMERATE

    // DESSINE LES CELLULES
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            cells[i][j].draw();
        }
    }
    // FIN DESSINE LES CELLULES
    
    // ALGORITHME DE GÉNÉRATION (BACKTRACK)
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
            let percent = floor((generatedCells / (side * side)) * 100) + "%";
            document.getElementById("progressBar").style.width = percent;
            document.getElementById("progressBar").innerHTML = percent;
            document.getElementById("visitedCells").innerHTML = generatedCells + " / " + side*side;
        } else if (cellStack.length > 0) {
            current = cellStack.pop();
        }
        startAnimation(current);
        document.getElementById("clearBtn").disabled = false;
    }
    // FIN ALGORITHME DE GÉNÉRATION

    if (isFinished() && current.i == start[0] && current.j == start[1] && !solveLoop) {
        generation = false;
        document.getElementById("solveBtn").disabled = false;
        document.getElementById("stopStartBtn").disabled = true;
        chronoStop();
    }

    // ALGORITHME DE RÉSOLUTION (DEPTH-FIRST SEARCH)
    if (solveLoop && !isSolved) {
        let neighbours = currentNode.getReachableNeighbours();

        if (currentNode.open != -1) {
            openCells++;
        }
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
            openCells--;
            currentNode = currentNode.parent;
        }
        
        // si le noeud obtenu est la cible, on arrête
        if (currentNode == targetNode) {
            currentNode.open = -1;
            openCells++;
            isSolved = true;
            chronoStop();
            document.getElementById("downloadBtn").disabled = false;
            document.getElementById("stopStartBtn").disabled = true;
        }
    }
    // FIN ALGORITHME DE RÉSOLUTION

    document.getElementById("routeLength").innerHTML = openCells;
}

/*
 * Fonction pour le responsive
 */
function windowResized() {
    if (windowWidth > 1200) {
        resizeCanvas(600, 600);
    } else if (windowWidth <= 650) {
        resizeCanvas(400, 400);
    } else if (windowWidth <= 450) {
        resizeCanvas(300, 300);
    } else if (windowWidth <= 350) {
        resizeCanvas(200, 200);
    }
}
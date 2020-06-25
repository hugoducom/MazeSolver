/*
 * Lieu        : ETML, Lausanne
 * Auteur      : Hugo Ducommun
 * Date        : 19.06.2020
 * Description : Fonctions utilitaires diverses du projet
*/

/*
 * Efface le labyrinthe déjà existant et restore les objets cellules
 */
function clearMaze() {
    document.getElementById("generationBtn").disabled = false; // désactive/active les boutons
    document.getElementById("animationDisabled").disabled = false;
    document.getElementById("solveBtn").disabled = true;
    document.getElementById("clearBtn").disabled = true;
    document.getElementById("downloadBtn").disabled = true;
    document.getElementById("stopStartBtn").disabled = true;
    document.getElementById("sideNumber").disabled = false;

    document.getElementById("stopStartBtn").firstChild.data = "Stop";

    chronoStopReset();

    generation = false;
    solveLoop = false;
    isSolved = false;
    isStopped = false;
    
    targetNode = cells[target[0]][target[1]];
    startNode = cells[start[0]][start[1]];
    currentNode = cells[start[0]][start[1]];

    // restore chaque cellules du labyrinthe
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            cells[i][j].visited = false;
            cells[i][j].fade = 0;
            cells[i][j].open = 0;
            cells[i][j].g_cost = Infinity;
            cells[i][j].h_cost = 0;
            cells[i][j].f_cost = cells[i][j].g_cost + cells[i][j].h_cost;
            cells[i][j].walls[0] = true;
            cells[i][j].walls[1] = true;
            cells[i][j].walls[2] = true;
            cells[i][j].walls[3] = true;
            noFill();
            cells[i][j].draw();
        }
    }

    document.getElementById("visitedCells").innerHTML = 0 + " / " + side * side;
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("progressBar").innerHTML = "";
    document.getElementById("routeLength").innerHTML = 0;
    document.getElementById("generationTime").innerHTML = "00:00:000";
    document.getElementById("solvingTime").innerHTML = "00:00:000";
    generatedCells = 1;
    openCells = 0;
    current = cells[0][0];
    loop();
}


/*
 * Fonction qui crée un tableau en 2D
 * @param col, nombre de colonnes du tableau
 * @param row, nombre de lignes du tableau
 */
function create2dArray(row, col) {
    var array = new Array(row);
    for (let i = 0; i < row; i++) {
        array[i] = new Array(col);
    }
    return array;
}

/*
 * Fait télécharger le canvas sous format JPG
 */
function downloadMaze() {
    saveCanvas(canvas, 'mazeSolving', 'jpg');
}

/*
 * Lance l'animation sur une cellule (fade-in)
 */
function startAnimation(cell) {
    if (animationDisabledBtn.checked == false) {
        cell.fade = 0;
    }
}

/*
 * Arrête ou reprend l'algorithme en cours d'exécution
 */
function stopStart() {
    var btn = document.getElementById("stopStartBtn");
    if (isStopped) {
        loop();
        btn.firstChild.data = "Stop";
        isStopped = false;
        chronoContinue();
    } else {
        noLoop();
        btn.firstChild.data = "Start";
        isStopped = true;
        chronoStop();
    }
}

/*
 * Modifie la structure du labyrinthe (s'active à chaque changement de longueur des côtés)
 */
function modifySideNumber() {
    let value = document.getElementById("sideNumber").value;

    if (value <= 40 && value >= 5) {
        noLoop(); // arrête les draw()
        // recrée les variables dépendantes de side
        side = document.getElementById("sideNumber").value;
        start = [0, 0];
        target = [side - 1, side - 1];
        document.getElementById("startCoord").innerHTML = "(" + start[0] + ", " + start[1] + ")";
        document.getElementById("targetCoord").innerHTML = "(" + target[0] + ", " + target[1] + ")";
        document.getElementById("visitedCells").innerHTML = 0 + " / " + side * side;
        cells = create2dArray(side, side);
        setup(); // relance le programme
        loop();
    } else {
        alert("La longueur doit être entre 5 et 40.");
    }
}
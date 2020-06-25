/*
 * Lieu        : ETML, Lausanne
 * Auteur      : Hugo Ducommun
 * Date        : 11.06.2020
 * Description : Classe d'une cellule (case du labyrinthe)
 * Inspiration : https://www.youtube.com/watch?v=HyK_Q5rrcr4
*/

class Cell {
    constructor(i, j) {
      this.x = (height / side) * j; // position x en pixels
      this.y = (width / side) * i; // position y en pixels
      this.w = width / side; // largeur de la cellule
      this.h = height / side; // hauteur de la cellule
      this.i = i; // index de la ligne
      this.j = j; // index de la colonne

      // draw variables
      this.fade = 0;

      // generator variables
      this.visited = false;
      this.walls = [true, true, true, true]; // dessus, droite, bas, gauche (sens des aiguilles d'une montre)
    
      // solving variables
      this.parent; // le noeud d'où on vient
      this.open = 0; // si le noeud est ouvert (1), banni (2) ou fermé (-1), pour la couleur (0 = avant la résolution)
    }

    /*
    * Fonction qui dessine la cellule
    */
    draw() {
        // apparition progressive
        if (this.fade < 100) {
            this.fade += 5;
        }

        // murs
        stroke(255);
        if (this.walls[0]) {
            line(this.x, this.y, this.x + this.w, this.y);
        }
        if (this.walls[1]) {
            line(this.x + this.w, this.y, this.x + this.w, this.y + this.h);
        }
        if (this.walls[2]) {
            line(this.x + this.w, this.y + this.h, this.x, this.y + this.h);
        }
        if (this.walls[3]) {
            line(this.x, this.y + this.h, this.x, this.y);
        }

        if (this.visited) {
            noStroke();
            if (this.open == 1) {
                fill(255, 0, 0, this.fade); // ouvert = rouge
            } else if (this.open == 0) {
                fill(0, 0, 255, this.fade); // neutre = bleu
            } else if (this.open == -1) {
                fill(0, 255, 0, this.fade); // fermé = vert
            } else if (this.open == 2) {
                fill(0, 0, 0, this.fade); // banni = noir
            }
            rect(this.x, this.y, this.w, this.h);
        }

        // Dessine le "S" et le "T" pour indiquer la case Start et la case Target
        if (this === targetNode) {
            fill(255, 255, 255);
            textSize(20);
            text('T', this.x + this.w / 2 - textWidth('T') / 2, this.y + this.h / 2 + textWidth('T') / 2);
        } else if (this === startNode) {
            fill(255, 255, 255);
            textSize(20);
            text('S', this.x + this.w / 2 - textWidth('S') / 2, this.y + this.h / 2 + textWidth('S') / 2);
        }
    }

    /*
    * Fonction qui vérifie si les cellules voisines sont visitées ou pas (generation)
    * @return : une cellule voisine non visitée prise au hasard
    */
    checkNeighbours() {
        var availableNeighbours = [];
        
        if (this.i != 0) { var top = cells[this.i - 1][this.j]; }
        if (this.i != side - 1) { var right = cells[this.i + 1][this.j]; }
        if (this.j != side - 1) { var bottom = cells[this.i][this.j + 1]; }
        if (this.j != 0) { var left = cells[this.i][this.j - 1]; }

        if (top && !top.visited) { availableNeighbours.push(top); }
        if (right && !right.visited) { availableNeighbours.push(right);}
        if (bottom && !bottom.visited) { availableNeighbours.push(bottom); }
        if (left && !left.visited) { availableNeighbours.push(left); }

        if (availableNeighbours.length > 0) {
            var r = floor(random(0, availableNeighbours.length));
            return availableNeighbours[r];
        } else {
            return undefined;
        }
    }

    /*
    * Met en valeur en vert la cellule "current" (generation)
    */
    highlight() {
        noStroke();
        fill(0, 255, 0);
        rect(this.x, this.y, this.w, this.h);
    }

    /*
    * Renvoie les voisins atteignables ouverts de la cellule actuelle (solving)
    * @return : un tableau des cellules
    */
    getReachableNeighbours() {
        let reachableNeighbours = [];

        if (this.j != 0) { var left = cells[this.i][this.j - 1]; }
        if (this.i != 0) { var top = cells[this.i - 1][this.j]; }
        if (this.j != side - 1) { var right = cells[this.i][this.j + 1]; }
        if (this.i != side - 1) { var bottom = cells[this.i + 1][this.j]; }

        // il ne doit pas y avoir de murs entre les deux et il faut que la cellule voisine soit neutre
        if (!this.walls[0] && top && top.open == 0) { reachableNeighbours.push(top); }
        if (!this.walls[1] && right && right.open == 0) { reachableNeighbours.push(right); }
        if (!this.walls[2] && bottom && bottom.open == 0) { reachableNeighbours.push(bottom); }
        if (!this.walls[3] && left  && left.open == 0) { reachableNeighbours.push(left); }

        if (reachableNeighbours.length > 0) { return reachableNeighbours; }
        else { return undefined; }
    }
}
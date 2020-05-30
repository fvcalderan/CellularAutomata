class Automata {
    /* this class provides management rules for the automata. It depends directly on the
     * Automaton class. It's crucial noticing that the Automaton class only manages each
     * cell internal values, while this class manages the group and how the interactions
     * happen.
     *
     * Public methods:
     * constructor(loneliness, overpopulation, reproduction, rows, cols)
     * initialize() 
     * evolve()
     * get_state(x, y)
     * set_state(x, y, val) */

    constructor(loneliness, overpopulation, reproduction, rows, cols) {
        // assign attributes
        this.lone = loneliness;
        this.overpop = overpopulation;
        this.repro = reproduction;
        this.rows = rows;
        this.cols = cols;

        // create state matrix
        this.state = new Array(cols);
        for (let i = 0; i < cols; i++) {
            this.state[i] = new Array(rows);
        }
    }

    initialize() {
        // initialize automata state matrix, otherwise its
        // elements are undefined and/or empty
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.state[x][y] = new Automaton(0);
            }
        } 
    }

    evolve(mode) {
        // evolve automata

        // create aux matrix
        let aux = new Array(this.cols);
        for (let i = 0; i < this.cols; i++) {
            aux[i] = new Array(this.rows);
            for (let j = 0; j < this.rows; j++) {
                // Essa inicialização afeta o rule 30
                // Faz não afeta o game of life
                aux[i][j] = new Automaton(this.state[i][j].get_value());
            }
        }

        if (mode == "Rule 30"){

            for (let x = 0; x < this.cols-1; x++) {
                for (let y = 1; y < this.rows - 1; y++) {
                    let a = this.state[y-1][x].get_value();
                    let b = this.state[y][x].get_value();
                    let c = this.state[y+1][x].get_value();
                    if (a == 1 && b == 1 && c == 1) aux[y][x+1].set_value(0);
                    if (a == 1 && b == 1 && c == 0) aux[y][x+1].set_value(0);
                    if (a == 1 && b == 0 && c == 1) aux[y][x+1].set_value(0);
                    if (a == 1 && b == 0 && c == 0) aux[y][x+1].set_value(1);
                    if (a == 0 && b == 1 && c == 1) aux[y][x+1].set_value(1);
                    if (a == 0 && b == 1 && c == 0) aux[y][x+1].set_value(1);
                    if (a == 0 && b == 0 && c == 1) aux[y][x+1].set_value(1);
                    if (a == 0 && b == 0 && c == 0) aux[y][x+1].set_value(0);
                }
            }

        }else if(mode == "Game of life"){
            // compute new state
            for (let x = 1; x < this.cols - 1; x++) {
                for (let y = 1; y < this.rows - 1; y++) {
                    let neighbors = this._num_of_neighbors(x, y);
                    aux[x][y].set_value(this._apply_rules(x, y, neighbors));
                }
            } 
        }

        this.state = aux;
    }

    get_state(x, y) {
        return this.state[x][y].get_value();
    }

    set_state(x, y, val) {
        this.state[x][y].set_value(val);
    }

    _num_of_neighbors(x, y) {
        // get cell's amount of neighbors
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                neighbors += this.state[x+i][y+j].get_value();
            }
        }
        // remove extra unit if state[x][y] is active
        return neighbors - this.state[x][y].get_value();
    }

    _apply_rules(x, y, neighbors) {
        // apply defined rules to (x, y)
        if (this.state[x][y].get_value() == 1 && neighbors < this.lone) return 0;
        else if (this.state[x][y].get_value() == 1 && neighbors > this.overpop) return 0;
        else if (this.state[x][y].get_value() == 0 && neighbors == this.repro) return 1;
        else  return this.state[x][y].get_value();
    }

}

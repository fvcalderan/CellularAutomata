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
        this.state = new Array(rows);
        for (let i = 0; i < rows; i++) {
            this.state[i] = new Array(cols);
        }
    }

    initialize() {
        // initialize automata state matrix, otherwise its
        // elements are undefined and/or empty
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                this.state[x][y] = new Automaton(0);
            }
        }
    }

    evolve(mode) {
        // evolve automata

        if (mode == "Elementary CA") {

            //move lines up
            for (let x = 1; x < rows; x++)
                for (let y = 0; y < this.cols; y++)
                    this.state[x-1][y].set_value(this.state[x][y].get_value());

            let rule_table = ("00000000" + int(initial_input.value()).toString(2)).slice(-8);

            for (let y = 0; y < this.cols; y++) {
                let a = (y == 0) ? this.state[rows-2][cols-1].get_value() : this.state[rows-2][y-1].get_value();
                let b = this.state[rows-2][y].get_value();
                let c = (y == cols-1) ? this.state[rows-2][0].get_value() : this.state[rows-2][y+1].get_value();
                
                if(b == 1) c = int(c) + 2;
                if(a == 1) c = int(c) + 4;
                this.state[rows-1][y].set_value(rule_table[7-int(c)]);
            }

        } else if(mode == "Game of life") {
            // create aux matrix
            let aux = new Array(this.rows);
            for (let i = 0; i < this.rows; i++) {
                aux[i] = new Array(this.cols);
                for (let j = 0; j < this.cols; j++) {
                    aux[i][j] = new Automaton(0);
                }
            }
            // compute new state
            for (let x = 0; x < this.rows; x++) {
                for (let y = 0; y < this.cols; y++) {
                    let neighbors = this._num_of_neighbors(x, y);
                    aux[x][y].set_value(this._apply_rules(x, y, neighbors));
                }
            }

            this.state = aux;
        }
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
        let indexX, indexY;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                indexX = x + i;
                indexY = y + j;

                if(indexX == -1)
                    indexX = this.rows - 1;
                else if(indexX == this.rows)
                    indexX = 0;
                if(indexY == -1)
                    indexY = this.cols - 1;
                else if(indexY == this.cols)
                    indexY = 0;

                neighbors += this.state[indexX][indexY].get_value();
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
        else return this.state[x][y].get_value();
    }

}

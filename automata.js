class Automata {
    /* this class provides management rules for the automata. It depends directly on the
     * Automaton class. It's crucial noticing that the Automaton class only manages each
     * cell internal values, while this class manages the group and how the interactions
     * happen.
     *
     * Public methods:
     * constructor(loneliness, overpopulation, reproduction, rows, cols)
     * initialize() 
     * GoL_set(loneliness, overpopulation, reproduction)
     * SIR_set(infect_chance, recover_mult, recover_minimum)
     * evolve()
     * get_state(x, y)
     * set_state(x, y, val)
     * get_unique()             */

    constructor(rows, cols) {
        // assign attributes
        this.rows = rows;
        this.cols = cols;

        // create state matrix
        this.state = new Array(rows);
        for (let i = 0; i < rows; i++) {
            this.state[i] = new Array(cols);
        }
        this.unique = {0:0, 1:0};
    }

    GoL_set(loneliness, overpopulation, reproduction) {
        this.lone = loneliness;
        this.overpop = overpopulation;
        this.repro = reproduction;
    }

    SIR_set(infect_chance, recover_mult, recover_minimum) {
        this.infect_chance = infect_chance;
        this.recover_mult = recover_mult;
        this.recover_minimum = recover_minimum;
    }

    initialize() {
        // initialize automata state matrix, otherwise its
        // elements are undefined and/or empty
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                this.state[x][y] = new Automaton(0, 0);
                this.unique[0] += 1;
            }
        }
    }

    evolve(mode) {
        // evolve automata
        this.unique = {0:0, 1:0};

        if (mode == "Elementary CA") {
            this._ECA_evolve();
        } else if (mode == "Game of life") {
            this._GoL_evolve();
        } else if (mode == "SIR Simulation") {
            this._SIR_evolve();
        }
    }

    get_state(x, y) {
        return this.state[x][y].get_value();
    }

    set_state(x, y, val) {
        this.state[x][y].set_value(val);
    }

    get_unique() {
        return this.unique;
    }

// this segment is responsible for Elementary CA evolution over time ============================================

    _ECA_evolve() {
        // move lines up
        for (let x = 1; x < rows; x++){
            for (let y = 0; y < this.cols; y++){
                this.state[x-1][y].set_value(this.state[x][y].get_value());
                this.unique[this.state[x][y].get_value()] += 1;
            }
        }

        // create a table with the input rule
        let rule_table = ("00000000" + int(initial_value).toString(2)).slice(-8);

        // compute new generations
        for (let y = 0; y < this.cols; y++) {
            let a = (y == 0) ? this.state[rows-2][cols-1].get_value() : this.state[rows-2][y-1].get_value();
            let b = this.state[rows-2][y].get_value();
            let c = (y == cols-1) ? this.state[rows-2][0].get_value() : this.state[rows-2][y+1].get_value();
            if (b == 1) c = int(c) + 2;
            if (a == 1) c = int(c) + 4;
            this.state[rows-1][y].set_value(rule_table[7-int(c)]);
            this.unique[this.state[rows-1][y].get_value()] += 1;
        }
    }

// this segment is responsible for Game of life evolution over time =============================================

    _GoL_evolve() {
        // create aux matrix
        let aux = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            aux[i] = new Array(this.cols);
            for (let j = 0; j < this.cols; j++) {
                aux[i][j] = new Automaton(0, 0);
            }
        }
        // compute new state
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                let neighbors = this._GoL_num_of_neighbors(x, y);
                let tmp_value = this._GoL_apply_rules(x, y, neighbors);
                aux[x][y].set_value(tmp_value);
                this.unique[tmp_value] += 1;
            }
        }
        this.state = aux;
    }

    _GoL_num_of_neighbors(x, y) {
        // get cell's amount of neighbors
        let neighbors = 0;
        let indexX, indexY;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                indexX = x + i;
                if (indexX == -1) indexX = this.rows-1;
                else if (indexX == this.rows) indexX = 0;

                indexY = y + j;
                if (indexY == -1) indexY = this.cols-1;
                else if (indexY == this.cols) indexY = 0;

                neighbors += this.state[indexX][indexY].get_value();
            }
        }

        // remove extra unit if state[x][y] is active
        return neighbors - this.state[x][y].get_value();
    }

    _GoL_apply_rules(x, y, neighbors) {
        // apply defined rules to (x, y)
        if (this.state[x][y].get_value() == 1 && neighbors < this.lone) return 0;
        else if (this.state[x][y].get_value() == 1 && neighbors > this.overpop) return 0;
        else if (this.state[x][y].get_value() == 0 && neighbors == this.repro) return 1;
        else return this.state[x][y].get_value();
    }

// this segment is responsible for SIR Simulation evolution over time ===========================================

    _SIR_evolve() {
        // create aux matrix
        let aux = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            aux[i] = new Array(this.cols);
            for (let j = 0; j < this.cols; j++) {
                aux[i][j] = new Automaton(0, 0);
            }
        }
        // compute new state
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                let neighbors = this._SIR_num_of_neighbors(x, y);
                let tmp_value = this._SIR_apply_rules(x, y, neighbors);
                aux[x][y].set_value(tmp_value[0]);
                aux[x][y].set_count(tmp_value[1]);
                this.unique[tmp_value] += 1;
            }
        }
        this.state = aux;
    }

    _SIR_num_of_neighbors(x, y) {
        // get cell's amount of infected neighbors
        let neighbors = 0;
        let indexX, indexY;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                indexX = x + i;
                if (indexX == -1) indexX = this.rows-1;
                else if (indexX == this.rows) indexX = 0;

                indexY = y + j;
                if (indexY == -1) indexY = this.cols-1;
                else if (indexY == this.cols) indexY = 0;

                neighbors += this.state[indexX][indexY].get_value();
            }
        }
        // remove extra unit if state[x][y] is active
        return neighbors - this.state[x][y].get_value();
    }

    _SIR_apply_rules(x, y, neighbors) {
        // apply defined rules to (x, y)
        let return_arr = new Array(2);
        if (this.state[x][y].get_value() == 1) {
            let recover = random()*this.recover_mult+this.recover_minimum;
            if (this.state[x][y].get_count() > recover) {
                return_arr[0] = 2;
                return_arr[1] = 0
                return return_arr;
            } else {
                return_arr[0] = 1;
                return_arr[1] = this.state[x][y].get_count() +1;
                return return_arr
            }
        }
        else if (this.state[x][y].get_value() == 0) {
            for (let i = 0; i < neighbors; i++) {
                let a = random();
                if (a < this.infect_chance) {
                    return_arr[0] = 1;
                    return_arr[1] = 0;
                    return return_arr
                }
            }
        }
        return_arr[0] = this.state[x][y].get_value();
        return_arr[1] = this.state[x][y].get_count() +1;
        return return_arr
    }
}

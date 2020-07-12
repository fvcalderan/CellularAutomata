/* BSD 3-Clause License
 * Copyright (c) 2020, Felipe Vaiano Calderan
 * Copyright (c) 2020, Gabriel Augusto Lins Leal Pinheiro
 * Copyright (c) 2020, Silvio de Souza Neves Neto
 * All rights reserved.
 * See the full license inside LICENSE.txt file */

class AutomatonSIR {
    /* this class refers to a single cell of SIR. It should function as a basic
     * struct and/or grouping of values. The interaction between automata
     * should be defined inside the Automata class.
     *
     * Public methods:
     * constructor(S, I, R, beta, gamma)
     * set_S(val)    
     * get_S()       
     * set_I(val)    
     * get_I()       
     * set_R(val)    
     * get_R()       
     * set_beta(val) 
     * get_beta()    
     * set_gamma(val)
     * get_gamma()          
     * get_value()
     * set_value(S, I, R, beta, gamma)
     * infect(amount)                       */
     
    constructor(S, I, R, beta, gamma) {
        this.S = S;
        this.I = I;
        this.R = R;
        this.beta = beta;
        this.gamma = gamma;
    }

    evolve() {
        let dS = -this.beta * this.S * this.I;
        let dR = this.gamma * this.I;
        let dI = -dS-dR;
        this.S += dS;
        this.R += dR;
        this.I += dI;
    }

    get_value() {
        let values = [this.S, this.I, this.R];
        return values;
    }

    set_value(S, I, R, beta, gamma) {
        this.S = S;
        this.I = I;
        this.R = R;
        this.beta = beta;
        this.gamma = gamma;
    }

    // amount = ratio of S
    infect(amount) {
        this.I = this.I + this.S*amount
        this.S = this.S - this.S*amount;
    }

    // compact setters and getters
    set_S(val)      { this.S = val; }
    get_S()         { return this.S; }
    set_I(val)      { this.I = val; }
    get_I()         { return this.I; }
    set_R(val)      { this.R = val; }
    get_R()         { return this.R; }
    set_beta(val)   { this.beta = val; }
    get_beta()      { return this.beta; }
    set_gamma(val)  { this.gamma = val; }
    get_gamma()     { return this.gamma; }
}

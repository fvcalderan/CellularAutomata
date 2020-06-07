class Automaton {
    /* this class refers to a single cell. It should function as a basic struct and/or
     * grouping of values. The interaction between automata should be defined inside the
     * Automata class.
     *
     * Public methods:
     * constructor(value)
     * get_value()
     * set_value(val) 
     * get_count()
     * set_count(val)       */

    constructor(value, count) {
        this.value = value;
        this.count = count;
    }

    get_value() {
        return this.value;
    }

    set_value(val) {
        this.value = val;
    }
    
    get_count() {
        return this.count;
    }

    set_count(val) {
        this.count = val;
    }
}

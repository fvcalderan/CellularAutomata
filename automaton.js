class Automaton {
    /* this class refers to a single cell. It should function as a basic struct and/or
     * grouping of values. The interaction between automata should be defined inside the
     * Automata class.
     *
     * Public methods:
     * constructor(value)
     * get_value()
     * set_value(val) */

    constructor(value) {
        this.value = value;
    }

    get_value() {
        return this.value;
    }

    set_value(val) {
        this.value = val;
    }
}

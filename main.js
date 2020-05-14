/* Authors:
 * Felipe Vaiano Calderan
 * Gabriel Augusto Lins Leal
 * Silvio de Souza Neves Neto */
 
// simulation variables
let rows = 30;
let cols = 30;
let size = 20;
let loneliness = 2;
let overpopulation = 3;
let reproduction = 3;
let insert_random_amount = 100;
let automata;
let running = false;

// color variables
let bg_color = 121;
let active_color = 215;
let inactive_color = 81;

// ui variables
let btn_play_pause
let btn_insert_random
let btn_clear_board
let lbl_status

function random_position(min, max) {
    // returns random (x, y) position dictionary
    return {x: floor(random(min+1, max-1)), y: floor(random(min+1, max-1))};
}

function insert_random_points() {
    // insert random points
    for (let i = 0; i < insert_random_amount; i++) {
        position = random_position(0, cols-1);
        automata.set_state(position["x"], position["y"], 1);
    }
    draw_board();
}

function toggle_simulation() {
    // set simulation parameters and start it
    running = !running;
    if (running) {
        lbl_status.html("Playing")
    } else {
        lbl_status.html("Paused")
    }
}

function reset_automata() {
    // initialize automata and draw the board
    automata.initialize();
    draw_board();
}

function create_UI() {
    // create user interface
    btn_play_pause = createButton("Play/Pause");
    btn_play_pause.position(20, 0);
    btn_play_pause.mousePressed(toggle_simulation);

    btn_insert_random = createButton("Insert Random");
    btn_insert_random.position(110, 0);
    btn_insert_random.mousePressed(insert_random_points);

    btn_clear_board = createButton("Clear Board");
    btn_clear_board.position(220, 0);
    btn_clear_board.mousePressed(reset_automata);

    lbl_status = createElement("h3", "Paused")
    lbl_status.position(340, -20);
}

function mousePressed() {
    // activate automaton with mouse click
    if (mouseX > size && mouseX < (cols-1)*size+size) {
        if (mouseY > size+10 && mouseY < (rows-1)*size+size+10) {
            index_x = floor((mouseX-size)/size);
            index_y = floor((mouseY-size-10)/size);

            // this toggle uses if/else instead of "!logic" in case automata
            // value system changes (for example: 0-255 instead of binary).
            if (automata.get_state(index_x, index_y) == 1) {
                automata.set_state(index_x, index_y, 0);
            } else {
                automata.set_state(index_x, index_y, 1);
            }

            draw_board();
        }
    }
}

function draw_board() {
    // draw the board based on the automata state
    for (let x = 0; x < cols-1; x++) {
        for (let y = 0; y < rows-1; y++) {
            if (automata.get_state(x, y) == 1) {
                fill(active_color);
            } else {
                fill(inactive_color);
            }
            rect(x*size+size, y*size+size+10, size, size);
        }
    }
}

function setup() {
    // this function runs only once
    createCanvas(cols*(size+1), rows*(size+1));
    background(bg_color);
    automata = new Automata(loneliness, overpopulation, 
                            reproduction, rows, cols);
    reset_automata();
    create_UI();
}

function draw() {
    // this function runs every frame in a loop
    if (!running) {
        return;
    }
    background(bg_color);
    automata.evolve();
    draw_board();
}

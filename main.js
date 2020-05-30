/* Authors:
 * Felipe Vaiano Calderan
 * Gabriel Augusto Lins Leal
 * Silvio de Souza Neves Neto */
 
// simulation variables
let rows = 50;
let cols = 50;
let start_point_x = 25;
let start_point_y = 0;
let size = 10;
let loneliness = 2;
let overpopulation = 3;
let reproduction = 3;
let automata, cnv;
let size_input, initial_input;
let mode = "Rule 30";
let insert_random_amount = 400;
// color variables
let active_color = "#2c3e50";
let inactive_color = "#ecf0f1";

// ui variables
let title_examples;
let generation = 0;
let running = false;
let btn_play_pause, btn_clear_board, dropdown, count, btn_ex1;


function random_position(min, max) {
    // returns random (x, y) position dictionary
    return {x: floor(random(min+1, max-1)), y: floor(random(min+1, max-1))};
}

function insert_random_points() {
    // insert random points
    automata.initialize();
    for (let i = 0; i < insert_random_amount; i++) {
        position = random_position(0, cols-1);
        automata.set_state(position["x"], position["y"], 1);
    }
    draw_board();
}

function insert_opt_one(){

    cols = 50;
    rows = 50;

    cnv = createCanvas(cols*(size+1), rows*(size+1));
    cnv.position(400, 0);
    automata = new Automata(loneliness, overpopulation, 
        reproduction, rows, cols);
    size_input.value(50);

    pts = [[2,6],
           [2,7],
           [3,6],
           [3,7],
           [12,6],
           [12,7],
           [12,8],
           [13,9],
           [13,5],
           [14,10],
           [15,10],
           [14,4],
           [15,4],
           [16,7],
           [17,5],
           [17,9],
           [18,6],
           [18,7],
           [18,8],
           [19,7],
           [22,4],
           [22,5],
           [22,6],
           [23,4],
           [23,5],
           [23,6],
           [24,3],
           [24,7],
           [26,2],
           [26,3],
           [26,7],
           [26,8],
           [36,4],
           [36,5],
           [37,4],
           [37,5],
        ]

    insert_random_amount = pts.length
    initial_input.value(insert_random_amount);

    automata.initialize();
    for (let i = 0; i < pts.length; i++) {
        automata.set_state(pts[i][0], pts[i][1], 1);
    }
    draw_board();
}

function toggle_simulation() {
    // set simulation parameters and start it
    size_input.attribute('disabled', '');
    initial_input.attribute('disabled', '');
    dropdown.attribute('disabled', '');

    running = !running
    if (running) {
        btn_play_pause.html("Pause");
    } else {
        btn_play_pause.html("Continue");
    }
}

function reset_automata() {
    // initialize automata and draw the board
    generation = 0;
    count.html("Generation: "+generation);
    running = false;
    btn_play_pause.html("Start");
    size_input.removeAttribute('disabled');
    initial_input.removeAttribute('disabled');
    dropdown.removeAttribute('disabled');
    automata.initialize();
    
    if (mode == "Rule 30"){
        points = initial_input.value().split(",");
        automata.set_state(start_point_x, start_point_y, 1);
        initial_input.value(start_point_x+","+start_point_y);
    }else{
        insert_random_points();
    }

    draw_board();
}

function update_automata(){
    cols = size_input.value();
    rows = size_input.value();

    cnv = createCanvas(cols*(size+1), rows*(size+1));
    cnv.position(400, 0);
    automata = new Automata(loneliness, overpopulation, 
        reproduction, rows, cols);

    // Computing start point
    if (mode == "Rule 30"){
        automata.initialize();
        points = initial_input.value().split(",");
        aux_x = int(points[0]);
        if (aux_x >= rows-1) aux_x = int(rows/2)-1;
        automata.set_state(aux_x, 0, 1);
        initial_input.value(aux_x+","+0);
        start_point_x, start_point_y = aux_x, 0;
    }else{
        insert_random_amount = int(initial_input.value());
        insert_random_points();
    }


    draw_board();
}

function btn_style(btn){
    btn.style("background-color", "#2980b9");
    btn.style("padding", "10px");
    btn.style("width", "140px");
    btn.style("border-width", "0");
    btn.style("border-radius", "2px");
    btn.style("color", "#ecf0f1");
    btn.style("cursor", "pointer");
    btn.style("box-shadow", "0 1px 2px rgba(0, 0, 0, .6)");
}

function create_UI() {
    // create user interface

    // Title
    title_txt = createElement("p", "Choose a model:");
    title_txt.position(40, 10);
    title_txt.style("letter-spacing", "0.5px"); 
    title_txt.style("color", "#2980b9");

    dropdown = createSelect();
    dropdown.option("Rule 30");
    dropdown.option("Game of life");
    dropdown.selected("Rule 30");
    dropdown.changed(changeMode);
    dropdown.position(40, 50);
    dropdown.style("width", "290px"); 
    dropdown.style("border", "1px solid #ddd");
    dropdown.style("border-radius", "3px");
    dropdown.style("transition", "border-color .1s ease-in-out,box-shadow .1s ease-in-out");
    dropdown.style("background-size", "10px");
    dropdown.style("padding", "10px 38px 10px 16px");
    dropdown.style("background", "#ecf0f1");
    dropdown.style("-moz-appearance", "none");
    dropdown.style("-webkit-appearance", "none");
    dropdown.style("appearance", "none");
    // example https://editor.p5js.org/aferriss/sketches/SJtxrLp3M

    title_para = createElement("p", "General parameters");
    title_para.position(40, 100);
    title_para.style("letter-spacing", "0.5px");
    title_para.style("color", "#d35400");

    // Input
    size_input = createInput("50");
    size_input.attribute("class", "fxph");
    size_input.attribute("placeholder", "");   
    size_input.position(40, 160);
    size_input.style("width", "140px");  
    size_input.style("font-size", "12px"); 
    size_input_label = createElement("label", "Cell size");
    size_input_label.attribute("id", "id-fxph");
    size_input_label.position(40, 160);

    // Initial position
    initial_input = createInput("25,0");
    initial_input.attribute("class", "fxph-1");
    initial_input.attribute("placeholder", "");   
    initial_input.position(190, 160);
    initial_input.style("width", "140px");  
    initial_input.style("font-size", "12px"); 
    initial_input_label = createElement("label", "Initial position");
    initial_input_label.attribute("id", "id-fxph-1");
    initial_input_label.position(190, 160);


    btn_play_pause = createButton("Start");
    btn_style(btn_play_pause);
    btn_play_pause.position(40, 250);
    btn_play_pause.mousePressed(toggle_simulation);

    btn_clear_board = createButton("Clear");
    btn_style(btn_clear_board);
    btn_clear_board.position(190, 250);
    btn_clear_board.mousePressed(reset_automata);

    btn_update = createButton("Update");
    btn_style(btn_update);
    btn_update.style("background-color", "#f1c40f");
    btn_update.style("width", "290px");
    btn_update.position(40, 200);
    btn_update.mousePressed(update_automata);
}

function changeMode() {
    mode = dropdown.value();
    
    if (mode == "Game of life"){
        initial_input.value(insert_random_amount);
        initial_input_label.html("# random pixels");
        insert_random_points();
        
        title_examples = createElement("p", "Examples");
        title_examples.position(40, 310);
        title_examples.style("letter-spacing", "0.5px");
        title_examples.style("color", "#d35400");

        btn_ex1 = createButton("Example 1");
        btn_style(btn_ex1);
        btn_ex1.style("width", "290px");
        btn_ex1.style("background-color", "#27ae60");
        btn_ex1.position(40, 360);
        btn_ex1.mousePressed(insert_opt_one);

    } else {

        title_examples.remove();
        btn_ex1.remove();
        start_point_x = int(rows/2)-1;
        start_point_y = 0;
        
        automata.initialize();
        automata.set_state(start_point_x, start_point_y, 1);
        initial_input.value(start_point_x+","+start_point_y);
        initial_input_label.html("Initial position");
        draw_board();
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
            rect(x*size+size, y*size+size+40, size-2, size-2);
            strokeWeight(0);
        }
    }
}

function setup() {
    count = createElement("p", "Generation: "+generation);
    count.position(405,0);
    create_UI();
    cnv = createCanvas(cols*(size+1), rows*(size+1));
    cnv.position(400, 0);
    automata = new Automata(loneliness, overpopulation, 
         reproduction, rows, cols);
    reset_automata();
}

function draw() {
    // Animation - Input cell size
    if (size_input.value() != "") size_input.attribute("class", "fxph has-content");
    else size_input.attribute("class", "fxph");

    if (initial_input.value() != "") initial_input.attribute("class", "fxph-1 has-content");
    else initial_input.attribute("class", "fxph-1");
    
    if (!running) return;

    generation += 1;
    count.html("Generation: "+generation);
    automata.evolve(mode);
    draw_board();
}

// button function example
// https://editor.p5js.org/luisa/sketches/HJv74TD6G
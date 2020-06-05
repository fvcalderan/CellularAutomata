/* Authors:
 * Felipe Vaiano Calderan
 * Gabriel Augusto Lins Leal
 * Silvio de Souza Neves Neto */

// simulation variables
let rows = 50;
let cols = 50;
let initial_value = "30";
let size = 10;
let loneliness = 2;
let overpopulation = 3;
let reproduction = 3;
let automata, cnv;
let size_input, initial_input, div_chart;
let mode = "Elementary CA";
let insert_random_amount = 500;
// color variables
let background_color = "#272822";
let active_color = "#d7d8d2";
let inactive_color = "#373832";
// ui variables
let title_examples;
let generation = 0;
let running = false;
let btn_play_pause, btn_clear_board, dropdown, count, btn_ex1;
let arrx = [0];
let arry = [1];

function insert_random_points() {
    // insert random points
    automata.initialize();
    let position_list = [];
    let aux;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            position_list.push({x: i, y: j});
        }
    }
    for (let i = 0; i < insert_random_amount; i++) {
        aux = floor(random(position_list.length));
        automata.set_state(position_list[aux].x, position_list[aux].y, 1);
        position_list.splice(aux, 1);
    }
}

function insert_opt_one(){

    rows = 50;
    cols = 50;

    cnv = createCanvas(cols*size+size*2, rows*size+size*2);
    cnv.position(380, 40);
    automata = new Automata(loneliness, overpopulation, reproduction, rows, cols);
    size_input.value("50,50");

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

    automata.initialize();
    for (let i = 0; i < pts.length; i++) {
        automata.set_state(pts[i][0], pts[i][1], 1);
    }

    arrx = [0];
    arry = [pts.length];
    graph(arrx, arry);
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
    
    if (mode == "Elementary CA") {
        automata.set_state(rows-1, floor(cols/2), 1);
        arry = [1];
    }
    else {
        insert_random_points();
        arry = [insert_random_amount];
    }
    draw_board();
    arrx = [0];
    graph(arrx, arry);
}

function update_automata() {
    generation = 0;
    count.html("Generation: "+generation);

    let aux = size_input.value().match(/\d+/g);
    if (aux == null) {
        rows = 50;
        cols = 50;
    }
    else {
        rows = aux[0];
        if (rows < 1) rows = 50;
        cols = aux[1];
        if (cols == undefined || cols < 1) cols = rows;
    }
    size_input.value(rows+","+cols);

    cnv = createCanvas(cols*size+size*2, rows*size+size*2);
    cnv.position(380, 40);
    automata = new Automata(loneliness, overpopulation, reproduction, rows, cols);
    
    div_chart.position(cols*size+size*2+400,120);

    aux = initial_input.value().match(/\d+/);
    if (mode == "Elementary CA") {
        automata.initialize();
        if (aux == null) {
            initial_input.value("30");
        }
        else if (aux[0] > 255 || aux[0] < 0) {
            initial_input.value("30");
        }
        else {
            initial_input.value(aux[0]);
        }
        initial_value = initial_input.value();
        automata.set_state(rows-1, floor(cols/2), 1);
        arry = [1];
    }
    else if (mode == "Game of life") {
        if (aux == null) {
            initial_input.value(floor(rows*cols*0.2));
            insert_random_amount = floor(rows*cols*0.2);
        }
        else if (aux[0] > rows*cols || aux[0] < 0) {
            initial_input.value(floor(rows*cols*0.2));
            insert_random_amount = floor(rows*cols*0.2);
        }
        else {
            initial_input.value(aux[0]);
            insert_random_amount = aux[0];
        }
        initial_value = initial_input.value();
        insert_random_points();
        arry = [insert_random_amount];
    }
    draw_board();
    arrx = [0];
    graph(arrx, arry);
}

function btn_style(btn){
    btn.style("background-color", "#f92672");
    btn.style("font-family", "Courier, monospace");
    btn.style("padding", "10px");
    btn.style("width", "140px");
    btn.style("border-width", "0");
    btn.style("border-radius", "2px");
    btn.style("color", "#000000");
    btn.style("cursor", "pointer");
    btn.style("box-shadow", "0 1px 2px rgba(0, 0, 0, .6)");
}

function create_UI() {
    // create user interface

    // Title
    title_txt = createElement("p", "Choose a model:");
    title_txt.position(40, 10);
    title_txt.style("font-family", "Courier, monospace");
    title_txt.style("color", "#a6e22e");

    dropdown = createSelect();
    dropdown.option("Elementary CA");
    dropdown.option("Game of life");
    dropdown.selected("Elementary CA");
    dropdown.changed(changeMode);
    dropdown.position(40, 50);
    dropdown.style("font-family", "Courier, monospace");
    dropdown.style("width", "290px"); 
    dropdown.style("border", "1px solid #ddd");
    dropdown.style("color", "#ffffff");
    dropdown.style("border-radius", "3px");
    dropdown.style("transition", "border-color .1s ease-in-out,box-shadow .1s ease-in-out");
    dropdown.style("background-size", "10px");
    dropdown.style("padding", "10px 38px 10px 16px");
    dropdown.style("background", "#373832");
    dropdown.style("-moz-appearance", "none");
    dropdown.style("-webkit-appearance", "none");
    dropdown.style("appearance", "none");
    // example https://editor.p5js.org/aferriss/sketches/SJtxrLp3M

    title_para = createElement("p", "General parameters");
    title_para.style("font-family", "Courier, monospace");
    title_para.position(40, 100);
    title_para.style("color", "#a6e22e");

    // Input
    size_input = createInput("50,50");
    size_input.attribute("class", "fxph");
    size_input.attribute("placeholder", "");   
    size_input.position(40, 160);
    size_input.style("width", "140px");  
    size_input.style("font-size", "12px"); 
    size_input.style("font-family", "Courier, monospace");
    size_input.style("color", "#ffffff");
    size_input_label = createElement("label", "Grid size");
    size_input_label.attribute("id", "id-fxph");
    size_input_label.position(40, 160);

    // Initial position
    initial_input = createInput("30");
    initial_input.attribute("class", "fxph-1");
    initial_input.attribute("placeholder", "");   
    initial_input.position(190, 160);
    initial_input.style("width", "140px");  
    initial_input.style("font-size", "12px"); 
    initial_input.style("font-family", "Courier, monospace");
    initial_input.style("color", "#ffffff");
    initial_input_label = createElement("label", "Rule");
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
    btn_update.style("background-color", "#fd971f");
    btn_update.style("width", "290px");
    btn_update.position(40, 200);
    btn_update.mousePressed(update_automata);

    div_chart = select('#chart');
    div_chart.position(cols*size+size*2+400,120);

}

function changeMode() {
    mode = dropdown.value();

    size_input.value("50,50");

    if (mode == "Game of life") {
        initial_input.value("500");
        initial_input_label.html("Random pixels");

        title_examples = createElement("p", "Examples");
        title_examples.position(40, 310);
        title_examples.style("color", "#a6e22e");

        btn_ex1 = createButton("Example 1");
        btn_style(btn_ex1);
        btn_ex1.style("width", "290px");
        btn_ex1.style("background-color", "#66d9ef");
        btn_ex1.position(40, 360);
        btn_ex1.mousePressed(insert_opt_one);
        arry = [insert_random_amount];
    }
    else {
        arry = [1];
        initial_input.value("30");
        initial_input_label.html("Rule");

        title_examples.remove();
        btn_ex1.remove();
    }

    update_automata();
    draw_board();
    arrx = [0];
    
    graph(arrx, arry);
}

function draw_board() {
    // draw the board based on the automata state
    strokeWeight(2);
    stroke("#ffffff");
    fill(background_color);
    rect(0, 0, width, height);
    strokeWeight(0);
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (automata.get_state(x, y) == 1) {
                fill(active_color);
            } else {
                fill(inactive_color);
            }
            rect(y*size+size, x*size+size, size-2, size-2);
        }
    }
}

function graph(arrx, arry){
    new Chartist.Line('#chart', {
        labels: arrx,
        series: [
            arry,
        ]
    }, {
        low: 0,
        showArea: true,
        width: 460,
        height: 320,
        axisX: {
            labelInterpolationFnc: function labelInterpolationFnc(value, index) {
                if(value % 60 === 0) return value;
                return null;
            }
        },
        chartPadding: {
            bottom: 20,
            left: 30
        },
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Generation',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 30
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: '# of activated cells',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: -5
                    },
                    textAnchor: 'middle',
                    flipTitle: false
                }
            })
        ]
    });
}

function setup() {
    count = createElement("p", "Generation: "+generation);
    count.style("font-family", "Courier, monospace");
    count.style("color", "#a6e22e");
    count.position(385,0);
    create_UI();
    cnv = createCanvas(cols*size+size*2, rows*size+size*2);
    cnv.position(380, 40);
    automata = new Automata(loneliness, overpopulation, reproduction, rows, cols);
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

    arrx.push(generation);
    arry.push(automata.get_unique()[1]);

    graph(arrx, arry);


}

// button function example
// https://editor.p5js.org/luisa/sketches/HJv74TD6G

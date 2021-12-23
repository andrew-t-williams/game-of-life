/////////////
// Globals //
/////////////

const CELL_WIDTH = 20  //px - includes a 1 px border drawn around each edge
const CELL_HEIGHT = 20 //px - includes a 1 px border drawn around each edge

// const BORDER_COLOUR = '#000000' // black
// const ALIVE_COLOUR = '#000000' // black
// const DEAD_COLOUR = '#ffffff'  // white

// Control buttons
const start_button = document.getElementById('start_game')
const stop_button = document.getElementById('stop_game')
const advance_button = document.getElementById('advance_game')
const clear_button = document.getElementById('clear_game')

// Settings inputs
const living_colour_selector = document.getElementById('living_colour')
const dead_colour_selector = document.getElementById('dead_colour')
const grid_colour_selector = document.getElementById('grid_colour')
const speed_selector = document.getElementById('speed_selector')
const speed_indicator = document.getElementById('speed_indicator')
const grid_x_input = document.getElementById('grid_x_input')
const grid_y_input = document.getElementById('grid_y_input')

var interval_length = speed_selector.value // Iteration delay of game loop

var living_colour = living_colour_selector.value
var dead_colour = dead_colour_selector.value
var grid_colour = grid_colour_selector.value

var grid_x_count = +grid_x_input.value         // Number of cells
var grid_y_count = +grid_y_input.value         // Number of cells
var canvas_width = grid_x_count * CELL_WIDTH   // Raw value, in px
var canvas_height = grid_y_count * CELL_HEIGHT // Raw value, in px

var canvas = document.getElementById('game');
canvas.width = canvas_width
canvas.height = canvas_height
var context = canvas.getContext('2d');

var running = false
var interval

//////////
// Init //
//////////

var cells = initCells(grid_x_count, grid_y_count)
drawCells(cells)

///////////////
// Functions //
///////////////

function gameLoop() {
    cells = advanceState(cells)
    drawCells(cells)
}

function advanceState(cells) {
    var next = initCells(grid_x_count, grid_y_count)
    for (var x = 0; x < grid_x_count; x++) {
        for (var y = 0; y < grid_y_count; y++) {
            var state = cells[x][y];
            let neighbors = countNeighbors(cells, x, y);

            if (state == 0 && neighbors == 3) {
                next[x][y] = 1;
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                next[x][y] = 0;
            } else {
                next[x][y] = state;
            }
        }
    }
    return next
}

function countNeighbors(cells, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            sum += cells[(x + i + grid_x_count) % grid_x_count][(y + j + grid_y_count) % grid_y_count];
        }
    }
    return sum - cells[x][y];
}

function initCells(x, y) {
    var columns = new Array(x)
    for (var i = 0; i < x; i++) {
        columns[i] = new Array(y)
        columns[i].fill(0)
    }
    return columns;
}

function clearCells(cells) {
    for (var x = 0; x < grid_x_count; x++) {
        for (var y = 0; y < grid_y_count; y++) {
            cells[x][y] = 0
        }
    }
}

function drawCells(cells) {
    for (var x = 0; x < grid_x_count; x++) {
        for (var y = 0; y < grid_y_count; y++) {
            drawCell(x, y, context, cells[x][y])
        }
    }
}

function changeDimensionCells(cells, new_x_count, new_y_count) {
    var newCells = initCells(new_x_count, new_y_count)
    var min_x_count = Math.min(cells.length, new_x_count)
    var min_y_count = Math.min(cells[0].length, new_y_count)
    for (var x = 0; x < min_x_count; x++) {
        for (var y = 0; y < min_y_count; y++) {
            newCells[x][y] = cells[x][y]
        }
    }
    return newCells
}

// Value: truthy -> fills with 1
//             0 -> fills with 0
//          else -> fills randomly 0 or 1
function drawCell(x, y, context, value) {
    var alive = (value ? 1 : (value == 0 ? 0 : Math.floor(Math.random() * 2)))
    context.fillStyle = grid_colour
    context.fillRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    context.fillStyle = alive ? living_colour : dead_colour
    context.fillRect(x * CELL_WIDTH + 1, y * CELL_HEIGHT + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
}

canvas.addEventListener("mousedown", function (event) {
    let rect = canvas.getBoundingClientRect()
    let x = Math.floor((event.clientX - rect.left) / CELL_WIDTH)
    let y = Math.floor((event.clientY - rect.top) / CELL_HEIGHT)
    cells[x][y] = !cells[x][y]
    drawCells(cells)
})

//////////////
// Controls //
//////////////

// Start button
start_button.onclick = function () {
    start_button.disabled = true
    stop_button.disabled = false
    advance_button.disabled = true
    running = true
    interval = setInterval(gameLoop, 1000 / interval_length);
}

// Stop button
stop_button.onclick = function () {
    start_button.disabled = false
    stop_button.disabled = true
    advance_button.disabled = false
    running = false
    clearInterval(interval);
}

// Advance button
advance_button.onclick = function () {
    gameLoop()
}

// Clear button
clear_button.onclick = function () {
    clearCells(cells)
    drawCells(cells)
}

// Speed Selector
speed_selector.oninput = function () {
    interval_length = speed_selector.value
    speed_indicator.innerText = 'Speed: ' + interval_length + ' fps'
    if (running) {
        clearInterval(interval)
        interval = setInterval(gameLoop, 1000 / interval_length)
    }
}

// Living Colour Selector
living_colour_selector.oninput = function () {
    living_colour = living_colour_selector.value
    drawCells(cells)
}

// Dead Colour Selector
dead_colour_selector.oninput = function () {
    dead_colour = dead_colour_selector.value
    drawCells(cells)
}

// Grid Colour Selector
grid_colour_selector.oninput = function () {
    grid_colour = grid_colour_selector.value
    drawCells(cells)
}

// Grid width stepper buttons
$('.grid_x_stepper').click(function () {
    grid_x_input.value = +grid_x_input.value + +$(this).html()
    grid_x_input.onchange();
});

// Grid height stepper buttons
$('.grid_y_stepper').click(function () {
    grid_y_input.value = +grid_y_input.value + +$(this).html()
    grid_y_input.onchange();
});

// Grid width input
grid_x_input.onchange = function () {
    grid_x_count = +grid_x_input.value
    canvas_width = grid_x_count * CELL_WIDTH
    canvas.width = canvas_width
    cells = changeDimensionCells(cells, grid_x_count, grid_y_count)
    drawCells(cells)
}

// Grid height input
grid_y_input.onchange = function () {
    grid_y_count = +grid_y_input.value
    canvas_height = grid_y_count * CELL_HEIGHT
    canvas.height = canvas_height
    cells = changeDimensionCells(cells, grid_x_count, grid_y_count)
    drawCells(cells)
}

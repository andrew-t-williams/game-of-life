/////////////
// Globals //
/////////////

const CANVAS_WIDTH = document.getElementById('game').width
const CANVAS_HEIGHT = document.getElementById('game').height
const CELL_WIDTH = 20  //px - includes a 1 px border drawn around each edge
const CELL_HEIGHT = 20 //px - includes a 1 px border drawn around each edge
const X_COUNT = CANVAS_WIDTH / CELL_WIDTH
const Y_COUNT = CANVAS_HEIGHT / CELL_HEIGHT

// const BORDER_COLOUR = '#000000' // black
// const ALIVE_COLOUR = '#000000' // black
// const DEAD_COLOUR = '#ffffff'  // white

// Control buttons
const start_button = document.getElementById('start_game')
const stop_button = document.getElementById('stop_game')
const advance_button = document.getElementById('advance_game')
const clear_button = document.getElementById('clear_game')

// Settings
const living_colour_selector = document.getElementById('living_colour')
const dead_colour_selector = document.getElementById('dead_colour')
const grid_colour_selector = document.getElementById('grid_colour')
const speed_selector = document.getElementById('speed_selector')
const speed_indicator = document.getElementById('speed_indicator')

var interval_length = speed_selector.value
var living_colour = living_colour_selector.value
var dead_colour = dead_colour_selector.value
var grid_colour = grid_colour_selector.value

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var running = false
var interval

//////////
// Init //
//////////

var cells = initCells(X_COUNT, Y_COUNT)
drawCells(cells)

///////////////
// Functions //
///////////////

function gameLoop() {
    cells = advanceState(cells)
    drawCells(cells)
}

function advanceState(cells) {
    var next = initCells(X_COUNT, Y_COUNT)
    for (var x = 0; x < X_COUNT; x++) {
        for (var y = 0; y < Y_COUNT; y++) {
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
            sum += cells[(x + i + X_COUNT) % X_COUNT][(y + j + Y_COUNT) % Y_COUNT];
        }
    }
    return sum - cells[x][y];
}

function drawCells(cells) {
    for (var x = 0; x < X_COUNT; x++) {
        for (var y = 0; y < Y_COUNT; y++) {
            drawCell(x, y, context, cells[x][y])
        }
    }
}

function clearCells(cells) {
    for (var x = 0; x < X_COUNT; x++) {
        for (var y = 0; y < Y_COUNT; y++) {
            cells[x][y] = 0
        }
    }
}

function initCells(x, y) {
    var columns = new Array(x)
    for (var i = 0; i < x; i++) {
        columns[i] = new Array(y)
        columns[i].fill(0)
    }
    return columns;
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

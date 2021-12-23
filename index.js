// Variables
const CANVAS_WIDTH = document.getElementById('game').width
const CANVAS_HEIGHT = document.getElementById('game').height
const CELL_WIDTH = 20  //px - includes a 1 px border drawn around each edge
const CELL_HEIGHT = 20 //px - includes a 1 px border drawn around each edge
const X_COUNT = CANVAS_WIDTH / CELL_WIDTH
const Y_COUNT = CANVAS_HEIGHT / CELL_HEIGHT

const BORDER_COLOUR = '#000000' // black
const ALIVE_COLOUR = '#000000' // black
const DEAD_COLOUR = '#ffffff'  // white

canvas = document.getElementById('game');
context = canvas.getContext('2d');

var cells = initCells(X_COUNT, Y_COUNT)
drawCells(cells)
var interval

// Start button
document.getElementById('start_game').onclick = function () {
    document.getElementById('start_game').disabled = true
    document.getElementById('stop_game').disabled = false
    document.getElementById('advance_game').disabled = true
    interval = setInterval(gameLoop, 500);
}

// Stop button
document.getElementById('stop_game').onclick = function () {
    document.getElementById('start_game').disabled = false
    document.getElementById('stop_game').disabled = true
    document.getElementById('advance_game').disabled = false
    clearInterval(interval); // to stop
}

// Advance button
document.getElementById('advance_game').onclick = function () {
    gameLoop()
}

// Clear button
document.getElementById('clear_game').onclick = function () {
    clearCells(cells)
    drawCells(cells)
}

function gameLoop() {
    console.log('Looping...')
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


canvas.addEventListener("mousedown", function (e) {
    getMousePosition(canvas, e);
})

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect()
    let x = Math.floor((event.clientX - rect.left) / CELL_WIDTH)
    let y = Math.floor((event.clientY - rect.top) / CELL_HEIGHT)
    cells[x][y] = !cells[x][y]
    drawCells(cells)
    console.log("Coordinate x: " + x,
        "Coordinate y: " + y);
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
    context.fillStyle = BORDER_COLOUR
    context.fillRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    context.fillStyle = alive ? ALIVE_COLOUR : DEAD_COLOUR
    context.fillRect(x * CELL_WIDTH + 1, y * CELL_HEIGHT + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
}

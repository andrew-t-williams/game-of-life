// Author: Andrew Thomas Williams

////////////////////////////
// General Initialization //
////////////////////////////

// Opens all links in new tab, for wiki mostly. 
$("a").each(function () {
    $(this).attr('target', '_blank')
    $(this).attr('rel', 'noopener noreferrer')
})

// Click default tab
document.getElementById('stats_tab_link').click()

// Init game board
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
gridFillScreen()

// Create cells 2D array
var cells = initCells(grid_x_count, grid_y_count)

// One game loop: draws cells and populates initial stats
gameLoop()

///////////////
// Functions //
///////////////

function gameLoop() {
    // Calculate next state
    // Fade dying cells based on changes if required
    if (fade_switch.checked && running) {
        var oldCells = cells
        cells = advanceState(cells)
        var dyingCells = filterDyingCells(oldCells, cells)
        drawCells(cells, dyingCells)
    } else {
        cells = advanceState(cells, null)
        drawCells(cells)
    }

    timingStats()
}

function countLivingCells(cells) {
    var living = 0
    for (var x = 0; x < grid_x_count; x++) {
        living += cells[x].reduce(arrayadd, 0)
    }
    return living
}

function filterDyingCells(oldCells, newCells) {
    var dyingCells = initCells(grid_x_count, grid_y_count)
    for (var x = 0; x < grid_x_count; x++) {
        for (var y = 0; y < grid_y_count; y++) {
            if (oldCells[x][y] && !newCells[x][y]) {
                dyingCells[x][y] = 1
            }
        }
    }
    return dyingCells
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
    return cells
}

function drawCells(cells, dyingCells) {
    if (dyingCells) {
        var alpha = 0
        var i = 0
        var deathLoop = setInterval(function () {
            for (var x = 0; x < grid_x_count; x++) {
                for (var y = 0; y < grid_y_count; y++) {
                    var value = cells[x][y]
                    var alive = (value ? 1 : (value == 0 ? 0 : Math.floor(Math.random() * 2)))
                    context.fillStyle = alive ? living_colour : dead_colour
                    if (dyingCells[x][y] == 1) {
                        context.globalAlpha = alpha
                    }
                    context.fillRect(x * CELL_WIDTH + 1, y * CELL_HEIGHT + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
                    context.globalAlpha = 1
                }
            }

            alpha += 0.03
            i++
            if (i >= 10) {
                clearInterval(deathLoop)
            }
        }, 100 / interval_length)
    } else {
        for (var x = 0; x < grid_x_count; x++) {
            for (var y = 0; y < grid_y_count; y++) {
                drawCell(x, y, context, cells[x][y])
            }
        }
    }
    // To show most accurate stats, they should be calculated on each draw
    nonTimingStats()
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


function gridFillScreen() {
    grid_x_count = Math.floor(left_content.offsetWidth / CELL_WIDTH)
    grid_y_count = Math.floor(left_content.offsetHeight / CELL_HEIGHT)
    stat_total_cells.value = grid_x_count * grid_y_count
    canvas_width = grid_x_count * CELL_WIDTH
    canvas_height = grid_y_count * CELL_HEIGHT
    grid_x_input.value = grid_x_count
    grid_y_input.value = grid_y_count
    canvas.width = canvas_width
    canvas.height = canvas_height
}

function arrayadd(accumulator, a) {
    return accumulator + a;
}

/////////////////////////
// Controls / OnClicks //
/////////////////////////

// Drawing cells
canvas.addEventListener("mousedown", function (event) {
    let rect = canvas.getBoundingClientRect()
    let x = Math.floor((event.clientX - rect.left) / CELL_WIDTH)
    let y = Math.floor((event.clientY - rect.top) / CELL_HEIGHT)
    cells[x][y] = !cells[x][y]
    drawCells(cells)
})

// Start button
start_button.onclick = function () {
    start_button.disabled = true
    stop_button.disabled = false
    advance_button.disabled = true
    running = true
    game_interval = setInterval(gameLoop, 1000 / interval_length);
}

// Stop button
stop_button.onclick = function () {
    start_button.disabled = false
    stop_button.disabled = true
    advance_button.disabled = false
    running = false
    clearInterval(game_interval);
    drawCells(cells)
}

// Advance button
advance_button.onclick = function () {
    gameLoop()
}

// Clear button
clear_button.onclick = function () {
    cells = clearCells(cells)
    drawCells(cells)
}

// Speed Selector
speed_selector.oninput = function () {
    interval_length = speed_selector.value
    stat_ideal_framerate.value = interval_length
    speed_indicator.innerText = 'Speed: ' + interval_length + ' fps'
    if (running) {
        clearInterval(game_interval)
        game_interval = setInterval(gameLoop, 1000 / interval_length)
    }
}

// Max speed switch
max_speed_switch.onchange = function () {
    // under_construction
    if (max_speed_switch.checked) {
        interval_length = 999999
        stat_ideal_framerate.value = interval_length
        speed_indicator.innerText = 'Speed: CPU limited'
        document.getElementById('speed_bar').classList.add("under_construction");
    } else {
        interval_length = speed_selector.value
        stat_ideal_framerate.value = interval_length
        speed_indicator.innerText = 'Speed: ' + interval_length + ' fps'
        document.getElementById('speed_bar').classList.remove("under_construction");
    }
    if (running) {
        clearInterval(game_interval)
        game_interval = setInterval(gameLoop, 1000 / interval_length)
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
    var max = +grid_x_input.getAttribute('max')
    var min = +grid_x_input.getAttribute('min')
    if (grid_x_count > max) {
        grid_x_count = max
    } else if (grid_x_count < min) {
        grid_x_count = min
    }
    grid_x_input.value = grid_x_count
    stat_total_cells.value = grid_x_count * grid_y_count
    canvas_width = grid_x_count * CELL_WIDTH
    canvas.width = canvas_width
    cells = changeDimensionCells(cells, grid_x_count, grid_y_count)
    drawCells(cells)
}

// Grid height input
grid_y_input.onchange = function () {
    grid_y_count = +grid_y_input.value
    var max = +grid_y_input.getAttribute('max')
    var min = +grid_y_input.getAttribute('min')
    if (grid_y_count > max) {
        grid_y_count = max
    } else if (grid_y_count < min) {
        grid_y_count = min
    }
    grid_y_input.value = grid_y_count
    stat_total_cells.value = grid_x_count * grid_y_count
    canvas_height = grid_y_count * CELL_HEIGHT
    canvas.height = canvas_height
    cells = changeDimensionCells(cells, grid_x_count, grid_y_count)
    drawCells(cells)
}

// Grid Fill Screen
grid_fill_screen_button.onclick = function () {
    gridFillScreen()
    cells = changeDimensionCells(cells, grid_x_count, grid_y_count)
    drawCells(cells)
}

// When the user clicks the button, open the modal 
info_button.onclick = function () {
    info_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
info_close.onclick = function () {
    info_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == info_modal) {
        info_modal.style.display = "none";
    }
}

// Open Tab
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Enable/Disable Stats
stats_switch.onchange = function () {
    if (stats_switch.checked) {
        // stats_warning.style.display = "none";
        advanced_stats.style.display = "block";
    } else {
        // stats_warning.style.display = "block";
        advanced_stats.style.display = "none";
    }
}
/////////////
// Globals //
/////////////

const CELL_WIDTH = 20  //px - includes a 1 px border drawn around each edge
const CELL_HEIGHT = 20 //px - includes a 1 px border drawn around each edge

// Control buttons
const start_button = document.getElementById('start_game')
const stop_button = document.getElementById('stop_game')
const advance_button = document.getElementById('advance_game')
const clear_button = document.getElementById('clear_game')

// Information Modal
const info_modal = document.getElementById("info_modal");
const info_button = document.getElementById("info_button");
const info_close = document.getElementsByClassName("info_close")[0];

const left_content = document.getElementById('left_content')

// Setting elements
const fade_switch = document.getElementById('fade_switch')
const stats_switch = document.getElementById('stats_switch')
const advanced_stats = document.getElementById('advanced_stats')
const living_colour_selector = document.getElementById('living_colour')
const dead_colour_selector = document.getElementById('dead_colour')
const grid_colour_selector = document.getElementById('grid_colour')
const speed_selector = document.getElementById('speed_selector')
const speed_indicator = document.getElementById('speed_indicator')
const max_speed_switch = document.getElementById('max_speed_switch')
const grid_x_input = document.getElementById('grid_x_input')
const grid_y_input = document.getElementById('grid_y_input')
const grid_fill_screen_button = document.getElementById('grid_fill_screen_button')

// Calculated globals
var interval_length = speed_selector.value       // desired fps of game loop

var living_colour = living_colour_selector.value
var dead_colour = dead_colour_selector.value
var grid_colour = grid_colour_selector.value
var running = false
var interval, grid_x_count, grid_y_count, canvas_width, canvas_height

////////////////
// Statistics //
////////////////
// truth based on 'stats_switch.checked'
const stat_ideal_framerate = document.getElementById('stat_ideal_framerate')
const stat_real_framerate = document.getElementById('stat_real_framerate')
const stat_framerate_diff = document.getElementById('stat_framerate_diff')
const stat_total_cells = document.getElementById('stat_total_cells')
const stat_dead_cells = document.getElementById('stat_dead_cells')
const stat_living_cells = document.getElementById('stat_living_cells')
const stat_living_ratio = document.getElementById('stat_living_ratio')

const stat_living_cells_max = document.getElementById('stat_living_cells_max')
const stat_living_ratio_max = document.getElementById('stat_living_ratio_max')


stat_ideal_framerate.value = interval_length

const stat_frame_array_length = 10
var stat_frame_count = 0
var stat_framerate_array = []
var stat_now = performance.now()

var stat_fps_chart = new Chart("historicalFPSChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: "green",
            fill: true
        }, {
            data: [],
            borderColor: "blue",
            fill: true
        },
        ]
    },
    options: {
        legend: { display: false }
    }
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    for (var i = 0; i < data.length; i++) {
        chart.data.datasets[i].data.push(data[i])
    }
    chart.update();
}


function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}

var yValues = [100, 420];

var stat_living_ratio_chart = new Chart("livingRatioChart", {
    type: "pie",
    data: {
        // labels: xValues,
        datasets: [{
            backgroundColor: ['red', 'black'],
            data: [0, 1]
        }]
    },
    options: {
        title: {
            display: false,
            text: "World Wide Wine Production 2018"
        },
        layout: {
            margin: 0
        }
    }
});

document.getElementById('livingRatioChart').setAttribute('style', 'float: left; width:93px; height: 93px;')

var stat_living_ratio_max_chart = new Chart("livingRatioMaxChart", {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            backgroundColor: ['purple', 'black'],
            data: [0, 1]
        }]
    },
    options: {
        title: {
            display: false,
            text: "World Wide Wine Production 2018"
        }
    }
});

//////////
// Init //
//////////

// For wiki mostly. Opens links in new tab
$("a").each(function () {
    $(this).attr('target', '_blank')
    $(this).attr('rel', 'noopener noreferrer')
})

// Default Tab
document.getElementById('stats_tab_link').click()


var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
gridFillScreen()
var cells = initCells(grid_x_count, grid_y_count)
gameLoop()
// drawCells(cells)

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

function timingStats() {
    // Calculate timestamps
    var stat_last = stat_now
    stat_now = performance.now()
    stat_framerate_array[stat_frame_count % stat_frame_array_length] = stat_now - stat_last
    stat_frame_count++

    // Twice every array length calculate and display framerate
    if (stat_frame_count % (stat_frame_array_length / 2) == 0) {
        var real_framerate = (1000 * stat_frame_array_length) / stat_framerate_array.reduce(arrayadd, 0)
        var rounded_real_framerate = Math.round(real_framerate * 1000) / 1000
        stat_real_framerate.value = rounded_real_framerate
        var raw_fps_lag = ((stat_ideal_framerate.value * 100) / real_framerate) - 100
        var rounded_fps_lag = (Math.round((raw_fps_lag) * 1000) / 1000)
        stat_framerate_diff.value = (rounded_fps_lag > 1000 ? ">1000" : rounded_fps_lag) + "%"

        addData(stat_fps_chart, stat_frame_count, [stat_ideal_framerate.value, real_framerate])
        var num_visible_data_points = 10
        if (stat_frame_count > num_visible_data_points * stat_frame_array_length / 2) {
            removeData(stat_fps_chart)
        }
    }
    // console.log(stat_frame_count)
    // if (stat_frame_count >= stat_frame_array_length) { stat_frame_count = 0 }

    // Hide certain stats if game is advenced using button
    if (!running) {
        stat_real_framerate.value = "--"
        stat_framerate_diff.value = "--"
    }
}

function nonTimingStats() {
    // Optional statistics
    if (stats_switch.checked) {
        var living = countLivingCells(cells)
        var total = (grid_x_count * grid_y_count)
        var living_ratio = Math.round((living / total) * 1000) / 10

        stat_living_cells.value = living
        stat_dead_cells.value = total - living
        stat_living_ratio.value = living_ratio + "%"
        if (living > stat_living_cells_max.value) {
            stat_living_cells_max.value = living
            stat_living_ratio_max.value = living_ratio + "%"
            stat_living_ratio_max_chart.data.datasets[0].data = [living, total - living]
            stat_living_ratio_max_chart.update()
        }

        stat_living_ratio_chart.data.datasets[0].data = [living, total - living]
        stat_living_ratio_chart.update()


    }
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
        clearInterval(interval)
        interval = setInterval(gameLoop, 1000 / interval_length)
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
// Author: Andrew Thomas Williams

// Adanced stats based on 'stats_switch.checked'

// Stat related DOMs
const stat_ideal_framerate = document.getElementById('stat_ideal_framerate')
const stat_real_framerate = document.getElementById('stat_real_framerate')
const stat_framerate_diff = document.getElementById('stat_framerate_diff')
const stat_total_cells = document.getElementById('stat_total_cells')
const stat_dead_cells = document.getElementById('stat_dead_cells')
const stat_living_cells = document.getElementById('stat_living_cells')
const stat_living_ratio = document.getElementById('stat_living_ratio')
const stat_living_cells_max = document.getElementById('stat_living_cells_max')
const stat_living_ratio_max = document.getElementById('stat_living_ratio_max')

const stat_frame_array_length = 10
var stat_framerate_array = []

var stat_frame_count = 0
var stat_now = performance.now() // Avoids NaN stats when game starts

stat_ideal_framerate.value = interval_length

///////////////////
// Create Charts //
///////////////////

var stat_fps_chart = new Chart("historicalFPSChart", {
    type: "line",
    data: {
        datasets: [{
            data: [],
            borderColor: "green"
        }, {
            data: [],
            borderColor: "blue"
        }]
    },
    options: { legend: { display: false } }
});

var stat_living_ratio_chart = new Chart("livingRatioChart", {
    type: "pie",
    data: {
        datasets: [{
            backgroundColor: ['red', 'black'],
            data: [0, 1]
        }]
    },
    options: {
        elements: {
            arc: {
                borderWidth: 1
            }
        }
    }
});

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
        elements: {
            arc: {
                borderWidth: 1
            }
        }
    }
});

//////////////////////////
// Statistics Functions //
//////////////////////////

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
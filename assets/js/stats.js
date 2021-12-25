// Author: Andrew Thomas Williams

// truth based on 'stats_switch.checked'

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
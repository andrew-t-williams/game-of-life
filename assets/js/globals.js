// Author: Andrew Thomas Williams

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

var living_colour = living_colour_selector.value
var dead_colour = dead_colour_selector.value
var grid_colour = grid_colour_selector.value

var game_interval
var interval_length = speed_selector.value
var running = false



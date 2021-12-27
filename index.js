// Author: Andrew Thomas Williams

////////////////////
// Initialization //
////////////////////

// Opens all links in new tab, for wiki mostly. 
$("a").each(function () {
    $(this).attr('target', '_blank')
    $(this).attr('rel', 'noopener noreferrer')
})

// Populate pattern canvases
drawPatternPreviews()

// Click default tab
document.getElementById('patterns_tab_link').click()

// Init game board
var context = canvas.getContext('2d');
gridFillScreen()

// Create cells 2D array
var cells = initCells(grid_x_count, grid_y_count)

// One game loop: draws cells and populates initial stats
gameLoop()
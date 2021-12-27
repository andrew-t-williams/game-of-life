// Author: Andrew Thomas Williams

var patterns

function drawPatternPreviews() {
    $.getJSON("/assets/json/patterns.json", function (json) {
        patterns = json
        for (var i = 0; i < patterns.length; i++) {
            for (var x = 0; x < patterns[i].data.length; x++) {
                for (var y = 0; y < patterns[i].data[0].length; y++) {
                    drawCell(x, y, document.getElementById(patterns[i].id).getContext('2d'), patterns[i].data[x][y])
                }
            }
        }
    })
}

// Return the currently selected pattern
function currentPattern() {
    var pattern
    $('.pattern_radio').each(function () {
        if ($(this).prop("checked")) {
            for (i = 0; i < patterns.length; i++) {
                if (patterns[i].id == $(this).attr('value')) {
                    pattern = patterns[i].data
                }
            }
        }
    })
    return pattern
}

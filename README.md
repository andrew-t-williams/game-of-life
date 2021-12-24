# Conway's Game of Life
An interactive web app to visualize Conway's Game of Life. 

Two dimentional grid of cells. Each cell is either dead or alive, and each generation or frame has rules of how a cell's state changes. Evaluations are based on surrounding cells.

## Rules:
* Any live cell with fewer than two live neighbours dies, as if by underpopulation.
* Any live cell with two or three live neighbours lives on to the next generation.
* Any live cell with more than three live neighbours dies, as if by overpopulation.
* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

which is to say, the only changes are:

Current state 0:
* Becomes 1 if surrounded by exactly 3 live cells

Current state 1:
* Becomes 0 if surrounded by <2 or >3 live cells

## Design:

HTML canvas to draw the grid. setInterval() and clearInterval() for iterating through the game loop. 

## TODOs and ideas:
- [ ] Have scene editor that allows you to drop in existing creations
  - [ ] Add all elements in the [wiki](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
    * still lifes
    * oscillators
    * spaceships
    * guns
    * logic gates
- [ ] Cookies to remember settings
- [ ] Info modal opens on page load
- [ ] Info modal able to disable auto opening -> cookies to remember
- [ ] ToolTips to explain functionality:
  - [ ] How each stat is calculated
    * Framerate -> 10 frame average
- [ ] Game of Life in Game of Life
- [ ] Boundary conditions: (infinite loop, hard walls, drawble, portals)
- [ ] Hexagonal
- [ ] Optimize draw time
  - [ ] Display calculation time and efficiency (desired fps vs actual) stats for an improvement metric
  - [ ] only draw changed cells?
  - [ ] indicate to user which settings cause the most slowdown (e.g. fade, size of map)

### Completed TODOs
- [X] Change speed, pause, play
- [X] Infinite borders [Trefoil_knot](https://en.wikipedia.org/wiki/)
- [X] Cosmetic editor
  - [X] Colour of live/dead cells
  - [X] Colour grid lines
  - [X] Change size of grid, keeps live squares where possible.
  - [X] Fade when dying
- [X] Info modal to explain the game:
  - [X] Opens when clicking the info icon in top right
- [X] Analysis sidebar
  - [X] Real fps, target fps, lag.
  - [X] Cell count, alive, dead, ratio, peak
  - [X] Timed stats update when game is run
  - [X] Non timed stats update on grid change
- [X] Host on andrew-williams.dev/game-of-life, make a post on andrew-williams.dev linking to it.

### Local Dev
I use [Live Server](https://github.com/ritwickdey/vscode-live-server) on Visual Studio Code to test locally.

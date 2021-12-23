# game-of-life
An interactive visualization of Conway's Game of Life. 

Two dimentional grid of cells. Each cell has a state (0, 1), and each generation or frame has rules of how a cells states change. Evaluations are based on surrounding cells.

## Rules:
* Any live cell with fewer than two live neighbours dies, as if by underpopulation.
* Any live cell with two or three live neighbours lives on to the next generation.
* Any live cell with more than three live neighbours dies, as if by overpopulation.
* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

which is to say, the only changes are:

Current state 0:
* Becomes 1 surrounded by exactly 3 live cells
Current state 1:
* Becomes 0 if surrounded by <2 or >3 live cells

## Design:

## TODOs and ideas:
- [ ] Have scene editor that allows you to drop in existing creations
  - [ ] Add all elements in the [wiki](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
    * still lifes
    * oscillators
    * spaceships
    * guns
    * logic gates
- [X] Change speed, pause, play
- [ ] Cosmetic editor
  - [X] Colour of live/dead cells
  - [X] Colour grid lines
  - [X] Change size of grid, keeps live squares where possible.
  - [ ] Fade when dying
- [ ] Analysis sidebar (current count, stats?)
- [ ] Game of Life in Game of Life
- [ ] 3D versions: [Trefoil_knot](https://en.wikipedia.org/wiki/)
- [ ] Boundary conditions: (infinite loop, hard walls, drawble, portals)
- [ ] Hexagonal

### Local Dev
I use [Live Server](https://github.com/ritwickdey/vscode-live-server) on Visual Studio Code to test locally.
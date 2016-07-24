// tried to write that AI pathfinding myself
// figured out that it might take ages
// end up using https://github.com/qiao/PathFinding.js
// gretel is my pathfinder visualizer
let grid, finder, path;

/* Gretel */
function gretel() {
  // Setup the board for the pathfinder
  // see https://github.com/qiao/PathFinding.js for more info
  grid = new PF.Grid(boardSize / 10, boardSize / 10);
  clearOlds();
  // setup a new finder
  finder = new PF.BestFirstFinder({
    heuristic: PF.Heuristic.euclidean
  });
  // draw a new one
  path = finder.findPath(startField.fX, startField.fY, endField.fX, endField.fY, grid);
  if (path.length > 0) {
    for(let i = 0; i < path.length; i++) {
      // path[i][0] // fX coordinate
      // path[i][1] // fY coordinate
      for(let j = 0; j < fields.length; j++) {
        // get the field with the corresponding coordinates
        if (fields[j].fX === path[i][0] && fields[j].fY === path[i][1]) {
          // add the breadcrumbs class
          fields[j].e.className += ' gretel__breadcrumb';
        }
      }
    }
    return true;
  } else {
    return false;
  }

  function clearOlds() {
    // clear any old path and
    // get blocked Fields
    for(let i = 0; i < fields.length; i++) {
      if (fields[i].e.className.indexOf('gretel__breadcrumb') > -1) {
        fields[i].e.classList.remove('gretel__breadcrumb');
      }
      if (fields[i].e.className.indexOf('tower') > -1) {
        fields[i].lock('tower');
      }
      if (fields[i].locked && fields[i].pos !== startField.pos && fields[i].pos !== endField.pos && fields[i].locked === 'tower') {
        grid.setWalkableAt(fields[i].fX, fields[i].fY, false);
      }
    }
  }
}

function setupGretel() {
  // Setup Gretel
  gretel();
}

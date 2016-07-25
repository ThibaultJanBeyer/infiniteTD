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
    handlePath();
    return true;
  } else {
    return false;
  }

  function handlePath() {
    let corner;
    for(let i = 0; i < path.length; i++) {
      // path[i][0] // fX coordinate
      // path[i][1] // fY coordinate
      // check if it is a corner field
      let _fields = getFields(i, path);
      let checks = checkFields(_fields);

      corner = '';
      for(let j = 0; j < checks.length; j++) {
        if(checks[j][0]) {
          corner = checks[j][1];
          break;
        }
      }

      for(let l = 0; l < fields.length; l++) {
        // get the field with the corresponding coordinates
        if (fields[l].fX === path[i][0] && fields[l].fY === path[i][1]) {
          // add the breadcrumbs class
          fields[l].e.className += ` gretel__breadcrumb ${corner}`;
        }
      }
    }
  }

  function getFields(i, path) {
    return {
      x: {
        current: path[i][0],
        last: (path[i - 1]) ? path[i - 1][0] : null,
        next: (path[i + 1]) ? path[i + 1][0] : null
      },
      y: {
        current: path[i][1],
        last: (path[i - 1]) ? path[i - 1][1] : null,
        next: (path[i + 1]) ? path[i + 1][1] : null
      }
    };
  }

  function checkFields(field) {
    return [
      
        [
          (
            field.y.current > field.y.next && field.y.current === field.y.last && field.x.current > field.x.last && field.x.current === field.x.next ||
            field.y.current === field.y.next && field.y.current > field.y.last && field.x.current === field.x.last && field.x.current > field.x.next
          ),
          'gretel__breadcrumb--bottom-right'
        ],
        [
          (
            field.y.current === field.y.next && field.y.current < field.y.last && field.x.current === field.x.last && field.x.current < field.x.next ||
            field.y.current < field.y.next && field.y.current === field.y.last && field.x.current < field.x.last && field.x.current === field.x.next
          ),
          'gretel__breadcrumb--top-left'
        ],
        [
          (
            field.y.current < field.y.next && field.y.current === field.y.last && field.x.current > field.x.last && field.x.current === field.x.next ||
            field.y.current === field.y.next && field.y.current < field.y.last && field.x.current === field.x.last && field.x.current > field.x.next ||
            field.y.current < field.y.next && field.y.current === field.y.last && field.x.current < field.x.last && field.x.current === field.x.next
          ),
          'gretel__breadcrumb--top-right'
        ],
        [
          (
            field.y.current === field.y.next && field.y.current > field.y.last && field.x.current === field.x.last && field.x.current < field.x.next ||
            field.y.current > field.y.next && field.y.current === field.y.last && field.x.current < field.x.last && field.x.current === field.x.next
          ),
          'gretel__breadcrumb--bottom-left'
        ],
      
        [
          (field.x.current < field.x.next && field.y.current === field.y.next),
          'gretel__breadcrumb--horizontal-next-right'
        ],
        [
          (field.x.current < field.x.last && field.y.current === field.y.last),
          'gretel__breadcrumb--horizontal-last-right'
        ],
        [
          (field.x.current > field.x.next && field.y.current === field.y.next),
          'gretel__breadcrumb--horizontal-next-left'
        ],
        [
          (field.x.current > field.x.last && field.y.current === field.y.last),
          'gretel__breadcrumb--horizontal-last-left'
        ],
        [
          (field.x.current === field.x.next && field.y.current < field.y.next),
          'gretel__breadcrumb--vertical-next-top'
        ],
        [
          (field.x.current === field.x.last && field.y.current > field.y.last),
          'gretel__breadcrumb--vertical-last-top'
        ],
        [
          (field.x.current === field.x.next && field.y.current > field.y.next),
          'gretel__breadcrumb--vertical-next-bottom'
        ],
        [
          (field.x.current === field.x.last && field.y.current < field.y.last),
          'gretel__breadcrumb--vertical-last-bottom'
        ]
      
    ];
  }

  function clearOlds() {
    let clearClasses =
    [ // clear any old path
      'gretel__breadcrumb',
      'gretel__breadcrumb--top-left',
      'gretel__breadcrumb--top-right',
      'gretel__breadcrumb--bottom-left',
      'gretel__breadcrumb--bottom-right',
      'gretel__breadcrumb--bottom-right',
      'gretel__breadcrumb--horizontal-last-left',
      'gretel__breadcrumb--horizontal-last-right',
      'gretel__breadcrumb--horizontal-last-top',
      'gretel__breadcrumb--horizontal-next-bottom',
      'gretel__breadcrumb--horizontal-next-left',
      'gretel__breadcrumb--horizontal-next-right',
      'gretel__breadcrumb--horizontal-next-top',
      'gretel__breadcrumb--horizontal-next-bottom',
      'gretel__breadcrumb--vertical-last-left',
      'gretel__breadcrumb--vertical-last-right',
      'gretel__breadcrumb--vertical-last-top',
      'gretel__breadcrumb--vertical-last-bottom',
      'gretel__breadcrumb--vertical-next-left',
      'gretel__breadcrumb--vertical-next-right',
      'gretel__breadcrumb--vertical-next-top',
      'gretel__breadcrumb--vertical-next-bottom'
    ];
    for(let i = 0; i < fields.length; i++) {
      for(let j = 0; j < clearClasses.length; j++) {
        if (fields[i].e.className.indexOf(clearClasses[j]) > -1) {
          fields[i].e.classList.remove(clearClasses[j]);
        }
      }
      // re-lock all towers to be sure
      if (fields[i].e.className.indexOf('tower') > -1) {
        fields[i].lock('tower');
      }
      // get blocked Fields
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

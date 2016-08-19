// tried to write that AI pathfinding myself
// figured out that it might take ages
// end up using https://github.com/qiao/PathFinding.js
// gretel is my pathfinder visualizer
let gretelFields = [], grid, finder, path;

/* Gretel */
function gretel() {
  // Setup the board for the pathfinder
  // see https://github.com/qiao/PathFinding.js for more info
  grid = new PF.Grid(boardSize / 10, boardSize / 10);
  // clear leftover css classes on fields &
  // mark locked fields as unwalkable
  clearOlds();
  // setup a new finder
  finder = new PF.BestFirstFinder({
    heuristic: PF.Heuristic.euclidean
  });
  // draw a new path
  path = finder.findPath(startField.fX, startField.fY, endField.fX, endField.fY, grid);
  if (path.length > 0) {
    handlePath(path);
    return true;
  } else {
    return false;
  }
}

function clearOlds() {
  gretelFields = [];
  let _fields = fields,
    clearClasses =
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
  for(let i = 0, il = _fields.length; i < il; i++) {
    for(let j = 0, jl = clearClasses.length; j < jl; j++) {
      if (_fields[i].e.className.indexOf(clearClasses[j]) > -1) {
        removeClass(_fields[i].e, clearClasses[j]);
      }
    }
    // re-lock all towers to be sure
    if (_fields[i].e.className.indexOf('tower') > -1) {
      _fields[i].lock('tower');
    }
    // get blocked _fields
    if (_fields[i].locked && _fields[i].pos !== startField.pos && _fields[i].pos !== endField.pos && _fields[i].locked === 'tower') {
      grid.setWalkableAt(_fields[i].fX, _fields[i].fY, false);
    }
  }
}

// this fill draw smooth corners to the path
function handlePath(path) {
  let corner, globFields = fields;
  for(let i = 0, il = path.length; i < il; i++) {
    // path[i][0] // fX coordinate
    // path[i][1] // fY coordinate
    // check if it is a corner field
    let _fields = getFields(i, path);
    let checks = checkFields(_fields);

    corner = '';
    for(let j = 0, jl = checks.length; j < jl; j++) {
      if(checks[j][0]) {
        corner = checks[j][1];
        break;
      }
    }

    for(let k = 0, kl = globFields.length; k < kl; k++) {
      // get the field with the corresponding coordinates
      if (globFields[k].fX === path[i][0] && globFields[k].fY === path[i][1]) {
        // add the breadcrumbs class
        globFields[k].e.className += ` gretel__breadcrumb ${corner}`;
        gretelFields.push(globFields[k]);
      }
    }
  }
}

// grabs the current, the next and previous field on the path for further calculations
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

// saves an array with all possibilities with corresponding outcome
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

function setupGretel() {
  // Setup Gretel
  gretel();
}

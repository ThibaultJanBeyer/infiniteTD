/* Gretel */
class Gretel {
  constructor(start = startField) {
    this.ms = 99;
    this.startField = start;
  }

  setupWalk(currentField, lastField) {
    if(currentField === endField) {
      this.finish();
      return this.fieldCounts;
    } else {
      this.fieldCounts++;
      // handle fields
      // store current
      // since creep moves away from current
      this.current = currentField;
      // store last fields
      if (this.kid == null) {
        this.lasts.push(lastField);
      } else {
        this.kidLasts.push(lastField);
      }
      // get next field
      // check if it is available
      this.next = isWalkableGretel(this);
      if (this.next) {
        if (this.kid == null) {
          this.next.e.classList.add('gretel__breadcrumb');
        } else {
          this.next.e.classList.add('kid');
        }
        return moveGretel(this, this.next, (el) => {
          return el.setupWalk(el.next, el.current);
        });
      } else {
        return false;
      }
    }
  }

  finish() {
    this.x = parseInt(this.startField.x);
    this.y = parseInt(this.startField.y);
  }

  start() {
    this.fieldCounts = 0;
    this.x = parseInt(this.startField.x);
    this.y = parseInt(this.startField.y);
    // reset all breadcrumbs
    let breadcrumbs = document.getElementsByClassName('gretel__breadcrumb');
    [...breadcrumbs].forEach(function(element) {
      element.classList.remove('gretel__breadcrumb');
    }, this);
    
    // this will contains all the creeps last fields
    // a creep should not walk twice on the last fields
    this.lasts = [];
    // with exception of a tolerance
    this.tolerance = blockTolerance;
    return this.setupWalk(this.startField, this.startField);
  }
}

function setupGretel() {
  gretel = new Gretel();
  gretel.start();
}

/* GRETEL ROX */
// check if the surrounding fields
// are not blocked
function isWalkableGretel(el) {

  let current = el.current,
  // store the number of the current position
    num = current.pos,
  // setup fields and check for edge cases
    cases = checkCases(num, el),
  // check where the endfield is
  // to know which direction to go
    goTo = goTowards(cases, current, el);

  // if the next field is the end
  let ends = [cases.left.edge, cases.top.edge, cases.bottom.edge];
  if(ends.indexOf(true) <= -1 && [cases.right.field.pos, cases.left.field.pos, cases.top.field.pos, cases.bottom.field.pos].indexOf(endField.pos) > -1) {
    return endField;
  // else check if fields are free
  } else {
    // any other move will be checked here
    for (let i = 0; i < 4; i++) {
      if (!goTo[i].edge && goTo[i].field.locked !== true && !goTo[i].last) {
        return goTo[i].field;
      } else if (!goTo[i].edge && goTo.kids && !goTo[i].last) {
        return sendKids(current, el, goTo);
      }
    }
    if(el.tolerance-- > 0) {
      if (this.kid == null) {
        //el.lasts[el.lasts.length - 1].e.classList.remove('gretel__breadcrumb');
        el.lasts.pop();
      } else {
        //el.kidLasts[el.lasts.length - 1].e.classList.remove('gretel__breadcrumb');
        el.kidLasts.pop();
      }
      return isWalkableGretel(el);
    } else {
      return false;
    }
  }

}

function checkCases(num, el) {
  let cases = {
    right: {
      field: field[num + 1],
      edge: (rightFields.indexOf(num) > -1) ? true : false,
    },
    left: {
      field: field[num - 1],
      edge: (leftFields.indexOf(num) > -1) ? true : false
    },
    top: {
      field: field[num - boardRowSize],
      edge: (topFields.indexOf(num) > -1) ? true : false
    },
    bottom: {
      field: field[num + boardRowSize],
      edge: (bottomFields.indexOf(num) > -1) ? true : false
    }
  };
  // check for the last fields
  // never walk on a field twice
  if (el.kid == null) {
    lastfields();
  } else {
    kidLastfields();
  }

  function lastfields() {
    cases.right.last = (el.lasts.indexOf(cases.right.field) > -1) ? true : false;
    cases.left.last = (el.lasts.indexOf(cases.left.field) > -1) ? true : false;
    cases.top.last = (el.lasts.indexOf(cases.top.field) > -1) ? true : false;
    cases.bottom.last = (el.lasts.indexOf(cases.bottom.field) > -1) ? true : false;
  }

  function kidLastfields() {
    cases.right.last = (el.lasts.indexOf(cases.right.field) > -1 || el.kidLasts.indexOf(cases.right.field) > -1) ? true : false;
    cases.left.last = (el.lasts.indexOf(cases.left.field) > -1 || el.kidLasts.indexOf(cases.left.field) > -1) ? true : false;
    cases.top.last = (el.lasts.indexOf(cases.top.field) > -1 || el.kidLasts.indexOf(cases.top.field) > -1) ? true : false;
    cases.bottom.last = (el.lasts.indexOf(cases.bottom.field) > -1 || el.kidLasts.indexOf(cases.bottom.field) > -1) ? true : false;
  }

  return cases;
}

function goTowards(cases, current, el) {
  let distanceToEnd = {
      x: endField.x - current.x,
      y: endField.y - current.y
    },
  // assume this board:
  // [ ][    ][ ][ ][   ]
  // [ ][curr][ ][ ][   ]
  // [ ][    ][ ][ ][end]
  // he would first check if bottom is free
  // then right then top then left, because
  //    distanceToEnd.y = +1 > 0 (y1 = bottom)
  //    distanceToEnd.x = +3 > 0 (x1 = right)
  // the y direction is always the most important one
  // since the creeps want to stay on the middle path
  // (which helps preventing wrong blockades)
    goTo = {
      0: (distanceToEnd.y > 0) ? cases.bottom : cases.top,
      1: (distanceToEnd.x > 0) ? cases.right : cases.left,
      2: (distanceToEnd.y > 0) ? cases.top : cases.bottom,
      3: (distanceToEnd.x > 0) ? cases.left : cases.right,
      kids: false
    };
    // if the y distance is 0, hence the creep on the same lane as 
    // the end field he will have to choose which is the best option
    // by fake-walking all the fields and calculate which one is closer
    // @TODO: code fake walking
    // @TODO: have not every creep checking it but our gretel creep
    // who will lie breadcrumbs for the other creeps to follow
    if (distanceToEnd.y === 0) {
      goTo[0] = cases.right;
      goTo[1] = cases.bottom;
      goTo[2] = cases.top;
      goTo[3] = cases.left;
      // since the goal is always on the right the left pos is always last
      if (!el.kid) {
        goTo.kids = true; // send kids to check path
      }
    }
  
  return goTo;
}

// move element
function moveGretel(el, next, cb) {
  // calculate the distance
  // (x:10,y:20)[cur] -dist-> [next](x:20,y:20)
  // next.x(20) - cur.x(10) = +10 dist
  // next.y(20) - cur.y(20) = 0 dist
  el.dist = {
    x: next.x - el.x,
    y: next.y - el.y
  };

  increment = calculateIncrement(el, next);

  el.x += increment.x;
  el.dist.x -= increment.x;
  el.y += increment.y;
  el.dist.y -= increment.y;
  if (typeof increment === 'undefined' || increment == null || increment.steps > 0.5) {
    return moveGretel(el, next, cb);
  } else {
    return cb(el, next, cb);
  }
}

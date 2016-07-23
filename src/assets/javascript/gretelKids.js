/* Gretel */
class GretelKid {
  constructor(start, position) {
    this.ms = 99;
    this.startField = start;
    this.x = parseInt(this.startField.x);
    this.y = parseInt(this.startField.y);
    this.fieldCounts = 0;
    this.lasts = [];
    this.tolerance = blockTolerance;
    this.position = position;
  }

  start() {
    return this.setupWalk(this.startField, this.startField);
  }

  setupWalk(currentField, lastField) {
    if(currentField === endField) {
      return this.fieldCounts;
    } else {
      this.fieldCounts++;
      // handle fields
      // store current
      // since creep moves away from current
      this.current = currentField;
      // store last fields
      this.lasts.push(lastField);
      // get next field
      // check if it is available
      this.next = isWalkableGretelKid(this);
      if (this.next) {
        // this.next.e.classList.add('kid');
        return moveGretelKid(this, this.next, (el) => {
          return el.setupWalk(el.next, el.current);
        });
      } else {
        return false;
      }
    }
  }
}

// check if the surrounding fields
// are not blocked
function isWalkableGretelKid(el) {

  let current = el.current,
  // store the number of the current position
    num = current.pos,
  // setup fields and check for edge cases
    cases = checkCasesKid(num, el),
  // check where the endfield is
  // to know which direction to go
    goTo = goTowardsKid(cases, current, el);

  // if the next field is the end
  let ends = [cases.left.edge, cases.top.edge, cases.bottom.edge];
  if(ends.indexOf(true) <= -1 && [cases.right.field.pos, cases.left.field.pos, cases.top.field.pos, cases.bottom.field.pos].indexOf(endField.pos) > -1) {
    return endField;
  // else check if fields are free
  } else if (el.position === 'bottom') {
    // this checks the kids first move. If the kid is moving bottom
    // then it checks if bottom/top is blocked or not
    el.position = 'set';
    if (!goTo[1].edge && goTo[1].field.locked !== true && !goTo[1].last) {
      return goTo[1].field;
    } else {
      return false;
    }
  } else if (el.position === 'top') {
    // this also checks the kids first move. If the kid is moving bottom
    // then it checks if bottom/top is blocked or not
    el.position = 'set';
    if (!goTo[2].edge && goTo[2].field.locked !== true && !goTo[2].last) {
      return goTo[2].field;
    } else {
      return false;
    }
  } else {
    // any other move will be checked here
    for (let i = 0; i < 4; i++) {
      if (!goTo[i].edge && goTo[i].field.locked !== true && !goTo[i].last) {
        return goTo[i].field;
      } else if (!goTo[i].edge && goTo.kids && !goTo[i].last) {
        let tempPos = sendKids(current, el, goTo);
        if (tempPos !== 'left') {
          return tempPos;
        }
      }
    }
    if(el.tolerance-- > 0) {
      el.lasts.pop();
      return isWalkableGretelKid(el);
    } else {
      return false;
    }
  }

}

function checkCasesKid(num, el) {
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
  lastfieldsKid();

  function lastfieldsKid() {
    cases.right.last = (el.lasts.indexOf(cases.right.field) > -1) ? true : false;
    cases.left.last = (el.lasts.indexOf(cases.left.field) > -1) ? true : false;
    cases.top.last = (el.lasts.indexOf(cases.top.field) > -1) ? true : false;
    cases.bottom.last = (el.lasts.indexOf(cases.bottom.field) > -1) ? true : false;
  }

  return cases;
}

function goTowardsKid(cases, current, el) {
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
      goTo = {
        0: cases.right,
        1: cases.bottom,
        2: cases.top,
        3: cases.left
      };
      if (!el.kid) {
        goTo.kids = true; // send kids to check path
      }
    }
  
  return goTo;
}

// send kids
function sendKids(current, el, goTo) {
  // 1 -> Bottom
  // 2 -> Top
  let kidBottom = new GretelKid(current, 'bottom'),
    bottom = kidBottom.start(),
    kidTop = new GretelKid(current, 'top'),
    top = kidTop.start();

  if (bottom || top) {
    if (!bottom) {
      return goTo[2].field;
    } else if(!top) {
      return goTo[1].field;
    } else if (bottom < top) {
      return goTo[1].field;
    } else if(bottom > top) {
      return goTo[2].field;
    } else if (bottom === top) {
      return goTo[1].field;
    }
  } else {
    return 'left';
  }
}

// move element
function moveGretelKid(el, next, cb) {
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
    return moveGretelKid(el, next, cb);
  } else {
    return cb(el, next, cb);
  }
}

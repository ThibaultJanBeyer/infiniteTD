/* Gretel */
class Gretel {
  constructor() {
    this.e = createElement('div', 'gretel');
    this.ms = 27;
    // this will be triggered if fakewalking is needed
    this.fakeWalk = false;
    this.fakeWalkCount = 0;
    this.criticals = [];
  }

  create() {
    this.e.style.transform = 'translate(50%,50%)';
    board.appendChild(this.e);
    this.e.style.left = `${startField.x}px`;
    this.e.style.top = `${startField.y}px`;
    this.start();
  }

  setupWalk(currentField, lastField) {
    if(currentField === endField) {
      this.finish();
    } else {
      this.x = parseInt(this.e.style.left);
      this.y = parseInt(this.e.style.top);
      // handle fields
      // store & unlock current
      // since creep moves away from current
      this.current = currentField;
      // store last fields
      this.lasts.push(lastField);
      // get next field
      // check if it is available
      this.next = isWalkableGretel(this);
      if (this.next) {
        this.next.e.classList.add('gretel__breadcrumb');
        moveGretel(this, this.next, (el) => {
          el.setupWalk(el.next, el.current);
        });
      } else if(this.fakeWalk && this.fakeWalkCount >= 0) {
        this.fakeWalkCount++;
        this.current.e.classList.remove('gretel__breadcrumb');
        // lock all criticals for the second walk
        for (let i = 0; i < this.criticals.length; i++) {
          this.criticals[i].lock();
        }
        this.start();
      } else {
        alert('don’t block');
      }
    }
  }

  finish() {
    this.e.style.left = `${startField.x}px`;
    this.e.style.top = `${startField.y}px`;
    this.fakeWalk = false;
    this.fakeWalkCount = 0;
    for (let i = 0; i < this.criticals.length; i++) {
      this.criticals[i].unlock();
    }
    this.criticals = [];
  }

  start(currentField = startField, lastField = startField) {
    if (this.lasts != null) {
      // reset all breadcrumbs
      for (let i = 0; i < this.lasts.length; i++) {
        this.lasts[i].e.classList.remove('gretel__breadcrumb');
      }
    }
    // this will contains all the creeps last fields
    // a creep should not walk twice on the last fields
    this.lasts = [];
    // with exception of a tolerance
    this.tolerance = blockTolerance;
    this.setupWalk(startField, startField);
  }
}

function setupGretel() {
  gretel = new Gretel();
  gretel.create();
}

/* GRETEL ROX */
// check if the surrounding fields
// are not blocked
function isWalkableGretel(el) {

  console.log(el.fakeWalkCount);

  let current = el.current,
    lasts = el.lasts,
  // store the number of the current position
    num = current.pos,
  // setup fields and check for edge cases
    cases = checkCases(num, lasts),
  // check where the endfield is
  // to know which direction to go
    goTo = goTowards(cases, current, el);

  // if the next field is the end
  let ends = [cases.left.edge, cases.top.edge, cases.bottom.edge];
  if(ends.indexOf(true) <= -1 && [cases.right.field.pos, cases.left.field.pos, cases.top.field.pos, cases.bottom.field.pos].indexOf(endField.pos) > -1) {
    return endField;
  // else check if fields are free
  } else {
    for (let i = 0; i < 4; i++) {
      if (!goTo[i].edge && goTo[i].field.locked !== true && !goTo[i].last) {
        if (el.fakeWalk === true && i === 1) {
          el.criticals.push(goTo[i].field);
        }
        return goTo[i].field;
      } else if (!goTo[i].edge && goTo.fakeWalk && !goTo[i].last) {
        if (el.fakeWalkCount === 0) {
          el.fakeWalk = true;
        }
      }
    }
    if(el.tolerance-- > 0) {
      el.lasts[el.lasts.length - 1].e.classList.remove('gretel__breadcrumb');
      el.lasts.pop();
      return isWalkableGretel(el);
    } else {
      return false;
    }
  }

}

function checkCases(num, lasts) {
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
  lastfields();
  function lastfields() {
    cases.right.last = (lasts.indexOf(cases.right.field) > -1) ? true : false;
    cases.left.last = (lasts.indexOf(cases.left.field) > -1) ? true : false;
    cases.top.last = (lasts.indexOf(cases.top.field) > -1) ? true : false;
    cases.bottom.last = (lasts.indexOf(cases.bottom.field) > -1) ? true : false;
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
      fakeWalk: false
    };
    // if the y distance is 0, hence the creep on the same lane as 
    // the end field he will have to choose which is the best option
    // by fake-walking all the fields and calculate which one is closer
    // @TODO: code fake walking
    // @TODO: have not every creep checking it but our gretel creep
    // who will lie breadcrumbs for the other creeps to follow
    if (distanceToEnd.y === 0) {
      goTo[0] = cases.right;
      if (el.fakeWalkCount === 0) {
        goTo[1] = cases.bottom;
        goTo[2] = cases.top;
      } else {
        goTo[1] = cases.top;
        goTo[2] = cases.bottom;
      }
      goTo.fakeWalk = true; // might need fake walking
      goTo[3] = cases.left;
      // since the goal is always on the right the left pos is always last
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
  // update creep
  el.e.style.left = `${el.x}px`;
  el.e.style.top = `${el.y}px`;
  if (typeof increment === 'undefined' || increment == null || increment.steps > 0.5) {
    setTimeout(function() {
      return moveGretel(el, next, cb);
    }, 10);
  } else {
    return cb(el, next, cb);
  }
}

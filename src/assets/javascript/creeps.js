// Creeps
let allCreeps = [],
  blockTolerance = 5;

/* Creeps */
class Creeps {
  constructor({
    ms,
    hp,
    lvl
  }) {
    this.e = createElement('div', `c__l${lvl}`);
    this.ms = ms;
    this.hp = hp;
    // this will contains all the creeps last fields
    // a creep should never walk twice on a field
    this.lasts = [];
    // with exception of a tolerance
    this.tolerance = 5;

    this.hpBarC = createElement('div', 'c__hp-container');
    this.hpBar = createElement('div', 'c__hp');
    this.hpBarC.appendChild(this.hpBar);
    this.e.appendChild(this.hpBarC);
  }

  create() {
    this.e.style.transform = 'translate(50%,50%)';
    board.appendChild(this.e);
    this.e.style.left = `${startField.x}px`;
    this.e.style.top = `${startField.y}px`;
    this.setupWalk(startField, startField);
  }

  setupWalk(currentField, lastField) {
    if(currentField === endField) {
      this.remove();
      p1.loseLife();
    } else {
      this.x = parseInt(this.e.style.left);
      this.y = parseInt(this.e.style.top);
      // handle fields
      // store & unlock current
      // since creep moves away from curr
      this.current = currentField;
      if(this.current !== startField){ this.current.unlock(); }
      // store last fields
      this.lasts.push(lastField);
      // get next field
      // check if it is available
      this.next = isWalkable(this);
      if (this.next) {
        this.next.lock('creep');
        // calculate the distance
        // (x:10,y:20)[cur] -dist-> [next](x:20,y:20)
        // next.x(20) - cur.x(10) = +10 dist
        // next.y(20) - cur.y(20) = 0 dist
        this.dist = {
          x: this.next.x - this.x,
          y: this.next.y - this.y
        };
        if(this.dist.x !== 0) {
          moveCreep(this, 'x'); }
        if(this.dist.y !== 0) {
          moveCreep(this, 'y'); }
      } else {
        alert('don’t block');
      }
    }
  }
  
  remove(killed) {
    // remove creep
    // from board
    board.removeChild(this.e);
    // from allCreeps array
    allCreeps.splice(allCreeps.indexOf(this), 1);
    // delete it from js memory
    delete Creeps.this;
  }
}

// move creep
function moveCreep(el, direction, cb) {
  if(!isPaused){
    // negative distance
    if(el.dist[direction] < 0) {
      el[direction]--;
      el.dist[direction]++;
    // positive distance
    } else if(el.dist[direction] > 0) {
      el[direction]++;
      el.dist[direction]--;
    }
    // update creep
    (direction === 'x') ? el.e.style.left = `${el.x}px` : el.e.style.top = `${el.y}px`;
  }
  if (el.dist[direction] !== 0) {
    setTimeout(function() {
      return moveCreep(el, direction);
    }, el.ms);
  } else {
    return el.setupWalk(el.next, el.current); }
}

// check if the surrounding fields
// are not blocked
function isWalkable(el) {

  let current = el.current,
      lasts = el.lasts,
  // store the number of the current position
      num = current.pos,
  // setup fields and check for edge cases
    right = {
      field: field[num + 1],
      edge: (rightFields.indexOf(num) > -1) ? true : false,
    },
    left = {
      field: field[num - 1],
      edge: (leftFields.indexOf(num) > -1) ? true : false
    },
    top = {
      field: field[num - boardRowSize],
      edge: (topFields.indexOf(num) > -1) ? true : false
    },
    bottom = {
      field: field[num + boardRowSize],
      edge: (bottomFields.indexOf(num) > -1) ? true : false
    };
  
  // check for the last fields
  // never walk on a field twice
  right.last = (lasts.indexOf(right.field) > -1) ? true : false;
  left.last = (lasts.indexOf(left.field) > -1) ? true : false;
  top.last = (lasts.indexOf(top.field) > -1) ? true : false;
  bottom.last = (lasts.indexOf(bottom.field) > -1) ? true : false;
  
  // check where the endfield is
  // to know which direction to go
  let distanceToEnd = {
    x: endField.x - current.x,
    y: endField.y - current.y
  };
  // assume this board:
  // [ ][    ][ ][ ][   ]
  // [ ][curr][ ][ ][   ]
  // [ ][    ][ ][ ][end]
  // he would first check if the right
  // field is empty then the bottom one
  // because:
  //    distanceToEnd.x = +3 > 0 (x1 = right)
  //    distanceToEnd.y = +1 > 0 (y1 = bottom)
  
  let goTo = {
    x1: (distanceToEnd.x >= 0) ? right : left,
    y1: (distanceToEnd.y >= 0) ? bottom : top,
    x2: (distanceToEnd.x >= 0) ? left : right,
    y2: (distanceToEnd.y >= 0) ? top : bottom
  };

  // if the next field is the end
  if([left.edge, top.edge, bottom.edge].indexOf(true) <= -1 && [right.field.pos, left.field.pos, top.field.pos, bottom.field.pos].indexOf(endField.pos) > -1) {
    return endField;
  // else check if fields are free
  } else if (!goTo.x1.edge && goTo.x1.field.locked !== true && !goTo.x1.last) {
    return goTo.x1.field;
  } else if (!goTo.y1.edge && goTo.y1.field.locked !== true && !goTo.y1.last) {
    return goTo.y1.field;
  } else if (!goTo.y2.edge && goTo.y2.field.locked !== true && !goTo.y2.last) {
    return goTo.y2.field;
  } else if (!goTo.x2.edge && goTo.x2.field.locked !== true && !goTo.x2.last) {
    return goTo.x2.field;
  } else {
    if(el.tolerance-- > 0) {
      el.lasts.pop();
      return isWalkable(el);
    } else {
      return false;
    }
  }

}

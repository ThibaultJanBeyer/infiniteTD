// Creeps
let allCreeps = [];

/* Creeps */
class Creeps {
  constructor({
    ms,
    hp,
    lvl,
    bounty
  }) {
    this.e = createElement('div', `c c__l${lvl}`);
    this.ms = ms;
    this.hp = hp;
    this.bounty = bounty;
    this.lasts = [];
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
    this.x = parseInt(this.e.style.left);
    this.y = parseInt(this.e.style.top);
    if(currentField === endField) {
      let afterEnd = { x: this.x + currentField.w / 2.5, y: this.y };
      moveCreep(this, afterEnd, (el) => {
        p1.loseLife();
        this.remove();
      });
    } else {
      // no creep should walk on a field twice
      this.lasts.push(currentField);
      // handle fields
      // store & unlock current
      // since creep moves away from curr
      this.current = currentField;
      this.current.unlock();
      this.current.unlock();
      // get next field
      // check if it is available
      this.next = isWalkable(this);
      if (this.next && !this.dead) {
        this.next.lock('creep');
        moveCreep(this, this.next, (el) => {
          el.setupWalk(el.next, el.current);
        });
      // unlock the field if the creep is dead
      } else if(this.dead) {
        this.current.unlock();
      }
    }
  }

  damage(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.remove(true, p1);
    }
  }
  
  remove(killed, player) {
    if (!this.dead) {
      // dead
      this.dead = true;
      if (killed) {
        player.unitKill(this);
      }
      // remove creep
      // from board
      board.removeChild(this.e);
      // from allCreeps array
      allCreeps.splice(allCreeps.indexOf(this), 1);
      kills++;
      if (kills >= levels[p1.level].amount) {
        kills = 0;
        p1.levelUp();
      }
    }
  }
}

// move creep
function moveCreep(el, next, cb) {
  if (!isPaused) {
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
  }

  if (typeof increment === 'undefined' || increment == null || increment.steps > 0.5) {
    setTimeout(function() {
      return moveCreep(el, next, cb);
    }, 10);
  } else {
    return cb(el, next, cb);
  }
}

// Gretel did all the heavy lifting
// we now check for gretels breadcrumbs
// and follow them.
function isWalkable(el) {

  let cases = checkCases(el);
  for (let i = 0; i < 4; i++) {
    if (cases[i].field === endField) {
      return endField;
    } else if(!cases[i].edge && cases[i].field.e.className.indexOf('gretel__breadcrumb') > -1 && !cases[i].last) {
      return cases[i].field;
    }
  }
  if (el.tolerance-- > 0) {
    return el.lasts.pop();
  } else {
    return endField;
  }

}

function checkCases(el) {
  let num = el.current.pos;
  let cases = {
    0: { // right
      field: fields[num + 1],
      edge: (rightFields.indexOf(num) > -1) ? true : false,
    },
    1: { // left
      field: fields[num - 1],
      edge: (leftFields.indexOf(num) > -1) ? true : false
    },
    2: { // top
      field: fields[num - boardRowSize],
      edge: (topFields.indexOf(num) > -1) ? true : false
    },
    3: { // bottom
      field: fields[num + boardRowSize],
      edge: (bottomFields.indexOf(num) > -1) ? true : false
    }
  };
  // check for the last fields
  // never walk on a field twice
  lastFields();

  function lastFields() {
    cases[0].last = (el.lasts.indexOf(cases[0].field) > -1) ? true : false;
    cases[1].last = (el.lasts.indexOf(cases[1].field) > -1) ? true : false;
    cases[2].last = (el.lasts.indexOf(cases[2].field) > -1) ? true : false;
    cases[3].last = (el.lasts.indexOf(cases[3].field) > -1) ? true : false;
  }

  return cases;
}

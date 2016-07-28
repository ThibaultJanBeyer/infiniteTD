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
    this.e.style.transform = 'translate(50%, 50%)';
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
        p1.updateLives(-1);
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
      this.next = isWalkable(this.current.pos, this.lasts, this.tolerance);
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
function isWalkable(num, lasts, tolerance) {
  let cases = {},
    ef = endField,
    brs = boardRowSize,
    // right - left - top - bottom
    // will be reversed from while loop to: bottom - top - left - right
    p = [num + 1, num - 1, num - brs, num + brs],
    localfields = fields;
  
  // get all fields
  // right - left - top - bottom
  cases.fields = casesFields(p, localfields);
  cases.edges = casesEdges(num);
  cases.lasts = casesLasts(p, lasts, localfields);
  cases.gretels = casesGretels(cases.fields);

  for (let i = 0; i < 4; i++) {
    if (cases.fields[i] === ef) {
      return ef;
    } else if(!cases.edges[i] && cases.gretels[i] && !cases.lasts[i]) {
      return cases.fields[i];
    }
  }
  if (tolerance-- > 0) {
    return lasts.pop();
  } else {
    return ef;
  }
}

function casesFields(p, lf) {
  let output = {};

  for (let i = 0; i < 4; i++) {
    output[i] = lf[p[i]];
  }

  return output;
}

function casesEdges(num) {
  let output = {},
    f = [rightFields, leftFields, topFields, bottomFields];

  for (let i = 0; i < 4; i++) {
    output[i] = (f[i].indexOf(num[i]) > -1) ? true : false;
  }

  return output;
}

function casesLasts(p, lasts, lf) {
  let output = {};
  
  for (let i = 0; i < 4; i++) {
    output[i] = (lasts.indexOf(lf[p[i]]) > -1) ? true : false;
  }

  return output;
}

function casesGretels(fields) {
  let output = {};

  for (let i = 0; i < 4; i++) {
    output[i] = (fields[i].e.className.indexOf('gretel__breadcrumb') > -1) ? true : false;
  }
  
  return output;
}

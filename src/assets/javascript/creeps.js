// Creeps
let allCreeps = [],
  blockTolerance = 5,
  gretel;

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
    // this will contains all the creeps last fields
    // a creep should not walk twice on the last fields
    this.lasts = [];
    // with exception of a tolerance
    this.tolerance = blockTolerance;

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
      p1.loseLife();
      this.remove();
    } else {
      this.x = parseInt(this.e.style.left);
      this.y = parseInt(this.e.style.top);
      // handle fields
      // store & unlock current
      // since creep moves away from curr
      this.current = currentField;
      this.current.unlock();
      // store last fields
      this.lasts.push(lastField);
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
      } else {
        alert('don’t block');
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
        player.unitKill(this.bounty);
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

// move element
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

  let cases = {
    0: field[el.current.pos - boardRowSize], // top
    1: field[el.current.pos + 1], // right
    2: field[el.current.pos + boardRowSize], // bottom
    3: field[el.current.pos - 1] // left
  };
  for (let i = 0; i < 4; i++) {
    if(cases[i].e.classList.contains('gretel__breadcrumb') && el.lasts.indexOf(cases[i]) < 0) {
      return cases[i];
    }
  }
  if(el.tolerance-- > 0) {
    el.lasts.pop();
    return isWalkable(el);
  } else {
    return false;
  }
}

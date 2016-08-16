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
    this.fullHp = hp;
    this.bounty = bounty;
    this.lasts = [];
    this.tolerance = 5;

    // visually represent hitpoints
    // this.hp / this.fullHp = 0.5 at 50% hp
    // * 10 to get a full number value so that .ceil rounds to a full number properly
    this.e.setAttribute('data-hp', Math.ceil(this.hp / this.fullHp * 10));
  }

  create() {
    board.appendChild(this.e);
    this.e.style.left = `${startField.x}px`;
    this.e.style.top = `${startField.y}px`;
    nextLocation(this);
  }

  damage(dmg) {
    this.hp -= dmg;
    this.e.setAttribute('data-hp', Math.ceil(this.hp / this.fullHp * 10));
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

// the variable gretelFields contains all fields set by gretels path coordinates
function nextLocation(creep, i = 0) {
  let gf = gretelFields;
  // check if creep is not dead
  if (!creep.dead) {
    let length = gretelFields.length - 1;
    if (i++ < length) {
      // set current position
      creep.x = parseInt(creep.e.style.left);
      creep.y = parseInt(creep.e.style.top);
      // move to next position
      moveCreep(creep, gf[i], (el) => {
        nextLocation(el, i);
      });
    } else {
      let afterEnd = { x: creep.x + endField.w / 3, y: creep.y };
      moveCreep(creep, afterEnd, () => {
        p1.updateLives(-1);
        creep.remove();
      });
    }
  }
}

// move creep
function moveCreep(el, next, cb) {
  let increment;

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

  if (typeof increment === 'undefined' || increment == null || increment.steps >= 1) {
    setTimeout(function() {
      return moveCreep(el, next, cb);
    }, 10);
  } else {
    return cb(el, next, cb);
  }
}

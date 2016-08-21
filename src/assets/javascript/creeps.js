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
    this.i = 0;

    creepContainer.appendChild(this.e);
    // set current position
    this.e.style.left = `${startField.x}px`;
    this.e.style.top = `${startField.y}px`;
    this.x = parseInt(this.e.style.left);
    this.y = parseInt(this.e.style.top);
    addClass(this.e, 'sr-only');
    this.invulnerable = true;

    // visually represent hitpoints
    // this.hp / this.fullHp = 0.5 at 50% hp
    // * 10 to get a full number value so that .ceil rounds to a full number properly
    this.e.setAttribute('data-hp', Math.ceil(this.hp / this.fullHp * 10));
  }

  setup() {
    removeClass(this.e, 'sr-only');
    this.invulnerable = false;
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
      // hide creep
      addClass(this.e, 'sr-only');
      // from allCreeps array
      kills++;
      if (kills >= levels[p1.level].amount) {
        kills = 0;
        p1.levelUp();
      }
    }
  }
}

// the variable gretelFields contains all fields set by gretels path coordinates
function nextLocation(creep) {
  let gf = gretelFields;
  // check if creep is not dead
  if (!creep.dead) {
    if (creep.i < gf.length) {
      // move to next position
      if (moveCreep(creep, gf[creep.i])) {
        creep.i++;
      }
    } else {
      p1.updateLives(-1);
      creep.remove();
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
    //el.dist.x -= increment.x;
    el.y += increment.y;
    //el.dist.y -= increment.y;
    // update creep
    el.e.style.left = `${el.x}px`;
    el.e.style.top = `${el.y}px`;
  }
  if (Math.abs(el.dist.x) < 10 && Math.abs(el.dist.y) < 10) {
    return true;
  }
  return false;
}

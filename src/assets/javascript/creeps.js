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
    this.e.style.opacity = 0;
    this.x = parseInt(this.e.style.left);
    this.y = parseInt(this.e.style.top);
    this.visual = { x: 0, y: 0 };
    this.invulnerable = true;

    // visually represent hitpoints
    // this.hp / this.fullHp = 0.5 at 50% hp
    // * 10 to get a full number value so that .ceil rounds to a full number properly
    // this.e.setAttribute('data-hp', Math.ceil(this.hp / this.fullHp * 10));
  }

  setup() {
    this.e.style.opacity = 1;
    this.invulnerable = false;
  }

  damage(dmg) {
    this.hp -= dmg;
    this.e.style.opacity = this.hp / this.fullHp;
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
      this.e.style.opacity = 0;
      // from allCreeps array
      kills++;
      if (kills >= levels[p1.level].amount) {
        kills = 0;
        p1.levelUp();
      }
    }
  }

  // the variable gretelFields contains all fields set by gretels path coordinates
  nextLocation(dt) {
    if(!this.dead) {
      let gf = gretelFields;
      if (this.i < gf.length) {  
        this.dt = dt;
        // move to next position
        if (moveObj(this, gf[this.i])) {
          this.i++;
        }
      } else {
        p1.updateLives(-1);
        this.remove();
      }
    }
  }
}

// Towers
let tArrow,
  towerbuilder;

/* Tower */
class Tower {
  constructor({
    name,
    cost,
    dmg,
    as, // attack speed
    cd, // cooldown
    rng, // range based on fields (1 = over 1 field, 2 = 2 fields as range)
    pms, // projectile speed. More = faster
    targets = 0, // how many targets can be focused (default = 0 hence 1)
    follow = true // if projectile follows target or not
  }) {
    this.name = name;
    this.cost = cost;
    this.dmg = dmg;
    this.as = as;
    this.cd = cd;
    this.rng = field[0].w + rng * field[0].w;
    this.pms = pms;
    this.targets = targets;
    this.follow = follow;
  }

  shoot(field, creep) {
    let porjectile = new Projectile(field, creep);
  }
}

function setupTowers() {
  tArrow = new Tower({
    name: 't__arrow',
    cost: 100,
    dmg: 50,
    as: 1500,
    pms: 40,
    cd: 1000,
    rng: 1
  });
  towerbuilder = new Builder([tArrow]);
}

function towersInRange(el) {
  // check if any Tower is in range
  for(let i = 0; i < field.length; i++) {
    if(field[i].tower) {
      // euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance
      if (euclidDistance(el.x, field[i].x, el.y, field[i].y) <= field[i].tower.rng) {
        field[i].tower.shoot(field[i], el);
      }
    }
  }
}

/* projectile */
class Projectile {
  constructor(field, creep) {
    this.field = field;
    this.ms = field.tower.pms;
    this.dmg = field.tower.dmg;
    this.x = field.x;
    this.y = field.y;
    this.follow = field.tower.follow;
    this.e = createElement('div', `projectile projectile__${field.tower.name}`);

    this.e.style.left = `${this.x}px`;
    this.e.style.top = `${this.y}px`;
    field.e.appendChild(this.e);

    moveProjectile(this, creep);
  }

  remove() {
    // @TODO: add explosion
    // remove element
    // dead
    this.dead = true;
    // from board
    this.field.e.removeChild(this.e);
  }
}

// move element
function moveProjectile(el, creep) {
  el.dist = {
    x: creep.x - el.x,
    y: creep.y - el.y
  };
  let loop = setInterval(interval, 60);

  function interval() {
    if (!isPaused) {
      let increment = calculateIncrement(el, creep);
      
      el.x += increment.x;
      el.dist.x -= increment.x;
      el.y += increment.y;
      el.dist.y -= increment.y;
      
      if(increment.steps < 0.5) {
        creep.damage(el.dmg);
        el.remove();
        clearInterval(loop);
      } else {
        el.e.style.left = `${el.x}px`;
        el.e.style.top = `${el.y}px`;
      }
    }
  }
}

// this function calculates the x and y increments
// that have to be added each step. Assume following example:
// assume a movementspeed (ms) of 1
//    0 1 2 3 -> x
//  0 A
// -1 
// -2       B
// -3
//  | 
//  v
//  y
// point A is at 0,0 point B at 2,3 to get a smooth movement
// we need to know how many steps are needed to reach the goal
// 1. Which coordinate is further away? (regardless if positive or negative) X or Y (x = 3)
// 2. How many steps do we need to reach B? x / ms (3/1 = 3)
// 3. Thus per step we need an increment of _ for y? y / (x/ms) (2/(3/1) = 0.666)
// 4. was it a positive or negative distance?
function calculateIncrement(el, creep) {
  let increment = {};

  if(el.follow) {
    el.dist = {
      x: creep.x - el.x,
      y: creep.y - el.y
    };
  }

  let x = Math.abs(el.dist.x);
  let y = Math.abs(el.dist.y);

  if (x > y) { // 1.
    increment.x = el.ms;
    increment.steps = x / el.ms; // 2.
    increment.y = y / increment.steps; // 3.
  } else { // 1.
    increment.y = el.ms;
    increment.steps = y / el.ms; // 2.
    increment.x = x / increment.steps; // 3.
  }

  // 4.
  if(el.dist.x < 0) { increment.x *= -1; }
  if(el.dist.y < 0) { increment.y *= -1; }

  return increment;
}

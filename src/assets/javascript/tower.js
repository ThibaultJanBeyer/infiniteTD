// Towers
let tArrow,
  sell,
  rock,
  builders = {};

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
    this.rng = fields[0].w + rng * fields[0].w;
    this.pms = pms;
    this.targets = targets;
    this.follow = follow;
  }

  shoot(field, creep) {
    if (this.dmg != null) {
      let porjectile = new Projectile(field, creep);
    }
  }
}

function setupTowers() {
  tArrow = new Tower({
    name: 'tower__arrow',
    cost: 75,
    dmg: 50,
    as: 1500,
    pms: 40,
    cd: 1000,
    rng: 1
  });

  rock = new Tower({
    name: 'tower__rock',
    cost: 6
  });

  sell = new Tower({
    name: 'tower__sell'
  });

  builders.towers = new Builder([tArrow, rock]);
  builders.arrow = new Builder([sell]);
  builders.rock = new Builder([sell]);
}

function towersInRange(el) {
  // check if any Tower is in range
  for(let i = 0; i < fields.length; i++) {
    if(fields[i].tower) {
      // euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance
      if (euclidDistance(el.x, fields[i].x, el.y, fields[i].y) <= fields[i].tower.rng) {
        fields[i].tower.shoot(fields[i], el);
      }
    }
  }
}

// move element
function moveProjectile(el, creep) {
  // calculate the distance
  // (x:10,y:20)[cur] -dist-> [next](x:20,y:20)
  // next.x(20) - cur.x(10) = +10 dist
  // next.y(20) - cur.y(20) = 0 dist
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

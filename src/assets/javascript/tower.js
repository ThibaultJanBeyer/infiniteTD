// Towers
let tBasic,
  sell,
  rock,
  builders = {},
  allTowers = [],
  allProjectiles = [];

/* projectile */
class Projectile {
  constructor(field, creep) {
    this.field = field;
    this.ms = field.tower.pms;
    this.dmg = field.tower.dmg;
    this.x = field.x;
    this.y = field.y;
    this.creep = creep;
    this.follow = field.tower.follow;
    this.e = createElement('div', `projectile projectile__${field.tower.name}`);

    this.e.style.left = `${this.x}px`;
    this.e.style.top = `${this.y}px`;
    projectileContainer.appendChild(this.e);

    allProjectiles.push(this);
  }

  remove() {
    // @TODO: add explosion
    // remove element
    // dead
    this.dead = true;
    // from board
    addClass(this.e, 'sr-only');
  }

  attack() {
    if (moveObj(this, this.creep)) {
      console.log('boom');
      this.creep.damage(this.dmg);
      this.remove();
    }
  }
}

/* Tower */
class Tower {
  constructor({
    name,
    cost,
    dmg = 0,
    cd = 0, // cooldown
    rng, // range based on fields (1 = over 1 field, 2 = 2 fields as range)
    pms, // Attack Speed -> projectile speed. More = faster
    targets = 0, // how many targets can be focused (default = 0 hence 1)
    follow = true, // if projectile follows target or not
    level = 1,
    description
  }) {
    this.nameOg = name;
    this.name = `tower__${name}`;
    this.cost = cost;
    this.dmg = dmg;
    this.cd = cd;
    this.rngVal = rng;
    this.rng = fields[0].w + rng * fields[0].w;
    this.pms = pms;
    this.targets = targets;
    this.follow = follow;
    this.level = level;
    this.description = description;
  }

  shoot(field, creep) {
    if (this.dmg != null) {
      let porjectile = new Projectile(field, creep);
    }
  }

  update() {
    this.rng = fields[0].w + this.rngVal * fields[0].w;
  }
}

function setupTowers() {
  tBasic = new Tower({
    name: 'basic',
    cost: 50,
    dmg: 50,
    pms: 0.5,
    cd: 1000,
    rng: 0.6,
    description: 'This tower has a high attack speed with a basic damage and range. Upgrades drastically improve its range. Moreover, with special researches, this tower will be key to your success.'
  });

  allTowers.push(tBasic);

  rock = new Tower({
    name: 'rock',
    cost: 6,
    level: 0,
    description: 'Simple & cheap rock. Usefull to block a path.'
  });

  sell = new Tower({
    name: 'sell',
    cost: '+½',
    level: 0,
    description: 'You can sell any tower and get back the half of its cost.'
  });

  builders.towers = new Builder([tBasic, rock]);
  builders.basic = new Builder([sell]);
  builders.rock = new Builder([sell]);
}

// // move element
// function moveProjectile(el, creep) {
//   // calculate the distance
//   // (x:10,y:20)[cur] -dist-> [next](x:20,y:20)
//   // next.x(20) - cur.x(10) = +10 dist
//   // next.y(20) - cur.y(20) = 0 dist
//   el.dist = {
//     x: creep.x - el.x,
//     y: creep.y - el.y
//   };
  
//   let loop = setInterval(interval, 20);

//   function interval() {
//     if (!isPaused) {
//       let increment = calculateIncrement(el, creep);
      
//       el.x += increment.x;
//       el.dist.x -= increment.x;
//       el.y += increment.y;
//       el.dist.y -= increment.y;
      
//       if(increment.steps < 1.5) {
//         creep.damage(el.dmg);
//         el.remove();
//         clearInterval(loop);
//       } else {
//         el.e.style.left = `${el.x}px`;
//         el.e.style.top = `${el.y}px`;
//       }
//     }
//   }
// }

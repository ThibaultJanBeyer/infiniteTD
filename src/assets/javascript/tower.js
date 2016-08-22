// Towers
let tBasic,
  tSell,
  tRock,
  builders = {},
  allTowers = [],
  allAttackTowers = [],
  catalogeTowers = [],
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

  attack(dt) {
    this.dt = dt;
    if (!this.dead && moveObj(this, this.creep)) {
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
    this.cdCount = 0;
    this.rngVal = rng;
    this.rng = fields[0].w + rng * fields[0].w;
    this.pms = pms;
    this.targets = targets;
    this.follow = follow;
    this.level = level;
    this.description = description;

    allTowers.push(this);
  }

  shoot(field, creep) {
    let porjectile = new Projectile(field, creep);
  }

  update() {
    this.rng = fields[0].w + this.rngVal * fields[0].w;
  }

  scan(dt) {
    // scan if creeps are nearby
    this.cdCount += dt;
    if (this.cdCount >= this.cd) {
      let attacked = 0;
      // get all creeps
      for(let i = 0, il = allCreeps.length; i < il; i++) {
        // check if the creeps distance is within tower range with
        // euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance
        if (!allCreeps[i].dead && euclidDistance(allCreeps[i].x, this.field.x, allCreeps[i].y, this.field.y) <= this.rng) {
          // then check how many targets the tower can focus
          if(attacked <= this.targets) {
            this.shoot(this.field, allCreeps[i]);
            attacked++;
            this.cdCount = 0;
          }
        }
      }
    }
  }
}

class BasicTower extends Tower {
  constructor() {
    super({
      name: 'basic',
      cost: 50,
      dmg: 50,
      pms: 0.5,
      cd: 1000,
      rng: 0.6,
      description: 'This tower has a high attack speed with a basic damage and range. Upgrades drastically improve its range. Moreover, with special researches, this tower will be key to your success.'
    });

    catalogeTowers.push(this);
  }

  setup(field) {
    this.field = field;
    allAttackTowers.push(this);
  }
}

class RockTower extends Tower {
  constructor() {
    super({
      name: 'rock',
      cost: 6,
      level: 0,
      description: 'Simple & cheap rock. Usefull to block a path.'
    });

    catalogeTowers.push(this);
  }

  setup(field) {
    this.field = field;
  }
}

class SellTower extends Tower {
  constructor() {
    super({
      name: 'sell',
      cost: '+½',
      level: 0,
      description: 'You can sell any tower and get back the half of its cost.'
    });
  }

  setup(field) {
    this.field = field;
  }
}

function setupTowers() {
  tBasic = new BasicTower();
  tRock = new RockTower();
  tSell = new SellTower();

  builders.towers = new Builder([tBasic, tRock]);
  builders.basic = new Builder([tSell]);
  builders.rock = new Builder([tSell]);
}

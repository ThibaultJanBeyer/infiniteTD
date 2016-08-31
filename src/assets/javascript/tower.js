// Towers
let tBasic,
  tSell,
  tRock,
  builders = {},
  allTowers = [],
  allAttackTowers = [],
  catalogeTowers = [],
  allProjectiles = [],
  readyProjectiles = [];

/* projectile */
class Projectile {
  constructor(field) {
    this.hp = 1;
    this.fullHp = 1;
    this.field = field;
    this.ms = field.tower.pms;
    this.dmg = field.tower.dmg;
    this.x = field.x + fields[0].w / 2;
    this.y = field.y + fields[0].w / 2;
    this.startpos = { x: this.x, y: this.y };
    this.visual = { x: 0, y: 0 };
    this.creep = 0;
    this.follow = field.tower.follow;
    this.e = createElement('div', `projectile projectile__${field.tower.name}`);
    this.e.style.left = `${this.x}px`;
    this.e.style.top = `${this.y}px`;
    this.e.style.opacity = 0;
    allProjectiles.push(this);

    projectileContainer.appendChild(this.e);
  }

  setup(creep) {
    this.dead = false;
    this.creep = creep;
    this.e.style.opacity = 1;
    readyProjectiles.push(this);
  }

  update() {
    this.x = this.field.x + fields[0].w / 2;
    this.y = this.field.y + fields[0].w / 2;
    this.startpos = { x: this.x, y: this.y };
    this.e.style.left = `${this.x}px`;
    this.e.style.top = `${this.y}px`;
  }

  remove() {
    // @TODO: add explosion
    // dead
    this.dead = true;
    // reset
    this.e.style.opacity = 0;
    this.x = this.startpos.x;
    this.y = this.startpos.y;
    this.visual = { x: 0, y: 0 };
    setVendor(this.e, transform, 'translate3d(0, 0, 1px)');
  }

  attack(dt) {
    if(!this.dead) {
      this.dt = dt;
      if (moveObj(this, this.creep)) {
        this.creep.damage(this.dmg);
        this.remove();
      }
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
    this.projectileAnimationCounter = 0;
    this.projectiles = [];

    allTowers.push(this);
  }

  shoot(creep) {
    let n = this.projectileAnimationCounter;
    this.projectiles[n].setup(creep);
    // count up
    if (this.projectileAnimationCounter++ >= 19) {
      this.projectileAnimationCounter = 0;
      // reset all the deads except the last who should continue to attack
      readyProjectiles = [this.projectiles[n]];
    }
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
          console.log(this);
          // then check how many targets the tower can focus
          if(attacked <= this.targets) {
            this.shoot(allCreeps[i]);
            attacked++;
            this.cdCount = 0;
          }
        }
      }
    }
  }
}

class BasicTower extends Tower {
  constructor(superduper) {
    super({
      name: 'basic',
      cost: 50,
      dmg: 50,
      pms: 0.5,
      cd: 1000,
      rng: 0.6,
      description: 'This tower has a high attack speed with a basic damage and range. Upgrades drastically improve its range. Moreover, with special researches, this tower will be key to your success.'
    });
    this.superduper = superduper;

    catalogeTowers.push(this);
  }

  setup(field) {
    this.field = field;
    let i = 20; while (i--) {
      this.projectiles[i] = new Projectile(this.field);
    }
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

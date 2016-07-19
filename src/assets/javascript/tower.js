// Towers
let tArrow,
  towerbuilder;

/* Tower */
class Tower {
  constructor({
    name,
    cost,
    dmg,
    as,
    cd,
    rng
  }) {
    this.name = name;
    this.cost = cost;
    this.dmg = dmg;
    this.as = as;
    this.cd = cd;
    this.rng = rng;
  }
}

function setupTowers() {
  tArrow = new Tower({
    name: 't__arrow',
    cost: 100,
    dmg: 50,
    as: 1000,
    cd: 1000,
    rng: 2
  });
  towerbuilder = new Builder([tArrow]);
}

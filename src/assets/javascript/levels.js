// levels
let levels = {
  1: {
    creeps: {
      name: 'peon',
      hp: 50,
      ms: 10, // less is faster
      bounty: 1
    },
    amount: 1000
  }
};

/**************/
/* next level */
/**************/
function nextLevel() {
  myInterval({
    cd: levels[p1.level].amount,
    dur: 500,
    cb: () => {
      let creep = new Creeps({
        ms: levels[p1.level].creeps.ms,
        hp: levels[p1.level].creeps.hp,
        lvl: p1.level,
        bounty: levels[p1.level].creeps.bounty
      });
      creep.create();
      allCreeps.push(creep);
    }
  });
}

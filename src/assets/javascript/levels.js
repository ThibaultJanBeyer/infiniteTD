// levels
let levels = {
  1: {
    creeps: {
      name: 'peon',
      hp: 50,
      ms: 10,
      bounty: 1
    },
    amount: 10
  },
  2: {
    creeps: {
      name: 'peon',
      hp: 50,
      ms: 10,
      bounty: 1
    },
    amount: 20
  }
}, kills = 0;


/**************/
/* next level */
/**************/
function nextLevel() {  
  myLoop({
    cd: levels[p1.level].amount - 1,
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

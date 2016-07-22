// levels
let levels = {}, kills = 0;

// levels 1-10
for(let i = 1; i <= 10; i++) {
  // @TODO: remove for testing purpose
  if (i === 1) {
    levels[i] = {
      creeps:
      {
        hp: 100000,
        ms: 15,
        bounty: 5
      },
      amount: 1
    };
  } else {
    levels[i] = {
      creeps:
      {
        hp: 10 * i,
        ms: i / 2,
        bounty: 5
      },
      amount: 2 * i
    };
  }
}

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

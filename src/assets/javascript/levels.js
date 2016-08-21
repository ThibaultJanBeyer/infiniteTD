// levels
let levels = {}, kills = 0;

// levels 1-10
let i = 10; while (i--) {
  if (i === 1) {
    levels[i] = {
      creeps:
      {
        hp: 100 * i,
        ms: 10,
        bounty: 5
      },
      amount: 1
    };
  } else {
  levels[i] = {
    creeps:
    {
      hp: 10 * i,
      ms: 1,
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
  creepContainer.innerHTML = '';
  setTimeout(() => {
    for(let i = 0, il = levels[p1.level].amount; i < il; i++) {
      let creep = new Creeps({
        ms: levels[p1.level].creeps.ms,
        hp: levels[p1.level].creeps.hp,
        lvl: p1.level,
        bounty: levels[p1.level].creeps.bounty
      });
      allCreeps.push(creep);
    }
    myInterval({
      cd: allCreeps.length,
      dur: 500,
      cb: ({countdown}) => {
        allCreeps[countdown].setup();
      }
    });
  }, 1000);
}

// levels
let levels = {}, kills = 0;

// levels 1-10
let i = 10; while (i--) {
  if (i === 1) {
    levels[i] = {
      creeps:
      {
        hp: 100 * i,
        ms: 0.1,
        bounty: 5
      },
      amount: 1
    };
  } else {
  levels[i] = {
    creeps:
    {
      hp: 10 * i,
      ms: 0.1,
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
  // remove leftovers
  creepContainer.innerHTML = '';
  projectileContainer.innerHTML = '';
  allCreeps = [];
  // next level
  setTimeout(() => {
    let tempCreeps = [];
    for(let i = 0, il = levels[p1.level].amount; i < il; i++) {
      let creep = new Creeps({
        ms: levels[p1.level].creeps.ms,
        hp: levels[p1.level].creeps.hp,
        lvl: p1.level,
        bounty: levels[p1.level].creeps.bounty
      });
      tempCreeps.push(creep);
    }
    myInterval({
      cd: tempCreeps.length,
      dur: 500,
      cb: ({countdown}) => {
        tempCreeps[countdown].setup();
        allCreeps.push(tempCreeps[countdown]);
      }
    });
  }, 1000);
}

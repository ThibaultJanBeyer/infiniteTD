// levels
let levels = {
  creeps: {
    hp: 10,
    ms: 0.1,
    bounty: 5,
    amount: 1
  }
}, kills = 0;

/**************/
/* next level */
/**************/
function nextLevel() {
  // remove leftovers
  let i = holders.length; while (i--) { holders[i].innerHTML = ''; }
  creepContainer.innerHTML = '';
  allCreeps = [];
  // next level
  setTimeout(() => {
    levels.creeps.hp += 10;
    levels.creeps.ms += 0.01;
    levels.creeps.bounty += 0.1;
    levels.creeps.amount += 1;
    // recycling
    recycleAnimation(recyclings);
    
    let tempCreeps = [];
    for(let i = 0, il = levels.creeps.amount; i < il; i++) {
      let creep = new Creeps({
        ms: levels.creeps.ms,
        hp: levels.creeps.hp,
        lvl: p1.level,
        bounty: levels.creeps.bounty
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

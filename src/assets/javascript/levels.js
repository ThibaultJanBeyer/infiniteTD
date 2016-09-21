// levels
let levels = {
  creeps: {
    hp: 10,
    ms: 0.05,
    bounty: 5,
    amount: 1,
    spawn: 500
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
    levels.creeps.hp += 5;
    levels.creeps.ms += 0.001;
    levels.creeps.bounty += 0.05;
    levels.creeps.amount += 0.5;
    levels.creeps.spawn -= 0.5;
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
      dur: levels.creeps.spawn,
      cb: ({countdown}) => {
        tempCreeps[countdown].setup();
        allCreeps.push(tempCreeps[countdown]);
      }
    });
  }, 1000);
}

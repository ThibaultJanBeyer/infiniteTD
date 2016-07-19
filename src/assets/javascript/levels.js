// levels
let levels = {
  1: {
    creeps: {
      name: 'peon',
      hp: 1,
      ms: 10 // less is faster
    },
    amount: 10
  }
};

/**************/
/* next level */
/**************/
function nextLevel() {

  myLoop({
    cd: levels[p1.level].amount,
    cu: 0,
    dur: 500,
    cb: ({
      cd,
      dur,
      cu
    }) => {
      let creep = new Creeps({
        ms: levels[p1.level].creeps.ms,
        hp: levels[p1.level].creeps.hp,
        lvl: p1.level
      });
      creep.create();
      allCreeps.push(creep);
    }
  });

}

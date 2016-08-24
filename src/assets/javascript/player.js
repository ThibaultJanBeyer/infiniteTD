// users
let p1;

/* Player */
class Player {
  constructor({
    name,
    money,
    level,
    score,
    lives
  }) {
    this.name = name;
    this.money = money;
    this.level = level;
    this.score = score;
    this.lives = lives;
    this.livesAnimationCounter = 0;
    this.moneyAnimationCounter = 0;
  }

  unitKill(unit) {
    this.money += unit.bounty.value;
    this.score += unit.bounty.value;
    scoreboard.update(this);
    
    animateScore([
      [ unit.bounty.creep, unit ],
      [ unit.bounty.money ],
      [ unit.bounty.score ]
    ]);
  }

  levelUp() {
    if (!lostGame) {
      this.level += 1;
      animateScore([ scoreboard.level.up ]);
      scoreboard.update(this);
      if (!levels[this.level]) {
        audio.play('winner_winner_chicken_dinner');
      } else {
        nextLevel();
      }
      setTimeout(() => {
        if (!lostGame) {
          if (this.level % 2 === 0) {
            this.updateLives(1);
          }
        }
      }, 1000);
    }
  }
  
  updateLives(amount) {
    // update lives
    this.lives += amount;
    let n = this.livesAnimationCounter;
    if (amount >= 0) {
      scoreboard.lives.up[n].innerHTML = `+${amount}`;
      animateScore([ scoreboard.lives.up[n] ]);
      setTimeout(recycleAnimation.bind(null, [scoreboard.lives.up[n]]), 1000);
    } else {
      scoreboard.lives.down[n].innerHTML = amount;
      animateScore([ scoreboard.lives.down[n] ]);
      setTimeout(recycleAnimation.bind(null, [scoreboard.lives.down[n]]), 1000);
    }
    this.livesAnimationCounter = (n++ >= 19) ? 0 : this.livesAnimationCounter + 1; 

    scoreboard.update(this);
    // check if lost
    if(this.lives <= 0) {
      lost();
    }
  }

  updateMoney(amount, place) {
    // update wallet
    console.log(amount, place);
    this.money += amount;
    let n = this.livesAnimationCounter;
    if (amount >= 0) {
      scoreboard.money.up[n].innerHTML = `+${amount}`;
      scoreboard.money.up2[n].innerHTML = `+${amount}`;
      animateScore([ 
        scoreboard.money.up[n],
        [ scoreboard.money.up2[n], place ]
      ]);
      setTimeout(recycleAnimation.bind(null, [scoreboard.money.up[n]]), 1000);
      setTimeout(recycleAnimation.bind(null, [scoreboard.money.up2[n]]), 1000);
    } else {
      scoreboard.money.down[n].innerHTML = amount;
      scoreboard.money.down2[n].innerHTML = amount;
      animateScore([ 
        scoreboard.money.down[n],
        [ scoreboard.money.down2[n], place ]
      ]);
      setTimeout(recycleAnimation.bind(null, [scoreboard.money.down[n]]), 1000);
      setTimeout(recycleAnimation.bind(null, [scoreboard.money.down2[n]]), 1000);
    }
    this.moneyAnimationCounter = (n++ >= 19) ? 0 : this.moneyAnimationCounter + 1; 
    scoreboard.update(this);
  }
}

function setupPlayer() {
  p1 = new Player({
    name: 'Player 1',
    money: 100,
    level: 0,
    score: 0,
    lives: 10
  });
  scoreboard.update(p1);
}

function lost() {
  lostGame = true;
  isPaused = true;
  creepContainer.innerHTML = '';
  allCreeps = [];
  let allTowers = board.querySelectorAll('.t');
  let j = allTowers.length; while (j--) {
    allTowers[j].className = 'board__field';
  }
  audio.play('you_lost_try_again');
}

// @TODO: remove cheats
setInterval(() => {
  if (p1.name === 't') {
    p1.updateLives(9999);
    p1.updateMoney(9999);
  }
}, 5000);

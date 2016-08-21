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
  }

  unitKill(unit) {
    this.money += unit.bounty;
    this.score += unit.bounty;
    scoreboard.update(this);
    animateScore({className: 'animation__gainmoney', value: `+${unit.bounty} $`, pos1: unit, pos2: scoreboard.money.container});
    animateScore({className: 'animation__gainpoints', value: `+${unit.bounty}`, pos2: scoreboard.score.container});
  }

  levelUp() {
    if (!lostGame) {
      this.level += 1;
      animateScore({className: 'animation__levelup', value: '+1', pos1: startField, pos2: scoreboard.level.container});
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
    // lose life
    this.lives += amount;
    if (amount >= 0) {
      animateScore({className: 'animation__gainlives', value: `+${amount}`, pos2: scoreboard.lives.container});
    } else {
      animateScore({className: 'animation__loselives', value: amount, pos1: endField, pos2: scoreboard.lives.container});
    }
    scoreboard.update(this);
    // check if lost
    if(this.lives <= 0) {
      lost();
    }
  }

  updateMoney(amount, place) {
    // update wallet
    this.money += amount;
    if (amount >= 0) {
      animateScore({className: 'animation__gainmoney', value: `+${amount} $`, pos1: place, pos2: scoreboard.money.container});
    } else {
      animateScore({className: 'animation__losemoney', value: `${amount} $`, pos1: place, pos2: scoreboard.money.container});
    }
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

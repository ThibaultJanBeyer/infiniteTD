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
    }
  }
  
  loseLife() {
    // lose life
    this.lives--;
    animateScore({className: 'animation__loselife', value: '-1', pos1: endField, pos2: scoreboard.lives.container});
    scoreboard.update(this);
    // check if lost
    if(this.lives <= 0) {
      lost();
    }
  }
}

function setupPlayer() {
  let n = prompt('What’s your name?');
  // @TODO: remove cheats
  let cheats = (n.indexOf('t') > -1) ? 99999 : 100;
  p1 = new Player({
    name: n,
    money: cheats,
    level: 0,
    score: 0,
    lives: cheats / 10
  });
  scoreboard.update(p1);
}

function lost() {
  for(let i = 0; i < allCreeps.length; i++) {
    allCreeps[i].remove();
  }
  let allTowers = board.querySelectorAll('.t');
  for(let i = 0; i < allTowers.length; i++) {
    allTowers[i].className = 'board__field';
  }
  lostGame = true;
  isPaused = true;
  audio.play('you_lost_try_again');
}

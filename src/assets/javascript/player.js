// users
let p1;

/* Player */
class Player {
  constructor({
    name,
    gold,
    level,
    score,
    lives
  }) {
    this.name = name;
    this.gold = gold;
    this.level = level;
    this.score = score;
    this.lives = lives;
  }

  unitKill(bounty) {
    this.gold += bounty;
    this.score += bounty;
    scoreboard.update(this);
  }

  levelUp() {
    if (!lostGame) {
      this.level += 1;
      scoreboard.update(this);
      if (!levels[this.level]) {
        // @TODO: replace alert with nice screen
        alert('winner winner chicken dinner');
      } else {
        nextLevel();
      }
    }
  }
  
  loseLife() {
    // lose life
    this.lives--;
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
    gold: cheats,
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
  alert('you lost');
}

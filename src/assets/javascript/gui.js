// gui
let scoreboard;

/* Scoreboard */
class Scoreboard {
  constructor(name) {
    this.el = createElement('div', 'scoreboard');
    this.name = createElement('strong', 'scoreboard__el scoreboard__el--name');
    this.gold = createElement('p', 'scoreboard__el scoreboard__el--gold');
    this.level = createElement('p', 'scoreboard__el scoreboard__el--level');
    this.score = createElement('p', 'scoreboard__el scoreboard__el--score');
    this.lives = createElement('p', 'scoreboard__el scoreboard__el--lives');
    this.play = createElement('button', 'scoreboard__el scoreboard__el--pause', 'play');
    this.elements = [this.name, this.gold, this.level, this.score, this.lives, this.play];

    this.play.addEventListener('click', () => {
      this.togglePlay();
    });

    appendChilds(this.el, this.elements);
    g.appendChild(this.el);
  }

  update(player) {
    this.name.innerHTML = player.name;
    this.gold.innerHTML = `Gold: ${player.gold}`;
    this.level.innerHTML = `Level: ${player.level}`;
    this.score.innerHTML = `Score: ${player.score}`;
    this.lives.innerHTML = `Lives: ${player.lives}`;
  }

  togglePlay() {
    // if the game is not lost
    if (!lostGame) {
      // if the game has not started yet
      if (!isStarted) {
        isStarted = true;
        p1.levelUp();
      }
      this.play.innerHTML = (isPaused) ? 'pause' : 'play';
      isPaused = !isPaused;
    }
  }
}

function setupScoreboard() {
  scoreboard = new Scoreboard();
}

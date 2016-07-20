/* Globals */
// available elements
let w = window,
  d = document,
  b = d.body,
  g = d.getElementsByClassName('infiniteTD')[0],
  // values
  wX, wY, isPaused = true,
  isStarted = false;

/* Setup Scene */
function init() {

  // Scoreboard
  setupScoreboard();

  // Player
  setupPlayer();

  // Board
  setupBoard();

  // Towerbuilder
  setupTowers();

  // Sizes
  setSizes();
  b.onresize = () => {
    setSizes();
  };

}

setTimeout(() => {
  init();
}, 500);

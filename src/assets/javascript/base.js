/* Globals */
// available elements
let w = window,
  d = document,
  b = d.body,
  g = d.getElementsByClassName('infiniteTD')[0],
  // values
  wX, wY, isPaused = true,
  isStarted = false,
  lostGame = false;

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

  // Gretel = setup the creeps path
  setupGretel(); 

}

setTimeout(() => {
  init();
}, 500);

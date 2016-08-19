/* Globals */
// available elements
const d = document,
  b = d.body,
  g = d.getElementsByClassName('infiniteTD')[0],
  w = window;
  // values
let wX, wY, isPaused = true,
  isStarted = false,
  generalPause = false,
  lostGame = false,
  isDevice = false;

/* Setup Scene */
function init() {

  // Scoreboard
  setupScoreboard();

  // Player
  setupPlayer();

  // Board
  setupBoard();

  // TowerBuilder
  setupTowers();

  // Gretel = setup the creeps path
  setupGretel();

  // Audio
  setupAudio();

  // Extrainfo
  setupExtraInfo();

  // Sizes
  setSizes();
  b.onresize = () => {
    setSizes();
  };
  w.addEventListener('orientationchange', () => {
    setSizes();
  });

}

document.addEventListener('deviceready', function() {
  AndroidFullScreen.immersiveMode();
  isDevice = true;
  init();
}, false);

(function(){
  setTimeout(() => {
    if (!isDevice) {
      init();
    }
  }, 5000);
})();

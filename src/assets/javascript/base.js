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

/* Special functions for mobile usage */

document.addEventListener('deviceready', function() {
  // immersiveMode
  AndroidFullScreen.immersiveMode();
  // keep window on
  getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  // is a device
  isDevice = true;
  // init
  init();
}, false);

// normal usage
(function(){
  setTimeout(() => {
    if (!isDevice) {
      init();
    }
  }, 2000);
})();

/* Main Loop */

window.requestAnimationFrame = (function(){
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

let time = new Date().getTime();
(function mainLoop() {
  requestAnimationFrame(mainLoop);

  // get past time
  let now = new Date().getTime(),
    dt = now - time;

  time = now;

  if (!isPaused) {
    // creeps
    let i = allCreeps.length; while (i--) {
      if (allCreeps[i]) {
        allCreeps[i].nextLocation(dt);
      }
    }

    // projectiles
    let j = readyProjectiles.length; while (j--) {
      readyProjectiles[j].attack(dt);
    }

    // tower detect
    let k = allAttackTowers.length; while (k--) {
      allAttackTowers[k].scan(dt);
    }
  }

})();

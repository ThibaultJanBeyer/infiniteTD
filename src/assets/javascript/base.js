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
    for(let i = 0, il = allCreeps.length; i < il; i++) {
      allCreeps[i].dt = dt;
      nextLocation(allCreeps[i]);
    }

    // projectiles
    for(let i = 0, il = allProjectiles.length; i < il; i++) {
      allProjectiles[i].dt = dt;
      allProjectiles[i].attack();
    }

    // tower detect
    let i = allAttackTowers.length; while (i--) {
      allAttackTowers[i].scan(dt);
    }
  }

})();

// last_t = now()
// while True:
//    t = now()
//    dt = t - last_t   // Vergangene zeit seit dem letzten update
//    last_t = t
//    for objekt in alle_meine_objekte:
//        objekt.update(dt)
//    for objekt in alle_meine_objekte:
//        objekt.render($('game'))

// und objekt.update(dt) sieht dann z.B. so aus:
// function update(dt) {
//    this.x = this.x + this.vx * dt
//    this.y = this.y + this.vy * dt
// }

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

/******************************/
/* Functions for an easy life */
/******************************/

// create elements function
function createElement(tag, classlist, value = '') {
  let el = d.createElement(tag);
  el.className = classlist;
  el.innerHTML = value;
  return el;
}

// append childs function
function appendChilds(to, els) {
  for (let i = 0; i < els.length; i++) {
    to.appendChild(els[i]);
  }
}

// myLoop
// pass number of iterations and dur in ms and counter
function myLoop({ cd, dur, cu, cb }) {
  // passes usefull stuff to callback and augmet the count up by 1
  cb({ cd, dur, cu });
  cu++;
  // decrement cd and call myLoop again if cd >= 0
  if (--cd >= 0) {
    setTimeout(function() {
      myLoop({ cd: cd, dur: dur, cu: cu, cb: cb });
    }, dur);
  }
}

setTimeout(() => {
  init();
}, 500);

/* Globals */
// available elements
let w = window,
    d = document,
    b = d.body,
    g = d.getElementsByClassName('infiniteTD')[0],

// values
wX,
    wY,
    isPaused = true,
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
    setTimeout(function () {
      myLoop({ cd: cd, dur: dur, cu: cu, cb: cb });
    }, dur);
  }
}

setTimeout(() => {
  init();
}, 500);
// fields
let board,
    field = [],
    startField,
    endField,
    topFields = [],
    rightFields = [],
    bottomFields = [],
    leftFields = [],

// values
boardSize = 100,
    boardRowSize = boardSize / 10,
    startFieldP = boardSize / 2 - boardRowSize,
    endFieldP = boardSize / 2;

/***************/
/* Setup Board */
/***************/
/* Field */
class Field {
  constructor(pos) {
    this.e = createElement('button', 'board__field');
    this.locked = false;
    this.start = false;
    this.end = false;
    this.pos = pos;

    this.e.addEventListener('click', e => {
      this.position();
      if (!this.locked) {
        this.openBuilder(towerbuilder);
      } else {
        towerbuilder.hide();
        e.preventDefault();
      }
    });
  }

  lock(unit) {
    this.locked = unit ? unit : true;
    this.e.classList.add('locked');
    if (unit === 'start') {
      this.e.classList.add('start');
      this.start = true;
    } else if (unit === 'end') {
      this.e.classList.add('end');
      this.end = true;
    }
  }

  unlock() {
    this.locked = false;
    this.e.classList.remove('locked');
  }

  position() {
    this.w = this.e.clientWidth;
    this.h = this.e.clientHeight;
    // the fields x position * width - width / 2 (to find center):
    // example: assume that fields have 100 height & width then:
    // on this board:
    //
    // [0,0][0,1][0,2]
    // [1,0][1,1][1,2]
    // [2,0][2,1][2,2]
    // [3,0][3,1][3,2]
    //
    // field 3 (fX=2) in row 3 (fY=2):
    // (note position begins at 0,0)
    // will have a position of
    // x = 3 * 100 - 100 / 2
    // y = 2 * 100 - 100 / 2
    // hence: 250x, 150y
    this.x = this.fX * this.w;
    this.y = this.fY * this.h;
  }

  openBuilder(builder) {
    if (!builder.open) {
      builder.draw(this);
    } else {
      builder.hide();
    }
  }
}

function setupBoard() {

  let tempX = 0,
      tempY = 0;

  // setup board
  board = createElement('div', 'board');

  // fields
  for (let i = 0; i < boardSize; i++) {
    // create each field
    field[i] = new Field(i);
    // give fields x & y coordinates
    // starting from top left with 0, 0 to bottom right
    // to get something like this:
    // [0,0][0,1][0,2]
    // [1,0][1,1][1,2]
    // [2,0][2,1][2,2]
    // [3,0][3,1][3,2]
    //
    field[i].fX = tempX;
    field[i].fY = tempY;
    // give x +1 until last
    // if last x = 0 and y + 1
    if (tempX < boardRowSize - 1) {
      tempX++;
    } else {
      tempX = 0;
      tempY++;
    }
    // lock start & endfield
    if (i === startFieldP) {
      field[i].lock('start');
      startField = field[i];
    } else if (i === endFieldP - 1) {
      field[i].lock('end');
      endField = field[i];
    }
    // append field to board
    board.appendChild(field[i].e);
  }
  // append to game
  g.appendChild(board);

  // as the elements are drawn
  // we can measure the fields
  // size and thus calculate the fields pos
  for (let i = 0; i < field.length; i++) {
    field[i].position();
  }

  // special fields (at the games border)
  for (let i = 0; i < boardRowSize; i++) {
    topFields.push(i);
    leftFields.push(i * boardRowSize);
    bottomFields.push(i + boardSize - boardRowSize);
    rightFields.push(boardRowSize + i * boardRowSize - 1);
  }
}

/* Relative Sizes */
function setSizes() {

  // get viewport of game
  wX = g.offsetWidth || g.clientWidth, wY = g.offsetHeight || g.clientHeight;

  // if the layout is horizontal
  // set the game a square based on the height
  if (wX > wY) {
    board.style.width = wY + 'px';
    board.style.height = wY + 'px';
    // also have the scoreboard elements beneath each other
    scoreboard.elements.forEach(e => {
      e.classList.remove('scoreboard__el--alt');
    });
    // if the layout is horizontal
    // set the game a square based on the width
  } else {
    board.style.width = wX + 'px';
    board.style.height = wX + 'px';
    // also have the scoreboard elements inline
    scoreboard.elements.forEach(e => {
      e.classList.add('scoreboard__el--alt');
    });
  }

  // we will have to recalculate the exact
  // pos of each field since their size changed
  for (let i = 0; i < field.length; i++) {
    field[i].position();
  }
}
/* Builder */
class Builder {
  constructor(options) {
    this.open = false;
    this.e = createElement('div', 'selector');
    this.e.style.transform = 'scale(0,0)';
    this.e.addEventListener('click', () => {
      this.hide();
    });

    for (let i = 0; i < options.length; i++) {
      let towerOption = createElement('button', `selector__element ${ options[i].name }`);
      towerOption.addEventListener('click', () => {
        this.build(options[i], this.selectedField);
      });
      this.e.appendChild(towerOption);
    }

    board.appendChild(this.e);
  }

  draw(field) {
    this.w = `${ field.w * 2 }px`;
    this.h = `${ field.w * 2 }px`;
    this.e.style.transform = 'scale(1,1)';
    this.e.style.width = this.w;
    this.e.style.height = this.h;
    this.e.style.left = `${ field.x - field.w / 2 }px`;
    this.e.style.top = `${ field.y - field.h / 2 }px`;
    this.selectedField = field;
    this.open = true;
  }

  hide() {
    this.e.style.transform = 'scale(0,0)';
    this.open = false;
  }

  build(option, field) {
    // check is player can afford it
    if (p1.gold < option.cost) {
      return alert('you need more gold');
    } else if (field.locked) {
      return alert('can not build here');
      // if he is allowed to buy, proceed
    } else {
      // substract the costs
      p1.gold -= option.cost;
      scoreboard.update(p1);
      // build on the field
      field.e.className += ` t ${ option.name }`;
      field.lock();
    }
  }
}
// Creeps
let allCreeps = [],
    blockTolerance = 5;

/* Creeps */
class Creeps {
  constructor({
    ms,
    hp,
    lvl
  }) {
    this.e = createElement('div', `c__l${ lvl }`);
    this.ms = ms;
    this.hp = hp;
    // this will contains all the creeps last fields
    // a creep should never walk twice on a field
    this.lasts = [];
    // with exception of a tolerance
    this.tolerance = 5;

    this.hpBarC = createElement('div', 'c__hp-container');
    this.hpBar = createElement('div', 'c__hp');
    this.hpBarC.appendChild(this.hpBar);
    this.e.appendChild(this.hpBarC);
  }

  create() {
    this.e.style.transform = 'translate(50%,50%)';
    board.appendChild(this.e);
    this.e.style.left = `${ startField.x }px`;
    this.e.style.top = `${ startField.y }px`;
    this.setupWalk(startField, startField);
  }

  setupWalk(currentField, lastField) {
    if (currentField === endField) {
      this.remove();
      p1.loseLife();
    } else {
      this.x = parseInt(this.e.style.left);
      this.y = parseInt(this.e.style.top);
      // handle fields
      // store & unlock current
      // since creep moves away from curr
      this.current = currentField;
      if (this.current !== startField) {
        this.current.unlock();
      }
      // store last fields
      this.lasts.push(lastField);
      // get next field
      // check if it is available
      this.next = isWalkable(this);
      if (this.next) {
        this.next.lock('creep');
        // calculate the distance
        // (x:10,y:20)[cur] -dist-> [next](x:20,y:20)
        // next.x(20) - cur.x(10) = +10 dist
        // next.y(20) - cur.y(20) = 0 dist
        this.dist = {
          x: this.next.x - this.x,
          y: this.next.y - this.y
        };
        if (this.dist.x !== 0) {
          moveCreep(this, 'x');
        }
        if (this.dist.y !== 0) {
          moveCreep(this, 'y');
        }
      } else {
        alert('don’t block');
      }
    }
  }

  remove(killed) {
    // remove creep
    // from board
    board.removeChild(this.e);
    // from allCreeps array
    allCreeps.splice(allCreeps.indexOf(this), 1);
    // delete it from js memory
    delete Creeps.this;
  }
}

// move creep
function moveCreep(el, direction, cb) {
  if (!isPaused) {
    // negative distance
    if (el.dist[direction] < 0) {
      el[direction]--;
      el.dist[direction]++;
      // positive distance
    } else if (el.dist[direction] > 0) {
      el[direction]++;
      el.dist[direction]--;
    }
    // update creep
    direction === 'x' ? el.e.style.left = `${ el.x }px` : el.e.style.top = `${ el.y }px`;
  }
  if (el.dist[direction] !== 0) {
    setTimeout(function () {
      return moveCreep(el, direction);
    }, el.ms);
  } else {
    return el.setupWalk(el.next, el.current);
  }
}

// check if the surrounding fields
// are not blocked
function isWalkable(el) {

  let current = el.current,
      lasts = el.lasts,

  // store the number of the current position
  num = current.pos,

  // setup fields and check for edge cases
  right = {
    field: field[num + 1],
    edge: rightFields.indexOf(num) > -1 ? true : false
  },
      left = {
    field: field[num - 1],
    edge: leftFields.indexOf(num) > -1 ? true : false
  },
      top = {
    field: field[num - boardRowSize],
    edge: topFields.indexOf(num) > -1 ? true : false
  },
      bottom = {
    field: field[num + boardRowSize],
    edge: bottomFields.indexOf(num) > -1 ? true : false
  };

  // check for the last fields
  // never walk on a field twice
  right.last = lasts.indexOf(right.field) > -1 ? true : false;
  left.last = lasts.indexOf(left.field) > -1 ? true : false;
  top.last = lasts.indexOf(top.field) > -1 ? true : false;
  bottom.last = lasts.indexOf(bottom.field) > -1 ? true : false;

  // check where the endfield is
  // to know which direction to go
  let distanceToEnd = {
    x: endField.x - current.x,
    y: endField.y - current.y
  };
  // assume this board:
  // [ ][    ][ ][ ][   ]
  // [ ][curr][ ][ ][   ]
  // [ ][    ][ ][ ][end]
  // he would first check if the right
  // field is empty then the bottom one
  // because:
  //    distanceToEnd.x = +3 > 0 (x1 = right)
  //    distanceToEnd.y = +1 > 0 (y1 = bottom)

  let goTo = {
    x1: distanceToEnd.x >= 0 ? right : left,
    y1: distanceToEnd.y >= 0 ? bottom : top,
    x2: distanceToEnd.x >= 0 ? left : right,
    y2: distanceToEnd.y >= 0 ? top : bottom
  };

  // if the next field is the end
  if ([left.edge, top.edge, bottom.edge].indexOf(true) <= -1 && [right.field.pos, left.field.pos, top.field.pos, bottom.field.pos].indexOf(endField.pos) > -1) {
    return endField;
    // else check if fields are free
  } else if (!goTo.x1.edge && goTo.x1.field.locked !== true && !goTo.x1.last) {
    return goTo.x1.field;
  } else if (!goTo.y1.edge && goTo.y1.field.locked !== true && !goTo.y1.last) {
    return goTo.y1.field;
  } else if (!goTo.y2.edge && goTo.y2.field.locked !== true && !goTo.y2.last) {
    return goTo.y2.field;
  } else if (!goTo.x2.edge && goTo.x2.field.locked !== true && !goTo.x2.last) {
    return goTo.x2.field;
  } else {
    if (el.tolerance-- > 0) {
      el.lasts.pop();
      return isWalkable(el);
    } else {
      return false;
    }
  }
}
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
    this.gold.innerHTML = `Gold: ${ player.gold }`;
    this.level.innerHTML = `Level: ${ player.level }`;
    this.score.innerHTML = `Score: ${ player.score }`;
    this.lives.innerHTML = `Lives: ${ player.lives }`;
  }

  togglePlay() {
    // if the game has not started yet
    if (!isStarted) {
      isStarted = true;
      p1.levelUp();
      nextLevel();
    }
    this.play.innerHTML = isPaused ? 'pause' : 'play';
    isPaused = !isPaused;
  }
}

function setupScoreboard() {
  scoreboard = new Scoreboard();
}
// levels
let levels = {
  1: {
    creeps: {
      name: 'peon',
      hp: 1,
      ms: 10 // less is faster
    },
    amount: 10
  }
};

/**************/
/* next level */
/**************/
function nextLevel() {

  myLoop({
    cd: levels[p1.level].amount,
    cu: 0,
    dur: 500,
    cb: ({
      cd,
      dur,
      cu
    }) => {
      let creep = new Creeps({
        ms: levels[p1.level].creeps.ms,
        hp: levels[p1.level].creeps.hp,
        lvl: p1.level
      });
      creep.create();
      allCreeps.push(creep);
    }
  });
}
// users
let p1;

/* Player */
class Player {
  constructor({
    name,
    gold = 200,
    level = 0,
    score = 0,
    lives = 10
  }) {
    this.name = name;
    this.gold = gold;
    this.level = level;
    this.score = score;
    this.lives = lives;
  }

  levelUp() {
    this.level += 1;
    scoreboard.update(this);
  }

  loseLife() {
    // lose life
    this.lives--;
    scoreboard.update(this);
    // check if lost
    if (this.lives <= 0) {
      lost();
    }
  }
}

function setupPlayer() {
  let n = 'Tibo' || prompt('What’s your name?');
  p1 = new Player({
    name: n,
    gold: 99999
  });
  scoreboard.update(p1);
}

function lost() {
  for (let i = 0; i < allCreeps.length; i++) {
    allCreeps[i].remove();
  }
  let allTowers = board.querySelectorAll('.t');
  for (let i = 0; i < allTowers.length; i++) {
    allTowers[i].className = 'board__field';
  }
  alert('you lost');
}
// Towers
let tArrow, towerbuilder;

/* Tower */
class Tower {
  constructor({
    name,
    cost,
    dmg,
    as,
    cd,
    rng
  }) {
    this.name = name;
    this.cost = cost;
    this.dmg = dmg;
    this.as = as;
    this.cd = cd;
    this.rng = rng;
  }
}

function setupTowers() {
  tArrow = new Tower({
    name: 't__arrow',
    cost: 100,
    dmg: 50,
    as: 1000,
    cd: 1000,
    rng: 2
  });
  towerbuilder = new Builder([tArrow]);
}
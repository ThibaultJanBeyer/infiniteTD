// fields
let board, creepContainer, projectileContainer, bountyContainer, fields = [], 
  startField, endField,
  topFields = [],
  rightFields = [],
  bottomFields = [],
  leftFields = [],
// values
  boardSize = 100,
  boardRowSize = boardSize / 10,
  startFieldP = boardSize / 2 - boardRowSize,
  endFieldP = boardSize / 2,
// builder
  builderOpen = false;

/***************/
/* Setup Board */
/***************/
function setupBoard() {

  let tempX = 0,
    tempY = 0;

  // setup board
  board = createElement('div', 'board');

  // fields
  for (let i = 0, il = boardSize; i < il; i++) {
    // create each field
    fields[i] = new Field(i);
    // give fields x & y coordinates
    // starting from top left with 0, 0 to bottom right
    // to get something like this:
    // [0,0][0,1][0,2]
    // [1,0][1,1][1,2]
    // [2,0][2,1][2,2]
    // [3,0][3,1][3,2]
    //
    fields[i].fX = tempX;
    fields[i].fY = tempY;
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
      fields[i].lock('start');
      startField = fields[i];
    } else if (i === endFieldP - 1) {
      fields[i].lock('end');
      endField = fields[i];
    }
    // append field to board
    board.appendChild(fields[i].e); 
  }
  // append to game
  g.appendChild(board);

  // as the elements are drawn
  // we can measure the fields
  // size and thus calculate the fields pos
  let j = fields.length; while (j--) {
    fields[j].position();
  }

  // special fields (at the games border)
  for (let k = 0, kl = boardRowSize; k < kl; k++) {
    topFields.push(k);
    leftFields.push(k * boardRowSize);
    bottomFields.push(k + boardSize - boardRowSize);
    rightFields.push(boardRowSize + k * boardRowSize - 1);
  }

  // close builder when outside is clicked
  g.addEventListener('click', (e) => {
    e.stopPropagation();
    globalClick(e);
  });

  // pause / unpause game with spacebar
  g.addEventListener('keyup', (e) => {
    globalKeyboard(e);
  });

  // create creep & projectile container
  creepContainer = d.createElement('div');
  projectileContainer = d.createElement('div');
  bountyContainer = d.createElement('div');
  // add animation elements for money changes
  scoreboard.money.up = [];
  scoreboard.money.up2 = [];
  scoreboard.money.down = [];
  scoreboard.money.down2 = [];
  let l = 20; while (l--) {
    scoreboard.money.up[l] = createElement('span', 'animation__gainmoney animation__gainmoney--scoreboard');
    scoreboard.money.up2[l] = createElement('span', 'animation__gainmoney');
    scoreboard.money.down[l] = createElement('span', 'animation__losemoney animation__losemoney--scoreboard');
    scoreboard.money.down2[l] = createElement('span', 'animation__losemoney');
    appendChilds(scoreboard.money.generalHolder, [scoreboard.money.up[l], scoreboard.money.down[l]]);
    appendChilds(bountyContainer, [scoreboard.money.up2[l], scoreboard.money.down2[l]]);
  }

  // append all
  appendChilds(board, [creepContainer, projectileContainer, bountyContainer]);
}

function globalClick(e) {
  let bu = builders, sb = scoreboard;
  for (let key in bu) {
    if (bu.hasOwnProperty(key) && bu[key].selectedField) {
      let buK = bu[key];
      // hide it
      buK.hide();
      // unpause if the builder was not an upgrade builder
      if (!buK.upgrading && !generalPause && isStarted) { sb.togglePlay(); }
    }
  }
}

function globalKeyboard(e) {
  let key = e.keyCode || e.key;
  // advanced
  // close builder with escape
  if (key === 80 || key === 'p') {
    if (builderOpen) {
      for (let key in builders) {
        if (builders.hasOwnProperty(key) && builders[key].selectedField) {
          builders[key].hide();
        }
      }
    }
    // togglepause
    if(!generalPause && isStarted) { generalPause = !generalPause; scoreboard.togglePlay(); } else { scoreboard.togglePlay(); }
  }
}

/* Relative Sizes */
function setSizes() {

  // get viewport of game
  wX = b.offsetWidth -10;
  wY = b.offsetHeight -10;
  // if the layout is horizontal
  // set the game a square based on the height
  if (wX > wY) {
    board.style.width = `${wY - scoreboard.e.offsetWidth}px`;
    board.style.height = `${wY - scoreboard.e.offsetWidth}px`;
    // also have the scoreboard elements beneath each other
    scoreboard.elements.forEach((e) => { removeClass(e, 'scoreboard__el--alt'); });
    removeClass(scoreboard.e, 'scoreboard--alt');
    removeClass(board, 'board--alt');
    let i = fields.length; while (i--) {
      fields[i].e.style.width = board.clientWidth / 10 + 'px';
      fields[i].e.style.height = board.clientHeight / 10 + 'px';
    }
  // if the layout is vertical
  // set the game a square based on the width
  } else {
    board.style.width = `${wX - scoreboard.e.offsetHeight}px`;
    board.style.height = `${wX - scoreboard.e.offsetHeight}px`;
    // also have the scoreboard elements inline
    scoreboard.elements.forEach((e) => { addClass(e, 'scoreboard__el--alt'); });
    addClass(scoreboard.e, 'scoreboard--alt');
    addClass(board, 'board--alt');
    let i = fields.length; while (i--) {
      fields[i].e.style.width = board.clientWidth / 10 + 'px';
      fields[i].e.style.height = board.clientHeight / 10 + 'px';
    }
  }

  // we will have to recalculate the exact
  // pos of each field since their size changed
  let i = fields.length; while (i--) {
    fields[i].position();
  }

  // also the range of the towers have to be updated
  let j = allTowers.length; while (j--) {
    allTowers[j].update();
  }
}

// Make board accessible via Keyboard
function useBoardWithKey(field, e) {
  let cases = {
      0: { // right
        field: fields[field.pos + 1],
        edge: (rightFields.indexOf(field.pos) > -1) ? true : false,
      },
      1: { // left
        field: fields[field.pos - 1],
        edge: (leftFields.indexOf(field.pos) > -1) ? true : false
      },
      2: { // top
        field: fields[field.pos - boardRowSize],
        edge: (topFields.indexOf(field.pos) > -1) ? true : false
      },
      3: { // bottom
        field: fields[field.pos + boardRowSize],
        edge: (bottomFields.indexOf(field.pos) > -1) ? true : false
      }
    },
    key = e.keyCode || e.key;

  // basic movement
  keyboardBasicMovement(key, cases);
  keyboardEscape(key);

}

function keyboardBasicMovement(key, cases){
  let num = [[39, 'ArrowRight'], [37, 'ArrowLeft'], [38, 'ArrowUp'], [40, 'ArrowDown']];
  let i = num.length; while (i--) {
    if ((key === num[i][0] || key === num[i][1]) && !cases[i].edge) {
      cases[i].field.e.focus();
    }
  }
}

function keyboardEscape(k) {
  let bu = builders, sb = scoreboard;
  if (k === 27 || k === 'Escape') {
    for (let key in bu) {
      if (bu.hasOwnProperty(key)) {
        bu[key].hide();
      }
    }
    sb.play.focus();
  }
}

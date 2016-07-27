// fields
let board, fields = [], 
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
  for (let i = 0; i < boardSize; i++) {
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
  for (let i = 0; i < fields.length; i++) {
    fields[i].position();
  }

  // special fields (at the games border)
  for (let i = 0; i < boardRowSize; i++) {
    topFields.push(i);
    leftFields.push(i * boardRowSize);
    bottomFields.push(i + boardSize - boardRowSize);
    rightFields.push(boardRowSize + i * boardRowSize - 1);
  }

  // close builder when outside is clicked
  g.addEventListener('click', (e) => {
    for (let key in builders) {
      if (builders.hasOwnProperty(key)) {
        builders[key].hide();
      }
    }
  });
}

/* Relative Sizes */
function setSizes() {

  // get viewport of game
  wX = g.offsetWidth || g.clientWidth;
  wY = g.offsetHeight || g.clientHeight;

  // if the layout is horizontal
  // set the game a square based on the height
  if (wX > wY) {
    board.style.width = `${wY - scoreboard.e.offsetWidth}px`;
    board.style.height = `${wY - scoreboard.e.offsetWidth}px`;
    // also have the scoreboard elements beneath each other
    scoreboard.elements.forEach((e) => {
      e.classList.remove('scoreboard__el--alt');
    });
    scoreboard.e.classList.remove('scoreboard--alt');
  // if the layout is vertical
  // set the game a square based on the width
  } else {
    board.style.width = `${wX}px`;
    board.style.height = `${wX}px`;
    // also have the scoreboard elements inline
    scoreboard.elements.forEach((e) => {
      e.classList.add('scoreboard__el--alt');
    });
    scoreboard.e.classList.add('scoreboard--alt');
  }

  // we will have to recalculate the exact
  // pos of each field since their size changed
  for (let i = 0; i < fields.length; i++) {
    fields[i].position();
  }

  // also the range of the towers have to be updated
  for(let i = 0; i < allTowers.length; i++) {
    allTowers[i].update();
  }
}

// Make board accessible via Keyboard
function useBoardWithKey(field, e) {
  let cases = getCases(),
    key = e.keyCode || e.key;

  // basic movement
  basicMovement();
  escape();

  function basicMovement(){
    let num = [[39, 'ArrowRight'], [37, 'ArrowLeft'], [38, 'ArrowUp'], [40, 'ArrowDown']];
    for(let i = 0; i < num.length; i++) {
      if ((key === num[i][0] || key === num[i][1]) && !cases[i].edge) {
        cases[i].field.e.focus();
      }
    }
  }

  function escape() {
    if (key === 27 || key === 'Escape') {
      for (let key in builders) {
        if (builders.hasOwnProperty(key)) {
          builders[key].hide();
        }
      }
      scoreboard.play.focus();
    }
  }

  function getCases() {
    return {
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
    };
  }

}

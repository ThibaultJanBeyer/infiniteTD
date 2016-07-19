// fields
let board, field = [], 
  startField, endField,
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

    this.e.addEventListener('click', (e) => {
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
    this.locked = (unit) ? unit : true;
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
  wX = g.offsetWidth || g.clientWidth,
  wY = g.offsetHeight || g.clientHeight;

  // if the layout is horizontal
  // set the game a square based on the height
  if (wX > wY) {
    board.style.width = wY + 'px';
    board.style.height = wY + 'px';
    // also have the scoreboard elements beneath each other
    scoreboard.elements.forEach((e) => {
        e.classList.remove('scoreboard__el--alt');
      });
      // if the layout is horizontal
      // set the game a square based on the width
  } else {
    board.style.width = wX + 'px';
    board.style.height = wX + 'px';
    // also have the scoreboard elements inline
    scoreboard.elements.forEach((e) => {
      e.classList.add('scoreboard__el--alt');
    });
  }

  // we will have to recalculate the exact
  // pos of each field since their size changed
  for (let i = 0; i < field.length; i++) {
    field[i].position();
  }

}
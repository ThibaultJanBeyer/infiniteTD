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
/* Field */
class Field {
  constructor(pos) {
    this.e = createElement('button', 'board__field');
    this.locked = false;
    this.start = false;
    this.end = false;
    this.pos = pos;

    this.e.addEventListener('click', (e) => {
      e.stopPropagation();
      this.position();
      if (!this.locked) {
        this.openBuilder(builders.towers);
      } else if(this.locked === 'tower') {
        for (let key in builders) {
          if (builders.hasOwnProperty(key)) {
            let element = builders[key];
            if (this.tower.name === `tower__${key}`) {
              this.openBuilder(element, true);
            }
          }
        }
      } else if((this.start || this.end) && !builderOpen) {
        audio.play('do_not_block');
      } else {
        for (let key in builders) {
          if (builders.hasOwnProperty(key)) {
            builders[key].hide();
          }
        }
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
    if (!this.start && !this.end) {
      this.locked = false;
      this.e.classList.remove('locked');
    }
  }

  position() {
    this.w = this.e.offsetWidth;
    this.h = this.e.offsetHeight;
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

  openBuilder(builder, upgrade) {
    if (!builderOpen) {
      builderOpen = true;
      builder.draw(this, upgrade);
    } else {
      for (let key in builders) {
        if (builders.hasOwnProperty(key)) {
          builders[key].hide();
        }
      }
      builderOpen = false;
    }
    
  }

  buildTower(tower) {
    this.e.className += ` tower ${tower.name}`;
    this.e.setAttribute('data-level', tower.level);
    if (this.e.classList.contains('gretel__breadcrumb')) {
      this.e.classList.remove('gretel__breadcrumb');
    }
    this.tower = tower; 
    this.lock('tower');
    this.scan();
  }

  destroyTower() {
    this.e.classList.remove('tower', this.tower.name);
    this.e.removeAttribute('data-level');
    this.unlock();
    clearInterval(this.scanInterval);
    this.tower = 0;
  }

  // scan for creeps nearby tower
  scan() {
    this.cooldown = 0;
    // scan if creeps are nearby
    this.scanInterval = setInterval(() => {
      if(!isPaused) {
        this.cooldown++;
        if (this.cooldown >= this.tower.cd / 10) {
          this.cooldown = 0;
          let attacked = 0;
          // get all creeps
          for(let i = 0; i < allCreeps.length; i++) {
            // check if the creeps distance is within tower range with
            // euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance
            if (euclidDistance(allCreeps[i].x, this.x, allCreeps[i].y, this.y) <= this.tower.rng) {
              // then check how many targets the tower can focus
              if(attacked <= this.tower.targets) {
                this.tower.shoot(this, allCreeps[i]);
                attacked++;
              }
            }
          }
        }
      }
    }, 10);
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

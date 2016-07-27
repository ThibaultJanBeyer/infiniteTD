/****************/
/* Setup Fields */
/****************/
/* Field */
class Field {
  constructor(pos) {
    this.e = createElement('button', 'board__field');
    this.locked = false;
    this.start = false;
    this.end = false;
    this.pos = pos;

    // field click
    this.e.addEventListener('click', (e) => {
      e.stopPropagation();
      handleFieldClick(this, e);
    });

    // keyboard navigation
    // add keyboard event listener
    this.e.addEventListener('keyup', (e) => {
      useBoardWithKey(this, e);
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
      builder.towerOptionE[0].focus();
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
    if (tower.cd !== 0) {
      this.scan();
    }
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

function handleFieldClick(el, e) {
  el.position();
  if (!el.locked) {
    el.openBuilder(builders.towers);
  } else if(el.locked === 'tower') {
    checkWhichTowerToOpen();
  } else if((el.start || el.end) && !builderOpen) {
    audio.play('do_not_block');
  } else {
    for (let key in builders) {
      if (builders.hasOwnProperty(key)) {
        builders[key].hide();
      }
    }
    e.preventDefault();
  }

  function checkWhichTowerToOpen() {
    for (let key in builders) {
      if (builders.hasOwnProperty(key)) {
        let element = builders[key];
        if (el.tower.name === `tower__${key}`) {
          el.openBuilder(element, true);
        }
      }
    }
  }
}

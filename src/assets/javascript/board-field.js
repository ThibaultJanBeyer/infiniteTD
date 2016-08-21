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
    addClass(this.e, 'locked');
    if (unit === 'start') {
      addClass(this.e, 'start');
      this.start = true;
    } else if (unit === 'end') {
      addClass(this.e, 'end');
      this.end = true;
    }
  }

  unlock() {
    if (!this.start && !this.end) {
      this.locked = false;
      removeClass(this.e, 'locked');
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
      builderOpen = false;
    }
    
  }

  buildTower(tower) {
    this.e.className += ` tower ${tower.name}`;
    this.e.setAttribute('data-level', tower.level);
    if (this.e.className.indexOf('gretel__breadcrumb') > -1) {
      removeClass(this.e, 'gretel__breadcrumb');
    }
    this.tower = tower; 
    this.lock('tower');
    if (tower.cd !== 0) {
      this.scan();
    }
    gretel();
  }

  destroyTower() {
    removeClass(this.e, 'tower');
    removeClass(this.e, this.tower.name);
    this.e.removeAttribute('data-level');
    this.unlock();
    clearInterval(this.scanInterval);
    this.tower = 0;
  }

  // scan for creeps nearby tower
  scan() {
    let cooldown = 0, tcooldown = this.tower.cd / 100;
    // scan if creeps are nearby
    this.scanInterval = setInterval(() => {
      if(!isPaused) {
        cooldown += 1;
        if (cooldown >= tcooldown) {
          let attacked = 0,
            t = this.tower,
            trange = t.rng,
            ttargets = t.targets;
          // get all creeps
          let i = allCreeps.length; while (i--) {
            // check if the creeps distance is within tower range with
            // euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance
            if (euclidDistance(allCreeps[i].x, this.x, allCreeps[i].y, this.y) <= trange) {
              // then check how many targets the tower can focus
              if(attacked <= ttargets) {
                t.shoot(this, allCreeps[i]);
                attacked++;
                cooldown = 0;
              }
            }
          }
        }
      }
    }, 100);
  }
}

function handleFieldClick(el, e) {
  let bu = builders, sb = scoreboard;
  el.position();
  if (!el.locked) {
    el.openBuilder(bu.towers);
  } else if(el.locked === 'tower') {
    checkWhichTowerToOpen(el, bu, sb);
  } else if((el.start || el.end) && !builderOpen) {
    audio.play('do_not_block');
  } else {
    // traverse all possible builders
    for (let key in bu) {
      if (bu.hasOwnProperty(key) && bu[key].selectedField) {
        let buK = bu[key];
        // hide it
        buK.hide();
        // unpause if the builder was not an upgrade builder
        if (!buK.upgrading && !generalPause && isStarted) { sb.togglePlay(); }
      }
    }
    e.preventDefault();
  }
}

function checkWhichTowerToOpen(el, bu, sb) {
  for (let key in bu) {
    if (bu.hasOwnProperty(key)) {
      let element = bu[key];
      if (el.tower.name === `tower__${key}`) {
        el.openBuilder(element, true);
      }
    }
  }
}

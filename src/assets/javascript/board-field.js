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
    // check which tower to build
    let i = catalogeTowers.length; while (i--) {
      if(catalogeTowers[i] === tower){
        this.tower = Object.create(catalogeTowers[i]);
        this.tower.setup(this);
        console.log(this.tower);
      }
    }
    
    this.e.className += ` tower ${tower.name}`;
    this.e.setAttribute('data-level', tower.level);
    this.lock('tower');
    if (this.e.className.indexOf('gretel__breadcrumb') > -1) {
      removeClass(this.e, 'gretel__breadcrumb');
    }
    
    gretel();
  }

  destroyTower() {
    removeClass(this.e, 'tower');
    removeClass(this.e, this.tower.name);
    this.e.removeAttribute('data-level');
    this.unlock();
    this.tower = 0;
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

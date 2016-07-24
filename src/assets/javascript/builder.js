/* Builder */
class Builder {
  constructor(options) {
    this.e = createElement('div', 'selector');
    this.e.style.transform = 'scale(0,0)';
    this.e.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });

    for (let i = 0; i < options.length; i++) {
      let towerOption = createElement('button', `selector__element ${options[i].name}`);
      towerOption.addEventListener('click', (e) => {
        this.build(options[i], this.selectedField);
      });
      this.e.appendChild(towerOption);
    }

    board.appendChild(this.e);
  }

  draw(field, upgrade) {
    isPaused = 'building';
    if (!upgrade) {
      this.upgrading = false;
      field.lock('tower');
    } else {
      this.upgrading = true;
    }
    // check if it would block the field
    if(!gretel()) {
      if (!this.upgrading) {
        field.unlock();
      }
      audio.play('do_not_block');
      this.hide();
    } else {
      if (!this.upgrading) {
        field.unlock();
      }
      this.w = `${field.w * 2}px`;
      this.h = `${field.w * 2}px`;
      this.e.style.transform = 'scale(1,1)';
      this.e.style.width = this.w;
      this.e.style.height = this.h;
      this.e.style.left = `${field.x - field.w / 2}px`;
      this.e.style.top = `${field.y - field.h / 2}px`;
      this.selectedField = field;
    }
  }

  hide() {
    if (isStarted) {
      isPaused = false;
    } else {
      isPaused = true;
    }
    this.e.style.transform = 'scale(0,0)';
    builderOpen = false;
    gretel();
  }

  build(option, field) {
    this.hide();
    // is it a sell request
    if (option.name === 'tower__sell') {
      // give some money back
      p1.gold += field.tower.cost / 2;
      scoreboard.update(p1);
      field.destroyTower();
    // check is player can afford it  
    } else if (p1.gold < option.cost) {
      audio.play('need_more_gold');
    } else if(field.locked) {
      audio.play('cannot_build_here');
    // if he is allowed to buy, proceed
    } else {
      // substract the costs
      p1.gold -= option.cost;
      scoreboard.update(p1);
      // build on the field
      field.buildTower(option);
    }
  }
}

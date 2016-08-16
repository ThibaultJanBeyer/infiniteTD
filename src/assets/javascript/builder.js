/* Builder */
class Builder {
  constructor(options) {
    this.selectedField = false;

    this.e = createElement('div', 'selector');
    this.e.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });

    // add tower options
    this.towerContainerE = [];
    this.towerOptionE = [];
    this.towerPriceE = [];
    this.towerInfoE = [];

    for (let i = 0, il = options.length; i < il; i++) {
      let option = options[i];
      let towerContainer = createElement('div', `selector__container ${option.name}`);
      this.towerContainerE.push(towerContainer);
        let towerOption = createElement('button', `selector__element ${option.name}-name`, option.nameOg);
        this.towerOptionE.push(towerOption);
          let towerPrice = createElement('span', `selector__info ${option.name}-price`, `${option.cost}$`);
          this.towerPriceE.push(towerPrice);
        let towerInfo = createElement('button', `selector__info ${option.name}-showinfo`, '?');
        this.towerInfoE.push(towerPrice);
      
      towerInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        if (option.name === 'sell') {
          extraInfo.upgrade(option);
        } else {
          extraInfo.tower(option);
        }
      });
      
      towerOption.addEventListener('click', (e) => {
        e.stopPropagation();
        this.build(option, this.selectedField);
      });

      towerOption.appendChild(towerPrice);
      appendChilds(towerContainer, [towerOption, towerInfo]);
      this.e.appendChild(towerContainer);
    }
    board.appendChild(this.e);

    // tower range
    this.range = createElement('div', 'tower__range');
    this.range.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });
    board.appendChild(this.range);

    // record keyboard input
    this.e.addEventListener('keyup', (e) => {
      userBuilderWithKey(this, e);
    });
  }

  draw(field, upgrade) {
    this.selectedField = field;
    this.selectedField.builder = this;
    field.builder = this;
    if (!upgrade) {
      this.upgrading = false;
      field.lock('tower');
      // pause
      if (!generalPause && isStarted) { scoreboard.togglePlay(); }
    } else {
      this.upgrading = true;
      // tower range
      let size = field.tower.rng * 2 - 10;
      this.range.style.width = `${size}px`;
      this.range.style.height = `${size}px`;
      this.range.style.left = `${field.x + field.w / 2}px`;
      this.range.style.top = `${field.y + field.w / 2}px`;
      this.range.className = 'tower__range tower__range--show';
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
      this.e.className = 'selector selector--show';
      this.e.style.width = this.w;
      this.e.style.height = this.h;
      this.e.style.left = `${field.x - field.w / 2}px`;
      this.e.style.top = `${field.y - field.w / 2}px`;
    }
  }

  hide(general = false) {
    if (this.selectedField) {
      this.selectedField.builder = false;
      this.selectedField = false;
    }
    // unpause & remove the show classes from builders
    this.e.className = 'selector';
    this.range.className = 'tower__range';
    builderOpen = false;
    gretel();
  }

  build(option, field) {
    this.hide();
    if (!this.upgrading) {
      // unpause
      if (!generalPause && isStarted) { scoreboard.togglePlay(); }
    }
    // is it a sell request
    if (option.name === 'tower__sell') {
      // give some money back
      p1.updateMoney(field.tower.cost / 2, field);
      field.destroyTower();
      field.e.focus();
    // check is player can afford it  
    } else if (p1.money < option.cost) {
      audio.play('need_more_money');
    } else if(field.locked) {
      audio.play('cannot_build_here');
    // if he is allowed to buy, proceed
    } else {
      // substract the costs
      p1.updateMoney(option.cost * -1, field);
      // build on the field
      field.buildTower(option);
      field.e.focus();
    }
  }
}

function userBuilderWithKey(builder, e) {
  let key = e.keyCode || e.key;
  // advanced
  // close builder with escape
  if (key === 27 || key === 'Escape') {
    builder.selectedField.e.focus();
    builder.hide();
  }
}

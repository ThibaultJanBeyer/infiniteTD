/* Builder */
class Builder {
  constructor(options) {
    this.e = createElement('div', 'selector');
    this.e.style.transform = 'scale(0, 0)';
    this.e.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });

    for (let i = 0; i < options.length; i++) {
      let towerContainer = createElement('div', `selector__container ${options[i].name}`);
        let towerOption = createElement('button', `selector__element ${options[i].name}-name`, options[i].nameOg);
          let towerPrice = createElement('span', `selector__info ${options[i].name}-price`, `${options[i].cost}$`);
        let towerInfo = createElement('button', `selector__info ${options[i].name}-showinfo`, '?');
      
      towerInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        extraInfo.tower(options[i]);
      });
      
      towerOption.addEventListener('click', (e) => {
        this.build(options[i], this.selectedField);
      });

      towerOption.appendChild(towerPrice);
      appendChilds(towerContainer, [towerOption, towerInfo]);
      this.e.appendChild(towerContainer);
    }

    board.appendChild(this.e);

    // tower range
    this.range = createElement('div', 'tower__range');
    this.range.style.transform = 'scale(0, 0)';
    this.range.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });
    
    board.appendChild(this.range);
  }

  draw(field, upgrade) {
    if (!generalPause && isStarted) {
      scoreboard.togglePlay();
    }
    if (!upgrade) {
      this.upgrading = false;
      field.lock('tower');
    } else {
      this.upgrading = true;
      // tower range
      let size = field.tower.rng * 2 - 10;
      this.range.style.width = `${size}px`;
      this.range.style.height = `${size}px`;
      this.range.style.left = `${field.x + field.w / 2}px`;
      this.range.style.top = `${field.y + field.w / 2}px`;
      this.range.style.transform = `scale(1, 1) translate(-50%, -50%)`;
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
      this.e.style.top = `${field.y - field.w / 2}px`;
      this.selectedField = field;
    }
  }

  hide(general) {
    if (!general && !generalPause && isStarted) {
      scoreboard.togglePlay();
    }
    // unpause ?
    this.e.style.transform = 'scale(0, 0)';
    this.range.style.transform = 'scale(0, 0)';
    builderOpen = false;
    gretel();
  }

  build(option, field) {
    this.hide();
    // is it a sell request
    if (option.name === 'tower__sell') {
      // give some money back
      p1.updateMoney(field.tower.cost / 2, field);
      field.destroyTower();
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
    }
  }
}

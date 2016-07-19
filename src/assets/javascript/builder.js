/* Builder */
class Builder {
  constructor(options) {
    this.open = false;
    this.e = createElement('div', 'selector');
    this.e.style.transform = 'scale(0,0)';
    this.e.addEventListener('click', () => {
      this.hide();
    });

    for (let i = 0; i < options.length; i++) {
      let towerOption = createElement('button', `selector__element ${options[i].name}`);
      towerOption.addEventListener('click', () => {
        this.build(options[i], this.selectedField);
      });
      this.e.appendChild(towerOption);
    }

    board.appendChild(this.e);
  }

  draw(field) {
    this.w = `${field.w * 2}px`;
    this.h = `${field.w * 2}px`;
    this.e.style.transform = 'scale(1,1)';
    this.e.style.width = this.w;
    this.e.style.height = this.h;
    this.e.style.left = `${field.x - field.w / 2}px`;
    this.e.style.top = `${field.y - field.h / 2}px`;
    this.selectedField = field;
    this.open = true;
  }

  hide() {
    this.e.style.transform = 'scale(0,0)';
    this.open = false;
  }

  build(option, field) {
    // check is player can afford it
    if (p1.gold < option.cost) {
      return alert('you need more gold');
    } else if(field.locked) {
      return alert('can not build here');
    // if he is allowed to buy, proceed
    } else {
      // substract the costs
      p1.gold -= option.cost;
      scoreboard.update(p1);
      // build on the field
      field.e.className += ` t ${option.name}`;
      field.lock();
    }
  }
}

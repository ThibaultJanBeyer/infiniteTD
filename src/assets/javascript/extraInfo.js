// see https://github.com/edenspiekermann/a11y-dialog/ for more information
let extraInfo;

class ExtraInfo {
  constructor() {
    // wrapper: <div id="my-accessible-dialog" aria-hidden="true">
    this.wrapper = createElement('div', 'dialog');
    this.wrapper.setAttribute('aria-hidden', 'true');
      // backdrop: <div tabindex="-1" data-a11y-dialog-hide></div>
      this.backdrop = createElement('div', 'dialog-overlay');
      this.backdrop.setAttribute('tabindex', '-1');
      this.backdrop.setAttribute('data-a11y-dialog-hide', 'true');
      // container: <div role="dialog">
      this.container = d.createElement('div');
      this.container.setAttribute('role', 'dialog');
        // e = the visible content container
        this.e = createElement('div', 'dialog-content');
        this.e.setAttribute('role', 'document'); 
          // cont = will hold the content
          this.cont = {};
        // close = <button type="button" data-a11y-dialog-hide aria-label="Close this dialog window">&times;</button>
        this.close = createElement('button', 'dialog-close', '&times;');
        this.close.setAttribute('type', 'button');
        this.close.setAttribute('data-a11y-dialog-hide', 'true');
        this.close.setAttribute('aria-label', 'Close this dialog window');
      appendChilds(this.container, [this.e, this.close]);
    appendChilds(this.wrapper, [this.backdrop, this.container]);

    b.appendChild(this.wrapper);

    this.dialog = new A11yDialog(this.wrapper);
  }

  tower(tower) {
    // reset the modals content
    this.e.innerHTML = '';

    // create the new content
    // cost, level, damage, cooldown
    let els = ['cost', 'level', 'dmg', 'cd'];
    this.cont.floatsContainer = d.createElement('div');
    for(let i = 0; i < els.length; i++) {
      let info = els[i], val = tower[els[i]], extra = '';
      if(els[i] === 'cost') {
        extra = ' $';
      } else if(els[i] === 'dmg') {
        info = 'damage';
      } else if(els[i] === 'cd') {
        info = 'cooldown';
        extra = ' sec';
        val = tower[els[i]] / 1000;
      }
      this.cont[els[i]] = createElement('div', `extra-info__${els[i]}`);
        this.cont[els[i]].text = createElement('div', `extra-info__${els[i]}-text`, `${info}:`);
        this.cont[els[i]].val = createElement('div', `extra-info__${els[i]}-value`, `${val}${extra}`);
        appendChilds(this.cont[els[i]], [this.cont[els[i]].text, this.cont[els[i]].val]);
      this.cont.floatsContainer.appendChild(this.cont[els[i]]);
    }
    // inner-container
    this.cont.container = createElement('div', 'extra-info__container'); 
    this.cont.container.style.maxHeight = `${wY * 0.8}px`;
      // img
      this.cont.imgContainer = createElement('div', 'extra-info__img-container'); 
        this.cont.img = createElement('img', 'extra-info__img');
        this.cont.img.setAttribute('src', `assets/img/${tower.nameOg}.gif`);
        this.cont.img.setAttribute('aria-hidden', 'true');
        this.cont.imgContainer.appendChild(this.cont.img);
      // title
      this.cont.title = createElement('h1', 'extra-info__title', capitalizeFirstLetter(tower.nameOg));
      // desc
      this.cont.description = createElement('p', 'extra-info__description', capitalizeFirstLetter(tower.description));
      appendChilds(this.cont.container, [this.cont.imgContainer, this.cont.title, this.cont.description]);

    appendChilds(this.e, [this.cont.floatsContainer, this.cont.container]);

    // show the modal
    this.dialog.show();
  }
}

function setupExtraInfo() {
  extraInfo = new ExtraInfo();
}

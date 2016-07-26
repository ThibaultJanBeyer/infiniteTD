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
    this.cont.title = createElement('h1', 'extra-info__title', tower.nameOg);
    this.cont.description = createElement('p', 'extra-info__description', tower.description);

    // append the new content
    let appends = [];
    for (let key in this.cont) {
      if (this.cont.hasOwnProperty(key)) {
        appends.push(this.cont[key]);
      }
    }

    appendChilds(this.e, appends);

    // show the modal
    this.dialog.show();
  }
}

function setupExtraInfo() {
  extraInfo = new ExtraInfo();
}

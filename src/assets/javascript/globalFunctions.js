function animateScore({ className, value, pos1, pos2 }) {
  if (pos1) {
    let eBoard = createElement('div', className, value);
    eBoard.style.left = `${pos1.x}px`;
    eBoard.style.top = `${pos1.y}px`;
    board.appendChild(eBoard);
    setTimeout(() => {
      board.removeChild(eBoard);
    }, 1000);
  }
  if (pos2) {
    let eScore = createElement('div', `${className} ${className}--scoreboard`, value);
    pos2.appendChild(eScore);
    setTimeout(() => {
      pos2.removeChild(eScore);
    }, 1000);
  }
}

// this function calculates the x and y increments
// that have to be added each step. Assume following example:
// assume a movementspeed (ms) of 1
//    0 1 2 3 -> x
//  0 A
// -1 
// -2       B
// -3
//  | 
//  v
//  y
// point A is at 0,0 point B at 2,3 to get a smooth movement
// we need to know how many steps are needed to reach the goal
// 1. Which coordinate is further away? (regardless if positive or negative) X or Y (x = 3)
// 2. How many steps do we need to reach B? x / ms (3/1 = 3)
// 3. Thus per step we need an increment of _ for y? y / (x/ms) (2/(3/1) = 0.666)
// 4. was it a positive or negative distance?
function calculateIncrement(el, next) {
  let increment = {};

  if(el.follow) {
    el.dist = {
      x: next.x - el.x,
      y: next.y - el.y
    };
  }

  let x = Math.abs(el.dist.x);
  let y = Math.abs(el.dist.y);

  if (x > y) { // 1.
    increment.x = el.ms;
    increment.steps = x / el.ms; // 2.
    increment.y = y / increment.steps; // 3.
  } else { // 1.
    increment.y = el.ms;
    increment.steps = y / el.ms; // 2.
    increment.x = x / increment.steps; // 3.
  }

  // 4.
  if(el.dist.x < 0) { increment.x *= -1; }
  if(el.dist.y < 0) { increment.y *= -1; }

  return increment;
}

/******************************/
/* Functions for an easy life */
/******************************/

// create elements function
function createElement(tag, classlist, value = '') {
  let el = d.createElement(tag);
  el.className = classlist;
  el.innerHTML = value;
  return el;
}

// Create Svg
function createSVG({
    containerClass = 'scoreboard__el',
    container = 'div',
    svg,
    svgName,
    className = 'scoreboard__icon',
    title,
    extraElement = false
  }) {
  let svgElement = (svg) ? svg : svgName; 
  let el = {};
  el.container = createElement(container, `${containerClass} ${containerClass}-${svgName}`);
    el.svg = d.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.svg.classList.add(`${className}`, `${className}--${svgName}`);
      el.svg.setAttribute('role', 'img');
        el.title = createElement('title', '', title);
        el.use = d.createElementNS('http://www.w3.org/2000/svg', 'use');
        el.use.setAttribute('role', 'presentation');
        el.use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `assets/svg/sprite.svg#${svgElement}`);
  appendChilds(el.svg, [el.title, el.use]);

  if(extraElement) {
    el[extraElement] = createElement(extraElement, `${containerClass}-${extraElement}`);
    appendChilds(el.container, [el.svg, el[extraElement]]);
  } else {
    el.container.appendChild(el.svg);
  }

  return el;
}

// append childs function
function appendChilds(to, els) {
  for (let i = 0; i < els.length; i++) {
    to.appendChild(els[i]);
  }
}

// myLoop
// pass number of iterations and dur in ms and counter
function myLoop({ cd, dur, cu, cb }) {
  // passes usefull stuff to callback and augmet the count up by 1
  cb({ cd, dur, cu });
  cu++;
  // decrement cd and call myLoop again if cd >= 0
  if (--cd >= 0) {
    setTimeout(function() {
      myLoop({ cd: cd, dur: dur, cu: cu, cb: cb });
    }, dur);
  }
}

//myInterval
function myInterval({ cd, dur, cb }) {
  let countdown = cd;
  let loop = setInterval(interval, dur);

  function interval() {
    if (!isPaused) {
      if (--countdown >= 0) {
        cb({ cd, dur });
      } else {
        clearInterval(loop);
      }
    }
  }
}

// euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance 
function euclidDistance(x1,x2,y1,y2) {
	return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
}

function animateScore(els) {
  let i = els.length; while (i--) {
    let el = (els[i][0]) ? els[i][0] : els[i];
    let pos = (els[i][1]) ? els[i][1] : 0;
    
    el.style.visibility = 'visible';

    if (pos.x) {
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
    }

    setVendor(el, 'Transform', 'translate3d(0, -300%, 1px)');
    // el.style.transform = 'translate3d(0, -300%, 1px)';
    el.style.opacity = 0;
  }
}

function recycleAnimation(els) {
  let i = els.length; while (i--) {
    let el = els[i];
    
    el.style.visibility = 'hidden';
    setVendor(el, 'Transform', 'translate3d(0, 0, 1px)');
    // el.style.transform = 'translate3d(0, 0, 1px)';
    el.style.opacity = 1;
  }
}

// move Obj
function moveObj(el, target) {
  let increment;

  if (!isPaused) {
    // calculate the distance
    // (x:10,y:20)[cur] -dist-> [target](x:20,y:20)
    // target.x(20) - cur.x(10) = +10 dist
    // target.y(20) - cur.y(20) = 0 dist
    el.dist = {
      x: target.x - el.x,
      y: target.y - el.y
    };

    increment = calculateIncrement(el, target);
    el.x += increment.x;
    el.y += increment.y;
    // update creep
    el.visual.x += increment.x;
    el.visual.y += increment.y;
    // according to chromes performance timeline, it is way more performant inline the drawings here
    setVendor(el.e, 'Transform', `translate3d(${el.visual.x}px,${el.visual.y}px, 1px)`);
    // el.e.style.transform = `translate3d(${el.visual.x}px,${el.visual.y}px, 1px)`;
  }
  if (Math.abs(el.dist.x) < 10 && Math.abs(el.dist.y) < 10) {
    return true;
  }
  return false;
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
// 1. What is the total distance ?
// 2. How many miliseconds with that movement speed are needed to reach the goal ?
// 3. How much time has passed and thus how many pixels were traveled in that time?
// 4. was it a positive or negative distance?
function calculateIncrement(el, target) {
  let increment = {};

  if(el.follow) {
    el.dist = { // 1
      x: target.x - el.x,
      y: target.y - el.y
    };
  }

  let x = Math.abs(el.dist.x);
  let y = Math.abs(el.dist.y);

  let tX = x / el.ms; // 2
  let tY = y / el.ms; // 2

  increment.x = (tX !== 0) ? x / tX * el.dt : 0; // 3
  increment.y = (tY !== 0) ? y / tY * el.dt : 0; // 3

  if(el.dist.x < 0) { increment.x *= -1; } // 4
  if(el.dist.y < 0) { increment.y *= -1; } // 4

  return increment;
}

/******************************/
/* Functions for an easy life */
/******************************/

// vendor prefixes
function setVendor(element, property, value) {
  element.style[`Webkit${property}`] = value;
  element.style[`Moz${property}`] = value;
  element.style[`MS${property}`] = value;
  element.style[`O${property}`] = value;
}

// capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// create elements function
function createElement(tag, classlist, value = '') {
  let el = d.createElement(tag);
  el.className = classlist;
  el.innerHTML = value;
  return el;
}

// append childs function
function appendChilds(to, els) {
  for (let i = 0, il = els.length; i < il; i++) {
    to.appendChild(els[i]);
  }
}

// myLoop
// pass number of iterations and dur in ms and counter
function myLoop({ cd, dur, cu = 0, cb }) {
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
        cb({ countdown, dur });
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

// sadly old phones do not support the quite new .classlist
// so we have to use this workaround to add/remove classes
// all credits to http://clubmate.fi/javascript-adding-and-removing-class-names-from-elements/
function addClass( element, classname ) {
  var cn = element.className;
  //test for existance
  if( cn.indexOf(classname) !== -1 ) { return; }
  //add a space if the element already has class
  if( cn !== '' ) { classname = ' ' + classname; }
  element.className = cn+classname;
}

function removeClass( element, classname ) {
  var cn = element.className;
  var rxp = new RegExp( classname + '\\b', 'g' );
  cn = cn.replace( classname, '' );
  element.className = cn;
}

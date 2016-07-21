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

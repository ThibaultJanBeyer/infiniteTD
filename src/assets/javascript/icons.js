/*
 * Unfortunately the SVG use method does not work with Chrome when used locally
 * (for security reasons) So I have to hardcode each SVG individually
 * they are stored in variables used in the createSVG function
 * For reasons of ease of use (copy&paste) I still kept them in the /svg/ folder
 * and the svg Sprite. Which however is useless
 */

// Create Svg
function createSVG({
    containerClass = 'scoreboard__el',
    container = 'div',
    svg,
    svgName,
    extraElement = false
  }) {
  let el = {};

  el.container = createElement(container, `${containerClass} ${containerClass}-${svgName}`, svg);

  if(extraElement) {
    el[extraElement] = createElement(extraElement, `${containerClass}-${extraElement}`);
    el.container.appendChild(el[extraElement]);
  }

  return el;
}

// SVGs
let SVGlevel = 
  `<svg viewBox="0 0 8.1 15.9" id="level" class="scoreboard__icon scoreboard__icon--level" role="img">
    <title>Level: </title>
    <path role="presentation" d="M7.5 0h-6C.9 0 0 .3 0 .9v14.4s.2.4.4.5c.2.1.8-.1.8-.1l3.2-2.5 3.2 2.5s.1.2.4 0c.2-.1 0-.5 0-.5V.9C8 .3 8 0 7.5 0zM1 8.9l3-2 3 2v2l-3-2-3 2v-2zM4 12l-3 2.3v-2.4l3-2 3 2v2.4L4 12zm3-4.1l-3-2-3 2V1h6v6.9z"/>
  </svg>`;

let SVGlives = 
  `<svg viewBox="0 0 16 15" id="lives" class="scoreboard__icon scoreboard__icon--lives" role="img">
    <title>Lives: </title>
    <path role="presentation" d="M14.6 1.4C12.8-.5 9.8-.5 8 1.4 6.2-.5 3.2-.5 1.4 1.4c-1.8 1.9-1.8 4.9 0 6.8L8 15l6.6-6.8c1.9-1.9 1.9-4.9 0-6.8zm-.8 5.9l-2.2 2.2L8 13.3 4.4 9.6 2.2 7.3C.9 5.9.8 3.6 2.2 2.2c1.4-1.4 3.6-1.4 5 0L8 3l.8-.8c1.4-1.4 3.6-1.4 5 0 1.4 1.5 1.4 3.7 0 5.1z"/><path d="M11 3c-.4 0-.8.1-1.1.3l.6.8c.1 0 .3-.1.5-.1.6 0 1 .4 1 1 0 .2 0 .3-.1.4l.9.4c.1-.2.2-.5.2-.8 0-1.1-.9-2-2-2z"/>
  </svg>`;

let SVGmoney = 
  `<svg viewBox="0 0 16 16" id="money" class="scoreboard__icon scoreboard__icon--money" role="img">
    <title>Money: </title>
    <path role="presentation" d="M7.8 6.7c-.6-.3-.6-1 .4-1.1.8 0 1.6.2 2.1.4 0 0 .3-1.4.4-1.7-.8-.1-1.4-.2-2-.3v-.9H7.3v1c-1.6.3-2.2 1.5-2.2 2.3 0 2 2.4 2.4 3.1 2.7.8.4.7 1-.1 1.1-.8.2-1.9-.2-2.6-.5L5 11.4c.7.4 1.6.6 2.2.7v.9h1.5v-1c1.3-.2 2.3-1 2.3-2.4 0-1.8-1.9-2.3-3.2-2.9zM8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 15c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/>
  </svg>`;

let SVGplayer =
  `<svg viewBox="-404.9 509.1 15.9 15.9" id="player" class="scoreboard__icon scoreboard__icon--player" role="img">
    <title>Player: </title>
    <path role="presentation" d="M-394.6 518.4c1.6-.8 2.6-2.5 2.6-4.4 0-2.8-2.2-5-5-5s-5 2.2-5 5c0 1.9 1.1 3.5 2.6 4.3-2.9.9-5.2 3.6-5.5 6.6h15.8c-.3-2.9-2.5-5.6-5.5-6.5zm-6.4-4.3c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm-2.6 9.9c.9-3 3.5-5 6.7-5s5.8 2 6.7 5h-13.4z"/>
  </svg>`;

let SVGscore =
  `<svg viewBox="0 0 16 16" id="score" class="scoreboard__icon scoreboard__icon--score" role="img">
    <title>Score: </title>
    <path role="presentation" d="M16 6.1l-5.6-.7L8 0 5.6 5.4 0 6.1l4.1 4-1 5.9 5-2.9 5 2.9-1.1-5.8 4-4.1zm-8 5.5l-3.2 1.9.7-3.8L2.8 7l3.7-.5L8 3l1.6 3.5 3.6.5-2.7 2.6.7 3.8L8 11.6z"/>
  </svg>`;

let SVGaudio = 
    {
      off: 
        `<svg viewBox="0 0 612 792" id="audio-false" class="scoreboard__icon scoreboard__icon--audio" role="img">
          <title>Disable Audio: </title>
          <path role="presentation" d="M153 281.2H38.2c-23 0-38.2 15.3-38.2 38.2v153c0 23 15.3 38.2 38.2 38.2H153l153 153h38.2V128.2H306l-153 153zm153 325.2L172.1 472.5H38.2v-153h133.9L306 185.6v420.8zM604.4 430.4l-53.5-53.6 53.5-53.6c7.6-7.6 7.6-19.1 0-26.8l-7.7-7.6c-7.6-7.6-19.1-7.6-26.8 0l-53.5 53.5-53.6-53.5c-7.6-7.6-19.1-7.6-26.8 0l-7.6 7.6c-7.6 7.6-7.6 19.1 0 26.8l53.5 53.6-53.5 53.6c-7.6 7.6-7.6 19.1 0 26.8l7.6 7.6c7.6 7.6 19.1 7.6 26.8 0l53.6-53.5 53.5 53.5c7.6 7.6 19.1 7.6 26.8 0l7.7-7.6c7.6-7.7 7.6-19.1 0-26.8z"/>
        </svg>`,
      on:
        `<svg viewBox="0 0 612 792" id="audio-true" class="scoreboard__icon scoreboard__icon--audio" role="img">
          <title>Disable Audio: </title>
          <path role="presentation" d="M474.5 542.6c30.6-39.3 48.1-91.8 48.1-148.6s-17.5-109.3-48.1-153c-4.4-4.4-21.9-30.6-39.3-13.1-13.1 13.1 0 35 0 35 26.2 35 43.7 83.1 43.7 131.1 0 48.1-17.5 91.8-43.7 131.1 0 0-8.7 21.9 0 35 13.1 8.8 34.9-8.7 39.3-17.5z"/><path d="M610 394c0-96.2-39.3-183.6-104.9-249.2-8.7-8.7-26.2-26.2-39.3-4.4-8.7 21.9 13.1 39.3 13.1 39.3 52.5 56.8 87.4 131.1 87.4 214.2s-35 157.4-87.4 214.2c0 0-26.2 21.9-8.7 39.3 13.1 13.1 30.6 0 39.3-13.1C570.7 573.2 610 490.2 610 394zM153 281.2H38.2c-23 0-38.2 15.3-38.2 38.2v153c0 23 15.3 38.2 38.2 38.2H153l153 153h38.2V128.2H306l-153 153zm153 325.2L172.1 472.5H38.2v-153h133.9L306 185.6v420.8z"/>
        </svg>`
    };

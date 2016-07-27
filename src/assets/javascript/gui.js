// gui
let scoreboard,
  sounds =
  {
    'resources':
    [
      ['assets/sounds/sprite.ogg', 'audio/mp3'],
      ['assets/sounds/sprite.mp3', 'audio/ogg']
    ],
    'spritemap':
    {
      'cannot_build_here':
      {
        'start': 0,
        'end': 1.3,
        'loop': false
      },
      'do_not_block':
      {
        'start': 3,
        'end': 4,
        'loop': false
      },
      'finish_building_process_first':
      {
        'start': 5,
        'end': 7.1,
        'loop': false
      },
      'need_more_money':
      {
        'start': 9,
        'end': 10.2,
        'loop': false
      },
      'winner_winner_chicken_dinner':
      {
        'start': 12,
        'end': 13.5,
        'loop': false
      },
      'you_lost_try_again':
      {
        'start': 15,
        'end': 17.3,
        'loop': false
      }
    }
  },
  audio,
  soundOff = false;

/* Scoreboard */
class Scoreboard {
  constructor() {
    this.e = createElement('div', 'scoreboard');
    this.play = createElement('button', 'scoreboard__el scoreboard__el-pause', 'play');
    this.m = createElement('p', 'scoreboard__el scoreboard__el-message', '.');
    this.money = createSVG({svgName: 'money', title: 'Money: ', extraElement: 'p'});
    this.player = createSVG({svgName: 'player', title: 'Player: ', extraElement: 'input'});
    this.player.input.setAttribute('aria-label', 'Player name: ');
    this.level = createSVG({svgName: 'level', title: 'Level: ', extraElement: 'p'});
    this.score = createSVG({svgName: 'score', title: 'Score: ', extraElement: 'p'});
    this.lives = createSVG({svgName: 'lives', title: 'Lives: ', extraElement: 'p'});
    this.audio = createSVG({
      container: 'button',
      svgName: 'audio', 
      svg: `sound-${soundOff}`,
      title: 'Disable Ausio: '
    });

    // Global Play & Pause
    this.play.addEventListener('click', (e) => {
      e.stopPropagation();
      // closebuilders
      // and pause/unpause the game
      if (isStarted) {
        if (isPaused === true) { generalPause = true; }
        generalPause = !generalPause;
      } else {
        // first time click on Play
        setSizes();
        generalPause = false;
      }
      // close all builders
      for (let key in builders) {
        if (builders.hasOwnProperty(key)) {
          builders[key].hide(true);
        }
      }
      // toggle the button
      this.togglePlay();
      // reset to true if not otherwise
      if (generalPause) { isPaused = true; }
    });

    // Audio
    this.audio.container.addEventListener('click', () => {
      this.toggleAudio();
    });

    // Player Name
    this.player.input.addEventListener('keyup', (e) => {
      let key = e.keyCode || e.key;
      if (key === 13 || key === 'Enter') {
        this.player.input.blur();
      } else {
        this.playerName(p1);
      }
    });
    this.player.input.addEventListener('focus', () => {
      this.player.container.classList.add('scoreboard__hint');
      this.player.input.select();
    });
    this.player.input.addEventListener('blur', () => {
      this.player.container.classList.remove('scoreboard__hint');
    });

    // Append all
    this.elements = [this.player.container, this.money.container, this.score.container, this.lives.container, this.level.container, this.play, this.audio.container, this.m];
    appendChilds(this.e, this.elements);
    g.appendChild(this.e);

    setTimeout(() => {
      this.player.input.select();
    }, 100);
  }

  update(player) {
    this.player.input.value = player.name;
    this.money.p.innerHTML = Math.floor(player.money);
    this.level.p.innerHTML = Math.floor(player.level);
    this.score.p.innerHTML = Math.floor(player.score);
    this.lives.p.innerHTML = Math.floor(player.lives);
  }

  message(message, duration) {
    this.m.innerHTML = message;
    this.m.className += ' scoreboard__el--flash';
    setTimeout(() => {
      this.m.classList.remove('scoreboard__el--flash');
    }, Math.floor(duration) * 1000 + 500);
  }

  togglePlay() {
    // if the game is not lost
    if (!lostGame) {
      // if the game has not started yet
      if (!isStarted) {
        isStarted = true;
        p1.levelUp();
      }
      this.play.innerHTML = (isPaused) ? 'pause' : 'play';
      isPaused = !isPaused;
    }
  }

  toggleAudio() {
    soundOff = !soundOff;
    this.audio.title.innerHTML = (soundOff) ? 'Turn audio on.' : 'Turn audio off.';
    this.audio.use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `assets/svg/sprite.svg#sound-${soundOff}`);
  }

  playerName(player) {
    player.name = this.player.input.value;
    this.update(player);
  }
}

function setupScoreboard() {
  scoreboard = new Scoreboard();
}

/* Audio */
class Audio {
  constructor() {
    this.e = createElement('audio', 'audio__player');
    this.e.setAttribute('preload', 'true');

    this.src = [];
    for(let i = 0; i < sounds.resources.length; i++) {
      this.src[i] = d.createElement('source');
      this.src[i].setAttribute('src', sounds.resources[i][0]);
      this.src[i].setAttribute('type', sounds.resources[i][1]);
      this.e.appendChild(this.src[i]);
    }

    g.appendChild(this.e);

    // If the time of the file playing is updated, compare it
    // to the current end time and stop playing when this one
    // is reached
    this.e.addEventListener('timeupdate', () => {
      if (this.e.currentTime > this.end) {
        this.e.pause();
      }
    }, false);
  }

  // Play the current audio sprite by setting the currentTime
  play(sound) {
    if (sounds.spritemap[sound] && !soundOff) {
      this.e.currentTime = sounds.spritemap[sound].start;
      this.end = sounds.spritemap[sound].end;
      scoreboard.message(`${sound.replace(/_/g, ' ')}`, this.end - this.e.currentTime);
      this.e.play();
    } else {
      scoreboard.message(`${sound.replace(/_/g, ' ')}`, 2);
    }
  }
}

function setupAudio() {
  audio = new Audio();
}

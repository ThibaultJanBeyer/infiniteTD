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
  soundOff = false,
  holders = [], recyclings = [];

/* Scoreboard */
class Scoreboard {
  constructor() {
    // scoreboard element
    this.e = createElement('div', 'scoreboard');
    // player icon + Inputfield
    this.player = createSVG({svgName: 'player', extraElement: 'input', svg: SVGplayer});
    this.player.input.setAttribute('aria-label', 'Player name: ');
    // money icon + holder for money gain and lose
    this.money = createSVG({svgName: 'money', extraElement: 'p', svg: SVGmoney});
      this.money.holder = d.createElement('div');
      holders.push(this.money.holder);
      this.money.generalHolder = d.createElement('div');
      appendChilds(this.money.container, [this.money.holder, this.money.generalHolder]);
    // level icon + holder for level +1
    this.level = createSVG({svgName: 'level', extraElement: 'p', svg: SVGlevel});
      this.level.holder = d.createElement('div');
        this.level.up = createElement('span', 'animation__levelup animation__levelup--scoreboard', '+1');
        this.level.holder.appendChild(this.level.up);
      this.level.container.appendChild(this.level.holder);
      recyclings.push(this.level.up);
    // score icon + holder for gain
    this.score = createSVG({svgName: 'score', extraElement: 'p', svg: SVGscore});
      this.score.holder = d.createElement('div');
      this.score.container.appendChild(this.score.holder);
      holders.push(this.score.holder);
    // lives icon + holder for gain/lose + gain/lose element
    this.lives = createSVG({svgName: 'lives', extraElement: 'p', svg: SVGlives});
      this.lives.holder = d.createElement('div');
      this.lives.container.appendChild(this.lives.holder);
    this.controls = createElement('div', 'scoreboard__el-controls');
      this.play = createElement('button', 'scoreboard__el scoreboard__el-pause', 'play');
      this.audioOff = createSVG({container: 'button', svgName: 'audio', svg: SVGaudio.off});
      this.audioOn = createSVG({container: 'button', svgName: 'audio', svg: SVGaudio.on});
      this.audioOn.container.style.display = 'none';
      appendChilds(this.controls, [this.play, this.audioOff.container, this.audioOn.container]);
    this.m = createElement('p', 'scoreboard__el scoreboard__el-message', '.');

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
    this.audioOn.container.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAudio();
    });
    this.audioOff.container.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAudio();
    });

    // Player Name
    this.player.input.addEventListener('keyup', (e) => {
      let key = e.keyCode || e.key;
      e.stopPropagation();
      if (key === 13 || key === 'Enter') {
        g.focus();
      } else {
        this.playerName(p1);
      }
    });
    this.player.input.addEventListener('focus', () => {
      addClass(this.player.container, 'scoreboard__hint');
      this.player.input.select();
    });
    this.player.input.addEventListener('blur', () => {
      removeClass(this.player.container, 'scoreboard__hint');
    });

    // Append all
    this.elements = [this.player.container, this.money.container, this.score.container, this.lives.container, this.level.container, this.controls, this.m];
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
    this.m.style.display = 'block';
    this.m.innerHTML = message;
    this.m.className += ' scoreboard__el--flash';
    setTimeout(() => {
      removeClass(this.m, 'scoreboard__el--flash');
      setTimeout(() => {
        this.m.style.display = 'none';
      }, 1000);
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
    if (soundOff) {
      this.audioOff.container.style.display = 'none';
      this.audioOn.container.style.display = 'inline-block';
    } else {
      this.audioOff.container.style.display = 'inline-block';
      this.audioOn.container.style.display = 'none';
    }
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
    let i = sounds.resources.length; while (i--) {
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

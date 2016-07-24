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
        'end': 4.1,
        'loop': false
      },
      'finish_building_process_first':
      {
        'start': 5,
        'end': 7.1,
        'loop': false
      },
      'need_more_gold':
      {
        'start': 9,
        'end': 10.1,
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
  constructor(name) {
    this.e = createElement('div', 'scoreboard');

    this.name = createElement('strong', 'scoreboard__el scoreboard__el--name');
    this.gold = createElement('p', 'scoreboard__el scoreboard__el--gold');
    this.level = createElement('p', 'scoreboard__el scoreboard__el--level');
    this.score = createElement('p', 'scoreboard__el scoreboard__el--score');
    this.lives = createElement('p', 'scoreboard__el scoreboard__el--lives');
    this.play = createElement('button', 'scoreboard__el scoreboard__el--pause', 'play');
    
    this.audio = createElement('button', 'scoreboard__el scoreboard__el--audio');
    this.audioSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.audioSvg.classList.add('scoreboard__icon');
    this.audioSvg.setAttribute('role', 'img');
    this.audioTitle = createElement('title', '', 'Disable Audio');
    this.audioUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    this.audioUse.setAttribute('role', 'presentation');
    this.audioUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `assets/svg/sprite.svg#sound-${soundOff}`);
    appendChilds(this.audioSvg, [this.audioTitle, this.audioUse]);
    this.audio.appendChild(this.audioSvg);

    this.m = createElement('p', 'scoreboard__el scoreboard__el--message');
    this.elements = [this.name, this.gold, this.level, this.score, this.lives, this.play, this.audio, this.m];

    this.play.addEventListener('click', () => {
      this.togglePlay();
    });
    this.audio.addEventListener('click', () => {
      this.toggleAudio();
    });

    appendChilds(this.e, this.elements);
    g.appendChild(this.e);
  }

  update(player) {
    this.name.innerHTML = player.name;
    this.gold.innerHTML = `Gold: ${Math.floor(player.gold)}`;
    this.level.innerHTML = `Level: ${Math.floor(player.level)}`;
    this.score.innerHTML = `Score: ${Math.floor(player.score)}`;
    this.lives.innerHTML = `Lives: ${Math.floor(player.lives)}`;
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
    if (isPaused === 'building') {
      audio.play('finish_building_process_first');
    } else if (!lostGame) {
      // if the game has not started yet
      if (!isStarted) {
        isStarted = true;
        p1.levelUp();
      } else {
        generalPause = !generalPause;
      }
      this.play.innerHTML = (isPaused) ? 'pause' : 'play';
      isPaused = !isPaused;
    }
  }

  toggleAudio() {
    soundOff = !soundOff;
    this.audioTitle.innerHTML = (soundOff) ? 'Turn audio on.' : 'Turn audio off.';
    this.audioUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `assets/svg/sprite.svg#sound-${soundOff}`);
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
      this.src[i] = document.createElement('source');
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

#Graphics

- Design bosses


#Animation

- Missiles should explode on hit
- Creeps should explode when dying


#User Stories

- As a user I want a lag free game
- As a user I want to save my progress
- As I user I want to see my ranking among other players


#Towers

- Add general upgrades to towers
- Add a Canon tower (splash damage)
- Canon tower: upgrade to Flame tower (with +dps)
- Canon tower: upgrade to Multi tower (with multiple targets)
- Add a Slow tower (slowing enemies)
- Slow tower: upgrade to Poison tower (single target slow +dps)
- Slow tower: upgrade to Frost tower (splash slow)
- Basic tower: upgrade to Critical tower
- Basic tower: upgrade to Stun tower
- Basic tower: upgrade to Fury tower (more damage on each hit)


#Ennemies

- Add bosses every 10th level
- Have an infinite or extremely high amount of levels


#Balancing

- The game should be very difficult to master


#Misc

- Add a good Readme.md
- Add a Contribute.md
- Fix Audio playing in Cordova
http://stackoverflow.com/questions/24643619/cordova-media-plugin-vs-html5-audio
https://github.com/devgeeks/ExampleHTML5AudioStreaming
https://forum.ionicframework.com/t/how-to-play-local-audio-files/7479


#Performance

- Reduce draws by reducing DOM manipulation (Update Layer tree)
  - +1 animations should already be in the DOM and recycled
  - Projectiles should already be in the DOM and recycled
- Reduce drawing by movement (recalculating styles)
  - All movement should be transforms instead of Top/Left position whenever possible
- Check where layout comes from
  - Reading of properties first then recalculating second. See: https://engineering.gosquared.com/optimising-60fps-everywhere-in-javascript
- Reduce Paint
  - Maybe remove gradient?
  - Removing global focus?
  - Instead of hiding elements by adding a class, use transform scale (0,0)?



---
#Utopia

- Multiplayer
- Level builder
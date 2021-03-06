'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}/* Globals */// available elements
var d=document,b=d.body,g=d.getElementsByClassName('infiniteTD')[0],w=window;// values
var wX=void 0,wY=void 0,isPaused=true,isStarted=false,generalPause=false,lostGame=false,isDevice=false;/* Setup Scene */function init(){// Scoreboard
setupScoreboard();// Player
setupPlayer();// Board
setupBoard();// TowerBuilder
setupTowers();// Gretel = setup the creeps path
setupGretel();// Audio
setupAudio();// Extrainfo
setupExtraInfo();// Sizes
setSizes();b.onresize=function(){setSizes();};w.addEventListener('orientationchange',function(){setSizes();});}/* Special functions for mobile usage */document.addEventListener('deviceready',function(){// immersiveMode
AndroidFullScreen.immersiveMode();// keep window on
getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);// is a device
isDevice=true;// init
init();},false);// normal usage
(function(){setTimeout(function(){if(!isDevice){init();}},2000);})();/* Main Loop */window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};}();var time=new Date().getTime();(function mainLoop(){requestAnimationFrame(mainLoop);// get past time
var now=new Date().getTime(),dt=now-time;time=now;if(!isPaused){// creeps
var i=allCreeps.length;while(i--){if(allCreeps[i]){allCreeps[i].nextLocation(dt);}}// projectiles
var j=readyProjectiles.length;while(j--){readyProjectiles[j].attack(dt);}// tower detect
var k=allAttackTowers.length;while(k--){allAttackTowers[k].scan(dt);}}})();/****************//* Setup Fields *//****************//* Field */var Field=function(){function Field(pos){var _this=this;_classCallCheck(this,Field);this.e=createElement('button','board__field');this.locked=false;this.start=false;this.end=false;this.pos=pos;// field click
this.e.addEventListener('click',function(e){e.stopPropagation();handleFieldClick(_this,e);});// keyboard navigation
// add keyboard event listener
this.e.addEventListener('keyup',function(e){useBoardWithKey(_this,e);});}_createClass(Field,[{key:'lock',value:function lock(unit){this.locked=unit?unit:true;addClass(this.e,'locked');if(unit==='start'){addClass(this.e,'start');this.start=true;}else if(unit==='end'){addClass(this.e,'end');this.end=true;}}},{key:'unlock',value:function unlock(){if(!this.start&&!this.end){this.locked=false;removeClass(this.e,'locked');}}},{key:'position',value:function position(){this.w=this.e.offsetWidth;this.h=this.e.offsetHeight;// the fields x position * width - width / 2 (to find center):
// example: assume that fields have 100 height & width then:
// on this board:
//
// [0,0][0,1][0,2]
// [1,0][1,1][1,2]
// [2,0][2,1][2,2]
// [3,0][3,1][3,2]
//
// field 3 (fX=2) in row 3 (fY=2):
// (note position begins at 0,0)
// will have a position of
// x = 3 * 100 - 100 / 2
// y = 2 * 100 - 100 / 2
// hence: 250x, 150y
this.x=this.fX*this.w;this.y=this.fY*this.h;}},{key:'openBuilder',value:function openBuilder(builder,upgrade){if(!builderOpen){builderOpen=true;builder.draw(this,upgrade);builder.towerOptionE[0].focus();}else{var bu=builders,sb=scoreboard;for(var key in bu){if(bu.hasOwnProperty(key)&&bu[key].selectedField){var buK=bu[key];// hide it
buK.hide();// unpause if the builder was not an upgrade builder
if(!buK.upgrading&&!generalPause&&isStarted){sb.togglePlay();}}}builderOpen=false;}}},{key:'buildTower',value:function buildTower(tower){// check which tower to build
// let i = catalogeTowers.length; while (i--) {
//   if(catalogeTowers[i] === tower){
//     this.tower = Object.create(catalogeTowers[i]);
//     // how to create a class tower based on a name??
//     this.tower.setup(this);
//   }
// }
if(tower.nameOg==='basic'){this.tower=new BasicTower();this.tower.setup(this);}else if(tower.nameOg==='rock'){this.tower=new RockTower();this.tower.setup(this);}this.e.className+=' tower '+tower.name;this.e.setAttribute('data-level',tower.level);this.lock('tower');if(this.e.className.indexOf('gretel__breadcrumb')>-1){removeClass(this.e,'gretel__breadcrumb');}gretel();}},{key:'destroyTower',value:function destroyTower(){removeClass(this.e,'tower');removeClass(this.e,this.tower.name);this.e.removeAttribute('data-level');this.unlock();this.tower=0;}}]);return Field;}();function handleFieldClick(el,e){var bu=builders,sb=scoreboard;el.position();if(!el.locked){el.openBuilder(bu.towers);}else if(el.locked==='tower'){checkWhichTowerToOpen(el,bu,sb);}else if((el.start||el.end)&&!builderOpen){audio.play('do_not_block');}else{// traverse all possible builders
for(var key in bu){if(bu.hasOwnProperty(key)&&bu[key].selectedField){var buK=bu[key];// hide it
buK.hide();// unpause if the builder was not an upgrade builder
if(!buK.upgrading&&!generalPause&&isStarted){sb.togglePlay();}}}e.preventDefault();}}function checkWhichTowerToOpen(el,bu,sb){for(var key in bu){if(bu.hasOwnProperty(key)){var element=bu[key];if(el.tower.name==='tower__'+key){el.openBuilder(element,true);}}}}// fields
var board=void 0,creepContainer=void 0,projectileContainer=void 0,bountyContainer=void 0,livesContainer=void 0,fields=[],startField=void 0,endField=void 0,topFields=[],rightFields=[],bottomFields=[],leftFields=[],// values
boardSize=100,boardRowSize=boardSize/10,startFieldP=boardSize/2-boardRowSize,endFieldP=boardSize/2,// builder
builderOpen=false;/***************//* Setup Board *//***************/function setupBoard(){var tempX=0,tempY=0;// setup board
board=createElement('div','board');// fields
for(var i=0,il=boardSize;i<il;i++){// create each field
fields[i]=new Field(i);// give fields x & y coordinates
// starting from top left with 0, 0 to bottom right
// to get something like this:
// [0,0][0,1][0,2]
// [1,0][1,1][1,2]
// [2,0][2,1][2,2]
// [3,0][3,1][3,2]
//
fields[i].fX=tempX;fields[i].fY=tempY;// give x +1 until last
// if last x = 0 and y + 1
if(tempX<boardRowSize-1){tempX++;}else{tempX=0;tempY++;}// lock start & endfield
if(i===startFieldP){fields[i].lock('start');startField=fields[i];}else if(i===endFieldP-1){fields[i].lock('end');endField=fields[i];}// append field to board
board.appendChild(fields[i].e);}// append to game
g.appendChild(board);// as the elements are drawn
// we can measure the fields
// size and thus calculate the fields pos
var j=fields.length;while(j--){fields[j].position();}// special fields (at the games border)
for(var k=0,kl=boardRowSize;k<kl;k++){topFields.push(k);leftFields.push(k*boardRowSize);bottomFields.push(k+boardSize-boardRowSize);rightFields.push(boardRowSize+k*boardRowSize-1);}// close builder when outside is clicked
b.addEventListener('click',function(e){e.stopPropagation();globalClick(e);});// pause / unpause game with p
d.addEventListener('keyup',function(e){globalKeyboard(e);});// create creep & projectile container
creepContainer=createElement('div','creep-container');projectileContainer=createElement('div','projectile-container');bountyContainer=createElement('div','bounty-container');livesContainer=createElement('div','lives-container');// add animation elements for money changes
scoreboard.money.up=[];scoreboard.money.up2=[];scoreboard.money.down=[];scoreboard.money.down2=[];var l=20;while(l--){scoreboard.money.up[l]=createElement('span','animation__gainmoney animation__gainmoney--scoreboard');scoreboard.money.up2[l]=createElement('span','animation__gainmoney');scoreboard.money.down[l]=createElement('span','animation__losemoney animation__losemoney--scoreboard');scoreboard.money.down2[l]=createElement('span','animation__losemoney');appendChilds(scoreboard.money.generalHolder,[scoreboard.money.up[l],scoreboard.money.down[l]]);appendChilds(bountyContainer,[scoreboard.money.up2[l],scoreboard.money.down2[l]]);}// create several gain/lose elements since a player could lose several lives simultaneously
scoreboard.lives.up=[];scoreboard.lives.up2=[];scoreboard.lives.down=[];scoreboard.lives.down2=[];var m=20;while(m--){scoreboard.lives.up[m]=createElement('span','animation__gainlives animation__gainlives--scoreboard','+1');scoreboard.lives.up2[m]=createElement('span','animation__gainlives','+1');scoreboard.lives.down[m]=createElement('span','animation__loselives animation__loselives--scoreboard','-1');scoreboard.lives.down2[m]=createElement('span','animation__loselives','-1');appendChilds(scoreboard.lives.holder,[scoreboard.lives.up[m],scoreboard.lives.down[m]]);appendChilds(livesContainer,[scoreboard.lives.up2[m],scoreboard.lives.down2[m]]);}// append all
appendChilds(board,[creepContainer,projectileContainer,bountyContainer,livesContainer]);}function globalClick(e){var bu=builders,sb=scoreboard;for(var key in bu){if(bu.hasOwnProperty(key)&&bu[key].selectedField){var buK=bu[key];// hide it
buK.hide();// unpause if the builder was not an upgrade builder
if(!buK.upgrading&&!generalPause&&isStarted){sb.togglePlay();}}}}function globalKeyboard(e){var key=e.keyCode||e.key;// advanced
// close builder with escape
if(key===80||key==='p'){if(builderOpen){for(var _key in builders){if(builders.hasOwnProperty(_key)&&builders[_key].selectedField){builders[_key].hide();}}}// togglepause
if(!generalPause&&isStarted){generalPause=!generalPause;scoreboard.togglePlay();}else{scoreboard.togglePlay();}}}/* Relative Sizes */function setSizes(){// get viewport of game
wX=b.offsetWidth-10;wY=b.offsetHeight-10;// if the layout is horizontal
// set the game a square based on the height
if(wX>wY){board.style.width=wY-scoreboard.e.offsetWidth+'px';board.style.height=wY-scoreboard.e.offsetWidth+'px';// also have the scoreboard elements beneath each other
scoreboard.elements.forEach(function(e){removeClass(e,'scoreboard__el--alt');});removeClass(scoreboard.e,'scoreboard--alt');removeClass(board,'board--alt');var _i2=fields.length;while(_i2--){fields[_i2].e.style.width=board.clientWidth/10+'px';fields[_i2].e.style.height=board.clientHeight/10+'px';}// if the layout is vertical
// set the game a square based on the width
}else{board.style.width=wX-scoreboard.e.offsetHeight+'px';board.style.height=wX-scoreboard.e.offsetHeight+'px';// also have the scoreboard elements inline
scoreboard.elements.forEach(function(e){addClass(e,'scoreboard__el--alt');});addClass(scoreboard.e,'scoreboard--alt');addClass(board,'board--alt');var _i3=fields.length;while(_i3--){fields[_i3].e.style.width=board.clientWidth/10+'px';fields[_i3].e.style.height=board.clientHeight/10+'px';}}// we will have to recalculate the exact
// pos of each field since their size changed
var i=fields.length;while(i--){fields[i].position();}// also the range of the towers have to be updated
var j=allTowers.length;while(j--){allTowers[j].update();}// and the pos of the projectiles
var k=allProjectiles.length;while(k--){allProjectiles[k].update();}}// Make board accessible via Keyboard
function useBoardWithKey(field,e){var cases={0:{// right
field:fields[field.pos+1],edge:rightFields.indexOf(field.pos)>-1?true:false},1:{// left
field:fields[field.pos-1],edge:leftFields.indexOf(field.pos)>-1?true:false},2:{// top
field:fields[field.pos-boardRowSize],edge:topFields.indexOf(field.pos)>-1?true:false},3:{// bottom
field:fields[field.pos+boardRowSize],edge:bottomFields.indexOf(field.pos)>-1?true:false}},key=e.keyCode||e.key;// basic movement
keyboardBasicMovement(key,cases);keyboardEscape(key);}function keyboardBasicMovement(key,cases){var num=[[39,'ArrowRight'],[37,'ArrowLeft'],[38,'ArrowUp'],[40,'ArrowDown']];var i=num.length;while(i--){if((key===num[i][0]||key===num[i][1])&&!cases[i].edge){cases[i].field.e.focus();}}}function keyboardEscape(k){var bu=builders,sb=scoreboard;if(k===27||k==='Escape'){for(var key in bu){if(bu.hasOwnProperty(key)){bu[key].hide();}}sb.play.focus();}}/* Builder */var Builder=function(){function Builder(options){var _this2=this;_classCallCheck(this,Builder);this.selectedField=false;this.e=createElement('div','selector');this.e.addEventListener('click',function(e){e.stopPropagation();_this2.hide();});// add tower options
this.towerContainerE=[];this.towerOptionE=[];this.towerPriceE=[];this.towerInfoE=[];var _loop=function _loop(i,il){var option=options[i];var towerContainer=createElement('div','selector__container '+option.name);_this2.towerContainerE.push(towerContainer);var towerOption=createElement('button','selector__element '+option.name+'-name',option.nameOg);_this2.towerOptionE.push(towerOption);var towerPrice=createElement('span','selector__info '+option.name+'-price',option.cost+'$');_this2.towerPriceE.push(towerPrice);var towerInfo=createElement('button','selector__info '+option.name+'-showinfo','?');_this2.towerInfoE.push(towerPrice);towerInfo.addEventListener('click',function(e){e.stopPropagation();if(option.name==='sell'){extraInfo.upgrade(option);}else{extraInfo.tower(option);}});towerOption.addEventListener('click',function(e){e.stopPropagation();_this2.build(option,_this2.selectedField);});towerOption.appendChild(towerPrice);appendChilds(towerContainer,[towerOption,towerInfo]);_this2.e.appendChild(towerContainer);};for(var i=0,il=options.length;i<il;i++){_loop(i,il);}board.appendChild(this.e);// tower range
this.range=createElement('div','tower__range');this.range.addEventListener('click',function(e){e.stopPropagation();_this2.hide();});board.appendChild(this.range);// record keyboard input
this.e.addEventListener('keyup',function(e){userBuilderWithKey(_this2,e);});}_createClass(Builder,[{key:'draw',value:function draw(field,upgrade){this.selectedField=field;this.selectedField.builder=this;field.builder=this;if(!upgrade){this.upgrading=false;field.lock('tower');// pause
if(!generalPause&&isStarted){scoreboard.togglePlay();}}else{this.upgrading=true;// tower range
var size=field.tower.rng*2-10;this.range.style.width=size+'px';this.range.style.height=size+'px';this.range.style.left=field.x+field.w/2+'px';this.range.style.top=field.y+field.w/2+'px';this.range.className='tower__range tower__range--show';}// check if it would block the field
if(!gretel()){if(!this.upgrading){field.unlock();}audio.play('do_not_block');this.hide();}else{if(!this.upgrading){field.unlock();}this.w=field.w*2+'px';this.h=field.w*2+'px';this.e.className='selector selector--show';this.e.style.width=this.w;this.e.style.height=this.h;// check if size would be below minimum (90)
var pos=[field.x-field.w/2,field.y-field.w/2];if(parseInt(this.w)<=90){pos=[field.x-35,field.y-35];}this.e.style.left=pos[0]+'px';this.e.style.top=pos[1]+'px';}}},{key:'hide',value:function hide(){var general=arguments.length<=0||arguments[0]===undefined?false:arguments[0];if(this.selectedField){this.selectedField.builder=false;this.selectedField=false;}// unpause & remove the show classes from builders
this.e.className='selector';this.range.className='tower__range';builderOpen=false;gretel();}},{key:'build',value:function build(option,field){this.hide();if(!this.upgrading){// unpause
if(!generalPause&&isStarted){scoreboard.togglePlay();}}// is it a sell request
if(option.name==='tower__sell'){// give some money back
p1.updateMoney(field.tower.cost/2,field);field.destroyTower();field.e.focus();// check is player can afford it  
}else if(p1.money<option.cost){audio.play('need_more_money');}else if(field.locked){audio.play('cannot_build_here');// if he is allowed to buy, proceed
}else{// substract the costs
p1.updateMoney(option.cost*-1,field);// build on the field
field.buildTower(option);field.e.focus();}}}]);return Builder;}();function userBuilderWithKey(builder,e){var key=e.keyCode||e.key;// advanced
// close builder with escape
if(key===27||key==='Escape'){builder.selectedField.e.focus();builder.hide();}}// Creeps
var allCreeps=[];/* Creeps */var Creeps=function(){function Creeps(_ref2){var ms=_ref2.ms;var hp=_ref2.hp;var lvl=_ref2.lvl;var bounty=_ref2.bounty;_classCallCheck(this,Creeps);this.e=createElement('div','c c__l'+lvl);// since updating the DOM is expensive
// we already create all the visual bounty elements
// and append them to their respective position
var bnty=Math.round(bounty);this.bounty={value:bnty,creep:createElement('span','animation__gainmoney','+'+bnty),money:createElement('span','animation__gainmoney animation__gainmoney--scoreboard','+'+bnty),score:createElement('span','animation__gainscore animation__gainscore--scoreboard','+'+bnty)};bountyContainer.appendChild(this.bounty.creep);scoreboard.money.holder.appendChild(this.bounty.money);scoreboard.score.holder.appendChild(this.bounty.score);this.ms=ms;this.hp=hp;this.fullHp=hp;this.lasts=[];this.tolerance=5;this.i=0;creepContainer.appendChild(this.e);// set current position
this.e.style.left=startField.x+'px';this.e.style.top=startField.y+'px';this.e.style.opacity=0;this.x=parseInt(this.e.style.left);this.y=parseInt(this.e.style.top);this.visual={x:0,y:0};this.invulnerable=true;// visually represent hitpoints
// this.hp / this.fullHp = 0.5 at 50% hp
// * 10 to get a full number value so that .ceil rounds to a full number properly
// this.e.setAttribute('data-hp', Math.ceil(this.hp / this.fullHp * 10));
}_createClass(Creeps,[{key:'setup',value:function setup(){this.e.style.opacity=1;this.invulnerable=false;}},{key:'damage',value:function damage(dmg){this.hp-=dmg;this.e.style.opacity=this.hp/this.fullHp;if(this.hp<=0){this.remove(true,p1);}}},{key:'remove',value:function remove(killed,player){if(!this.dead){// dead
this.dead=true;if(killed){player.unitKill(this);}// hide creep
this.e.style.opacity=0;// from allCreeps array
kills++;if(kills>=levels.creeps.amount){kills=0;p1.levelUp();}}}// the variable gretelFields contains all fields set by gretels path coordinates
},{key:'nextLocation',value:function nextLocation(dt){if(!this.dead){var gf=gretelFields;if(this.i<gf.length){this.dt=dt;// move to next position
if(moveObj(this,gf[this.i])){this.i++;}}else{p1.updateLives(-1);this.remove();}}}}]);return Creeps;}();// see https://github.com/edenspiekermann/a11y-dialog/ for more information
var extraInfo=void 0;var ExtraInfo=function(){function ExtraInfo(){_classCallCheck(this,ExtraInfo);// wrapper: <div id="my-accessible-dialog" aria-hidden="true">
this.wrapper=createElement('div','dialog');this.wrapper.setAttribute('aria-hidden','true');// backdrop: <div tabindex="-1" data-a11y-dialog-hide></div>
this.backdrop=createElement('div','dialog-overlay');this.backdrop.setAttribute('tabindex','-1');this.backdrop.setAttribute('data-a11y-dialog-hide','true');// container: <div role="dialog">
this.container=d.createElement('div');this.container.setAttribute('role','dialog');// e = the visible content container
this.e=createElement('div','dialog-content');this.e.setAttribute('role','document');// cont = will hold the content
this.cont={};// close = <button type="button" data-a11y-dialog-hide aria-label="Close this dialog window">&times;</button>
this.close=createElement('button','dialog-close','&times;');this.close.setAttribute('type','button');this.close.setAttribute('data-a11y-dialog-hide','true');this.close.setAttribute('aria-label','Close this dialog window');appendChilds(this.container,[this.e,this.close]);appendChilds(this.wrapper,[this.backdrop,this.container]);b.appendChild(this.wrapper);this.dialog=new A11yDialog(this.wrapper);}_createClass(ExtraInfo,[{key:'tower',value:function tower(_tower){// reset the modals content
this.e.innerHTML='';// create the new content
// cost, level, damage, cooldown (because reversed)
var els=['cost'];if(_tower.level!==0){els.push('level');}if(_tower.dmg!==0){els.push('dmg');}if(_tower.cd!==0){els.push('cd');}this.cont.floatsContainer=d.createElement('div');for(var i=0,il=els.length;i<il;i++){var info=els[i],val=_tower[els[i]],extra='';if(els[i]==='cost'){extra=' $';}else if(els[i]==='dmg'){info='damage';}else if(els[i]==='cd'){info='cooldown';extra=' sec';val=_tower[els[i]]/1000;}this.cont[els[i]]=createElement('div','extra-info__'+els[i]);this.cont[els[i]].text=createElement('div','extra-info__'+els[i]+'-text',info+':');this.cont[els[i]].val=createElement('div','extra-info__'+els[i]+'-value',''+val+extra);appendChilds(this.cont[els[i]],[this.cont[els[i]].text,this.cont[els[i]].val]);this.cont.floatsContainer.appendChild(this.cont[els[i]]);}// inner-container
this.cont.container=createElement('div','extra-info__container');this.cont.container.style.maxHeight=wY*0.8+'px';// img
this.cont.imgContainer=createElement('div','extra-info__img-container');this.cont.img=createElement('img','extra-info__img');this.cont.img.setAttribute('src','assets/img/'+_tower.nameOg+'.gif');this.cont.img.setAttribute('aria-hidden','true');this.cont.imgContainer.appendChild(this.cont.img);// title
this.cont.title=createElement('h1','extra-info__title',capitalizeFirstLetter(_tower.nameOg));// desc
this.cont.description=createElement('p','extra-info__description',_tower.description);appendChilds(this.cont.container,[this.cont.imgContainer,this.cont.title,this.cont.description]);appendChilds(this.e,[this.cont.floatsContainer,this.cont.container]);// show the modal
this.dialog.show();}}]);return ExtraInfo;}();function setupExtraInfo(){extraInfo=new ExtraInfo();}function animateScore(els){var i=els.length;while(i--){var el=els[i][0]?els[i][0]:els[i];var pos=els[i][1]?els[i][1]:0;el.style.visibility='visible';if(pos.x){el.style.left=pos.x+'px';el.style.top=pos.y+'px';}setVendor(el,'Transform','translate3d(0, -300%, 1px)');// el.style.transform = 'translate3d(0, -300%, 1px)';
el.style.opacity=0;}}function recycleAnimation(els){var i=els.length;while(i--){var el=els[i];el.style.visibility='hidden';setVendor(el,'Transform','translate3d(0, 0, 1px)');// el.style.transform = 'translate3d(0, 0, 1px)';
el.style.opacity=1;}}// move Obj
function moveObj(el,target){var increment=void 0;if(!isPaused){// calculate the distance
// (x:10,y:20)[cur] -dist-> [target](x:20,y:20)
// target.x(20) - cur.x(10) = +10 dist
// target.y(20) - cur.y(20) = 0 dist
el.dist={x:target.x-el.x,y:target.y-el.y};increment=calculateIncrement(el,target);el.x+=increment.x;el.y+=increment.y;// update creep
el.visual.x+=increment.x;el.visual.y+=increment.y;// according to chromes performance timeline, it is way more performant inline the drawings here
setVendor(el.e,'Transform','translate3d('+el.visual.x+'px,'+el.visual.y+'px, 1px)');// el.e.style.transform = `translate3d(${el.visual.x}px,${el.visual.y}px, 1px)`;
}if(Math.abs(el.dist.x)<10&&Math.abs(el.dist.y)<10){return true;}return false;}// this function calculates the x and y increments
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
function calculateIncrement(el,target){var increment={};if(el.follow){el.dist={// 1
x:target.x-el.x,y:target.y-el.y};}var x=Math.abs(el.dist.x);var y=Math.abs(el.dist.y);var tX=x/el.ms;// 2
var tY=y/el.ms;// 2
increment.x=tX!==0?x/tX*el.dt:0;// 3
increment.y=tY!==0?y/tY*el.dt:0;// 3
if(el.dist.x<0){increment.x*=-1;}// 4
if(el.dist.y<0){increment.y*=-1;}// 4
return increment;}/******************************//* Functions for an easy life *//******************************/// vendor prefixes
function setVendor(element,property,value){element.style['Webkit'+property]=value;element.style['Moz'+property]=value;element.style['MS'+property]=value;element.style['O'+property]=value;}// capitalize first letter
function capitalizeFirstLetter(string){return string.charAt(0).toUpperCase()+string.slice(1);}// create elements function
function createElement(tag,classlist){var value=arguments.length<=2||arguments[2]===undefined?'':arguments[2];var el=d.createElement(tag);el.className=classlist;el.innerHTML=value;return el;}// append childs function
function appendChilds(to,els){for(var i=0,il=els.length;i<il;i++){to.appendChild(els[i]);}}// myLoop
// pass number of iterations and dur in ms and counter
function myLoop(_ref3){var cd=_ref3.cd;var dur=_ref3.dur;var _ref3$cu=_ref3.cu;var cu=_ref3$cu===undefined?0:_ref3$cu;var cb=_ref3.cb;// passes usefull stuff to callback and augmet the count up by 1
cb({cd:cd,dur:dur,cu:cu});cu++;// decrement cd and call myLoop again if cd >= 0
if(--cd>=0){setTimeout(function(){myLoop({cd:cd,dur:dur,cu:cu,cb:cb});},dur);}}//myInterval
function myInterval(_ref4){var cd=_ref4.cd;var dur=_ref4.dur;var cb=_ref4.cb;var countdown=cd;var loop=setInterval(interval,dur);function interval(){if(!isPaused){if(--countdown>=0){cb({countdown:countdown,dur:dur});}else{clearInterval(loop);}}}}// euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance 
function euclidDistance(x1,x2,y1,y2){return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));}// sadly old phones do not support the quite new .classlist
// so we have to use this workaround to add/remove classes
// all credits to http://clubmate.fi/javascript-adding-and-removing-class-names-from-elements/
function addClass(element,classname){var cn=element.className;//test for existance
if(cn.indexOf(classname)!==-1){return;}//add a space if the element already has class
if(cn!==''){classname=' '+classname;}element.className=cn+classname;}function removeClass(element,classname){var cn=element.className;var rxp=new RegExp(classname+'\\b','g');cn=cn.replace(classname,'');element.className=cn;}// tried to write that AI pathfinding myself
// figured out that it might take ages
// end up using https://github.com/qiao/PathFinding.js
// gretel is my pathfinder visualizer
var gretelFields=[],grid=void 0,finder=void 0,path=void 0;/* Gretel */function gretel(){// Setup the board for the pathfinder
// see https://github.com/qiao/PathFinding.js for more info
grid=new PF.Grid(boardSize/10,boardSize/10);// clear leftover css classes on fields &
// mark locked fields as unwalkable
clearOlds();// setup a new finder
finder=new PF.BestFirstFinder({heuristic:PF.Heuristic.euclidean});// draw a new path
path=finder.findPath(startField.fX,startField.fY,endField.fX,endField.fY,grid);if(path.length>0){handlePath(path);return true;}else{return false;}}function clearOlds(){gretelFields=[];var _fields=fields,clearClasses=[// clear any old path
'gretel__breadcrumb','gretel__breadcrumb--top-left','gretel__breadcrumb--top-right','gretel__breadcrumb--bottom-left','gretel__breadcrumb--bottom-right','gretel__breadcrumb--bottom-right','gretel__breadcrumb--horizontal-last-left','gretel__breadcrumb--horizontal-last-right','gretel__breadcrumb--horizontal-last-top','gretel__breadcrumb--horizontal-next-bottom','gretel__breadcrumb--horizontal-next-left','gretel__breadcrumb--horizontal-next-right','gretel__breadcrumb--horizontal-next-top','gretel__breadcrumb--horizontal-next-bottom','gretel__breadcrumb--vertical-last-left','gretel__breadcrumb--vertical-last-right','gretel__breadcrumb--vertical-last-top','gretel__breadcrumb--vertical-last-bottom','gretel__breadcrumb--vertical-next-left','gretel__breadcrumb--vertical-next-right','gretel__breadcrumb--vertical-next-top','gretel__breadcrumb--vertical-next-bottom'];for(var i=0,il=_fields.length;i<il;i++){for(var j=0,jl=clearClasses.length;j<jl;j++){if(_fields[i].e.className.indexOf(clearClasses[j])>-1){removeClass(_fields[i].e,clearClasses[j]);}}// re-lock all towers to be sure
if(_fields[i].e.className.indexOf('tower')>-1){_fields[i].lock('tower');}// get blocked _fields
if(_fields[i].locked&&_fields[i].pos!==startField.pos&&_fields[i].pos!==endField.pos&&_fields[i].locked==='tower'){grid.setWalkableAt(_fields[i].fX,_fields[i].fY,false);}}}// this fill draw smooth corners to the path
function handlePath(path){var corner=void 0,globFields=fields;for(var i=0,il=path.length;i<il;i++){// path[i][0] // fX coordinate
// path[i][1] // fY coordinate
// check if it is a corner field
var _fields=getFields(i,path);var checks=checkFields(_fields);corner='';for(var j=0,jl=checks.length;j<jl;j++){if(checks[j][0]){corner=checks[j][1];break;}}for(var k=0,kl=globFields.length;k<kl;k++){// get the field with the corresponding coordinates
if(globFields[k].fX===path[i][0]&&globFields[k].fY===path[i][1]){// add the breadcrumbs class
globFields[k].e.className+=' gretel__breadcrumb '+corner;gretelFields.push(globFields[k]);}}}gretelFields.push({x:endField.x+endField.w/3,y:endField.y});}// grabs the current, the next and previous field on the path for further calculations
function getFields(i,path){return{x:{current:path[i][0],last:path[i-1]?path[i-1][0]:null,next:path[i+1]?path[i+1][0]:null},y:{current:path[i][1],last:path[i-1]?path[i-1][1]:null,next:path[i+1]?path[i+1][1]:null}};}// saves an array with all possibilities with corresponding outcome
function checkFields(field){return[[field.y.current>field.y.next&&field.y.current===field.y.last&&field.x.current>field.x.last&&field.x.current===field.x.next||field.y.current===field.y.next&&field.y.current>field.y.last&&field.x.current===field.x.last&&field.x.current>field.x.next,'gretel__breadcrumb--bottom-right'],[field.y.current===field.y.next&&field.y.current<field.y.last&&field.x.current===field.x.last&&field.x.current<field.x.next||field.y.current<field.y.next&&field.y.current===field.y.last&&field.x.current<field.x.last&&field.x.current===field.x.next,'gretel__breadcrumb--top-left'],[field.y.current<field.y.next&&field.y.current===field.y.last&&field.x.current>field.x.last&&field.x.current===field.x.next||field.y.current===field.y.next&&field.y.current<field.y.last&&field.x.current===field.x.last&&field.x.current>field.x.next||field.y.current<field.y.next&&field.y.current===field.y.last&&field.x.current<field.x.last&&field.x.current===field.x.next,'gretel__breadcrumb--top-right'],[field.y.current===field.y.next&&field.y.current>field.y.last&&field.x.current===field.x.last&&field.x.current<field.x.next||field.y.current>field.y.next&&field.y.current===field.y.last&&field.x.current<field.x.last&&field.x.current===field.x.next,'gretel__breadcrumb--bottom-left'],[field.x.current<field.x.next&&field.y.current===field.y.next,'gretel__breadcrumb--horizontal-next-right'],[field.x.current<field.x.last&&field.y.current===field.y.last,'gretel__breadcrumb--horizontal-last-right'],[field.x.current>field.x.next&&field.y.current===field.y.next,'gretel__breadcrumb--horizontal-next-left'],[field.x.current>field.x.last&&field.y.current===field.y.last,'gretel__breadcrumb--horizontal-last-left'],[field.x.current===field.x.next&&field.y.current<field.y.next,'gretel__breadcrumb--vertical-next-top'],[field.x.current===field.x.last&&field.y.current>field.y.last,'gretel__breadcrumb--vertical-last-top'],[field.x.current===field.x.next&&field.y.current>field.y.next,'gretel__breadcrumb--vertical-next-bottom'],[field.x.current===field.x.last&&field.y.current<field.y.last,'gretel__breadcrumb--vertical-last-bottom']];}function setupGretel(){// Setup Gretel
gretel();}// gui
var scoreboard=void 0,sounds={'resources':[['assets/sounds/sprite.ogg','audio/mp3'],['assets/sounds/sprite.mp3','audio/ogg']],'spritemap':{'cannot_build_here':{'start':0,'end':1.3,'loop':false},'do_not_block':{'start':3,'end':4,'loop':false},'finish_building_process_first':{'start':5,'end':7.1,'loop':false},'need_more_money':{'start':9,'end':10.2,'loop':false},'winner_winner_chicken_dinner':{'start':12,'end':13.5,'loop':false},'you_lost_try_again':{'start':15,'end':17.3,'loop':false}}},audio=void 0,soundOff=false,holders=[],recyclings=[];/* Scoreboard */var Scoreboard=function(){function Scoreboard(){var _this3=this;_classCallCheck(this,Scoreboard);// scoreboard element
this.e=createElement('div','scoreboard');// player icon + Inputfield
this.player=createSVG({svgName:'player',extraElement:'input',svg:SVGplayer});this.player.input.setAttribute('aria-label','Player name: ');// money icon + holder for money gain and lose
this.money=createSVG({svgName:'money',extraElement:'p',svg:SVGmoney});this.money.holder=d.createElement('div');holders.push(this.money.holder);this.money.generalHolder=d.createElement('div');appendChilds(this.money.container,[this.money.holder,this.money.generalHolder]);// level icon + holder for level +1
this.level=createSVG({svgName:'level',extraElement:'p',svg:SVGlevel});this.level.holder=d.createElement('div');this.level.up=createElement('span','animation__levelup animation__levelup--scoreboard','+1');this.level.holder.appendChild(this.level.up);this.level.container.appendChild(this.level.holder);recyclings.push(this.level.up);// score icon + holder for gain
this.score=createSVG({svgName:'score',extraElement:'p',svg:SVGscore});this.score.holder=d.createElement('div');this.score.container.appendChild(this.score.holder);holders.push(this.score.holder);// lives icon + holder for gain/lose + gain/lose element
this.lives=createSVG({svgName:'lives',extraElement:'p',svg:SVGlives});this.lives.holder=d.createElement('div');this.lives.container.appendChild(this.lives.holder);this.controls=createElement('div','scoreboard__el-controls');this.play=createElement('button','scoreboard__el scoreboard__el-pause','play');this.audioOff=createSVG({container:'button',svgName:'audio',svg:SVGaudio.off});this.audioOn=createSVG({container:'button',svgName:'audio',svg:SVGaudio.on});this.audioOn.container.style.display='none';appendChilds(this.controls,[this.play,this.audioOff.container,this.audioOn.container]);this.m=createElement('p','scoreboard__el scoreboard__el-message','.');// Global Play & Pause
this.play.addEventListener('click',function(e){e.stopPropagation();// closebuilders
// and pause/unpause the game
if(isStarted){if(isPaused===true){generalPause=true;}generalPause=!generalPause;}else{// first time click on Play
setSizes();generalPause=false;}// close all builders
for(var key in builders){if(builders.hasOwnProperty(key)){builders[key].hide(true);}}// toggle the button
_this3.togglePlay();// reset to true if not otherwise
if(generalPause){isPaused=true;}});// Audio
this.audioOn.container.addEventListener('click',function(e){e.stopPropagation();_this3.toggleAudio();});this.audioOff.container.addEventListener('click',function(e){e.stopPropagation();_this3.toggleAudio();});// Player Name
this.player.input.addEventListener('keyup',function(e){var key=e.keyCode||e.key;e.stopPropagation();if(key===13||key==='Enter'){g.focus();}else{_this3.playerName(p1);}});this.player.input.addEventListener('focus',function(){addClass(_this3.player.container,'scoreboard__hint');_this3.player.input.select();});this.player.input.addEventListener('blur',function(){removeClass(_this3.player.container,'scoreboard__hint');});// Append all
this.elements=[this.player.container,this.money.container,this.score.container,this.lives.container,this.level.container,this.controls,this.m];appendChilds(this.e,this.elements);g.appendChild(this.e);setTimeout(function(){_this3.player.input.select();},100);}_createClass(Scoreboard,[{key:'update',value:function update(player){this.player.input.value=player.name;this.money.p.innerHTML=Math.floor(player.money);this.level.p.innerHTML=Math.floor(player.level);this.score.p.innerHTML=Math.floor(player.score);this.lives.p.innerHTML=Math.floor(player.lives);}},{key:'message',value:function message(_message,duration){var _this4=this;this.m.style.display='block';this.m.innerHTML=_message;this.m.className+=' scoreboard__el--flash';setTimeout(function(){removeClass(_this4.m,'scoreboard__el--flash');setTimeout(function(){_this4.m.style.display='none';},1000);},Math.floor(duration)*1000+500);}},{key:'togglePlay',value:function togglePlay(){// if the game is not lost
if(!lostGame){// if the game has not started yet
if(!isStarted){isStarted=true;p1.levelUp();}this.play.innerHTML=isPaused?'pause':'play';isPaused=!isPaused;}}},{key:'toggleAudio',value:function toggleAudio(){soundOff=!soundOff;if(soundOff){this.audioOff.container.style.display='none';this.audioOn.container.style.display='inline-block';}else{this.audioOff.container.style.display='inline-block';this.audioOn.container.style.display='none';}}},{key:'playerName',value:function playerName(player){player.name=this.player.input.value;this.update(player);}}]);return Scoreboard;}();function setupScoreboard(){scoreboard=new Scoreboard();}/* Audio */var Audio=function(){function Audio(){var _this5=this;_classCallCheck(this,Audio);this.e=createElement('audio','audio__player');this.e.setAttribute('preload','true');this.src=[];var i=sounds.resources.length;while(i--){this.src[i]=d.createElement('source');this.src[i].setAttribute('src',sounds.resources[i][0]);this.src[i].setAttribute('type',sounds.resources[i][1]);this.e.appendChild(this.src[i]);}g.appendChild(this.e);// If the time of the file playing is updated, compare it
// to the current end time and stop playing when this one
// is reached
this.e.addEventListener('timeupdate',function(){if(_this5.e.currentTime>_this5.end){_this5.e.pause();}},false);}// Play the current audio sprite by setting the currentTime
_createClass(Audio,[{key:'play',value:function play(sound){if(sounds.spritemap[sound]&&!soundOff){this.e.currentTime=sounds.spritemap[sound].start;this.end=sounds.spritemap[sound].end;scoreboard.message(''+sound.replace(/_/g,' '),this.end-this.e.currentTime);this.e.play();}else{scoreboard.message(''+sound.replace(/_/g,' '),2);}}}]);return Audio;}();function setupAudio(){audio=new Audio();}/*
 * Unfortunately the SVG use method does not work with Chrome when used locally
 * (for security reasons) So I have to hardcode each SVG individually
 * they are stored in variables used in the createSVG function
 * For reasons of ease of use (copy&paste) I still kept them in the /svg/ folder
 * and the svg Sprite. Which however is useless
 */// Create Svg
function createSVG(_ref5){var _ref5$containerClass=_ref5.containerClass;var containerClass=_ref5$containerClass===undefined?'scoreboard__el':_ref5$containerClass;var _ref5$container=_ref5.container;var container=_ref5$container===undefined?'div':_ref5$container;var svg=_ref5.svg;var svgName=_ref5.svgName;var _ref5$extraElement=_ref5.extraElement;var extraElement=_ref5$extraElement===undefined?false:_ref5$extraElement;var el={};el.container=createElement(container,containerClass+' '+containerClass+'-'+svgName,svg);if(extraElement){el[extraElement]=createElement(extraElement,containerClass+'-'+extraElement);el.container.appendChild(el[extraElement]);}return el;}// SVGs
var SVGlevel='<svg viewBox="0 0 8.1 15.9" id="level" class="scoreboard__icon scoreboard__icon--level" role="img">\n    <title>Level: </title>\n    <path role="presentation" d="M7.5 0h-6C.9 0 0 .3 0 .9v14.4s.2.4.4.5c.2.1.8-.1.8-.1l3.2-2.5 3.2 2.5s.1.2.4 0c.2-.1 0-.5 0-.5V.9C8 .3 8 0 7.5 0zM1 8.9l3-2 3 2v2l-3-2-3 2v-2zM4 12l-3 2.3v-2.4l3-2 3 2v2.4L4 12zm3-4.1l-3-2-3 2V1h6v6.9z"/>\n  </svg>';var SVGlives='<svg viewBox="0 0 16 15" id="lives" class="scoreboard__icon scoreboard__icon--lives" role="img">\n    <title>Lives: </title>\n    <path role="presentation" d="M14.6 1.4C12.8-.5 9.8-.5 8 1.4 6.2-.5 3.2-.5 1.4 1.4c-1.8 1.9-1.8 4.9 0 6.8L8 15l6.6-6.8c1.9-1.9 1.9-4.9 0-6.8zm-.8 5.9l-2.2 2.2L8 13.3 4.4 9.6 2.2 7.3C.9 5.9.8 3.6 2.2 2.2c1.4-1.4 3.6-1.4 5 0L8 3l.8-.8c1.4-1.4 3.6-1.4 5 0 1.4 1.5 1.4 3.7 0 5.1z"/><path d="M11 3c-.4 0-.8.1-1.1.3l.6.8c.1 0 .3-.1.5-.1.6 0 1 .4 1 1 0 .2 0 .3-.1.4l.9.4c.1-.2.2-.5.2-.8 0-1.1-.9-2-2-2z"/>\n  </svg>';var SVGmoney='<svg viewBox="0 0 16 16" id="money" class="scoreboard__icon scoreboard__icon--money" role="img">\n    <title>Money: </title>\n    <path role="presentation" d="M7.8 6.7c-.6-.3-.6-1 .4-1.1.8 0 1.6.2 2.1.4 0 0 .3-1.4.4-1.7-.8-.1-1.4-.2-2-.3v-.9H7.3v1c-1.6.3-2.2 1.5-2.2 2.3 0 2 2.4 2.4 3.1 2.7.8.4.7 1-.1 1.1-.8.2-1.9-.2-2.6-.5L5 11.4c.7.4 1.6.6 2.2.7v.9h1.5v-1c1.3-.2 2.3-1 2.3-2.4 0-1.8-1.9-2.3-3.2-2.9zM8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 15c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/>\n  </svg>';var SVGplayer='<svg viewBox="-404.9 509.1 15.9 15.9" id="player" class="scoreboard__icon scoreboard__icon--player" role="img">\n    <title>Player: </title>\n    <path role="presentation" d="M-394.6 518.4c1.6-.8 2.6-2.5 2.6-4.4 0-2.8-2.2-5-5-5s-5 2.2-5 5c0 1.9 1.1 3.5 2.6 4.3-2.9.9-5.2 3.6-5.5 6.6h15.8c-.3-2.9-2.5-5.6-5.5-6.5zm-6.4-4.3c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm-2.6 9.9c.9-3 3.5-5 6.7-5s5.8 2 6.7 5h-13.4z"/>\n  </svg>';var SVGscore='<svg viewBox="0 0 16 16" id="score" class="scoreboard__icon scoreboard__icon--score" role="img">\n    <title>Score: </title>\n    <path role="presentation" d="M16 6.1l-5.6-.7L8 0 5.6 5.4 0 6.1l4.1 4-1 5.9 5-2.9 5 2.9-1.1-5.8 4-4.1zm-8 5.5l-3.2 1.9.7-3.8L2.8 7l3.7-.5L8 3l1.6 3.5 3.6.5-2.7 2.6.7 3.8L8 11.6z"/>\n  </svg>';var SVGaudio={off:'<svg viewBox="0 0 612 792" id="audio-false" class="scoreboard__icon scoreboard__icon--audio" role="img">\n          <title>Disable Audio: </title>\n          <path role="presentation" d="M153 281.2H38.2c-23 0-38.2 15.3-38.2 38.2v153c0 23 15.3 38.2 38.2 38.2H153l153 153h38.2V128.2H306l-153 153zm153 325.2L172.1 472.5H38.2v-153h133.9L306 185.6v420.8zM604.4 430.4l-53.5-53.6 53.5-53.6c7.6-7.6 7.6-19.1 0-26.8l-7.7-7.6c-7.6-7.6-19.1-7.6-26.8 0l-53.5 53.5-53.6-53.5c-7.6-7.6-19.1-7.6-26.8 0l-7.6 7.6c-7.6 7.6-7.6 19.1 0 26.8l53.5 53.6-53.5 53.6c-7.6 7.6-7.6 19.1 0 26.8l7.6 7.6c7.6 7.6 19.1 7.6 26.8 0l53.6-53.5 53.5 53.5c7.6 7.6 19.1 7.6 26.8 0l7.7-7.6c7.6-7.7 7.6-19.1 0-26.8z"/>\n        </svg>',on:'<svg viewBox="0 0 612 792" id="audio-true" class="scoreboard__icon scoreboard__icon--audio" role="img">\n          <title>Disable Audio: </title>\n          <path role="presentation" d="M474.5 542.6c30.6-39.3 48.1-91.8 48.1-148.6s-17.5-109.3-48.1-153c-4.4-4.4-21.9-30.6-39.3-13.1-13.1 13.1 0 35 0 35 26.2 35 43.7 83.1 43.7 131.1 0 48.1-17.5 91.8-43.7 131.1 0 0-8.7 21.9 0 35 13.1 8.8 34.9-8.7 39.3-17.5z"/><path d="M610 394c0-96.2-39.3-183.6-104.9-249.2-8.7-8.7-26.2-26.2-39.3-4.4-8.7 21.9 13.1 39.3 13.1 39.3 52.5 56.8 87.4 131.1 87.4 214.2s-35 157.4-87.4 214.2c0 0-26.2 21.9-8.7 39.3 13.1 13.1 30.6 0 39.3-13.1C570.7 573.2 610 490.2 610 394zM153 281.2H38.2c-23 0-38.2 15.3-38.2 38.2v153c0 23 15.3 38.2 38.2 38.2H153l153 153h38.2V128.2H306l-153 153zm153 325.2L172.1 472.5H38.2v-153h133.9L306 185.6v420.8z"/>\n        </svg>'};// levels
var levels={creeps:{hp:10,ms:0.05,bounty:5,amount:1,spawn:500}},kills=0;/**************//* next level *//**************/function nextLevel(){// remove leftovers
var i=holders.length;while(i--){holders[i].innerHTML='';}creepContainer.innerHTML='';allCreeps=[];// next level
setTimeout(function(){levels.creeps.hp+=5;levels.creeps.ms+=0.001;levels.creeps.bounty+=0.05;levels.creeps.amount+=0.5;levels.creeps.spawn-=0.5;// recycling
recycleAnimation(recyclings);var tempCreeps=[];for(var _i4=0,il=levels.creeps.amount;_i4<il;_i4++){var creep=new Creeps({ms:levels.creeps.ms,hp:levels.creeps.hp,lvl:p1.level,bounty:levels.creeps.bounty});tempCreeps.push(creep);}myInterval({cd:tempCreeps.length,dur:levels.creeps.spawn,cb:function cb(_ref6){var countdown=_ref6.countdown;tempCreeps[countdown].setup();allCreeps.push(tempCreeps[countdown]);}});},1000);}// users
var p1=void 0;/* Player */var Player=function(){function Player(_ref7){var name=_ref7.name;var money=_ref7.money;var level=_ref7.level;var score=_ref7.score;var lives=_ref7.lives;_classCallCheck(this,Player);this.name=name;this.money=money;this.level=level;this.score=score;this.lives=lives;this.livesAnimationCounter=0;this.moneyAnimationCounter=0;}_createClass(Player,[{key:'unitKill',value:function unitKill(unit){this.money+=unit.bounty.value;this.score+=unit.bounty.value;scoreboard.update(this);animateScore([[unit.bounty.creep,unit],[unit.bounty.money],[unit.bounty.score]]);}},{key:'levelUp',value:function levelUp(){var _this6=this;if(!lostGame){this.level+=1;animateScore([scoreboard.level.up]);scoreboard.update(this);// if (!levels[this.level]) {
//   audio.play('winner_winner_chicken_dinner');
// } else {
nextLevel();// }
setTimeout(function(){if(!lostGame){if(_this6.level%2===0){_this6.updateLives(1);}}},1000);}}},{key:'updateLives',value:function updateLives(amount){// update lives
this.lives+=amount;var n=this.livesAnimationCounter;if(amount>=0){scoreboard.lives.up[n].innerHTML='+'+amount;scoreboard.lives.up2[n].innerHTML='+'+amount;animateScore([scoreboard.lives.up[n]]);animateScore([[scoreboard.lives.up2[n],startField]]);setTimeout(recycleAnimation.bind(null,[scoreboard.lives.up[n]]),1000);setTimeout(recycleAnimation.bind(null,[scoreboard.lives.up2[n]]),1000);}else{scoreboard.lives.down[n].innerHTML=amount;scoreboard.lives.down2[n].innerHTML=amount;animateScore([scoreboard.lives.down[n]]);animateScore([[scoreboard.lives.down2[n],endField]]);setTimeout(recycleAnimation.bind(null,[scoreboard.lives.down[n]]),1000);setTimeout(recycleAnimation.bind(null,[scoreboard.lives.down2[n]]),1000);}this.livesAnimationCounter=n++>=19?0:this.livesAnimationCounter+1;scoreboard.update(this);// check if lost
if(this.lives<=0){lost();}}},{key:'updateMoney',value:function updateMoney(amount,place){// update wallet
this.money+=amount;var n=this.livesAnimationCounter;if(amount>=0){scoreboard.money.up[n].innerHTML='+'+amount;scoreboard.money.up2[n].innerHTML='+'+amount;animateScore([scoreboard.money.up[n],[scoreboard.money.up2[n],place]]);setTimeout(recycleAnimation.bind(null,[scoreboard.money.up[n]]),1000);setTimeout(recycleAnimation.bind(null,[scoreboard.money.up2[n]]),1000);}else{scoreboard.money.down[n].innerHTML=amount;scoreboard.money.down2[n].innerHTML=amount;animateScore([scoreboard.money.down[n],[scoreboard.money.down2[n],place]]);setTimeout(recycleAnimation.bind(null,[scoreboard.money.down[n]]),1000);setTimeout(recycleAnimation.bind(null,[scoreboard.money.down2[n]]),1000);}this.moneyAnimationCounter=n++>=19?0:this.moneyAnimationCounter+1;scoreboard.update(this);}}]);return Player;}();function setupPlayer(){p1=new Player({name:'Player 1',money:100,level:0,score:0,lives:10});scoreboard.update(p1);}function lost(){lostGame=true;isPaused=true;creepContainer.innerHTML='';allCreeps=[];var allTowers=board.querySelectorAll('.t');var j=allTowers.length;while(j--){allTowers[j].className='board__field';}audio.play('you_lost_try_again');}// @TODO: remove cheats
setInterval(function(){if(p1.name==='t'){p1.updateLives(9999);p1.updateMoney(9999);}},5000);// Towers
var tBasic=void 0,tSell=void 0,tRock=void 0,builders={},allTowers=[],allAttackTowers=[],catalogeTowers=[],allProjectiles=[],readyProjectiles=[];/* projectile */var Projectile=function(){function Projectile(field){_classCallCheck(this,Projectile);this.hp=1;this.fullHp=1;this.field=field;this.ms=field.tower.pms;this.dmg=field.tower.dmg;this.x=field.x+fields[0].w/2;this.y=field.y+fields[0].w/2;this.startpos={x:this.x,y:this.y};this.visual={x:0,y:0};this.creep=0;this.follow=field.tower.follow;this.e=createElement('div','projectile projectile__'+field.tower.name);this.e.style.left=this.x+'px';this.e.style.top=this.y+'px';this.e.style.opacity=0;allProjectiles.push(this);projectileContainer.appendChild(this.e);}_createClass(Projectile,[{key:'setup',value:function setup(creep){this.dead=false;this.creep=creep;this.e.style.opacity=1;readyProjectiles.push(this);}},{key:'update',value:function update(){this.x=this.field.x+fields[0].w/2;this.y=this.field.y+fields[0].w/2;this.startpos={x:this.x,y:this.y};this.e.style.left=this.x+'px';this.e.style.top=this.y+'px';}},{key:'remove',value:function remove(){// @TODO: add explosion
// dead
this.dead=true;// reset
this.e.style.opacity=0;this.x=this.startpos.x;this.y=this.startpos.y;this.visual={x:0,y:0};setVendor(this.e,'Transform','translate3d(0, 0, 1px)');// this.e.style.transform = 'translate3d(0, 0, 1px)';
}},{key:'attack',value:function attack(dt){if(!this.dead){this.dt=dt;if(moveObj(this,this.creep)){this.creep.damage(this.dmg);this.remove();}}}}]);return Projectile;}();/* Tower */var Tower=function(){function Tower(_ref8){var name=_ref8.name;var cost=_ref8.cost;var _ref8$dmg=_ref8.dmg;var dmg=_ref8$dmg===undefined?0:_ref8$dmg;var _ref8$cd=_ref8.cd;var cd=_ref8$cd===undefined?0:_ref8$cd;var rng=_ref8.rng;var pms=_ref8.pms;var _ref8$targets=_ref8.targets;var targets=_ref8$targets===undefined?0:_ref8$targets;var _ref8$follow=_ref8.follow;var follow=_ref8$follow===undefined?true:_ref8$follow;var _ref8$level=_ref8.level;var level=_ref8$level===undefined?1:_ref8$level;var description=_ref8.description;_classCallCheck(this,Tower);this.nameOg=name;this.name='tower__'+name;this.cost=cost;this.dmg=dmg;this.cd=cd;this.cdCount=0;this.rngVal=rng;this.rng=fields[0].w+rng*fields[0].w;this.pms=pms;this.targets=targets;this.follow=follow;this.level=level;this.description=description;this.projectileAnimationCounter=0;this.projectiles=[];allTowers.push(this);}_createClass(Tower,[{key:'shoot',value:function shoot(creep){var n=this.projectileAnimationCounter;this.projectiles[n].setup(creep);// count up
if(this.projectileAnimationCounter++>=19){this.projectileAnimationCounter=0;// reset all the deads except the last who should continue to attack
readyProjectiles=[this.projectiles[n]];}}},{key:'update',value:function update(){this.rng=fields[0].w+this.rngVal*fields[0].w;}},{key:'scan',value:function scan(dt){// scan if creeps are nearby
this.cdCount+=dt;if(this.cdCount>=this.cd){var attacked=0;// get all creeps
for(var i=0,il=allCreeps.length;i<il;i++){// check if the creeps distance is within tower range with
// euclidean distance: https://en.wikipedia.org/wiki/Euclidean_distance
if(!allCreeps[i].dead&&euclidDistance(allCreeps[i].x,this.field.x,allCreeps[i].y,this.field.y)<=this.rng){// then check how many targets the tower can focus
if(attacked<=this.targets){this.shoot(allCreeps[i]);attacked++;this.cdCount=0;}}}}}}]);return Tower;}();var BasicTower=function(_Tower){_inherits(BasicTower,_Tower);function BasicTower(superduper){_classCallCheck(this,BasicTower);var _this7=_possibleConstructorReturn(this,Object.getPrototypeOf(BasicTower).call(this,{name:'basic',cost:50,dmg:50,pms:0.5,cd:1000,rng:0.6,description:'This tower has a high attack speed with a basic damage and range. Upgrades drastically improve its range. Moreover, with special researches, this tower will be key to your success.'}));_this7.superduper=superduper;catalogeTowers.push(_this7);return _this7;}_createClass(BasicTower,[{key:'setup',value:function setup(field){this.field=field;var i=20;while(i--){this.projectiles[i]=new Projectile(this.field);}allAttackTowers.push(this);}}]);return BasicTower;}(Tower);var RockTower=function(_Tower2){_inherits(RockTower,_Tower2);function RockTower(){_classCallCheck(this,RockTower);var _this8=_possibleConstructorReturn(this,Object.getPrototypeOf(RockTower).call(this,{name:'rock',cost:6,level:0,description:'Simple & cheap rock. Usefull to block a path.'}));catalogeTowers.push(_this8);return _this8;}_createClass(RockTower,[{key:'setup',value:function setup(field){this.field=field;}}]);return RockTower;}(Tower);var SellTower=function(_Tower3){_inherits(SellTower,_Tower3);function SellTower(){_classCallCheck(this,SellTower);return _possibleConstructorReturn(this,Object.getPrototypeOf(SellTower).call(this,{name:'sell',cost:'+½',level:0,description:'You can sell any tower and get back the half of its cost.'}));}_createClass(SellTower,[{key:'setup',value:function setup(field){this.field=field;}}]);return SellTower;}(Tower);function setupTowers(){tBasic=new BasicTower();tRock=new RockTower();tSell=new SellTower();builders.towers=new Builder([tBasic,tRock]);builders.basic=new Builder([tSell]);builders.rock=new Builder([tSell]);}/**
 *    ____       _   _     _____ _           _ _                _         
 *   |  _ \ __ _| |_| |__ |  ___(_)_ __   __| (_)_ __   __ _   (_)___     
 *   | |_) / _` | __| '_ \| |_  | | '_ \ / _` | | '_ \ / _` |  | / __|    
 *   |  __/ (_| | |_| | | |  _| | | | | | (_| | | | | | (_| |_ | \__ \    
 *   |_|   \__,_|\__|_| |_|_|   |_|_| |_|\__,_|_|_| |_|\__, (_)/ |___/    
 *                                                     |___/ |__/         
 *   https://github.com/qiao/PathFinding.js
 */!function(e){if("object"==(typeof exports==='undefined'?'undefined':_typeof(exports)))module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.PF=e();}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'");}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e);},f,f.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;}({1:[function(_dereq_,module,exports){module.exports=_dereq_('./lib/heap');},{"./lib/heap":2}],2:[function(_dereq_,module,exports){// Generated by CoffeeScript 1.8.0
(function(){var Heap,defaultCmp,floor,heapify,heappop,heappush,heappushpop,heapreplace,insort,min,nlargest,nsmallest,updateItem,_siftdown,_siftup;floor=Math.floor,min=Math.min;/*
  Default comparison function to be used
   */defaultCmp=function defaultCmp(x,y){if(x<y){return-1;}if(x>y){return 1;}return 0;};/*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */insort=function insort(a,x,lo,hi,cmp){var mid;if(lo==null){lo=0;}if(cmp==null){cmp=defaultCmp;}if(lo<0){throw new Error('lo must be non-negative');}if(hi==null){hi=a.length;}while(lo<hi){mid=floor((lo+hi)/2);if(cmp(x,a[mid])<0){hi=mid;}else{lo=mid+1;}}return[].splice.apply(a,[lo,lo-lo].concat(x)),x;};/*
  Push item onto heap, maintaining the heap invariant.
   */heappush=function heappush(array,item,cmp){if(cmp==null){cmp=defaultCmp;}array.push(item);return _siftdown(array,0,array.length-1,cmp);};/*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */heappop=function heappop(array,cmp){var lastelt,returnitem;if(cmp==null){cmp=defaultCmp;}lastelt=array.pop();if(array.length){returnitem=array[0];array[0]=lastelt;_siftup(array,0,cmp);}else{returnitem=lastelt;}return returnitem;};/*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */heapreplace=function heapreplace(array,item,cmp){var returnitem;if(cmp==null){cmp=defaultCmp;}returnitem=array[0];array[0]=item;_siftup(array,0,cmp);return returnitem;};/*
  Fast version of a heappush followed by a heappop.
   */heappushpop=function heappushpop(array,item,cmp){var _ref;if(cmp==null){cmp=defaultCmp;}if(array.length&&cmp(array[0],item)<0){_ref=[array[0],item],item=_ref[0],array[0]=_ref[1];_siftup(array,0,cmp);}return item;};/*
  Transform list into a heap, in-place, in O(array.length) time.
   */heapify=function heapify(array,cmp){var i,_i,_j,_len,_ref,_ref1,_results,_results1;if(cmp==null){cmp=defaultCmp;}_ref1=function(){_results1=[];for(var _j=0,_ref=floor(array.length/2);0<=_ref?_j<_ref:_j>_ref;0<=_ref?_j++:_j--){_results1.push(_j);}return _results1;}.apply(this).reverse();_results=[];for(_i=0,_len=_ref1.length;_i<_len;_i++){i=_ref1[_i];_results.push(_siftup(array,i,cmp));}return _results;};/*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */updateItem=function updateItem(array,item,cmp){var pos;if(cmp==null){cmp=defaultCmp;}pos=array.indexOf(item);if(pos===-1){return;}_siftdown(array,0,pos,cmp);return _siftup(array,pos,cmp);};/*
  Find the n largest elements in a dataset.
   */nlargest=function nlargest(array,n,cmp){var elem,result,_i,_len,_ref;if(cmp==null){cmp=defaultCmp;}result=array.slice(0,n);if(!result.length){return result;}heapify(result,cmp);_ref=array.slice(n);for(_i=0,_len=_ref.length;_i<_len;_i++){elem=_ref[_i];heappushpop(result,elem,cmp);}return result.sort(cmp).reverse();};/*
  Find the n smallest elements in a dataset.
   */nsmallest=function nsmallest(array,n,cmp){var elem,i,los,result,_i,_j,_len,_ref,_ref1,_results;if(cmp==null){cmp=defaultCmp;}if(n*10<=array.length){result=array.slice(0,n).sort(cmp);if(!result.length){return result;}los=result[result.length-1];_ref=array.slice(n);for(_i=0,_len=_ref.length;_i<_len;_i++){elem=_ref[_i];if(cmp(elem,los)<0){insort(result,elem,0,null,cmp);result.pop();los=result[result.length-1];}}return result;}heapify(array,cmp);_results=[];for(i=_j=0,_ref1=min(n,array.length);0<=_ref1?_j<_ref1:_j>_ref1;i=0<=_ref1?++_j:--_j){_results.push(heappop(array,cmp));}return _results;};_siftdown=function _siftdown(array,startpos,pos,cmp){var newitem,parent,parentpos;if(cmp==null){cmp=defaultCmp;}newitem=array[pos];while(pos>startpos){parentpos=pos-1>>1;parent=array[parentpos];if(cmp(newitem,parent)<0){array[pos]=parent;pos=parentpos;continue;}break;}return array[pos]=newitem;};_siftup=function _siftup(array,pos,cmp){var childpos,endpos,newitem,rightpos,startpos;if(cmp==null){cmp=defaultCmp;}endpos=array.length;startpos=pos;newitem=array[pos];childpos=2*pos+1;while(childpos<endpos){rightpos=childpos+1;if(rightpos<endpos&&!(cmp(array[childpos],array[rightpos])<0)){childpos=rightpos;}array[pos]=array[childpos];pos=childpos;childpos=2*pos+1;}array[pos]=newitem;return _siftdown(array,startpos,pos,cmp);};Heap=function(){Heap.push=heappush;Heap.pop=heappop;Heap.replace=heapreplace;Heap.pushpop=heappushpop;Heap.heapify=heapify;Heap.updateItem=updateItem;Heap.nlargest=nlargest;Heap.nsmallest=nsmallest;function Heap(cmp){this.cmp=cmp!=null?cmp:defaultCmp;this.nodes=[];}Heap.prototype.push=function(x){return heappush(this.nodes,x,this.cmp);};Heap.prototype.pop=function(){return heappop(this.nodes,this.cmp);};Heap.prototype.peek=function(){return this.nodes[0];};Heap.prototype.contains=function(x){return this.nodes.indexOf(x)!==-1;};Heap.prototype.replace=function(x){return heapreplace(this.nodes,x,this.cmp);};Heap.prototype.pushpop=function(x){return heappushpop(this.nodes,x,this.cmp);};Heap.prototype.heapify=function(){return heapify(this.nodes,this.cmp);};Heap.prototype.updateItem=function(x){return updateItem(this.nodes,x,this.cmp);};Heap.prototype.clear=function(){return this.nodes=[];};Heap.prototype.empty=function(){return this.nodes.length===0;};Heap.prototype.size=function(){return this.nodes.length;};Heap.prototype.clone=function(){var heap;heap=new Heap();heap.nodes=this.nodes.slice(0);return heap;};Heap.prototype.toArray=function(){return this.nodes.slice(0);};Heap.prototype.insert=Heap.prototype.push;Heap.prototype.top=Heap.prototype.peek;Heap.prototype.front=Heap.prototype.peek;Heap.prototype.has=Heap.prototype.contains;Heap.prototype.copy=Heap.prototype.clone;return Heap;}();if(typeof module!=="undefined"&&module!==null?module.exports:void 0){module.exports=Heap;}else{window.Heap=Heap;}}).call(this);},{}],3:[function(_dereq_,module,exports){var DiagonalMovement={Always:1,Never:2,IfAtMostOneObstacle:3,OnlyWhenNoObstacles:4};module.exports=DiagonalMovement;},{}],4:[function(_dereq_,module,exports){var Node=_dereq_('./Node');var DiagonalMovement=_dereq_('./DiagonalMovement');/**
 * The Grid class, which serves as the encapsulation of the layout of the nodes.
 * @constructor
 * @param {number|Array<Array<(number|boolean)>>} width_or_matrix Number of columns of the grid, or matrix
 * @param {number} height Number of rows of the grid.
 * @param {Array<Array<(number|boolean)>>} [matrix] - A 0-1 matrix
 *     representing the walkable status of the nodes(0 or false for walkable).
 *     If the matrix is not supplied, all the nodes will be walkable.  */function Grid(width_or_matrix,height,matrix){var width;if((typeof width_or_matrix==='undefined'?'undefined':_typeof(width_or_matrix))!=='object'){width=width_or_matrix;}else{height=width_or_matrix.length;width=width_or_matrix[0].length;matrix=width_or_matrix;}/**
     * The number of columns of the grid.
     * @type number
     */this.width=width;/**
     * The number of rows of the grid.
     * @type number
     */this.height=height;/**
     * A 2D array of nodes.
     */this.nodes=this._buildNodes(width,height,matrix);}/**
 * Build and return the nodes.
 * @private
 * @param {number} width
 * @param {number} height
 * @param {Array<Array<number|boolean>>} [matrix] - A 0-1 matrix representing
 *     the walkable status of the nodes.
 * @see Grid
 */Grid.prototype._buildNodes=function(width,height,matrix){var i,j,nodes=new Array(height);for(i=0;i<height;++i){nodes[i]=new Array(width);for(j=0;j<width;++j){nodes[i][j]=new Node(j,i);}}if(matrix===undefined){return nodes;}if(matrix.length!==height||matrix[0].length!==width){throw new Error('Matrix size does not fit');}for(i=0;i<height;++i){for(j=0;j<width;++j){if(matrix[i][j]){// 0, false, null will be walkable
// while others will be un-walkable
nodes[i][j].walkable=false;}}}return nodes;};Grid.prototype.getNodeAt=function(x,y){return this.nodes[y][x];};/**
 * Determine whether the node at the given position is walkable.
 * (Also returns false if the position is outside the grid.)
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {boolean} - The walkability of the node.
 */Grid.prototype.isWalkableAt=function(x,y){return this.isInside(x,y)&&this.nodes[y][x].walkable;};/**
 * Determine whether the position is inside the grid.
 * XXX: `grid.isInside(x, y)` is wierd to read.
 * It should be `(x, y) is inside grid`, but I failed to find a better
 * name for this method.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */Grid.prototype.isInside=function(x,y){return x>=0&&x<this.width&&y>=0&&y<this.height;};/**
 * Set whether the node on the given position is walkable.
 * NOTE: throws exception if the coordinate is not inside the grid.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {boolean} walkable - Whether the position is walkable.
 */Grid.prototype.setWalkableAt=function(x,y,walkable){this.nodes[y][x].walkable=walkable;};/**
 * Get the neighbors of the given node.
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {DiagonalMovement} diagonalMovement
 */Grid.prototype.getNeighbors=function(node,diagonalMovement){var x=node.x,y=node.y,neighbors=[],s0=false,d0=false,s1=false,d1=false,s2=false,d2=false,s3=false,d3=false,nodes=this.nodes;// ↑
if(this.isWalkableAt(x,y-1)){neighbors.push(nodes[y-1][x]);s0=true;}// →
if(this.isWalkableAt(x+1,y)){neighbors.push(nodes[y][x+1]);s1=true;}// ↓
if(this.isWalkableAt(x,y+1)){neighbors.push(nodes[y+1][x]);s2=true;}// ←
if(this.isWalkableAt(x-1,y)){neighbors.push(nodes[y][x-1]);s3=true;}if(diagonalMovement===DiagonalMovement.Never){return neighbors;}if(diagonalMovement===DiagonalMovement.OnlyWhenNoObstacles){d0=s3&&s0;d1=s0&&s1;d2=s1&&s2;d3=s2&&s3;}else if(diagonalMovement===DiagonalMovement.IfAtMostOneObstacle){d0=s3||s0;d1=s0||s1;d2=s1||s2;d3=s2||s3;}else if(diagonalMovement===DiagonalMovement.Always){d0=true;d1=true;d2=true;d3=true;}else{throw new Error('Incorrect value of diagonalMovement');}// ↖
if(d0&&this.isWalkableAt(x-1,y-1)){neighbors.push(nodes[y-1][x-1]);}// ↗
if(d1&&this.isWalkableAt(x+1,y-1)){neighbors.push(nodes[y-1][x+1]);}// ↘
if(d2&&this.isWalkableAt(x+1,y+1)){neighbors.push(nodes[y+1][x+1]);}// ↙
if(d3&&this.isWalkableAt(x-1,y+1)){neighbors.push(nodes[y+1][x-1]);}return neighbors;};/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */Grid.prototype.clone=function(){var i,j,width=this.width,height=this.height,thisNodes=this.nodes,newGrid=new Grid(width,height),newNodes=new Array(height);for(i=0;i<height;++i){newNodes[i]=new Array(width);for(j=0;j<width;++j){newNodes[i][j]=new Node(j,i,thisNodes[i][j].walkable);}}newGrid.nodes=newNodes;return newGrid;};module.exports=Grid;},{"./DiagonalMovement":3,"./Node":6}],5:[function(_dereq_,module,exports){/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions.
 */module.exports={/**
   * Manhattan distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} dx + dy
   */manhattan:function manhattan(dx,dy){return dx+dy;},/**
   * Euclidean distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy)
   */euclidean:function euclidean(dx,dy){return Math.sqrt(dx*dx+dy*dy);},/**
   * Octile distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy) for grids
   */octile:function octile(dx,dy){var F=Math.SQRT2-1;return dx<dy?F*dx+dy:F*dy+dx;},/**
   * Chebyshev distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} max(dx, dy)
   */chebyshev:function chebyshev(dx,dy){return Math.max(dx,dy);}};},{}],6:[function(_dereq_,module,exports){/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 */function Node(x,y,walkable){/**
     * The x coordinate of the node on the grid.
     * @type number
     */this.x=x;/**
     * The y coordinate of the node on the grid.
     * @type number
     */this.y=y;/**
     * Whether this node can be walked through.
     * @type boolean
     */this.walkable=walkable===undefined?true:walkable;}module.exports=Node;},{}],7:[function(_dereq_,module,exports){/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @param {Node} node End node
 * @return {Array<Array<number>>} the path
 */function backtrace(node){var path=[[node.x,node.y]];while(node.parent){node=node.parent;path.push([node.x,node.y]);}return path.reverse();}exports.backtrace=backtrace;/**
 * Backtrace from start and end node, and return the path.
 * (including both start and end nodes)
 * @param {Node}
 * @param {Node}
 */function biBacktrace(nodeA,nodeB){var pathA=backtrace(nodeA),pathB=backtrace(nodeB);return pathA.concat(pathB.reverse());}exports.biBacktrace=biBacktrace;/**
 * Compute the length of the path.
 * @param {Array<Array<number>>} path The path
 * @return {number} The length of the path
 */function pathLength(path){var i,sum=0,a,b,dx,dy;for(i=1;i<path.length;++i){a=path[i-1];b=path[i];dx=a[0]-b[0];dy=a[1]-b[1];sum+=Math.sqrt(dx*dx+dy*dy);}return sum;}exports.pathLength=pathLength;/**
 * Given the start and end coordinates, return all the coordinates lying
 * on the line formed by these coordinates, based on Bresenham's algorithm.
 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
 * @param {number} x0 Start x coordinate
 * @param {number} y0 Start y coordinate
 * @param {number} x1 End x coordinate
 * @param {number} y1 End y coordinate
 * @return {Array<Array<number>>} The coordinates on the line
 */function interpolate(x0,y0,x1,y1){var abs=Math.abs,line=[],sx,sy,dx,dy,err,e2;dx=abs(x1-x0);dy=abs(y1-y0);sx=x0<x1?1:-1;sy=y0<y1?1:-1;err=dx-dy;while(true){line.push([x0,y0]);if(x0===x1&&y0===y1){break;}e2=2*err;if(e2>-dy){err=err-dy;x0=x0+sx;}if(e2<dx){err=err+dx;y0=y0+sy;}}return line;}exports.interpolate=interpolate;/**
 * Given a compressed path, return a new path that has all the segments
 * in it interpolated.
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} expanded path
 */function expandPath(path){var expanded=[],len=path.length,coord0,coord1,interpolated,interpolatedLen,i,j;if(len<2){return expanded;}for(i=0;i<len-1;++i){coord0=path[i];coord1=path[i+1];interpolated=interpolate(coord0[0],coord0[1],coord1[0],coord1[1]);interpolatedLen=interpolated.length;for(j=0;j<interpolatedLen-1;++j){expanded.push(interpolated[j]);}}expanded.push(path[len-1]);return expanded;}exports.expandPath=expandPath;/**
 * Smoothen the give path.
 * The original path will not be modified; a new path will be returned.
 * @param {PF.Grid} grid
 * @param {Array<Array<number>>} path The path
 */function smoothenPath(grid,path){var len=path.length,x0=path[0][0],// path start x
y0=path[0][1],// path start y
x1=path[len-1][0],// path end x
y1=path[len-1][1],// path end y
sx,sy,// current start coordinate
ex,ey,// current end coordinate
newPath,i,j,coord,line,testCoord,blocked;sx=x0;sy=y0;newPath=[[sx,sy]];for(i=2;i<len;++i){coord=path[i];ex=coord[0];ey=coord[1];line=interpolate(sx,sy,ex,ey);blocked=false;for(j=1;j<line.length;++j){testCoord=line[j];if(!grid.isWalkableAt(testCoord[0],testCoord[1])){blocked=true;break;}}if(blocked){lastValidCoord=path[i-1];newPath.push(lastValidCoord);sx=lastValidCoord[0];sy=lastValidCoord[1];}}newPath.push([x1,y1]);return newPath;}exports.smoothenPath=smoothenPath;/**
 * Compress a path, remove redundant nodes without altering the shape
 * The original path is not modified
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} The compressed path
 */function compressPath(path){// nothing to compress
if(path.length<3){return path;}var compressed=[],sx=path[0][0],// start x
sy=path[0][1],// start y
px=path[1][0],// second point x
py=path[1][1],// second point y
dx=px-sx,// direction between the two points
dy=py-sy,// direction between the two points
lx,ly,ldx,ldy,sq,i;// normalize the direction
sq=Math.sqrt(dx*dx+dy*dy);dx/=sq;dy/=sq;// start the new path
compressed.push([sx,sy]);for(i=2;i<path.length;i++){// store the last point
lx=px;ly=py;// store the last direction
ldx=dx;ldy=dy;// next point
px=path[i][0];py=path[i][1];// next direction
dx=px-lx;dy=py-ly;// normalize
sq=Math.sqrt(dx*dx+dy*dy);dx/=sq;dy/=sq;// if the direction has changed, store the point
if(dx!==ldx||dy!==ldy){compressed.push([lx,ly]);}}// store the last point
compressed.push([px,py]);return compressed;}exports.compressPath=compressPath;},{}],8:[function(_dereq_,module,exports){module.exports={'Heap':_dereq_('heap'),'Node':_dereq_('./core/Node'),'Grid':_dereq_('./core/Grid'),'Util':_dereq_('./core/Util'),'DiagonalMovement':_dereq_('./core/DiagonalMovement'),'Heuristic':_dereq_('./core/Heuristic'),'AStarFinder':_dereq_('./finders/AStarFinder'),'BestFirstFinder':_dereq_('./finders/BestFirstFinder'),'BreadthFirstFinder':_dereq_('./finders/BreadthFirstFinder'),'DijkstraFinder':_dereq_('./finders/DijkstraFinder'),'BiAStarFinder':_dereq_('./finders/BiAStarFinder'),'BiBestFirstFinder':_dereq_('./finders/BiBestFirstFinder'),'BiBreadthFirstFinder':_dereq_('./finders/BiBreadthFirstFinder'),'BiDijkstraFinder':_dereq_('./finders/BiDijkstraFinder'),'IDAStarFinder':_dereq_('./finders/IDAStarFinder'),'JumpPointFinder':_dereq_('./finders/JumpPointFinder')};},{"./core/DiagonalMovement":3,"./core/Grid":4,"./core/Heuristic":5,"./core/Node":6,"./core/Util":7,"./finders/AStarFinder":9,"./finders/BestFirstFinder":10,"./finders/BiAStarFinder":11,"./finders/BiBestFirstFinder":12,"./finders/BiBreadthFirstFinder":13,"./finders/BiDijkstraFinder":14,"./finders/BreadthFirstFinder":15,"./finders/DijkstraFinder":16,"./finders/IDAStarFinder":17,"./finders/JumpPointFinder":22,"heap":1}],9:[function(_dereq_,module,exports){var Heap=_dereq_('heap');var Util=_dereq_('../core/Util');var Heuristic=_dereq_('../core/Heuristic');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * A* path-finder. Based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching 
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */function AStarFinder(opt){opt=opt||{};this.allowDiagonal=opt.allowDiagonal;this.dontCrossCorners=opt.dontCrossCorners;this.heuristic=opt.heuristic||Heuristic.manhattan;this.weight=opt.weight||1;this.diagonalMovement=opt.diagonalMovement;if(!this.diagonalMovement){if(!this.allowDiagonal){this.diagonalMovement=DiagonalMovement.Never;}else{if(this.dontCrossCorners){this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;}else{this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;}}}// When diagonal movement is allowed the manhattan heuristic is not
//admissible. It should be octile instead
if(this.diagonalMovement===DiagonalMovement.Never){this.heuristic=opt.heuristic||Heuristic.manhattan;}else{this.heuristic=opt.heuristic||Heuristic.octile;}}/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */AStarFinder.prototype.findPath=function(startX,startY,endX,endY,grid){var openList=new Heap(function(nodeA,nodeB){return nodeA.f-nodeB.f;}),startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),heuristic=this.heuristic,diagonalMovement=this.diagonalMovement,weight=this.weight,abs=Math.abs,SQRT2=Math.SQRT2,node,neighbors,neighbor,i,l,x,y,ng;// set the `g` and `f` value of the start node to be 0
startNode.g=0;startNode.f=0;// push the start node into the open list
openList.push(startNode);startNode.opened=true;// while the open list is not empty
while(!openList.empty()){// pop the position of node which has the minimum `f` value.
node=openList.pop();node.closed=true;// if reached the end position, construct the path and return it
if(node===endNode){return Util.backtrace(endNode);}// get neigbours of the current node
neighbors=grid.getNeighbors(node,diagonalMovement);for(i=0,l=neighbors.length;i<l;++i){neighbor=neighbors[i];if(neighbor.closed){continue;}x=neighbor.x;y=neighbor.y;// get the distance between current node and the neighbor
// and calculate the next g score
ng=node.g+(x-node.x===0||y-node.y===0?1:SQRT2);// check if the neighbor has not been inspected yet, or
// can be reached with smaller cost from the current node
if(!neighbor.opened||ng<neighbor.g){neighbor.g=ng;neighbor.h=neighbor.h||weight*heuristic(abs(x-endX),abs(y-endY));neighbor.f=neighbor.g+neighbor.h;neighbor.parent=node;if(!neighbor.opened){openList.push(neighbor);neighbor.opened=true;}else{// the neighbor can be reached with smaller cost.
// Since its f value has been updated, we have to
// update its position in the open list
openList.updateItem(neighbor);}}}// end for each neighbor
}// end while not open list empty
// fail to find the path
return[];};module.exports=AStarFinder;},{"../core/DiagonalMovement":3,"../core/Heuristic":5,"../core/Util":7,"heap":1}],10:[function(_dereq_,module,exports){var AStarFinder=_dereq_('./AStarFinder');/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */function BestFirstFinder(opt){AStarFinder.call(this,opt);var orig=this.heuristic;this.heuristic=function(dx,dy){return orig(dx,dy)*1000000;};}BestFirstFinder.prototype=new AStarFinder();BestFirstFinder.prototype.constructor=BestFirstFinder;module.exports=BestFirstFinder;},{"./AStarFinder":9}],11:[function(_dereq_,module,exports){var Heap=_dereq_('heap');var Util=_dereq_('../core/Util');var Heuristic=_dereq_('../core/Heuristic');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * A* path-finder.
 * based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */function BiAStarFinder(opt){opt=opt||{};this.allowDiagonal=opt.allowDiagonal;this.dontCrossCorners=opt.dontCrossCorners;this.diagonalMovement=opt.diagonalMovement;this.heuristic=opt.heuristic||Heuristic.manhattan;this.weight=opt.weight||1;if(!this.diagonalMovement){if(!this.allowDiagonal){this.diagonalMovement=DiagonalMovement.Never;}else{if(this.dontCrossCorners){this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;}else{this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;}}}//When diagonal movement is allowed the manhattan heuristic is not admissible
//It should be octile instead
if(this.diagonalMovement===DiagonalMovement.Never){this.heuristic=opt.heuristic||Heuristic.manhattan;}else{this.heuristic=opt.heuristic||Heuristic.octile;}}/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */BiAStarFinder.prototype.findPath=function(startX,startY,endX,endY,grid){var cmp=function cmp(nodeA,nodeB){return nodeA.f-nodeB.f;},startOpenList=new Heap(cmp),endOpenList=new Heap(cmp),startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),heuristic=this.heuristic,diagonalMovement=this.diagonalMovement,weight=this.weight,abs=Math.abs,SQRT2=Math.SQRT2,node,neighbors,neighbor,i,l,x,y,ng,BY_START=1,BY_END=2;// set the `g` and `f` value of the start node to be 0
// and push it into the start open list
startNode.g=0;startNode.f=0;startOpenList.push(startNode);startNode.opened=BY_START;// set the `g` and `f` value of the end node to be 0
// and push it into the open open list
endNode.g=0;endNode.f=0;endOpenList.push(endNode);endNode.opened=BY_END;// while both the open lists are not empty
while(!startOpenList.empty()&&!endOpenList.empty()){// pop the position of start node which has the minimum `f` value.
node=startOpenList.pop();node.closed=true;// get neigbours of the current node
neighbors=grid.getNeighbors(node,diagonalMovement);for(i=0,l=neighbors.length;i<l;++i){neighbor=neighbors[i];if(neighbor.closed){continue;}if(neighbor.opened===BY_END){return Util.biBacktrace(node,neighbor);}x=neighbor.x;y=neighbor.y;// get the distance between current node and the neighbor
// and calculate the next g score
ng=node.g+(x-node.x===0||y-node.y===0?1:SQRT2);// check if the neighbor has not been inspected yet, or
// can be reached with smaller cost from the current node
if(!neighbor.opened||ng<neighbor.g){neighbor.g=ng;neighbor.h=neighbor.h||weight*heuristic(abs(x-endX),abs(y-endY));neighbor.f=neighbor.g+neighbor.h;neighbor.parent=node;if(!neighbor.opened){startOpenList.push(neighbor);neighbor.opened=BY_START;}else{// the neighbor can be reached with smaller cost.
// Since its f value has been updated, we have to
// update its position in the open list
startOpenList.updateItem(neighbor);}}}// end for each neighbor
// pop the position of end node which has the minimum `f` value.
node=endOpenList.pop();node.closed=true;// get neigbours of the current node
neighbors=grid.getNeighbors(node,diagonalMovement);for(i=0,l=neighbors.length;i<l;++i){neighbor=neighbors[i];if(neighbor.closed){continue;}if(neighbor.opened===BY_START){return Util.biBacktrace(neighbor,node);}x=neighbor.x;y=neighbor.y;// get the distance between current node and the neighbor
// and calculate the next g score
ng=node.g+(x-node.x===0||y-node.y===0?1:SQRT2);// check if the neighbor has not been inspected yet, or
// can be reached with smaller cost from the current node
if(!neighbor.opened||ng<neighbor.g){neighbor.g=ng;neighbor.h=neighbor.h||weight*heuristic(abs(x-startX),abs(y-startY));neighbor.f=neighbor.g+neighbor.h;neighbor.parent=node;if(!neighbor.opened){endOpenList.push(neighbor);neighbor.opened=BY_END;}else{// the neighbor can be reached with smaller cost.
// Since its f value has been updated, we have to
// update its position in the open list
endOpenList.updateItem(neighbor);}}}// end for each neighbor
}// end while not open list empty
// fail to find the path
return[];};module.exports=BiAStarFinder;},{"../core/DiagonalMovement":3,"../core/Heuristic":5,"../core/Util":7,"heap":1}],12:[function(_dereq_,module,exports){var BiAStarFinder=_dereq_('./BiAStarFinder');/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */function BiBestFirstFinder(opt){BiAStarFinder.call(this,opt);var orig=this.heuristic;this.heuristic=function(dx,dy){return orig(dx,dy)*1000000;};}BiBestFirstFinder.prototype=new BiAStarFinder();BiBestFirstFinder.prototype.constructor=BiBestFirstFinder;module.exports=BiBestFirstFinder;},{"./BiAStarFinder":11}],13:[function(_dereq_,module,exports){var Util=_dereq_('../core/Util');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Bi-directional Breadth-First-Search path finder.
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */function BiBreadthFirstFinder(opt){opt=opt||{};this.allowDiagonal=opt.allowDiagonal;this.dontCrossCorners=opt.dontCrossCorners;this.diagonalMovement=opt.diagonalMovement;if(!this.diagonalMovement){if(!this.allowDiagonal){this.diagonalMovement=DiagonalMovement.Never;}else{if(this.dontCrossCorners){this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;}else{this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;}}}}/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */BiBreadthFirstFinder.prototype.findPath=function(startX,startY,endX,endY,grid){var startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),startOpenList=[],endOpenList=[],neighbors,neighbor,node,diagonalMovement=this.diagonalMovement,BY_START=0,BY_END=1,i,l;// push the start and end nodes into the queues
startOpenList.push(startNode);startNode.opened=true;startNode.by=BY_START;endOpenList.push(endNode);endNode.opened=true;endNode.by=BY_END;// while both the queues are not empty
while(startOpenList.length&&endOpenList.length){// expand start open list
node=startOpenList.shift();node.closed=true;neighbors=grid.getNeighbors(node,diagonalMovement);for(i=0,l=neighbors.length;i<l;++i){neighbor=neighbors[i];if(neighbor.closed){continue;}if(neighbor.opened){// if this node has been inspected by the reversed search,
// then a path is found.
if(neighbor.by===BY_END){return Util.biBacktrace(node,neighbor);}continue;}startOpenList.push(neighbor);neighbor.parent=node;neighbor.opened=true;neighbor.by=BY_START;}// expand end open list
node=endOpenList.shift();node.closed=true;neighbors=grid.getNeighbors(node,diagonalMovement);for(i=0,l=neighbors.length;i<l;++i){neighbor=neighbors[i];if(neighbor.closed){continue;}if(neighbor.opened){if(neighbor.by===BY_START){return Util.biBacktrace(neighbor,node);}continue;}endOpenList.push(neighbor);neighbor.parent=node;neighbor.opened=true;neighbor.by=BY_END;}}// fail to find the path
return[];};module.exports=BiBreadthFirstFinder;},{"../core/DiagonalMovement":3,"../core/Util":7}],14:[function(_dereq_,module,exports){var BiAStarFinder=_dereq_('./BiAStarFinder');/**
 * Bi-directional Dijkstra path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */function BiDijkstraFinder(opt){BiAStarFinder.call(this,opt);this.heuristic=function(dx,dy){return 0;};}BiDijkstraFinder.prototype=new BiAStarFinder();BiDijkstraFinder.prototype.constructor=BiDijkstraFinder;module.exports=BiDijkstraFinder;},{"./BiAStarFinder":11}],15:[function(_dereq_,module,exports){var Util=_dereq_('../core/Util');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Breadth-First-Search path finder.
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */function BreadthFirstFinder(opt){opt=opt||{};this.allowDiagonal=opt.allowDiagonal;this.dontCrossCorners=opt.dontCrossCorners;this.diagonalMovement=opt.diagonalMovement;if(!this.diagonalMovement){if(!this.allowDiagonal){this.diagonalMovement=DiagonalMovement.Never;}else{if(this.dontCrossCorners){this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;}else{this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;}}}}/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */BreadthFirstFinder.prototype.findPath=function(startX,startY,endX,endY,grid){var openList=[],diagonalMovement=this.diagonalMovement,startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),neighbors,neighbor,node,i,l;// push the start pos into the queue
openList.push(startNode);startNode.opened=true;// while the queue is not empty
while(openList.length){// take the front node from the queue
node=openList.shift();node.closed=true;// reached the end position
if(node===endNode){return Util.backtrace(endNode);}neighbors=grid.getNeighbors(node,diagonalMovement);for(i=0,l=neighbors.length;i<l;++i){neighbor=neighbors[i];// skip this neighbor if it has been inspected before
if(neighbor.closed||neighbor.opened){continue;}openList.push(neighbor);neighbor.opened=true;neighbor.parent=node;}}// fail to find the path
return[];};module.exports=BreadthFirstFinder;},{"../core/DiagonalMovement":3,"../core/Util":7}],16:[function(_dereq_,module,exports){var AStarFinder=_dereq_('./AStarFinder');/**
 * Dijkstra path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */function DijkstraFinder(opt){AStarFinder.call(this,opt);this.heuristic=function(dx,dy){return 0;};}DijkstraFinder.prototype=new AStarFinder();DijkstraFinder.prototype.constructor=DijkstraFinder;module.exports=DijkstraFinder;},{"./AStarFinder":9}],17:[function(_dereq_,module,exports){var Util=_dereq_('../core/Util');var Heuristic=_dereq_('../core/Heuristic');var Node=_dereq_('../core/Node');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Iterative Deeping A Star (IDA*) path-finder.
 *
 * Recursion based on:
 *   http://www.apl.jhu.edu/~hall/AI-Programming/IDA-Star.html
 *
 * Path retracing based on:
 *  V. Nageshwara Rao, Vipin Kumar and K. Ramesh
 *  "A Parallel Implementation of Iterative-Deeping-A*", January 1987.
 *  ftp://ftp.cs.utexas.edu/.snapshot/hourly.1/pub/AI-Lab/tech-reports/UT-AI-TR-87-46.pdf
 *
 * @author Gerard Meier (www.gerardmeier.com)
 *
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 * @param {boolean} opt.trackRecursion Whether to track recursion for
 *     statistical purposes.
 * @param {number} opt.timeLimit Maximum execution time. Use <= 0 for infinite.
 */function IDAStarFinder(opt){opt=opt||{};this.allowDiagonal=opt.allowDiagonal;this.dontCrossCorners=opt.dontCrossCorners;this.diagonalMovement=opt.diagonalMovement;this.heuristic=opt.heuristic||Heuristic.manhattan;this.weight=opt.weight||1;this.trackRecursion=opt.trackRecursion||false;this.timeLimit=opt.timeLimit||Infinity;// Default: no time limit.
if(!this.diagonalMovement){if(!this.allowDiagonal){this.diagonalMovement=DiagonalMovement.Never;}else{if(this.dontCrossCorners){this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;}else{this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;}}}// When diagonal movement is allowed the manhattan heuristic is not
// admissible, it should be octile instead
if(this.diagonalMovement===DiagonalMovement.Never){this.heuristic=opt.heuristic||Heuristic.manhattan;}else{this.heuristic=opt.heuristic||Heuristic.octile;}}/**
 * Find and return the the path. When an empty array is returned, either
 * no path is possible, or the maximum execution time is reached.
 *
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */IDAStarFinder.prototype.findPath=function(startX,startY,endX,endY,grid){// Used for statistics:
var nodesVisited=0;// Execution time limitation:
var startTime=new Date().getTime();// Heuristic helper:
var h=function(a,b){return this.heuristic(Math.abs(b.x-a.x),Math.abs(b.y-a.y));}.bind(this);// Step cost from a to b:
var cost=function cost(a,b){return a.x===b.x||a.y===b.y?1:Math.SQRT2;};/**
     * IDA* search implementation.
     *
     * @param {Node} The node currently expanding from.
     * @param {number} Cost to reach the given node.
     * @param {number} Maximum search depth (cut-off value).
     * @param {Array<Array<number>>} The found route.
     * @param {number} Recursion depth.
     *
     * @return {Object} either a number with the new optimal cut-off depth,
     * or a valid node instance, in which case a path was found.
     */var search=function(node,g,cutoff,route,depth){nodesVisited++;// Enforce timelimit:
if(this.timeLimit>0&&new Date().getTime()-startTime>this.timeLimit*1000){// Enforced as "path-not-found".
return Infinity;}var f=g+h(node,end)*this.weight;// We've searched too deep for this iteration.
if(f>cutoff){return f;}if(node==end){route[depth]=[node.x,node.y];return node;}var min,t,k,neighbour;var neighbours=grid.getNeighbors(node,this.diagonalMovement);// Sort the neighbours, gives nicer paths. But, this deviates
// from the original algorithm - so I left it out.
//neighbours.sort(function(a, b){
//    return h(a, end) - h(b, end);
//});
/*jshint -W084 *///Disable warning: Expected a conditional expression and instead saw an assignment
for(k=0,min=Infinity;neighbour=neighbours[k];++k){/*jshint +W084 *///Enable warning: Expected a conditional expression and instead saw an assignment
if(this.trackRecursion){// Retain a copy for visualisation. Due to recursion, this
// node may be part of other paths too.
neighbour.retainCount=neighbour.retainCount+1||1;if(neighbour.tested!==true){neighbour.tested=true;}}t=search(neighbour,g+cost(node,neighbour),cutoff,route,depth+1);if(t instanceof Node){route[depth]=[node.x,node.y];// For a typical A* linked list, this would work:
// neighbour.parent = node;
return t;}// Decrement count, then determine whether it's actually closed.
if(this.trackRecursion&&--neighbour.retainCount===0){neighbour.tested=false;}if(t<min){min=t;}}return min;}.bind(this);// Node instance lookups:
var start=grid.getNodeAt(startX,startY);var end=grid.getNodeAt(endX,endY);// Initial search depth, given the typical heuristic contraints,
// there should be no cheaper route possible.
var cutOff=h(start,end);var j,route,t;// With an overflow protection.
for(j=0;true;++j){route=[];// Search till cut-off depth:
t=search(start,0,cutOff,route,0);// Route not possible, or not found in time limit.
if(t===Infinity){return[];}// If t is a node, it's also the end node. Route is now
// populated with a valid path to the end node.
if(t instanceof Node){return route;}// Try again, this time with a deeper cut-off. The t score
// is the closest we got to the end node.
cutOff=t;}// This _should_ never to be reached.
return[];};module.exports=IDAStarFinder;},{"../core/DiagonalMovement":3,"../core/Heuristic":5,"../core/Node":6,"../core/Util":7}],18:[function(_dereq_,module,exports){/**
 * @author imor / https://github.com/imor
 */var JumpPointFinderBase=_dereq_('./JumpPointFinderBase');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Path finder using the Jump Point Search algorithm which always moves
 * diagonally irrespective of the number of obstacles.
 */function JPFAlwaysMoveDiagonally(opt){JumpPointFinderBase.call(this,opt);}JPFAlwaysMoveDiagonally.prototype=new JumpPointFinderBase();JPFAlwaysMoveDiagonally.prototype.constructor=JPFAlwaysMoveDiagonally;/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */JPFAlwaysMoveDiagonally.prototype._jump=function(x,y,px,py){var grid=this.grid,dx=x-px,dy=y-py;if(!grid.isWalkableAt(x,y)){return null;}if(this.trackJumpRecursion===true){grid.getNodeAt(x,y).tested=true;}if(grid.getNodeAt(x,y)===this.endNode){return[x,y];}// check for forced neighbors
// along the diagonal
if(dx!==0&&dy!==0){if(grid.isWalkableAt(x-dx,y+dy)&&!grid.isWalkableAt(x-dx,y)||grid.isWalkableAt(x+dx,y-dy)&&!grid.isWalkableAt(x,y-dy)){return[x,y];}// when moving diagonally, must check for vertical/horizontal jump points
if(this._jump(x+dx,y,x,y)||this._jump(x,y+dy,x,y)){return[x,y];}}// horizontally/vertically
else{if(dx!==0){// moving along x
if(grid.isWalkableAt(x+dx,y+1)&&!grid.isWalkableAt(x,y+1)||grid.isWalkableAt(x+dx,y-1)&&!grid.isWalkableAt(x,y-1)){return[x,y];}}else{if(grid.isWalkableAt(x+1,y+dy)&&!grid.isWalkableAt(x+1,y)||grid.isWalkableAt(x-1,y+dy)&&!grid.isWalkableAt(x-1,y)){return[x,y];}}}return this._jump(x+dx,y+dy,x,y);};/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */JPFAlwaysMoveDiagonally.prototype._findNeighbors=function(node){var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px,py,nx,ny,dx,dy,neighbors=[],neighborNodes,neighborNode,i,l;// directed pruning: can ignore most neighbors, unless forced.
if(parent){px=parent.x;py=parent.y;// get the normalized direction of travel
dx=(x-px)/Math.max(Math.abs(x-px),1);dy=(y-py)/Math.max(Math.abs(y-py),1);// search diagonally
if(dx!==0&&dy!==0){if(grid.isWalkableAt(x,y+dy)){neighbors.push([x,y+dy]);}if(grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y]);}if(grid.isWalkableAt(x+dx,y+dy)){neighbors.push([x+dx,y+dy]);}if(!grid.isWalkableAt(x-dx,y)){neighbors.push([x-dx,y+dy]);}if(!grid.isWalkableAt(x,y-dy)){neighbors.push([x+dx,y-dy]);}}// search horizontally/vertically
else{if(dx===0){if(grid.isWalkableAt(x,y+dy)){neighbors.push([x,y+dy]);}if(!grid.isWalkableAt(x+1,y)){neighbors.push([x+1,y+dy]);}if(!grid.isWalkableAt(x-1,y)){neighbors.push([x-1,y+dy]);}}else{if(grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y]);}if(!grid.isWalkableAt(x,y+1)){neighbors.push([x+dx,y+1]);}if(!grid.isWalkableAt(x,y-1)){neighbors.push([x+dx,y-1]);}}}}// return all neighbors
else{neighborNodes=grid.getNeighbors(node,DiagonalMovement.Always);for(i=0,l=neighborNodes.length;i<l;++i){neighborNode=neighborNodes[i];neighbors.push([neighborNode.x,neighborNode.y]);}}return neighbors;};module.exports=JPFAlwaysMoveDiagonally;},{"../core/DiagonalMovement":3,"./JumpPointFinderBase":23}],19:[function(_dereq_,module,exports){/**
 * @author imor / https://github.com/imor
 */var JumpPointFinderBase=_dereq_('./JumpPointFinderBase');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there is at most one obstacle.
 */function JPFMoveDiagonallyIfAtMostOneObstacle(opt){JumpPointFinderBase.call(this,opt);}JPFMoveDiagonallyIfAtMostOneObstacle.prototype=new JumpPointFinderBase();JPFMoveDiagonallyIfAtMostOneObstacle.prototype.constructor=JPFMoveDiagonallyIfAtMostOneObstacle;/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */JPFMoveDiagonallyIfAtMostOneObstacle.prototype._jump=function(x,y,px,py){var grid=this.grid,dx=x-px,dy=y-py;if(!grid.isWalkableAt(x,y)){return null;}if(this.trackJumpRecursion===true){grid.getNodeAt(x,y).tested=true;}if(grid.getNodeAt(x,y)===this.endNode){return[x,y];}// check for forced neighbors
// along the diagonal
if(dx!==0&&dy!==0){if(grid.isWalkableAt(x-dx,y+dy)&&!grid.isWalkableAt(x-dx,y)||grid.isWalkableAt(x+dx,y-dy)&&!grid.isWalkableAt(x,y-dy)){return[x,y];}// when moving diagonally, must check for vertical/horizontal jump points
if(this._jump(x+dx,y,x,y)||this._jump(x,y+dy,x,y)){return[x,y];}}// horizontally/vertically
else{if(dx!==0){// moving along x
if(grid.isWalkableAt(x+dx,y+1)&&!grid.isWalkableAt(x,y+1)||grid.isWalkableAt(x+dx,y-1)&&!grid.isWalkableAt(x,y-1)){return[x,y];}}else{if(grid.isWalkableAt(x+1,y+dy)&&!grid.isWalkableAt(x+1,y)||grid.isWalkableAt(x-1,y+dy)&&!grid.isWalkableAt(x-1,y)){return[x,y];}}}// moving diagonally, must make sure one of the vertical/horizontal
// neighbors is open to allow the path
if(grid.isWalkableAt(x+dx,y)||grid.isWalkableAt(x,y+dy)){return this._jump(x+dx,y+dy,x,y);}else{return null;}};/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */JPFMoveDiagonallyIfAtMostOneObstacle.prototype._findNeighbors=function(node){var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px,py,nx,ny,dx,dy,neighbors=[],neighborNodes,neighborNode,i,l;// directed pruning: can ignore most neighbors, unless forced.
if(parent){px=parent.x;py=parent.y;// get the normalized direction of travel
dx=(x-px)/Math.max(Math.abs(x-px),1);dy=(y-py)/Math.max(Math.abs(y-py),1);// search diagonally
if(dx!==0&&dy!==0){if(grid.isWalkableAt(x,y+dy)){neighbors.push([x,y+dy]);}if(grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y]);}if(grid.isWalkableAt(x,y+dy)||grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y+dy]);}if(!grid.isWalkableAt(x-dx,y)&&grid.isWalkableAt(x,y+dy)){neighbors.push([x-dx,y+dy]);}if(!grid.isWalkableAt(x,y-dy)&&grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y-dy]);}}// search horizontally/vertically
else{if(dx===0){if(grid.isWalkableAt(x,y+dy)){neighbors.push([x,y+dy]);if(!grid.isWalkableAt(x+1,y)){neighbors.push([x+1,y+dy]);}if(!grid.isWalkableAt(x-1,y)){neighbors.push([x-1,y+dy]);}}}else{if(grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y]);if(!grid.isWalkableAt(x,y+1)){neighbors.push([x+dx,y+1]);}if(!grid.isWalkableAt(x,y-1)){neighbors.push([x+dx,y-1]);}}}}}// return all neighbors
else{neighborNodes=grid.getNeighbors(node,DiagonalMovement.IfAtMostOneObstacle);for(i=0,l=neighborNodes.length;i<l;++i){neighborNode=neighborNodes[i];neighbors.push([neighborNode.x,neighborNode.y]);}}return neighbors;};module.exports=JPFMoveDiagonallyIfAtMostOneObstacle;},{"../core/DiagonalMovement":3,"./JumpPointFinderBase":23}],20:[function(_dereq_,module,exports){/**
 * @author imor / https://github.com/imor
 */var JumpPointFinderBase=_dereq_('./JumpPointFinderBase');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there are no obstacles.
 */function JPFMoveDiagonallyIfNoObstacles(opt){JumpPointFinderBase.call(this,opt);}JPFMoveDiagonallyIfNoObstacles.prototype=new JumpPointFinderBase();JPFMoveDiagonallyIfNoObstacles.prototype.constructor=JPFMoveDiagonallyIfNoObstacles;/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */JPFMoveDiagonallyIfNoObstacles.prototype._jump=function(x,y,px,py){var grid=this.grid,dx=x-px,dy=y-py;if(!grid.isWalkableAt(x,y)){return null;}if(this.trackJumpRecursion===true){grid.getNodeAt(x,y).tested=true;}if(grid.getNodeAt(x,y)===this.endNode){return[x,y];}// check for forced neighbors
// along the diagonal
if(dx!==0&&dy!==0){// if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
// (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
// return [x, y];
// }
// when moving diagonally, must check for vertical/horizontal jump points
if(this._jump(x+dx,y,x,y)||this._jump(x,y+dy,x,y)){return[x,y];}}// horizontally/vertically
else{if(dx!==0){if(grid.isWalkableAt(x,y-1)&&!grid.isWalkableAt(x-dx,y-1)||grid.isWalkableAt(x,y+1)&&!grid.isWalkableAt(x-dx,y+1)){return[x,y];}}else if(dy!==0){if(grid.isWalkableAt(x-1,y)&&!grid.isWalkableAt(x-1,y-dy)||grid.isWalkableAt(x+1,y)&&!grid.isWalkableAt(x+1,y-dy)){return[x,y];}// When moving vertically, must check for horizontal jump points
// if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
// return [x, y];
// }
}}// moving diagonally, must make sure one of the vertical/horizontal
// neighbors is open to allow the path
if(grid.isWalkableAt(x+dx,y)&&grid.isWalkableAt(x,y+dy)){return this._jump(x+dx,y+dy,x,y);}else{return null;}};/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */JPFMoveDiagonallyIfNoObstacles.prototype._findNeighbors=function(node){var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px,py,nx,ny,dx,dy,neighbors=[],neighborNodes,neighborNode,i,l;// directed pruning: can ignore most neighbors, unless forced.
if(parent){px=parent.x;py=parent.y;// get the normalized direction of travel
dx=(x-px)/Math.max(Math.abs(x-px),1);dy=(y-py)/Math.max(Math.abs(y-py),1);// search diagonally
if(dx!==0&&dy!==0){if(grid.isWalkableAt(x,y+dy)){neighbors.push([x,y+dy]);}if(grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y]);}if(grid.isWalkableAt(x,y+dy)&&grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y+dy]);}}// search horizontally/vertically
else{var isNextWalkable;if(dx!==0){isNextWalkable=grid.isWalkableAt(x+dx,y);var isTopWalkable=grid.isWalkableAt(x,y+1);var isBottomWalkable=grid.isWalkableAt(x,y-1);if(isNextWalkable){neighbors.push([x+dx,y]);if(isTopWalkable){neighbors.push([x+dx,y+1]);}if(isBottomWalkable){neighbors.push([x+dx,y-1]);}}if(isTopWalkable){neighbors.push([x,y+1]);}if(isBottomWalkable){neighbors.push([x,y-1]);}}else if(dy!==0){isNextWalkable=grid.isWalkableAt(x,y+dy);var isRightWalkable=grid.isWalkableAt(x+1,y);var isLeftWalkable=grid.isWalkableAt(x-1,y);if(isNextWalkable){neighbors.push([x,y+dy]);if(isRightWalkable){neighbors.push([x+1,y+dy]);}if(isLeftWalkable){neighbors.push([x-1,y+dy]);}}if(isRightWalkable){neighbors.push([x+1,y]);}if(isLeftWalkable){neighbors.push([x-1,y]);}}}}// return all neighbors
else{neighborNodes=grid.getNeighbors(node,DiagonalMovement.OnlyWhenNoObstacles);for(i=0,l=neighborNodes.length;i<l;++i){neighborNode=neighborNodes[i];neighbors.push([neighborNode.x,neighborNode.y]);}}return neighbors;};module.exports=JPFMoveDiagonallyIfNoObstacles;},{"../core/DiagonalMovement":3,"./JumpPointFinderBase":23}],21:[function(_dereq_,module,exports){/**
 * @author imor / https://github.com/imor
 */var JumpPointFinderBase=_dereq_('./JumpPointFinderBase');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Path finder using the Jump Point Search algorithm allowing only horizontal
 * or vertical movements.
 */function JPFNeverMoveDiagonally(opt){JumpPointFinderBase.call(this,opt);}JPFNeverMoveDiagonally.prototype=new JumpPointFinderBase();JPFNeverMoveDiagonally.prototype.constructor=JPFNeverMoveDiagonally;/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */JPFNeverMoveDiagonally.prototype._jump=function(x,y,px,py){var grid=this.grid,dx=x-px,dy=y-py;if(!grid.isWalkableAt(x,y)){return null;}if(this.trackJumpRecursion===true){grid.getNodeAt(x,y).tested=true;}if(grid.getNodeAt(x,y)===this.endNode){return[x,y];}if(dx!==0){if(grid.isWalkableAt(x,y-1)&&!grid.isWalkableAt(x-dx,y-1)||grid.isWalkableAt(x,y+1)&&!grid.isWalkableAt(x-dx,y+1)){return[x,y];}}else if(dy!==0){if(grid.isWalkableAt(x-1,y)&&!grid.isWalkableAt(x-1,y-dy)||grid.isWalkableAt(x+1,y)&&!grid.isWalkableAt(x+1,y-dy)){return[x,y];}//When moving vertically, must check for horizontal jump points
if(this._jump(x+1,y,x,y)||this._jump(x-1,y,x,y)){return[x,y];}}else{throw new Error("Only horizontal and vertical movements are allowed");}return this._jump(x+dx,y+dy,x,y);};/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */JPFNeverMoveDiagonally.prototype._findNeighbors=function(node){var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px,py,nx,ny,dx,dy,neighbors=[],neighborNodes,neighborNode,i,l;// directed pruning: can ignore most neighbors, unless forced.
if(parent){px=parent.x;py=parent.y;// get the normalized direction of travel
dx=(x-px)/Math.max(Math.abs(x-px),1);dy=(y-py)/Math.max(Math.abs(y-py),1);if(dx!==0){if(grid.isWalkableAt(x,y-1)){neighbors.push([x,y-1]);}if(grid.isWalkableAt(x,y+1)){neighbors.push([x,y+1]);}if(grid.isWalkableAt(x+dx,y)){neighbors.push([x+dx,y]);}}else if(dy!==0){if(grid.isWalkableAt(x-1,y)){neighbors.push([x-1,y]);}if(grid.isWalkableAt(x+1,y)){neighbors.push([x+1,y]);}if(grid.isWalkableAt(x,y+dy)){neighbors.push([x,y+dy]);}}}// return all neighbors
else{neighborNodes=grid.getNeighbors(node,DiagonalMovement.Never);for(i=0,l=neighborNodes.length;i<l;++i){neighborNode=neighborNodes[i];neighbors.push([neighborNode.x,neighborNode.y]);}}return neighbors;};module.exports=JPFNeverMoveDiagonally;},{"../core/DiagonalMovement":3,"./JumpPointFinderBase":23}],22:[function(_dereq_,module,exports){/**
 * @author aniero / https://github.com/aniero
 */var DiagonalMovement=_dereq_('../core/DiagonalMovement');var JPFNeverMoveDiagonally=_dereq_('./JPFNeverMoveDiagonally');var JPFAlwaysMoveDiagonally=_dereq_('./JPFAlwaysMoveDiagonally');var JPFMoveDiagonallyIfNoObstacles=_dereq_('./JPFMoveDiagonallyIfNoObstacles');var JPFMoveDiagonallyIfAtMostOneObstacle=_dereq_('./JPFMoveDiagonallyIfAtMostOneObstacle');/**
 * Path finder using the Jump Point Search algorithm
 * @param {Object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {DiagonalMovement} opt.diagonalMovement Condition under which diagonal
 *      movement will be allowed.
 */function JumpPointFinder(opt){opt=opt||{};if(opt.diagonalMovement===DiagonalMovement.Never){return new JPFNeverMoveDiagonally(opt);}else if(opt.diagonalMovement===DiagonalMovement.Always){return new JPFAlwaysMoveDiagonally(opt);}else if(opt.diagonalMovement===DiagonalMovement.OnlyWhenNoObstacles){return new JPFMoveDiagonallyIfNoObstacles(opt);}else{return new JPFMoveDiagonallyIfAtMostOneObstacle(opt);}}module.exports=JumpPointFinder;},{"../core/DiagonalMovement":3,"./JPFAlwaysMoveDiagonally":18,"./JPFMoveDiagonallyIfAtMostOneObstacle":19,"./JPFMoveDiagonallyIfNoObstacles":20,"./JPFNeverMoveDiagonally":21}],23:[function(_dereq_,module,exports){/**
 * @author imor / https://github.com/imor
 */var Heap=_dereq_('heap');var Util=_dereq_('../core/Util');var Heuristic=_dereq_('../core/Heuristic');var DiagonalMovement=_dereq_('../core/DiagonalMovement');/**
 * Base class for the Jump Point Search algorithm
 * @param {object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */function JumpPointFinderBase(opt){opt=opt||{};this.heuristic=opt.heuristic||Heuristic.manhattan;this.trackJumpRecursion=opt.trackJumpRecursion||false;}/**
 * Find and return the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */JumpPointFinderBase.prototype.findPath=function(startX,startY,endX,endY,grid){var openList=this.openList=new Heap(function(nodeA,nodeB){return nodeA.f-nodeB.f;}),startNode=this.startNode=grid.getNodeAt(startX,startY),endNode=this.endNode=grid.getNodeAt(endX,endY),node;this.grid=grid;// set the `g` and `f` value of the start node to be 0
startNode.g=0;startNode.f=0;// push the start node into the open list
openList.push(startNode);startNode.opened=true;// while the open list is not empty
while(!openList.empty()){// pop the position of node which has the minimum `f` value.
node=openList.pop();node.closed=true;if(node===endNode){return Util.expandPath(Util.backtrace(endNode));}this._identifySuccessors(node);}// fail to find the path
return[];};/**
 * Identify successors for the given node. Runs a jump point search in the
 * direction of each available neighbor, adding any points found to the open
 * list.
 * @protected
 */JumpPointFinderBase.prototype._identifySuccessors=function(node){var grid=this.grid,heuristic=this.heuristic,openList=this.openList,endX=this.endNode.x,endY=this.endNode.y,neighbors,neighbor,jumpPoint,i,l,x=node.x,y=node.y,jx,jy,dx,dy,d,ng,jumpNode,abs=Math.abs,max=Math.max;neighbors=this._findNeighbors(node);for(i=0,l=neighbors.length;i<l;++i){neighbor=neighbors[i];jumpPoint=this._jump(neighbor[0],neighbor[1],x,y);if(jumpPoint){jx=jumpPoint[0];jy=jumpPoint[1];jumpNode=grid.getNodeAt(jx,jy);if(jumpNode.closed){continue;}// include distance, as parent may not be immediately adjacent:
d=Heuristic.octile(abs(jx-x),abs(jy-y));ng=node.g+d;// next `g` value
if(!jumpNode.opened||ng<jumpNode.g){jumpNode.g=ng;jumpNode.h=jumpNode.h||heuristic(abs(jx-endX),abs(jy-endY));jumpNode.f=jumpNode.g+jumpNode.h;jumpNode.parent=node;if(!jumpNode.opened){openList.push(jumpNode);jumpNode.opened=true;}else{openList.updateItem(jumpNode);}}}}};module.exports=JumpPointFinderBase;},{"../core/DiagonalMovement":3,"../core/Heuristic":5,"../core/Util":7,"heap":1}]},{},[8])(8);});(function(global){'use strict';// Helper function for dispatching cross browser dispatch events
// from http://youmightnotneedjquery.com/#trigger_custom
function dispatchEvent(el,eventName){var event;if(window.CustomEvent){event=new CustomEvent(eventName);}else{event=document.createEvent('CustomEvent');event.initCustomEvent(eventName,true,true);}el.dispatchEvent(event);}// Helper function to get all focusable children from a node
function getFocusableChildren(node){var focusableElements=['a[href]','area[href]','input:not([disabled])','select:not([disabled])','textarea:not([disabled])','button:not([disabled])','iframe','object','embed','[contenteditable]','[tabindex]:not([tabindex^="-"])'];return $$(focusableElements.join(','),node).filter(function(child){return!!(child.offsetWidth||child.offsetHeight||child.getClientRects().length);});}// Helper function to get all nodes in context matching selector as an array
function $$(selector,context){return Array.prototype.slice.call((context||document).querySelectorAll(selector));}// Helper function trapping the tab key inside a node
function trapTabKey(node,event){var focusableChildren=getFocusableChildren(node);var focusedItemIndex=focusableChildren.indexOf(document.activeElement);if(event.shiftKey&&focusedItemIndex===0){focusableChildren[focusableChildren.length-1].focus();event.preventDefault();}else if(!event.shiftKey&&focusedItemIndex===focusableChildren.length-1){focusableChildren[0].focus();event.preventDefault();}}// Helper function to focus first focusable item in node
function setFocusToFirstItem(node){var focusableChildren=getFocusableChildren(node);if(focusableChildren.length)focusableChildren[0].focus();}var focusedBeforeDialog;/**
   * A11yDialog constructor
   * @param {Node} node - Dialog element
   * @param {Node} main - Main element of the page
   */var A11yDialog=function A11yDialog(node,main){var namespace='data-a11y-dialog';var that=this;main=main||document.querySelector('#main');this.shown=false;this.show=show;this.hide=hide;$$('['+namespace+'-show="'+node.id+'"]').forEach(function(opener){opener.addEventListener('click',show);});$$('['+namespace+'-hide]',node).concat($$('['+namespace+'-hide="'+node.id+'"]')).forEach(function(closer){closer.addEventListener('click',hide);});document.addEventListener('keydown',function(event){if(that.shown&&event.which===27){event.preventDefault();hide();}if(that.shown&&event.which===9){trapTabKey(node,event);}});function maintainFocus(event){if(that.shown&&!node.contains(event.target)){setFocusToFirstItem(node);}}function show(){that.shown=true;node.removeAttribute('aria-hidden');main.setAttribute('aria-hidden','true');focusedBeforeDialog=document.activeElement;setFocusToFirstItem(node);document.body.addEventListener('focus',maintainFocus,true);dispatchEvent(node,'dialog:show');}function hide(){that.shown=false;node.setAttribute('aria-hidden','true');main.removeAttribute('aria-hidden');focusedBeforeDialog&&focusedBeforeDialog.focus();document.body.removeEventListener('focus',maintainFocus,true);dispatchEvent(node,'dialog:hide');}};if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=A11yDialog;}else if(typeof define==='function'&&define.amd){define('A11yDialog',[],function(){return A11yDialog;});}else if((typeof global==='undefined'?'undefined':_typeof(global))==='object'){global.A11yDialog=A11yDialog;}})(window);
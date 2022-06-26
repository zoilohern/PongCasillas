import { Game } from './src/game.js';

const config = {
    type: Phaser.AUTO,
    width: 500,
    height: 400,
    scene: [new Game(8,8)],
    physics:{
        default: 'arcade',
        arcade:{
            debug:false 
        }
    }
}

var game = new Phaser.Game(config);

console.log("game.loop._target = " + game.loop._target)
//game.loop._target = 1
console.log("game.loop._target = " + game.loop._target)





function mysimulation() {
  for (let i = 0; i < 100; i++) {
    window.requestAnimationFrame(function () { 
      game.simulate(delta);
    });   
  }

  if (game.simulating) {
    setTimeout(mysimulation, 0);
  }
}


let delta = 16.6;
document.getElementById("start_simulation").onclick = function() {
  game.simulating = true;
  console.log("STARTING SIMULATION");
  setTimeout(mysimulation, 0);

};

document.getElementById("stop_simulation").onclick = function() {
    game.simulating = false;
    console.log("STOPPING SIMULATION"); 
    game.stopSimulation()  
};

document.getElementById("change_player").onclick = function(){
    game.scene.getScene("game").controll();
};
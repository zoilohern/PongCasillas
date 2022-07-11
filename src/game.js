import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform.js";
import { Algoritmo } from "./components/algoritmopropio.js";
import { Controller } from "./components/controller.js";

export class Game extends Phaser.Scene{
    constructor(row,col){
        super({key: 'game'})
        this.row = row;
        this.col = col;
        this.impacthapp1 = false;
        this.impacthapp2 = false;
        this.simulating = false;
        this.restarting = false;
        this.controlling = false;
        this.winner = -1;
        }

    init(){
        this.algoritmo1 = new Algoritmo(this,this.row,this.col,3,1);
        this.algoritmo2 = new Algoritmo(this,this.row,this.col,3,2);
        this.ball = new Ball(this, this.physics.world.bounds.width/2, this.physics.world.bounds.height/2);
        this.player2 = new Platform(this,this.physics.world.bounds.width-10, this.physics.world.bounds.height /2);
        this.player1 = new Platform(this,10, this.physics.world.bounds.height /2)
    }

    preload(){
        this.load.image('platform', '../images/platform.png');
        this.load.image('ball', '../images/ball.png');
        this.load.image('paddle', '../images/paddle.png');
    }
    

    create(){
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ball.create();
        /*this.player1 = new Platform(this,this.physics.world.bounds.width - (this.ball.get().body.width / 2 + 1),this.physics.world.bounds.height / 2)
        this.player2 =  new Platform(this,this.ball.get().body.width / 2 + 1,this.physics.world.bounds.height / 2)*/
        this.player1.create();
        this.player2.create();
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.incrw = this.width/this.col;
        this.incrh = this.height/this.row;
        

        this.reward1 = 0;
        this.reward2 = 0;
        this.draw();

        console.log(this.getSituation());

        this.algoritmo1.create();
        this.algoritmo2.create();

        this.physics.add.collider(this.ball.get(), this.player1.get(), this.impact1, null, this);
        this.physics.add.collider(this.ball.get(), this.player2.get(), this.impact2, null, this);

        this.ball.setVelocities();


        this.cursors = this.input.keyboard.createCursorKeys();
        this.controller = new Controller(this,this.cursors);
        
        // timer para cambiar el tamaño del tablero pasado un tiempo
        //var timer = this.time.delayedCall(5000,this.tiempo,null,this)
        

    }

    tiempo(){
        this.scale.resize(800, 800);
        this.sys.game.canvas.width = 800
        this.sys.game.canvas.height = 800
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.incrw = this.width/this.col;
        this.incrh = this.height/this.row;
        this.graphics.destroy();
        this.draw();

    }

    controll(){
        console.log("LAHROA");
        this.controlling = !this.controlling;
    }

    update(){
        if(this.spaceKey.isDown && !this.pausado){
            this.scene.pause();
            this.pausado = true;
        }

        /*if(this.ball.get().body.y==0 && (Math.abs(this.ball.get().body.x-this.exito))<50){
            console.log("exito");
            this.algoritmo.exito();
        }

       /* if(this.ball.get().body.y>this.platform.get().body.y+20){
            this.reiniciar();
            this.premio = -100;
        }*/

        /*if(this.impacthapp1){
            //Para sustituir esto a lo mejor comprobar cuando este booleano es true y updetear respectivamente
            this.algoritmo1.addReward(50)
            this.impacthapp1 = false;
        }
        if(this.impacthapp2){
            this.algoritmo2.addReward(50)
            this.impacthapp2 = false;
        }*/

        if(this.ball.get().body.x < this.player1.get().body.x+5){
            //this.algoritmo1.addReward(-10000)
            //this.algoritmo2.addReward(100)
            this.restarting = true;
            this.winner = 2;
        }else if(this.ball.get().body.x>this.player2.get().body.x-5){
            //this.algoritmo1.addReward(100)
            //this.algoritmo2.addReward(-10000)
            this.restarting = true;
            this.winner = 1;
        }


        if(this.controlling){
            this.controller.update();
        }else{
            this.algoritmo1.aprendizaje(this.getSituation(),1);
        }
        this.player1.update();
        
        this.algoritmo2.aprendizaje(this.getSituation(),2);

        this.player2.update();
        
        if(this.restarting){
            this.restarting = false;
            this.winner = -1;
            this.restart();
        }


    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    impact1(){
        this.impacthapp1 = true;
        this.ball.impact();
    }

    impact2(){
        this.impacthapp2 = true;
        this.ball.impact();
    }

    restart(){
        this.ball.restart();
        this.algoritmo1.restart();
        this.algoritmo2.restart();
    }

    
    doAct(action,jug){
        if(jug==1){
            this.player1.changeAct(action);
        }else{
            this.player2.changeAct(action);
        }
        
    }


    //dadas las posiciones de la bola y la plataforma, devuelve un numero que representa la situacion en la que estamos
    getSituation(){
        let ball_vx = this.ball.get().body.velocity.x;
       if (ball_vx < 0) {
          ball_vx = -1;
       } else {
          ball_vx = 1
       }
       
       let ball_vy = this.ball.get().body.velocity.y;
       if (ball_vy < 0) {
          ball_vy = -1;
       } else {
          ball_vy = 1
       }       
       
       let res = "_" + this.ball.coordenadas()[0] + "_" + this.ball.coordenadas()[1] + "_" + this.player1.coordenada() + "_" + this.player2.coordenada() + "_" 
       + ball_vx + "_" + ball_vy;
       return res;
    }

    //Dibuja las lineas para poder representar 
    draw(){
        this.graphics = this.add.graphics()
        this.graphics.lineStyle(1, 0xff5000,1)
        for(var i = this.incrw; i<this.width; i= i + this.incrw){
            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i<this.height; i= i + this.incrh){
            this.graphics.lineBetween(0, i, this.width, i);
        }

        this.graphics.lineStyle(25, 0x1EFA08,2)
    }

    
}
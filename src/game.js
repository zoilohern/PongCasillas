import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform.js";
import { Algoritmo } from "./components/algoritmopropio.js";

export class Game extends Phaser.Scene{
    constructor(row,col){
        super({key: 'game'})
        this.row = row;
        this.col = col;
        this.impacthapp1 = false;
        this.impacthapp2 = false;
        this.simulating = false;
        this.restarting = false;
        
        }

    init(){
        this.algoritmo1 = new Algoritmo(this,this.row,this.col,3);
        this.algoritmo2 = new Algoritmo(this,this.row,this.col,3);
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
        this.dibujar();

        console.log(this.getSituation());

        this.algoritmo1.create();
        this.algoritmo2.create();

        this.physics.add.collider(this.ball.get(), this.player1.get(), this.impact1, null, this);
        this.physics.add.collider(this.ball.get(), this.player2.get(), this.impact2, null, this);

        this.ball.setVelocities();


        this.cursors = this.input.keyboard.createCursorKeys();
        var timer = this.time.delayedCall(5000,this.tiempo,null,this)
        

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
        this.dibujar();
0
    }

    prueba(){
        console.log("LAHROA");
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

        if(this.impacthapp1){
            this.algoritmo1.addReward(50)
            this.impacthapp1 = false;
        }
        if(this.impacthapp2){
            this.algoritmo2.addReward(50)
            this.impacthapp2 = false;
        }

        if(this.ball.get().body.x < this.player1.get().body.x+5){
            this.algoritmo1.addReward(-10000)
            this.algoritmo2.addReward(100)
            this.restarting = true;
        }else if(this.ball.get().body.x>this.player2.get().body.x-5){
            this.algoritmo1.addReward(100)
            this.algoritmo2.addReward(-10000)
            this.restarting = true;
        }


        /*this.player1.setVelocityY(0);
        this.player2.setVelocityY(0);*/ 

        if (this.cursors.up.isDown) {
            this.player1.setVelocityY(-350);
        } else if (this.cursors.down.isDown) {
            this.player1.setVelocityY(350);
        }
        //console.log(this.getSituacion())

        this.algoritmo1.aprendizaje(this.getSituation(),1);
        this.algoritmo2.aprendizaje(this.getSituation(),2);
        
        if(this.restarting){
            this.restarting = false;
            this.restart();
        }


    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    impact1(){
        this.impacthapp1 = true;
    }

    impact2(){
        this.impacthapp2 = true;
    }

    restart(){
        /*this.ball.x = 400;
        this.ball.y = 200;
        const initialXSpeed = Math.random() * 200 + 50;
        const initialYSpeed = Math.random() * 200 + 50;
        this.ball.setVelocityX(initialXSpeed);
        this.ball.setVelocityY(initialYSpeed);
        this.player1.x = 400;
        this.player2.x = 400*/
        this.ball.restart();
        this.algoritmo1.restart();
        this.algoritmo2.restart();
    }

    
    realizarAccion(action,jug){
        if(jug==1){
            if(action == 0){
                this.player1.setVelocityY(-350)
            }else if (action == 1){
                this.player1.setVelocityY(350)
            }else if (action == 2){
                this.player1.setVelocityY(0)
            }
        }else{
            if(action == 0){
                this.player2.setVelocityY(-350)
            }else if (action == 1){
                this.player2.setVelocityY(350)
            }else if (action == 2){
                this.player2.setVelocityY(0)
            }
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
    dibujar(){
        this.graphics = this.add.graphics()
        this.graphics.lineStyle(1, 0xff5000,1)
        for(var i = this.incrw; i<this.width; i= i + this.incrw){
            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i<this.height; i= i + this.incrh){
            this.graphics.lineBetween(0, i, this.width, i);
        }

        this.graphics.lineStyle(25, 0x1EFA08,2)

        
        /*if (this.exito<this.width/2){
            
        }else{
            this.graphics.lineBetween(this.exito-100, 0, this.exito, 0);
        }*/
        //this.graphics.lineBetween(this.exito-50, 0, this.exito+50, 0);
        


    }

    
}
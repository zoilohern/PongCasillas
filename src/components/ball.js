export class Ball{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.posx = posx;
        this.posy = posy;

    }

    create(){
        this.ball = this.relatedScene.physics.add.image(this.posx,this.posy,'ball');
        
        this.ball.tint = 0x00FFF77;
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
    }
        
    get(){
        return this.ball;   
    }

    setVelocityX(num){
        this.ball.setVelocityX(num);
    }

    setVelocityY(num){
        this.ball.setVelocityY(num);
    }

    setVelocities(){
        const initialXSpeed = (Math.random() * 500 + 50) * (this.randomTwo()); //450 / (Math.floor(Math.random() * 1000)) * this.randomTwo(); //* (this.randomTwo());
        const initialYSpeed = Math.random() * 300 + 200; //450;
        this.ball.setVelocityX(initialXSpeed);
        this.ball.setVelocityY(initialYSpeed);
    }

    restart(){
        this.ball.x = this.relatedScene.width/2;
        this.ball.y = this.relatedScene.height/5;
        this.setVelocities();
    }

    coordenadas(){
        let res = [Math.floor(this.ball.y/this.relatedScene.incrh), Math.floor(this.ball.x/this.relatedScene.incrw)]
        return res;
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    randomTwo(){
        let valor = this.getRndInteger(0,1);
        if(valor==0){
            console.log(-1);
            return -1;
        }else{
            console.log(1);
            return 1;
        }
    }

}
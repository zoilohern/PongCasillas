export class Ball{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.posx = posx;
        this.posy = posy;
        this.bounceInPlatform = false;

    }

    create(){
        this.sprite = this.relatedScene.physics.add.image(this.posx,this.posy,'ball');
        this.sprite.tint = 0x00FFF77;
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(1);
    }

    update(){
        if(this.bounceInPlatform){
            
        }
    }
        
    get(){
        return this.sprite;   
    }

    setVelocityX(num){
        this.sprite.setVelocityX(num);
    }

    setVelocityY(num){
        this.sprite.setVelocityY(num);
    }

    setVelocities(){
        const initialXSpeed = (Math.random() * 500 + 50) * (this.randomTwo()); //450 / (Math.floor(Math.random() * 1000)) * this.randomTwo(); //* (this.randomTwo());
        const initialYSpeed = Math.random() * 300 + 200; //450;
        this.sprite.setVelocityX(initialXSpeed);
        this.sprite.setVelocityY(initialYSpeed);
    }

    restart(){
        this.sprite.x = this.relatedScene.width/2;
        this.sprite.y = this.relatedScene.height/5;
        this.setVelocities();
    }

    impact(){
        this.bounceInPlatform = true;
    }

    coordenadas(){
        let res = [Math.floor(this.sprite.y/this.relatedScene.incrh), Math.floor(this.sprite.x/this.relatedScene.incrw)]
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
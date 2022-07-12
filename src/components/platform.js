export class Platform{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.posx = posx;
        this.posy = posy;
        this.action = -1;
        this.vel = 350;
        this.state1 = null;
        this.action1 = null;
        this.stepReward = 0;
        this.episodeReward = 0;
    }

    create(){
        this.sprite = this.relatedScene.physics.add.image(this.posx,this.posy,'paddle').setImmovable();
        this.sprite.setScale(.75)
        this.sprite.body.allowGravity = false;
        this.sprite.setCollideWorldBounds(true);
    }

    get(){
        return this.sprite;
    }

    getState(){
        return this.relatedScene.getSituation();
    }


    setVelocityY(num){
        this.sprite.body.setVelocityY(num);
    }

    coordenada(){
        return Math.floor(this.sprite.y/this.relatedScene.incrh)
    }

    update(){
        if(this.action == 0){
            this.setVelocityY(0)
        }else if(this.action == 1 ){
            this.setVelocityY(this.vel)
        }else if(this.action == 2){
            this.setVelocityY(-this.vel);
        }
        //console.log("ACCION ES  "+ this.action );
    }

    changeAct(act){
        this.action = act;
    }

}
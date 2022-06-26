export class Platform{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.posx = posx;
        this.posy = posy;
    }

    create(){
        this.platform = this.relatedScene.physics.add.image(this.posx,this.posy,'paddle').setImmovable();
        this.platform.setScale(.75)
        this.platform.body.allowGravity = false;
        this.platform.setCollideWorldBounds(true);
    }

    get(){
        return this.platform;
    }


    setVelocityY(num){
        this.platform.body.setVelocityY(num);
    }

    coordenada(){
        return Math.floor(this.platform.y/this.relatedScene.incrh)
    }

}
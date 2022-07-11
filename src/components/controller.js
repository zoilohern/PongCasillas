export class Controller{

    constructor(scene,cur){
        this.relatedScene = scene;
        this.cursors = cur;
    }

    update(){
        if(this.cursors.up.isDown){
            this.relatedScene.player1.changeAct(2)
        }else if (this.cursors.down.isDown){
            this.relatedScene.player1.changeAct(1)
        }else{
            this.relatedScene.player1.changeAct(0)
        }
    }
}
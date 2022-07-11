class QTable{
    constructor(numAcc){
        this.Q = {}
        this.alpha = 0.1
        this.gamma = 0.9
        this.nAcc = numAcc;
    }

    checkState(state){
        let exist = state in this.Q;
        if(!exist){
            this.Q[state] = new Array(this.nAcc).fill(0);
        }
    }

    getMaxAct(state){
        this.checkState(state);

        let actions = this.Q[state];
        let argmax = -1;
        let max = -999999999;

        //conseguir la accion con más posible premio
        //argmax = this.Q[state].indexOf(Math.max(...this.Q[state]));
        argmax = actions.indexOf(Math.max(...actions));
        //accion = Math.max.apply(null,this.q[estado]);
        return argmax;
    }

    getRandomAction(state){
        this.checkState(state);
        let acc = Math.floor(Math.random()*this.nAcc)
        return acc;
    }

    updateQTable(state, state2, reward, action, action2){
        this.checkState(state);
        this.checkState(state2);
        let predic = this.Q[state][action];

        let target = reward + this.gamma *this.Q[state2][action2];
        this.Q[state][action] = this.Q[state][action] + this.alpha * (target - predic);
    }

}



export class Algoritmo {

    constructor(scene,row,col,numAcc,id){

        this.relatedScene = scene
        this.nEpisodes = 0
        this.epsilon = 0.1;
        this.total_episodes = 10000
        this.max_steps = 100

        this.row = row;
        this.col = col;
        this.Q = new QTable(numAcc)
        this.rew = 0;
        this.id = id;

        var timer = scene.time.addEvent({
            delay: 5000,
            callback: this.tiempo,
            callbackScope: this,
            loop : true
        });

        this.total_reward = 0;
    }

    create(){
        this.lastState = -1;
        this.lastAction = -1;
        this.Q = new QTable(this.Q.nAcc)
    }

    tiempo(){
        console.log("tabla Q " + JSON.stringify(this.Q));  
    }

    restart(){
        console.log("END episode " + this.nEpisodes + " reward = " + this.total_reward);
        this.total_reward = 0;
        this.nEpisodes++;
    }

    elegir_Accion(state){
        var action = 0;
        if(Math.random()<this.epsilon){
            action = this.Q.getRandomAction(state)
        }else{
            action = this.Q.getMaxAct(state)
        }
        return action;
    }

    aprendizaje(state,jug){

        //comprobamos si ha habido impacto con nuestra plataforma
        if(this.id == 1 && this.relatedScene.impacthapp1){
            this.addReward(50);
            this.relatedScene.impacthapp1 = false;
        }else if(this.id == 2 && this.relatedScene.impacthapp2){
            this.addReward(50);
            this.relatedScene.impacthapp2 = false;
        }

        //comprobamos si hemos ganado o perdido
        if(this.id == this.relatedScene.winner){
            this.addReward(100);
        }else if (this.relatedScene.restarting){
            this.addReward(-10000);
        }

        if (state == this.lastState){
            return;
        }

        if(this.lastState == -1){
            this.lastState = state;
            this.lastAction = this.elegir_Accion(state);
        }else{
            let state2 = state;
            let action2 = this.elegir_Accion(state2);
            this.Q.updateQTable(this.lastState, state2, this.rew,this.lastAction,action2);
            this.lastState = state2;
            this.lastAction = action2;
        }

        this.relatedScene.doAct(this.lastAction,this.id);
        this.rew = 0;

    }

    addReward(r){
        this.rew+=r;
        this.total_reward +=this.rew;
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }


}
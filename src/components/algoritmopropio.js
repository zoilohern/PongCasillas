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
        let acc = Math.floor(Math.random*this.nAcc)
        return acc;
    }

    updateQTable(state, state2, recompensa, accion, accion2){
        this.checkState(state);
        this.checkState(state2);
        let predic = this.Q[state][accion];

        let target = recompensa + this.gamma *this.Q[state2][accion2];
        this.Q[state][accion] = this.Q[state][accion] + this.alpha * (target - predic);
    }

}



export class Algoritmo {

    constructor(scene,row,col,numAcc){

        this.relatedScene = scene
        this.nEpisodes = 0
        this.epsilon = 0.1;
        this.total_episodes = 10000
        this.max_steps = 100

        this.row = row;
        this.col = col;
        this.Q = new QTable(numAcc)
        this.rew = 0;

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
        var accion = 0;
        if(Math.random()<this.epsilon){
            accion = this.Q.getRandomAction(state)
        }else{
            accion = this.Q.getMaxAct(state)
        }
        return accion;
    }

    aprendizaje(state,jug){
        if (state == this.lastState){
            return;
        }

        if(this.lastState == -1){
            this.lastState = state;
            this.lastAction = this.elegir_Accion(state);
        }else{
            let state2 = state;
            let action2 = this.elegir_Accion(state2);
            this.Q.updateQTable(this.lastState, state2, this.rew,this.lastAction,this.lastState);
            this.lastState = state2;
            this.lastAction = action2;
        }

        this.relatedScene.realizarAccion(this.lastAction,jug);

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
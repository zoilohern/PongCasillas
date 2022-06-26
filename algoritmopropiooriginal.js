class QTable{
    constructor(numAcc){
        this.Q = {}
        this.alpha = 0.1
        this.gamma = 0.9
        this.nAcc = numAcc;
    }

    comprEstado(estado){
        let existe = state in this.Q;
        if(!existe){
            this.Q[state] = new Array(this.nAcc).fill(0);
        }
    }

    getAccMax(estado){
        this.comprEstado(estado);

        let actions = this.Q[estado];
        let argmax = -1;
        let max = -999999999;

        //conseguir la accion con más posible premio
        argmax = this.Q[estado].indexOf(Math.max(...this.Q[estado]));
        //accion = Math.max.apply(null,this.q[estado]);
        return argmax;
    }

    getAccRan(estado){
        this.comprEstado(estado);
        let acc = Math.floor(Math.random*this.nAcc)
        return acc;
    }

    updateQTable(estado, estad2, recompensa, accion, accion2){
        this.comprEstado(estado);
        this.comprEstado(estado2);
        let predic = this.Q[estado][accion];

        let target = recompensa + this.gamma *this.Q[estado2][accion2];
        this.Q[estado][accion] = this.Q[estado][accion] + this.alpha * (target - predic);
    }

}



export class Algoritmo {

    constructor(scene,fil,col,numAcc){

        this.relatedScene = scene
        this.nEpisodios = 0
        this.epsilon = 0.1;
        this.total_episodios = 10000
        this.max_steps = 100

        this.fil = fil;
        this.col = col;
        this.Q = new QTable(numAcc)
        this.rew = 0;

        var timer = scene.timeaddEvent({
            delay: 5000,
            callback: this.tiempo,
            callbackScope: this,
            loop : true
        });

        this.total_reward = 0;
    }

    create(){
        this.ultEstado = -1;
        this.ultAccion = -1;
        this.Q = new QTable(this.Q.nAcc)
    }

    tiempo(){
        console.log("tabla Q " + JSON.stringify(this.Q));  
    }

    reiniciar(){
        console.log("END episode " + this.nEpisodios + " reward = " + this.total_reward);
        this.total_reward = 0;
        this.nEpisodios++;
    }

    elegir_Accion(estado){
        var accion = 0;
        if(Math.random()<this.epsilon){
            accion = this.Q.getAccRan(estado)
        }else{
            accion = this.Q.getAccMax(estado)
        }
        return accion;
    }

    aprendizaje(estado,jug){
        if (estado == this.ultEstado){
            return;
        }

        if(this.ultEstado == -1){
            this.ultEstado = estado;
            this.ultAccion = this.elegir_Accion(estado);
        }else{
            let estado2 = estado;
            let accion2 = this.elegir_Accion(estado2);
            this.Q.updateQTable(this.ultEstado, estado2, this.rew,this.ultAccion,this.ultEstado);
            this.ultEstado = estado2;
            this.ultAccion = accion2;
        }

        this.relatedScene.realizarAccion(this.ultAccion,jug);

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
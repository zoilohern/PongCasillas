class QTable {
    constructor(nActions) {  
      this.Q = {};
      this.alpha = 0.1
      this.gamma = 0.9
      this.nActions = nActions;
    }
    
    _checkState(state) {
      let exists = state in this.Q;
      if (!exists) {
        this.Q[state] = new Array(this.nActions).fill(0);
      }       
    }
    
    getMaxAction(state) {
      this._checkState(state);
      
      let actions = this.Q[state];
      let argmax = -1;
      let max = -99999999;
      for (let i = 0; i < actions.length; i++) {
        if (actions[i] > max) {
          max = actions[i];
          argmax = i;
        }
      }
      return argmax;    
    }
    
    getRandomAction(state) {
      this._checkState(state);  
      let index = Math.floor(Math.random() * this.nActions);
      return index;
    }  
  
    updateQTable(estado, estado2, recompensa, accion, accion2){
        this._checkState(estado);
        this._checkState(estado2);
        var predic = this.Q[estado][accion];
        //console.log("...estado = " + estado)      
        //console.log("...estado2 = " + estado2)      
        //console.log("...recompensa = " + recompensa)      
        //console.log("...accion = " + accion)      
        //console.log("...accion2 = " + accion2)
        //console.log("...this.gamma = " + this.gamma)      
        var target = recompensa + this.gamma * this.Q[estado2][accion2];
        //console.log("target = " + target)
        this.Q[estado][accion] = this.Q[estado][accion] + this.alpha * (target - predic);
  
    }
  }

export class Algoritmo {

    constructor(scene,fil,col,nActions){
        this.relatedScene = scene;
        this.nEpisode = 0;
        this.epsilon = 0.1
        this.total_episodes = 10000
        this.max_steps = 100

        this.fil = fil;
        this.col = col;
        this.Q = new QTable(nActions)
        this.rew = 0;
        //var timer = scene.time.delayedCall(10000, this.tiempo,null, this);
        var timer = scene.time.addEvent({
            delay: 5000,                // ms
            callback: this.tiempo,
            //args: [],
            callbackScope: this,
            loop: true
        });

        this.total_reward = 0;
    }

    create(){
        this.ultEstado = -1;
        this.ultAccion = -1;
        this.Q = new QTable(this.Q.nActions)
    }

    tiempo(){
        console.log(this.Q);
    }


    reiniciar(){
        console.log("END episode = " + this.nEpisode + " reward = " + this.total_reward);
        this.total_reward = 0;
        this.nEpisode += 1; 

    }

    //Metodos algoritmo
    elegir_Accion(estado){
        var accion = 0;
        if(Math.random()<this.epsilon){
           // accion = this.getRndInteger(0,2);
            accion = this.Q.getRandomAction(estado);
        }else{
            accion = this.Q.getMaxAction(estado);
            //accion = this.Q[estado].indexOf(Math.max(...this.Q[estado]));
            //accion = Math.max.apply(null,this.q[estado]);
        }
        return accion;
    }

   /* actualizarTabla(estado,estado2,recompensa,accion,accion2){
        var predic = this.Q[estado][accion];
        var target = recompensa + this.gamma * this.Q[estado2][accion2];
        this.Q[estado][accion] = this.Q[estado][accion] + this.alpha * (target - predic);

    }

    /*aprendizaje(estado){
        var res = 0;
        for(let i = 0; i<this.total_episodes; i++){
            var t = 0;
            this.relatedScene.reiniciar();
            var estadoInicial = this.getSituacion();
            accion1 = this.elegir_Accion(estadoInicial)

            while(t<this.max_steps){

            }
        }
    }*/

    aprendizaje(estadoActual,jug){
        if (estadoActual == this.ultEstado) {
            this.accion2 = this.ultAccion;
            return
          }
  
          if(this.ultEstado == -1){
              this.ultEstado = estadoActual;
              this.ultAccion = this.elegir_Accion(this.ultEstado);
              
          }else{
              let estado2 = estadoActual;
              let accion2 = this.elegir_Accion(estado2);
              this.Q.updateQTable(this.ultEstado, estado2, this.rew, this.ultAccion, accion2);
              this.ultEstado = estado2;
              this.ultAccion = accion2;
             // console.log("SE TOMAN DECISIONES")
          }
          //console.log("SE hace " + this.ultAccion);
          this.relatedScene.realizarAccion(this.ultAccion,jug);
          //Reset reward after applying it 
          this.rew = 0;
  
      

    }

    addReward(reward){
        this.rew += reward;
        this.total_reward +=this.rew;
    }
    

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}
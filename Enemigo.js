class Enemigo{
    enemigo;
    prota;
    vida = 3;
    pantalla;
    dimencionesPantalla;
    cont=0;
    proyectiles;
    accionActiva = null;
    posProta;
    constructor(proyectiles,prota){
        this.prota = prota;
        this.posProta=prota.prota.getBoundingClientRect();
        this.proyectiles = proyectiles;
        this.pantalla = document.getElementById('contenedor');
        this.dimencionesPantalla = this.pantalla.getBoundingClientRect()
        
        this.aparecer()
    }

    aparecer(){
        this.enemigo = document.createElement("div")
        this.enemigo.classList.add('enemigo');
        this.enemigo.classList.add('enemigoEstar');
        this.pantalla.appendChild(this.enemigo);
        this.enemigo.style.left =this.dimencionesPantalla.width -70 + 'px';
        this.enemigo.style.top = Math.floor(Math.random() * 600)  + 200 + 'px';
        
        
        this.comportamiento()
        this.atacar();
    }
    recibirDanio(daño){
        this.vida -=daño;
    }
    estaMuerto(){
        if(this.vida<=0)
            return true;

        return false;
    }
    setPosProta(posProta){
        this.posProta = posProta;
    }
    morir(){
        
            this.detenerAccion()
        
        this.enemigo.classList.add('muerteEnemigo');
    }
    comportamiento(){
        
            if (this.enemigo.parentNode === this.pantalla && this.estado().left <= 0  ) {
                // Si el enemigo ya está fuera de la pantalla, se elimina
                this.pantalla.removeChild(this.enemigo);

            }

            // Enemigo avanza
            
            this.mover();

            // Ataque después de un tiempo
            if(this.enemigo.parentNode === this.pantalla){
            this.accionActiva = setTimeout(() => {
                this.atacar();
                this.enemigo.classList.replace('enemigoCorrer', 'enemigoEstar'); // Cambia al estado quieto tras atacar
                this.accionActiva = setTimeout(() => {
                    // Después de esperar un poco, vuelve a moverse y repite el ciclo
                    
                        this.comportamiento();
                }, 1000); // Enemigo se queda quieto por 1 segundo (puedes cambiar el tiempo)
            }, 2000); // Ataque después de avanzar por 2 segundos
            }
        
    }
       
        
           
          //Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.
        

    
    estado(){
        
        return this.enemigo.getBoundingClientRect()
    }
    mover(){
        
        this.accionActiva = setTimeout(()=>{
            
            
            this.enemigo.classList.replace('enemigoEstar', 'enemigoCorrer');
            
            this.enemigo.style.left = this.enemigo.offsetLeft - 300 +'px';
            
        },300)

        this.enemigo.addEventListener('animationend',()=>{
            this.enemigo.classList.replace('enemigoCorrer','enemigoEstar')
            this.comportamiento();
            })
    }
    atacar(){
      if(!this.estaMuerto()){
        new proyectilEnemigo(this.estado(),"proyectilEnemigo",20,-100,1,this.proyectiles,this.prota,this.prota.prota.getBoundingClientRect());
        new proyectilEnemigo(this.estado(),"proyectilEnemigo",20,-10,1,this.proyectiles,this.prota,this.prota.prota.getBoundingClientRect());
        
        
        
      }
    }

    detenerAccion(){
        
        if(this.accionActiva){
        clearTimeout(this.accionActiva);
        }
        this.enemigo.classList.remove('enemigoCorrer', 'enemigoEstar');
    }
    
}
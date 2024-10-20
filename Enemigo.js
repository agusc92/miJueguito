class Enemigo{
    enemigo;
    prota;
    vida ;
    pantalla;
    dimencionesPantalla;
    cont=0;
    proyectiles;
    accionActiva = null;
    posProta;
    spryteQuieto;
    spryteMovimiento;
    spryteAtaque;
    spryteMuerto;
    spryteEnemigo;
    constructor(proyectiles,prota,spryteEnemigo,spryteQuieto,spryteMovimiento,spryteMuerto,vida){
        this.spryteEnemigo = spryteEnemigo;
        this.spryteQuieto=spryteQuieto;
        this.spryteMovimiento = spryteMovimiento;
        this.spryteMuerto = spryteMuerto;
        this.prota = prota;
        this.posProta=prota.estado();
        this.proyectiles = proyectiles;
        this.pantalla = document.getElementById('contenedor');
        this.dimencionesPantalla = this.pantalla.getBoundingClientRect()
        this.vida = vida;
        this.aparecer()
        //this.atacar();
    }

    aparecer(){
        this.enemigo = document.createElement("div")
        this.enemigo.classList.add(this.spryteEnemigo);
        this.enemigo.classList.add(this.spryteQuieto);
        this.pantalla.appendChild(this.enemigo);
        this.enemigo.style.left =this.dimencionesPantalla.width -70 + 'px';
        this.enemigo.style.top = Math.floor(Math.random() * 600)  + 200 + 'px';
        
        
        this.comportamiento()
        
        
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
        
        this.enemigo.classList.add(this.spryteMuerto);
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
                this.enemigo.classList.replace(this.spryteMovimiento, this.spryteQuieto); // Cambia al estado quieto tras atacar
                this.accionActiva = setTimeout(() => {
                    // Después de esperar un poco, vuelve a moverse y repite el ciclo
                    
                        this.comportamiento();
                }, 1000); // Enemigo se queda quieto por 1 segundo 
            }, 2000); // Ataque después de avanzar por 2 segundos
            }
        
    }
       
        
           
          //Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.
        

    
    estado(){
        
        return this.enemigo.getBoundingClientRect()
    }
    mover(){
        
        this.accionActiva = setTimeout(()=>{
            
            
            this.enemigo.classList.replace(this.spryteQuieto, this.spryteMovimiento);
            
            this.enemigo.style.left = this.enemigo.offsetLeft - 300 +'px';
            
        },300)

        this.enemigo.addEventListener('animationend',()=>{
            this.enemigo.classList.replace(this.spryteMovimiento,this.spryteQuieto)
            this.comportamiento();
            })
    }
    atacar(){
      if(!this.estaMuerto()){
        new proyectilEnemigo(this.estado(),"proyectilEnemigo",20,-100,1,this.proyectiles,this.prota,this.prota.estado());
        new proyectilEnemigo(this.estado(),"proyectilEnemigo",20,-10,1,this.proyectiles,this.prota,this.prota.estado());
        
        
        
      }
    }
    obtenerElemento(){
        return this.enemigo;
    }
    detenerAccion(){
        
        if(this.accionActiva){
        clearTimeout(this.accionActiva);
        }
        this.enemigo.classList.remove(this.spryteMovimiento, this.spryteQuieto);
    }

    obtenerVidas(){
        return this.vida
    }
    
}
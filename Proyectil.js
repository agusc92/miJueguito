class Proyectil{
    tirador;
    pantalla= document.getElementById('contenedor');
    proyectil;
    velocidadX=0;
    
    alcanceMaximo;
    danio;
    constructor(tirador,apariencia,aparicionX,aparicionY,daño){
        
        this.danio = daño
        this.tirador = tirador;
        //guardo la poscicion del tirdor.
        
        //creo el contenedor para el proyectil
        this.proyectil = document.createElement("div")
        //le agrego la clase que le da los estilos e introduzco el proyectil en el juego
        this.pantalla.appendChild(this.proyectil)
        this.proyectil.classList.add(apariencia);
          this.aparicion(aparicionX,aparicionY)
        this.comportamiento()
    }
    aparicion(aparicionX,aparicionY){
        this.proyectil.style.top =this.tirador.top +(this.tirador.height+aparicionY) + 'px';

        this.proyectil.style.left =this.tirador.left +(this.tirador.width+aparicionX) + 'px';
    }
    comportamiento(){ 
        //uso la posicion del tirador para posicionar el proyectil.     
        
       
    }
    
    avanzar(){
    }
    getDanio(){
        return this.danio;
    }
    estado(){
        return this.proyectil.getBoundingClientRect()
    }
    obtenerElemento(){
        return this.proyectil;
    }
}
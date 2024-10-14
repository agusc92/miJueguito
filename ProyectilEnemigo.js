class proyectilEnemigo extends Proyectil{
    direccion;
    proyectiles;
    prota;
    posicionProta;
    distanciaY;
    limiteInferior;
    limiteSuperior;
    constructor(tirador,apariencia,aparicionX,aparicionY,danio,proyectiles,prota,posicionProta){
        super(tirador,apariencia,aparicionX,aparicionY,danio);
        this.prota=prota;
        this.proyectiles = proyectiles;
        this.proyectiles.push(this);
       this.posicionProta = posicionProta;
       this.limiteInferior = this.posicionProta.bottom +300;
       this.limiteSuperior = this.posicionProta.top -300;
        this.avanzar();
    }
    avanzar(){
        
        // Obtener la posición actual del proyectil

    let distanciaX = this.proyectil.offsetLeft; // Desde la izquierda
    let distanciaY = Math.floor(Math.random() * (this.limiteInferior - this.limiteSuperior + 1)) + this.limiteSuperior;
    
    // Definir la velocidad deseada (en píxeles por segundo)
    let velocidadPxPorSegundo =400;
    
    // Calcular la distancia total horizontal (hasta el borde izquierdo de la pantalla)
    let distanciaARecorrerX = distanciaX; // Desde la posición actual hasta el borde izquierdo
    
    // Calcular la distancia total vertical (hasta el objetivo en Y)
    let distanciaARecorrerY = distanciaY;

    // Calcular el tiempo necesario para recorrer la distancia horizontal y vertical
    let tiempoDeTransicionX = distanciaARecorrerX / velocidadPxPorSegundo;
    let tiempoDeTransicionY = distanciaARecorrerY / velocidadPxPorSegundo;

    // Usar el mayor tiempo de transición para que ambas transiciones sean consistentes
    let tiempoDeTransicion = Math.max(tiempoDeTransicionX, tiempoDeTransicionY);
    
    // Aplicar la duración de la transición al CSS (tiempo constante)
    this.proyectil.style.transitionDuration = `${tiempoDeTransicion}s`;
    
    // Mover el proyectil a la izquierda de la pantalla y ajustar la posición en el eje 'y'
    this.proyectil.style.left = '0px'; // Mover a la izquierda (hasta el borde de la pantalla)
    this.proyectil.style.top = distanciaY+ 'px'; // Mover en el eje Y hacia el objetivo

    // Eliminar el proyectil cuando llegue al borde izquierdo
    this.proyectil.addEventListener('transitionend', () => {
        if (this.proyectil && this.proyectil.parentNode === this.pantalla) {
            this.eliminarProyectil();
        }
    });
    }

    impacta(){
        const rectProyectil = this.proyectil.getBoundingClientRect();
        const rectProta = this.prota.estado();

    // Comparar las posiciones para detectar colisión
        if (
            rectProyectil.left < rectProta.right -50&&
            rectProyectil.right > rectProta.left +80&&
            rectProyectil.top < rectProta.bottom -80&&
            rectProyectil.bottom > rectProta.top +80
        ) {
            this.prota.recibirDanio(this.danio);
            
           this.eliminarProyectil()
        
            return true;
    }
    
    return false;
    }
    eliminarProyectil(){
        let indice = this.proyectiles.indexOf(this)
        this.proyectiles.splice(indice,1);
        this.pantalla.removeChild(this.proyectil);
    }
}
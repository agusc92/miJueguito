class ProyectilProtagonista extends Proyectil{
    inclinacion;
    constructor(tirador,apariencia,aparicionX,aparicionY,danio,inclinacion){
        super(tirador,apariencia,aparicionX,aparicionY,danio,0);
        this.inclinacion = inclinacion;
        this.avanzar();
    }
    avanzar(){
        let distanciaX = this.proyectil.offsetLeft;

        // Definir la velocidad de desplazamiento (por ejemplo, 800px/s)
        let velocidadPxPorSegundo = 900;

        // Calcular el tiempo que tardará en alcanzar el límite derecho de la pantalla
        let distanciaARecorrer = window.innerWidth - distanciaX;
        let tiempoDeTransicion = distanciaARecorrer / velocidadPxPorSegundo;

        // Aplicar la duración de la transición al CSS
        this.proyectil.style.transitionDuration = `${tiempoDeTransicion}s`;

        // Mover el proyectil hacia el borde derecho de la pantalla
        this.proyectil.style.left = `${window.innerWidth}px`;
       
        this.proyectil.style.top = `${this.proyectil.offsetTop + this.inclinacion}px`

        // Eliminar el proyectil cuando llegue al borde derecho
        this.proyectil.addEventListener('transitionend', () => {
            if (this.proyectil && this.proyectil.parentNode === this.pantalla) {
                this.proyectil.remove();
            }
    })
}
     
}
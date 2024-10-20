
class ProyectilHijo extends proyectilEnemigo {
    constructor(tirador, apariencia, aparicionX, aparicionY, danio, proyectiles, prota, angulo) {
        super(tirador, apariencia, aparicionX, aparicionY, danio, proyectiles, prota, prota.estado());
        this.proyectiles = proyectiles;
        this.prota = prota;
        this.angulo = angulo;
        this.avanzar();  // Comienza el movimiento del proyectil hijo
        
    }

    avanzar() {
        let velocidad = 4; // Velocidad de los proyectiles
        let radianes = this.angulo * (Math.PI / 180); // Convertir ángulo a radianes para el movimiento
        let interval = setInterval(() => {
            this.proyectil.style.left = `${this.proyectil.offsetLeft - Math.cos(radianes) * velocidad}px`;
            this.proyectil.style.top = `${this.proyectil.offsetTop + Math.sin(radianes) * velocidad}px`;
    
            // Imprimir la posición actual
            
    
            // Comprobar si el proyectil está fuera de la pantalla
            if (this.proyectil.offsetLeft < 0 || this.proyectil.offsetLeft > window.innerWidth || 
                this.proyectil.offsetTop < 0 || this.proyectil.offsetTop > window.innerHeight) {
                this.eliminarProyectil();
                clearInterval(interval);
            }
        }, 16);
    }
    aparicion(aparicionX, aparicionY) {
        this.proyectil.classList.add('perdigon')
        this.proyectil.style.top = `${aparicionY}px`;  // Aplicar la posición Y
        this.proyectil.style.left = `${aparicionX}px`;  // Aplicar la posición X
    }
}


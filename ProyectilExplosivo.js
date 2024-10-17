
class ProyectilExplosivo extends proyectilEnemigo {
    constructor(tirador, apariencia, aparicionX, aparicionY, danio, proyectiles, prota, numeroDeHijos) {
        super(tirador, apariencia, aparicionX, aparicionY, danio, proyectiles, prota, prota.estado());
        this.numeroDeHijos = numeroDeHijos; // Número de proyectiles hijos a generar
        this.velocidad = 3; // Velocidad del proyectil explosivo
        this.avanzar(); // Comienza a moverse
    }

    avanzar() {
        let interval = setInterval(() => {
            // Mover el proyectil hacia la izquierda
            this.proyectil.style.left = `${this.proyectil.offsetLeft - this.velocidad}px`;

            // Comprobar si el proyectil ha salido de la pantalla o ha impactado algo
            if (this.proyectil.offsetLeft < 500) {
                this.explotar(); // Explota al salir de la pantalla
                clearInterval(interval); // Detener el movimiento
            }

            // Lógica de impacto con el protagonista (si necesitas)
            if (this.impacta()) {
                clearInterval(interval); // Detener el movimiento si impacta al protagonista
                this.explotar(); // Explota al impactar
            }
        }, 16);
    }

    explotar() {
        if (!this.proyectil || !this.proyectil.parentNode) {
            return; // No hacer nada si ya no existe
        }
        // Ajusta los ángulos inicial y final
        const anguloInicial = 0; // o el ángulo que desees
        const anguloFinal = -360; // o el ángulo que desees
        const anguloIncremento = (anguloFinal - anguloInicial) / (this.numeroDeHijos - 1);// Incremento del ángulo por cada hijo
    
        for (let i = 0; i < this.numeroDeHijos; i++) {
            const angulo = anguloInicial + i * anguloIncremento; // Calcular el ángulo para cada hijo
            
            // Posición de explosión basada en el proyectil explosivo
            const aparicionX = this.proyectil.offsetLeft; // Usar la posición del proyectil explosivo
            const aparicionY = this.proyectil.offsetTop; // Usar la posición del proyectil explosivo
            
            
            // Crear nuevo proyectil hijo en la posición correcta
            this.proyectiles.push(new ProyectilHijo(this.estado(), "proyectilExplosivo", aparicionX, aparicionY, this.danio / 2, this.proyectiles, this.prota, angulo));
        }
    
        this.eliminarProyectil(); // Eliminar el proyectil explosivo
    }

}

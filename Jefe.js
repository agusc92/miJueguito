class Jefe extends Enemigo {
    constructor(proyectiles, prota, spryteEnemigo, spryteQuieto, spryteMovimiento, spryteMuerto,vida) {
        super(proyectiles, prota, spryteEnemigo, spryteQuieto, spryteMovimiento, spryteMuerto,vida);
    }

    mover() {
        // Obtenemos las dimensiones de la pantalla
        const pantallaWidth = window.innerWidth;
        const pantallaHeight = window.innerHeight;
        
        // Máximo avance hacia la izquierda, 50% del ancho de la pantalla
        const limiteIzquierdo = pantallaWidth * 0.5;
        
        // Definimos los límites del jefe
        const limiteSuperior = 200;
        const limiteInferior = pantallaHeight - this.enemigo.offsetHeight -200;

        // Valores aleatorios para la dirección (izquierda-derecha y arriba-abajo)
        const randomX = Math.random() * 200 - 100;  // Movimiento horizontal (-100 a 100 píxeles)
        const randomY = Math.random() * 200 - 100;  // Movimiento vertical (-100 a 100 píxeles)

        // Nueva posición potencial
        let nuevaPosX = this.enemigo.offsetLeft + randomX;
        let nuevaPosY = this.enemigo.offsetTop + randomY;

        // Limitar la posición dentro de los bordes de la pantalla
        if (nuevaPosX < limiteIzquierdo) nuevaPosX = limiteIzquierdo;
        if (nuevaPosX > pantallaWidth - this.enemigo.offsetWidth) nuevaPosX = pantallaWidth - this.enemigo.offsetWidth;
        if (nuevaPosY < limiteSuperior) nuevaPosY = limiteSuperior;
        if (nuevaPosY > limiteInferior) nuevaPosY = limiteInferior;

        // Actualizamos la posición del jefe en la pantalla
        this.enemigo.style.left = nuevaPosX + 'px';
        this.enemigo.style.top = nuevaPosY + 'px';

        // Cambiamos el sprite del jefe para reflejar que está en movimiento
        this.enemigo.classList.replace(this.spryteQuieto, this.spryteMovimiento);

        // Cuando termine la animación de movimiento, vuelve a quieto y reinicia el ciclo
        this.enemigo.addEventListener('animationend', () => {
            this.enemigo.classList.replace(this.spryteMovimiento, this.spryteQuieto);
            this.comportamiento();  // Repetir el ciclo de movimiento y ataque
        });
    }
    atacar(){
                if (!this.estaMuerto()&& !this.prota.estaMuerto()) {
                    // Ataque en abanico (como antes)
                    const anguloInicial = -60;
                    const anguloFinal = 60;
                    const numeroDeProyectiles = 8;
                    const anguloIncremento = (anguloFinal - anguloInicial) / (numeroDeProyectiles - 1);
            
                    for (let i = 0; i < numeroDeProyectiles; i++) {
                        const angulo = anguloInicial + i * anguloIncremento;
                       this.proyectiles.push( new proyectilEnemigo(this.estado(), "ataque1", 50, angulo, 2, this.proyectiles, this.prota, this.prota.estado()));
                       
                    }
        
                    setTimeout(() => {
                        this.proyectiles.push(new ProyectilExplosivo(this.estado(), "proyectilExplosivo", 50, 0, 2, this.proyectiles, this.prota,10));
                    }, 2000); 
                }
            }
}
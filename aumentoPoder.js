class AumentoPoder {
    pantalla; // Referencia al contenedor principal donde se mostrará el aumento de poder
    dimencionesPantalla; // Dimensiones del contenedor
    aumentoPoder; // Elemento que representa el aumento de poder

    constructor() {
        // Inicializa el contenedor y sus dimensiones
        this.pantalla = document.getElementById('contenedor');
        this.dimencionesPantalla = this.pantalla.getBoundingClientRect();

        // Crea el elemento visual para el aumento de poder y le asigna una clase CSS
        this.aumentoPoder = document.createElement("div");
        this.aumentoPoder.classList.add('aumentoPoder');
    }

    aparecer() {
        // Posiciona el aumento de poder en una posición aleatoria verticalmente
        this.aumentoPoder.style.top = Math.floor(Math.random() * 501) + 'px';
        // Coloca el aumento de poder en el borde derecho del contenedor
        this.aumentoPoder.style.left = this.dimencionesPantalla.width - 70 + 'px';
        // Agrega el aumento de poder al contenedor
        this.pantalla.appendChild(this.aumentoPoder);
        
        // Elimina el aumento de poder del contenedor una vez que termina la animación
        this.aumentoPoder.addEventListener('animationend', () => {
            if (this.pantalla.contains(this.aumentoPoder)) // Verifica si todavía está en el contenedor
                this.pantalla.removeChild(this.aumentoPoder); // Elimina el elemento
        });
    }

    esAgarrado(prota) {
        // Obtiene las dimensiones del aumento de poder y del protagonista
        let aumentoPoderRect = this.aumentoPoder.getBoundingClientRect();
        let rectProta = prota.prota.getBoundingClientRect();

        // Compara las posiciones para detectar si el protagonista ha "agarrado" el aumento de poder
        if (
            aumentoPoderRect.left < rectProta.right - 50 && 
            aumentoPoderRect.right > rectProta.left + 80 && 
            aumentoPoderRect.top < rectProta.bottom - 80 && 
            aumentoPoderRect.bottom > rectProta.top + 80 
        ) {
            // Si hay colisión, elimina el aumento de poder del contenedor
            this.pantalla.removeChild(this.aumentoPoder);
            // Llama al método para aumentar el poder del protagonista
            prota.aumentarPoder();
            return true; // Indica que el aumento de poder fue recogido
        } else {
            return false; // No hay colisión
        }
    }
}
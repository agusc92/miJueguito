class Protagonista{
    vida = 3;
    prota;
    pantalla;
    posicionActualX ;
    posicionActualY ;
    poderAumentado;
    daniado = false;
    constructor(elementoProta){
        this.proyectiles = [];
        this.pantalla = document.getElementById('contenedor');
        this.prota = elementoProta;
        this.posicionActualX = this.prota.offsetLeft;
        this.posicionActualY = this.prota.offsetTop;

        this.prota.classList.remove('morirProta');
        this.prota.classList.add('mover');
        
        this.poderAumentado = false;
    }

    mover(teclasPresionadas){
        if(this.vida >0){
        if (teclasPresionadas['w'] && prota.posicionActualY > -20) {
            prota.actualizarPosicion({ x: 0, y: -10 });
        }
        if (teclasPresionadas['s'] && prota.posicionActualY < window.innerHeight - 150) {
            prota.actualizarPosicion({ x: 0, y: 10 });
        }
        if (teclasPresionadas['a'] && prota.posicionActualX > -30) {
            prota.actualizarPosicion({ x: -10, y: 0 });
        }
        if (teclasPresionadas['d'] && prota.posicionActualX < window.innerWidth - 150) {
            prota.actualizarPosicion({ x: 10, y: 0 });
        }
        }
    }

    actualizarPosicion(movimiento){
        
            this.posicionActualX+= movimiento.x;
        
        
            this.posicionActualY+= movimiento.y
        
        
        const x = this.prota.style.top =this.posicionActualY+"px";
        const y = this.prota.style.left = this.posicionActualX+"px";
    }
    estado(){
        return this.prota.getBoundingClientRect();
    }
    atacar(){
        //agrego el sprite de ataque y lo quito cuando concluye la animacion
        let arProyectiles=[];
        this.prota.classList.add('atacar');
        this.prota.addEventListener('animationend',()=>{
            this.prota.classList.remove('atacar');
        })
        //al proyectil le paso la posicion y el tamnaño del tirador, para poder posicionarlo
        if(this.poderAumentado){
        arProyectiles.push(new ProyectilProtagonista(this.estado(),"proyectil",-20,-110,1,0));
        arProyectiles.push(new ProyectilProtagonista(this.estado(),"proyectil",-20,-110,1,200));
        arProyectiles.push( new ProyectilProtagonista(this.estado(),"proyectil",-20,-110,1,-200));
        }else{
            arProyectiles.push(new ProyectilProtagonista(this.estado(),"proyectil",-20,-110,1,0));
        }
        
        return arProyectiles;
    }

    recibirDanio(danio) {
        // Verifica si el protagonista ya ha sido dañado recientemente
        if (this.daniado) {
            // Si ya está dañado, no hace nada
        } else {
            // Agrega la clase que indica que el protagonista ha recibido daño
            this.prota.classList.add('daniado');
            this.daniado = true; // Marca que el protagonista está dañado
            this.vida -= danio; // Reduce la vida del protagonista por el daño recibido
    
            // Si la vida del protagonista llega a cero o menos, ejecuta la función de morir
            if (this.vida <= 0) {
                this.morir();
            }
    
            // Después de 1500ms (1.5 segundos), restaura el estado de "dañado" y quita la clase visual
            setTimeout(() => {
                this.daniado = false; // Restablece el estado de "dañado"
                this.prota.classList.remove('daniado'); // Elimina la clase visual de daño
            }, 1500);
        }
    }
    
    morir() {
        // Elimina las clases de ataque y movimiento, si las tiene
        this.prota.classList.remove('atacar', 'mover');
        // Agrega la clase que inicia la animación de muerte
        this.prota.classList.add('morirProta');
    }
    
    estaMuerto() {
        // Retorna verdadero si la vida del protagonista es cero o menor
        return this.vida <= 0;
    }
    
    getVida() {
        // Retorna la cantidad actual de vida del protagonista
        return this.vida;
    }
    
    aumentarPoder() {
        // Agrega la clase que indica que el poder del protagonista ha aumentado
        this.prota.classList.add('poderAumentado');
        this.poderAumentado = true; // Marca que el poder ha aumentado
    
        // Después de 4000ms (4 segundos), restaura el estado de "poder aumentado" y quita la clase visual
        setTimeout(() => {
            this.poderAumentado = false; // Restablece el estado de "poder aumentado"
            this.prota.classList.remove('poderAumentado'); // Elimina la clase visual de aumento de poder
        }, 4000);
    }
    
    obtenerElemento() {
        // Retorna el elemento del protagonista
        return this.prota;
    }
}
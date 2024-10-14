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

    recibirDanio(danio){
        if(this.daniado){

        }else{
            this.prota.classList.add('daniado');
            this.daniado = true;
            this.vida -=danio;
        if(this.vida<=0){
            this.morir();
        }
        setTimeout(()=>{this.daniado = false;
            this.prota.classList.remove('daniado');
        },1500);
        }
        
    }
    morir(){
        this.prota.classList.remove('atacar','mover');
        this.prota.classList.add('morirProta');
    }
    estaVivo(){
        return this.vida>0;
    }
    getVida(){
        return this.vida;
    }

    aumentarPoder(){
        this.prota.classList.add('poderAumentado');
        this.poderAumentado = true;
        setTimeout(()=>{this.poderAumentado = false
            this.prota.classList.remove('poderAumentado');
        },4000)
    }
    obtenerElemento(){
        return this.prota;
    }
}
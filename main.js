let prota ;
let animacionProta ;
let posicionActualX ;
let posicionActualY ;
const pantalla = document.getElementById('contenedor');
let btnIniciar = document.getElementById('iniciar');
let btnReintentar = document.getElementById('reintentar');
pantalla.classList.add('displayNone');
let pantallaInicio = document.getElementById('pantallaInicio');
let elementoTiempo ;
let elementoPuntaje ;
let vidas ;
let pantallaDerrota = document.getElementById('finDelJuego');
pantallaDerrota.classList.add('displayNone');
let areaJuego ;
let puntaje ;
let tiempo ;
let en_juego ;
let enemigos;
let protaDaniado;
let proyectilesProta;
let proyectilesEnemigo;
let teclasPresionadas;
let coolddownEnemigo;
let cooldownDisparo;
let tiempoCooldown;
let dificultad ;
let aumentoPoder ;
let cooldownAumentoPoder;
let cronometro;
let loopJuego;
let intervaloDisparo =null;
const puntajeFinal = document.getElementById('puntajeFinal');
const tiempoFinal= document.getElementById('tiempoFinal');
const enemigosMatados = document.getElementById('enemigosMatados');
const btnVolverInicio = document.getElementById('volverInicio');
let contadorMatados=0;
// Manejar eventos de tecla presionada (keydown)
btnIniciar.addEventListener('click',iniciarJuego)
btnReintentar.addEventListener('click',()=>{iniciarJuego()})
btnVolverInicio.addEventListener('click',()=>{volverInicio()})


function iniciarJuego(){
    asignarValoresIniciales()
    document.addEventListener('keydown', manejarKeydown);
    document.addEventListener('keyup',manejarKeyup);
    
    cronometro = setInterval(() => {
        tiempo++;
        elementoTiempo.innerText = `Tiempo: ${tiempo}s`;
    
        if(tiempo % 10 == 0){
            dificultad ++;
           
        }
    },1000)
    intervaloEnemigo = setInterval(()=>{
        coolddownEnemigo = true;
        
    },4000);
    
    
    
    loopJuego = requestAnimationFrame(gameLoop)
}

    


function manejarKeyup(e){
    teclasPresionadas[e.key] = false;
}
function manejarKeydown(e){
    teclasPresionadas[e.key] = true;
}
function aparecerEnemigo(){
    if(coolddownEnemigo){
        let cont =dificultad;
    while(cont>0){
        let enemigo = new Enemigo(proyectilesEnemigo,prota);
        enemigos.push(enemigo);
        cont--;
    }
    
    
    
    
    coolddownEnemigo = false;
    }
    
}

// setTimeout(()=>{iniciarJuego()},8000)
function gameLoop(){//gameLoop//////////////////////////////////////////////////
    
    
    if (teclasPresionadas[' '] && !cooldownDisparo ) {
        proyectilesProta = [...proyectilesProta, ...prota.atacar()];
        cooldownDisparo = true;
        
    }
    prota.mover(teclasPresionadas);
    
    
    eliminarProyectilProta();
    
    impactoProta()
    impactarProta();
    aparecerEnemigo();
    enemigoHuye();
    crearAumentoPoder();
    if (prota.estaVivo()) {
        // Ejecuta la función cada 16.67ms (60 veces por segundo) para lograr 60 FPS
        setTimeout(gameLoop, 16.67); 
    }else{
        finDelJuego();
    }
}

function impactoProta() {
    proyectilesProta.forEach((pr,iPr) => {
        enemigos.forEach((en, index) => {
            if (pr.estado().left < en.estado().right &&
                pr.estado().right > en.estado().left &&
                pr.estado().top < en.estado().bottom &&
                pr.estado().bottom > en.estado().top) {

                // Si hay colisión, eliminar el enemigo
                en.recibirDanio(pr.getDanio())
                
                if(en.estaMuerto()){
                    puntaje+=10;
                elementoPuntaje.innerText = ''+puntaje;
                    en.morir()
                    eliminarEnemigo(index);
                    contadorMatados +=1;
                }
                eliminarProyectil(iPr);
            }
        });
    });
}

    

function eliminarEnemigo(index) {
    let en = enemigos[index];
    if (en && en.obtenerElemento()) {
        if (en.obtenerElemento().parentNode === pantalla) {
            
            en.enemigo.addEventListener('animationend',()=>{
                pantalla.removeChild(en.obtenerElemento());
            })
            
        }

        enemigos.splice(index, 1);
    }
}
function eliminarProyectil(index) {
    let pr = proyectilesProta[index];
    if (pr && pr.obtenerElemento()) {
        if (pr.obtenerElemento().parentNode === pantalla) {
            pantalla.removeChild(pr.obtenerElemento());
        }
        proyectilesProta.splice(index, 1);
    }
}

function enemigoHuye(){
    for (let i = enemigos.length - 1; i >= 0; i--) {
        let en = enemigos[i];
        en.setPosProta(prota.estado());
        if (en) {
            let enemigoPosition = en.estado().left;

            // Eliminar enemigo si está fuera de la pantalla
            if (enemigoPosition <= 0) {
                if (en.obtenerElemento() && en.obtenerElemento().parentNode === pantalla) {
                    pantalla.removeChild(en.obtenerElemento());
                }
                enemigos.splice(i, 1);
            }
        }
    }
}
function impactarProta(){
    proyectilesEnemigo.forEach(pr=>{
        if(pr.impacta()) 
            vidas.innerText = 'vidas: ' + prota.getVida();
    })
}

function eliminarProyectilProta(){
    if (proyectilesProta.length > 0) {
        // Recorre el array de proyectiles de forma inversa
        for (let i = proyectilesProta.length - 1; i >= 0; i--) {
            let pr = proyectilesProta[i];
            
            // Verificamos si el proyectil existe y si ha salido de la pantalla
            if (pr && pr.obtenerElemento()) {
                let proyectilPosition = pr.estado().left;

                // Si el proyectil ha salido del área visible (derecha) o está en el borde izquierdo
                if (proyectilPosition >= pantalla.offsetWidth || proyectilPosition <= 0) {
                    // Elimina el proyectil del DOM y del array
                    if (pr.obtenerElemento().parentNode === pantalla) {
                        pantalla.removeChild(pr.obtenerElemento());
                    }
                    proyectilesProta.splice(i, 1);
                }
            }
        }
    }
    
    
    
}
function crearAumentoPoder(){
    if(tiempo % 8 == 0&& !cooldownAumentoPoder && tiempo > 0){
        aumentoPoder.aparecer();
    cooldownAumentoPoder = true
    aumentoPoder.aumentoPoder.addEventListener('animationend',()=>{
        cooldownAumentoPoder = false
    })
    }
    if(aumentoPoder.esAgarrado(prota)){
        
        cooldownAumentoPoder = false
    }
}

function finDelJuego(){
    cancelAnimationFrame(loopJuego)
    clearInterval(cronometro);
    clearInterval(intervaloDisparo);
    clearInterval(intervaloEnemigo);
    
    document.removeEventListener('keyup', manejarKeyup);
    document.removeEventListener('keydown', manejarKeydown);
    limpiarEscenario()
    setTimeout(()=>{
        
        pantalla.classList.add('displayNone')
        pantallaDerrota.classList.remove('displayNone');
        puntajeFinal.innerText = 'Puntaje: '+puntaje;
        tiempoFinal.innerText = 'Tiempo jugado: '+ tiempo +'s';
        enemigosMatados.innerText = 'Enemigos matados: '+ contadorMatados;
        contadorMatados = 0;
    },3900)

    
    
}

function asignarValoresIniciales(){
    pantalla.classList.remove('displayNone');
    pantallaDerrota.classList.add('displayNone');
    pantallaInicio.classList.add('displayNone');
    puntaje = 0;
    tiempo = 0;
    en_juego = true;
    enemigos=[];
    protaDaniado= false;
    proyectilesProta=[];
    proyectilesEnemigo=[];
    teclasPresionadas = {};
    coolddownEnemigo = false;
    cooldownDisparo=false;
    tiempoCooldown=500;
    dificultad = 1;
    cooldownAumentoPoder = false;
    prota = new Protagonista(document.getElementById('personaje')) ;
    prota.obtenerElemento().classList.add('mover')
    animacionProta = document.getElementById('animacionPersonaje');
    posicionActualX = prota.offsetLeft;
    posicionActualY = prota.offsetTop;
    
    elementoTiempo = document.getElementById('cronometro');
    elementoTiempo.innerText = tiempo;
    elementoPuntaje = document.getElementById('puntaje');
    vidas = document.getElementById('vidas');
    
    areaJuego = document.getElementById('juego');
    
    elementoPuntaje.innerText = '00';
    vidas.innerText = 'vidas: ' + prota.getVida()
    aumentoPoder = new AumentoPoder();
    document.addEventListener('keydown', (e) => {
    
        
        
    });
    intervaloDisparo = setInterval(()=>{
        cooldownDisparo = false;
    },tiempoCooldown)
}
function derrota(){
    
}
function limpiarEscenario() {
    // Limpiar proyectiles del protagonista
    proyectilesProta.forEach(pr => {
        if (pr.obtenerElemento() && pr.obtenerElemento().parentNode === pantalla) {
            pantalla.removeChild(pr.obtenerElemento());
        }
    });
    proyectilesProta = [];

    // Limpiar proyectiles enemigos
    proyectilesEnemigo.forEach(pr => {
        
            pr.proyectil.remove();
        
    });
    proyectilesEnemigo = [];

    // Limpiar enemigos
    enemigos.forEach(en => {
        if (en.obtenerElemento() && en.obtenerElemento().parentNode === pantalla) {
            pantalla.removeChild(en.obtenerElemento());
        }
    });
    enemigos = [];
}
function volverInicio(){
    pantallaDerrota.classList.add('displayNone');
    pantallaInicio.classList.remove('displayNone');
}
//Proyectil.js:36 Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node

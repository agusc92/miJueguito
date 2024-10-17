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
let jefe=null;
let proyectilesJefe;
let jefeEnjuego = false;
let intervaloEnemigo;
let vidaEnemigo = 3;
let vidaJefe = 35;
let sonidoActual;
let btnSonido = document.getElementById('botonSonido');
// Manejar eventos de tecla presionada (keydown)
btnIniciar.addEventListener('click',iniciarJuego)
btnReintentar.addEventListener('click',()=>{iniciarJuego()})
btnVolverInicio.addEventListener('click',()=>{volverInicio()})

btnSonido.addEventListener('click',()=>{
    reproducirSonidoMenu()
})


function iniciarJuego() {
    reproducirSonidoNivel()
    // Limpiar cualquier intervalo o animación anterior
    if (cronometro) clearInterval(cronometro);
    if (intervaloDisparo) clearInterval(intervaloDisparo);
    if (intervaloEnemigo) clearInterval(intervaloEnemigo);  

    if (loopJuego) cancelAnimationFrame(loopJuego);
    
    // Remover eventos anteriores (si estaban configurados)
    

    // Asignar valores iniciales
    asignarValoresIniciales();

    // Volver a añadir los eventos de teclado
    document.addEventListener('keydown', manejarKeydown);
    document.addEventListener('keyup', manejarKeyup);

    // Iniciar cronómetro del juego
    cronometro = setInterval(() => {
        tiempo++;
        elementoTiempo.innerText = `Tiempo: ${tiempo}s`;

        if (tiempo % 15 == 0) {
            dificultad++;
        }
    }, 1000);

    // Intervalo para enemigos
     intervaloEnemigo = setInterval(() => {
        coolddownEnemigo = true;
    }, 3000);

    // **Reiniciar el intervalo de disparo correctamente**:
    intervaloDisparo = setInterval(() => {
        cooldownDisparo = false;
    }, tiempoCooldown);

    // Iniciar el loop del juego
    loopJuego = requestAnimationFrame(gameLoop);
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
        let enemigo = new Enemigo(proyectilesEnemigo,prota,'enemigo','enemigoEstar','enemigoCorrer','muerteEnemigo',vidaEnemigo);
        enemigos.push(enemigo);
        cont--;
    }
    
    
    
    
    coolddownEnemigo = false;
    }
    
}


function gameLoop(){//gameLoop//////////////////////////////////////////////////
    
    
    if (teclasPresionadas[' '] && !cooldownDisparo ) {
        proyectilesProta = [...proyectilesProta, ...prota.atacar()];
        cooldownDisparo = true;
        
    }
    prota.mover(teclasPresionadas);
    
    
    eliminarProyectilProta();
    if(!jefeEnjuego && !jefe){
        aparecerEnemigo();
        enemigoHuye();
    }
    impactoProta()
    impactarProta();
    
   
    
    crearAumentoPoder();
    if (!prota.estaMuerto()) {
        // Ejecuta la función cada 16.67ms (60 veces por segundo) para lograr 60 FPS
        loopJuego = requestAnimationFrame(gameLoop);
    }else{
        finDelJuego();
    }
}

function colisionar(objeto1, objeto2) {
    return (
        objeto1.left < objeto2.right - (objeto2.width * 0.25) &&
        objeto1.right > objeto2.left &&
        objeto1.top < objeto2.bottom - (objeto2.height * 0.25) &&
        objeto1.bottom > objeto2.top + (objeto2.height * 0.25)
    );
}

function impactoProta() {
    proyectilesProta.forEach((pr, iPr) => {
        enemigos.forEach((en, index) => {
            if (colisionar(pr.estado(), en.estado())) {
                console.log("Colisión con enemigo:", en);
                en.recibirDanio(pr.getDanio());
                
                if (en.estaMuerto()) {
                    puntaje += 10;
                    elementoPuntaje.innerText = puntaje;
                    if (!jefe && puntaje >= 150) {
                        aparecerJefe();
                    }
                    en.morir();
                    eliminarEnemigo(index);
                    contadorMatados += 1;
                }
                eliminarProyectil(iPr, proyectilesProta);
            }
        });
    });

    // Comprobar colisión con el jefe
    if (jefe) {
        proyectilesProta.forEach((pr, iPr) => {
            if (colisionar(pr.estado(), jefe.estado())) {
                console.log("Colisión con jefe:", jefe);
                jefe.recibirDanio(pr.getDanio());
                
                if (jefe.estaMuerto()) {
                    // Eliminar jefe si está muerto
                    jefe.morir();
                    jefeEnjuego = false;  // Jefe ha sido derrotado
                    finDelJuego();  // Fin del juego o lo que quieras hacer
                }
                eliminarProyectil(iPr, proyectilesProta);
            }
        });
    }
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
function eliminarProyectil(index,arreglo) {
    let pr = arreglo[index];
    if (pr && pr.obtenerElemento()) {
        if (pr.obtenerElemento().parentNode === pantalla) {
            pantalla.removeChild(pr.obtenerElemento());
        }
        arreglo.splice(index, 1);
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
                   eliminarProyectil(i,proyectilesProta)
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
    reproducirSonidofinal();
    cancelAnimationFrame(loopJuego)
    clearInterval(cronometro);
    clearInterval(intervaloDisparo);
    clearInterval(intervaloEnemigo);
    
    
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
function aparecerJefe(){
    if (jefe && jefe.estaMuerto() && jefeEnjuego) {
        
        jefeEnjuego = false;
        jefe.morir();  // Ejecuta la animación de muerte
        finDelJuego();
    }

    // Si el jefe aún no ha aparecido y el puntaje es suficiente, crearlo
    if (!jefeEnjuego && !jefe) {  // Verificación clara de que no hay jefe activo
        limpiarEscenario();
        jefe = new Jefe(proyectilesEnemigo, prota, 'jefe', 'jefeQuieto', 'jefeMover', 'jefeMuerto', vidaJefe);
        reproducirSonidoJefe();
        jefeEnjuego = true;
    }}

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
    proyectilesJefe = [];
    jefe = null;
    jefeEnjuego=false;
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
        pr.eliminarProyectil();
            
        
    });
    proyectilesEnemigo = [];

    // Limpiar enemigos
    if(!jefe){
    enemigos.forEach(en => {
        if (en.obtenerElemento() && en.obtenerElemento().parentNode === pantalla) {
            pantalla.removeChild(en.obtenerElemento());
        }
    });
    enemigos = [];
    }else{
        setTimeout(()=>{pantalla.removeChild(jefe.obtenerElemento());
            puntaje +=100;
            enemigos = [];},3900)
            
        
        
    }
}
function volverInicio(){
    reproducirSonidoMenu()
    pantallaDerrota.classList.add('displayNone');
    pantallaInicio.classList.remove('displayNone');
}
function reproducirSonidoMenu() {
    if(sonidoActual)
        sonidoActual.pause()
    sonidoActual = document.getElementById('sonidoMenu');
    sonidoActual.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoActual.volume = 0.5;
    sonidoActual.play();
    
}
function reproducirSonidoNivel() {
    if(sonidoActual)
        sonidoActual.pause()
    sonidoActual = document.getElementById('sonidoNivel');
    sonidoActual.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoActual.volume = 0.5;
    sonidoActual.play();
    
}

function reproducirSonidoJefe() {
    if(sonidoActual)
        sonidoActual.pause()
    sonidoActual = document.getElementById('sonidoJefe');
    sonidoActual.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoActual.volume = 0.5;
    sonidoActual.play();
    
}
function reproducirSonidofinal() {
    if(sonidoActual)
        sonidoActual.pause()
    sonidoActual = document.getElementById('sonidoFinal');
    sonidoActual.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoActual.volume = 0.5;
    sonidoActual.play();
    
}


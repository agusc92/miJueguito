//captura de elementos del dom
const pantalla = document.getElementById('contenedor');
let btnIniciar = document.getElementById('iniciar');
let btnReintentar = document.getElementById('reintentar');
let pantallaInicio = document.getElementById('pantallaInicio');
let pantallaDerrota = document.getElementById('finDelJuego');
const puntajeFinal = document.getElementById('puntajeFinal');
const tiempoFinal= document.getElementById('tiempoFinal');
const enemigosMatados = document.getElementById('enemigosMatados');
const btnVolverInicio = document.getElementById('volverInicio');
let btnSonido = document.getElementById('botonSonido');

//Creacion de variables necesarias
let prota ;
let animacionProta ;
let posicionActualX ;
let posicionActualY ;

pantalla.classList.add('displayNone');

let elementoTiempo ;
let elementoPuntaje ;
let vidas ;

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

let contadorMatados=0;
let jefe=null;
let proyectilesJefe;
let jefeEnjuego = false;
let intervaloEnemigo;
let vidaEnemigo = 3;
let vidaJefe = 35;
let sonidoActual;

//captura eventos de presion de teclas
document.addEventListener('keydown', manejarKeydown);
document.addEventListener('keyup', manejarKeyup);

//captura de precion de botones en los menus de inicio y de fin
btnIniciar.addEventListener('click',iniciarJuego)
btnReintentar.addEventListener('click',()=>{iniciarJuego()})
btnVolverInicio.addEventListener('click',()=>{volverInicio()})

btnSonido.addEventListener('click',()=>{
    reproducirSonidoMenu()
})

//inicializacon de variables, intervalos y gameloop
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
    


// Función para manejar cuando se suelta una tecla
function manejarKeyup(e) {
    teclasPresionadas[e.key] = false;  // Marca la tecla correspondiente como no presionada en el objeto teclasPresionadas
}

// Función para manejar cuando se presiona una tecla
function manejarKeydown(e) {
    teclasPresionadas[e.key] = true;  // Marca la tecla correspondiente como presionada en el objeto teclasPresionadas
}

// Función para hacer aparecer nuevos enemigos en el juego
function aparecerEnemigo() {
    // Solo ejecuta la aparición de enemigos si el cooldown está activo (es decir, se ha alcanzado el tiempo adecuado para generar enemigos)
    if (coolddownEnemigo) {
        let cont = dificultad;  // La cantidad de enemigos que aparecerán está relacionada con el nivel de dificultad
        // Bucle para crear múltiples enemigos según el nivel de dificultad
        while (cont > 0) {
            // Crea un nuevo enemigo con sus parámetros (proyectiles, protagonista, animaciones y vida)
            let enemigo = new Enemigo(proyectilesEnemigo, prota, 'enemigo', 'enemigoEstar', 'enemigoCorrer', 'muerteEnemigo', vidaEnemigo);
            enemigos.push(enemigo);  // Añade el nuevo enemigo al array de enemigos
            cont--;  // Decrementa el contador para controlar cuántos enemigos se han creado
        }
        // Resetea el cooldown para que no se generen más enemigos hasta que se cumplan nuevamente las condiciones del cooldown
        coolddownEnemigo = false;
    }
}


// Función principal del bucle del juego (game loop)
function gameLoop() {

    // Si la barra espaciadora está presionada y el cooldown de disparo no está activo
    if (teclasPresionadas[' '] && !cooldownDisparo) {
        // El protagonista ataca y los proyectiles resultantes se añaden al array de proyectiles
        proyectilesProta = [...proyectilesProta, ...prota.atacar()];
        // Activa el cooldown de disparo para evitar disparos continuos
        cooldownDisparo = true;
    }

    // Mueve al protagonista basado en las teclas presionadas
    prota.mover(teclasPresionadas);

    // Elimina los proyectiles del protagonista que han salido de la pantalla o han impactado
    eliminarProyectilProta();

    // Si el jefe aún no ha aparecido ni está en juego, aparecen enemigos normales
    if (!jefeEnjuego && !jefe) {
        aparecerEnemigo();  // Crea nuevos enemigos en el juego
        enemigoHuye();  // Lógica para que ciertos enemigos huyan o se comporten de manera especial
    }

    // Comprueba si los proyectiles del protagonista impactan a los enemigos
    impactoProta();

    // Comprueba si el protagonista es impactado por enemigos o sus proyectiles
    impactarProta();

    // Crea un aumento de poder en el juego (probablemente un objeto que el jugador puede recoger para mejorar)
    crearAumentoPoder();

    // Si el protagonista no ha muerto, sigue el ciclo del juego
    if (!prota.estaMuerto()) {
        // Llama a `gameLoop` de nuevo en el siguiente frame (~16.67ms para lograr 60 FPS)
        loopJuego = requestAnimationFrame(gameLoop);
    } else {
        // Si el protagonista está muerto, termina el juego
        finDelJuego();
    }
}

// Función para verificar si dos objetos colisionan entre sí
function colisionar(objeto1, objeto2) {
    return (
        // Comprueba si el borde izquierdo de `objeto1` está a la izquierda del borde derecho de `objeto2`
        // Restando una cuarta parte del ancho de `objeto2` para ajustar la precisión de la colisión
        objeto1.left < objeto2.right - (objeto2.width * 0.25) &&
        
        // Comprueba si el borde derecho de `objeto1` está a la derecha del borde izquierdo de `objeto2`
        objeto1.right > objeto2.left &&
        
        // Comprueba si el borde superior de `objeto1` está por encima del borde inferior de `objeto2`
        
        objeto1.top < objeto2.bottom - (objeto2.height * 0.25) &&
        
        // Comprueba si el borde inferior de `objeto1` está por debajo del borde superior de `objeto2`
        
        objeto1.bottom > objeto2.top + (objeto2.height * 0.25)
    );
}

// Función para gestionar el impacto de los proyectiles del protagonista en los enemigos y el jefe
function impactoProta() {
    
    // Itera sobre los proyectiles del protagonista
    proyectilesProta.forEach((pr, iPr) => {
        
        // Recorre la lista de enemigos para verificar colisiones con cada proyectil
        enemigos.forEach((en, index) => {
            
            // Si hay colisión entre el proyectil y un enemigo
            if (colisionar(pr.estado(), en.estado())) {
                
                // El enemigo recibe daño del proyectil
                en.recibirDanio(pr.getDanio());
                
                // Si el enemigo muere tras recibir daño
                if (en.estaMuerto()) {
                    
                    // Incrementa el puntaje
                    puntaje += 10;
                    elementoPuntaje.innerText = puntaje; // Actualiza la interfaz con el nuevo puntaje
                    
                    // Si el jefe no ha aparecido y se alcanza el puntaje requerido, se invoca al jefe
                    if (!jefe && puntaje >= 150) {
                        aparecerJefe();
                    }
                    
                    // Ejecuta la animación o lógica de muerte del enemigo
                    en.morir();
                    
                    // Elimina el enemigo del juego
                    eliminarEnemigo(index);
                    
                    // Incrementa el contador de enemigos eliminados
                    contadorMatados += 1;
                }
                
                // Elimina el proyectil que impactó contra el enemigo
                eliminarProyectil(iPr, proyectilesProta);
            }
        });
    });

    // Verifica colisión con el jefe, si está presente en el juego
    if (jefe) {
        
        // Itera sobre los proyectiles del protagonista
        proyectilesProta.forEach((pr, iPr) => {
            
            // Si hay colisión entre el proyectil y el jefe
            if (colisionar(pr.estado(), jefe.estado())) {
                
                // El jefe recibe daño del proyectil
                jefe.recibirDanio(pr.getDanio());
                
                // Si el jefe muere tras recibir daño
                if (jefe.estaMuerto()) {
                    
                    // Ejecuta la animación o lógica de muerte del jefe
                    jefe.morir();
                    
                    // Marca que el jefe ya no está en el juego
                    jefeEnjuego = false;
                    
                    // Finaliza el juego o ejecuta la lógica de fin de juego
                    finDelJuego();
                }
                
                // Elimina el proyectil que impactó contra el jefe
                eliminarProyectil(iPr, proyectilesProta);
            }
        });
    }
}

    

// Función para eliminar un enemigo de la lista de enemigos y del DOM
function eliminarEnemigo(index) {
    
    // Obtiene el enemigo de la lista en la posición indicada por 'index'
    let en = enemigos[index];
    
    // Si el enemigo existe y tiene un elemento asociado en el DOM
    if (en && en.obtenerElemento()) {
        
        // Verifica si el elemento enemigo está dentro del contenedor 'pantalla'
        if (en.obtenerElemento().parentNode === pantalla) {
            
            // Añade un listener para que elimine el enemigo del DOM una vez que la animación de muerte termine
            en.enemigo.addEventListener('animationend', () => {
                pantalla.removeChild(en.obtenerElemento());  // Elimina el enemigo del DOM
            });
        }

        // Elimina el enemigo del array de enemigos
        enemigos.splice(index, 1);
    }
}

// Función para eliminar un proyectil de un arreglo y del DOM
function eliminarProyectil(index, arreglo) {
    
    // Obtiene el proyectil de la lista en la posición indicada por 'index'
    let pr = arreglo[index];
    
    // Si el proyectil existe y tiene un elemento asociado en el DOM
    if (pr && pr.obtenerElemento()) {
        
        // Verifica si el elemento proyectil está dentro del contenedor 'pantalla'
        if (pr.obtenerElemento().parentNode === pantalla) {
            
            // Elimina el proyectil del DOM
            pantalla.removeChild(pr.obtenerElemento());
        }
        
        // Elimina el proyectil del arreglo de proyectiles
        arreglo.splice(index, 1);
    }
}

// Función que maneja la lógica de los enemigos que huyen (se van por la izquierda de la pantalla)
function enemigoHuye() {
    
    // Iterar a través de la lista de enemigos en reversa para evitar problemas al modificar el array durante la iteración
    for (let i = enemigos.length - 1; i >= 0; i--) {
        let en = enemigos[i];  // Obtener el enemigo actual
        
        // Actualizar la posición del protagonista en el enemigo
        en.setPosProta(prota.estado());
        
        if (en) {
            let enemigoPosition = en.estado().left;  // Obtener la posición actual del enemigo

            // Si el enemigo ha salido de la pantalla (posición menor o igual a 0)
            if (enemigoPosition <= 0) {
                
                // Verifica si el elemento enemigo está dentro del contenedor 'pantalla'
                if (en.obtenerElemento() && en.obtenerElemento().parentNode === pantalla) {
                    
                    // Elimina el enemigo del DOM
                    pantalla.removeChild(en.obtenerElemento());
                }
                
                // Elimina el enemigo del array de enemigos
                enemigos.splice(i, 1);
            }
        }
    }
}

// Función que maneja el impacto de los proyectiles enemigos sobre el protagonista
function impactarProta() {
    
    // Itera sobre cada proyectil enemigo
    proyectilesEnemigo.forEach(pr => {
        
        // Si el proyectil impacta al protagonista
        if (pr.impacta()) {
            
            // Actualiza la cantidad de vidas del protagonista en pantalla
            vidas.innerText = 'vidas: ' + prota.getVida();
        }
    });
}

// Función para eliminar proyectiles del protagonista que han salido de la pantalla
function eliminarProyectilProta() {
    
    // Verifica si hay proyectiles en el array
    if (proyectilesProta.length > 0) {
        
        // Recorre el array de proyectiles de atrás hacia adelante
        for (let i = proyectilesProta.length - 1; i >= 0; i--) {
            let pr = proyectilesProta[i];  // Obtener el proyectil actual
            
            // Verifica si el proyectil existe y si su elemento HTML está presente
            if (pr && pr.obtenerElemento()) {
                let proyectilPosition = pr.estado().left;  // Obtener la posición actual del proyectil

                // Si el proyectil ha salido del área visible (supera el ancho de la pantalla o está en el borde izquierdo)
                if (proyectilPosition >= pantalla.offsetWidth || proyectilPosition <= 0) {
                    
                    // Llama a la función que elimina el proyectil del DOM y del array
                    eliminarProyectil(i, proyectilesProta);
                }
            }
        }
    }
}
    
    
    

function crearAumentoPoder() {
    // Comprueba si el tiempo actual es múltiplo de 8, si no está en cooldown y si el tiempo es mayor que 0
    if (tiempo % 8 === 0 && !cooldownAumentoPoder && tiempo > 0) {
        // Llama al método aparecer del objeto aumentoPoder
        aumentoPoder.aparecer();
        
        // Establece cooldownAumentoPoder a true para prevenir la aparición de más aumentos de poder
        cooldownAumentoPoder = true;

        // Agrega un evento que escucha el final de la animación de aumentoPoder
        aumentoPoder.aumentoPoder.addEventListener('animationend', () => {
            // Restablece cooldownAumentoPoder a false una vez que la animación ha terminado
            cooldownAumentoPoder = false;
        });
    }

    // Comprueba si el aumento de poder ha sido recogido por el protagonista (prota)
    if (aumentoPoder.esAgarrado(prota)) {
        // Si ha sido recogido, permite que se vuelva a generar un aumento de poder
        cooldownAumentoPoder = false;
    }
}

function finDelJuego() {
    // Reproduce el sonido final del juego
    reproducirSonidofinal();

    // Detiene el bucle de animación del juego
    cancelAnimationFrame(loopJuego);

    // Limpia los intervalos de cronómetro, disparo y enemigos
    clearInterval(cronometro);
    clearInterval(intervaloDisparo);
    clearInterval(intervaloEnemigo);
    
    // Llama a la función para limpiar el escenario del juego
    limpiarEscenario();

    // Utiliza setTimeout para ejecutar el siguiente código después de 3900 ms (3.9 segundos)
    setTimeout(() => {
        // Oculta la pantalla de juego
        pantalla.classList.add('displayNone');

        // Muestra la pantalla de derrota
        pantallaDerrota.classList.remove('displayNone');

        // Actualiza el puntaje final en la pantalla de derrota
        puntajeFinal.innerText = 'Puntaje: ' + puntaje;

        // Muestra el tiempo jugado en la pantalla de derrota
        tiempoFinal.innerText = 'Tiempo jugado: ' + tiempo + 's';

        // Muestra la cantidad de enemigos matados en la pantalla de derrota
        enemigosMatados.innerText = 'Enemigos matados: ' + contadorMatados;

        // Reinicia el contador de enemigos matados a 0
        contadorMatados = 0;
    }, 3900);
}
function aparecerJefe() {
    // Comprueba si el jefe existe, está muerto y si ya no hay un jefe en juego
    if (jefe && jefe.estaMuerto() && jefeEnjuego) {
        // Cambia el estado de jefeEnjuego a falso, indicando que el jefe ya no está activo
        jefeEnjuego = false;

        // Ejecuta la animación de muerte del jefe
        jefe.morir();

        // Finaliza el juego
        finDelJuego();
    }

    // Si el jefe aún no ha aparecido y el puntaje es suficiente, se procede a crearlo
    if (!jefeEnjuego && !jefe) {  // Verificación clara de que no hay jefe activo
        // Limpia el escenario del juego de elementos existentes
        limpiarEscenario();

        // Crea una nueva instancia del jefe con los parámetros especificados
        jefe = new Jefe(proyectilesEnemigo, prota, 'jefe', 'jefeQuieto', 'jefeMover', 'jefeMuerto', vidaJefe);

        // Reproduce el sonido relacionado con el jefe
        reproducirSonidoJefe();

        // Cambia el estado a jefeEnjuego para indicar que el jefe ha aparecido
        jefeEnjuego = true;
    }
}
//asignacion de valores iniciales
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
    sonidoActual.currentTime = 5; // Reinicia el sonido desde el principio
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


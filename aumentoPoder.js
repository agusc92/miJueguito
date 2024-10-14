class AumentoPoder{
    pantalla;
    dimencionesPantalla;
    aumentoPoder;
    constructor(){
        this.pantalla = document.getElementById('contenedor');
        this.dimencionesPantalla = this.pantalla.getBoundingClientRect();
        this.aumentoPoder = document.createElement("div");
        this.aumentoPoder.classList.add('aumentoPoder');
        
    }

    aparecer(){
        this.aumentoPoder.style.top =  Math.floor(Math.random() * 501) + 'px';
        this.aumentoPoder.style.left = this.dimencionesPantalla.width -70 + 'px';;
        this.pantalla.appendChild(this.aumentoPoder);
        this.aumentoPoder.addEventListener('animationend',()=>{
            if(this.pantalla.contains(this.aumentoPoder))
                this.pantalla.removeChild(this.aumentoPoder);
        })
    }

    esAgarrado(prota){
        let aumentoPoderRect = this.aumentoPoder.getBoundingClientRect();
        let rectProta= prota.prota.getBoundingClientRect();
        if (
            aumentoPoderRect.left < rectProta.right -50&&
            aumentoPoderRect.right > rectProta.left +80&&
            aumentoPoderRect.top < rectProta.bottom -80&&
            aumentoPoderRect.bottom > rectProta.top +80
        ) {
            
            
            this.pantalla.removeChild(this.aumentoPoder);
            prota.aumentarPoder();
            return true;
    }else{
        
        return false;
    }
    }
}
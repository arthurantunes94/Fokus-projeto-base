// Elementos DOM
const html = document.querySelector("html");
const btnFoco = document.querySelector(".app__card-button--foco");
const btnDescansoCurto = document.querySelector(".app__card-button--curto");
const btnDescansoLongo = document.querySelector(".app__card-button--longo");
const btnComecar = document.querySelector("#start-pause");
const txtBtnComecar = document.querySelector("#start-pause span")
const bannerImg = document.querySelector(".app__image");
const bannerTitulo = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const switchMusica = document.querySelector("#alternar-musica");
const iconPlayPauseTempo = document.querySelector(".app__card-primary-butto-icon")
const txtTempoTela = document.querySelector("#timer")

//Variaveis de audio
const musica = new Audio('sons/luna-rise-part-one.mp3')
const audioIniciaTimer = new Audio('sons/play.wav')
const audioPausaTimer = new Audio('sons/pause.mp3')
const audioAcabouTime = new Audio('sons/beep.mp3')
musica.loop = true;

//Variáveis de estado
let tempo = 1500;
let intervaloId = null
let valorDataContexto = html.getAttribute('data-contexto')

// Eventos e Funções
switchMusica.addEventListener("change", () =>{
    if(musica.paused){
        musica.play();
    }else{
        musica.pause();
    }
})

btnFoco.addEventListener("click", () => {
    alterarContexto('foco');
    btnFoco.classList.add('active')
    zerar()
});

btnDescansoCurto.addEventListener("click", () => {
    alterarContexto('descanso-curto');
    btnDescansoCurto.classList.add('active')
    zerar()
});

btnDescansoLongo.addEventListener("click", () => {
    alterarContexto('descanso-longo');
    btnDescansoLongo.classList.add('active')
    zerar() 
});

function alterarContexto(contexto){
    removerActiveBotoes();
    html.setAttribute('data-contexto', contexto);
    valorDataContexto = contexto
    bannerImg.setAttribute('src', `imagens/${contexto}.png`)
    selecionarTempo(contexto);
    alterarTexto(contexto);
}

function removerActiveBotoes() {
    botoes.forEach(function (contexto){
        contexto.classList.remove('active');
    })
}

function selecionarTempo(contexto){
    switch (contexto) {
        case "foco":
            tempo = 1500;
            break;
        case "descanso-curto":
            tempo = 300;
            break;
        case "descanso-longo":
            tempo = 900; 
            break;
        default:
            break;
    }
    mostrarTempo()
}

function alterarTexto(contexto){
    switch (contexto) {
        case "foco":
            bannerTitulo.innerHTML = `Otimize sua produtividade,<br />
          <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case "descanso-curto":
             bannerTitulo.innerHTML = `Que tal dar uma respirada?<br />
          <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;
        case "descanso-longo":
             bannerTitulo.innerHTML = `Hora de voltar à superfície.<br />
          <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;
        default:
            break;
    }
}

//Método para realizar a contagem regressiva e não permitir tempo negativo
const contagemRegressiva = () =>{
    if(tempo <= 0){
        audioAcabouTime.play()
        alert('Tempo Finalizado')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        selecionarTempo(valorDataContexto)
        return
    }
    tempo -= 1;
    mostrarTempo() 
}

//Método para iniciar, pausar e retomar timer
function iniciarPausar(){
    if(intervaloId){
        audioPausaTimer.play()
        zerar()
        return
    }
    audioIniciaTimer.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    txtBtnComecar.textContent = 'Pausar'
    iconPlayPauseTempo.setAttribute('src', `imagens/pause.png`)
}

//Método para zerar o intervalo ID e pausar o setInterval
function zerar(){
    clearInterval(intervaloId)
    intervaloId = null
    txtBtnComecar.textContent = 'Começar'
    iconPlayPauseTempo.setAttribute('src', `imagens/play_arrow.png`)
}

//Evento de clique chamando o método que iniciar e Pausa o timer, todos os outros métodos tem uma ligação nele
btnComecar.addEventListener("click", iniciarPausar)


function mostrarTempo(){
    const tempoTela = new Date(tempo * 1000)
    const tempoTelaFormatado = tempoTela.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'}) // Formata data para aparecer em minutos MM:SS 
    txtTempoTela.innerHTML = `${tempoTelaFormatado}`
}

mostrarTempo()
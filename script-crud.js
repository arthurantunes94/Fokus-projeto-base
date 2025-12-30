//Elementos
const btnAdicionarTarefa = document.querySelector(".app__button--add-task")
const formAdicionarTarefa = document.querySelector(".app__form-add-task")
const txtAreaAdicionarTarefa = document.querySelector(".app__form-textarea")
const ulListaTarefas = document.querySelector(".app__section-task-list")
const btnFormCancelar = document.querySelector(".app__form-footer__button--cancel")
const paragrafoDescTarefa = document.querySelector(".app__section-active-task-description")
const btnExcluirTarefasConcluidas = document.querySelector("#btn-remover-concluidas")
const btnExcluirTodasTarefas = document.querySelector("#btn-remover-todas")

//Variaveis.
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [] //Variavel que guarda as tarefas colocadas no localStorage ou retorna um array vazio
let tarefaSelecionada = null //criação de variavel que vai guardar as tarefas selecionadas no momento
let liTarefaSelecionada = null //criação de variavel que vai guardar as li que estão selecionadas no momento

function limparFechaTextArea(){
    txtAreaAdicionarTarefa.value = '' //tira o valor do txt area
    formAdicionarTarefa.classList.add('hidden') //esconde o form adicionando a classe hidden
}

function atualizarTerefa(){ //Extrai o armezenamento no localStorage para que possa ser reaproveitado 
    localStorage.setItem('tarefas', JSON.stringify(tarefas)) //para que após o refresh da aplicação a informação não seja perdida a lista de tarefas é guardada dentro do localStorage
}

//função responsável por criar o elemento da tarefa
function criarElementoTarefa(tarefa){ 
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
            </svg>`

    const p = document.createElement('p')
    p.classList.add('app__section-task-list-item-description')
    // `tarefa` pode ser objeto { descricao } ou uma string (compatibilidade)
    p.textContent = tarefa.descricao || tarefa

    const button = document.createElement('button')
    button.classList.add('app_button-edit')

    //chama um método para quando é realizado o clique no botão
    button.onclick = () => { 
        const descricaoAtualizada = prompt("Qual o nome da tarefa?") //Abre um alert para inserir uma nova informação
        if(descricaoAtualizada){ //condicional para validar atualização da descrição está vazia, caso esteja ele não guarda nova descrição, mantendo a anterior
            p.textContent = descricaoAtualizada //apresenta nova informação no paragrafo
            tarefa.descricao = descricaoAtualizada //guarda descricao atualizada na tarefa.descricao
            atualizarTerefa() //chamada do método que armazena informação no localStorage
        }   
    }

    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', 'imagens/edit.png')
    button.append(imagemBotao)

    //faz a estrutura dos elementos criados
    li.append(svg)
    li.append(p)
    li.append(button)

    //condicao que valida se tarefa está completa assim que aparece na tela 
    if(tarefa.completa){ 
        li.classList.add('app__section-task-list-item-complete') //coloca classe que indica tarefa completa
        button.setAttribute('disabled', 'disabled') //desabilita botão de alteração da tarefa
    //caso não esteja completa é permitido realizar o click nela.
    } else { 
        //Função para ação ao clicar no LI 
        li.onclick = () => { 
        //forEach para remover a classe de ativo dos li que não foram os clicados.
        document.querySelectorAll(".app__section-task-list-item").forEach(elemento => {
            elemento.classList.remove('app__section-task-list-item-active') 
        });
        //validação para verificar que a tarefa clicada é a que ja está ativa
        if(tarefaSelecionada == tarefa){ 
            li.classList.remove('app__section-task-list-item-active') //remove a classe que indica tarefa ativa
            paragrafoDescTarefa.textContent = '' //limpa o paragrafo de em andamento
            tarefaSelecionada = null //coloca null na tarefa selecionada
            liTarefaSelecionada = null //coloca null na li tarefa selecionada
            return 
        }
        tarefaSelecionada = tarefa //guarda a tarefa clicada a tarefa selecionada
        liTarefaSelecionada = li // guarda o elemento li da tarefa clicada
        paragrafoDescTarefa.textContent = tarefa.descricao //Atribuindo valor ao paragrafo que recebe a descrição da tarefa
        li.classList.add('app__section-task-list-item-active') //Adicionando classe que sinaliza que tarefa está selecionada
        }
    }  
    return li
}

btnAdicionarTarefa.addEventListener('click', () =>{
    formAdicionarTarefa.classList.toggle('hidden') //verifica se classe está ativa ou não e realizar a ativação ou desativação 
})


formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault() //cancela o comportamento padrão ao realizar o submit
    const tarefa = {
        descricao: txtAreaAdicionarTarefa.value //guarda valor do text area dentro do objeto criado tarefa
    }
    tarefas.push(tarefa) //adicionar o objeto criado com o valor do text area dentro da lista de tarefas criada
    atualizarTerefa() //chamada do método que armazena informação no localStorage
    // atualizar a UI imediatamente e limpar o formulário
    const elementoTarefa = criarElementoTarefa(tarefa) //cria elemento da tarefa especifica e guarda na constante
    ulListaTarefas.append(elementoTarefa) //coloca elemento da tarefa criada dentro da UL que deve ser apresentada
    limparFechaTextArea();
})

tarefas.forEach(tarefa => { //forEach na lista de tarefas para pegar a tarefa especifica
    const elementoTarefa = criarElementoTarefa(tarefa) //cria elemento da tarefa especifica e guarda na constante
    ulListaTarefas.append(elementoTarefa) //coloca elemento da tarefa criada dentro da UL que deve ser apresentada
});

btnFormCancelar.addEventListener('click', limparFechaTextArea)

//Evento de foco finalizado, que faz toda a finalização da tarefa
document.addEventListener('FocoFinalizado', () =>{
    if(tarefaSelecionada && liTarefaSelecionada){ //valida se existe tarefa selecionada e li referente a mesma
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active') //remove a classe de li ativo
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete') // adiciona a classe de indicação de tarefa completa
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled') //desabilita o botão de edição da tarefa
        paragrafoDescTarefa.textContent = '' //limpa o paragrafo de em andamento
        tarefaSelecionada.completa = true //guarda que tarefa está finalizada
        atualizarTerefa() //atualiza valor da tarefa no localStorage
    }
})

btnExcluirTarefasConcluidas.onclick = () => {
    seletor = ".app__section-task-list-item-complete"
    removerTarefa(seletor)
    tarefas = tarefas.filter(tarefa => !tarefa.completa)
    atualizarTerefa()
}

btnExcluirTodasTarefas.onclick = () => {
    seletor = ".app__section-task-list-item"
    removerTarefa(seletor)
    localStorage.clear()
}

function removerTarefa(seletor){
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    });   
}



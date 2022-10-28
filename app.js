
/*obj de despesa*/
class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			if(this[i] === null || this[i] === '' || this[i] === undefined){/*recupera o valor do atributo i que no caso percorre todos os 
																			campos de despesa(obj criado)*/
				return false
			}else{
				return true
			}
		}
	}
}

class Bd{

	constructor(){
		let id = localStorage.getItem('id') /*recebe id de local, mas ainda não existe então vais ser null*/

		if(id === null){
			localStorage.setItem('id', 0) /*crio o id em local e atribuo o valor 0*/
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id') /*recebo o valor de id*/

		return parseInt(proximoId) + 1 /*incremento o valor de id com +1*/
	}

	/*gravar em local storage*/
	gravar(d){

		let id = this.getProximoId() /*recebo o proximo id*/

		localStorage.setItem(id, JSON.stringify(d)) /*Json atua no meio de campo para comunicação entre aplicações diferentes, 
														   pois objetos literais não são passados para um banco de dados por exemplo*/

		localStorage.setItem('id', id) /*atualizo o valor do id com o ultimo incremento para manter o loop*/
	}

	recuperarTodosRegistros(){

		let despesas = Array()

		let id = localStorage.getItem('id')

		for(let i = 1; i <= id; i++){
			let despesa = JSON.parse(localStorage.getItem(i))

			if(despesa === null){
				console.log("despesa "+i+" == null")
				continue;
			}
			
			despesa.id = i //marcando cada despesa com um id para ser removida depois se preciso
			console.log(despesa)
			despesas.push(despesa)
		}
		
		return despesas
	}

	pesquisar(despesa){
		let despesaFiltro = Array()
		despesaFiltro = this.recuperarTodosRegistros()

		if(despesa.ano != ''){
			despesaFiltro = despesaFiltro.filter(d => d.ano == despesa.ano)
		}

		if(despesa.mes != ''){
			despesaFiltro = despesaFiltro.filter(d => d.mes == despesa.mes)
		}

		if(despesa.dia != ''){
			despesaFiltro = despesaFiltro.filter(d => d.dia == despesa.dia)
		}

		if(despesa.tipo != ''){
			despesaFiltro = despesaFiltro.filter(d => d.tipo == despesa.tipo)
		}

		if(despesa.descricao != ''){
			despesaFiltro = despesaFiltro.filter(d => d.descricao == despesa.descricao)
		}

		if(despesa.valor != ''){
			despesaFiltro = despesaFiltro.filter(d => d.valor == despesa.valor)
		}

		return despesaFiltro
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


/*Cadastrar despesa*/
function cadastrarDespesa(){

	let ano = document.getElementById('ano') /*dessa forma eu guardo a referencia e acesso o valor atraves de .value*/
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	if(despesa.validarDados()){

		bd.gravar(despesa)
		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_body').innerHTML = 'Despesa cadastrada com sucesso'
		document.getElementById('modal_btn').className = 'btn btn-success'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		$('#registraDespesa').modal('show') //biblioteca jquery
		console.log('dados válidos e gravados')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	}else{

		document.getElementById('modal_titulo').innerHTML = 'Erro na Gravação de Despesa'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_body').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		document.getElementById('modal_btn').innerHTML = 'Voltar e Corrigir'
		$('#registraDespesa').modal('show') //biblioteca jquery
		console.log('dados inválidos')
	}
}


function carregaListaDespesas( despesas = Array(), filtro = false){

	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}

	//selecionando tbody da tabela
	let listaDespesa = document.getElementById('listaDespesa')
	listaDespesa.innerHTML = ''

		//percorrer array despesa listando cada despesa de forma dinânimica
		despesas.forEach(function(d){

			let linha = listaDespesa.insertRow() //criando linhas "tr"

			//criando colunas "td"
			linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano 

				switch (d.tipo) {
					case '1': d.tipo = 'Alimentação'
						break;

					case '2': d.tipo = 'Educação'
						break;

				    case '3': d.tipo = 'Lazer'
						break;

					case '4': d.tipo = 'Saúde'
						break;

					case '5': d.tipo = 'Transporte'
						break;
				}

					linha.insertCell(1).innerHTML = d.tipo
					linha.insertCell(2).innerHTML = d.descricao
					linha.insertCell(3).innerHTML = d.valor

					let btn = document.createElement("button") //criando um botão
					btn.className = "btn btn-danger" //inserindo classe no botão
					btn.innerHTML = '<i class="fas fa-times"></i>' //inserindo uma tag i dentro do botão
					btn.id = `id_despesa_${d.id}` 
					
					btn.onclick = function(){
						
						let id = this.id.replace('id_despesa_', '')
						bd.remover(id)
						window.location.reload()
					}

					linha.insertCell(4).append(btn) //inserindo botão em todas as linhas na 4 celula
			
			})
}

function pesquisarDespesa(){
	let ano = document.getElementById('ano') /*dessa forma eu guardo a referencia e acesso o valor atraves de .value*/
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}
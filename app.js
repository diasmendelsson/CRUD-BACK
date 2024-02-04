const express = require('express');
const app = express();
const cors = require("cors");
const User = require('./models/User')

app.use(express.json())

const db = require('./models/db');

//Criar o middleware para permitir  requisição externa
app.use((req, res, next) => {
    // Qualquer endereço pode fazer requisição
    res.header("Access-Control-Allow-Origin", "*");
    //Tipos de métodos que a API aceita
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    // Permitir o envio de dados para API
    res.header("Access-Control-Allow-Headers", "Content-Type");

    // Executar o cors
    app.use(cors());
    //Quando não houver erro deve continuar o processamento
    next();

})


app.post("/cadastrar", async (req, res) => {


    await User.create(req.body)
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuario cadastrado com sucesso!"
        })
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado com sucesso!"
        })
    })
 
});

app.get('/usuarios', async (req, res) =>  {

     // Crio constante para receber o numero da página, quando não é enviado o numero da pagina é atribuido página 1
     const { page = 1 } = req.query;

     // Crio a constante para o limite de registor em cada página
     const limit = 9;
 
     // Crio a váriavel com o número da última página
     var lastPage = 1;
 
     // Crio a constante para contar a quantidade de de regitro no banco de dados
     const countUser = await User.count()
 
     // Acessa o IF quando encontrar registros no banco de dados
     if (countUser !== 0 ){
 
         // Calcular a ultima página 
         lastPage = Math.ceil(countUser / limit )
 
     }else {
         //Pausar o processamento e retornar a mensagem de erro
         return res.status(400).json({
             mensagem: "ERRO: Nenhum usuário encontrado!"
         })
     }
 

    const test = await User.findAll({

        // Ordenar os registros pela coluna id do menor para o maior
        order: [[ 'id' , 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit ), 
        limit: limit

    })

    if(test){ 

        // Criar o objeto com as informações para paginação 
        var pagination = {

            // Primeiro vem o caminho
            path: '/usuarios',

            // Página atual
            page,

            // Calcular a URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,

            // Calcular a URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),

            // Retornar ultuma pagina 
            lastPage,

            // Quantidade total de registros
            total: countUser
        }

        return res.json({
            test,
            pagination
        })
    }else {
        return res.status(400).json({
            mensagem: 'ERRO: Não encontrado !!'
        })
    }

})

app.get("/usuarios/:id", async (req, res) =>{

    // Receber o parâmetro enviado na URL
    const {id} = req.params
    

    // Recuperar o registro no  banco de dados
    const test = await User.findOne({

        //Indicar quais colunas recuperar
        attributes: ['id', 'name', 'email', 'password'],

        // Acrescentar a condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    })
    console.log(test)

    // Acessa o IF se encontrar o registro no banco de dados 
    if(test){

        // Pausar e retornar os dados 

        return res.json({
           test
        })


    }else{

        return res.status(400).json({
            mensagem: "Usuário não encontrado!"
        })

    }

   
})

app.put("/usuarios/:id/", async (req, res) =>{


    const { id } = req.params

    // Obter os dados de atualização do corpo da requisição
    let dados = { name, email, password } = req.body;

   // Editar no banco de dados
   await User.update( { name, email, password }, {
       where: { id }
   }).then(() =>{
        // Pausar o processamnto e retornar a mensagem
        return res.json({
            mensagem: "Usuário editado com sucesso!"
        })
    }).catch(() =>{
        return res.status(400).json({
            mensagem: "Erro: Usuário não editado com sucesso !!"
        })
    })

})

app.delete("/usuarios/:id", async (req, res) =>{

    // Receber o parâmetro enviado na URL
    const { id } = req.params

    // Apagar o usuário no banco de dados utilizando a MODELS User
    await User.destroy({
        // Acrescentar o WHERE na instrução SQL indicando qual registro excluir no BD
        where: { id }
    }).then(() =>{

        return res.json({
            mensagem: "Usuário apagado com sucesso! "
        })

    }).catch(() =>{
        return res.status(400).json({
            mensagem: "Erro: Usuário não apagado com sucesso !! "
        })
    })

})

app.listen( 8080, () => {
    console.log("Servidor iniciado na porta http://localhost:8080")
})

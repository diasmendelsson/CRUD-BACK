const Sequelize = require('sequelize')

const sequelize = new Sequelize( "cadastro", "root", "diasmendelsson123", {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate()
.then( function(){

    console.log("Conexão realizada com sucesso !")
}).catch(function() {
    
    console.log("Erro: conexão não realizada com sucesso!")
})

module.exports = sequelize 
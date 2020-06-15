const fs = require('fs');


function escreverArquivo(diretorio, dados) {

    fs.writeFile(diretorio, dados, function (err) {
        let dir = diretorio;
        let data = new Date();

        if (err)
            return console.log(err);
        else
            return console.log(`Arquivo cotacoes.xml gerado no diretório ${diretorio} em ${data}`);
    });
};

module.exports = escreverArquivo();
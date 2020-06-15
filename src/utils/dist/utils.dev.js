"use strict";

var fs = require('fs');

function escreverArquivo(diretorio, dados) {
  fs.writeFile(diretorio, dados, function (err) {
    var dir = diretorio;
    var data = new Date();
    if (err) return console.log(err);else return console.log("Arquivo cotacoes.xml gerado no diret\xF3rio ".concat(diretorio, " em ").concat(data));
  });
}

;
module.exports = escreverArquivo();
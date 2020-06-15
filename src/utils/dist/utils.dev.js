"use strict";

var fs = require("fs");

module.exports = {
  escreverArquivo: function escreverArquivo(diretorio, dados) {
    fs.writeFile(diretorio, dados, function (err) {
      var data = Date(); //let data = new dataAtualFormatada();

      if (err) return console.log(err);else return console.log("Arquivo cotacoes.xml gerado no diret\xF3rio ".concat(diretorio, " em ").concat(data));
    });
  },
  dataAtualFormatada: function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString().padStart(2, "0"),
        mes = (data.getMonth() + 1).toString().padStart(2, "0"),
        //+1 pois no getMonth Janeiro começa com zero.
    ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
  }
};
"use strict";

var axios = require('axios');

var fs = require('fs');

var convert = require('xml-js');

var moeda = 'USD';
var dias = 3;
var dataInicial = '01-01-2019';
var dataFinal = '12-31-2020';
var link = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='".concat(dataInicial, "'&@dataFinalCotacao='").concat(dataFinal, "'&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao");

var getCotacao = function getCotacao() {
  return regeneratorRuntime.async(function getCotacao$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get(link));

        case 3:
          return _context.abrupt("return", _context.sent);

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

var retornaCotacao = function retornaCotacao() {
  var dados, valores, options, result;
  return regeneratorRuntime.async(function retornaCotacao$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getCotacao());

        case 2:
          dados = _context2.sent;
          valores = dados.data.value;
          options = {
            compact: true,
            spaces: 4,
            ignoreText: true
          };
          result = convert.js2xml(valores, options);
          console.log(result);
          fs.writeFile("cotacoes.txt", convert.js2xml(valores, options), function (err) {
            if (err) return console.log(err);
            console.log("Cota\xE7\xF5es > cotacoes.txt");
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
};

retornaCotacao();
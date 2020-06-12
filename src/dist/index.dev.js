"use strict";

/**
 * @param regexXMLInicio procura pelo padrão <intervalo_de_numero> em toda a linha (g), em todo o texto (m)
 * @param regexXMLFim procura pelo padrão </intervalo_de_numero> em toda a linha (g), em todo o texto (m)
 * @param dados retorno assincrono da função getContacao()
 * @param valores armazena os valores retornados no JSON da função getCotacao()
 * @param options armazena parametros opcionais necessários para rodar a função de conversão JSON / OBJECT / XML
 * @param diretorio Diretório onde o arquivo final será salvo
 * @param resultado Resultado final dos dados retornados pela função getCotacao() e posteriormente convertido para XML com ajustes em regex
 * @param data Armazena o dia atual
 * @param dataInicial Periodo Inicial que o WS irá retornar os dados
 * @param dataFinal Periodo Final que o WS irá retornar os dados
 * @param link Link para acesso ao WS ja contendo os valores das variáveis acima.
 */
var cron = require("node-cron");

var axios = require('axios');

var fs = require('fs');

var convert = require('xml-js');

var dataInicial = '01-01-1990';
var dataFinal = '12-31-2020';
var link = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial=%27".concat(dataInicial, "%27&@dataFinalCotacao=%27").concat(dataFinal, "%27&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao");

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
  var dados, valores, options, resultado, diretorio, regexXMLInicio, regexXMLFim, data;
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
            ignoreText: false
          };
          resultado = convert.js2xml(valores, options);
          diretorio = "/\SF009144/\Lucas/\GDP";
          regexXMLInicio = /<[0-9]+>/gm;
          regexXMLFim = /<\/[0-9]+>/gm;
          data = new Date(); //São aplicadas alterações nos dados retornados pelo WS, isso é necessário para que o Qlikview entenda a esrutura dos dados

          resultado = '<COTACAO>' + '\n' + resultado.replace(regexXMLInicio, '<COTACOES>').replace(regexXMLFim, '</COTACOES>') + '\n' + '</COTACAO>';
          /**
           * O resultado final será armazenado no arquivo cotacoes.xml
           */

          fs.writeFile('/\/\SF009144/\Lucas/\GDP/\cotacoes.xml', resultado, function (err) {
            if (err) return console.log(err);
            console.log("Arquivo cotacoes.xml gerado no diret\xF3rio ".concat(diretorio, " em ").concat(data));
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
};
/**
 * Os dados serão gerados diariamente as 18 horas
 */


cron.schedule('0 18 * * *', function (ctx) {
  retornaCotacao();
});
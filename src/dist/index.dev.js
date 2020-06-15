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

var axios = require("axios");

var convert = require("xml-js");

var _require = require("./utils/utils"),
    escreverArquivo = _require.escreverArquivo,
    dataAtualFormatada = _require.dataAtualFormatada; //outra forma de importar várias funções do mesmo arquivo


var dataInicial = "01-01-1990";
var dataFinal = "12-31-2020";
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
  var dados, options, regexXMLInicio, regexXMLFim, data, diretorioLucas, diretorioLocal, valores, resultado;
  return regeneratorRuntime.async(function retornaCotacao$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getCotacao());

        case 2:
          dados = _context2.sent;
          options = {
            compact: true,
            spaces: 4,
            ignoreText: false
          };
          regexXMLInicio = /<[0-9]+>/gm;
          regexXMLFim = /<\/[0-9]+>/gm;
          data = dataAtualFormatada();
          diretorioLucas = "//SF009144/Lucas/GDP/cotacoes.xml";
          diretorioLocal = "./cotacoes.xml";
          valores = dados.data.value;
          resultado = convert.js2xml(valores, options); //São aplicadas alterações nos dados retornados pelo WS, isso é necessário para que o Qlikview entenda a esrutura dos dados

          resultado = "<COTACAO>" + "\n" + resultado.replace(regexXMLInicio, "<COTACOES>").replace(regexXMLFim, "</COTACOES>") + "\n" + "</COTACAO>";
          /**
           * O resultado final será armazenado no arquivo cotacoes.xml
           */

          escreverArquivo(diretorioLocal, resultado);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
};

retornaCotacao();
/**
 * Cron para recarga automática, os dados serão gerados diariamente as 18 horas
cron.schedule('0 18 * * *', (ctx) => {
  retornaCotacao()
})
*/
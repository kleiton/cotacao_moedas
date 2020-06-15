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

const cron = require("node-cron");
const axios = require("axios");
const convert = require("xml-js");

const { escreverArquivo, dataAtualFormatada } = require("./utils/utils"); //outra forma de importar várias funções do mesmo arquivo

const dataInicial = "01-01-1990";
const dataFinal = "12-31-2020";
let link = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial=%27${dataInicial}%27&@dataFinalCotacao=%27${dataFinal}%27&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;

const getCotacao = async () => {
  try {
    return await axios.get(link);
  } catch (error) {
    console.error(error);
  }
};

const retornaCotacao = async () => {
  const dados = await getCotacao();
  const options = { compact: true, spaces: 4, ignoreText: false };
  const regexXMLInicio = /<[0-9]+>/gm;
  const regexXMLFim = /<\/[0-9]+>/gm;
  const data = dataAtualFormatada();
  const diretorioLucas = "//SF009144/Lucas/GDP/cotacoes.xml";
  const diretorioLocal = "./cotacoes.xml";

  let valores = dados.data.value;
  let resultado = convert.js2xml(valores, options);

  //São aplicadas alterações nos dados retornados pelo WS, isso é necessário para que o Qlikview entenda a esrutura dos dados
  resultado =
    "<COTACAO>" +
    "\n" +
    resultado
      .replace(regexXMLInicio, "<COTACOES>")
      .replace(regexXMLFim, "</COTACOES>") +
    "\n" +
    "</COTACAO>";

  /**
   * O resultado final será armazenado no arquivo cotacoes.xml
   */
  escreverArquivo(diretorioLocal, resultado);
};
retornaCotacao();


/**
 * Cron para recarga automática, os dados serão gerados diariamente as 18 horas
cron.schedule('0 18 * * *', (ctx) => {
  retornaCotacao()
})
*/

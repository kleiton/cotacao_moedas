const axios = require('axios')
const fs = require('fs');
const convert = require('xml-js');

const moeda = 'USD';
const dias = 3;
const dataInicial = '01-01-2019';
const dataFinal = '12-31-2020';
let link = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${dataInicial}'&@dataFinalCotacao='${dataFinal}'&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;


const getCotacao = async () => {
    try {
        return await axios.get(link)
    } catch (error) {
        console.error(error)
    }
}

const retornaCotacao = async () => {
    const dados = await getCotacao()
    let valores = dados.data.value;
    var options = {compact: true, spaces: 4, ignoreText: true};
    let result = convert.js2xml(valores, options);
    console.log(result);


    fs.writeFile(`cotacoes.txt`, convert.js2xml(valores, options), function (err) {
        if (err) return console.log(err);
        console.log(`Cotações > cotacoes.txt`);
      });
    
}
    


retornaCotacao()
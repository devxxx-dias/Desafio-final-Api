const fs = require('fs/promises');
const handlebars = require('handlebars');

const compiladorHtml = async (arquivoPath, contexto) => {
    const html = await fs.readFile(arquivoPath);
    const compilador = handlebars.compile(html.toString())
    const htmlString = compilador(contexto);
    return htmlString
}

module.exports = compiladorHtml;
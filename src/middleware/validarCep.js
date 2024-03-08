const cepChecagem = require('cep-promise');
const validarCep = async (req, res, next) => {
    const { cep } = req.body;

    if (cep) {

        try {
            let cepValidado = await cepChecagem(cep)

            if (!cepValidado) { return res.status(400).json({ Mensagem: 'Informe um CEP válido' }) }
            req.cep = cep.replace(/\D/g, '');
            next()
        } catch (error) {
            return res.status(400).json({
                Mensagem: `${error.message = "CEP inválido! O CEP deve conter 8 números e deve ter o formato XXXXX-XXX ou XXXXXXXX."}`
            })
        }
    }
    else {
        req.cep = '';
        next()
    }
}

module.exports = validarCep;
const { knex } = require("../config/conexao");

const listarCategorias = async (req, res) => {

    try {
        const categorias = await knex('categorias')

        if (!categorias) {
            return res.status(404).json({ Mensagem: "Categoria não encontrada" })
        }

        const resultadoFormatado = JSON.stringify(categorias, null, 4);
        res.status(200).send(resultadoFormatado);

    } catch (error) {
        return res.status(500).json({ Mensagem: "Erro Interno no Servidor" })
    }

};

module.exports = {
    listarCategorias
};
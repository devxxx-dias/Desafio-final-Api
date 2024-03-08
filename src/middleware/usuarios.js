const jwt = require('jsonwebtoken');
const senhaJwt = process.env.SENHAHASH;
const { knex } = require("../config/conexao");

const autenticarUsuario = async (req, res, next) => {
    const { authorization } = req.headers

    try {

        if (!authorization) {
            return res.status(400).json({ Mensagem: "Usuario nao autorizado" })
        }

        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, senhaJwt);

        const usuarioValidado = await knex('usuarios')
            .where({ id })
            .first()

        if (!usuarioValidado) {
            return res.status(400).json({ Mensagem: "Usuario nao autorizado" });
        }

        const { senha, ...usuario } = usuarioValidado;

        req.usuario = usuario

        next();

    } catch (error) {

        if (error) {
            switch (error.message) {
                case 'invalid signature':
                case 'invalid token':
                case 'jwt must be provided':
                    return res.status(400).json({ Mensagem: "Token Inválido" });
                case 'jwt expired':
                    return res.status(400).json({ Mensagem: "Sessão expirada, realize o login novamente" });
                default:
                    return res.status(500).json({ Mensagem: "Mensagem: Erro Interno no Servidor" });
            }
        }
    }
}

module.exports = autenticarUsuario;
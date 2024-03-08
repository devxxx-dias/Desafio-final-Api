const { knex } = require('../config/conexao');
const transportador = require("../config/email");
const compiladorHtml = require("../utils/compiladorHtml");

const cadatrarPedidos = async (req, res) => {
    let { cliente_id, observacao, pedido_produtos } = req.body
    let pedidoCliente;
    let valorTotal = 0;

    try {
        const clienteId = await knex('clientes')
            .where({ id: cliente_id })
            .first()

        if (!clienteId) { return res.status(400).json({ Mensagem: "Cliente não encotrado pelo ID" }) }

        const produtoComId = await knex('produtos')

        pedidoCliente = await knex('pedidos')
            .insert({ cliente_id, observacao, valor_total: valorTotal })
            .returning('*')

        for (const produto of pedido_produtos) {
            if (!produtoComId.map(intem => { return intem = String(intem.id) }).includes(produto.produto_id.toString())) {
                return res.status(400).json({ Mensagem: `Não existe no estoque o produto com o ID ${produto.produto_id}` })
            }

            for (const intem of produtoComId) {
                if (intem.id === produto.produto_id) {
                    if (produto.quantidade_produto > intem.quantidade_estoque) {
                        return res.status(400).json({ Mensagem: `Quantidade indisponível! Temos ${intem.quantidade_estoque} ${intem.quantidade_estoque === 1 ? "unidade disponível" : "unidades disponíveis"} no estoque para o produto ID ${produto.produto_id},` })
                    }

                    await knex('produtos')
                        .where({ id: produto.produto_id })
                        .decrement('quantidade_estoque', produto.quantidade_produto);
                    valorTotal += produto.quantidade_produto * intem.valor


                    pedidoRegistrado = await knex('pedido_produtos')
                        .insert({ pedido_id: pedidoCliente[0].id, produto_id: intem.id, quantidade_produto: produto.quantidade_produto, valor_produto: intem.valor })
                }

            }
        }
        pedidoCliente = await knex('pedidos')
            .update({ valor_total: valorTotal })
            .where({ id: pedidoCliente[0].id })
            .returning('*')

        pedido_produtos = (await knex('pedido_produtos')
            .where({ pedido_id: pedidoCliente[0].id })).map(intem => {
                return {
                    id: intem.id,
                    quantidade_produto: intem.quantidade_produto,
                    valor_produto: intem.valor_produto,
                    pedido_id: intem.pedido_id,
                    produto_id: intem.produto_id
                }
            })

        let pedido = pedidoCliente.map(intem => {
            return {
                pedido: {
                    id: pedidoCliente[0].id,
                    valor_total: valorTotal,
                    observacao: pedidoCliente.observacao,
                    cliente_id: clienteId.id
                },
                pedido_produtos
            }
        })

        const arquivoPath = "src/templates/email.html"

        const html = await compiladorHtml(arquivoPath, {
            nome: clienteId.nome,
            pedido: {
                id: pedido[0].pedido.id,
                valor_total: (pedido[0].pedido.valor_total / 100).toFixed(2).replace('.', ','),
                observacao,
                cliente_id
            },
            pedido_produtos
        })

        transportador.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${clienteId.nome} <${clienteId.email}>`,
            subject: "O pedido foi efetuado com sucesso",
            html: html
        });

        return res.status(201).json(pedido[0])
    } catch (error) {
        return res.status(500).json({ Mensagem: "Erro interno no servidor" })
    }
}
const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let pedido_idCliente;
        if (cliente_id !== undefined) {
            pedido_idCliente = await knex('pedidos').where({ cliente_id });
        } else {
            pedido_idCliente = await knex('pedidos');
        }

        if (!pedido_idCliente || pedido_idCliente.length === 0) {
            return res.status(400).json({ Mensagem: cliente_id !== undefined ? "Não há pedidos para o Id do cliente informado" : "Não há clientes cadastrados" });
        }
        const { id } = pedido_idCliente[0]
        const pedido_produto = await knex('pedido_produtos')
            .where({ pedido_id: id })
            .orderBy('id', 'asc')


        const pedidoFormatado = pedido_produto.map(item => ({
            id: item.id,
            quantidade_produto: item.quantidade_produto,
            valor_produto: item.valor_produto,
            pedido_id: item.pedido_id,
            produto_id: item.produto_id
        }));

        const pedido = pedido_idCliente.map(item => ({
            pedido: {
                id: item.id,
                valor_total: item.valor_total,
                observacao: item.observacao,
                cliente_id: item.cliente_id
            },
            pedido_produtos: pedidoFormatado
        }));

        return res.status(200).json(pedido);
    } catch (error) {
        return res.status(500).json({ Mensagem: "Erro interno no servidor" });
    }
};


module.exports = {
    cadatrarPedidos,
    listarPedidos
}

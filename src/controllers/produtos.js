const { knex } = require('./../config/conexao');
const { uploadImage, deletarImagem } = require('../storage/storage');

const cadastrarProduto = async (req, res) => {
    let { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {
        const categoriaExistente = await knex('categorias').where('id', categoria_id).first();
        if (!categoriaExistente) {
            return res.status(400).json({ mensagem: 'A categoria informada não existe, consulte a tabela de categorias.' });
        }

        const ehAtualizar = await knex('produtos').where({ descricao, categoria_id }).first()
        if (ehAtualizar) {
            return res.status(400).json({ Mensagem: "Já existe um produto com essa descrição e id de categoria registrado, considere ir ao campo atualizar Produto" })
        }

        const atualizarCampos = {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        };

        let produtoAtualizado = await knex('produtos')
            .insert(atualizarCampos)
            .returning('*');

        if (req.file) {
            const { originalname, mimetype, buffer } = req.file;

            if (!mimetype.startsWith('image/')) {
                return res.status(400).json({ mensagem: "Formato de arquivo não suportado, faça o upload de um arquivo imagem (JPEG, PNG, GIF, etc.)" });
            }

            const imagem = await uploadImage(`desafio05/${produtoAtualizado[0].id}/${originalname}`, buffer, mimetype);
            atualizarCampos.produto_imagem = imagem.url;
        }

        produtoAtualizado = await knex('produtos')
            .update(atualizarCampos)
            .where({ id: produtoAtualizado[0].id })
            .returning('*')

        const produto = produtoAtualizado.map(intem => {
            return {
                "id": String(intem.id),
                "descricao": intem.descricao,
                "quantidade_estoque": intem.quantidade_estoque,
                "valor": intem.valor,
                "categoria_id": intem.categoria_id,
                "produto_imagem": intem.produto_imagem
            }

        })
        return res.status(201).json(produto[0]);
    } catch (error) { return res.status(500).json({ mensagem: 'Erro interno no servidor.' }); }
};

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const consulta = await knex('produtos').where({ id }).first()

        if (!consulta || consulta.length === 0) {
            return res.status(404).json({ Mensagem: `Não foi encontrado nenhum produto com o ID selecionado.` })
        }

        return res.status(200).json(consulta);
    } catch (error) { return res.status(500).json({ mensagem: 'Erro interno no servidor.' }); }
};

const filtroProdutosQuery = async (req, res) => {
    const categoria_id = req.query.categoria_id;

    try {
        if (categoria_id !== undefined) {

            const listarCategoria = await knex('categorias').select('id')

            if (categoria_id > listarCategoria.length) {
                return res.status(400).json({ Mensagem: `Selecione as categorias entre 1 a ${listarCategoria.length}` })
            }

            const listarCategoria_String = listarCategoria.map(intem => { return intem.id.toString() })

            const idCategoria = [];
            for (const id of categoria_id) {
                idCategoria.push(listarCategoria_String.indexOf(id) + 1)
            }

            const consulta = await knex('produtos')
                .whereIn('categoria_id', idCategoria)
                .orderBy('id', 'asc');

            if (!consulta) {
                return res.status(400).json({ Mensagem: `Falha na consulta de categorias, verifique os dados inseridos` })
            }
            if (consulta.length === 0) {
                return res.status(404).json({ Mensagem: `Não há produtos para as categorias selecionadas` })
            }

            return res.status(200).json(consulta);
        }
        else {
            const consulta = await knex('produtos').orderBy('id', 'asc')

            if (!consulta || consulta.length === 0) {
                return res.status(404).json({ Mensagem: "Não há produtos para serem demonstrados" })
            }

            return res.status(200).json(consulta);
        }
    } catch (error) { return res.status(500).json({ Mensagem: "Erro Interno do Servidor" }); }
};

const atualizarProduto = async (req, res) => {
    const { id } = req.params;
    let { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    let path;

    try {
        const produtoExistente = await knex('produtos')
            .where({ id })
            .first();

        if (!produtoExistente) { return res.status(404).json({ mensagem: 'Produto não encontrado.' }); }

        const categoriaExistente = await knex('categorias')
            .where('id', categoria_id)
            .first();

        if (!categoriaExistente) {
            return res.status(400).json({ mensagem: 'A categoria informada não existe, consulte a tabela de categorias.' });
        }

        const atualizarCampos = {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
        };

        if (req.file) {
            const { originalname, mimetype, buffer } = req.file;

            if (!mimetype.startsWith('image/')) {
                return res.status(400).json({ mensagem: "Formato de arquivo não suportado, faça o upload de um arquivo imagem (JPEG, PNG, GIF, etc.)" });
            }

            const imagem = await uploadImage(`desafio05/${id}/${originalname}`, buffer, mimetype);
            atualizarCampos.produto_imagem = imagem.url;

            const { produto_imagem } = produtoExistente;
            if (produto_imagem) {
                path = produto_imagem.split('com/')[1]
                deletarImagem(path)
            }

        } else {
            atualizarCampos.produto_imagem = null;
        }

        const produtoAtualizado = await knex('produtos')
            .where('id', id)
            .update(atualizarCampos)
            .returning('*');

        return res.status(201).json();
    } catch (error) { return res.status(500).json({ mensagem: 'Erro interno no servidor.' }); }
};

const excluirProduto = async (req, res) => {
    const { id } = req.params;
    let path;
    try {
        const produtoVinculado = await knex('pedido_produtos')
            .where({ produto_id: id })
            .first();

        if (produtoVinculado) {
            return res.status(400).json({ mensagem: 'Não é possível excluir o produto. Está vinculado a um pedido.' });
        }

        const produto = await knex(`produtos`)
            .where({ id })
            .first();

        if (!produto) {
            return res.status(404).json({ mensagem: 'Não foi encontrado nenhum produto com o ID selecionado.' });
        }

        const deletarImagemBD = await knex(`produtos`).delete().where({ id })
        if (!deletarImagemBD) {
            return res.status(400).json({ Mensagem: "Não foi possível deletar o produto no banco de dados, verifique os dados inseridos" })
        }

        const { produto_imagem } = produto;
        if (produto_imagem) {
            path = produto_imagem.split('com/')[1]
            deletarImagem(path)
        }

        return res.status(204).send();
    } catch (error) { return res.status(500).json({ mensagem: 'Erro interno no servidor.' }); }
};

module.exports = {
    cadastrarProduto,
    detalharProduto,
    filtroProdutosQuery,
    atualizarProduto,
    excluirProduto
};


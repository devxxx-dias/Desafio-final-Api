const { knex } = require("../config/conexao");

const cadastrarCliente = async (req, res) => {
  let { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  try {
    const cpf_Limpo = cpf.replace(/\D/g, '');
    const emailCadastrado = await knex('clientes')
      .where({ email })
      .first();

    const cpfCadastrado = await knex('clientes')
      .where({ cpf: cpf_Limpo })
      .first();

    if (emailCadastrado) {
      return res.status(400).json({ mensagem: 'Já existe um cliente cadastrado com o e-mail informado.' });
    }

    if (cpfCadastrado) {
      return res.status(400).json({ mensagem: 'Já existe um cliente cadastrado com o cpf informado.' });
    }

    const clienteNovo = await knex('clientes')
      .insert({ nome, email, cpf: cpf_Limpo, cep: !req.cep ? cep : req.cep, rua, numero: !numero ? 0 : numero, bairro, cidade, estado })
      .returning('*');

    if (!clienteNovo) {
      return res.status(400).json({ Mensagem: "Cliente não cadastrado, verifique os dados inseridos" })
    }

    return res.status(201).json(clienteNovo[0]);

  } catch (error) { return res.status(500).json({ mensagem: "Erro interno do servidor" }) }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await knex('clientes')
      .select('*')
      .where('id', id)
      .first();

    if (!client) { return res.status(404).json({ message: 'Cliente não encontrado para o ID fornecido.' }); }

    return res.status(200).json(client);

  } catch (error) { return res.status(500).json({ message: 'Erro interno no servidor.' }); }
};

const listarClientes = async (req, res) => {
  try {
    const cliente = await knex('clientes')
      .orderBy('id', 'asc');

    if (cliente.length === 0) {
      return res.status(404).json({ Mensagem: "Não há clientes cadastrado no momento" })
    }

    return res.status(200).json(cliente);
  } catch (error) { return res.status(500).json({ mensagem: 'Erro interno no servidor.' }) }
};

const editarCliente = async (req, res) => {
  const { id } = req.params;
  let { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
  const cpf_Limpo = cpf.replace(/\D/g, '');

  try {
    const clienteExistente = await knex('clientes')
      .where({ id })
      .first();

    if (!clienteExistente) { return res.status(404).json({ mensagem: 'Cliente não encontrado.' }); }

    const emailCadastrado = await knex('clientes')
      .whereNot({ id })
      .andWhere({ email })
      .first();

    if (emailCadastrado) {
      return res.status(400).json({ mensagem: 'Já existe um cliente cadastrado com o e-mail informado.' });
    }

    const cpfCadastrado = await knex('clientes')
      .whereNot({ id })
      .andWhere({ cpf: cpf_Limpo })
      .first();

    if (cpfCadastrado) {
      return res.status(400).json({ mensagem: 'Já existe um cliente cadastrado com o CPF informado.' });
    }

    const clienteAtualizado = await knex('clientes')
      .where({ id })
      .update({ nome, email, cpf: cpf_Limpo, cep: !req.cep ? cep : req.cep, rua, numero: !numero ? 0 : numero, bairro, cidade, estado })
      .returning('*');

    return res.status(200).json();
  } catch (error) { return res.status(500).json({ mensagem: 'Erro interno no servidor.' }); }
};

module.exports = {
  cadastrarCliente,
  detalharCliente,
  listarClientes,
  editarCliente
}
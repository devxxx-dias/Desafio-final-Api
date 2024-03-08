const { knex } = require("../config/conexao");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const emailCadastrado = await knex('usuarios')
      .where({ email })
      .first();

    if (emailCadastrado) {
      return res.status(400).json({ mensagem: 'Já existe um usuário cadastrado com o e-mail informado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioNovo = await knex('usuarios')
      .insert({ nome, email, senha: senhaCriptografada })
      .returning(['id', 'nome', 'email']);

    if (!usuarioNovo) {
      return res.status(400).json({ Mensagem: "Usuario não cadastrado, verifique os dados inseridos" })
    }

    return res.status(201).json(usuarioNovo[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const dadosUsuario = await knex('usuarios')
      .where('email', email)
      .first();

    if (!dadosUsuario) { return res.status(401).json({ mensagem: `E-mail ou senha inválidos.` }); }

    const senhaVerifi = await bcrypt.compare(senha, dadosUsuario.senha);

    if (!senhaVerifi) { return res.status(401).json({ mensagem: `E-mail ou senha inválidos.` }); }

    const token = jwt.sign({ id: dadosUsuario.id }, process.env.SENHAHASH, { expiresIn: '8h' });

    const { senha: password, ...usuario } = dadosUsuario

    return res.status(200).json({ usuario, token });
  } catch (error) { return res.status(500).json({ Mensagem: 'Erro inesperado do sistema.' }); }
};

const editarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const emailCadastrado = await knex('usuarios')
      .where({ email })
      .where('id', '<>', req.usuario.id)
      .first();

    if (emailCadastrado) {
      return res.status(400).json({ mensagem: 'Já existe um usuário cadastrado com o e-mail informado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioNovo = await knex('usuarios')
      .update({ nome, email, senha: senhaCriptografada })
      .where({ id: req.usuario.id })
      .returning(['id', 'nome', 'email']);

    if (!usuarioNovo) {
      return res.status(400).json({ Mensagem: "Usuario não cadastrado, verifique os dados inseridos" })
    }

    return res.status(200).json();
  } catch (error) { return res.status(500).json({ mensagem: 'Erro interno no servidor.' }); }
};

const detalharUsuario = async (req, res) => {
  const { id } = req.usuario
  try {
    const usuario = await knex('usuarios')
      .select('id', 'nome', 'email')
      .where({ id })
      .first();

    if (!usuario) { return res.status(404).json({ mensagem: "Usuário não encontrado" }); }

    return res.status(200).json(usuario);
  } catch (error) { return res.status(500).json({ mensagem: "Erro interno do servidor" }); }
};

module.exports = {
  cadastrarUsuario,
  editarUsuario,
  detalharUsuario,
  loginUsuario,
};

const express = require('express');
const multer = require('../storage/multer');
const rotas = express.Router();

const { listarCategorias } = require('../controllers/categoria');
const { cadastrarUsuario, editarUsuario, detalharUsuario, loginUsuario } = require('../controllers/usuario');
const { validarJoi_Query, validarJoi_Params, validarJoi_Body } = require('../middleware/validarJoi');
const { schemaUsuario } = require('../validations/schemaUsuario');
const { cadastrarCliente, listarClientes, editarCliente, detalharCliente } = require('../controllers/clientes');
const { schemaCliente } = require('../validations/schemaCliente');
const { cadatrarPedidos, listarPedidos } = require('../controllers/pedidos');
const { schemaPedidos, schemaListarPedido } = require('../validations/schemaPedidos');
const { filtroProdutosQuery, detalharProduto, cadastrarProduto, excluirProduto, atualizarProduto } = require('../controllers/produtos');
const autenticarUsuario = require('../middleware/usuarios');
const schemaLogin = require('../validations/schemaLogin');
const schemaProdutosFiltroQuery = require('../validations/schemaProdutosFiltroQuery');
const schemaProduto = require('../validations/schemaProduto');
const schemaIdParams = require('../validations/schemaIdParams');
const validarCep = require('../middleware/validarCep');

rotas.get(`/categoria`,
    listarCategorias);

rotas.post('/usuario',
    validarJoi_Body(schemaUsuario),
    cadastrarUsuario);
rotas.post('/login',
    validarJoi_Body(schemaLogin),
    loginUsuario);
rotas.use(autenticarUsuario)
rotas.get('/usuario',
    detalharUsuario);
rotas.put('/usuario',
    validarJoi_Body(schemaUsuario),
    editarUsuario);

rotas.post('/produto',
    multer.single('produto_imagem'),
    validarJoi_Body(schemaProduto),
    cadastrarProduto);
rotas.get('/produto',
    validarJoi_Query(schemaProdutosFiltroQuery),
    filtroProdutosQuery);
rotas.get('/produto/:id',
    validarJoi_Params(schemaIdParams),
    detalharProduto);
rotas.put('/produto/:id',
    validarJoi_Params(schemaIdParams),
    multer.single('produto_imagem'),
    validarJoi_Body(schemaProduto),
    atualizarProduto);
rotas.delete('/produto/:id',
    validarJoi_Params(schemaIdParams),
    excluirProduto)

rotas.post('/cliente',
    validarJoi_Body(schemaCliente),
    validarCep,
    cadastrarCliente);
rotas.get('/cliente',
    listarClientes);
rotas.put('/cliente/:id',
    validarJoi_Params(schemaIdParams),
    validarJoi_Body(schemaCliente),
    validarCep,
    editarCliente)
rotas.get('/cliente/:id',
    validarJoi_Params(schemaIdParams),
    detalharCliente)

rotas.post('/pedido',
    validarJoi_Body(schemaPedidos),
    cadatrarPedidos)
rotas.get('/pedido',
    validarJoi_Query(schemaListarPedido),
    listarPedidos);

module.exports = {
    rotas
};


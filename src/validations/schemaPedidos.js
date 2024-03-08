const joi = require('joi');

const pedido_produtos = joi.object({
    produto_id: joi.number().positive().integer().required().strict().messages({
        'any.required': 'Insira um número válido no ID do produto.',
        'number.base': 'O ID do produto informado precisa ser um número válido',
        'number.integer': 'O ID do produto informado precisa ser um número válido',
        'number.positive': 'Informe um número maior que zero (0) no ID do produto',
    }),
    quantidade_produto: joi.number().positive().integer().required().strict().messages({
        'any.required': 'Insira um número válido na quantidade do produto.',
        'number.base': 'A quantidade de produto informada precisa ser um número válido',
        'number.integer': 'A quantidade de produto informada precisa ser um número válido',
        'number.positive': 'A menor quantidade de produto permitida é 1',
    })
});

const schemaPedidos = joi.object({
    cliente_id: joi.number().integer().positive().required().strict().messages({
        'any.required': 'Insira um número válido no ID do cliente.',
        'number.base': 'O ID do cliente informado precisa ser um número válido',
        'number.integer': 'O ID do cliente informado precisa ser um número inteiro',
        'number.positive': 'Informe um número maior que zero (0) no ID do cliente',
    }),
    observacao: joi.string().allow(null, '').empty('').messages({
        'string.base': 'O campo observação quando preenchido deve ser em texto'
    }),
    pedido_produtos: joi.array().items(pedido_produtos).min(1).required().messages({
        'any.required': 'Insira um número válido na categoria_id.',
        'array.base': 'Insira corretamente o ID do produto e sua quantidade corretamente',
        'array.min': 'É necessário ao menos um pedido em sua compra',
    }),
});

const schemaListarPedido = joi.object({
    cliente_id: joi.number().integer().positive().messages({
      'number.base': 'O ID do cliente informado precisa ser um número válido',
      'number.integer': 'O ID do cliente informado precisa ser um número inteiro',
      'number.positive': 'Informe um número maior que zero (0) no ID do cliente',
    }),
  });

module.exports = { 
    schemaPedidos, 
    schemaListarPedido 
}


const joi = require('joi');

const schemaProdutosFiltroQuery = joi.object({
    categoria_id: joi.array().single().items(joi.number().allow(null).allow('').integer().positive()).messages({
        'number.base': 'A categoria informada precisa ser um número válido',
        'number.integer': 'A categoria informada precisa ser um número válido',
        'number.positive': 'Informe um numero maior que zero(0)',
    }),
});

module.exports = schemaProdutosFiltroQuery
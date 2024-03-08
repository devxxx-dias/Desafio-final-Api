const joi = require('joi');

const schemaUsuario = joi.object({
    nome: joi.string().regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ -]+$/).trim().required().messages({
        'any.required': 'O campo nome e obrigatorio',
        'string.empty': 'O campo nome e obrigatorio',
        'string.pattern.base': 'O campo nome nao aceita numeros'

    }),
    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email não pode estar vazio',
    }),
    senha: joi.string().min(5).required().messages({
        'any.required': 'O campo senha é obrigatório',
        'string.empty': 'O campo senha não pode estar vazio',
        'string.min': 'A senha precisa conter, no mínimo, 5 caracteres',
    }),
});

module.exports = { schemaUsuario };
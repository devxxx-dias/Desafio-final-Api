const joi = require('joi');

const schemaLogin = joi.object({
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

module.exports = schemaLogin
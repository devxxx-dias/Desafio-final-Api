const joi = require('joi');
const { cpf } = require('cpf-cnpj-validator');

const schemaCliente = joi.object({
    nome: joi.string().regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ -]+$/).trim().required().messages({
        'any.required': 'O campo nome e obrigatorio',
        'string.empty': 'O campo nome e obrigatorio',
        'string.pattern.base': 'O campo nome nao aceita numeros'

    }),
    email: joi.string().required().email().messages({
        'string.email': 'O campo email precisa ter um formato válido',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email não pode estar vazio',
    }),
    cpf: joi.string().min(11).max(14).trim().required().trim().custom((entrada, invalido) => {
        if (!cpf.isValid(entrada)) {
            return invalido.error('any.invalid');
        }
        return entrada;
    }).messages({
        'any.required': 'O campo CPF e obrigatorio',
        'any.invalid': 'Digite um CPF válido',
        'string.empty': 'O campo CPF e obrigatorio',
        'string.min': 'digite os 11 digitos do seu CPF.',
        'string.max': 'Insira o seu CPF no formato 333.333.333-33'
    }),
    cep: joi.string().pattern(/^\d{5}-?\d{3}$/).trim().allow(null, '').trim().messages({
        'string.pattern.base': 'CEP inválido! O CEP deve conter 8 números e deve ter o formato XXXXX-XXX ou XXXXXXXX.'
    }),
    rua: joi.when('cep', {
        is: joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
        then: joi.string().trim().required().messages({
            'any.required': 'O campo rua é obrigatório quando o campo CEP está preenchido',
            'string.empty': 'O campo rua é obrigatório quando o campo CEP está preenchido'
        }),
        otherwise: joi.string().trim().allow(null, '')
    }).messages({}),
    numero: joi.when('cep', {
        is: joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
        then: joi.number().integer().required().messages({
            'any.required': 'O campo número precisa ser um número válido quando o CEP for preenchido.',
            'number.base': 'O número informado precisa ser válido quando o CEP for preenchido.',
            'number.integer': 'O número informado precisa ser um número inteiro quando o CEP for preenchido.',
            'number.empty': 'O campo número é obrigatório quando o campo CEP está preenchido'
        }),
        otherwise: joi.number().integer().allow(null, '').messages({
            'number.base': 'O número informado precisa ser válido',
            'number.integer': 'O número informado precisa ser um número inteiro',
        })
    }),

    bairro: joi.when('cep', {
        is: joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
        then: joi.string().trim().required().messages({
            'any.required': 'O campo bairro é obrigatório quando o campo CEP está preenchido',
            'string.empty': 'O campo bairro é obrigatório quando o campo CEP está preenchido'
        }),
        otherwise: joi.string().trim().allow(null, '')
    }).messages({}),
    cidade: joi.when('cep', {
        is: joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
        then: joi.string().trim().required().messages({
            'any.required': 'O campo cidade é obrigatório quando o campo CEP está preenchido',
            'string.empty': 'O campo cidade é obrigatório quando o campo CEP está preenchido'
        }),
        otherwise: joi.string().trim().allow(null, '')
    }).messages({}),
    estado: joi.when('cep', {
        is: joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
        then: joi.string().min(2).trim().required().messages({
            'any.required': 'O campo estado é obrigatório quando o campo CEP está preenchido',
            'string.empty': 'O campo estado é obrigatório quando o campo CEP está preenchido',
            'string.min': 'digite ao menos a sigla do seu estado'
        }),
        otherwise: joi.string().min(2).trim().allow(null, '').messages({
            'string.min': 'digite ao menos a sigla do seu estado'
        })
    })
})



module.exports = { schemaCliente };
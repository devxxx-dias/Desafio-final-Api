const joi = require('joi');

const schemaIdParams = joi.object({
    id: joi.string().pattern(/^[1-9]\d*$/).trim().required().messages({
        'any.required': 'O ID do produto precisa ser um número válido.',
        'string.empty': 'O ID do produto precisa ser informado.',
        'string.pattern.base': 'O ID do produto precisa ser um número válido e positivo.'

    }),
});

module.exports = schemaIdParams
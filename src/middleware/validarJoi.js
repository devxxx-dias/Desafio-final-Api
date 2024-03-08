const validarJoi_Body = joiSchema => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.body)
    next()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const validarJoi_Query = joiSchema => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.query)
    next()
  } catch (error) {

    return res.status(400).json({ mensagem: error.message });
  }
};

const validarJoi_Params = joiSchema => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.params)
    next()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  validarJoi_Body,
  validarJoi_Query,
  validarJoi_Params
};
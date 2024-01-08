const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().required().min(3).max(30).pattern(/^[\p{L}\s]*$/u).messages({
      'string.pattern.base': `fullName not valid`
    }),
    course: Joi.number().required().min(1).max(16),
    facebook: Joi.string().required().pattern(/^(?:https?:\/\/)?(?:www\.)?facebook\.com\/.*$/).messages({
      'string.pattern.base': `facebook not valid`
    }),
    phone: Joi.string().pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-9]|9[0-4|6-9])[0-9]{7}$/).messages({
      'string.pattern.base': `phone should be Vietnam phone number`
    }).required(),
    email: Joi.string().pattern(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).messages({
      'string.pattern.base': `only accept gmail`
    }).required(),
  }).options({ stripUnknown: true }),
  headers: Joi.object().keys({
    recaptcha: Joi.string().required()
  }).options({ stripUnknown: true })
};

const registerAdmin = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-9]|9[0-4|6-9])[0-9]{7}$/).messages({
      'string.pattern.base': `phone should be Vietnam phone number`
    }).required(),
    email: Joi.string().pattern(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).messages({
      'string.pattern.base': `only accept gmail`
    }).required(),
    course: Joi.number().required(),
    facebook: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    account: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  register,
  registerAdmin,
  login,
};

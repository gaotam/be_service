const Joi = require('joi');

const getAll = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    limit: Joi.number().positive().min(10).max(200).valid(10, 20, 50, 100),
    q: Joi.string().allow(''),
    checkin: Joi.number(),
    sortBy: Joi.string().optional().allow('updatedAt')
  }),
};

const getOne = {
  query: Joi.object().keys({
    q: Joi.string().required(),
  }),
};

const updateById = {
  params: Joi.object().keys({
    id: Joi.string().guid().required()
  }),
  body: Joi.object().keys({
    fullName: Joi.string().min(5).max(30).required(),
    phone: Joi.string().pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-9]|9[0-4|6-9])[0-9]{7}$/).messages({
      'string.pattern.base': `phone should be Vietnam phone number`
    }).required(),
    email: Joi.string().pattern(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).messages({
      'string.pattern.base': `only accept gmail`
    }).required(),
    course: Joi.number().required(),
    facebook: Joi.string().required(),
  }).options({ stripUnknown: true }),
};

module.exports = {
  getAll,
  updateById,
  getOne
};

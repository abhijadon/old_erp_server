const Joi = require('joi');

const schema = Joi.object({
  client: Joi.alternatives().try(Joi.string(), Joi.object()),
  number: Joi.number(),
  year: Joi.number(),
  status: Joi.string(),
  note: Joi.string().allow(''),
  expiredDate: Joi.date(),
  date: Joi.date(),
  // Allow additional fields not specified in the schema
}).unknown(true);

module.exports = schema;

import * as Joi from 'joi'

export const configurationValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),

  SWAGGER_TITLE: Joi.string().required(),
  SWAGGER_DESCRIPTION: Joi.string().required(),
  SWAGGER_VERSION: Joi.string().required(),
})

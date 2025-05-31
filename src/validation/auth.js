import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .messages({ 'string.email': 'Invalid email format' }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

import Joi from 'joi';

//* 'string.pattern.base' - для перевірки випадків невідповідності патерну.
//* .trim() - автоматичне прибирання пробіли з початку і кінця, щоб уникнути некоректного введення.

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(
      // eslint-disable-next-line no-useless-escape
      /^(?:\+|00)?\d{1,4}[\s\-]?(?:\(?\d{1,4}\)?[\s\-]?)?(?:\d[\s\-]?){5,10}$/,
    )
    .required()
    .messages({
      'string.base': 'Phone number should include numbers',
      'string.min': 'Phone number should have at least 3 characters',
      'string.max': 'Phone number should have at most 20 characters',
      'string.pattern.base': 'Phone number format is invalid',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .messages({ 'string.email': 'Invalid email format' }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.required': 'Contact type is required',
      'any.only': 'Contact type should be one of: work, home or personal',
    }),
});

export const patchedContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(
      // eslint-disable-next-line no-useless-escape
      /^(?:\+|00)?\d{1,4}[\s\-]?(?:\(?\d{1,4}\)?[\s\-]?)?(?:\d[\s\-]?){5,10}$/,
    )
    .messages({
      'string.base': 'Phone number should include numbers',
      'string.min': 'Phone number should have at least 3 characters',
      'string.max': 'Phone number should have at most 20 characters',
      'string.pattern.base': 'Phone number format is invalid',
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .messages({ 'string.email': 'Invalid email format' }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type should be one of: work, home or personal',
  }),
});

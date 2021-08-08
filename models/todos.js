'use strict';

const Joi = require('joi');

const schema = Joi.object({
    id: Joi.number().integer(),

    state: Joi.string()
        .allow('COMPLETE','INCOMPLETE')
        .default('INCOMPLETE'),

    description: Joi.string()
        .max(255)
        .required(),

    createdAt: Joi.date(),

    completedAt: Joi.date()
});

module.exports = schema;

'use strict';

const Joi = require('joi');

const schema = Joi.object({
    id: Joi.number().integer(),

    email: Joi.string()
        .max(255)
        .email()
        .required(),

    password: Joi.string()
        .max(255),

    name: Joi.string()
        .max(255)
        .allow(null)
});

module.exports = schema;

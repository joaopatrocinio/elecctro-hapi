'use strict';

const Knex = require('../database');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const GenerateAuthToken = require('../utils/GenerateAuthToken');

const login = async (request, h) => {

    const user = await Knex('users').where('email', request.payload.email).first();

    if (user === undefined) {
        throw Boom.forbidden('Invalid credentials');
    }

    const isValid = await Bcrypt.compare(request.payload.password, user.password);

    if (isValid) {
        return GenerateAuthToken(user.id);
    }

    throw Boom.forbidden('Invalid credentials.');
};

const create = async (request, h) => {

    const user = { ...request.payload };

    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(user.password, salt);

    user.password = hash;

    const [createdId] = await Knex('users').insert(user);

    return GenerateAuthToken(createdId);
};

const info = async (request, h) => {

    const id = request.auth.credentials.user.id;
    const user = await Knex('users').where('id', id).first();
    return {
        id: user.id,
        email: user.email,
        name: user.name
    };
};

const update = async (request, h) => {

    const id = request.auth.credentials.user.id;
    const user = await Knex('users').where('id', id).first();

    let hash;

    if (request.payload.password !== undefined) {
        const salt = await Bcrypt.genSalt(10);
        hash = await Bcrypt.hash(request.payload.password, salt);
    }

    await Knex('users')
        .where('id', id)
        .update({
            email: request.payload.email,
            password: hash !== undefined ? hash : user.password,
            name: request.payload.name
        });

    const updated = await Knex('users').where('id', id).first();
    return {
        id: updated.id,
        email: updated.email,
        name: updated.name
    };
};

module.exports = { login, create, info, update };

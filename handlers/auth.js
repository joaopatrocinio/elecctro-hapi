'use strict';

const Knex = require('../database');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const GenerateAuthToken = require('../utils/GenerateAuthToken');
const GenerateRefreshToken = require('../utils/GenerateRefreshToken');
const BlacklistRefreshToken = require('../utils/BlacklistRefreshToken');

const login = async (request, h) => {

    const user = await Knex('users').where('email', request.payload.email).first();

    if (user === undefined) {
        throw Boom.forbidden('Invalid credentials');
    }

    const isValid = await Bcrypt.compare(request.payload.password, user.password);

    if (isValid) {
        request.cookieAuth.set({
            token: GenerateRefreshToken(user.id).token,
            id: user.id
        });
        return h.response('Logged in');
    }

    throw Boom.forbidden('Invalid credentials.');
};

const create = async (request, h) => {

    const user = { ...request.payload };

    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(user.password, salt);

    user.password = hash;

    await Knex('users').insert(user);
    const [max] = await Knex('users').max('id');

    request.cookieAuth.set({
        token: GenerateRefreshToken(max).token,
        id: max
    });
    return h.response('Signup complete');
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

const sendToken = async (request, h) => {

    const client = request.redis.client;

    try {
        const val = await client.get(request.auth.credentials.token);
        if (!val) {
            return GenerateAuthToken(request.auth.credentials.user.id);
        }

        return Boom.unauthorized('Invalid auth token');
    }
    catch (err) {
        throw Boom.internal('Internal Redis error.');
    }

};

const logout = async (request, h) => {

    const token = request.auth.credentials.token;
    await BlacklistRefreshToken(request, token);
    request.cookieAuth.clear();

    return h.response('Logout');
};

module.exports = { login, create, info, update, sendToken, logout };

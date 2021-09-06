'use strict';

const Boom = require('@hapi/boom');

const blacklistRefreshToken = async (request, token) => {

    const client = request.redis.client;

    try {
        await client.set(token, 'invalid');
    }
    catch (err) {
        throw Boom.internal('Internal Redis error');
    }
};

module.exports = blacklistRefreshToken;

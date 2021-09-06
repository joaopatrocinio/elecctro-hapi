'use strict';

const Jwt = require('@hapi/jwt');

module.exports = (id) => {

    return { token: Jwt.token.generate(
        {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            user: {
                id
            } // Write user information on the token
        },
        {
            key: 'refresh_token_secret',
            algorithm: 'HS512'
        },
        {
            ttlSec: 2592000 // 1 month
        }
    ) };
};

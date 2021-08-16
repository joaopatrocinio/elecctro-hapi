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
            key: 'some_shared_secret',
            algorithm: 'HS512'
        },
        {
            ttlSec: 14400 // 4 hours
        }
    ) };
};

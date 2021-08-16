'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Jwt = require('@hapi/jwt');
const Pack = require('./package');

const init = async () => {

    const server = Hapi.server({
        port: 3001,
        host: 'localhost',
        debug: { request: ['error'] },
        routes: {
            cors: true
        }
    });

    const todosRoutes = require('./routes/todos');
    const authRoutes = require('./routes/auth');

    await server.register([
        Jwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Elecctro Server Challenge',
                    version: Pack.version
                }
            }
        }
    ]);

    server.auth.strategy('jwt_auth', 'jwt', {
        keys: 'some_shared_secret',
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: (artifacts, request, h) => {

            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload.user }
            };
        }
    });

    server.route(todosRoutes);
    server.route(authRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

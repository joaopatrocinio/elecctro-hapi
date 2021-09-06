'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Jwt = require('@hapi/jwt');
const Cookie = require('@hapi/cookie');
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
        Cookie,
        { // Swagger (documentation)
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Elecctro Server Challenge',
                    version: Pack.version
                }
            }
        },
        { // Redis
            plugin: require('hapi-redis2'),
            options: {
                settings: {
                    port: 6379, // Redis port
                    host: '127.0.0.1', // Redis host
                    family: 4, // 4 (IPv4) or 6 (IPv6)
                    password: '',
                    db: 0
                },
                decorate: true
            }
        }
    ]);

    server.auth.strategy('refresh_token', 'jwt', {
        keys: 'refresh_token_secret',
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 2592000, // 1 month
            timeSkewSec: 15
        },
        validate: (artifacts, request, h) => {

            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload.user }
            };
        }
    });

    server.auth.strategy('access_token', 'cookie', {
        cookie: {
            name: 'token',
            password: 'T0llIiSG0dBdKYBENYJOzcSSAAwieTGz',
            isSecure: false
        },
        validateFunc: (request, session) => {

            const decodedToken = Jwt.token.decode(session.token);

            try {
                Jwt.token.verify(decodedToken, 'auth_token_secret', {
                    aud: 'urn:audience:test',
                    iss: 'urn:issuer:test',
                    sub: false,
                    nbf: true,
                    exp: true,
                    maxAgeSec: 300, // 5 minutes
                    timeSkewSec: 15
                });
                return {
                    valid: true,
                    credentials: {
                        user: {
                            id: session.id
                        }
                    }
                };
            }
            catch (err) {
                return {
                    valid: false
                };
            }
        }
    });

    server.auth.default('access_token');

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

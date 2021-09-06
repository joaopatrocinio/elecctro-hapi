'use strict';

const Auth = require('../models/auth');
const AuthHandlers = require('../handlers/auth');
const Joi = require('joi');

module.exports = [
    {
        method: 'POST',
        path: '/login',
        options: {
            description: 'Login',
            notes: 'This route should receive a username and password, authenticate a user, and return a credential.',
            tags: ['api'],
            validate: {
                payload: Auth
            },
            response: {
                schema: Joi.object({
                    token: Joi.string()
                        .required()
                }),
                failAction: 'log'
            },
            auth: {
                mode: 'try'
            }
        },
        handler: AuthHandlers.login
    },
    {
        method: 'POST',
        path: '/users',
        options: {
            description: 'Signup',
            notes: 'This route should receive the user details and create a new account, returning a credential.',
            tags: ['api'],
            validate: {
                payload: Auth
            },
            response: {
                schema: Joi.object({
                    token: Joi.string()
                        .required()
                }),
                failAction: 'log'
            },
            auth: {
                mode: 'try'
            },
            cors: {
                credentials: true,
                origin: ['http://localhost:3000']
            }
        },
        handler: AuthHandlers.create
    },
    {
        method: 'GET',
        path: '/me',
        options: {
            description: 'Get user info',
            notes: 'This route should return the details of the authenticated user.',
            tags: ['api'],
            response: {
                schema: Auth,
                failAction: 'log'
            }
        },
        handler: AuthHandlers.info
    },
    {
        method: 'PATCH',
        path: '/me',
        options: {
            description: 'Update user info',
            notes: 'This route should edit the details of the authenticated user.',
            tags: ['api'],
            response: {
                schema: Auth,
                failAction: 'log'
            }
        },
        handler: AuthHandlers.update
    },
    {
        method: 'GET',
        path: '/refresh',
        options: {
            description: 'Refresh auth token',
            notes: 'This route should retrieve the refresh token and ,if valid, return an auth token.',
            tags: ['api'],
            response: {
                schema: Joi.string(),
                failAction: 'log'
            },
            auth: {
                strategies: ['refresh_token']
            }
        },
        handler: AuthHandlers.sendToken
    },
    {
        method: 'POST',
        path: '/logout',
        options: {
            description: 'Logout user',
            notes: 'This route should invalidate refresh token.',
            tags: ['api'],
            auth: {
                strategies: ['refresh_token']
            }
        },
        handler: AuthHandlers.logout
    }
];

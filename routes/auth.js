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
    }
];

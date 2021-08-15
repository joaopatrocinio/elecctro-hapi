'use strict';

const Todo = require('../models/todos');
const Joi = require('joi');
const Todos = require('../handlers/todos');

module.exports = [
    {
        method: 'POST',
        path: '/todos',
        options: {
            description: 'Insert todo',
            notes: 'This route should add an item to the to-do list.',
            tags: ['api'],
            validate: {
                payload: Todo
            },
            response: {
                schema: Todo,
                failAction: 'log'
            }
        },
        handler: Todos.insert
    },
    {
        method: 'GET',
        path: '/todos',
        options: {
            description: 'Get todos',
            notes: 'This route should list the to-do items considering the conditions imposed on the query parameters.',
            tags: ['api'],
            validate: {
                query: Joi.object({
                    filter: Joi.string()
                        .allow('ALL', 'COMPLETE','INCOMPLETE')
                        .default('ALL'),

                    orderBy: Joi.string()
                        .allow('DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT', 'DESCRIPTION-REVERSE')
                        .default('CREATED_AT')
                })
            },
            response: {
                schema: Joi.array().items(Todo),
                failAction: 'log'
            }
        },
        handler: Todos.get
    },
    {
        method: 'PATCH',
        path: '/todo/{id}',
        options: {
            description: 'Update todo',
            notes: 'This route should edit an item on the to-do list. The edited item will be referenced by id using the URL parameter id.',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .min(0)
                        .required()
                }),
                payload: Joi.object({
                    state: Joi.string()
                        .allow('COMPLETE','INCOMPLETE')
                        .default('INCOMPLETE'),

                    description: Joi.string()
                        .max(255)
                        .default('')
                }).or('state', 'description')
            },
            response: {
                schema: Todo,
                failAction: 'log'
            }
        },
        handler: Todos.update
    },
    {
        method: 'DELETE',
        path: '/todo/{id}',
        options: {
            description: 'Delete todo',
            notes: 'This route removes an item from the to-do list. The item will be referenced by id using the URL parameter id.',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number()
                        .min(0)
                        .required()
                })
            },
            response: {
                schema: Joi.array().empty(),
                failAction: 'log'
            }
        },
        handler: Todos.remove
    }
];

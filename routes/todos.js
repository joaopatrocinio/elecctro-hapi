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
                        .allow('DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT')
                        .default('CREATED_AT')
                })
            },
            response: {
                schema: Joi.array().items(Todo),
                failAction: 'log'
            }
        },
        handler: Todos.get
    }
];

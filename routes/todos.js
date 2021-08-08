'use strict';

const Todo = require('../models/todos');
const Knex = require('../database');
const Joi = require('joi');

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
        handler: async (request, h) => {

            const insertedId = await Knex('todos').insert(request.payload);
            return Knex.select().from('todos').where('id', insertedId);
        }
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
        handler: (request, h) => {

            let orderBy;

            switch (request.query.orderBy) {
                case 'DESCRIPTION': {
                    orderBy = 'description';
                    break;
                }

                case 'CREATED_AT': {
                    orderBy = 'createdAt';
                    break;
                }

                case 'COMPLETED_AT': {
                    orderBy = 'completedAt';
                    break;
                }
            }

            if (request.query.filter === 'ALL') {
                return Knex.select().from('todos').orderBy(orderBy);
            }

            return Knex.select().from('todos').where('state', request.query.filter).orderBy(orderBy);
        }
    }
];

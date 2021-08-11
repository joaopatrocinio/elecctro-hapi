'use strict';

const Knex = require('../database');
const Boom = require('@hapi/boom');

const insert = async (request, h) => {

    const insertedId = await Knex('todos').insert(request.payload);
    return Knex.select().from('todos').where('id', insertedId).first();
};

const get = (request, h) => {

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
};

const update = async (request, h) => {

    const todo = await Knex('todos').where({
        id: request.params.id
    }).first();

    if (todo === undefined) {
        throw Boom.notFound('To-do not found.');
    }

    // Only updates description if state is INCOMPLETE
    if (todo.state === 'INCOMPLETE' && request.payload.description !== '') {

        await Knex('todos').where({
            id: request.params.id
        }).update({
            description: request.payload.description
        });

        // Executes if user is updating description and state at the same time.
        if (request.payload.state === 'COMPLETE') {
            await Knex('todos').where({
                id: request.params.id
            }).update({
                state: request.payload.state,
                completedAt: request.payload.state === 'COMPLETE' ? Knex.fn.now() : null
            });
        }

        // Return To-do object
        return Knex('todos').where({
            id: request.params.id
        }).first();
    }

    // Return 400 if trying to update description of COMPLETE
    if (request.payload.description !== '') {
        throw Boom.badRequest('Updating description of COMPLETE not allowed.');
    }

    // Alter state to INCOMPLETE
    if (todo.state !== request.payload.state) {

        // Update state
        await Knex('todos').where({
            id: request.params.id
        }).update({
            state: request.payload.state,
            completedAt: request.payload.state === 'COMPLETE' ? Knex.fn.now() : null
        });

        // Return To-do object
        return Knex('todos').where({
            id: request.params.id
        }).first();
    }

    // Return 400 if updating to same state
    throw Boom.badRequest('Redundant update to same state.');
};

module.exports = { insert, get, update };

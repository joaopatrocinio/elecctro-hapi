'use strict';

const Knex = require('../database');
const Boom = require('@hapi/boom');

const insert = async (request, h) => {

    const id = request.auth.credentials.user.id;
    const insertedId = await Knex('todos').insert({ ...request.payload, user_id: id });
    return Knex.select().from('todos').where('id', insertedId).first();
};

const get = (request, h) => {

    const id = request.auth.credentials.user.id;
    let orderBy;

    switch (request.query.orderBy) {
        case 'DESCRIPTION': case 'DESCRIPTION-REVERSE': {
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
        return Knex.select()
            .from('todos')
            .where('user_id', id)
            .orderBy(orderBy, request.query.orderBy === 'DESCRIPTION-REVERSE' ? 'desc' : 'asc');
    }

    return Knex.select()
        .from('todos')
        .where('state', request.query.filter)
        .where('user_id', id)
        .orderBy(orderBy, request.query.orderBy === 'DESCRIPTION-REVERSE' ? 'desc' : 'asc');
};

const update = async (request, h) => {

    const id = request.auth.credentials.user.id;
    const todo = await Knex('todos').where({
        id: request.params.id,
        user_id: id
    }).first();

    if (todo === undefined) {
        throw Boom.notFound('To-do not found.');
    }

    // Only updates description if state is INCOMPLETE
    if (todo.state === 'INCOMPLETE' && request.payload.description !== '') {

        await Knex('todos').where({
            id: request.params.id,
            user_id: id
        }).update({
            description: request.payload.description,
            state: request.payload.state === 'COMPLETE' ? request.payload.state : todo.state,
            completedAt: request.payload.state === 'COMPLETE' ? Knex.fn.now() : todo.state
        });

        // Return To-do object
        return Knex('todos').where({
            id: request.params.id,
            user_id: id
        }).first();
    }

    // Return 400 if trying to update description of COMPLETE
    if (request.payload.description !== '' && request.payload.state === 'COMPLETE') {
        throw Boom.badRequest('Updating description of COMPLETE not allowed.');
    }

    // Alter state to INCOMPLETE
    if (todo.state !== request.payload.state) {

        // Update state
        await Knex('todos').where({
            id: request.params.id,
            user_id: id
        }).update({
            state: request.payload.state,
            completedAt: request.payload.state === 'COMPLETE' ? Knex.fn.now() : null
        });

        // Return To-do object
        return Knex('todos').where({
            id: request.params.id,
            user_id: id
        }).first();
    }

    // Return 400 if updating to same state
    throw Boom.badRequest('Redundant update to same state.');
};

const remove = async (request, h) => {

    const id = request.auth.credentials.user.id;
    const todo = await Knex('todos').where({
        id: request.params.id,
        user_id: id
    }).first();

    if (todo === undefined) {
        throw Boom.notFound('To-do not found.');
    }

    await Knex('todos').where({
        id: request.params.id,
        user_id: id
    }).del();

    return [];
};

module.exports = { insert, get, update, remove };

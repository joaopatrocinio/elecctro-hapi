'use strict';

const Knex = require('../database');

const insert = async (request, h) => {

    const insertedId = await Knex('todos').insert(request.payload);
    return Knex.select().from('todos').where('id', insertedId);
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

module.exports = { insert, get };

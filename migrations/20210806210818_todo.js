'use strict';

exports.up = function (knex) {

    return knex.schema.createTable('todos', (table) => {

        table.increments();
        table.enum('state', ['ALL', 'COMPLETE', 'INCOMPLETE']);
        table.string('description');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('completedAt').defaultTo(null);
    });
};

exports.down = function (knex) {

    return knex.schema.dropTable('todos');
};

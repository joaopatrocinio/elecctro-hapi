'use strict';

exports.up = function (knex) {

    return knex.schema.table('todos', (table) => {

        table.integer('user_id').notNullable();
        table.foreign('user_id').references('users.id');
    });
};

exports.down = function (knex) {

    return knex.schema.table('todos', (table) => {

        table.dropColumn('user_id');
        table.dropForeign('user_id');
    });
};

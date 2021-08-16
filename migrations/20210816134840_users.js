'use strict';

exports.up = function (knex) {

    return knex.schema.createTable('users', (table) => {

        table.increments();
        table.string('email').notNullable().unique();
        table.string('password');
        table.string('name');
        table.timestamps();
    });
};

exports.down = function (knex) {

    return knex.schema.dropTable('users');
};

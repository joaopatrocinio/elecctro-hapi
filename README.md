# elecctro-hapi

## Elecctro Server Challenge

The challenge is to create a simple REST API server for managing a “to-do list”. The server should be able to perform the following actions:

- List the items on the to-do list, optionally filtered by state and sorted.
- Add an item to the list.
- Edit an item on the list (i.e., change its description or mark it as complete).
- Remove an item from the list.

## Instructions

1. Install dependencies
```
npm install
```

2. Apply latest migrations to create SQLite database
```
knex migrate:latest
```

3. Run server
```
node app.js
```
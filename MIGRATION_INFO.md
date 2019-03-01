Migration files have an UP and a DOWN function.


```
UP changes the database to the new desired state.
DOWN changes the database back to the state it was previously in.
```

Console commands:

```
npm run migrate runs the UP function

npm run migrate-undo runs the DOWN function

npm run seed inserts data to the database based on seed files

npm run seed-undo deletes the seeded data
```

SequelizeMeta table contains the migration history of the database. DO NOT REMOVE IT!

Example:

If version 1.0 of database is the current one.


```
UP -> Version 1.1
UP -> Version 1.2
DOWN -> Version 1.1
UP -> Version 1.2
```

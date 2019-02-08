-Migration files have an UP and a DOWN function.

-UP changes the database to the new desired state.
-DOWN changes the database back to the state it was previously in.


Example:

If version 1.0 of database is the current one.

UP -> Version 1.1
UP -> Version 1.2
DOWN -> Version 1.1
UP -> Version 1.2


-npm run migrate runs the UP function

-npm run migrate-undo runs the DOWN function


-SequelizeMeta table contains the migration history of the database. DO NOT REMOVE IT!
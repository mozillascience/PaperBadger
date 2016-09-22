# Data Migration from badgekit-server to badgr-server

This section has its on environment file, and its own module dependencies (stated below) to avoid polluting the main app.

## How to generate the source database
Even though the _badgekit.db_ file is available directly in this folder, it was generated with: https://github.com/dumblob/mysql2sqlite and can be generated again as:

```
>./mysql2sqlite May_31_2016_362499FADFED219BBD3A417FC213E484.sql | sqlite3 badgekit.db
```

_May_31_2016_362499FADFED219BBD3A417FC213E484.sql_ is a dump of the badgekit
server used in PaperBadger.

### Investigating some of the data in the original DB

A csv file with data from badge instances can be generated from the badgekit.db
with:

```
sqlite> .header on
sqlite> .mode csv
sqlite> .once badgeinstances.csv
sqlite> select b.slug, a.* from badgeinstances a, badges b where a.badgeId=b.id;
sqlite> .exit
```

This is just to figure which parts of the info go into each table. The automated
migration created from this info can be run with `node migrateBKtoBS.js`.

## How to generate the destination database
_badges_only.local.sqlite3_ was created manually by inserting only badges
information directly through the badgr-server interface (note: this can be
automated).

## Running the script
Note that the script at _migrateBKtoBS.js_ only migrates data for badge instances.

A few packages are needed to run this script:

`npm install sqlite3 fs-extra`

Then simply:

`node migrateBKtoBS.js`

At the moment of writing, 294 instances will be migrated.

### Location of the badgr-server
The URL of the badgr-server is necessary for a number of fields in the instances
(such as where images are going to be available from). There is a _default.db.env_
file that can be customised locally as _.db.env_. Environment variables can also be used.

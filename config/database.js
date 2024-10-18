'use strict'





/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')





const DbConfig =
{



  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */

  connection: Env.get('DB_CONNECTION', 'sqlite'),



  /*
  |--------------------------------------------------------------------------
  | Sqlite
  |--------------------------------------------------------------------------
  |
  | Sqlite is a flat file database and can be a good choice for a development
  | environment.
  |
  | npm i --save sqlite3
  |
  */

  sqlite:
  {
    client: 'sqlite3',
    connection:
    {
      filename: Helpers.databasePath(`${Env.get('DB_DATABASE', 'development')}.sqlite`)
    },
    useNullAsDefault: true,
    debug: Env.get('DB_DEBUG', false)
  },



  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */

  mysql:
  {
    client: 'mysql',
    connection:
    {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    },
    debug: Env.get('DB_DEBUG', false)
  },

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */

  pg:
  {
    client: 'pg',
    connection:
    {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    },
    debug: Env.get('DB_DEBUG', false)
  },



  /*
  |--------------------------------------------------------------------------
  | SQL Server
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for SQL Server database.
  |
  | npm i --save mssql
  |
  */

  mssql:
  {
    client: 'mssql',
    connection:
    {
      host: Env.get('DB_HOST', 'localhost'),
      user: Env.get('DB_USER', 'SA'),
      password: Env.get('DB_PASSWORD', 'ccr@1234'),
      database: Env.get('DB_DATABASE', 'ccr'),
      schema: Env.get('DB_SCHEMA', 'dbo'),
      options: {
        encrypt: Env.get('DB_ENCRYPT', true),
        port: Env.get('DB_PORT', '1433'),
      },
    },
    debug: Env.get('DB_DEBUG', false)
  }





}

module.exports = DbConfig


'use strict'




/** @type {import('@adonisjs/lucid/src/Schema')} */




const Schema = use('Schema')




class TokenSchema extends Schema
{



  up ()
  {
    this.create(
      'Token', (table) =>
      {
        table.increments('Id')

        table.string   ('Token',  255)      .notNullable() .unique() .index()
        table.string   ('Type',    80)      .notNullable()
        table.boolean  ('IsRevoked'  )      .defaultTo(false)
        table.datetime ('ExpirationDate'  ) .nullable()

        table.timestamps()

        table.integer ('UserId').unsigned().references('Id').inTable('User')
      }
    )


    this.alter
    (
      'Token', (table) =>
      {
        table.renameColumn ('created_at', 'CreatedAt')
        table.renameColumn ('updated_at', 'UpdatedAt')

        // TODO: Remover estas renomeações de colunas quando tivermos solucionado
        table.renameColumn ('IsRevoked', 'is_revoked')
        table.renameColumn ('UserId', 'user_id')
      }
    )
  }



  down () {
    this.drop('Token')
  }
}


module.exports = TokenSchema

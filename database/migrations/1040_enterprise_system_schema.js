'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'EnterpriseSystem'





class EnterpriseSystemSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('EnterpriseId') .references ('Id') .inTable ('Company') .notNullable()
          table.integer ('SystemId'    ) .references ('Id') .inTable ('System' ) .notNullable()

        //#endregion

        table.timestamps()
        table.specificType ('Status', 'tinyint') .defaultTo (0)
      }
    )
  


    this.alter
    (
      TableName, (table) =>
      {
        table.renameColumn ('created_at', 'CreatedAt')
        table.renameColumn ('updated_at', 'UpdatedAt')
      }
    )
}





  down()
  {
    this.drop (TableName)
  }





}





module.exports = EnterpriseSystemSchema

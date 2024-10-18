'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'ServiceGroup'





class ServiceGroupSchema extends Schema
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

          table.integer ('Code'    ) .notNullable()   // Code / "Key": 1-999999999
          table.string  ('Name', 60) .notNullable()   // Name
          table.string  ('Nick', 20) .notNullable()   // "Label" to identify the service to the user

          table.specificType ('Description', 'nvarchar (max)') .notNullable()   // Description

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





module.exports = ServiceGroupSchema

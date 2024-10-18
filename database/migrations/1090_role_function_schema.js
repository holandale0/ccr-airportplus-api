'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'RoleFunction'





class RoleFunctionSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('RoleId'    ) .references ('Id') .inTable ('Role'    ) .notNullable()
          table.integer ('FunctionId') .references ('Id') .inTable ('Function') .notNullable()

          table.boolean ('CRUDQuery'  ) .notNullable()
          table.boolean ('CRUDInsert' ) .notNullable()
          table.boolean ('CRUDUpdate' ) .notNullable()
          table.boolean ('CRUDDelete' ) .notNullable()
          table.boolean ('CRUDExecute') .notNullable()

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





module.exports = RoleFunctionSchema

'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'Resource'





class ResourceSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('SubsidiaryId') .references ('Id') .inTable ('Company') .notNullable()
          //table.integer ('TerminalId') .references ('Id') .inTable ('Terminal') .notNullable()

          table.integer ('Code'    ) .notNullable()
          table.string  ('Name', 40) .notNullable()
          table.string  ('Nick', 20) .notNullable()

          table.specificType ('Type', 'tinyint') .defaultTo (0)   //   Type: 1=Terminal; 2=Gate; 3=Stand; 4=CheckinCounter; 5=Belt

          //table.boolean ('Gate'          ) .notNullable()
          //table.boolean ('Stand'         ) .notNullable()
          //table.boolean ('CheckinCounter') .notNullable()
          //table.boolean ('Belt'          ) .notNullable()

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





module.exports = ResourceSchema

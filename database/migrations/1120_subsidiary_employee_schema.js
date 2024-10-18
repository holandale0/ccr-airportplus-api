'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'SubsidiaryEmployee'





class SubsidiaryEmployeeSchema extends Schema
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
          table.integer ('SubsidiaryId') .references ('Id') .inTable ('Company') .notNullable()

          table.integer ('Code'    ) .notNullable()
          table.string  ('Name', 60) .notNullable()
          table.string  ('Job' , 20) .notNullable()

          table.biginteger ('Finance') .notNullable()   // Finance code: 1-999999999999

          table.boolean ('Enabled'  ) .notNullable()   // Employee is enabled?
          table.date    ('BeginDate') .nullable()      // Availabilaty begin date
          table.date    ('EndDate'  ) .nullable()      // Availabilaty end date

        //#endregion

        table.timestamps()
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





module.exports = SubsidiaryEmployeeSchema

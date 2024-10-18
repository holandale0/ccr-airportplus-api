'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'ServiceEnterprise'





class ServiceEnterpriseSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('EnterpriseId'  ) .references ('Id') .inTable ('Company'     ) .notNullable()   // Enterprise Id at Company
          table.integer ('ServiceGroupId') .references ('Id') .inTable ('ServiceGroup') .notNullable()   // Service Group Id at ServiceGroup

          table.integer ('Code'    ) .notNullable()   // Code / "Key": 1-999999999
          table.string  ('Name', 60) .notNullable()   // Name
          table.string  ('Nick', 20) .notNullable()   // "Label" to identify the service to the user

          table.boolean ('Integer'  ) .notNullable()   // Measured as an Integer number?
          table.boolean ('Decimal'  ) .notNullable()   // Measured as a Decimal number?
          table.boolean ('Flag'     ) .notNullable()   // Measured as a flag?
          table.boolean ('DateBegin') .notNullable()   // Measured as a date?
          table.boolean ('DateEnd'  ) .notNullable()   // Measured as a date?

          table.string     ('Comments', 20) .notNullable()   // Measure unity
          table.biginteger ('Account'     ) .notNullable()   // Financial account: 1-999999999999

          table.boolean ('Enabled'  ) .notNullable()   // Service is enabled?
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





module.exports = ServiceEnterpriseSchema

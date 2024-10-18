'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'ServiceSubsidiary'





class ServiceSubsidiarySchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('EnterpriseId'       ) .references ('Id') .inTable ('Company'          ) .notNullable()   // Enterprise Id at Company
          table.integer ('SubsidiaryId'       ) .references ('Id') .inTable ('Company'          ) .notNullable()   // Subsidiary Id at Company
          table.integer ('ServiceEnterpriseId') .references ('Id') .inTable ('ServiceEnterprise') .notNullable()   // Service Enterprise Id at ServiceEnterprise

          //table.integer ('Code'    ) .notNullable()   // Code / "Key": 1-999999999
          //table.string  ('Name', 60) .notNullable()   // Name
          //table.string  ('Nick', 20) .notNullable()   // "Label" to identify the service to the user

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





module.exports = ServiceSubsidiarySchema

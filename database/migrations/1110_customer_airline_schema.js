'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'CustomerAirline'





class CustomerAirlineSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('CustomerId') .references ('Id') .inTable ('Company') .notNullable()
          table.integer ('AirlineId') .references ('Id') .inTable ('Company') .notNullable()

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





module.exports = CustomerAirlineSchema

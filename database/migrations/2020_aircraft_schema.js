'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'Aircraft'





class AircraftSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

        table.integer ('Code'    ) .unique() .notNullable()
        table.string  ('Name', 60) .unique() .notNullable()

        table.string  ('IATA',  2) .unique() .notNullable()
        table.string  ('ICAO',  3) .unique() .notNullable()

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





module.exports = AircraftSchema

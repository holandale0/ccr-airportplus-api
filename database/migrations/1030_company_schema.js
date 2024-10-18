'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'Company'





class CompanySchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('Code')     .unique() .notNullable()
          table.string  ('Name', 60)           .notNullable() // .unique()
          table.string  ('Nick', 20)           .notNullable() // .unique()

          table.boolean ('Enterprise' ) .notNullable()
          table.boolean ('Subsidiary' ) .notNullable()
          table.boolean ('Airport'    ) .notNullable()
          table.boolean ('Customer'   ) .notNullable()
          table.boolean ('Airline'    ) .notNullable()
          table.boolean ('Transporter') .notNullable()

          table.string  ('IATA', 5) .nullable()
          table.string  ('ICAO', 5) .nullable()

          table.string  ('Address'     , 50) .nullable()
          table.integer ('Number'          ) .nullable()
          table.string  ('Complement'  , 30) .nullable()
          table.string  ('Neighborhood', 40) .nullable()
          table.string  ('City'        , 40) .notNullable()
          table.string  ('State'       , 40) .notNullable()
          table.string  ('Country'     , 40) .notNullable()
          table.string  ('Region'      , 40) .notNullable()
          table.string  ('PostalCode'  , 10) .nullable()

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





module.exports = CompanySchema

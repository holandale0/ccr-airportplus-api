'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'APIIntegration'





class APIIntegrationSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('EnterpriseId') .references ('Id') .inTable ('Company' ) .notNullable()
          table.integer ('AirportId'   ) .references ('Id') .inTable ('Company' ) .notNullable()

          table.integer ('Code'    ) .notNullable()   // Code: 1-999999999
          table.string  ('Name', 60) .notNullable()   // Name
          table.string  ('Nick', 20) .notNullable()   // Nick name

          table.boolean      ('DayBefore'          ) .notNullable()   // 
          table.boolean      ('DayAfter'           ) .notNullable()   // 
          table.specificType ('Interval', 'tinyint') .notNullable()   // Interval of execution (minutes): 1-255

          table.boolean ('CRUDInsert' ) .notNullable()
          table.boolean ('CRUDUpdate' ) .notNullable()

          table.specificType ('Filter'       , 'nvarchar (max)') .notNullable()   // Update filter flight management
          table.specificType ('Source'       , 'tinyint'       ) .notNullable()   // API Source: 0=invalid; 1=Aviation Stacj; 2=Aviation Edge
          table.specificType ('APIURL'       , 'nvarchar (max)') .notNullable()   // API URL
          table.datetime     ('LastExecution'                  ) .nullable()      // Date / Time of last execution

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





module.exports = APIIntegrationSchema

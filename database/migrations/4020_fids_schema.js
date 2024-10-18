'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'FIDS'





class FIDSSchema extends Schema
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
          table.integer ('SubsidiaryId') .references ('Id') .inTable ('Company' ) .notNullable()

          table.integer      ('Code'                         )           .notNullable()   // Code / Key: 1-999999999
          table.string       ('Name'       ,               60)           .notNullable()   // Name
          table.specificType ('Description', 'nvarchar (max)')           .notNullable()   // Description
          table.string       ('Token'      ,               20) .unique() .notNullable()   // Exclusive token: letters and digits
          table.specificType ('Refresh'    , 'tinyint'       )           .notNullable()   // Screen refresh in seconds: 0-255
          table.specificType ('Type'       , 'tinyint'       )           .notNullable()   // Type: 1=List;

          table.specificType ('SQLCommand', 'nvarchar (max)') .notNullable()   // SQL Select command

        //#endregion

        table.timestamps()
        table.specificType ('Status', 'tinyint') .defaultTo (0)   // Active, Blocked, Canceled
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





module.exports = FIDSSchema

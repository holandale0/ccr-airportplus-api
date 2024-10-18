'use strict'





/** @type {import('@adonisjs/lucid/src/Schema')} */





const Schema    = use ('Schema')
const TableName = 'User'





class UserSchema extends Schema
{





  up()
  {
    this.create
    (
      TableName, (table) =>
      {
        table.increments ('Id')

        //#region UP

          table.integer ('Code'        ) .unique() .notNullable()
          table.string  ('Name'    , 60)           .notNullable()
          table.string  ('Nick'    , 20)           .nullable()
          table.string  ('Email'   , 50) .unique() .notNullable()
          table.string  ('Password', 60)           .notNullable()
          table.string  ('HashCode'    )           .nullable()

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





module.exports = UserSchema





// 'use strict'

// /** @type {import('@adonisjs/lucid/src/Schema')} */
// const Schema = use('Schema')

// class UserSchema extends Schema {
//   up () {
//     this.create('users', (table) => {
//       table.increments()
//       table.string('username',    80).notNullable().unique()
//       table.string('email',       254).notNullable().unique()
//       table.string('password',    60).notNullable()
//       table.timestamps()
//     })
//   }

//   down () {
//     this.drop('users')
//   }
// }

// module.exports = UserSchema

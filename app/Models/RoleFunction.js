'use strict'





/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */





const Model = use ('Model')





class RoleFunction extends Model
{

  static get table()             { return 'RoleFunction' }
  static get primaryKey()        { return 'Id'           }
  static get createdAtColumn()   { return 'CreatedAt'    }
  static get updatedAtColumn()   { return 'UpdatedAt'    }

}





module.exports = RoleFunction

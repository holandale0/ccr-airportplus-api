'use strict'





/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */





const Model = use ('Model')





class Company extends Model
{

  static get table()             { return 'Company'   }
  static get primaryKey()        { return 'Id'        }
  static get createdAtColumn()   { return 'CreatedAt' }
  static get updatedAtColumn()   { return 'UpdatedAt' }

}





module.exports = Company

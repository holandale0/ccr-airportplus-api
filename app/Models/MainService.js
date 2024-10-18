'use strict'





/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */





const Model = use ('Model')





class MainService extends Model 
{

  static get table()             { return 'MainService'}
  static get primaryKey()        { return 'Id'         }
  static get createdAtColumn()   { return 'CreatedAt'  }
  static get updatedAtColumn()   { return 'UpdatedAt'  }

}





module.exports = MainService

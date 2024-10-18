'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {

  static get table()                  { return 'Token'          }
  static get primaryKey()             { return 'Id'             }
  static get createdAtColumn()        { return 'CreatedAt'      }
  static get updatedAtColumn()        { return 'UpdatedAt'      }
  static get expirationDateColumn()   { return 'ExpirationDate' }
}

module.exports = Token

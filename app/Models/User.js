'use strict'





/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */





const Model = use ('Model')





/** @type {import('@adonisjs/framework/src/Hash')} */





const Hash = use('Hash')





class User extends Model
{


  static get table()             { return 'User'      }
  static get primaryKey()        { return 'Id'        }
  static get codeColumn()        { return 'Code'      }
  static get nameColumn()        { return 'Name'      }
  static get nickColumn()        { return 'Nick'      }
  static get emailColumn()       { return 'Email'     }
  static get passwordColumn()    { return 'Password'  }
  static get hashCodeColumn()    { return 'HashCode'  }
  static get createdAtColumn()   { return 'CreatedAt' }
  static get updatedAtColumn()   { return 'UpdatedAt' }
  static get statusColumn()      { return 'Status'    }





  static boot()
  {

    super.boot()

    this.addHook
    (
      'beforeSave', async (userInstance) =>
      {
        if (userInstance.dirty.Password)
        {
          userInstance.Password = await Hash.make (userInstance.Password)
        }
      }
    )
  }





  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */

  tokens()
  {
    return this.hasMany('App/Models/Token')
  }





}





module.exports = User

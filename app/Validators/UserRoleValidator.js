'use strict'





const Message = use ('App/Models/Utils/Messages')





class UserRoleValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      UserId: 'required',
      RoleId: 'required',
    }

  }



  

  get messages() 
  {

    return {
      'UserId.required': Message.UserRequired,
      'RoleId.required': Message.RoleRequired,
    }

  }





}





module.exports = UserRoleValidator
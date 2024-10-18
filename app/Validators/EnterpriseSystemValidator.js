'use strict'





const Message = use ('App/Models/Utils/Messages')





class EnterpriseSystemValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      SystemId    : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'SystemId.required'    : Message.SystemRequired
    }

  }





}





module.exports = EnterpriseSystemValidator
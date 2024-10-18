'use strict'





const Message = use ('App/Models/Utils/Messages')





class ServiceGroupValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',

      Code: 'required',
      Name: 'required',
      Nick: 'required',

      Description: 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,

      'Code.required': Message.KEYREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      'Nick.required': Message.LABELREQUIRED,

      'Description.required': Message.DESCRIPTIONREQUIRED
    }

  }





}





module.exports = ServiceGroupValidator

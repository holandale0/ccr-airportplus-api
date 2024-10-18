'use strict'





const Message = use ('App/Models/Utils/Messages')





class FunctionValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      SystemId: 'required',

      Code: 'required',
      Name: 'required'
    }

  }



  

  get messages() 
  {

    return {
      'SystemId.required': Message.SystemRequired,

      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED
    }

  }





}





module.exports = FunctionValidator

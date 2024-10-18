'use strict'





const Message = use ('App/Models/Utils/Messages')





class MainServiceValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      Code: 'required',
      Name: 'required'
    }

  }



  

  get messages() 
  {

    return {
      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED
    }

  }





}





module.exports = MainServiceValidator

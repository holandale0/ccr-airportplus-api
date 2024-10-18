'use strict'





const Message = use ('App/Models/Utils/Messages')





class RoleValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      //---EnterpriseId: 'required',
      //---SubsidiaryId: 'required',

      Code: 'required',
      Name: 'required',
    }

  }



  

  get messages() 
  {

    return {
      //---'EnterpriseId.required': Message.EnterpriseRequired,
      //---'SubsidiaryId.required': Message.SubsidiaryRequired,

      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
    }

  }





}





module.exports = RoleValidator
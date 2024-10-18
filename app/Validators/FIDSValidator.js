'use strict'





const Message = use ('App/Models/Utils/Messages')





class FIDSValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      SubsidiaryId: 'required',

      Code       : 'required',
      Name       : 'required',
      Description: 'required',
      Token      : 'required',
      Refresh    : "required",
      Type       : "required",

      SQLCommand : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'SubsidiaryId.required': Message.SubsidiaryRequired,

      'Code.required'       : Message.CODEREQUIRED,
      'Name.required'       : Message.NAMEREQUIRED,
      'Description.required': Message.DESCRIPTIONREQUIRED,
      'Token.required'      : Message.TOKENREQUIRED,
      'Refresh.required'    : Message.REFRESHREQUIRED,
      'Type.required'       : Message.TYPEREQUIRED,

      'SQLCommand.required' : Message.SQLCOMMANDREQUIRED
    }

  }





}





module.exports = FIDSValidator

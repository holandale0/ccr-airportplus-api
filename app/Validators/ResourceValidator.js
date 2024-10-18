'use strict'





const Message = use ('App/Models/Utils/Messages')





class ResourceValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      SubsidiaryId: 'required',
      //TerminalId: 'required',

      Code: 'required',
      Name: 'required',
      Nick: 'required',

      Type: 'required'

      //Gate          : 'required',
      //Stand         : 'required',
      //CheckinCounter: 'required',
      //Belt          : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'SubsidiaryId.required': Message.SubsidiaryRequired,
      //'TerminalId.required': Message.TERMINALREQUIRED,

      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      'Nick.required': Message.NICKREQUIRED,

      'Type.required': Message.TYPEREQUIRED

      //'Gate.required'          : Message.GATEREQUIRED,
      //'Stand.required'         : Message.STANDREQUIRED,
      //'CheckinCounter.required': Message.CHECKINCOUNTERREQUIRED,
      //'Belt.required'          : Message.BELTRREQUIRED
    }

  }





}





module.exports = ResourceValidator
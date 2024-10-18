'use strict'





const Message = use ('App/Models/Utils/Messages')





class ServiceEnterpriseValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId  : 'required',
      ServiceGroupId: 'required',

      Code: 'required',
      Name: 'required',
      Nick: 'required',

      Integer  : 'required',
      Decimal  : 'required',
      Flag     : 'required',
      DateBegin: 'required',
      DateEnd  : 'required',

      Comments: 'required',
      Account : 'required',

      Enabled  : 'required',
      BeginDate: 'required',
      EndDate  : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required'  : Message.EnterpriseRequired,
      'ServiceGroupId.required': Message.SERVICEGROUPREQUIRED,

      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      'Nick.required': Message.LABELREQUIRED,

      'Integer.required'  : Message.INTEGERREQUIRED,
      'Decimal.required'  : Message.DECIMALREQUIRED,
      'Flag.required'     : Message.FLAGREQUIRED,
      'DateBegin.required': Message.DATEBEGINREQUIRED,
      'DateEnd.required'  : Message.DATEENDREQUIRED,

      'Comments.required': Message.COMMENTSREQUIRED,
      'Account.required' : Message.ACCOUNTREQUIRED,

      'Enabled.required'  : Message.ENABLEDREQUIRED,
      'BeginDate.required': Message.BEGINDATEREQUIRED,
      'EndDate.required'  : Message.ENDDATEREQUIRED
    }

  }





}





module.exports = ServiceEnterpriseValidator

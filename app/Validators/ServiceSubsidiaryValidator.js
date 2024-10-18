'use strict'





const Message = use ('App/Models/Utils/Messages')





class ServiceSubsidiaryValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId       : 'required',
      SubsidiaryId       : 'required',
      ServiceEnterpriseId: 'required',

      //Code: 'required',
      //Name: 'required',
      //Nick: 'required',

      Enabled  : 'required',
      BeginDate: 'required',
      EndDate  : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required'       : Message.EnterpriseRequired,
      'SubsidiaryId.required'       : Message.SubsidiaryRequired,
      'ServiceEnterpriseId.required': Message.SERVICEENTERPRISEREQUIRED,

      //'Code.required': Message.CODEREQUIRED,
      //'Name.required': Message.NAMEREQUIRED,
      //'Nick.required': Message.LABELREQUIRED,

      'Enabled.required'  : Message.ENABLEDREQUIRED,
      'BeginDate.required': Message.BEGINDATEREQUIRED,
      'EndDate.required'  : Message.ENDDATEREQUIRED
    }

  }





}





module.exports = ServiceSubsidiaryValidator

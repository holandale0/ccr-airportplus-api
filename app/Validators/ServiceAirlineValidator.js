'use strict'





const Message = use ('App/Models/Utils/Messages')





class ServiceAirlineValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId       : 'required',
      SubsidiaryId       : 'required',
      AirlineId          : 'required',
      ServiceSubsidiaryId: 'required',

      //Code: 'required',
      //Name: 'required',
      //Nick: 'required',

      Priority: 'required',

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
      'AirlineId.required'          : Message.AirlineRequired,
      'ServiceSubsidiaryId.required': Message.ServiceSubsidiaryRequired,

      //'Code.required': Message.CODEREQUIRED,
      //'Name.required': Message.NAMEREQUIRED,
      //'Nick.required': Message.LABELREQUIRED,

      'Priority.required': Message.PRIORITYREQUIRED,

      'Enabled.required'  : Message.ENABLEDREQUIRED,
      'BeginDate.required': Message.BEGINDATEREQUIRED,
      'EndDate.required'  : Message.ENDDATEREQUIRED
    }

  }





}





module.exports = ServiceAirlineValidator

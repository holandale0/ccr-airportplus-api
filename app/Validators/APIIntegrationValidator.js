'use strict'





const Message = use ('App/Models/Utils/Messages')





class APIIntegrationValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      AirportId   : 'required',

      Code: 'required',
      Name: 'required',
      Nick: 'required',

      DayBefore: 'required',
      DayAfter : 'required',
      Interval : 'required',

      CRUDInsert: 'required',
      CRUDUpdate: 'required',

      Filter: 'required',
      Source: 'required',
      APIURL: "required",

      Enabled  : 'required',
      BeginDate: 'required',
      EndDate  : 'required'
    }

  }


  


  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'AirportId.required'   : Message.AirportRequired,

      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      'Nick.required': Message.KEYREQUIRED,

      'DayBefore.required': Message.DayBeforeRequired,
      'DayAfter.required' : Message.DayAfterRequired,
      'Interval.required' : Message.IntervalRequired,
      
      'CRUDInsert.required': Message.CRUDINSERTREQUIRED,
      'CRUDUpdate.required': Message.CRUDUPDATEREQUIRED,

      'Filter.required': Message.FilterRequired,
      'Source.required': Message.SourceRequired,
      'APIURL.required': Message.APIURLRequired,

      'Enabled.required'  : Message.ENABLEDREQUIRED,
      'BeginDate.required': Message.BEGINDATEREQUIRED,
      'EndDate.required'  : Message.ENDDATEREQUIRED
    }

  }





}





module.exports = APIIntegrationValidator

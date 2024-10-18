'use strict'





const Message = use ('App/Models/Utils/Messages')





class OriginDestinationValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      SubsidiaryId: 'required',
      AirportId   : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'SubsidiaryId.required': Message.SubsidiaryRequired,
      'AirportId.required'   : Message.AirportRequired
    }

  }





}





module.exports = OriginDestinationValidator
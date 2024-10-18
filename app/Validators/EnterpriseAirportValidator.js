'use strict'





const Message = use ('App/Models/Utils/Messages')





class EnterpriseAirportValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      AirportId   : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'AirportId.required'   : Message.AirportRequired
    }

  }





}





module.exports = EnterpriseAirportValidator
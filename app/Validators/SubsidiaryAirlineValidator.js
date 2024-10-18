'use strict'





const Message = use ('App/Models/Utils/Messages')





class SubsidiaryAirlineValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      SubsidiaryId: 'required',
      AirlineId   : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'SubsidiaryId.required': Message.SubsidiaryRequired,
      'AirlineId.required'   : Message.AirlineRequired
    }

  }





}





module.exports = SubsidiaryAirlineValidator
'use strict'





const Message = use ('App/Models/Utils/Messages')





class EnterpriseSubsidiaryValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      SubsidiaryId: 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'SubsidiaryId.required': Message.SubsidiaryRequired
    }

  }





}





module.exports = EnterpriseSubsidiaryValidator
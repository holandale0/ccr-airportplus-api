'use strict'





const Message = use ('App/Models/Utils/Messages')





class SubsidiaryEmployeeValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',
      SubsidiaryId: 'required',

      Code: 'required',
      Name: 'required',
      Job : 'required',

      Finance : 'required',

      Enabled  : 'required',
      BeginDate: 'required',
      EndDate  : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,
      'SubsidiaryId.required': Message.SubsidiaryRequired,

      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      'Job.required' : Message.JobRequired,

      'Finance.required' : Message.FinanceRequired,

      'Enabled.required'  : Message.ENABLEDREQUIRED,
      'BeginDate.required': Message.BEGINDATEREQUIRED,
      'EndDate.required'  : Message.ENDDATEREQUIRED
    }

  }





}





module.exports = SubsidiaryEmployeeValidator
'use strict'





const Message = use ('App/Models/Utils/Messages')





class RoleFunctionValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      RoleId    : 'required',
      FunctionId: 'required',

      CRUDQuery  : 'required',
      CRUDInsert : 'required',
      CRUDUpdate : 'required',
      CRUDDelete : 'required',
      CRUDExecute: 'required'
    }

  }



  

  get messages() 
  {

    return {
      'RoleId.required'    : Message.RoleRequired,
      'FunctionId.required': Message.FunctionRequired,

      'CRUDQuery.required'  : Message.CRUDQueryRequired,
      'CRUDInsert.required' : Message.CRUDInsertRequired,
      'CRUDUpdate.required' : Message.CRUDUpdateRequired,
      'CRUDDelete.required' : Message.CRUDDeleteRequired,
      'CRUDExecute.required': Message.CRUDExecuteRequired
    }

  }





}





module.exports = RoleFunctionValidator
'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const RoleFunctionModel = use ('App/Models/RoleFunction')
const RoleModel         = use ('App/Models/Role'        )
const FunctionModel     = use ('App/Models/Function'    )

//#endregion





/**
 * Resourceful controller for interacting with RoleFunction
 */

class RoleFunctionController
{





  /**
   * Show a list of all RoleFunctions.
   * GET rolefunction
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async index ({ request, response, view })
  {

    try
    {
      const Query = request.get()

      //if (typeof (Query.SystemId    ) === "undefined")   { Query.SystemId     = 0 }
      if (typeof (Query.EnterpriseId) === "undefined")   { Query.EnterpriseId = 0 }
      if (typeof (Query.SubsidiaryId) === "undefined")   { Query.SubsidiaryId = 0 }
      if (typeof (Query.RoleId      ) === "undefined")   { Query.RoleId       = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.RoleId) === 0)   { return RoleFunctionModel.all() }
      //---else
      //---{
      //---  return await Database .table ('RoleFunction') .select ('*') .where ('RoleId', parseInt (Query.RoleId))
      //---}


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por System */

      // if (parseInt (Query.SystemId) !== 0 && parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.RoleId) === 0)
      // {
      //   ResultList = await DBQuery
      //     .where ('System.Id', parseInt (Query.SystemId))
      //     .orderBy ('Enterprise.Name')
      //     .orderBy ('Subsidiary.Name'   )
      //     .orderBy ('Role.Name'      )
      //     .orderBy ('Function.Name'  )
      // }

      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.RoleId) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.Name')
          .orderBy ('Role.Name'      )
          .orderBy ('Function.Name'  )
      }

      /* Filtro por Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.RoleId) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .where ('Subsidiary.Id', parseInt (Query.SubsidiaryId))
          .orderBy ('Role.Name'    )
          .orderBy ('Function.Name')
      }

      /* Filtro por Role */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.RoleId) !== 0)
      {
        ResultList = await DBQuery
        .where ('Enterprise.Id'      , parseInt (Query.EnterpriseId))
        .where ('Subsidiary.Id'      , parseInt (Query.SubsidiaryId))
        .where ('RoleFunction.RoleId', parseInt (Query.RoleId      ))
        .orderBy ('Function.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name')
          .orderBy ('Subsidiary.Name')
          .orderBy ('Role.Name'      )
          .orderBy ('Function.Name'  )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single RoleFunction.
   * GET rolefunction/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async show ({ params, request, response, view })
  {

    try
    {
      //---return await RoleFunctionModel.findBy ({ 'RoleId': parseInt (params.RoleId), 'FunctionId': parseInt (params.FunctionId) })

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('RoleFunction.Id', parseInt (params.id))

      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /* Monta os parâmetros para acesso ao banco */

  SelectFields()
  {

    return Database 
      .table ('RoleFunction') 
      .select
      ( 
        "RoleFunction.*",

        "Role.EnterpriseId as RoleEnterpriseId",
        "Role.SubsidiaryId as RoleSubsidiaryId",
        "Role.Code         as RoleCode",
        "Role.Name         as RoleName",
        "Role.Status       as RoleStatus",

        "Enterprise.Code   as EnterpriseCode",
        "Enterprise.Name   as EnterpriseName",
        "Enterprise.Nick   as EnterpriseNick",
        "Enterprise.Status as EnterpriseStatus",

        "Subsidiary.Code    as SubsidiaryCode",
        "Subsidiary.Name    as SubsidiaryName",
        "Subsidiary.Nick    as SubsidiaryNick",
        "Subsidiary.IATA    as SubsidiaryIATA",
        "Subsidiary.ICAO    as SubsidiaryICAO",
        "Subsidiary.City    as SubsidiaryCity",
        "Subsidiary.State   as SubsidiaryState",
        "Subsidiary.Country as SubsidiaryCountry",
        "Subsidiary.Region  as SubsidiaryRegion",
        "Subsidiary.Status  as SubsidiaryStatus",

        "Function.SystemId as FunctionSystemId",
        "Function.Code     as FunctionCode",
        "Function.Name     as FunctionName",
        "Function.Status   as FunctionStatus",

        "System.Code   as SystemCode",
        "System.Name   as SystemName",
        "System.Status as SystemStatus"
      )
      .innerJoin ("Role"                 , "Role.Id"      , "RoleFunction.RoleId"    )
      .leftJoin  ("Company as Enterprise", "Enterprise.Id", "Role.EnterpriseId"      )
      .leftJoin  ("Company as Subsidiary", "Subsidiary.Id", "Role.SubsidiaryId"      )
      .innerJoin ("Function"             , "Function.Id"  , "RoleFunction.FunctionId")
      .innerJoin ("System"               , "System.Id"    , "Function.SystemId"      )

  }





  //* Monta os objetos e limpa os campos individuais */

  async MontarObjetos (ResultList)
  {

    for (let Actual = 0; Actual < ResultList.length; Actual++)
    {
      ResultList [Actual] .StatusName = Status.StatusName [ResultList [Actual] .Status]


      ResultList [Actual] .Role = 
      {
        "EnterpriseId": ResultList [Actual] .RoleEnterpriseId,
        "SubsidiaryId": ResultList [Actual] .RoleSubsidiaryId,
        "Code"        : ResultList [Actual] .RoleCode,
        "Name"        : ResultList [Actual] .RoleName,
        "Status"      : ResultList [Actual] .RoleStatus,
        "StatusName"  : Status.StatusName [ResultList [Actual] .RoleStatus]
      }

      delete ResultList [Actual] .RoleEnterpriseId
      delete ResultList [Actual] .RoleSubsidiaryId
      delete ResultList [Actual] .RoleCode
      delete ResultList [Actual] .RoleName
      delete ResultList [Actual] .RoleStatus


      ResultList [Actual] .Enterprise = 
      {
        "Code"      : ResultList [Actual] .EnterpriseCode,
        "Name"      : ResultList [Actual] .EnterpriseName,
        "Nick"      : ResultList [Actual] .EnterpriseNick,
        "Status"    : ResultList [Actual] .EnterpriseStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .EnterpriseStatus]
      }

      delete ResultList [Actual] .EnterpriseCode
      delete ResultList [Actual] .EnterpriseName
      delete ResultList [Actual] .EnterpriseNick
      delete ResultList [Actual] .EnterpriseStatus


      ResultList [Actual] .Subsidiary =
      {
        "Code"      : ResultList [Actual] .SubsidiaryCode,
        "Name"      : ResultList [Actual] .SubsidiaryName,
        "Nick"      : ResultList [Actual] .SubsidiaryNick,
        "IATA"      : ResultList [Actual] .SubsidiaryIATA,
        "ICAO"      : ResultList [Actual] .SubsidiaryICAO,
        "City"      : ResultList [Actual] .SubsidiaryCity,
        "State"     : ResultList [Actual] .SubsidiaryState,
        "Country"   : ResultList [Actual] .SubsidiaryCountry,
        "Region"    : ResultList [Actual] .SubsidiaryRegion,
        "Status"    : ResultList [Actual] .SubsidiaryStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .SubsidiaryStatus]
      }

      delete ResultList [Actual] .SubsidiaryCode
      delete ResultList [Actual] .SubsidiaryName
      delete ResultList [Actual] .SubsidiaryNick
      delete ResultList [Actual] .SubsidiaryIATA
      delete ResultList [Actual] .SubsidiaryICAO
      delete ResultList [Actual] .SubsidiaryCity
      delete ResultList [Actual] .SubsidiaryState
      delete ResultList [Actual] .SubsidiaryCountry
      delete ResultList [Actual] .SubsidiaryRegion
      delete ResultList [Actual] .SubsidiaryStatus


      ResultList [Actual] .Function = 
      {
        "SystemId"  : ResultList [Actual] .FunctionSystemId,
        "Code"      : ResultList [Actual] .FunctionCode,
        "Name"      : ResultList [Actual] .FunctionName,
        "Status"    : ResultList [Actual] .FunctionStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .FunctionStatus]
      }

      delete ResultList [Actual] .FunctionSystemId
      delete ResultList [Actual] .FunctionCode
      delete ResultList [Actual] .FunctionName
      delete ResultList [Actual] .FunctionStatus


      ResultList [Actual] .System = 
      {
        "Code"      : ResultList [Actual] .SystemCode,
        "Name"      : ResultList [Actual] .SystemName,
        "Status"    : ResultList [Actual] .SystemStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .SystemStatus]
      }

      delete ResultList [Actual] .SystemCode
      delete ResultList [Actual] .SystemName
      delete ResultList [Actual] .SystemStatus
    }


    return ResultList

  }





  /**
   * Create/save a new RoleFunction.
   * POST rolefunction
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async store ({ request, response })
  {

    try
    {
      const body = request.body


      /* Demais validações */

      const RecordValidation = await this.ValidateAll (request)

      if (RecordValidation.length > 0)   { return response.badRequest (RecordValidation) }


      /* Grava no banco */

      await this.StoreDatabase (body)


      return response.created ({ code: 201, msg: Message.RECORDINCLUDED })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Update RoleFunction details.
   * PUT rolefunction/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async update ({ params, request, response })
  {

    try 
    {
      let body = request.body


      /* Valida o ID */

      let RecordUpdate = await RoleFunctionModel.find (params.id)

      if (! RecordUpdate)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Demais validações */

      const RecordValidation = await this.ValidateAll (request, params)

      if (RecordValidation.length > 0)   { return response.badRequest (RecordValidation) }


      /* Grava no banco */

      await this.UpdateDatabase (body, RecordUpdate)


      return response.ok ({ code: 200, msg: Message.RECORDUPDATED })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  async ValidateAll (request, params)
  {

    const body = request.body

    let RegisterExists = new RoleFunctionModel()
    let ResponseBody   = []


    //#region VALIDATION


      /* Valida Role */

      if (typeof (body.RoleId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.RoleInteger })
      }
      else if (parseInt (body.RoleId) < 1 || parseInt (body.RoleId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.RoleRange })
      }
      else
      {
        RegisterExists = await RoleModel.find (body.RoleId)

        if (RegisterExists)
        {
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.RoleStatus }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.RoleNotFound })
        }
      }

      /* Valida Function */

      if (typeof (body.FunctionId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.FunctionInteger })
      }
      else if (parseInt (body.FunctionId) < 1 || parseInt (body.FunctionId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.FunctionRange })
      }
      else
      {
        RegisterExists = await FunctionModel.find (body.FunctionId)

        if (RegisterExists)
        {
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.FunctionStatus }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.FunctionNotFound })
        }
      }

      /* Verifica os IDs */

      RegisterExists = await RoleFunctionModel.findBy ({ 'RoleId': parseInt (body.RoleId), 'FunctionId': parseInt (body.FunctionId) })

      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.IDSDUPLICATED }) }
      }
      // else
      // {
      //   if (params)   { ResponseBody.push ({ code: 400, msg: Message.RoleFunctionNotFound }) }
      // }

      /* Valida o CRUDQuery */

      if (typeof (body.CRUDQuery)   !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CRUDQueryBoolean }) }

      /* Valida o CRUDInsert */

      if (typeof (body.CRUDInsert)  !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CRUDInsertBoolean }) }

      /* Valida o CRUDUpdate */

      if (typeof (body.CRUDUpdate)  !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CRUDUpdateBoolean }) }

      /* Valida o CRUDDelete */

      if (typeof (body.CRUDDelete)  !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CRUDDeleteBoolean }) }

      /* Valida o CRUDExecute */

      if (typeof (body.CRUDExecute) !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CRUDExecuteBoolean }) }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    RoleFunctionModel.create
    (
      {
        //#region INSERT

          RoleId    : body.RoleId,
          FunctionId: body.FunctionId,

          CRUDQuery  : body.CRUDQuery,
          CRUDInsert : body.CRUDInsert,
          CRUDUpdate : body.CRUDUpdate,
          CRUDDelete : body.CRUDDelete,
          CRUDExecute: body.CRUDExecute,

          Status: Status.ACTIVE

        //#endregion
      }
    )

  }





  async UpdateDatabase (body, RecordUpdate)
  {

    RecordUpdate.merge
    (
      {
        //#region UPDATE

          RoleId    : body.RoleId,
          FunctionId: body.FunctionId,

          CRUDQuery  : body.CRUDQuery,
          CRUDInsert : body.CRUDInsert,
          CRUDUpdate : body.CRUDUpdate,
          CRUDDelete : body.CRUDDelete,
          CRUDExecute: body.CRUDExecute

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a RoleFunction status with id.
   * PATCH rolefunction/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async status ({ params, request, response })
  {

    try
    {
      let body = request.body


      /* Valida o ID */

      let RecordStatus = await RoleFunctionModel.find (params.id)

      if (! RecordStatus)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Verifica status validos */

      switch (body.Status)
      {
        //#region STATUS

        case Status.ACTIVE:
        case Status.BLOCKED:
        case Status.CANCELED:
             break;

        //#endregion

        default:
             return response.badRequest ({ code: 400, msg: Message.STATUSINVALID })
      }


      /* Grava no banco */

      RecordStatus.merge ({ Status: body.Status })

      await RecordStatus.save()


      return response.ok ({ code: 200, msg: Message.STATUSUPDATED })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Delete a RoleFunction with id.
   * DELETE rolefunction/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async destroy ({ params, request, response })
  {

    try
    {
      /* Valida o ID */

      //let RecordDelete = await RoleFunctionModel.findBy ({ 'RoleId': parseInt (params.RoleId), 'FunctionId': parseInt (params.FunctionId) })

      let RecordDelete = await RoleFunctionModel.find (params.id)

      if (! RecordDelete)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Apaga o registro */

      await RecordDelete.delete()


      return response.ok ({ code: 200, msg: Message.RECORDDELETED })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Loads a group of RoleFunction records.
   * POST rolefunction/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new RoleFunctionModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await RoleFunctionModel.findBy ({ 'RoleId': parseInt (RecordsArray [Actual] .RoleId), 'FunctionId': parseInt (RecordsArray [Actual] .FunctionId) })

        if (! RegisterExists)
        {
          const RecordValidation = await this.ValidateAll ({ "body": RecordsArray [Actual] })

          if (RecordValidation.length > 0)
          {
            console.log (RecordsArray [Actual]);
            console.log (RecordValidation     );
            continue;
          }

          await this.StoreDatabase ( RecordsArray [Actual] )
        }
        else
        {
          params.id = RegisterExists.Id

          const RecordValidation = await this.ValidateAll ({ "body": RecordsArray [Actual] }, params)

          if (RecordValidation.length > 0)
          {
            console.log (RecordsArray [Actual]);
            console.log (RecordValidation     );
            continue;
          }

          await this.UpdateDatabase ( RecordsArray [Actual], RegisterExists )
        }
      }


      return response.ok ({ code: 200, msg: Message.RECORDSLOADED })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





}





module.exports = RoleFunctionController

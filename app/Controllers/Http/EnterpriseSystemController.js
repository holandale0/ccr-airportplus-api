'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const EnterpriseSystemModel = use ('App/Models/EnterpriseSystem')
const EnterpriseModel       = use ('App/Models/Company'         )
const SystemModel           = use ('App/Models/System'          )

//#endregion





/**
 * Resourceful controller for interacting with EnterpriseSystem
 */

class EnterpriseSystemController
{





  /**
   * Show a list of all EnterpriseSystems.
   * GET enterprisesystem
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

      if (typeof (Query.EnterpriseId) === "undefined")   { Query.EnterpriseId = 0 }
      if (typeof (Query.SystemId    ) === "undefined")   { Query.SystemId     = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0 && Query.SystemId === 0)   { return EnterpriseSystemModel.all() }
      //---else
      //---{
      //---  return await Database .table ('EnterpriseSystem') .select ('*') .where ('EnterpriseId', parseInt (Query.EnterpriseId))
      //---}


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SystemId) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('System.Name')
      }

      /* Filtro por System */

      else if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SystemId) !== 0)
      {
        ResultList = await DBQuery
          .where ('SystemId', parseInt (Query.SystemId))
          .orderBy ('Enterprise.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name')
          .orderBy ('System.Name'    )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single EnterpriseSystem.
   * GET enterprisesystem/:id
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
      //return await EnterpriseSystemModel.findBy ({ 'EnterpriseId': parseInt (params.EnterpriseId), 'SystemId': parseInt (params.SystemId) })

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('EnterpriseSystem.Id', parseInt (params.id))

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
      .table ('EnterpriseSystem') 
      .select
      ( 
        "EnterpriseSystem.*",

        "Enterprise.Code   as EnterpriseCode",
        "Enterprise.Name   as EnterpriseName",
        "Enterprise.Nick   as EnterpriseNick",
        "Enterprise.Status as EnterpriseStatus",

        "System.Code   as SystemCode",
        "System.Name   as SystemName",
        "System.Status as SystemStatus"
      )
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "EnterpriseSystem.EnterpriseId")
      .innerJoin ("System"               , "System.Id"    , "EnterpriseSystem.SystemId"    )

  }





  //* Monta os objetos e elimina os campos individuais */

  async MontarObjetos (ResultList)
  {

    for (let Actual = 0; Actual < ResultList.length; Actual++)
    {
      ResultList [Actual] .StatusName = Status.StatusName [ResultList [Actual] .Status]


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
   * Create/save a new EnterpriseSystem.
   * POST enterprisesystem
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
   * Update EnterpriseSystem details.
   * PUT enterprisesystem/:id
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

      let RecordUpdate = await EnterpriseSystemModel.find (params.id)

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

    let RegisterExists = new EnterpriseModel()
    let ResponseBody   = []


    //#region VALIDATION


      /* Valida Enterprise */

      if (typeof (body.EnterpriseId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.EnterpriseInteger })
      }
      else if (parseInt (body.EnterpriseId) < 1 || parseInt (body.EnterpriseId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.EnterpriseRange })
      }
      else
      {
        RegisterExists = await EnterpriseModel.find (parseInt (body.EnterpriseId))

        if (RegisterExists)
        {
          if (! RegisterExists.Enterprise            )   { ResponseBody.push ({ code: 400, msg: Message.EnterpriseInvalid }) }
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.EnterpriseStatus  }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.EnterpriseNotFound })
        }
      }

      /* Valida System */

      if (typeof (body.SystemId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.SystemInteger })
      }
      else if (parseInt (body.SystemId) < 1 || parseInt (body.SystemId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.SystemRange })
      }
      else
      {
        RegisterExists = await SystemModel.find (parseInt (body.SystemId))

        if (RegisterExists)
        {
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.SystemStatus }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.SystemNotFound })
        }
      }

      /* Verifica duplicidade de chave */

      RegisterExists = await EnterpriseSystemModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SystemId': parseInt (body.SystemId) })

      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.IDSDUPLICATED }) }
      }
      // else
      // {
      //   if (params)   { ResponseBody.push ({ code: 400, msg: Message.EnterpriseSystemNotFound }) }
      // }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    EnterpriseSystemModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          SystemId    : body.SystemId,

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

          EnterpriseId: body.EnterpriseId,
          SystemId    : body.SystemId

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a EnterpriseSystem status with id.
   * PATCH enterprisesystem/:id
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

      let RecordStatus = await EnterpriseSystemModel.find (params.id)

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
   * Delete a EnterpriseSystem with id.
   * DELETE enterprisesystem/:id
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

      let RecordDelete = await EnterpriseSystemModel.find (params.id)

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
   * Loads a group of EnterpriseSystem records.
   * POST enterprisesystem/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new EnterpriseModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await EnterpriseSystemModel.findBy ({ 'EnterpriseId': parseInt (RecordsArray [Actual] .EnterpriseId), 'SystemId': parseInt (RecordsArray [Actual] .SystemId) })

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





module.exports = EnterpriseSystemController

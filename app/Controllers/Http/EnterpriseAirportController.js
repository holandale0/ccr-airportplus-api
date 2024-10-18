'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const EnterpriseAirportModel = use ('App/Models/EnterpriseAirport')
const EnterpriseModel        = use ('App/Models/Company'          )
const AirportModel           = use ('App/Models/Company'          )

//#endregion





/**
 * Resourceful controller for interacting with EnterpriseAirport
 */

class EnterpriseAirportController
{





  /**
   * Show a list of all EnterpriseAirports.
   * GET enterpriseairport
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
      if (typeof (Query.AirportId   ) === "undefined")   { Query.AirportId    = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0 && Query.AirportId === 0)   { return EnterpriseAirportModel.all() }
      //---else
      //---{
      //---  return await Database .table ('EnterpriseAirport') .select ('*') .where ('EnterpriseId', parseInt (Query.EnterpriseId))
      //---}


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.AirportId) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('Airport.Name')
      }


      /* Filtro por Airport */

      else if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.AirportId) !== 0)
      {
        ResultList = await DBQuery
          .where ('AirportId', parseInt (Query.AirportId))
          .orderBy ('Enterprise.Name')
      }


      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name')
          .orderBy ('Airport.Name'   )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single EnterpriseAirport.
   * GET enterpriseairport/:id
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
      //return await EnterpriseAirportModel.findBy ({ 'EnterpriseId': parseInt (params.EnterpriseId), 'AirportId': parseInt (params.AirportId) })

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('EnterpriseAirport.Id', parseInt (params.id))

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
      .table ('EnterpriseAirport') 
      .select
      ( 
        "EnterpriseAirport.*",

        "Enterprise.Code   as EnterpriseCode",
        "Enterprise.Name   as EnterpriseName",
        "Enterprise.Nick   as EnterpriseNick",
        "Enterprise.Status as EnterpriseStatus",

        "Airport.Code    as AirportCode",
        "Airport.Name    as AirportName",
        "Airport.Nick    as AirportNick",
        "Airport.IATA    as AirportIATA",
        "Airport.ICAO    as AirportICAO",
        "Airport.City    as AirportCity",
        "Airport.State   as AirportState",
        "Airport.Country as AirportCountry",
        "Airport.Region  as AirportRegion",
        "Airport.Status  as AirportStatus"
      )
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "EnterpriseAirport.EnterpriseId")
      .innerJoin ("Company as Airport"   , "Airport.Id"   , "EnterpriseAirport.AirportId"   )

  }





  //* Monta os objetos e limpa os campos individuais */

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


      ResultList [Actual] .Airport = 
      {
        "Code"      : ResultList [Actual] .AirportCode,
        "Name"      : ResultList [Actual] .AirportName,
        "Nick"      : ResultList [Actual] .AirportNick,
        "IATA"      : ResultList [Actual] .AirportIATA,
        "ICAO"      : ResultList [Actual] .AirportICAO,
        "City"      : ResultList [Actual] .AirportCity,
        "State"     : ResultList [Actual] .AirportState,
        "Country"   : ResultList [Actual] .AirportCountry,
        "Region"    : ResultList [Actual] .AirportRegion,
        "Status"    : ResultList [Actual] .AirportStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .AirportStatus]
      }

      delete ResultList [Actual] .AirportCode
      delete ResultList [Actual] .AirportName
      delete ResultList [Actual] .AirportNick
      delete ResultList [Actual] .AirportIATA
      delete ResultList [Actual] .AirportICAO
      delete ResultList [Actual] .AirportCity
      delete ResultList [Actual] .AirportState
      delete ResultList [Actual] .AirportCountry
      delete ResultList [Actual] .AirportRegion
      delete ResultList [Actual] .AirportStatus
    }

    return ResultList

  }





  /**
   * Create/save a new EnterpriseAirport.
   * POST enterpriseairport
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
   * Update EnterpriseAirport details.
   * PUT enterpriseairport/:id
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

      let RecordUpdate = await EnterpriseAirportModel.find (params.id)

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

      /* Valida Airport */

      if (typeof (body.AirportId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.AirportInteger })
      }
      else if (parseInt (body.AirportId) < 1 || parseInt (body.AirportId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.AirportRange })
      }
      else
      {
        RegisterExists = await AirportModel.find (parseInt (body.AirportId))

        if (RegisterExists)
        {
          if (! RegisterExists.Airport               )   { ResponseBody.push ({ code: 400, msg: Message.AirportInvalid }) }
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.AirportStatus  }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.AirportNotFound })
        }
      }

      /* Verifica duplicidade de chave */

      RegisterExists = await EnterpriseAirportModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'AirportId': parseInt (body.AirportId) })

      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.IDSDUPLICATED }) }
      }
      // else
      // {
      //   if (params)   { ResponseBody.push ({ code: 400, msg: Message.EnterpriseAirportNotFound }) }
      // }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    EnterpriseAirportModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          AirportId   : body.AirportId,

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
          AirportId   : body.AirportId

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a EnterpriseAirport status with id.
   * PATCH enterpriseairport/:id
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

      let RecordStatus = await EnterpriseAirportModel.find (params.id)

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
   * Delete a EnterpriseAirport with id.
   * DELETE enterpriseairport/:id
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

      let RecordDelete = await EnterpriseAirportModel.find (params.id)

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
   * Loads a group of EnterpriseAirport records.
   * POST enterpriseairport/load
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
        RegisterExists = await EnterpriseAirportModel.findBy ({ 'EnterpriseId': parseInt (RecordsArray [Actual] .EnterpriseId), 'AirportId': parseInt (RecordsArray [Actual] .AirportId) })

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





module.exports = EnterpriseAirportController

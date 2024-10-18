'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



var Moment = require ('moment');

const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const APIIntegrationModel    = use ('App/Models/APIIntegration'   )
const CompanyModel           = use ('App/Models/Company'          )
const EnterpriseAirportModel = use ('App/Models/EnterpriseAirport')

//#endregion


//#region SOURCES

const SourceName =
[
  "Invalid",
  "Aviation Stack",
  "Aviation Edge"
]


const SourceURL =
[
  "Invalid",
  "https://api.aviationstack.com",
  "http://aviation-edge.com"
]

//#endregion





/**
 * Resourceful controller for interacting with APIIntegrations
 */

class APIIntegrationController
{





  /**
   * Show a list of all APIIntegrations.
   * GET apiintegration
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

      //---if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.AirportId) === 0)   { return APIIntegrationModel.all() }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.AirportId) === 0)
      {
        ResultList = await DBQuery
          .where ('APIIntegration.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('Airport.Name'       )
          .orderBy ('APIIntegration.Name')
      }

      /* Filtro por Airport */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.AirportId) !== 0)
      {
        ResultList = await DBQuery
          .where ('APIIntegration.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('APIIntegration.AirportId'   , parseInt (Query.AirportId   ))
          .orderBy ('APIIntegration.Name')
      }

      /* Filtro por Airport sem Enterprise */

      else if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.AirportId) !== 0)
      {
        ResultList = await DBQuery
          .where ('APIIntegration.AirportId', parseInt (Query.AirportId))
          .orderBy ('Enterprise.Name'    )
          .orderBy ('APIIntegration.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name'    )
          .orderBy ('Airport.Name'       )
          .orderBy ('APIIntegration.Name')
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single APIIntegration.
   * GET apiintegration/:id
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
      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('APIIntegration.Id', parseInt (params.id))

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
      .table ('APIIntegration')
      .select
      (
        "APIIntegration.*",

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
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "APIIntegration.EnterpriseId")
      .innerJoin ("Company as Airport"   , "Airport.Id"   , "APIIntegration.AirportId"   )

  }





    /* Monta os objetos e elimina os campos individuais */

  async MontarObjetos (ResultList)
  {

    for (let Actual = 0; Actual < ResultList.length; Actual++)
    {
      ResultList [Actual] .SourceName = SourceName        [ResultList [Actual] .Source]
      //---ResultList [Actual] .StatusName = Status.StatusName [ResultList [Actual] .Status]


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
   * Display a single APIIntegration token.
   * GET apiintegrationtoken/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async showtoken ({ params, request, response, view })
  {

    const body = request.body

    let RegisterExists = new APIIntegrationModel()
    let ResponseBody   = []

    try
    {
      RegisterExists = await APIIntegrationModel.findBy ('Token', params.id)

      if (! RegisterExists)   { return response.badRequest ({ code: 400, msg: Message.TOKENNOTFOUND }) }

      return await Database .raw (RegisterExists.SQLCommand)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Create/save a new APIIntegration.
   * POST apiintegration
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
   * Update APIIntegration details.
   * PUT apiintegration/:id
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

      let RecordUpdate = await APIIntegrationModel.find (params.id)

      if (! RecordUpdate)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Verifica o status */

      //---if (RecordUpdate.Status !== Status.ACTIVE)   { return response.badRequest ({ code: 400, msg: Message.UPDATEDENIED }) }


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

    let RegisterExists = new APIIntegrationModel()
    let ResponseBody   = []


    //#region Gera um código

      if (parseInt (body.Code) === 0)
      {
        const Maximum = await Database .from ('APIIntegration') .max ('Code as Code') .where ('EnterpriseId', body.EnterpriseId) .where ('AirportId', body.AirportId)

        if (Maximum [0] .Code === 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.CODEREQUIRED })
        }
        else
        {
          body.Code = ++Maximum [0] .Code
        }
      }

    //#endregion


    //#region VALIDATION

      //#region Enterprise

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
          RegisterExists = await CompanyModel.find (parseInt (body.EnterpriseId))

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

      //#endregion

      //#region Airport

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
          RegisterExists = await CompanyModel.find (parseInt (body.AirportId))

          if (RegisterExists)
          {
            if (! RegisterExists.Airport               )   { ResponseBody.push ({ code: 400, msg: Message.AirportInvalid }) }
            if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.AirportStatus  }) }

            /* Verifica se a Enterprise x Airport existe */

            let EnterpriseAirportExists = await EnterpriseAirportModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'AirportId': parseInt (body.AirportId) })

            if (EnterpriseAirportExists)
            {
              if (EnterpriseAirportExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.EnterpriseAirportStatus }) }
            }  
            else
            {
              ResponseBody.push ({ code: 400, msg: Message.EnterpriseAirportNotAuthorized })
            }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.AirportNotFound })
          }
        }

      //#endregion
      
      //#region Enterprise / Airport / Code

        if (typeof (body.Code) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.KEYINTEGER })
        }
        else if (parseInt (body.Code) < 1 || parseInt (body.Code) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.KEYRANGE })
        }
        else
        {
          RegisterExists = await APIIntegrationModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'AirportId': body.AirportId, 'Code': body.Code })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.APIIntegrationDuplicated }) }
          }
        }

      //#endregion

      //#region Enterprise / Airport / Name

        if (typeof (body.Name) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.NAMESTRING })
        }
        else if (body.Name.length < 1 || body.Name.length > 60)
        {
          ResponseBody.push ({ code: 400, msg: Message.NAMEMAX })
        }
        else
        {
          RegisterExists = await APIIntegrationModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'AirportId': body.AirportId, 'Name': body.Name })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
          }
        }

      //#endregion

      //#region Enterprise / Airport / Nick

        if (typeof (body.Nick) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.KEYSTRING })
        }
        else if (body.Nick.length < 1 || body.Nick.length > 20)
        {
          ResponseBody.push ({ code: 400, msg: Message.KEYMAX })
        }
        else
        {
          RegisterExists = await APIIntegrationModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'AirportId': body.AirportId, 'Nick': body.Nick })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.KEYDUPLICATED }) }
          }
        }

      //#endregion

      //#region DayBefore

        if (typeof (body.DayBefore) !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.DayBeforeBoolean }) }

      //#endregion

      //#region DayAfter

        if (typeof (body.DayAfter) !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.DayAfterBoolean }) }

      //#endregion

      //#region Interval

        if (typeof (body.Interval) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.IntervalInteger })
        }
        else
        {
          if (parseInt (body.Refresh) < 1 || parseInt (body.Refresh) > 255)   { ResponseBody.push ({ code: 400, msg: Message.IntervalRange001255 }) }
        }

      //#endregion

      //#region CRUDInsert

        if (typeof (body.CRUDInsert) !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CRUDInsertBoolean }) }

      //#endregion

      //#region CRUDUpdate

        if (typeof (body.CRUDUpdate) !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CRUDUpdateBoolean }) }

      //#endregion

      //#region Filter

        if (typeof (body.Filter) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.FilterString })
        }
        else if (body.Filter.length < 7)
        {
          ResponseBody.push ({ code: 400, msg: Message.FilterRequired })
        }
        else if (
                  body.Filter .toUpperCase() .includes ("DELETE ") ||   body.Filter .toUpperCase() .includes ("DROP " ) ||   body.Filter .toUpperCase() .includes ("UPDATE "  ) ||
                  body.Filter .toUpperCase() .includes ("CREATE ") ||   body.Filter .toUpperCase() .includes ("ALTER ") ||   body.Filter .toUpperCase() .includes ("TRUNCATE ") ||
                ! body.Filter .toUpperCase() .includes ("WHERE " )
                )
        {
          ResponseBody.push ({ code: 400, msg: Message.FilterInvalid })
        }

      //#endregion

      //#region Source

        if (typeof (body.Source) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.SourceInteger })
        }
        else if (parseInt (body.Source) < 1 || parseInt (body.Source) > 2)
        {
          ResponseBody.push ({ code: 400, msg: Message.SourceRange })
        }

      //#endregion

      //#region APIURL

        if (typeof (body.APIURL) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.APIURLString   })
        }
        else if (body.APIURL.length < 12)
        {
          ResponseBody.push ({ code: 400, msg: Message.APIURLRequired })
        }
        else
        {
          if (typeof (body.Source) === "number" && parseInt (body.Source) >= 1 && parseInt (body.Source) <= 2)
          {
            if (! body.APIURL .includes (SourceURL [parseInt (body.Source)]))   { ResponseBody.push ({ code: 400, msg: Message.APIURLInvalid }) }
          }
        }

      //#endregion

      //#region Enabled

        if (typeof (body.Enabled) !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.ENABLEDBOOLEAN }) }

      //#endregion

      //#region BeginDate

        if (typeof (body.BeginDate) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.BEGINDATESTRING })
        }
        else if (! Moment (body.BeginDate, "YYYY-MM-DD") .isValid())
        {
          ResponseBody.push ({ code: 400, msg: Message.BEGINDATEINVALID })
        }

      //#endregion

      //#region EndDate

        if (typeof (body.EndDate) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.ENDDATESTRING })
        }
        else if (! Moment (body.EndDate, "YYYY-MM-DD") .isValid())
        {
          ResponseBody.push ({ code: 400, msg: Message.ENDDATEINVALID })
        }

      //#endregion

    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    APIIntegrationModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          AirportId   : body.AirportId,

          Code: body.Code,
          Name: body.Name,
          Nick: body.Nick,

          DayBefore: body.DayBefore,
          DayAfter : body.DayAfter,
          Interval : body.Interval,

          CRUDInsert: body.CRUDInsert,
          CRUDUpdate: body.CRUDUpdate,

          Filter: body.Filter,
          Source: body.Source,
          APIURL: body.APIURL,

          Enabled  : body.Enabled,
          BeginDate: body.BeginDate,
          EndDate  : body.EndDate

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
          AirportId   : body.AirportId,

          Code: body.Code,
          Name: body.Name,
          Nick: body.Nick,

          DayBefore: body.DayBefore,
          DayAfter : body.DayAfter,
          Interval : body.Interval,

          CRUDInsert: body.CRUDInsert,
          CRUDUpdate: body.CRUDUpdate,

          Filter: body.Filter,
          Source: body.Source,
          APIURL: body.APIURL,

          Enabled  : body.Enabled,
          BeginDate: body.BeginDate,
          EndDate  : body.EndDate

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a APIIntegration status with id.
   * PATCH apiintegration/:id
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

      let RecordStatus = await APIIntegrationModel.find (params.id)

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
   * Delete a APIIntegration with id.
   * DELETE apiintegration/:id
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

      let RecordDelete = await APIIntegrationModel.find (params.id)

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
   * Loads a group of APIIntegration records.
   * POST apiintegration/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new APIIntegrationModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await APIIntegrationModel.findBy ({ 'EnterpriseId': RecordsArray [Actual] .EnterpriseId, 'AirportId': RecordsArray [Actual] .AirportId, 'Code': RecordsArray [Actual] .Code })

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





module.exports = APIIntegrationController

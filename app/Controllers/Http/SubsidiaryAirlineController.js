'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const SubsidiaryAirlineModel    = use ('App/Models/SubsidiaryAirline'   )
const EnterpriseModel           = use ('App/Models/Company'             )
const SubsidiaryModel           = use ('App/Models/Company'             )
const EnterpriseSubsidiaryModel = use ('App/Models/EnterpriseSubsidiary')
const AirlineModel              = use ('App/Models/Company'             )

//#endregion





/**
 * Resourceful controller for interacting with SubsidiaryAirline
 */

class SubsidiaryAirlineController
{





  /**
   * Show a list of all SubsidiaryAirlines.
   * GET subsidiaryairline
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
      if (typeof (Query.SubsidiaryId) === "undefined")   { Query.SubsidiaryId = 0 }
      if (typeof (Query.AirlineId   ) === "undefined")   { Query.AirlineId    = 0 }
      if (typeof (Query.Distinct    ) === "undefined")   { Query.Distinct     = 0 }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.Distinct) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.IATA')
          .orderBy ('Airline.IATA'   )
      }

      /* Filtro por Enterprise distinct => Subsidiary list */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.Distinct) !== 0)
      {
        ResultList = await this.SelectDistinctSubsidiary()
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.IATA')
      }

      /* Filtro por Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .where ('Subsidiary.Id', parseInt (Query.SubsidiaryId))
          .orderBy ('Enterprise.Nick')
          .orderBy ('Airline.IATA'   )
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Nick')
          .orderBy ('Subsidiary.IATA')
          .orderBy ('Airline.IATA'   )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single SubsidiaryAirline.
   * GET subsidiaryairline/:id
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
        .where ('SubsidiaryAirline.Id', parseInt (params.id))

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
      .table ('SubsidiaryAirline') 
      .select
      ( 
        "SubsidiaryAirline.*",

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

        "Airline.Code    as AirlineCode",
        "Airline.Name    as AirlineName",
        "Airline.Nick    as AirlineNick",
        "Airline.IATA    as AirlineIATA",
        "Airline.ICAO    as AirlineICAO",
        "Airline.City    as AirlineCity",
        "Airline.State   as AirlineState",
        "Airline.Country as AirlineCountry",
        "Airline.Region  as AirlineRegion",
        "Airline.Status  as AirlineStatus"
      )
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "SubsidiaryAirline.EnterpriseId")
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "SubsidiaryAirline.SubsidiaryId")
      .innerJoin ("Company as Airline"   , "Airline.Id"   , "SubsidiaryAirline.AirlineId"   )

  }





  /* Monta os parâmetros para acesso ao banco */

  SelectDistinctSubsidiary()
  {

    return Database 
      .table ('SubsidiaryAirline') 
      .select
      ( 
        "SubsidiaryAirline.SubsidiaryId",

        "Subsidiary.Name    as SubsidiaryName",
        "Subsidiary.IATA    as SubsidiaryIATA",
        "Subsidiary.ICAO    as SubsidiaryICAO",
        "Subsidiary.City    as SubsidiaryCity",
        "Subsidiary.Country as SubsidiaryCountry",
        "Subsidiary.Status  as SubsidiaryStatus"
      )
      .distinct ("Subsidiary.IATA")
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "SubsidiaryAirline.EnterpriseId")
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "SubsidiaryAirline.SubsidiaryId")
      .innerJoin ("Company as Airline"   , "Airline.Id"   , "SubsidiaryAirline.AirlineId"   )

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


      ResultList [Actual] .Airline =
      {
        "Code"      : ResultList [Actual] .AirlineCode,
        "Name"      : ResultList [Actual] .AirlineName,
        "Nick"      : ResultList [Actual] .AirlineNick,
        "IATA"      : ResultList [Actual] .AirlineIATA,
        "ICAO"      : ResultList [Actual] .AirlineICAO,
        "City"      : ResultList [Actual] .AirlineCity,
        "State"     : ResultList [Actual] .AirlineState,
        "Country"   : ResultList [Actual] .AirlineCountry,
        "Region"    : ResultList [Actual] .AirlineRegion,
        "Status"    : ResultList [Actual] .AirlineStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .AirlineStatus]
      }

      delete ResultList [Actual] .AirlineCode
      delete ResultList [Actual] .AirlineName
      delete ResultList [Actual] .AirlineNick
      delete ResultList [Actual] .AirlineIATA
      delete ResultList [Actual] .AirlineICAO
      delete ResultList [Actual] .AirlineCity
      delete ResultList [Actual] .AirlineState
      delete ResultList [Actual] .AirlineCountry
      delete ResultList [Actual] .AirlineRegion
      delete ResultList [Actual] .AirlineStatus
    }


    return ResultList

  }





  /**
   * Create/save a new SubsidiaryAirline.
   * POST subsidiaryairline
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
   * Update SubsidiaryAirline details.
   * PUT subsidiaryairline/:id
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

      let RecordUpdate = await SubsidiaryAirlineModel.find (params.id)

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

      /* Valida Subsidiary */

      if (typeof (body.SubsidiaryId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.SubsidiaryInteger })
      }
      else if (parseInt (body.SubsidiaryId) < 1 || parseInt (body.SubsidiaryId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.SubsidiaryRange })
      }
      else
      {
        RegisterExists = await SubsidiaryModel.find (parseInt (body.SubsidiaryId))

        if (RegisterExists)
        {
          if (! RegisterExists.Subsidiary            )   { ResponseBody.push ({ code: 400, msg: Message.SubsidiaryInvalid }) }
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.SubsidiaryStatus  }) }

          /* Verifica se a Enterprise x Subsidiary existe */

          let EnterpriseSubsidiaryExists = await EnterpriseSubsidiaryModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId) })

          if (EnterpriseSubsidiaryExists)
          {
            if (EnterpriseSubsidiaryExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.EnterpriseSubsidiaryStatus }) }
          }  
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.EnterpriseSubsidiaryNotAuthorized })
          }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.SubsidiaryNotFound })
        }
      }

      /* Valida Airline */

      if (typeof (body.AirlineId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.AirlineInteger })
      }
      else if (parseInt (body.AirlineId) < 1 || parseInt (body.AirlineId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.AirlineRange })
      }
      else
      {
        RegisterExists = await AirlineModel.find (parseInt (body.AirlineId))

        if (RegisterExists)
        {
          if (! RegisterExists.Airline               )   { ResponseBody.push ({ code: 400, msg: Message.AirlineInvalid }) }
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.AirlineStatus  }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.AirlineNotFound })
        }
      }

      /* Verifica Subsidiary x Airline */

      if (parseInt (body.SubsidiaryId) === parseInt (body.AirlineId))   { ResponseBody.push ({ code: 400, msg: Message.AirlineSubsidiaryDifferent }) }

      /* Verifica duplicidade de chave */

      RegisterExists = await SubsidiaryAirlineModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId), 'AirlineId': parseInt (body.AirlineId) })

      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.IDSDUPLICATED }) }
      }
      // else
      // {
      //   if (params)   { ResponseBody.push ({ code: 400, msg: Message.SubsidiaryAirlineNotFound }) }
      // }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    SubsidiaryAirlineModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          SubsidiaryId: body.SubsidiaryId,
          AirlineId   : body.AirlineId,

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
          SubsidiaryId: body.SubsidiaryId,
          AirlineId   : body.AirlineId

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a SubsidiaryAirline status with id.
   * PATCH subsidiaryairline/:id
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

      let RecordStatus = await SubsidiaryAirlineModel.find (params.id)

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
   * Delete a SubsidiaryAirline with id.
   * DELETE subsidiaryairline/:id
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

      let RecordDelete = await SubsidiaryAirlineModel.find (params.id)

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
   * Loads a group of SubsidiaryAirline records.
   * POST subsidiaryairline/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new EnterpriseModel()

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await SubsidiaryAirlineModel.findBy ({ 'EnterpriseId': parseInt (RecordsArray [Actual] .EnterpriseId), 'SubsidiaryId': parseInt (RecordsArray [Actual] .SubsidiaryId), 'AirlineId': parseInt (RecordsArray [Actual] .AirlineId) })

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





module.exports = SubsidiaryAirlineController

'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const OriginDestinationModel    = use ('App/Models/OriginDestination'   )
const EnterpriseModel           = use ('App/Models/Company'             )
const SubsidiaryModel           = use ('App/Models/Company'             )
const EnterpriseSubsidiaryModel = use ('App/Models/EnterpriseSubsidiary')
const AirportModel              = use ('App/Models/Company'             )

//#endregion





/**
 * Resourceful controller for interacting with OriginDestination
 */

class OriginDestinationController
{





  /**
   * Show a list of all OriginDestinations.
   * GET origindestination
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
      if (typeof (Query.AirportId   ) === "undefined")   { Query.AirportId    = 0 }
      if (typeof (Query.Distinct    ) === "undefined")   { Query.Distinct     = 0 }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.Distinct) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.IATA')
          .orderBy ('Airport.IATA'   )
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
          .orderBy ('Airport.IATA'   )
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Nick')
          .orderBy ('Subsidiary.IATA')
          .orderBy ('Airport.IATA'   )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single OriginDestination.
   * GET origindestination/:id
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
        .where ('OriginDestination.Id', parseInt (params.id))

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
      .table ('OriginDestination') 
      .select
      ( 
        "OriginDestination.*",

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
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "OriginDestination.EnterpriseId")
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "OriginDestination.SubsidiaryId")
      .innerJoin ("Company as Airport"   , "Airport.Id"   , "OriginDestination.AirportId"   )

  }





  /* Monta os parâmetros para acesso ao banco */

  SelectDistinctSubsidiary()
  {

    return Database 
      .table ('OriginDestination') 
      .select
      ( 
        "OriginDestination.SubsidiaryId",

        "Subsidiary.Name    as SubsidiaryName",
        "Subsidiary.IATA    as SubsidiaryIATA",
        "Subsidiary.ICAO    as SubsidiaryICAO",
        "Subsidiary.City    as SubsidiaryCity",
        "Subsidiary.State   as SubsidiaryState",
        "Subsidiary.Country as SubsidiaryCountry",
        "Subsidiary.Region  as SubsidiaryRegion",
        "Subsidiary.Status  as SubsidiaryStatus"
      )
      .distinct ("Subsidiary.IATA")
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "OriginDestination.EnterpriseId")
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "OriginDestination.SubsidiaryId")
      .innerJoin ("Company as Airport"   , "Airport.Id"   , "OriginDestination.AirportId"   )

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
   * Create/save a new OriginDestination.
   * POST origindestination
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
   * Update OriginDestination details.
   * PUT origindestination/:id
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

      let RecordUpdate = await OriginDestinationModel.find (params.id)

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

      /* Verifica Subsidiary x Airport */

      if (parseInt (body.SubsidiaryId) === parseInt (body.AirportId))   { ResponseBody.push ({ code: 400, msg: Message.AirportSubsidiaryDifferent }) }

      /* Verifica duplicidade de chave */

      RegisterExists = await OriginDestinationModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId), 'AirportId': parseInt (body.AirportId) })

      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.IDSDUPLICATED }) }
      }
      // else
      // {
      //   if (params)   { ResponseBody.push ({ code: 400, msg: Message.OriginDestinationNotFound }) }
      // }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    OriginDestinationModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          SubsidiaryId: body.SubsidiaryId,
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
          SubsidiaryId: body.SubsidiaryId,
          AirportId   : body.AirportId

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a OriginDestination status with id.
   * PATCH origindestination/:id
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

      let RecordStatus = await OriginDestinationModel.find (params.id)

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
   * Delete a OriginDestination with id.
   * DELETE origindestination/:id
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

      let RecordDelete = await OriginDestinationModel.find (params.id)

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
   * Loads a group of OriginDestination records.
   * POST origindestination/load
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
        RegisterExists = await OriginDestinationModel.findBy ({ 'EnterpriseId': parseInt (RecordsArray [Actual] .EnterpriseId), 'SubsidiaryId': parseInt (RecordsArray [Actual] .SubsidiaryId), 'AirportId': parseInt (RecordsArray [Actual] .AirportId) })

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





module.exports = OriginDestinationController

'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const FIDSModel                 = use ('App/Models/FIDS'                )
const CompanyModel              = use ('App/Models/Company'             )
const EnterpriseSubsidiaryModel = use ('App/Models/EnterpriseSubsidiary')

//#endregion





/**
 * Resourceful controller for interacting with FIDSs
 */

class FIDSController
{





  /**
   * Show a list of all FIDSs.
   * GET fids
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

      //---if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) === 0)   { return FIDSModel.all() }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0)
      {
        ResultList = await DBQuery
          .where ('FIDS.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.IATA')
          .orderBy ('FIDS.Name'      )
      }

      /* Filtro por Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0)
      {
        ResultList = await DBQuery
          .where ('FIDS.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('FIDS.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .orderBy ('FIDS.Name')
      }

      /* Filtro por Subsidiary sem Enterprise */

      else if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) !== 0)
      {
        ResultList = await DBQuery
          .where ('FIDS.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .orderBy ('Enterprise.Nick')
          .orderBy ('FIDS.Name'      )
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Nick')
          .orderBy ('Subsidiary.IATA')
          .orderBy ('FIDS.Name'      )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single FIDS.
   * GET fids/:id
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
        .where ('FIDS.Id', parseInt (params.id))

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
      .table ('FIDS')
      .select
      (
        "FIDS.*",

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
        "Subsidiary.Status  as SubsidiaryStatus"
      )
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "FIDS.EnterpriseId")
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "FIDS.SubsidiaryId")

  }





  /* Monta os objetos e elimina os campos individuais */

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
    }


    return ResultList

  }





  /**
   * Display a single FIDS token.
   * GET fidstoken/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async showtoken ({ params, request, response, view })
  {

    const body = request.body

    let RegisterExists = new FIDSModel()
    let ResponseBody   = []

    try
    {
      RegisterExists = await FIDSModel.findBy ('Token', params.id)

      if (! RegisterExists)   { return response.badRequest ({ code: 400, msg: Message.TOKENNOTFOUND }) }

      return await Database .raw (RegisterExists.SQLCommand)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Create/save a new FIDS.
   * POST fids
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
   * Update FIDS details.
   * PUT fids/:id
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

      let RecordUpdate = await FIDSModel.find (params.id)

      if (! RecordUpdate)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Verifica o status */

      if (RecordUpdate.Status !== Status.ACTIVE)   { return response.badRequest ({ code: 400, msg: Message.UPDATEDENIED }) }


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

    let RegisterExists = new FIDSModel()
    let ResponseBody   = []


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('FIDS') .max ('Code as Code') .where ('EnterpriseId', body.EnterpriseId) .where ('SubsidiaryId', body.SubsidiaryId)

      if (Maximum [0] .Code === 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.CODEREQUIRED })
      }
      else
      {
        body.Code = ++Maximum [0] .Code
      }
    }


    //#region VALIDATION


      /* Valida o Enterprise */

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

      /* Valida o Subsidiary */

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
        RegisterExists = await CompanyModel.find (parseInt (body.SubsidiaryId))

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

      /* Valida o Enterprise / Subsidiary / Code */

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
        RegisterExists = await FIDSModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId, 'Code': body.Code })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.FIDSDUPLICATED }) }
        }
      }

      /* Valida o Enterprise / Subsidiary / Name */

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
        RegisterExists = await FIDSModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId, 'Name': body.Name })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
        }
      }

      /* Valida a Description */

      if (typeof (body.Description) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.DESCRIPTIONSTRING })
      }
      else if (body.Token.length < 1)
      {
        ResponseBody.push ({ code: 400, msg: Message.DESCRIPTIONREQUIRED })
      }

      /* Valida o Token */

      if (typeof (body.Token) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.TOKENSTRINGLD })
      }
      else if (body.Token.length < 1 || body.Token.length > 20)
      {
        ResponseBody.push ({ code: 400, msg: Message.TOKENMAX })
      }
      else
      {
        RegisterExists = await FIDSModel.findBy ('Token', body.Token)

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.TOKENDUPLICATED }) }
        }
      }

      /* Valida o Refresh */

      if (typeof (body.Refresh) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.REFRESHINTEGER })
      }
      else
      {
        if (parseInt (body.Refresh) < 1 || parseInt (body.Refresh) > 255)   { ResponseBody.push ({ code: 400, msg: Message.REFRESHRANGE001255 }) }
      }

      /* Valida o Type */

      if (typeof (body.Type) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.TYPEINTEGER })
      }
      else
      {
        if (parseInt (body.Type) < 1 || parseInt (body.Type) > 1)   { ResponseBody.push ({ code: 400, msg: Message.TYPERANGE001001 }) }
      }

      /* Valida o SQLCommand */

      if (typeof (body.SQLCommand) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.SQLCOMMANDSTRING })
      }
      else if (body.SQLCommand.length < 7)
      {
        ResponseBody.push ({ code: 400, msg: Message.SQLCOMMANDREQUIRED })
      }
      else if (
                 body.SQLCommand .toUpperCase() .includes ("DELETE ") ||   body.SQLCommand .toUpperCase() .includes ("DROP " ) ||   body.SQLCommand .toUpperCase() .includes ("UPDATE "  ) ||
                 body.SQLCommand .toUpperCase() .includes ("CREATE ") ||   body.SQLCommand .toUpperCase() .includes ("ALTER ") ||   body.SQLCommand .toUpperCase() .includes ("TRUNCATE ") ||
               ! body.SQLCommand .toUpperCase() .includes ("SELECT ") || ! body.SQLCommand .toUpperCase() .includes (" FROM ") || ! body.SQLCommand .toUpperCase() .includes (" WHERE "  )
              )
      {
        ResponseBody.push ({ code: 400, msg: Message.SQLCOMMANDINVALID })
      }

      /* Valida o status */

      //---if (body.Status !== Status.ACTIVE && body.Status !== Status.BLOCKED && body.Status !== Status.CANCELED)   { ResponseBody.push ({ code: 400, msg: Message.STATUSINVALID }) }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    FIDSModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          SubsidiaryId: body.SubsidiaryId,

          Code       : body.Code,
          Name       : body.Name,
          Description: body.Description,
          Token      : body.Token,
          Refresh    : body.Refresh,
          Type       : body.Type,

          SQLCommand : body.SQLCommand,

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

          Code       : body.Code,
          Name       : body.Name,
          Description: body.Description,
          Token      : body.Token,
          Refresh    : body.Refresh,
          Type       : body.Type,

          SQLCommand : body.SQLCommand

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a FIDS status with id.
   * PATCH fids/:id
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

      let RecordStatus = await FIDSModel.find (params.id)

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
   * Delete a FIDS with id.
   * DELETE fids/:id
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

      let RecordDelete = await FIDSModel.find (params.id)

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
   * Loads a group of FIDS records.
   * POST fids/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new FIDSModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await FIDSModel.findBy ({ 'EnterpriseId': RecordsArray [Actual] .EnterpriseId, 'SubsidiaryId': RecordsArray [Actual] .SubsidiaryId, 'Code': RecordsArray [Actual] .Code })

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





module.exports = FIDSController

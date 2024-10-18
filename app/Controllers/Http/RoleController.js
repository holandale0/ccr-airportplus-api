'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const RoleModel                 = use ('App/Models/Role'                )
const CompanyModel              = use ('App/Models/Company'             )
const EnterpriseSubsidiaryModel = use ('App/Models/EnterpriseSubsidiary')

//#endregion





/**
 * Resourceful controller for interacting with Roles
 */

class RoleController
{





  /**
   * Show a list of all Roles.
   * GET role
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

      //---if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) === 0)   { return RoleModel.all() }

      //return await Database .table ('Role') .select ('*') .where ('EnterpriseId', parseInt (Query.EnterpriseId))


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0)
      {
        ResultList = await DBQuery
          .where ('Role.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.Name')
          .orderBy ('Role.Name'      )
      }

      /* Filtro por Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0)
      {
        ResultList = await DBQuery
          .where ('Role.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('Role.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .orderBy ('Role.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name')
          .orderBy ('Subsidiary.Name')
          .orderBy ('Role.Name'      )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single Role.
   * GET role/:id
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
      //return RoleModel.find (params.id)

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('Role.Id', parseInt (params.id))

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
      .table ('Role')
      .select
      (
        "Role.*",

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
      .leftJoin ("Company as Enterprise", "Enterprise.Id", "Role.EnterpriseId")
      .leftJoin ("Company as Subsidiary", "Subsidiary.Id", "Role.SubsidiaryId")

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
   * Create/save a new Role.
   * POST role
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
   * Update Role details.
   * PUT role/:id
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

      let RecordUpdate = await RoleModel.find (params.id)

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

      let RegisterExists = new RoleModel()
      let ResponseBody   = []


      /* Gera um código */

      if (parseInt (body.Code) === 0)
      {
        const Maximum = await Database .from ('Role') .max ('Code as Code') .where ('EnterpriseId', body.EnterpriseId) .where ('SubsidiaryId', body.SubsidiaryId)

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


      /* Valida a Enterprise */

      if (body.EnterpriseId !== null)
      {
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
      }

      /* Valida o Subsidiary */

      if (body.SubsidiaryId !== null)
      {
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
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.SubsidiaryNotFound })
          }
        }
      }

      /* Valida Enterprise+Subsidiary nulos ou Enterprise nulo */

      if (body.EnterpriseId === null && body.SubsidiaryId !== null)   { ResponseBody.push ({ code: 400, msg: Message.SubsidiaryInvalid }) }

      /* Verifica se a Enterprise x Subsidiary existe */

      if (body.EnterpriseId !== null && body.SubsidiaryId !== null)
      {
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

      /* Verifica duplicidade de Code */

      if (typeof (body.Code) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.CODEINTEGER })
      }
      else if (parseInt (body.Code) < 1 || parseInt (body.Code) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.CODERANGE })
      }
      else
      {
        RegisterExists = await RoleModel.findBy ({ 'Code': body.Code, 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.CODEDUPLICATED }) }
        }
      }

      /* Verifica duplicidade de Name */

      if (typeof (body.Name) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.NAMESTRING })
      }
      else if (body.Name.length < 1 || body.Name.length > 40)
      {
        ResponseBody.push ({ code: 400, msg: Message.NAMEMAX40 })
      }
      else
      {
        RegisterExists = await RoleModel.findBy ({ 'Name': body.Name, 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
        }
      }


      //#endregion


      return ResponseBody

  }





  async StoreDatabase (body)
  {

    RoleModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          SubsidiaryId: body.SubsidiaryId,

          Code: body.Code,
          Name: body.Name,

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

          Code: body.Code,
          Name: body.Name

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a Role status with id.
   * PATCH role/:id
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

      let RecordStatus = await RoleModel.find (params.id)

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
   * Delete a Role with id.
   * DELETE role/:id
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

      let RecordDelete = await RoleModel.find (params.id)

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
   * Loads a group of Role records.
   * POST role/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new RoleModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await RoleModel.findBy ({ 'Code': RecordsArray [Actual] .Code, 'EnterpriseId': RecordsArray [Actual] .EnterpriseId, 'SubsidiaryId': RecordsArray [Actual] .SubsidiaryId  })

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





module.exports = RoleController

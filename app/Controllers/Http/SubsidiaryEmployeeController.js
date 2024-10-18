'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



var Moment = require ('moment');

const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const SubsidiaryEmployeeModel   = use ('App/Models/SubsidiaryEmployee'   )
const EnterpriseModel           = use ('App/Models/Company'             )
const SubsidiaryModel           = use ('App/Models/Company'             )
const EnterpriseSubsidiaryModel = use ('App/Models/EnterpriseSubsidiary')

//#endregion





/**
 * Resourceful controller for interacting with SubsidiaryEmployee
 */

class SubsidiaryEmployeeController
{





  /**
   * Show a list of all SubsidiaryEmployees.
   * GET subsidiaryEmployee
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
      if (typeof (Query.Distinct    ) === "undefined")   { Query.Distinct     = 0 }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.Distinct) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.IATA'        )
          .orderBy ('SubsidiaryEmployee.Name')
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
          .orderBy ('SubsidiaryEmployee.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Nick'        )
          .orderBy ('Subsidiary.IATA'        )
          .orderBy ('SubsidiaryEmployee.Name')
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single SubsidiaryEmployee.
   * GET subsidiaryEmployee/:id
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
        .where ('SubsidiaryEmployee.Id', parseInt (params.id))

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
      .table ('SubsidiaryEmployee') 
      .select
      ( 
        "SubsidiaryEmployee.*",

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
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "SubsidiaryEmployee.EnterpriseId")
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "SubsidiaryEmployee.SubsidiaryId")

  }





  /* Monta os parâmetros para acesso ao banco */

  SelectDistinctSubsidiary()
  {

    return Database 
      .table ('SubsidiaryEmployee') 
      .select
      ( 
        "SubsidiaryEmployee.SubsidiaryId",

        "Subsidiary.Name    as SubsidiaryName",
        "Subsidiary.IATA    as SubsidiaryIATA",
        "Subsidiary.ICAO    as SubsidiaryICAO",
        "Subsidiary.City    as SubsidiaryCity",
        "Subsidiary.Country as SubsidiaryCountry",
        "Subsidiary.Status  as SubsidiaryStatus"
      )
      .distinct ("Subsidiary.IATA")
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "SubsidiaryEmployee.EnterpriseId")
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "SubsidiaryEmployee.SubsidiaryId")

  }





  //* Monta os objetos e limpa os campos individuais */

  async MontarObjetos (ResultList)
  {

    for (let Actual = 0; Actual < ResultList.length; Actual++)
    {
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
   * Create/save a new SubsidiaryEmployee.
   * POST subsidiaryEmployee
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
   * Update SubsidiaryEmployee details.
   * PUT subsidiaryEmployee/:id
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

      let RecordUpdate = await SubsidiaryEmployeeModel.find (params.id)

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


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('SubsidiaryEmployee') .max ('Code as Code') .where ('EnterpriseId', body.EnterpriseId) .where ('SubsidiaryId', body.SubsidiaryId)

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
        RegisterExists = await SubsidiaryEmployeeModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId), 'Code': body.Code })

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
      else if (body.Name.length < 1 || body.Name.length > 60)
      {
        ResponseBody.push ({ code: 400, msg: Message.NAMEMAX })
      }
      else
      {
        RegisterExists = await SubsidiaryEmployeeModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId), 'Name': body.Name })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
        }
      }

      /* Verifica o Job */

      if (typeof (body.Job) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.JobString })
      }
      else if (body.Job.length < 1 || body.Job.length > 20)
      {
        ResponseBody.push ({ code: 400, msg: Message.JobMax })
      }

      /* Valida o Finance */

      if (typeof (body.Finance) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.FinanceInteger })
      }
      else if (parseInt (body.Finance) < 1 || parseInt (body.Finance) > 999999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.FinanceRange })
      }

      /* Valida o Enabled */

      if (typeof (body.Enabled) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.ENABLEDBOOLEAN })
      }

      /* Valida o BeginDate */

      if (typeof (body.BeginDate) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.BEGINDATESTRING })
      }
      else if (! Moment (body.BeginDate, "YYYY-MM-DD") .isValid())
      {
        ResponseBody.push ({ code: 400, msg: Message.BEGINDATEINVALID })
      }

      /* Valida o EndDate */

      if (typeof (body.EndDate) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.ENDDATESTRING })
      }
      else if (! Moment (body.EndDate, "YYYY-MM-DD") .isValid())
      {
        ResponseBody.push ({ code: 400, msg: Message.ENDDATEINVALID })
      }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    SubsidiaryEmployeeModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,
          SubsidiaryId: body.SubsidiaryId,

          Code: body.Code,
          Name: body.Name,
          Job : body.Job,

          Finance : body.Finance,

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
          SubsidiaryId: body.SubsidiaryId,

          Code: body.Code,
          Name: body.Name,
          Job : body.Job,

          Finance : body.Finance,

          Enabled  : body.Enabled,
          BeginDate: body.BeginDate,
          EndDate  : body.EndDate

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a SubsidiaryEmployee status with id.
   * PATCH subsidiaryEmployee/:id
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

      let RecordStatus = await SubsidiaryEmployeeModel.find (params.id)

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
   * Delete a SubsidiaryEmployee with id.
   * DELETE subsidiaryEmployee/:id
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

      let RecordDelete = await SubsidiaryEmployeeModel.find (params.id)

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
   * Loads a group of SubsidiaryEmployee records.
   * POST subsidiaryEmployee/load
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
        RegisterExists = await SubsidiaryEmployeeModel.findBy ({ 'EnterpriseId': parseInt (RecordsArray [Actual] .EnterpriseId), 'SubsidiaryId': parseInt (RecordsArray [Actual] .SubsidiaryId), 'Code': parseInt (RecordsArray [Actual] .Code) })

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





module.exports = SubsidiaryEmployeeController

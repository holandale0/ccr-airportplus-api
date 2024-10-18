'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



var Moment = require ('moment');

const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const ServiceEnterpriseModel = use ('App/Models/ServiceEnterprise')
const CompanyModel           = use ('App/Models/Company'          )
const ServiceGroupModel      = use ('App/Models/ServiceGroup'     )

//#endregion





/**
 * Resourceful controller for interacting with ServiceEnterprises
 */

class ServiceEnterpriseController
{





  /**
   * Show a list of all ServiceEnterprises.
   * GET serviceenterprise
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

      if (typeof (Query.EnterpriseId  ) === "undefined")   { Query.EnterpriseId   = 0 }
      if (typeof (Query.ServiceGroupId) === "undefined")   { Query.ServiceGroupId = 0 }
      if (typeof (Query.Distinct      ) === "undefined")   { Query.Distinct       = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0)   { return ServiceEnterpriseModel.all() }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.ServiceGroupId) === 0 && parseInt (Query.Distinct) === 0)
      {
        ResultList = await DBQuery
          .where ('ServiceEnterprise.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('ServiceGroup.Name'     )
          .orderBy ('ServiceEnterprise.Name')
      }

      /* Filtro por Enterprise distinct => ServiceGroup */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.ServiceGroupId) === 0 && parseInt (Query.Distinct) !== 0)
      {
        ResultList = await this.SelectDistinctServiceGroup()
          .where ('ServiceEnterprise.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('ServiceGroup.Name')
      }

      /* Filtro por Enterprise / Group */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.ServiceGroupId) !== 0)
      {
        ResultList = await DBQuery
          .where ('ServiceEnterprise.EnterpriseId'  , parseInt (Query.EnterpriseId))
          .where ('ServiceEnterprise.ServiceGroupId', parseInt (Query.ServiceGroupId))
          .orderBy ('ServiceEnterprise.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name'       )
          .orderBy ('ServiceGroup.Name'     )
          .orderBy ('ServiceEnterprise.Name')
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single ServiceEnterprise.
   * GET serviceenterprise/:id
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
        .where ('ServiceEnterprise.Id', parseInt (params.id))

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
      .table ('ServiceEnterprise')
      .select
      (
        "ServiceEnterprise.*",

        "Enterprise.Code   as EnterpriseCode",
        "Enterprise.Name   as EnterpriseName",
        "Enterprise.Nick   as EnterpriseNick",
        "Enterprise.Status as EnterpriseStatus",

        "ServiceGroup.Code   as ServiceGroupCode",
        "ServiceGroup.Name   as ServiceGroupName",
        "ServiceGroup.Nick   as ServiceGroupNick",
        "ServiceGroup.Status as ServiceGroupStatus"
      )
      .innerJoin ("Company as Enterprise", "Enterprise.Id"  , "ServiceEnterprise.EnterpriseId"  )
      .innerJoin ("ServiceGroup"         , "ServiceGroup.Id", "ServiceEnterprise.ServiceGroupId")

  }





/* Monta os parâmetros para acesso ao banco - distinct */

  SelectDistinctServiceGroup()
  {
  
    return Database 
      .table ('ServiceEnterprise')
      .select
      (
        "ServiceEnterprise.ServiceGroupId",

        "ServiceGroup.Code   as ServiceGroupCode",
        "ServiceGroup.Name   as ServiceGroupName",
        "ServiceGroup.Nick   as ServiceGroupNick",
        "ServiceGroup.Status as ServiceGroupStatus"
      )
      .distinct ("ServiceGroup.Name")
      .innerJoin ("Company as Enterprise", "Enterprise.Id"  , "ServiceEnterprise.EnterpriseId"  )
      .innerJoin ("ServiceGroup"         , "ServiceGroup.Id", "ServiceEnterprise.ServiceGroupId")

  }





  /* Monta os objetos e elimina os campos individuais */

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


      ResultList [Actual] .ServiceGroup =
      {
        "Code"      : ResultList [Actual] .ServiceGroupCode,
        "Name"      : ResultList [Actual] .ServiceGroupName,
        "Nick"      : ResultList [Actual] .ServiceGroupNick,
        "Status"    : ResultList [Actual] .ServiceGroupStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .ServiceGroupStatus]
      }

      delete ResultList [Actual] .ServiceGroupCode
      delete ResultList [Actual] .ServiceGroupName
      delete ResultList [Actual] .ServiceGroupNick
      delete ResultList [Actual] .ServiceGroupStatus
    }


    return ResultList

  }





  /**
   * Create/save a new ServiceEnterprise.
   * POST serviceenterprise
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
   * Update ServiceEnterprise details.
   * PUT serviceenterprise/:id
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

      let RecordUpdate = await ServiceEnterpriseModel.find (params.id)

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

    let RegisterExists = new ServiceEnterpriseModel()
    let ResponseBody   = []


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('ServiceEnterprise') .max ('Code as Code') .where ('EnterpriseId', body.EnterpriseId)

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

      /* Valida o Enterprise / ServiceGroup */

      if (typeof (body.ServiceGroupId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.SERVICEGROUPINTEGER })
      }
      else if (parseInt (body.ServiceGroupId) < 1 || parseInt (body.ServiceGroupId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.SERVICEGROUPRANGE })
      }
      else
      {
        RegisterExists = await ServiceGroupModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Id': body.ServiceGroupId })

        if (RegisterExists)
        {
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.SERVICEGROUPSTATUS }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.SERVICEGROUPNOTFOUND })
        }
      }

      /* Valida o Enterprise / Code */

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
        RegisterExists = await ServiceEnterpriseModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Code': body.Code })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.KEYDUPLICATED }) }
        }
      }

      /* Valida o Enterprise / Name */

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
        RegisterExists = await ServiceEnterpriseModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Name': body.Name })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
        }
      }

      /* Valida o Nick */

      if (typeof (body.Nick) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.LABELSTRING })
      }
      else if (body.Nick.length < 1 || body.Nick.length > 20)
      {
        ResponseBody.push ({ code: 400, msg: Message.LABELMAX })
      }
      else
      {
        RegisterExists = await ServiceEnterpriseModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Nick': body.Nick })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.LABELDUPLICATED }) }
        }
      }

      /* Valida o Integer */

      if (typeof (body.Integer) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.INTEGERBOOLEAN })
      }

      /* Valida o Decimal */

      if (typeof (body.Decimal) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.DECIMALBOOLEAN })
      }

      /* Valida o Flag */

      if (typeof (body.Flag) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.FLAGBOOLEAN })
      }

      /* Valida o DateBegin */

      if (typeof (body.DateBegin) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.DATEBEGINBOOLEAN })
      }

      /* Valida o DateEnd */

      if (typeof (body.DateEnd) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.DATEENDBOOLEAN })
      }

      /* Valida o Comments */

      if (typeof (body.Comments) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.COMMENTSSTRING })
      }
      else if (body.Comments.length < 1 || body.Comments.length > 20)
      {
        ResponseBody.push ({ code: 400, msg: Message.COMMENTSMAX })
      }

      /* Valida o Account */

      if (typeof (body.Account) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.ACCOUNTINTEGER })
      }
      else if (parseInt (body.Account) < 1 || parseInt (body.Account) > 999999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.ACCOUNTRANGE })
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

    ServiceEnterpriseModel.create
    (
      {
        //#region INSERT

          EnterpriseId  : body.EnterpriseId,
          ServiceGroupId: body.ServiceGroupId,

          Code: body.Code,
          Name: body.Name,
          Nick: body.Nick,

          Integer  : body.Integer,
          Decimal  : body.Decimal,
          Flag     : body.Flag,
          DateBegin: body.DateBegin,
          DateEnd  : body.DateEnd,

          Comments: body.Comments,
          Account : body.Account,

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

        EnterpriseId  : body.EnterpriseId,
        ServiceGroupId: body.ServiceGroupId,

        Code: body.Code,
        Name: body.Name,
        Nick: body.Nick,

        Integer  : body.Integer,
        Decimal  : body.Decimal,
        Flag     : body.Flag,
        DateBegin: body.DateBegin,
        DateEnd  : body.DateEnd,

        Comments: body.Comments,
        Account : body.Account,

        Enabled  : body.Enabled,
        BeginDate: body.BeginDate,
        EndDate  : body.EndDate

      //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Delete a ServiceEnterprise with id.
   * DELETE serviceenterprise/:id
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

      let RecordDelete = await ServiceEnterpriseModel.find (params.id)

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
   * Loads a group of ServiceEnterprise records.
   * POST serviceenterprise/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new ServiceEnterpriseModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await ServiceEnterpriseModel.findBy ({ 'Code': RecordsArray [Actual] .Code, 'EnterpriseId': RecordsArray [Actual] .EnterpriseId })

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





module.exports = ServiceEnterpriseController

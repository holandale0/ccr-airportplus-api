'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



var Moment = require ('moment');

const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const ServiceSubsidiaryModel    = use ('App/Models/ServiceSubsidiary'   )
const CompanyModel              = use ('App/Models/Company'             )
const ServiceGroupModel         = use ('App/Models/ServiceGroup'        )
const ServiceEnterpriseModel    = use ('App/Models/ServiceEnterprise'   )
const EnterpriseSubsidiaryModel = use ('App/Models/EnterpriseSubsidiary')

//#endregion





/**
 * Resourceful controller for interacting with ServiceSubsidiarys
 */

class ServiceSubsidiaryController
{





  /**
   * Show a list of all ServiceSubsidiarys.
   * GET serviceSubsidiary
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
      if (typeof (Query.SubsidiaryId  ) === "undefined")   { Query.SubsidiaryId   = 0 }
      if (typeof (Query.ServiceGroupId) === "undefined")   { Query.ServiceGroupId = 0 }
      if (typeof (Query.Distinct      ) === "undefined")   { Query.Distinct       = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) === 0)   { return ServiceSubsidiaryModel.all() }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.ServiceGroupId) === 0 && parseInt (Query.Distinct) === 0)
      {
        ResultList = await DBQuery
          .where ('ServiceSubsidiary.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.IATA'       )
          .orderBy ('ServiceGroup.Name'     )
          .orderBy ('ServiceEnterprise.Name')
      }

      /* Filtro por Enterprise distinct => Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.ServiceGroupId) === 0 && parseInt (Query.Distinct) !== 0)
      {
        ResultList = await this.SelectDistinctSubsidiary()
          .where ('ServiceSubsidiary.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.IATA')
      }

      /* Filtro por Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.ServiceGroupId) === 0 && parseInt (Query.Distinct) === 0)
      {
        ResultList = await DBQuery
          .where ('ServiceSubsidiary.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('ServiceSubsidiary.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .orderBy ('ServiceGroup.Name'     )
          .orderBy ('ServiceEnterprise.Name')
      }

      /* Filtro por Subsidiary distinct => Service Group */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.ServiceGroupId) === 0 && parseInt (Query.Distinct) !== 0)
      {
        ResultList = await this.SelectDistinctServiceGroup()
          .where ('ServiceSubsidiary.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('ServiceSubsidiary.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .orderBy ('ServiceGroup.Name')
      }

      /* Filtro por Subsidiary sem Enterprise */

      else if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.ServiceGroupId) === 0)
      {
        ResultList = await DBQuery
        .where ('ServiceSubsidiary.SubsidiaryId', parseInt (Query.SubsidiaryId))
        .orderBy ('Enterprise.Nick'       )
        .orderBy ('ServiceGroup.Name'     )
        .orderBy ('ServiceEnterprise.Name')
      }

      /* Filtro por Subsidiary / Group */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.ServiceGroupId) !== 0)
      {
        ResultList = await DBQuery
          .where ('ServiceSubsidiary.EnterpriseId'  , parseInt (Query.EnterpriseId  ))
          .where ('ServiceSubsidiary.SubsidiaryId'  , parseInt (Query.SubsidiaryId  ))
          .where ('ServiceEnterprise.ServiceGroupId', parseInt (Query.ServiceGroupId))
          .orderBy ('ServiceEnterprise.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Nick'       )
          .orderBy ('Subsidiary.IATA'       )
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
   * Display a single ServiceSubsidiary.
   * GET serviceSubsidiary/:id
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
        .where ('ServiceSubsidiary.Id', parseInt (params.id))

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
      .table ('ServiceSubsidiary')
      .select
      (
        "ServiceSubsidiary.*",

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

        "ServiceEnterprise.Code      as ServiceEnterpriseCode",
        "ServiceEnterprise.Name      as ServiceEnterpriseName",
        "ServiceEnterprise.Nick      as ServiceEnterpriseNick",
        "ServiceEnterprise.Enabled   as ServiceEnterpriseEnabled",
        "ServiceEnterprise.BeginDate as ServiceEnterpriseBeginDate",
        "ServiceEnterprise.EndDate   as ServiceEnterpriseEndDate",

        "ServiceGroup.Id     as ServiceGroupId",
        "ServiceGroup.Code   as ServiceGroupCode",
        "ServiceGroup.Name   as ServiceGroupName",
        "ServiceGroup.Nick   as ServiceGroupNick",
        "ServiceGroup.Status as ServiceGroupStatus"
      )
      .innerJoin ("Company as Enterprise", "Enterprise.Id"       , "ServiceSubsidiary.EnterpriseId"       )
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id"       , "ServiceSubsidiary.SubsidiaryId"       )
      .innerJoin ("ServiceEnterprise"    , "ServiceEnterprise.Id", "ServiceSubsidiary.ServiceEnterpriseId")
      .innerJoin ("ServiceGroup"         , "ServiceGroup.Id"     , "ServiceEnterprise.ServiceGroupId"     )

  }





  /* Monta os parâmetros para acesso ao banco */

  SelectDistinctSubsidiary()
  {

    return Database 
      .table ('ServiceSubsidiary')
      .select
      (
        "ServiceSubsidiary.SubsidiaryId",

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
      .distinct ("Subsidiary.IATA")
      .innerJoin ("Company as Enterprise", "Enterprise.Id"       , "ServiceSubsidiary.EnterpriseId"       )
      .innerJoin ("Company as Subsidiary"   , "Subsidiary.Id"          , "ServiceSubsidiary.SubsidiaryId"          )
      .innerJoin ("ServiceEnterprise"    , "ServiceEnterprise.Id", "ServiceSubsidiary.ServiceEnterpriseId")
      .innerJoin ("ServiceGroup"         , "ServiceGroup.Id"     , "ServiceEnterprise.ServiceGroupId"  )

  }





  /* Monta os parâmetros para acesso ao banco - distinct */

  SelectDistinctServiceGroup()
  {

    return Database 
      .table ('ServiceSubsidiary')
      .select
      (
        "ServiceEnterprise.ServiceGroupId",

        "ServiceGroup.Code   as ServiceGroupCode",
        "ServiceGroup.Name   as ServiceGroupName",
        "ServiceGroup.Nick   as ServiceGroupNick",
        "ServiceGroup.Status as ServiceGroupStatus"
      )
      .distinct ("ServiceGroup.Name")
      .innerJoin ("Company as Enterprise", "Enterprise.Id"       , "ServiceSubsidiary.EnterpriseId"       )
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id"       , "ServiceSubsidiary.SubsidiaryId"       )
      .innerJoin ("ServiceEnterprise"    , "ServiceEnterprise.Id", "ServiceSubsidiary.ServiceEnterpriseId")
      .innerJoin ("ServiceGroup"         , "ServiceGroup.Id"     , "ServiceEnterprise.ServiceGroupId"     )

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


      ResultList [Actual] .ServiceEnterprise =
      {
        "Code"     : ResultList [Actual] .ServiceEnterpriseCode,
        "Name"     : ResultList [Actual] .ServiceEnterpriseName,
        "Nick"     : ResultList [Actual] .ServiceEnterpriseNick,
        "Enabled"  : ResultList [Actual] .ServiceEnterpriseEnabled,
        "BeginDate": ResultList [Actual] .ServiceEnterpriseBeginDate,
        "EndDate"  : ResultList [Actual] .ServiceEnterpriseEndDate
      }

      delete ResultList [Actual] .ServiceEnterpriseCode
      delete ResultList [Actual] .ServiceEnterpriseName
      delete ResultList [Actual] .ServiceEnterpriseNick
      delete ResultList [Actual] .ServiceEnterpriseEnabled
      delete ResultList [Actual] .ServiceEnterpriseBeginDate
      delete ResultList [Actual] .ServiceEnterpriseEndDate


      ResultList [Actual] .ServiceGroup =
      {
        "Id"        : ResultList [Actual] .ServiceGroupId,
        "Code"      : ResultList [Actual] .ServiceGroupCode,
        "Name"      : ResultList [Actual] .ServiceGroupName,
        "Nick"      : ResultList [Actual] .ServiceGroupNick,
        "Status"    : ResultList [Actual] .ServiceGroupStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .ServiceGroupStatus]
      }

      delete ResultList [Actual] .ServiceGroupId
      delete ResultList [Actual] .ServiceGroupCode
      delete ResultList [Actual] .ServiceGroupName
      delete ResultList [Actual] .ServiceGroupNick
      delete ResultList [Actual] .ServiceGroupStatus
    }


    return ResultList

  }





  /**
   * Create/save a new ServiceSubsidiary.
   * POST serviceSubsidiary
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
   * Update ServiceSubsidiary details.
   * PUT serviceSubsidiary/:id
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

      let RecordUpdate = await ServiceSubsidiaryModel.find (params.id)

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

    let RegisterExists = new ServiceSubsidiaryModel()
    let ResponseBody   = []


    /* Gera um código */

    // if (parseInt (body.Code) === 0)
    // {
    //   const Maximum = await Database .from ('ServiceSubsidiary') .max ('Code as Code') .where ('EnterpriseId', body.EnterpriseId)

    //   if (Maximum [0] .Code === 999999999)
    //   {
    //     ResponseBody.push ({ code: 400, msg: Message.CODEREQUIRED })
    //   }
    //   else
    //   {
    //     body.Code = ++Maximum [0] .Code
    //   }
    // }


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

      /* Valida o Enterprise / ServiceEnterprise */

      if (typeof (body.ServiceEnterpriseId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.SERVICEENTERPRISEINTEGER })
      }
      else if (parseInt (body.ServiceEnterpriseId) < 1 || parseInt (body.ServiceEnterpriseId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.SERVICEENTERPRISERANGE })
      }
      else
      {
        let ServiceEnterpriseRecordExists = await ServiceEnterpriseModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Id': body.ServiceEnterpriseId })

        if (ServiceEnterpriseRecordExists)
        {
          if (! ServiceEnterpriseRecordExists.Enabled)   { ResponseBody.push ({ code: 400, msg: Message.SERVICEENTERPRISESTATUS }) }

          let ServiceGroupRecordExists = await ServiceGroupModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Id': ServiceEnterpriseRecordExists.ServiceGroupId })
    
          if (ServiceGroupRecordExists)
          {
            if (ServiceGroupRecordExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.SERVICEGROUPSTATUS }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.SERVICEGROUPNOTFOUND })
          }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.SERVICEENTERPRISENOTFOUND })
        }
      }

      /* Valida a duplicidade de chave */

      RegisterExists = await ServiceSubsidiaryModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId, 'ServiceEnterpriseId': body.ServiceEnterpriseId })
  
      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.ServiceSubsidiaryDuplicated }) }
      }

      //#region DISABLED
        /* Valida o Enterprise / Code */
        /*
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
          RegisterExists = await ServiceSubsidiaryModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Code': body.Code })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.KEYDUPLICATED }) }
          }
        }
        */

        /* Valida o Enterprise / Name */
        /*
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
          RegisterExists = await ServiceSubsidiaryModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Name': body.Name })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
          }
        }
        */

        /* Valida o Nick */
        /*
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
          RegisterExists = await ServiceSubsidiaryModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'Nick': body.Nick })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.LABELDUPLICATED }) }
          }
        }
        */
      //#endregion

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

    ServiceSubsidiaryModel.create
    (
      {
        //#region INSERT

          EnterpriseId       : body.EnterpriseId,
          SubsidiaryId       : body.SubsidiaryId,
          ServiceEnterpriseId: body.ServiceEnterpriseId,

          //Code: body.Code,
          //Name: body.Name,
          //Nick: body.Nick,

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

          EnterpriseId       : body.EnterpriseId,
          SubsidiaryId       : body.SubsidiaryId,
          ServiceEnterpriseId: body.ServiceEnterpriseId,

          //Code: body.Code,
          //Name: body.Name,
          //Nick: body.Nick,

          Enabled  : body.Enabled,
          BeginDate: body.BeginDate,
          EndDate  : body.EndDate

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Delete a ServiceSubsidiary with id.
   * DELETE ServiceSubsidiary/:id
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

      let RecordDelete = await ServiceSubsidiaryModel.find (params.id)

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
   * Loads a group of ServiceSubsidiary records.
   * POST ServiceSubsidiary/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new ServiceSubsidiaryModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await ServiceSubsidiaryModel.findBy ({ 'EnterpriseId':RecordsArray [Actual] .EnterpriseId, 'SubsidiaryId': RecordsArray [Actual] .SubsidiaryId, 'ServiceEnterpriseId': RecordsArray [Actual] .ServiceEnterpriseId })
        
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





module.exports = ServiceSubsidiaryController

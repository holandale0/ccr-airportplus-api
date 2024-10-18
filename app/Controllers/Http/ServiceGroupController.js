'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const ServiceGroupModel = use ('App/Models/ServiceGroup')
const CompanyModel      = use ('App/Models/Company'     )

//#endregion





/**
 * Resourceful controller for interacting with ServiceGroups
 */

class ServiceGroupController
{





  /**
   * Show a list of all ServiceGroups.
   * GET servicegroup
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

      if (typeof (Query.EnterpriseId ) === "undefined")   { Query.EnterpriseId  = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0)   { return ServiceGroupModel.all() }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0)
      {
        ResultList = await DBQuery
          .where ('ServiceGroup.EnterpriseId', parseInt (Query.EnterpriseId))
          .orderBy ('ServiceGroup.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name'  )
          .orderBy ('ServiceGroup.Name')
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single ServiceGroup.
   * GET servicegroup/:id
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
        .where ('ServiceGroup.Id', parseInt (params.id))

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
      .table ('ServiceGroup')
      .select
      (
        "ServiceGroup.*",

        "Enterprise.Code   as EnterpriseCode",
        "Enterprise.Name   as EnterpriseName",
        "Enterprise.Nick   as EnterpriseNick",
        "Enterprise.Status as EnterpriseStatus"
      )
      .innerJoin ("Company as Enterprise", "Enterprise.Id", "ServiceGroup.EnterpriseId")

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
    }


    return ResultList

  }





  /**
   * Create/save a new ServiceGroup.
   * POST servicegroup
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
   * Update ServiceGroup details.
   * PUT servicegroup/:id
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

      let RecordUpdate = await ServiceGroupModel.find (params.id)

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

    let RegisterExists = new ServiceGroupModel()
    let ResponseBody   = []


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('ServiceGroup') .max ('Code as Code') .where ('EnterpriseId', body.EnterpriseId)

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

      /* Verifica duplicidade de Code */

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
        RegisterExists = await ServiceGroupModel.findBy ({ 'Code': body.Code, 'EnterpriseId': body.EnterpriseId })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.KEYDUPLICATED }) }
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
        RegisterExists = await ServiceGroupModel.findBy ({ 'Name': body.Name, 'EnterpriseId': body.EnterpriseId })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
        }
      }

      /* Verifica duplicidade de Nick */

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
        RegisterExists = await ServiceGroupModel.findBy ({ 'Nick': body.Nick, 'EnterpriseId': body.EnterpriseId })

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.LABELDUPLICATED }) }
        }
      }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    ServiceGroupModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,

          Code: body.Code,
          Name: body.Name,
          Nick: body.Nick,

          Description: body.Description,

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

          Code: body.Code,
          Name: body.Name,
          Nick: body.Nick,

          Description: body.Description,

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a ServiceGroup status with id.
   * PATCH servicegroup/:id
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

      let RecordStatus = await ServiceGroupModel.find (params.id)

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
   * Delete a ServiceGroup with id.
   * DELETE servicegroup/:id
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

      let RecordDelete = await ServiceGroupModel.find (params.id)

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
   * Loads a group of ServiceGroup records.
   * POST servicegroup/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new ServiceGroupModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await ServiceGroupModel.findBy ({ 'Code': RecordsArray [Actual] .Code, 'EnterpriseId': RecordsArray [Actual] .EnterpriseId })

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





module.exports = ServiceGroupController

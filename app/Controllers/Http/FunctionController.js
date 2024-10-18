'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const FunctionModel = use ('App/Models/Function')
const SystemModel   = use ('App/Models/System'  )

//#endregion





/**
 * Resourceful controller for interacting with Functions
 */

class FunctionController
{





  /**
   * Show a list of all Functions.
   * GET function
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

      if (typeof (Query.SystemId) === "undefined")   { Query.SystemId = 0 }

      //---if (Query.SystemId === 0)   { return FunctionModel.all() }


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por System */

      if (parseInt (Query.SystemId) !== 0)
      {
        ResultList = await DBQuery
          .where ('SystemId', parseInt (Query.SystemId))
          .orderBy ('Function.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('System.Name'  )
          .orderBy ('Function.Name')
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single Function.
   * GET function/:id
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
      //return FunctionModel.find (params.id)

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('Function.Id', parseInt (params.id))

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
      .table ('Function') 
      .select
      ( 
        "Function.*",

        "System.Code   as SystemCode",
        "System.Name   as SystemName",
        "System.Status as SystemStatus"
      )
      .innerJoin ("System", "System.Id", "Function.SystemId")

  }





  //* Monta os objetos e elimina os campos individuais */

  async MontarObjetos (ResultList)
  {

    for (let Actual = 0; Actual < ResultList.length; Actual++)
    {
      ResultList [Actual] .StatusName = Status.StatusName [ResultList [Actual] .Status]


      ResultList [Actual] .System = 
      {
        "Code"      : ResultList [Actual] .SystemCode,
        "Name"      : ResultList [Actual] .SystemName,
        "Status"    : ResultList [Actual] .SystemStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .SystemStatus]
      }

      delete ResultList [Actual] .SystemCode
      delete ResultList [Actual] .SystemName
      delete ResultList [Actual] .SystemStatus
    }

    return ResultList

  }





  /**
   * Create/save a new Function.
   * POST function
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
   * Update Function details.
   * PUT function/:id
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

      let RecordUpdate = await FunctionModel.find (params.id)

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
      console.log (error)

      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  async ValidateAll (request, params)
  {

    const body = request.body

    let RegisterExists = new FunctionModel()
    let ResponseBody   = []


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('Function') .max ('Code as Code') .where ('SystemId', body.SystemId)

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


      /* Valida System */

      if (typeof (body.SystemId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.SystemInteger })
      }
      else if (parseInt (body.SystemId) < 1 || parseInt (body.SystemId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.SystemRange })
      }
      else
      {
        RegisterExists = await SystemModel.find (parseInt (body.SystemId))

        if (RegisterExists)
        {
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.SystemStatus }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.SystemNotFound })
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
        RegisterExists = await FunctionModel.findBy ({ 'Code': body.Code, 'SystemId': body.SystemId })

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
        RegisterExists = await FunctionModel.findBy ({ 'Name': body.Name, 'SystemId': body.SystemId })

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

    FunctionModel.create
    (
      {
        //#region INSERT

          SystemId: body.SystemId,

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
   * Update a Function status with id.
   * PATCH function/:id
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

      let RecordStatus = await FunctionModel.find (params.id)

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
   * Delete a Function with id.
   * DELETE function/:id
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

      let RecordDelete = await FunctionModel.find (params.id)

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
   * Loads a group of Function records.
   * POST function/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new FunctionModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await FunctionModel.findBy ({ 'Code': RecordsArray [Actual] .Code, 'SystemId': RecordsArray [Actual] .SystemId })

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





module.exports = FunctionController

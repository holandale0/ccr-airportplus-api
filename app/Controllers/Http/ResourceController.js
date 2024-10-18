'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const ResourceModel = use ('App/Models/Resource')
const CompanyModel  = use ('App/Models/Company' )
//---const TerminalModel = use ('App/Models/Terminal')

//#endregion


//#region TYPES

const TypeName =
[
  "Invalid",
  "Terminal",
  "Gate",
  "Stand",
  "Checkin Counter",
  "Belt"
]

//#endregion





/**
 * Resourceful controller for interacting with Resources
 */

class ResourceController
{





  /**
   * Show a list of all Resources.
   * GET resource
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

      if (typeof (Query.SubsidiaryId) === "undefined")   { Query.SubsidiaryId = 0 }

      //---if (typeof (Query.Gate          ) === "undefined")   { Query.Gate           = "" }
      //---if (typeof (Query.Stand         ) === "undefined")   { Query.Stand          = "" }
      //---if (typeof (Query.CheckinCounter) === "undefined")   { Query.CheckinCounter = "" }
      //---if (typeof (Query.Belt          ) === "undefined")   { Query.Belt           = "" }

      //---if (parseInt (Query.SubsidiaryId) === 0)   { return ResourceModel.all() }


      /*
      if (parseInt (Query.TerminalId) === 0)
      {
        if (Query.Gate === "" && Query.Stand === "" && Query.CheckinCounter === "" && Query.Belt === "")   { return ResourceModel.all() }
  
        if (Query.Gate           === "true")   { return await Database .table ('Resource') .select ("*") .where ('Gate'          , 1) }
        if (Query.Stand          === "true")   { return await Database .table ('Resource') .select ("*") .where ('Stand'         , 1) }
        if (Query.CheckinCounter === "true")   { return await Database .table ('Resource') .select ("*") .where ('CheckinCounter', 1) }
        if (Query.Belt           === "true")   { return await Database .table ('Resource') .select ("*") .where ('Belt'          , 1) }

        return ResourceModel.all()
      }
      else
      {
        if (Query.Gate === "" && Query.Stand === "" && Query.CheckinCounter === "" && Query.Belt === "")   { return await Database .table ('Resource') .select ('*') .where ('TerminalId', parseInt (Query.TerminalId)) }
  
        if (Query.Gate           === "true")   { return await Database .table ('Resource') .select ("*") .where ('TerminalId', parseInt (Query.TerminalId), 'Gate'          , 1) }
        if (Query.Stand          === "true")   { return await Database .table ('Resource') .select ("*") .where ('TerminalId', parseInt (Query.TerminalId), 'Stand'         , 1) }
        if (Query.CheckinCounter === "true")   { return await Database .table ('Resource') .select ("*") .where ('TerminalId', parseInt (Query.TerminalId), 'CheckinCounter', 1) }
        if (Query.Belt           === "true")   { return await Database .table ('Resource') .select ("*") .where ('TerminalId', parseInt (Query.TerminalId), 'Belt'          , 1) }

        return await Database .table ('Resource') .select ('*') .where ('TerminalId', parseInt (Query.TerminalId))
      }
      */


      if (typeof (Query.Type) === "undefined")   { Query.Type = 0 }


      let ResultList = {}

      let  DBQuery = this.SelectFields()

      if (parseInt (Query.Type) !== 0)   { DBQuery = this.SelectFields() .where ('Type', Query.Type) }

      //---if      (Query.Gate           === "true")   { DBQuery = this.SelectFields() .where ('Gate'          , 1) }
      //---else if (Query.Stand          === "true")   { DBQuery = this.SelectFields() .where ('Stand'         , 1) }
      //---else if (Query.CheckinCounter === "true")   { DBQuery = this.SelectFields() .where ('CheckinCounter', 1) }
      //---else if (Query.Belt           === "true")   { DBQuery = this.SelectFields() .where ('Belt'          , 1) }


      /* Filtro por Subsidiary */

      if (parseInt (Query.SubsidiaryId) !== 0)
      {
        ResultList = await DBQuery
          .where ('Resource.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .orderBy ('Resource.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Subsidiary.Name')
          .orderBy ('Resource.Name'  )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single Resource.
   * GET resource/:id
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
      //return ResourceModel.find (params.id)

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('Resource.Id', parseInt (params.id))

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
      .table ('Resource') 
      .select
      ( 
        "Resource.*",

        //---"Terminal.SubsidiaryId as TerminalSubsidiaryId",
        //---"Terminal.Code      as TerminalCode",
        //---"Terminal.Name      as TerminalName",
        //---"Terminal.Status    as TerminalStatus",

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
      //---.innerJoin ("Terminal"          , "Terminal.Id", "Resource.TerminalId")
      //---.innerJoin ("Company as Subsidiary", "Subsidiary.Id" , "Terminal.SubsidiaryId" )
      .innerJoin ("Company as Subsidiary", "Subsidiary.Id", "Resource.SubsidiaryId")

  }





  //* Monta os objetos e elimina os campos individuais */

  async MontarObjetos (ResultList)
  {

    for (let Actual = 0; Actual < ResultList.length; Actual++)
    {
      ResultList [Actual] .TypeName   = TypeName          [ResultList [Actual] .Type  ]
      ResultList [Actual] .StatusName = Status.StatusName [ResultList [Actual] .Status]


      //---ResultList [Actual] .Terminal = 
      //---{
      //---  "SubsidiaryId" : ResultList [Actual] .TerminalSubsidiaryId,
      //---  "Code"      : ResultList [Actual] .TerminalCode,
      //---  "Name"      : ResultList [Actual] .TerminalName,
      //---  "Status"    : ResultList [Actual] .TerminalStatus,
      //---  "StatusName": Status.StatusName [ResultList [Actual] .TerminalStatus]
      //---}

      //---delete ResultList [Actual] .TerminalSubsidiaryId
      //---delete ResultList [Actual] .TerminalCode
      //---delete ResultList [Actual] .TerminalName
      //---delete ResultList [Actual] .TerminalStatus


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
   * Create/save a new Resource.
   * POST resource
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
   * Update Resource details.
   * PUT resource/:id
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

      let RecordUpdate = await ResourceModel.find (params.id)

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

      let RegisterExists = new ResourceModel()
      let ResponseBody   = []


      /* Gera um código */

      if (parseInt (body.Code) === 0)
      {
        //---const Maximum = await Database .from ('Resource') .max ('Code as Code') .where ('TerminalId', body.TerminalId)
        const Maximum = await Database .from ('Resource') .max ('Code as Code') .where ('SubsidiaryId', body.SubsidiaryId)

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
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.SubsidiaryNotFound })
          }
        }

        /* Valida o Terminal */

        //---if (typeof (body.TerminalId) !== "number")
        //---{
        //---  ResponseBody.push ({ code: 400, msg: Message.TERMINALINTEGER })
        //---}
        //---else if (parseInt (body.TerminalId) < 1 || parseInt (body.TerminalId) > 999999999)
        //---{
        //---  ResponseBody.push ({ code: 400, msg: Message.TERMINALRANGE })
        //---}
        //---else
        //---{
        //---  RegisterExists = await TerminalModel.find (body.TerminalId)

        //---  if (RegisterExists)
        //---  {
        //---    if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.TERMINALSTATUS }) }
        //---  }
        //---  else
        //---  {
        //---    ResponseBody.push ({ code: 400, msg: Message.TERMINALNOTFOUND })
        //---  }
        //---}

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
          //---RegisterExists = await ResourceModel.findBy ({ 'Code': body.Code, 'TerminalId': body.TerminalId })
          RegisterExists = await ResourceModel.findBy ({ 'Code': body.Code, 'SubsidiaryId': body.SubsidiaryId })

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
          //---RegisterExists = await ResourceModel.findBy ({ 'Name': body.Name, 'TerminalId': body.TerminalId })
          RegisterExists = await ResourceModel.findBy ({ 'Name': body.Name, 'SubsidiaryId': body.SubsidiaryId })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
          }
        }

        /* Verifica duplicidade de Nick */

        if (typeof (body.Nick) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.NICKSTRING })
        }
        else if (body.Nick.length < 1 || body.Nick.length > 20)
        {
          ResponseBody.push ({ code: 400, msg: Message.NICKMAX })
        }
        else
        {
          //---RegisterExists = await ResourceModel.findBy ({ 'Nick': body.Nick, 'TerminalId': body.TerminalId })
          RegisterExists = await ResourceModel.findBy ({ 'Nick': body.Nick, 'SubsidiaryId': body.SubsidiaryId })

          if (RegisterExists)
          {
            if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NICKDUPLICATED }) }
          }
        }

        /* Valida o Type */

        if (typeof (body.Type) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.TYPEINTEGER })
        }
        else if (parseInt (body.Type) < 1 || parseInt (body.Type) > 5)
        {
          ResponseBody.push ({ code: 400, msg: Message.TYPERANGE001005 })
        }

        /* Valida o Gate */

        //---if (typeof (body.Gate)           !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.GATEBOOLEAN           }) }

        /* Valida o Stand */

        //---if (typeof (body.Stand)          !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.STANDBOOLEAN          }) }

        /* Valida o Checkin Counter */

        //---if (typeof (body.CheckinCounter) !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.CHECKINCOUNTERBOOLEAN }) }

        /* Valida o Belt */

        //---if (typeof (body.Belt)           !== "boolean")   { ResponseBody.push ({ code: 400, msg: Message.BELTBOOLEAN           }) }

        //* Verifica os indicadores */

        //---if (! body.Gate && ! body.Stand && ! body.CheckinCounter && ! body.Belt)   { ResponseBody.push ({ code: 400, msg: Message.RESOURCENOTDEFINED }) }


      //#endregion


      return ResponseBody

  }





  async StoreDatabase (body)
  {

    ResourceModel.create
    (
      {
        //#region INSERT

          SubsidiaryId: body.SubsidiaryId,
          //---TerminalId: body.TerminalId,

          Code: body.Code,
          Name: body.Name,
          Nick: body.Nick,

          Type: body.Type,

          //---Gate          : body.Gate,
          //---Stand         : body.Stand,
          //---CheckinCounter: body.CheckinCounter,
          //---Belt          : body.Belt,

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
          Name: body.Name,
          Nick: body.Nick,

          Type: body.Type,

          //---Gate          : body.Gate,
          //---Stand         : body.Stand,
          //---CheckinCounter: body.CheckinCounter,
          //---Belt          : body.Belt

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a Resource status with id.
   * PATCH resource/:id
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

      let RecordStatus = await ResourceModel.find (params.id)

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
   * Delete a Resource with id.
   * DELETE resource/:id
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

      let RecordDelete = await ResourceModel.find (params.id)

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
   * Loads a group of Resource records.
   * POST resource/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new ResourceModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        //---RegisterExists = await ResourceModel.findBy ({ 'Code': RecordsArray [Actual] .Code, 'TerminalId': RecordsArray [Actual] .TerminalId })
        RegisterExists = await ResourceModel.findBy ({ 'Code': RecordsArray [Actual] .Code, 'SubsidiaryId': RecordsArray [Actual] .SubsidiaryId })

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





module.exports = ResourceController

'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const UserRoleModel = use ('App/Models/UserRole')
const UserModel     = use ('App/Models/User'    )
const RoleModel     = use ('App/Models/Role'    )

//#endregion





/**
 * Resourceful controller for interacting with Roles
 */

class UserRoleController
{





  /**
   * Show a list of all UserRoles.
   * GET userrole
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
      if (typeof (Query.UserId      ) === "undefined")   { Query.UserId       = 0 }
      if (typeof (Query.RoleId      ) === "undefined")   { Query.RoleId       = 0 }
      if (typeof (Query.SubsidiaryId) === "undefined")   { Query.SubsidiaryId = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.UserId) === 0 && parseInt (Query.RoleId) === 0 && parseInt (Query.SubsidiaryId) === 0)   { return UserRoleModel.all() }
      //---else
      //---{
      //---  return await Database .table ('UserRole') .select ('*') .where ('UserId', parseInt (Query.UserId))
      //---}


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.UserId) === 0 && parseInt (Query.RoleId) === 0 && parseInt (Query.SubsidiaryId) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .orderBy ('Subsidiary.Name')
          .orderBy ('User.Name'      )
          .orderBy ('Role.Name'      )
      }

      /* Filtro por Enterprise / User */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.UserId) !== 0 && parseInt (Query.RoleId) === 0 && parseInt (Query.SubsidiaryId) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id'  , parseInt (Query.EnterpriseId))
          .where ('UserRole.UserId', parseInt (Query.UserId      ))
          .orderBy ('Role.Name')
      }

      /* Filtro por Enterprise / Role */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.UserId) === 0 && parseInt (Query.RoleId) !== 0 && parseInt (Query.SubsidiaryId) === 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id'  , parseInt (Query.EnterpriseId))
          .where ('UserRole.RoleId', parseInt (Query.RoleId      ))
          .orderBy ('User.Name')
      }

      /* Filtro por Enterprise / Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.UserId) === 0 && parseInt (Query.RoleId) === 0 && parseInt (Query.SubsidiaryId) !== 0)
      {
        ResultList = await DBQuery
          .where ('Enterprise.Id', parseInt (Query.EnterpriseId))
          .where ('Subsidiary.Id', parseInt (Query.SubsidiaryId))
          .orderBy ('User.Name')
      }

      /* Filtro por User */

      else if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.UserId) !== 0 && parseInt (Query.RoleId) === 0 && parseInt (Query.SubsidiaryId) === 0)
      {
        ResultList = await DBQuery
          .where ('UserRole.UserId', parseInt (Query.UserId))
          .orderBy ('Enterprise.Name')
          .orderBy ('Role.Name'      )
      }

      /* Filtro por Role */

      else if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.UserId) === 0 && parseInt (Query.RoleId) !== 0 && parseInt (Query.SubsidiaryId) === 0)
      {
        ResultList = await DBQuery
          .where ('UserRole.RoleId', parseInt (Query.RoleId))
          .orderBy ('User.Name')
      }

      else
      {
        ResultList = await DBQuery
          .orderBy ('Enterprise.Name')
          .orderBy ('Subsidiary.Name')
          .orderBy ('User.Name'      )
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
   * Display a single UserRole.
   * GET userrole/:id
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
      //---return await UserRoleModel.findBy ({ 'UserId': parseInt (params.UserId), 'RoleId': parseInt (params.RoleId), 'SubsidiaryId': parseInt (params.SubsidiaryId) })

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('UserRole.Id', parseInt (params.id))

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
      .table ('UserRole') 
      .select
      ( 
        "UserRole.*",

        "User.Code   as UserCode",
        "User.Name   as UserName",
        "User.Nick   as UserNick",
        "User.Email  as UserEmail",
        "User.Status as UserStatus",

        "Role.EnterpriseId as RoleEnterpriseId",
        "Role.SubsidiaryId as RoleSubsidiaryId",
        "Role.Code         as RoleCode",
        "Role.Name         as RoleName",
        "Role.Status       as RoleStatus",
  
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
      .innerJoin ("User"                 , "User.Id"      , "UserRole.UserId"  )
      .innerJoin ("Role"                 , "Role.Id"      , "UserRole.RoleId"  )
      .leftJoin  ("Company as Enterprise", "Enterprise.Id", "Role.EnterpriseId")
      .leftJoin  ("Company as Subsidiary", "Subsidiary.Id", "Role.SubsidiaryId")

  }





  //* Monta os objetos e limpa os campos individuais */

  async MontarObjetos (ResultList)
  {

    for (let Actual = 0; Actual < ResultList.length; Actual++)
    {
      ResultList [Actual] .StatusName = Status.StatusName [ResultList [Actual] .Status]


      ResultList [Actual] .User = 
      {
        "Code"      : ResultList [Actual] .UserCode,
        "Name"      : ResultList [Actual] .UserName,
        "Nick"      : ResultList [Actual] .UserNick,
        "Email"     : ResultList [Actual] .UserEmail,
        "Status"    : ResultList [Actual] .UserStatus,
        "StatusName": Status.StatusName [ResultList [Actual] .UserStatus]
      }

      delete ResultList [Actual] .UserCode
      delete ResultList [Actual] .UserName
      delete ResultList [Actual] .UserNick
      delete ResultList [Actual] .UserEmail
      delete ResultList [Actual] .UserStatus


      ResultList [Actual] .Role = 
      {
        "EnterpriseId": ResultList [Actual] .RoleEnterpriseId,
        "SubsidiaryId": ResultList [Actual] .RoleSubsidiaryId,
        "Code"        : ResultList [Actual] .RoleCode,
        "Name"        : ResultList [Actual] .RoleName,
        "Status"      : ResultList [Actual] .RoleStatus,
        "StatusName"  : Status.StatusName [ResultList [Actual] .RoleStatus]
      }

      delete ResultList [Actual] .RoleEnterpriseId
      delete ResultList [Actual] .RoleSubsidiaryId
      delete ResultList [Actual] .RoleCode
      delete ResultList [Actual] .RoleName
      delete ResultList [Actual] .RoleStatus


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
   * Create/save a new UserRole.
   * POST userrole
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
   * Update UserRole details.
   * PUT userrole/:id
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

      let RecordUpdate = await UserRoleModel.find (params.id)

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
    let EnterpriseId   = 0


    //#region VALIDATION


      /* Valida User */

      if (typeof (body.UserId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.UserInteger })
      }
      else if (parseInt (body.UserId) < 1 || parseInt (body.UserId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.UserRange })
      }
      else
      {
        RegisterExists = await UserModel.find (parseInt (body.UserId))

        if (RegisterExists)
        {
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.UserStatus }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.UserNotFound })
        }
      }

      /* Valida Role */

      if (typeof (body.RoleId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.RoleInteger })
      }
      else if (parseInt (body.RoleId) < 1 || parseInt (body.RoleId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.RoleRange })
      }
      else
      {
        RegisterExists = await RoleModel.find (parseInt (body.RoleId))

        if (RegisterExists)
        {
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.RoleStatus }) }

          EnterpriseId = RegisterExists.EnterpriseId
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.RoleNotFound })
        }
      }

      /* Verifica duplicidade de chave */

      RegisterExists = await UserRoleModel.findBy ({ 'UserId': parseInt (body.UserId), 'RoleId': parseInt (body.RoleId) })

      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.IDSDUPLICATED }) }
      }
      // else
      // {
      //   if (params)   { ResponseBody.push ({ code: 400, msg: Message.UserRoleNotFound }) }
      // }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    UserRoleModel.create
    (
      {
        //#region INSERT

          UserId: body.UserId,
          RoleId: body.RoleId,

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

          UserId: body.UserId,
          RoleId: body.RoleId

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a RoleFunction status with id.
   * PATCH userrole/:id
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

      let RecordStatus = await UserRoleModel.find (params.id)

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
   * Delete a UserRole with id.
   * DELETE userrole/:id
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

      let RecordDelete = await UserRoleModel.find (params.id)

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
   * Loads a group of UserRole records.
   * POST userrole/load
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
        RegisterExists = await UserRoleModel.findBy ({ 'UserId': parseInt (RecordsArray [Actual] .UserId), 'RoleId': parseInt (RecordsArray [Actual] .RoleId) })

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





module.exports = UserRoleController

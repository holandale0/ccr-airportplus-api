'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')
const Hash     = use ('Hash')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const UserModel  = use ('App/Models/User' )
const TokenModel = use ('App/Models/Token')

//#endregion


const MailService = use ('App/Services/Mail')





/**
 * Resourceful controller for interacting with users
 */

class UserController
{





  /**
   * Show a list of all users.
   * GET user
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
      return UserModel.all()
    }
    catch (error)
    {
      console.log ("UserController -> index -> error", error)

      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single User.
   * GET user/:id
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
      return UserModel.find (params.id)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Create/save a new User.
   * POST user
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
   * Update User details.
   * PUT user/:id
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

      let RecordUpdate = await UserModel.find (params.id)

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

    let RegisterExists = new UserModel()
    let ResponseBody   = []


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('User') .max ('Code as Code')

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
        RegisterExists = await UserModel.findBy ('Code', body.Code)

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.CODEDUPLICATED }) }
        }
      }

      /* Valida o Name */

      if (typeof (body.Name) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.NAMESTRING })
      }
      else if (body.Name.length < 1 || body.Name.length > 60)
      {
        ResponseBody.push ({ code: 400, msg: Message.NAMEMAX })
      }

      /* Valida o Nick */

      if (body.Nick !== null)
      {
        if (typeof (body.Nick) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.NICKSTRING })
        }
        else if (body.Nick.length < 1 || body.Nick.length > 20)
        {
          ResponseBody.push ({ code: 400, msg: Message.NICKMAX })
        }
      }

      /* Verifica duplicidade de Email */

      if (typeof (body.Email) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.EMAILSTRING })
      }
      else if (body.Email.length < 8 || body.Email.length > 50)
      {
        ResponseBody.push ({ code: 400, msg: Message.EMAILMAX })
      }
      else
      {
        RegisterExists = await UserModel.findBy ('Email', body.Email)

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.EMAILDUPLICATED }) }
        }
      }

      /* Valida o Password */

      if (body.Password !== null)
      {
        if (typeof (body.Password) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.PASSWORDSTRING })
        }
        else if (body.Password.length < 8 || body.Password.length > 16)
        {
          ResponseBody.push ({ code: 400, msg: Message.PASSWORDMAX })
        }
      }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    UserModel.create
    (
      {
        //#region INSERT

          Code    : body.Code,
          Name    : body.Name,
          Nick    : body.Nick,
          Email   : body.Email,
          Password: body.Password,

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

          Code    : body.Code,
          Name    : body.Name,
          Nick    : body.Nick,
          Email   : body.Email,
          Password: body.Password

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a User status with id.
   * PATCH user/:id
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

      let RecordStatus = await UserModel.find (params.id)

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
   * Delete a User with id.
   * DELETE user/:id
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

      console.log (params)

      let RecordDelete = await UserModel.find (parseInt (params.id))

      console.log (RecordDelete)

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
   * Loads a group of User records.
   * POST user/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new UserModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await UserModel.findBy ('Code', RecordsArray [Actual] .Code)

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





  async sendMail ({ request, response })
  {

    console.log ("sendMail -> ", request.body.Email)

    try
    {
      const MailRequest = new MailService();

      const MailResponse = await MailRequest.sendMail (request.body.Email)

      if (MailResponse.code === 400)   {  response.badRequest (MailResponse) }

      return response.ok (MailResponse)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  async resetPassword ({ params, request, response })
  {

    try
    {
      const TokenRecord = await TokenModel.findBy ('Token', params.token)

      const { Password1, Password2 } = request.body

      if ( Password1 !== Password2 )   { return response.badRequest ({ code: 400, msg: Message.PASSWORDSDONTMATCH }) }

      const UserRecord = await UserModel.find (TokenRecord.user_id)

      UserRecord.Password = Password1

      await UserRecord.save()

      return response.ok ({ code: 200, msg: Message.RECORDUPDATED })
    }
    catch (error)
    {
      console.log ("resetPassword -> error", error)

      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





}





module.exports = UserController

'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const AircraftModel = use ('App/Models/Aircraft')

//#endregion





/**
 * Resourceful controller for interacting with Aircraft
 */

class AircraftController
{





  /**
   * Show a list of all Aircrafts.
   * GET aircraft
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
      return AircraftModel.all()
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single Aircraft.
   * GET aircraft/:id
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
      return AircraftModel.find (params.id)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Create/save a new Aircraft.
   * POST aircraft
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
   * Update Aircraft details.
   * PUT aircraft/:id
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

      let RecordUpdate = await AircraftModel.find (params.id)

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

    let RegisterExists = new AircraftModel()
    let ResponseBody   = []


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('Aircraft') .max ('Code as Code')

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
        RegisterExists = await AircraftModel.findBy ('Code', body.Code)

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
        RegisterExists = await AircraftModel.findBy ('Name', body.Name)

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
        }
      }

      /* Verifica duplicidade de IATA */

      if (typeof (body.IATA) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.IATASTRING })
      }
      else if (body.IATA.length < 2 || body.IATA.length > 2)
      {
        ResponseBody.push ({ code: 400, msg: Message.IATAMAX2 })
      }
      else
      {
        RegisterExists = await AircraftModel.findBy ('IATA', body.IATA)

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   {ResponseBody.push ({ code: 400, msg: Message.IATADUPLICATED }) }
        }
      }

      /* Verifica duplicidade de ICAO */

      if (typeof (body.ICAO) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.ICAOSTRING })
      }
      else if (body.ICAO.length < 3 || body.ICAO.length > 3)
      {
        ResponseBody.push ({ code: 400, msg: Message.ICAOMAX3 })
      }
      else
      {
        RegisterExists = await AircraftModel.findBy ('ICAO', body.ICAO)

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.ICAODUPLICATED }) }
        }
      }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    AircraftModel.create
    (
      {
        //#region INSERT

          Code  : body.Code,
          Name  : body.Name,

          IATA  : body.IATA,
          ICAO  : body.ICAO,

          Status: Status.ACTIVE,

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

          IATA: body.IATA,
          ICAO: body.ICAO,

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a Aircraft status with id.
   * PATCH aircraft/:id
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

      let RecordStatus = await AircraftModel.find (params.id)

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
   * Delete a Aircraft with id.
   * DELETE aircraft/:id
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

      let RecordDelete = await AircraftModel.find (params.id)

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
   * Loads a group of Aircraft records.
   * POST aircraft/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new AircraftModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await AircraftModel.findBy ('Code', RecordsArray [Actual] .Code)

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





module.exports = AircraftController

'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const CompanyModel = use ('App/Models/Company')

//#endregion


//#region SERVICES

//---const AddressService = use ('App/Services/AddressService')

//#endregion





/**
 * Resourceful controller for interacting with companies
 */

class CompanyController
{





  /**
   * Show a list of all Companies.
   * GET company
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

      if (typeof (Query.Enterprise ) === "undefined")   { Query.Enterprise  = "" }
      if (typeof (Query.Subsidiary ) === "undefined")   { Query.Subsidiary  = "" }
      if (typeof (Query.Airport    ) === "undefined")   { Query.Airport     = "" }
      if (typeof (Query.Customer   ) === "undefined")   { Query.Customer    = "" }
      if (typeof (Query.Airline    ) === "undefined")   { Query.Airline     = "" }
      if (typeof (Query.Transporter) === "undefined")   { Query.Transporter = "" }

      if (Query.Enterprise === "" && Query.Subsidiary === "" && Query.Airport === "" && Query.Customer === "" && Query.Airline === "" && Query.Transporter === "")   { return CompanyModel.all() }

      if (Query.Enterprise  === "true")   { return await Database .table ('Company') .select ("*") .where ('Enterprise' , 1) }
      if (Query.Subsidiary  === "true")   { return await Database .table ('Company') .select ("*") .where ('Subsidiary' , 1) }
      if (Query.Airport     === "true")   { return await Database .table ('Company') .select ("*") .where ('Airport'    , 1) }
      if (Query.Customer    === "true")   { return await Database .table ('Company') .select ("*") .where ('Customer'   , 1) }
      if (Query.Airline     === "true")   { return await Database .table ('Company') .select ("*") .where ('Airline'    , 1) }
      if (Query.Transporter === "true")   { return await Database .table ('Company') .select ("*") .where ('Transporter', 1) }

      return CompanyModel.all()
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single Company.
   * GET company/:id
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
      return CompanyModel.find (params.id)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Create/save a new company.
   * POST company
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
   * Update Company details.
   * PUT company/:id
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

      let RecordUpdate = await CompanyModel.find (params.id)

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



    // /* ------------ Validating Duplicity for Code -------------- */
    // registerExists = await Database
    //   .table('Company')
    //   .select('Id')
    //   .where('Code', body.Code)
    //   .whereNot('Id', params.id)

    // if (registerExists.length > 0) {
    //   responseBody.push({
    //     code: 400,
    //     msg: "Code já existe"
    //   })
    // }

    // /* ------------ Validating Duplicity for Name -------------- */
    // registerExists = await Database
    //   .table('Company')
    //   .select('Id')
    //   .where('Name', body.Name)
    //   .whereNot('Id', params.id)

    // if (registerExists.length > 0) {
    //   responseBody.push({
    //     code: 400,
    //     msg: "Name já existe"
    //   })
    // }

    // /* ------------ Validating Duplicity for Nick -------------- */
    // registerExists = await Database
    //   .table('Company')
    //   .select('Id')
    //   .where('Nick', body.Nick)
    //   .whereNot('Id', params.id)

    // if (registerExists.length > 0) {
    //   responseBody.push({
    //     code: 400,
    //     msg: "Nick já existe"
    //   })
    // }





  async ValidateAll (request, params)
  {

    const body = request.body

    let RegisterExists = new CompanyModel()
    let ResponseBody   = []


    /* Gera um código */

    if (parseInt (body.Code) === 0)
    {
      const Maximum = await Database .from ('Company') .max ('Code as Code')

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
        RegisterExists = await CompanyModel.findBy ('Code', body.Code)

        if (RegisterExists)
        {
          if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.CODEDUPLICATED }) }
        }
      }

      /* Verifica duplicidade de Name */

      //---if (typeof (body.Name) !== "string")
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.NAMESTRING })
      //---}
      //---else if (body.Name.length < 1 || body.Name.length > 60)
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.NAMEMAX })
      //---}
      //---else
      //---{
      //---  RegisterExists = await CompanyModel.findBy ('Name', body.Name)

      //---  if (RegisterExists)
      //---  {
      //---    if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NAMEDUPLICATED }) }
      //---  }
      //---}

    /* Verifica duplicidade de Nick */

      //---if (typeof (body.Nick) !== "string")
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.NICKSTRING })
      //---}
      //---else if (body.Nick.length < 1 || body.Nick.length > 20)
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.NICKMAX })
      //---}
      //---else
      //---{
      //---   RegisterExists = await CompanyModel.findBy ('Nick', body.Nick)

      //---   if (RegisterExists)
      //---   {
      //---     if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.NICKDUPLICATED }) }
      //---   }
      //---}

      //* Verifica os indicadores */

      if (! body.Enterprise && ! body.Subsidiary && ! body.Airport && ! body.Customer && ! body.Airline && ! body.Transporter)   { ResponseBody.push ({ code: 400, msg: Message.CompanyNotDefined }) }

      //* Indicador Enterprise */

      if (typeof (body.Enterprise) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.EnterpriseBoolean })
      }

      //* Indicador Subsidiary */

      if (typeof (body.Subsidiary) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.SubsidiaryBoolean })
      }

      //* Indicador Airport */

      if (typeof (body.Airport) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.AirportBoolean })
      }
      else if (body.Airport)
      {
        if (typeof (body.Airline    ) === "boolean" && body.Airline    )   { ResponseBody.push ({ code: 400, msg: Message.NOTAIRLINE     }) }
        if (typeof (body.Transporter) === "boolean" && body.Transporter)   { ResponseBody.push ({ code: 400, msg: Message.NOTTRANSPORTER }) }

        if (body.IATA !== null)
        {
          if (body.IATA.length !== 3)   { ResponseBody.push ({ code: 400, msg: Message.IATALENGTH3 }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.IATAREQUIRED })
        }

        if (body.ICAO !== null)
        {
          if (body.ICAO.length !== 4)   { ResponseBody.push ({ code: 400, msg: Message.ICAOLENGTH4 }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.ICAOREQUIRED })
        }
      }

      //* Indicador Customer */

      if (typeof (body.Customer) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.CustomerBoolean })
      }

      //* Indicador Airline */

      if (typeof (body.Airline) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.AirlineBoolean })
      }
      else if (body.Airline)
      {
        if (body.IATA !== null)
        {
        //---  if (body.IATA.length !== 2)   { ResponseBody.push ({ code: 400, msg: Message.IATALENGTH2 }) }
        }
        else
        {
          if (typeof (body.Airport) === "boolean" && ! body.Airport)   { ResponseBody.push ({ code: 400, msg: Message.IATAREQUIRED }) }
        }

        if (body.ICAO !== null)
        {
        //---  if (body.ICAO.length !== 3)   { ResponseBody.push ({ code: 400, msg: Message.ICAOLENGTH3 }) }
        }
        else
        {
          if (typeof (body.Airport) === "boolean" && ! body.Airport)   { ResponseBody.push ({ code: 400, msg: Message.ICAOREQUIRED }) }
        }
      }

      //* Indicador Transporter */

      if (typeof (body.Transporter) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.TransporterBoolean })
      }
      else if (body.Transporter)
      {
        if (body.IATA !== null && body.IATA.length > 0 && typeof (body.Airline) === "boolean" && ! body.Airline)   { ResponseBody.push ({ code: 400, msg: Message.IATATRANSPORTER }) }
        if (body.ICAO !== null && body.ICAO.length > 0 && typeof (body.Airline) === "boolean" && ! body.Airline)   { ResponseBody.push ({ code: 400, msg: Message.ICAOTRANSPORTER }) }
      }

      /* Verifica duplicidade de IATA */

      //---if (body.IATA !== null && body.IATA.length > 0)
      //---{
      //---  RegisterExists = await CompanyModel.findBy ('IATA', body.IATA)

      //---  if (RegisterExists)
      //---  {
      //---    if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.IATADUPLICATED }) }
      //---  }
      //---}

      /* Verifica duplicidade de ICAO */

      //---if (body.ICAO !== null && body.ICAO.length > 0)
      //---{
      //---  RegisterExists = await CompanyModel.findBy ('ICAO', body.ICAO)

      //---  if (RegisterExists)
      //---  {
      //---    if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.ICAODUPLICATED }) }
      //---  }
      //---}

      /* Valida o Address */

      if (body.Address !== null)
      {
        if (typeof (body.Address) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.ADDRESSSTRING })
        }
        else if (body.Address.length < 1 || body.Address.length > 50)
        {
          ResponseBody.push ({ code: 400, msg: Message.ADDRESSMAX })
        }
      }

      /* Valida o Number */

      if (body.Number !== null)
      {
        if (typeof (body.Number) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.NUMBERINTEGER })
        }
        else if (parseInt (body.Number) < 0 || parseInt (body.Number) > 999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.NUMBERRANGE })
        }
      }

      /* Valida o Complement */

      if (body.Complement !== null)
      {
        if (typeof (body.Complement) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.COMPLEMENTSTRING })
        }
        else if (body.Complement.length < 1 || body.Complement.length > 30)
        {
          ResponseBody.push ({ code: 400, msg: Message.COMPLEMENTMAX })
        }
      }

      /* Valida o Neighborhood */

      if (body.Neighborhood !== null)
      {
        if (typeof (body.Neighborhood) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.NEIGHBORHOODSTRING })
        }
        else if (body.Neighborhood.length < 1 || body.Neighborhood.length > 40)
        {
          ResponseBody.push ({ code: 400, msg: Message.NEIGHBORHOODMAX })
        }
      }

      /* Valida o City */

      if (typeof (body.City) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.CITYSTRING })
      }
      else if (body.City.length < 1 || body.City.length > 40)
      {
        ResponseBody.push ({ code: 400, msg: Message.CITYMAX })
      }

      /* Valida o State */

      if (typeof (body.State) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.STATESTRING })
      }
      else if (body.State.length < 1 || body.State.length > 40)
      {
        ResponseBody.push ({ code: 400, msg: Message.STATEMAX })
      }

      /* Valida o Country */

      if (typeof (body.Country) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.COUNTRYSTRING })
      }
      else if (body.Country.length < 1 || body.Country.length > 40)
      {
        ResponseBody.push ({ code: 400, msg: Message.COUNTRYMAX })
      }

      /* Valida o Region */

      if (typeof (body.Region) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.REGIONSTRING })
      }
      else if (body.Region.length < 1 || body.Region.length > 40)
      {
        ResponseBody.push ({ code: 400, msg: Message.REGIONMAX })
      }

      /* Valida o Postal Code */

      if (body.PostalCode !== null)
      {
        if (typeof (body.PostalCode) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.POSTALCODESTRING })
        }
        else if (body.PostalCode.length < 1 || body.PostalCode.length > 10)
        {
          ResponseBody.push ({ code: 400, msg: Message.POSTALCODEMAX })
        }
      }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    CompanyModel.create
    (
      {
        //#region INSERT

          Code: body.Code,
          Name: body.Name,
          Nick: body.Nick,

          Enterprise : body.Enterprise,
          Subsidiary : body.Subsidiary,
          Airport    : body.Airport,
          Customer   : body.Customer,
          Airline    : body.Airline,
          Transporter: body.Transporter,

          IATA: body.IATA,
          ICAO: body.ICAO,

          //---if (body.Address.length      > 0)   { Address      : body.Address      }
          //---if (body.Number              > 0)   { Number       : body.Number       }
          //---if (body.Complement.length   > 0)   { Complement   : body.Complement   }
          //---if (body.Neighborhood.length > 0)   { Neighborhood : body.Neighborhood }
          //---if (body.PostalCode.length   > 0)   { PostalCode   : body.PostalCode   }

          Address     : body.Address,
          Number      : body.Number,
          Complement  : body.Complement,
          Neighborhood: body.Neighborhood,
          City        : body.City,
          State       : body.State,
          Country     : body.Country,
          Region      : body.Region,
          PostalCode  : body.PostalCode,

          //---AddressId: body.AddressId,

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

          Enterprise : body.Enterprise,
          Subsidiary : body.Subsidiary,
          Airport    : body.Airport,
          Customer   : body.Customer,
          Airline    : body.Airline,
          Transporter: body.Transporter,

          IATA: body.IATA,
          ICAO: body.ICAO,

          //---if (body.Address.length      > 0)   { Address      : body.Address      }
          //---if (body.Number              > 0)   { Number       : body.Number       }
          //---if (body.Complement.length   > 0)   { Complement   : body.Complement   }
          //---if (body.Neighborhood.length > 0)   { Neighborhood : body.Neighborhood }
          //---if (body.PostalCode.length   > 0)   { PostalCode   : body.PostalCode   }

          Address     : body.Address,
          Number      : body.Number,
          Complement  : body.Complement,
          Neighborhood: body.Neighborhood,
          City        : body.City,
          State       : body.State,
          Country     : body.Country,
          Region      : body.Region,
          PostalCode  : body.PostalCode,

          //---AddressId: body.AddressId

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a Company status with id.
   * PATCH company/:id
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

      let RecordStatus = await CompanyModel.find (params.id)

      if (! RecordStatus)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Verifica status validos */

      switch (body.Status)
      {
        //#region STATUS

        case Status.ACTIVE:
        case Status.BLOCKED:
        case Status.CANCELED:
        case Status.ENDED:
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
   * Delete a Company with id.
   * DELETE company/:id
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

      let RecordDelete = await CompanyModel.find (params.id)

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
   * Loads a group of Company records.
   * POST company/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new CompanyModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RegisterExists = await CompanyModel.findBy ('Code', RecordsArray [Actual] .Code)

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





  /**
   * Loads a group of Company / Airport records.
   * POST company/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async loadairport ({ params, request, response })
  {

    let RegisterExists = new CompanyModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RecordsArray [Actual] .airportId  = RecordsArray [Actual] .airportId + 10000;

        //***if (RecordsArray [Actual] .nameAirport === "Municipal"    )   { RecordsArray [Actual] .nameAirport = RecordsArray [Actual] .nameAirport + " / " + RecordsArray [Actual] .codeIataAirport}
        //***if (RecordsArray [Actual] .nameAirport === "International")   { RecordsArray [Actual] .nameAirport = RecordsArray [Actual] .nameAirport + " / " + RecordsArray [Actual] .codeIataAirport}

        if (RecordsArray [Actual] .codeIcaoAirport         === null)   { RecordsArray [Actual] .codeIcaoAirport = (RecordsArray [Actual] .codeIataAirport + "1234") .substring (0, 4) }
        if (RecordsArray [Actual] .codeIcaoAirport .length === 0   )   { RecordsArray [Actual] .codeIcaoAirport = (RecordsArray [Actual] .codeIataAirport + "1234") .substring (0, 4) }

        let LoadRecord = 
        {
          "Code": RecordsArray [Actual] .airportId,
          "Name": RecordsArray [Actual] .nameAirport .substring (0, 60),
          "Nick": RecordsArray [Actual] .codeIataAirport,

          "Enterprise" : false,
          "Subsidiary" : false,
          "Airport"    : true,
          "Customer"   : false,
          "Airline"    : false,
          "Transporter": false,

          "IATA": RecordsArray [Actual] .codeIataAirport,
          "ICAO": RecordsArray [Actual] .codeIcaoAirport,

          "Address"     : ".",
          "Number"      : 0,
          "Complement"  : ".",
          "Neighborhood": ".",
          "City"        : RecordsArray [Actual] .codeIataCity,
          "State"       : ".",
          "Country"     : RecordsArray [Actual] .nameCountry,
          "Region"      : RecordsArray [Actual] .timezone,
          "PostalCode"  : "." 
        }


        RegisterExists = await CompanyModel.findBy ('Code', RecordsArray [Actual] .airportId)

        if (! RegisterExists)
        {
          const RecordValidation = await this.ValidateAll ({ "body": LoadRecord })

          if (RecordValidation.length > 0)
          {
            console.log (RecordsArray [Actual]);
            console.log (RecordValidation     );
            continue;
          }

          await this.StoreDatabase ( LoadRecord )
        }
        else
        {
          params.id = RegisterExists.Id

          const RecordValidation = await this.ValidateAll ({ "body": LoadRecord }, params)

          if (RecordValidation.length > 0)
          {
            console.log (RecordsArray [Actual]);
            console.log (RecordValidation     );
            continue;
          }

          await this.UpdateDatabase ( LoadRecord, RegisterExists )
        }
      }


      return response.ok ({ code: 200, msg: Message.RECORDSLOADED })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Loads a group of Company / Airline records.
   * POST company/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async loadairline ({ params, request, response })
  {

    let RegisterExists = new CompanyModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        RecordsArray [Actual] .airlineId = RecordsArray [Actual] .airlineId + 20000;

        if (RecordsArray [Actual] .codeIcaoAirline         === null)   { RecordsArray [Actual] .codeIcaoAirline = (RecordsArray [Actual] .codeIataAirline + "1234") .substring (0, 3) }
        if (RecordsArray [Actual] .codeIcaoAirline .length === 0   )   { RecordsArray [Actual] .codeIcaoAirline = (RecordsArray [Actual] .codeIataAirline + "1234") .substring (0, 3) }

        let LoadRecord = 
        {
          "Code": RecordsArray [Actual] .airlineId,
          "Name": RecordsArray [Actual] .nameAirline .substring (0, 60),
          "Nick": RecordsArray [Actual] .callsign    .substring (0, 20),

          "Enterprise" : false,
          "Subsidiary" : false,
          "Airport"    : false,
          "Customer"   : false,
          "Airline"    : true,
          "Transporter": false,

          "IATA": RecordsArray [Actual] .codeIataAirline,
          "ICAO": RecordsArray [Actual] .codeIcaoAirline,

          "Address"     : ".",
          "Number"      : 0,
          "Complement"  : ".",
          "Neighborhood": ".",
          "City"        : ".",
          "State"       : ".",
          "Country"     : RecordsArray [Actual] .nameCountry,
          "Region"      : ".",
          "PostalCode"  : "." 
        }


        RegisterExists = await CompanyModel.findBy ('Code', RecordsArray [Actual] .airlineId)

        if (! RegisterExists)
        {
          const RecordValidation = await this.ValidateAll ({ "body": LoadRecord })

          if (RecordValidation.length > 0)
          {
            console.log (RecordsArray [Actual]);
            console.log (RecordValidation     );
            continue;
          }

          await this.StoreDatabase ( LoadRecord )
        }
        else
        {
          params.id = RegisterExists.Id

          const RecordValidation = await this.ValidateAll ({ "body": LoadRecord }, params)

          if (RecordValidation.length > 0)
          {
            console.log (RecordsArray [Actual]);
            console.log (RecordValidation     );
            continue;
          }

          await this.UpdateDatabase ( LoadRecord, RegisterExists )
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





module.exports = CompanyController

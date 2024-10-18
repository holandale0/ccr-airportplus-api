'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



var Moment = use ('moment');

const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const FlightModel               = use ('App/Models/Flight'              )
const CompanyModel              = use ('App/Models/Company'             )
const EnterpriseSubsidiaryModel = use ('App/Models/EnterpriseSubsidiary')
const SubsidiaryAirlineModel    = use ('App/Models/SubsidiaryAirline'   )
//---const TerminalModel          = use ('App/Models/Terminal'            )
const ResourceModel             = use ('App/Models/Resource'            )
const AircraftModel             = use ('App/Models/Aircraft'            )
const OriginDestinationModel    = use ('App/Models/OriginDestination'   )
const MainServiceModel          = use ('App/Models/MainService'         )

//#endregion


//#region TYPES

const TypeName =
[
  "Invalid",
  "Arrival",
  "Departure"
]

//#endregion





/**
 * Resourceful controller for interacting with Flights
 */

class FlightController
{





  /**
   * Show a list of all Flights.
   * GET flight
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
      if (typeof (Query.TerminalId  ) === "undefined")   { Query.TerminalId   = 0 }
      if (typeof (Query.AirlineId   ) === "undefined")   { Query.AirlineId    = 0 }
      if (typeof (Query.Distinct    ) === "undefined")   { Query.Distinct     = 0 }

      //---if (parseInt (Query.EnterpriseId) === 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.TerminalId) === 0)   { return FlightModel.all() }


      //#region Uma data DateTime, fornecida com as outras duas datas, sobrepõe-se às demais

        if (typeof (Query.Type) === "undefined")   { Query.Type = 0 }

        //---if (typeof (Query.DateTime    ) === "undefined")   { Query.DateTime     = new Date() .toISOString() .replace ('T', ' ') .substring (0, 19) }
        if (typeof (Query.InitialDate ) === "undefined")   { Query.InitialDate  = new Date() .toISOString() .substring (0, 10) + " 00:00:00" }
        if (typeof (Query.FinalDate   ) === "undefined")   { Query.FinalDate    = new Date() .toISOString() .substring (0, 10) + " 23:59:59" }

        if (typeof (Query.DateTime) !== "undefined") // (Query.DateTime.length > 0)
        {
          var InitialDate = new Date (Query.DateTime)
          var FinalDate   = new Date (Query.DateTime)

          if (parseInt (Query.Type) === 0 || parseInt (Query.Type) === 1)
          {
            FinalDate   .setDate (FinalDate   .getDate() + 1)
          }

          if (parseInt (Query.Type) === 0 || parseInt (Query.Type) === 2)
          {
            InitialDate .setDate (InitialDate .getDate() - 1)
          }

          Query.InitialDate = InitialDate .toISOString() .substr (0, 10) + Query.DateTime .substring (10)
          Query.FinalDate   = FinalDate   .toISOString() .substr (0, 10) + Query.DateTime .substring (10)
        }

      //#endregion


      let ResultList = {}

      const DBQuery = this.SelectFields()


      /* Filtro por Enterprise */

      if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) === 0 && parseInt (Query.TerminalId) === 0 && parseInt (Query.AirlineId) === 0)
      {
        //return await Database .table ('Flight') .select ('*') .where ('EnterpriseId', parseInt (Query.EnterpriseId))
        //return await Database

        ResultList = await DBQuery
          .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
          .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
          .orderBy ('Enterprise.Nick')
          .orderBy ('Subsidiary.IATA')
          .orderBy ('Flight.Date'    )
          .orderBy ('Terminal.Name'  )
          .orderBy ('Airline.IATA'   )
      }

      /* Filtro por Subsidiary */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.TerminalId) === 0 && parseInt (Query.AirlineId) === 0 && parseInt (Query.Distinct) === 0)
      {
        //return await Database .table ('Flight') .select ('*') .where ('SubsidiaryId', parseInt (Query.SubsidiaryId))
        //return await Database

        if (parseInt (Query.Type) === 0)
        {
          ResultList = await DBQuery
            .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
            .where ('Flight.SubsidiaryId', parseInt (Query.SubsidiaryId))
            .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
            .orderBy ('Flight.Date'         )
            .orderBy ('Terminal.Name'       )
            .orderBy ('Flight.ScheduledTime')
            .orderBy ('Airline.IATA'        )
        }
        else
        {
          ResultList = await DBQuery
            .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
            .where ('Flight.SubsidiaryId', parseInt (Query.SubsidiaryId))
            .where ('Flight.Type'        , parseInt (Query.Type        ))
            .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
            .orderBy ('Flight.Date'         )
            .orderBy ('Terminal.Name'       )
            .orderBy ('Flight.ScheduledTime')
            .orderBy ('Airline.IATA'        )
        }
      }

      /* Filtro por Subsidiary Distinct => Airline */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.TerminalId) === 0 && parseInt (Query.AirlineId) === 0 && parseInt (Query.Distinct) !== 0)
      {
        if (parseInt (Query.Type) === 0)
        {
        ResultList = await this.SelectDistinctAirline()
          .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('Flight.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
          .orderBy ('Airline.IATA')
        }
        else
        {
          ResultList = await this.SelectDistinctAirline()
          .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('Flight.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .where ('Flight.Type'        , parseInt (Query.Type        ))
          .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
          .orderBy ('Airline.IATA')
        }
      }

      /* Filtro por Terminal */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.TerminalId) !== 0 && parseInt (Query.AirlineId) === 0)
      {
        //return await Database .table ('Flight') .select ('*') .where ('TerminalId', parseInt (Query.TerminalId))
        //return await Database

        ResultList = await DBQuery
          .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
          .where ('Flight.SubsidiaryId', parseInt (Query.SubsidiaryId))
          .where ('Flight.TerminalId'  , parseInt (Query.TerminalId  ))
          .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
          .orderBy ('Flight.Date' )
          .orderBy ('Airline.IATA')
      }

      /* Filtro por Airline */

      else if (parseInt (Query.EnterpriseId) !== 0 && parseInt (Query.SubsidiaryId) !== 0 && parseInt (Query.TerminalId) === 0 && parseInt (Query.AirlineId) !== 0)
      {
        if (parseInt (Query.Type) === 0)
        {
          ResultList = await DBQuery
            .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
            .where ('Flight.SubsidiaryId', parseInt (Query.SubsidiaryId))
            .where ('Flight.AirlineId'   , parseInt (Query.AirlineId   ))
            .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
            .orderBy ('Flight.Date'  )
            .orderBy ('Terminal.Name')
        }
        else
        {
          ResultList = await DBQuery
            .where ('Flight.EnterpriseId', parseInt (Query.EnterpriseId))
            .where ('Flight.SubsidiaryId', parseInt (Query.SubsidiaryId))
            .where ('Flight.AirlineId'   , parseInt (Query.AirlineId   ))
            .where ('Flight.Type'        , parseInt (Query.Type        ))
            .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
            .orderBy ('Flight.Date'  )
            .orderBy ('Terminal.Name')
        }
      }

      /* Filtro por datas somente */

      else
      {
        ResultList = await DBQuery
          .whereBetween ('Flight.ScheduledTime', [ Query.InitialDate, Query.FinalDate ])
          .orderBy ('Enterprise.Nick')
          .orderBy ('Subsidiary.IATA'   )
          .orderBy ('Flight.Date'    )
          .orderBy ('Terminal.Name'  )
          .orderBy ('Airline.IATA'   )
      }


      return await this.MontarObjetos (ResultList)
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single Flight.
   * GET flight/:id
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
      //return FlightModel.find (params.id)

      let ResultList = {}

      const DBQuery = this.SelectFields()

      ResultList = await DBQuery
        .where ('Flight.Id', parseInt (params.id))

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
    .table ('Flight')
    .select
    (
      "Flight.*",

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

      "Terminal.Code   as TerminalCode",
      "Terminal.Name   as TerminalName",
      "Terminal.Nick   as TerminalNick",
      "Terminal.Status as TerminalStatus",

      "Gate.Code   as GateCode",
      "Gate.Name   as GateName",
      "Gate.Nick   as GateNick",
      "Gate.Status as GateStatus",

      "Stand.Code   as StandCode",
      "Stand.Name   as StandName",
      "Stand.Nick   as StandNick",
      "Stand.Status as StandStatus",

      "CheckinCounter.Code   as CheckinCounterCode",
      "CheckinCounter.Name   as CheckinCounterName",
      "CheckinCounter.Nick   as CheckinCounterNick",
      "CheckinCounter.Status as CheckinCounterStatus",

      "Belt.Code   as BeltCode",
      "Belt.Name   as BeltName",
      "Belt.Nick   as BeltNick",
      "Belt.Status as BeltStatus",

      "Airline.Code   as AirlineCode",
      "Airline.Name   as AirlineName",
      "Airline.Nick   as AirlineNick",
      "Airline.IATA   as AirlineIATA",
      "Airline.ICAO   as AirlineICAO",
      "Airline.Status as AirlineStatus",

      "Aircraft.Code   as AircraftCode",
      "Aircraft.Name   as AircraftName",
      "Aircraft.IATA   as AircraftIATA",
      "Aircraft.ICAO   as AircraftICAO",
      "Aircraft.Status as AircraftStatus",

      "Origin.Code    as OriginCode",
      "Origin.Name    as OriginName",
      "Origin.Nick    as OriginNick",
      "Origin.IATA    as OriginIATA",
      "Origin.ICAO    as OriginICAO",
      "Origin.City    as OriginCity",
      "Origin.State   as OriginState",
      "Origin.Country as OriginCountry",
      "Origin.Region  as OriginRegion",
      "Origin.Status  as OriginStatus",

      "Destination.Code    as DestinationCode",
      "Destination.Name    as DestinationName",
      "Destination.Nick    as DestinationNick",
      "Destination.IATA    as DestinationIATA",
      "Destination.ICAO    as DestinationICAO",
      "Destination.City    as DestinationCity",
      "Destination.State   as DestinationState",
      "Destination.Country as DestinationCountry",
      "Destination.Region  as DestinationRegion",
      "Destination.Status  as DestinationStatus",

      "MainService.Code   as MainServiceCode",
      "MainService.Name   as MainServiceName",
      "MainService.Status as MainServiceStatus"
    )
    .innerJoin ("Company as Enterprise"     , "Enterprise.Id"    , "Flight.EnterpriseId"    )
    .innerJoin ("Company as Subsidiary"     , "Subsidiary.Id"    , "Flight.SubsidiaryId"    )
    //.innerJoin ("Terminal"                  , "Terminal.Id"      , "Flight.TerminalId"      )
    .leftJoin  ("Resource as Terminal"      , "Terminal.Id"      , "Flight.TerminalId"      )
    .leftJoin  ("Resource as Gate"          , "Gate.Id"          , "Flight.GateId"          )
    .leftJoin  ("Resource as Stand"         , "Stand.Id"         , "Flight.StandId"         )
    .leftJoin  ("Resource as CheckinCounter", "CheckinCounter.Id", "Flight.CheckinCounterId")
    .leftJoin  ("Resource as Belt"          , "Belt.Id"          , "Flight.BeltId"          )
    .innerJoin ("Company as Airline"        , "Airline.Id"       , "Flight.AirlineId"       )
    .leftJoin  ("Aircraft"                  , "Aircraft.Id"      , "Flight.AircraftId"      )
    .innerJoin ("Company as Origin"         , "Origin.Id"        , "Flight.OriginId"        )
    .innerJoin ("Company as Destination"    , "Destination.Id"   , "Flight.DestinationId"   )
    .leftJoin  ("MainService"               , "MainService.Id"   , "Flight.MainServiceId"   )

  }





  /* Monta os parâmetros para acesso ao banco */

  SelectDistinctAirline()
  {

    return Database 
      .table ('Flight')
      .select
      (
        "Flight.AirlineId",

        "Airline.Code   as AirlineCode",
        "Airline.Name   as AirlineName",
        "Airline.Nick   as AirlineNick",
        "Airline.IATA   as AirlineIATA",
        "Airline.ICAO   as AirlineICAO",
        "Airline.Status as AirlineStatus"
        )
      .distinct ("Airline.IATA")
      .innerJoin ("Company as Enterprise"     , "Enterprise.Id"    , "Flight.EnterpriseId"    )
      .innerJoin ("Company as Subsidiary"     , "Subsidiary.Id"    , "Flight.SubsidiaryId"    )
      //.innerJoin ("Terminal"                  , "Terminal.Id"      , "Flight.TerminalId"      )
      .leftJoin  ("Resource as Terminal"      , "Terminal.Id"      , "Flight.TerminalId"      )
      .leftJoin  ("Resource as Gate"          , "Gate.Id"          , "Flight.GateId"          )
      .leftJoin  ("Resource as Stand"         , "Stand.Id"         , "Flight.StandId"         )
      .leftJoin  ("Resource as CheckinCounter", "CheckinCounter.Id", "Flight.CheckinCounterId")
      .leftJoin  ("Resource as Belt"          , "Belt.Id"          , "Flight.BeltId"          )
      .innerJoin ("Company as Airline"        , "Airline.Id"       , "Flight.AirlineId"       )
      .leftJoin  ("Aircraft"                  , "Aircraft.Id"      , "Flight.AircraftId"      )
      .innerJoin ("Company as Origin"         , "Origin.Id"        , "Flight.OriginId"        )
      .innerJoin ("Company as Destination"    , "Destination.Id"   , "Flight.DestinationId"   )
      .leftJoin  ("MainService"               , "MainService.Id"   , "Flight.MainServiceId"   )
  
  }





  //* Monta os objetos e limpa os campos individuais */

  async MontarObjetos (ResultList)
  {

      for (let Actual = 0; Actual < ResultList.length; Actual++)
      {
        ResultList [Actual] .TypeName   = TypeName          [ResultList [Actual] .Type  ]
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


        ResultList [Actual] .Terminal =
        {
          "Code"      : ResultList [Actual] .TerminalCode,
          "Name"      : ResultList [Actual] .TerminalName,
          "Nick"      : ResultList [Actual] .TerminalNick,
          "Status"    : ResultList [Actual] .TerminalStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .TerminalStatus]
        }

        delete ResultList [Actual] .TerminalCode
        delete ResultList [Actual] .TerminalName
        delete ResultList [Actual] .TerminalNick
        delete ResultList [Actual] .TerminalStatus


        ResultList [Actual] .Gate =
        {
          "Code"      : ResultList [Actual] .GateCode,
          "Name"      : ResultList [Actual] .GateName,
          "Nick"      : ResultList [Actual] .GateNick,
          "Status"    : ResultList [Actual] .GateStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .GateStatus]
        }

        delete ResultList [Actual] .GateCode
        delete ResultList [Actual] .GateName
        delete ResultList [Actual] .GateNick
        delete ResultList [Actual] .GateStatus


        ResultList [Actual] .Stand =
        {
          "Code"      : ResultList [Actual] .StandCode,
          "Name"      : ResultList [Actual] .StandName,
          "Nick"      : ResultList [Actual] .StandNick,
          "Status"    : ResultList [Actual] .StandStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .StandStatus]
        }

        delete ResultList [Actual] .StandCode
        delete ResultList [Actual] .StandName
        delete ResultList [Actual] .StandNick
        delete ResultList [Actual] .StandStatus


        ResultList [Actual] .CheckinCounter =
        {
          "Code"      : ResultList [Actual] .CheckinCounterCode,
          "Name"      : ResultList [Actual] .CheckinCounterName,
          "Nick"      : ResultList [Actual] .CheckinCounterNick,
          "Status"    : ResultList [Actual] .CheckinCounterStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .CheckinCounterStatus]
        }

        delete ResultList [Actual] .CheckinCounterCode
        delete ResultList [Actual] .CheckinCounterName
        delete ResultList [Actual] .CheckinCounterNick
        delete ResultList [Actual] .CheckinCounterStatus


        ResultList [Actual] .Belt =
        {
          "Code"      : ResultList [Actual] .BeltCode,
          "Name"      : ResultList [Actual] .BeltName,
          "Nick"      : ResultList [Actual] .BeltNick,
          "Status"    : ResultList [Actual] .BeltStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .BeltStatus]
        }

        delete ResultList [Actual] .BeltCode
        delete ResultList [Actual] .BeltName
        delete ResultList [Actual] .BeltNick
        delete ResultList [Actual] .BeltStatus


        ResultList [Actual] .Airline =
        {
          "Code"      : ResultList [Actual] .AirlineCode,
          "Name"      : ResultList [Actual] .AirlineName,
          "Nick"      : ResultList [Actual] .AirlineNick,
          "IATA"      : ResultList [Actual] .AirlineIATA,
          "ICAO"      : ResultList [Actual] .AirlineICAO,
          "Status"    : ResultList [Actual] .AirlineStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .AirlineStatus]
        }

        delete ResultList [Actual] .AirlineCode
        delete ResultList [Actual] .AirlineName
        delete ResultList [Actual] .AirlineNick
        delete ResultList [Actual] .AirlineIATA
        delete ResultList [Actual] .AirlineICAO
        delete ResultList [Actual] .AirlineStatus


        ResultList [Actual] .Aircraft =
        {
          "Code"      : ResultList [Actual] .AircraftCode,
          "Name"      : ResultList [Actual] .AircraftName,
          "IATA"      : ResultList [Actual] .AircraftIATA,
          "ICAO"      : ResultList [Actual] .AircraftICAO,
          "Status"    : ResultList [Actual] .AircraftStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .AircraftStatus]
        }

        delete ResultList [Actual] .AircraftCode
        delete ResultList [Actual] .AircraftName
        delete ResultList [Actual] .AircraftIATA
        delete ResultList [Actual] .AircraftICAO
        delete ResultList [Actual] .AircraftStatus


        ResultList [Actual] .Origin =
        {
          "Code"      : ResultList [Actual] .OriginCode,
          "Name"      : ResultList [Actual] .OriginName,
          "Nick"      : ResultList [Actual] .OriginNick,
          "IATA"      : ResultList [Actual] .OriginIATA,
          "ICAO"      : ResultList [Actual] .OriginICAO,
          "City"      : ResultList [Actual] .OriginCity,
          "State"     : ResultList [Actual] .OriginState,
          "Country"   : ResultList [Actual] .OriginCountry,
          "Region"    : ResultList [Actual] .OriginRegion,
          "Status"    : ResultList [Actual] .OriginStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .OriginStatus]
        }

        delete ResultList [Actual] .OriginCode
        delete ResultList [Actual] .OriginName
        delete ResultList [Actual] .OriginNick
        delete ResultList [Actual] .OriginIATA
        delete ResultList [Actual] .OriginICAO
        delete ResultList [Actual] .OriginCity
        delete ResultList [Actual] .OriginState
        delete ResultList [Actual] .OriginCountry
        delete ResultList [Actual] .OriginRegion
        delete ResultList [Actual] .OriginStatus


        ResultList [Actual] .Destination =
        {
          "Code"      : ResultList [Actual] .DestinationCode,
          "Name"      : ResultList [Actual] .DestinationName,
          "Nick"      : ResultList [Actual] .DestinationNick,
          "IATA"      : ResultList [Actual] .DestinationIATA,
          "ICAO"      : ResultList [Actual] .DestinationICAO,
          "City"      : ResultList [Actual] .DestinationCity,
          "State"     : ResultList [Actual] .DestinationState,
          "Country"   : ResultList [Actual] .DestinationCountry,
          "Region"    : ResultList [Actual] .DestinationRegion,
          "Status"    : ResultList [Actual] .DestinationStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .DestinationStatus]
        }

        delete ResultList [Actual] .DestinationCode
        delete ResultList [Actual] .DestinationName
        delete ResultList [Actual] .DestinationNick
        delete ResultList [Actual] .DestinationIATA
        delete ResultList [Actual] .DestinationICAO
        delete ResultList [Actual] .DestinationCity
        delete ResultList [Actual] .DestinationState
        delete ResultList [Actual] .DestinationCountry
        delete ResultList [Actual] .DestinationRegion
        delete ResultList [Actual] .DestinationStatus


        ResultList [Actual] .MainService =
        {
          "Code"      : ResultList [Actual] .MainServiceCode,
          "Name"      : ResultList [Actual] .MainServiceName,
          "Status"    : ResultList [Actual] .MainServiceStatus,
          "StatusName": Status.StatusName [ResultList [Actual] .MainServiceStatus]
        }

        delete ResultList [Actual] .MainServiceCode
        delete ResultList [Actual] .MainServiceName
        delete ResultList [Actual] .MainServiceStatus
      }

      return ResultList

  }





  /**
   * Create/save a new Flight.
   * POST flight
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
   * Update Flight details.
   * PUT flight/:id
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

      let RecordUpdate = await FlightModel.find (params.id)

      if (! RecordUpdate)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Verifica o status */

      //---if (RecordUpdate.Status !== Status.ONTIME && RecordUpdate.Status !== Status.DELAYED)   { return response.badRequest ({ code: 400, msg: Message.UPDATEDENIED }) }


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

    let RegisterExists = new FlightModel()
    let ResponseBody   = []


    //#region VALIDATION


      /* Valida o Enterprise */

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

      /* Valida o Type */

      if (typeof (body.Type) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.TYPEINTEGER })
      }
      else if (parseInt (body.Type) < 1 || parseInt (body.Type) > 2)
      {
        ResponseBody.push ({ code: 400, msg: Message.TYPERANGE001002 })
      }

      /* Valida o Date */

      if (typeof (body.Date) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.DATESTRING })
      }
      else if (! Moment (body.Date, "YYYY-MM-DD") .isValid())
      {
        ResponseBody.push ({ code: 400, msg: Message.DATEINVALID })
      }

      /* Valida o Link Id */

      if (body.LinkId !== null)
      {
        if (typeof (body.LinkId) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.LINKIDINTEGER })
        }
        else if (parseInt (body.LinkId) < 1 || parseInt (body.LinkId) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.LINKIDRANGE })
        }
        else
        {
          RegisterExists = await FlightModel.find (parseInt (body.LinkId))

          if (RegisterExists)
          {
            //if (RegisterExists.Status !== Status.ACTIVE                 )   { ResponseBody.push ({ code: 400, msg: Message.LINKIDSTATUS  }) }
            if ((params) && (RegisterExists.Id === parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.LINKIDANOTHER   }) }
            if (RegisterExists.Type === parseInt (body.Type)            )   { ResponseBody.push ({ code: 400, msg: Message.LINKTYPEANOTHER }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.LINKIDNOTFOUND })
          }
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

      /* Valida o Terminal */

      if (typeof (body.TerminalId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.TERMINALINTEGER })
      }
      else if (parseInt (body.TerminalId) < 1 || parseInt (body.TerminalId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.TERMINALRANGE })
      }
      else
      {
        //---RegisterExists = await TerminalModel.find (parseInt (body.TerminalId))
        RegisterExists = await ResourceModel.find (parseInt (body.TerminalId))

        if (RegisterExists)
        {
          if (RegisterExists.SubsidiaryId !== parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.TerminalSubsidiary }) }
          if (RegisterExists.Type         !== 1                           )   { ResponseBody.push ({ code: 400, msg: Message.TERMINALINVALID    }) }
          if (RegisterExists.Status       !== Status.ACTIVE               )   { ResponseBody.push ({ code: 400, msg: Message.TERMINALSTATUS     }) }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.TERMINALNOTFOUND })
        }
      }

      /* Valida o Gate */

      if (body.GateId !== null)
      {
        if (typeof (body.GateId) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.GATEINTEGER })
        }
        else if (parseInt (body.GateId) < 1 || parseInt (body.GateId) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.GATERANGE })
        }
        else
        {
          RegisterExists = await ResourceModel.find (parseInt (body.GateId))

          if (RegisterExists)
          {
            //---if (! RegisterExists.Gate                  )   { ResponseBody.push ({ code: 400, msg: Message.GATEINVALID }) }
            if (RegisterExists.SubsidiaryId !== parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.GateSubsidiary }) }
            if (RegisterExists.Type         !== 2                           )   { ResponseBody.push ({ code: 400, msg: Message.GATEINVALID    }) }
            if (RegisterExists.Status       !== Status.ACTIVE               )   { ResponseBody.push ({ code: 400, msg: Message.GATESTATUS     }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.GATENOTFOUND })
          }
        }
      }

      /* Valida o Stand */

      if (body.StandId !== null)
      {
        if (typeof (body.StandId) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.STANDINTEGER })
        }
        else if (parseInt (body.StandId) < 1 || parseInt (body.StandId) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.STANDRANGE })
        }
        else
        {
          RegisterExists = await ResourceModel.find (parseInt (body.StandId))

          if (RegisterExists)
          {
            //---if (! RegisterExists.Stand                 )   { ResponseBody.push ({ code: 400, msg: Message.STANDINVALID }) }
            if (RegisterExists.SubsidiaryId !== parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.StandSubsidiary }) }
            if (RegisterExists.Type         !== 3                           )   { ResponseBody.push ({ code: 400, msg: Message.STANDINVALID    }) }
            if (RegisterExists.Status       !== Status.ACTIVE               )   { ResponseBody.push ({ code: 400, msg: Message.STANDSTATUS     }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.STANDNOTFOUND })
          }
        }
      }

      /* Valida o CheckinNumber */

      if (body.CheckinCounterId !== null)
      {
        if (typeof (body.CheckinCounterId) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.CHECKINCOUNTERINTEGER })
        }
        else if (parseInt (body.CheckinCounterId) < 1 || parseInt (body.CheckinCounterId) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.CHECKINCOUNTERRANGE })
        }
        else
        {
          RegisterExists = await ResourceModel.find (parseInt (body.CheckinCounterId))

          if (RegisterExists)
          {
            //---if (! RegisterExists.CheckinCounter        )   { ResponseBody.push ({ code: 400, msg: Message.CHECKINCOUNTERINVALID }) }
            if (RegisterExists.SubsidiaryId !== parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.CheckinCounterSubsidiary }) }
            if (RegisterExists.Type         !== 4                           )   { ResponseBody.push ({ code: 400, msg: Message.CHECKINCOUNTERINVALID    }) }
            if (RegisterExists.Status       !== Status.ACTIVE               )   { ResponseBody.push ({ code: 400, msg: Message.CHECKINCOUNTERSTATUS     }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.CHECKINCOUNTERNOTFOUND })
          }
        }
      }

      /* Valida o Belt */

      if (body.BeltId !== null)
      {
        if (typeof (body.BeltId) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.BELTINTEGER })
        }
        else if (parseInt (body.BeltId) < 1 || parseInt (body.BeltId) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.BELTRANGE })
        }
        else
        {
          RegisterExists = await ResourceModel.find (parseInt (body.BeltId))

          if (RegisterExists)
          {
            //---if (! RegisterExists.Belt                  )   { ResponseBody.push ({ code: 400, msg: Message.BELTINVALID }) }
            if (RegisterExists.SubsidiaryId !== parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.BeltSubsidiary }) }
            if (RegisterExists.Type         !== 5                           )   { ResponseBody.push ({ code: 400, msg: Message.BELTINVALID    }) }
            if (RegisterExists.Status       !== Status.ACTIVE               )   { ResponseBody.push ({ code: 400, msg: Message.BELTSTATUS     }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.BELTNOTFOUND })
          }
        }
      }

      /* Valida a Airline */

      if (typeof (body.AirlineId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.AirlineInteger })
      }
      else if (parseInt (body.AirlineId) < 1 || parseInt (body.AirlineId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.AirlineRange })
      }
      else
      {
        RegisterExists = await CompanyModel.find (parseInt (body.AirlineId))

        if (RegisterExists)
        {
          if (! RegisterExists.Airline               )   { ResponseBody.push ({ code: 400, msg: Message.AirlineInvalid }) }
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.AirlineStatus  }) }

          /* Verifica se a Subsidiary x Airline existe */

          let SubsidiaryAirlineExists = await SubsidiaryAirlineModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId), 'AirlineId': parseInt (body.AirlineId) })

          if (SubsidiaryAirlineExists)
          {
            if (SubsidiaryAirlineExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.SubsidiaryAirlineStatus }) }
          }  
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.SubsidiaryAirlineNotAuthorized })
          }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.AirlineNotFound })
        }
      }

      /* Valida a Aircraft */

      if (body.AircraftId !== null)
      {
        if (typeof (body.AircraftId) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTINTEGER })
        }
        else if (parseInt (body.AircraftId) < 1 || parseInt (body.AircraftId) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTRANGE })
        }
        else
        {
          RegisterExists = await AircraftModel.find (parseInt (body.AircraftId))

          if (RegisterExists)
          {
            if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTSTATUS }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTNOTFOUND })
          }
        }
      }

      /* Verifica o Code */

      if (typeof (body.Code) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.CODEINTEGER })
      }
      else if (parseInt (body.Code) < 1 || parseInt (body.Code) > 9999)
      {
        ResponseBody.push ({ code: 400, msg: Message.CODERANGE9999 })
      }

      /* Valida o Aircraft Registration */

      if (body.AircraftRegistration !== null)
      {
        if (typeof (body.AircraftRegistration) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTREGISTRATIONSTRING })
        }
        else if (body.AircraftRegistration.length < 1 || body.AircraftRegistration.length > 20)
        {
          ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTREGISTRATIONMAX })
        }
      }
      // else
      // {
      //   ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTREGISTRATIONREQUIRED })
      // }

      /* Valida o Aircraft Serial Number */

      if (body.AircraftSerialNumber !== null)
      {
        if (typeof (body.AircraftSerialNumber) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTSERIALNUMBERSTRING })
        }
        else if (body.AircraftSerialNumber.length < 1 || body.AircraftSerialNumber.length > 20)
        {
          ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTSERIALNUMBERMAX })
        }
      }
      // else
      // {
      //   ResponseBody.push ({ code: 400, msg: Message.AIRCRAFTSERIALNUMBERREQUIRED })
      // }


      /* Verifica duplicidade de Enterprise / Subsidiary / Airline / Code / Date / Scheduled Time */

      //---RegisterExists = await FlightModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId, 'AirlineId': body.AirlineId, 'Code': body.Code, 'Date': body.Date, 'ScheduledTime': body.ScheduledTime })
      //---RegisterExists = await FlightModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId, 'Type': body.Type, 'AirlineId': body.AirlineId, 'Code': body.Code, 'Date': body.Date })
      RegisterExists = await FlightModel.findBy ({ 'EnterpriseId': body.EnterpriseId, 'SubsidiaryId': body.SubsidiaryId, 'AirlineId': body.AirlineId, 'Code': body.Code, 'Date': body.Date })

      if (RegisterExists)
      {
        if ((! params) || (RegisterExists.Id !== parseInt (params.id)))   { ResponseBody.push ({ code: 400, msg: Message.FLIGHTDUPLICATED }) }
      }


      /* Valida a Origin */

      if (typeof (body.OriginId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.ORIGININTEGER })
      }
      else if (parseInt (body.OriginId) < 1 || parseInt (body.OriginId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.ORIGINRANGE })
      }
      else
      {
        RegisterExists = await CompanyModel.find (parseInt (body.OriginId))

        if (RegisterExists)
        {
          if (! RegisterExists.Airport               )   { ResponseBody.push ({ code: 400, msg: Message.ORIGININVALID }) }
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.ORIGINSTATUS  }) }

          /* Verifica se a OriginDestination existe */

          if (parseInt (body.OriginId) !== parseInt (body.SubsidiaryId))
          {
            let OriginDestinationExists = await OriginDestinationModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId), 'AirportId': parseInt (body.OriginId) })

            if (OriginDestinationExists)
            {
              if (OriginDestinationExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.OriginDestinationStatus }) }
            }  
            else
            {
              ResponseBody.push ({ code: 400, msg: Message.OriginNotAuthorized })
            }
          }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.ORIGINNOTFOUND })
        }

        if (parseInt (body.Type) === 1 /* Arrival   */ && parseInt (body.OriginId) === parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.ORIGINNOTEQUAL }) }
        if (parseInt (body.Type) === 2 /* Departure */ && parseInt (body.OriginId) !== parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.ORIGINEQUAL    }) }
      }

      /* Valida o Origin Scheduled Time */

      //---if (typeof (body.OriginScheduledTime) !== "string")
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.ORIGINSCHEDULEDTIMESTRING })
      //---}
      //---else if (! Moment (body.OriginScheduledTime, "YYYY-MM-DD HH:mm:ss") .isValid())
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.ORIGINSCHEDULEDTIMEINVALID })
      //---}

      /* Valida o Origin Actual Time */

      //---if (typeof (body.OriginActualTime) !== "string")
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.ORIGINACTUALTIMESTRING })
      //---}
      //---else if (! Moment (body.OriginActualTime, "YYYY-MM-DD HH:mm:ss") .isValid())
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.ORIGINACTUALTIMEINVALID })
      //---}

      /* Valida a Destination */

      if (typeof (body.DestinationId) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.DESTINATIONINTEGER })
      }
      else if (parseInt (body.DestinationId) < 1 || parseInt (body.DestinationId) > 999999999)
      {
        ResponseBody.push ({ code: 400, msg: Message.DESTINATIONRANGE })
      }
      else
      {
        RegisterExists = await CompanyModel.find (parseInt (body.DestinationId))

        if (RegisterExists)
        {
          if (! RegisterExists.Airport               )   { ResponseBody.push ({ code: 400, msg: Message.DESTINATIONINVALID }) }
          if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.DESTINATIONSTATUS  }) }

          /* Verifica se a OriginDestination existe */

          if (parseInt (body.DestinationId) !== parseInt (body.SubsidiaryId))
          {
            let OriginDestinationExists = await OriginDestinationModel.findBy ({ 'EnterpriseId': parseInt (body.EnterpriseId), 'SubsidiaryId': parseInt (body.SubsidiaryId), 'AirportId': parseInt (body.DestinationId) })

            if (OriginDestinationExists)
            {
              if (OriginDestinationExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.OriginDestinationStatus }) }
            }  
            else
            {
              ResponseBody.push ({ code: 400, msg: Message.DestinationNotAuthorized })
            }
          }
        }
        else
        {
          ResponseBody.push ({ code: 400, msg: Message.DESTINATIONNOTFOUND })
        }

        if (parseInt (body.Type) === 1 /* Arrival   */ && parseInt (body.DestinationId) !== parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.DESTINATIONEQUAL    }) }
        if (parseInt (body.Type) === 2 /* Departure */ && parseInt (body.DestinationId) === parseInt (body.SubsidiaryId))   { ResponseBody.push ({ code: 400, msg: Message.DESTINATIONNOTEQUAL }) }
      }

      /* Valida o Destination Scheduled Time */

      //---if (typeof (body.DestinationScheduledTime) !== "string")
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.DESTINATIONSCHEDULEDTIMESTRING })
      //---}
      //---else if (! Moment (body.DestinationScheduledTime, "YYYY-MM-DD HH:mm:ss") .isValid())
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.DESTINATIONSCHEDULEDTIMEINVALID })
      //---}

      /* Valida o Destination Estimated Time */

      //---if (typeof (body.DestinationEstimatedTime) !== "string")
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.DESTINATIONESTIMATEDTIMESTRING })
      //---}
      //---else if (! Moment (body.DestinationEstimatedTime, "YYYY-MM-DD HH:mm:ss") .isValid())
      //---{
      //---  ResponseBody.push ({ code: 400, msg: Message.DESTINATIONESTIMATEDTIMEINVALID })
      //---}

      /* Valida o Scheduled Time */

      if (typeof (body.ScheduledTime) !== "string")
      {
        ResponseBody.push ({ code: 400, msg: Message.SCHEDULEDTIMESTRING })
      }
      else if (! Moment (body.ScheduledTime, "YYYY-MM-DD HH:mm:ss") .isValid())
      {
        ResponseBody.push ({ code: 400, msg: Message.SCHEDULEDTIMEINVALID })
      }

      /* Valida o Estimated Time */

      if (body.EstimatedTime !== null)
      {
        if (typeof (body.EstimatedTime) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.ESTIMATEDTIMESTRING })
        }
        else if (! Moment (body.EstimatedTime, "YYYY-MM-DD HH:mm:ss") .isValid())
        {
          ResponseBody.push ({ code: 400, msg: Message.ESTIMATEDTIMEINVALID })
        }
      }

      /* Valida o Actual Time */

      if (body.ActualTime !== null)
      {
        if (typeof (body.ActualTime) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.ACTUALTIMESTRING })
        }
        else if (! Moment (body.ActualTime, "YYYY-MM-DD HH:mm:ss") .isValid())
        {
          ResponseBody.push ({ code: 400, msg: Message.ACTUALTIMEINVALID })
        }
      }

      /* Valida o Ramp */

      if (typeof (body.Ramp) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.RAMPBOOLEAN })
      }

      /* Valida o Passenger */

      if (typeof (body.Passenger) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.PASSENGERBOOLEAN })
      }

      /* Valida o Cargo */

      if (typeof (body.Cargo) !== "boolean")
      {
        ResponseBody.push ({ code: 400, msg: Message.CARGOBOOLEAN })
      }

      /* Valida o Services */

      if (typeof (body.Services) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.SERVICESINTEGER })
      }
      else if (parseInt (body.Services) < 0 || parseInt (body.Services) > 255)
      {
        ResponseBody.push ({ code: 400, msg: Message.SERVICESRANGE })
      }

      /* Valida o Employees */

      if (typeof (body.Employees) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.EMPLOYESINTEGER })
      }
      else if (parseInt (body.Employees) < 0 || parseInt (body.Employees) > 255)
      {
        ResponseBody.push ({ code: 400, msg: Message.EMPLOYEESRANGE })
      }

      /* Valida o Equipments */

      if (typeof (body.Equipments) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.EQUIPMENTSINTEGER })
      }
      else if (parseInt (body.Equipments) < 0 || parseInt (body.Equipments) > 255)
      {
        ResponseBody.push ({ code: 400, msg: Message.EQUIPMENTSRANGE })
      }

      /* Valida o Attachments */

      if (typeof (body.Attachments) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.ATTACHMENTSINTEGER })
      }
      else if (parseInt (body.Attachments) < 0 || parseInt (body.Attachments) > 255)
      {
        ResponseBody.push ({ code: 400, msg: Message.ATTACHMENTSRANGE })
      }

      /* Valida o MainService */

      if (body.MainServiceId !== null)
      {
        if (typeof (body.MainServiceId) !== "number")
        {
          ResponseBody.push ({ code: 400, msg: Message.MAINSERVICEINTEGER })
        }
        else if (parseInt (body.MainServiceId) < 1 || parseInt (body.MainServiceId) > 999999999)
        {
          ResponseBody.push ({ code: 400, msg: Message.MAINSERVICERANGE })
        }
        else
        {
          RegisterExists = await MainServiceModel.find (parseInt (body.MainServiceId))

          if (RegisterExists)
          {
            if (RegisterExists.Status !== Status.ACTIVE)   { ResponseBody.push ({ code: 400, msg: Message.MAINSERVICESTATUS }) }
          }
          else
          {
            ResponseBody.push ({ code: 400, msg: Message.MAINSERVICENOTFOUND })
          }
        }
      }

      /* Verifica o Inbound Number */

      if (typeof (body.InboundNumber) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.INBOUNDNUMBERINTEGER })
      }
      else if (parseInt (body.InboundNumber) < 0 || parseInt (body.InboundNumber) > 9999)
      {
        ResponseBody.push ({ code: 400, msg: Message.INBOUNDNUMBERRANGE })
      }

      /* Verifica o Inbound Number */

      if (typeof (body.OutboundNumber) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.OUTBOUNDNUMBERINTEGER })
      }
      else if (parseInt (body.OutboundNumber) < 0 || parseInt (body.OutboundNumber) > 9999)
      {
        ResponseBody.push ({ code: 400, msg: Message.OUTBOUNDNUMBERRANGE })
      }

      /* Valida o Tail Number  */

      if (body.TailNumber !== null)
      {
        if (typeof (body.TailNumber) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.TAILNUMBERSTRING })
        }
        else if (body.TailNumber.length < 1 || body.TailNumber.length > 5)
        {
          ResponseBody.push ({ code: 400, msg: Message.TAILNUMBERMAX })
        }
      }
      // else
      // {
      //   ResponseBody.push ({ code: 400, msg: Message.TAILNUMBERREQUIRED })
      // }

      /* Valida o OnBlock */

      if (body.OnBlock !== null)
      {
        if (typeof (body.OnBlock) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.ONBLOCKSTRING })
        }
        else if (! Moment (body.OnBlock, "YYYY-MM-DD HH:mm:ss") .isValid())
        {
          ResponseBody.push ({ code: 400, msg: Message.ONBLOCKINVALID })
        }
      }

      /* Valida o OffBlock */

      if (body.OffBlock !== null)
      {
        if (typeof (body.OffBlock) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.OFFBLOCKSTRING })
        }
        else if (! Moment (body.OffBlock, "YYYY-MM-DD HH:mm:ss") .isValid())
        {
          ResponseBody.push ({ code: 400, msg: Message.OFFBLOCKINVALID })
        }
      }

      /* Valida o Comments  */

      if (body.Comments !== null)
      {
        if (typeof (body.Comments) !== "string")
        {
          ResponseBody.push ({ code: 400, msg: Message.COMMENTSSTRING })
        }
      }
      // else
      // {
      //   ResponseBody.push ({ code: 400, msg: Message.COMMENTSREQUIRED })
      // }

      /* Valida o status */

      if (typeof (body.Status) !== "number")
      {
        ResponseBody.push ({ code: 400, msg: Message.STATUSINTEGER })
      }
      else if
      (
        body.Status !== Status.ONTIME      &&
        body.Status !== Status.DELAYED     &&
        body.Status !== Status.CANCELED    &&
        body.Status !== Status.DEPARTED    &&
        body.Status !== Status.EARLY       &&
        body.Status !== Status.INROUTE     &&
        body.Status !== Status.ONGROUND    &&
        body.Status !== Status.PARKINGONLY &&
        body.Status !== Status.DELETED
      )
      {
        ResponseBody.push ({ code: 400, msg: Message.STATUSINVALID })
      }


    //#endregion


    return ResponseBody

  }





  async StoreDatabase (body)
  {

    FlightModel.create
    (
      {
        //#region INSERT

          EnterpriseId: body.EnterpriseId,

          Type  : body.Type,
          Date  : body.Date,
          LinkId: body.LinkId,

          SubsidiaryId    : body.SubsidiaryId,
          TerminalId      : body.TerminalId,
          GateId          : body.GateId,
          StandId         : body.StandId,
          CheckinCounterId: body.CheckinCounterId,
          BeltId          : body.BeltId,

          AirlineId           : body.AirlineId,
          Code                : body.Code,
          AircraftId          : body.AircraftId,
          AircraftRegistration: body.AircraftRegistration,
          AircraftSerialNumber: body.AircraftSerialNumber,

          OriginId           : body.OriginId,
          //---OriginScheduledTime: body.OriginScheduledTime,
          //---OriginActualTime   : body.OriginActualTime,

          DestinationId           : body.DestinationId,
          //---DestinationScheduledTime: body.DestinationScheduledTime,
          //---DestinationEstimatedTime: body.DestinationEstimatedTime,

          ScheduledTime: body.ScheduledTime,
          EstimatedTime: body.EstimateedTime,
          ActualTime   : body.ActualTime,

          Ramp     : body.Ramp,
          Passenger: body.Passenger,
          Cargo    : body.Cargo,

          Services   : body.Services,
          Employees  : body.Employees,
          Equipments : body.Equipments,
          Attachments: body.Attachments,

          MainServiceId: body.MainServiceId,

          InboundNumber : body.InboundNumber,
          OutboundNumber: body.OutboundNumber,
          TailNumber    : body.TailNumber,

          OnBlock : body.OnBlock,
          OffBlock: body.OffBlock,

          Comments: body.Comments,

          Status: body.Status   //--- Status.ONTIME

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

          Type  : body.Type,
          Date  : body.Date,
          LinkId: body.LinkId,

          SubsidiaryId    : body.SubsidiaryId,
          TerminalId      : body.TerminalId,
          GateId          : body.GateId,
          StandId         : body.StandId,
          CheckinCounterId: body.CheckinCounterId,
          BeltId          : body.BeltId,

          AirlineId           : body.AirlineId,
          Code                : body.Code,
          AircraftId          : body.AircraftId,
          AircraftRegistration: body.AircraftRegistration,
          AircraftSerialNumber: body.AircraftSerialNumber,

          OriginId           : body.OriginId,
          //---OriginScheduledTime: body.OriginScheduledTime,
          //---OriginActualTime   : body.OriginActualTime,

          DestinationId           : body.DestinationId,
          //---DestinationScheduledTime: body.DestinationScheduledTime,
          //---DestinationEstimatedTime: body.DestinationEstimatedTime,

          ScheduledTime: body.ScheduledTime,
          EstimatedTime: body.EstimateedTime,
          ActualTime   : body.ActualTime,

          Ramp     : body.Ramp,
          Passenger: body.Passenger,
          Cargo    : body.Cargo,

          Services   : body.Services,
          Employees  : body.Employees,
          Equipments : body.Equipments,
          Attachments: body.Attachments,

          MainServiceId: body.MainServiceId,

          InboundNumber : body.InboundNumber,
          OutboundNumber: body.OutboundNumber,
          TailNumber    : body.TailNumber,

          OnBlock : body.OnBlock,
          OffBlock: body.OffBlock,

          Comments: body.Comments,

          Status: body.Status   //--- Status.ONTIME

        //#endregion
      }
    )

    await RecordUpdate.save()

  }





  /**
   * Update a Flight status with id.
   * PATCH flight/:id
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

      let RecordStatus = await FlightModel.find (params.id)

      if (! RecordStatus)   { return response.badRequest ({ code: 400, msg: Message.IDNOTFOUND }) }


      /* Verifica status validos */

      switch (body.Status)
      {
        //#region STATUS

        case Status.ONTIME:
        case Status.DELAYED:
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
   * Delete a Flight with id.
   * DELETE flight/:id
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

      let RecordDelete = await FlightModel.find (params.id)

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
   * Loads a group of Flight records.
   * POST flight/load
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async load ({ params, request, response })
  {

    let RegisterExists = new FlightModel()
    let ResponseBody   = []

    try
    {
      let RecordsArray = request.body.Items.slice()

      if (typeof (RecordsArray) === "undefined")   { return response.badRequest ({ code: 400, msg: Message.NORECORDS }) }


      for (let Actual = 0; Actual < RecordsArray.length; Actual++)
      {
        //---RegisterExists = await FlightModel.findBy ({ 'EnterpriseId': RecordsArray [Actual] .EnterpriseId, 'SubsidiaryId': RecordsArray [Actual] .SubsidiaryId, 'AirlineId': RecordsArray [Actual] .AirlineId, 'Code': RecordsArray [Actual] .Code, 'Date': RecordsArray [Actual] .Date, 'ScheduledTime': RecordsArray [Actual] .ScheduledTime })
        //RegisterExists = await FlightModel.findBy ({ 'EnterpriseId': RecordsArray [Actual] .EnterpriseId, 'SubsidiaryId': RecordsArray [Actual] .SubsidiaryId, 'Type': RecordsArray [Actual] .Type, 'AirlineId': RecordsArray [Actual] .AirlineId, 'Code': RecordsArray [Actual] .Code, 'Date': RecordsArray [Actual] .Date })
        RegisterExists = await FlightModel.findBy ({ 'EnterpriseId': RecordsArray [Actual] .EnterpriseId, 'SubsidiaryId': RecordsArray [Actual] .SubsidiaryId, 'AirlineId': RecordsArray [Actual] .AirlineId, 'Code': RecordsArray [Actual] .Code, 'Date': RecordsArray [Actual] .Date })

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





module.exports = FlightController

'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')





/**
 * Resourceful controller for interacting with Status
 */

class StatusController
{





  /**
   * Show a list of all Statuses.
   * GET status
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
      return response.ok
      ({
        code: 200,
        Status: 
        [
          { "Id" : Status.INVALID    , "Name": Status.StatusName [Status.INVALID    ] },
          { "Id" : Status.ACTIVE     , "Name": Status.StatusName [Status.ACTIVE     ] },
          { "Id" : Status.BLOCKED    , "Name": Status.StatusName [Status.BLOCKED    ] },
          { "Id" : Status.CANCELED   , "Name": Status.StatusName [Status.CANCELED   ] },
          { "Id" : Status.ENDED      , "Name": Status.StatusName [Status.ENDED      ] },
          { "Id" : Status.ONTIME     , "Name": Status.StatusName [Status.ONTIME     ] },
          { "Id" : Status.DELAYED    , "Name": Status.StatusName [Status.DELAYED    ] },
          { "Id" : Status.DEPARTED   , "Name": Status.StatusName [Status.DEPARTED   ] },
          { "Id" : Status.EARLY      , "Name": Status.StatusName [Status.EARLY      ] },
          { "Id" : Status.INROUTE    , "Name": Status.StatusName [Status.INROUTE    ] },
          { "Id" : Status.ONGROUND   , "Name": Status.StatusName [Status.ONGROUND   ] },
          { "Id" : Status.PARKINGONLY, "Name": Status.StatusName [Status.PARKINGONLY] },
          { "Id" : Status.DELETED    , "Name": Status.StatusName [Status.DELETED    ] }
        ]
      })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Display a single Status.
   * GET status/:id
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
      return response.ok ({ code: 200, Status: [{ "Id" : parseInt (params.id), "Name": Status.StatusName [params.id] }] })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Show a list of all flight Statuses.
   * GET status/flight
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async flightindex ({ request, response, view })
  {

    try
    {
      return response.ok
      ({
        code: 200,
        Status: 
        [
          { "Id" : Status.ONTIME     , "Name": Status.StatusName [Status.ONTIME     ] },
          { "Id" : Status.DELAYED    , "Name": Status.StatusName [Status.DELAYED    ] },
          { "Id" : Status.CANCELED   , "Name": Status.StatusName [Status.CANCELED   ] },
          { "Id" : Status.DEPARTED   , "Name": Status.StatusName [Status.DEPARTED   ] },
          { "Id" : Status.EARLY      , "Name": Status.StatusName [Status.EARLY      ] },
          { "Id" : Status.INROUTE    , "Name": Status.StatusName [Status.INROUTE    ] },
          { "Id" : Status.ONGROUND   , "Name": Status.StatusName [Status.ONGROUND   ] },
          { "Id" : Status.PARKINGONLY, "Name": Status.StatusName [Status.PARKINGONLY] },
          { "Id" : Status.DELETED    , "Name": Status.StatusName [Status.DELETED    ] }
        ]
      })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





}





module.exports = StatusController

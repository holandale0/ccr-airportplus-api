'use strict'





/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const Database = use ('Database')

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')


//#region MODELS

const UserModel = use ('App/Models/User')

//#endregion





/**
 * Resourceful controller for interacting with Auth
 */

class AuthController
{





  /**
   * Do login.
   * POST /auth
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async Login ({ request, response, auth })
  {

    try
    {
      const { Email, Password } = request.all()

      let AttemptResponse = await auth .withRefreshToken() .attempt (Email, Password)

      AttemptResponse.expiresIn = new Date (new Date() .getTime() + 24 * 60 * 60 * 1000)


      /* Autentica o usuário */

      const UserRecord = await UserModel .findBy ('Email', Email);

      //***if (! UserRecord)   { ResponseBody.push ({ code: 400, msg: Message.UserNotFound }) }

      AttemptResponse.User            = UserRecord.$attributes;
      AttemptResponse.User.StatusName = Status.StatusName [AttemptResponse.User.Status]

      delete AttemptResponse.User.Code;
      delete AttemptResponse.User.Password;
      delete AttemptResponse.User.HashCode;
      delete AttemptResponse.User.CreatedAt;
      delete AttemptResponse.User.UpdatedAt;


      return response.created ({ code: 201, msg: AttemptResponse })
    }
    catch (error)
    {
      console.log ("AuthController -> login -> error", error)
      return response .status (error.status) .json ({ code: error.status, msg: error.message })
      //---return response.internalServerError ({ code: 500, msg: error.message })
    }



  }





  /**
   * Refresh User Token.
   * PUT /auth
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async RefreshToken ({ auth, request, response })
  {

    console.log (' CHEGOU AQUI ! ! !')

    try
    {
      const { refreshToken } = request .only ([ 'refreshToken' ])

      const Token = await auth .generateForRefreshToken (refreshToken)

      return response.created ({ code: 201, msg: Token })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





  /**
   * Revoke a User Token.
   * DELETE auth
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async RevokeToken ({ params, request, response, auth })
  {

    try
    {
      const UserRecord = await auth.getUser()

      const Revoke = await auth .authenticator ('jwt') .revokeTokensForUser (UserRecord)

      return response.ok ({ code: 200, msg: Revoke })
    }
    catch (error)
    {
      return response.internalServerError ({ code: 500, msg: error.message })
    }

  }





//#region PROCESSO ANTERIOR


  
    // //#region MODELS

    // const User = use('App/Models/User')
    // const Company = use('App/Models/Company')
    // const Profile = use('App/Models/Profile')
    // const UserProfile = use('App/Models/UserProfile')
    // const Feature = use('App/Models/Feature')
    // const ProfileFeature = use('App/Models/ProfileFeature')

    // //#endregion





      /**
       * Do login.
       * POST /auth
       *
       * @param {object} ctx
       * @param {Request} ctx.request
       * @param {Response} ctx.response
       */

      // async login({ request, response, auth }) {

      //   try
      //   {
      //     const { Email, Password } = request.all()


      //     let attemptResponse = await auth
      //     .withRefreshToken()
      //     .attempt(Email, Password)
      //     attemptResponse.expiresIn = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

      //     const user = await User.findBy('Email', Email);
      //     const userProfile = await UserProfile.findBy("UserId", user.Id);
      //     const profile = await Profile.find(userProfile.ProfileId);
      //     const company = await Company.findBy('Id', userProfile.$attributes.AirportId);

        
      //     attemptResponse.user = user.$attributes;
      //     attemptResponse.profile = profile.$attributes;
      //     attemptResponse.airport = company.$attributes;

      //     delete attemptResponse.user.Code;
      //     delete attemptResponse.user.Nick;
      //     delete attemptResponse.user.Password;
      //     delete attemptResponse.user.HashCode;
      //     delete attemptResponse.user.CreatedAt;
      //     delete attemptResponse.user.UpdatedAt;

      //     delete attemptResponse.profile.CreatedAt;
      //     delete attemptResponse.profile.UpdatedAt;

      //     delete attemptResponse.airport.Nick;
      //     delete attemptResponse.airport.Enterprise;
      //     delete attemptResponse.airport.Airport;
      //     delete attemptResponse.airport.Airline;
      //     delete attemptResponse.airport.Transporter;
      //     delete attemptResponse.airport.Address;
      //     delete attemptResponse.airport.Number;
      //     delete attemptResponse.airport.Complement;
      //     delete attemptResponse.airport.Neighborhood;
      //     delete attemptResponse.airport.City;
      //     delete attemptResponse.airport.State;
      //     delete attemptResponse.airport.Country;
      //     delete attemptResponse.airport.PostalCode;
      //     delete attemptResponse.airport.CreatedAt;
      //     delete attemptResponse.airport.UpdatedAt;

          
      //     let arrFeatCodes = await Database 
      //     .table ('Feature').select("Code")
      //     .innerJoin ("ProfileFeature as Profile"     , "Feature.Id"    , "Profile.FeatureId"    )
      //     .where ('Profile.ProfileId'   , profile.$attributes.Id)
          

      //     var features = {
      //       AccountSettings:"boolean",
      //       FlightInformation:"boolean",
      //       FIDS:"boolean",
      //     }


      //     let jsonArrayFeature = [];

      //     for(let i = 0 ; i < arrFeatCodes.length ; i++){
      //       jsonArrayFeature.push(arrFeatCodes[i].Code);
      //     }
            
      //     console.log(arrFeatCodes);
      //     console.log(jsonArrayFeature);

      //     features.AccountSettings = ( jsonArrayFeature.includes(1) ? true : false ); // Code : 1 = AccountSettings

      //     features.FlightInformation = ( jsonArrayFeature.includes(2)  ? true : false ); // Code : 2 = FlightInformation

      //     features.FIDS = ( jsonArrayFeature.includes(3)  ? true : false ); // Code : 3 = FIDS

      //     attemptResponse.features = features;

      //     console.log("AuthController -> login -> attemptResponse", attemptResponse)

      //     return response.created({ code: 201, msg: attemptResponse })
      //   }
      //   catch (error)
      //   {
      //     console.log("AuthController -> login -> error", error)
      //     return response.status(error.status).json({ code: error.status, msg: error.message })
      //   }

      // }



  //#endregion





}





module.exports = AuthController

'use strict'





/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use ('Route')


//***   Métodos padronizados

const Version = "api/v1"
const Id      = "/:id"
const LoadBar = "/load"

const Index   = "index"
const Show    = "show"
const Store   = "store"
const Update  = "update"
const Status  = "status"
const Destroy = "destroy"
const Load    = "load"





//#region Token

  const AuthBar        = '/auth'
  const AuthController = 'AuthController.'

  Route.post (AuthBar, AuthController + 'Login') .validator ('TokenValidator') .prefix (Version)

//#endregion






Route.group(() =>
{





  //#region User

    const UserBar        = '/user'
    const UserController = 'UserController.'

    Route.get    (UserBar          , UserController + Index  )
    Route.get    (UserBar + Id     , UserController + Show   )
    Route.post   (UserBar          , UserController + Store  ) .validator ('UserValidator')
    Route.put    (UserBar + Id     , UserController + Update ) .validator ('UserValidator')
    Route.patch  (UserBar + Id     , UserController + Status )
    Route.delete (UserBar + Id     , UserController + Destroy)
    Route.post   (UserBar + LoadBar, UserController + Load   )

    Route.post   (UserBar + '/mail'        , UserController + 'sendMail'     ) //.validator ('UserValidator')
    Route.put    (UserBar + '/reset/:token', UserController + 'resetPassword') //.validator ('ForgotPasswordValidator')

  //#endregion


  //#region Token - necessitam de autenticação

    Route.put    (AuthBar, AuthController + 'RefreshToken')
    Route.delete (AuthBar, AuthController + 'RevokeToken' )

  //#endregion


  //#region System

    const SystemBar        = '/system'
    const SystemController = 'SystemController.'

    Route.get    (SystemBar          , SystemController + Index  )
    Route.get    (SystemBar + Id     , SystemController + Show   )
    Route.post   (SystemBar          , SystemController + Store  ) .validator ('SystemValidator')
    Route.put    (SystemBar + Id     , SystemController + Update ) .validator ('SystemValidator')
    Route.patch  (SystemBar + Id     , SystemController + Status )
    Route.delete (SystemBar + Id     , SystemController + Destroy)
    Route.post   (SystemBar + LoadBar, SystemController + Load   )

  //#endregion


  //#region Function

    const FunctionBar        = '/function'
    const FunctionController = 'FunctionController.'

    Route.get    (FunctionBar          , FunctionController + Index  )
    Route.get    (FunctionBar + Id     , FunctionController + Show   )
    Route.post   (FunctionBar          , FunctionController + Store  ) .validator ('FunctionValidator')
    Route.put    (FunctionBar + Id     , FunctionController + Update ) .validator ('FunctionValidator')
    Route.patch  (FunctionBar + Id     , FunctionController + Status )
    Route.delete (FunctionBar + Id     , FunctionController + Destroy)
    Route.post   (FunctionBar + LoadBar, FunctionController + Load   )

  //#endregion


  //#region Company

    const CompanyBar        = '/company'
    const CompanyController = 'CompanyController.'

    Route.get    (CompanyBar          , CompanyController + Index  )
    Route.get    (CompanyBar + Id     , CompanyController + Show   )
    Route.post   (CompanyBar          , CompanyController + Store  ) .validator ('CompanyValidator')
    Route.put    (CompanyBar + Id     , CompanyController + Update ) .validator ('CompanyValidator')
    Route.patch  (CompanyBar + Id     , CompanyController + Status )
    Route.delete (CompanyBar + Id     , CompanyController + Destroy)
    Route.post   (CompanyBar + LoadBar, CompanyController + Load   )

    Route.post   (CompanyBar + LoadBar + "airport", CompanyController + Load + "airport")
    Route.post   (CompanyBar + LoadBar + "airline", CompanyController + Load + "airline")

  //#endregion


  //#region EnterpriseSystem

    const EnterpriseSystemBar        = '/enterpriseSystem'
    const EnterpriseSystemController = 'EnterpriseSystemController.'

    Route.get    (EnterpriseSystemBar          , EnterpriseSystemController + Index  )
    Route.get    (EnterpriseSystemBar + Id     , EnterpriseSystemController + Show   )
    Route.post   (EnterpriseSystemBar          , EnterpriseSystemController + Store  ) .validator ('EnterpriseSystemValidator')
    Route.put    (EnterpriseSystemBar + Id     , EnterpriseSystemController + Update ) .validator ('EnterpriseSystemValidator')
    Route.patch  (EnterpriseSystemBar + Id     , EnterpriseSystemController + Status )
    Route.delete (EnterpriseSystemBar + Id     , EnterpriseSystemController + Destroy)
    Route.post   (EnterpriseSystemBar + LoadBar, EnterpriseSystemController + Load   )

  //#endregion


  //#region EnterpriseSubsidiary

    const EnterpriseSubsidiaryBar        = '/enterprisesubsidiary'
    const EnterpriseSubsidiaryController = 'EnterpriseSubsidiaryController.'

    Route.get    (EnterpriseSubsidiaryBar          , EnterpriseSubsidiaryController + Index  )
    Route.get    (EnterpriseSubsidiaryBar + Id     , EnterpriseSubsidiaryController + Show   )
    Route.post   (EnterpriseSubsidiaryBar          , EnterpriseSubsidiaryController + Store  ) .validator ('EnterpriseSubsidiaryValidator')
    Route.put    (EnterpriseSubsidiaryBar + Id     , EnterpriseSubsidiaryController + Update ) .validator ('EnterpriseSubsidiaryValidator')
    Route.patch  (EnterpriseSubsidiaryBar + Id     , EnterpriseSubsidiaryController + Status )
    Route.delete (EnterpriseSubsidiaryBar + Id     , EnterpriseSubsidiaryController + Destroy)
    Route.post   (EnterpriseSubsidiaryBar + LoadBar, EnterpriseSubsidiaryController + Load   )

  //#endregion


  //#region OriginDestination

    const OriginDestinationBar        = '/origindestination'
    const OriginDestinationController = 'OriginDestinationController.'

    Route.get    (OriginDestinationBar          , OriginDestinationController + Index  )
    Route.get    (OriginDestinationBar + Id     , OriginDestinationController + Show   )
    Route.post   (OriginDestinationBar          , OriginDestinationController + Store  ) .validator ('OriginDestinationValidator')
    Route.put    (OriginDestinationBar + Id     , OriginDestinationController + Update ) .validator ('OriginDestinationValidator')
    Route.patch  (OriginDestinationBar + Id     , OriginDestinationController + Status )
    Route.delete (OriginDestinationBar + Id     , OriginDestinationController + Destroy)
    Route.post   (OriginDestinationBar + LoadBar, OriginDestinationController + Load   )

  //#endregion


  //#region SubsidiaryAirline

    const SubsidiaryAirlineBar        = '/subsidiaryairline'
    const SubsidiaryAirlineController = 'SubsidiaryAirlineController.'

    Route.get    (SubsidiaryAirlineBar          , SubsidiaryAirlineController + Index  )
    Route.get    (SubsidiaryAirlineBar + Id     , SubsidiaryAirlineController + Show   )
    Route.post   (SubsidiaryAirlineBar          , SubsidiaryAirlineController + Store  ) .validator ('SubsidiaryAirlineValidator')
    Route.put    (SubsidiaryAirlineBar + Id     , SubsidiaryAirlineController + Update ) .validator ('SubsidiaryAirlineValidator')
    Route.patch  (SubsidiaryAirlineBar + Id     , SubsidiaryAirlineController + Status )
    Route.delete (SubsidiaryAirlineBar + Id     , SubsidiaryAirlineController + Destroy)
    Route.post   (SubsidiaryAirlineBar + LoadBar, SubsidiaryAirlineController + Load   )

  //#endregion


  //#region Role

    const RoleBar        = '/role'
    const RoleController = 'RoleController.'

    Route.get    (RoleBar          , RoleController + Index  )
    Route.get    (RoleBar + Id     , RoleController + Show   )
    Route.post   (RoleBar          , RoleController + Store  ) .validator ('RoleValidator')
    Route.put    (RoleBar + Id     , RoleController + Update ) .validator ('RoleValidator')
    Route.patch  (RoleBar + Id     , RoleController + Status )
    Route.delete (RoleBar + Id     , RoleController + Destroy)
    Route.post   (RoleBar + LoadBar, RoleController + Load   )

  //#endregion


  //#region RoleFunction

    const RoleFunctionBar        = '/rolefunction'
    const RoleFunctionController = 'RoleFunctionController.'

    Route.get    (RoleFunctionBar          , RoleFunctionController + Index  )
    Route.get    (RoleFunctionBar + Id     , RoleFunctionController + Show   )
    Route.post   (RoleFunctionBar          , RoleFunctionController + Store  ) .validator ('RoleFunctionValidator')
    Route.put    (RoleFunctionBar + Id     , RoleFunctionController + Update ) .validator ('RoleFunctionValidator')
    Route.patch  (RoleFunctionBar + Id     , RoleFunctionController + Status )
    Route.delete (RoleFunctionBar + Id     , RoleFunctionController + Destroy)
    Route.post   (RoleFunctionBar + LoadBar, RoleFunctionController + Load   )

  //#endregion


  //#region UserRole

    const UserRoleBar        = '/userrole'
    const UserRoleController = 'UserRoleController.'

    Route.get    (UserRoleBar          , UserRoleController + Index  )
    Route.get    (UserRoleBar + Id     , UserRoleController + Show   )
    Route.post   (UserRoleBar          , UserRoleController + Store  ) .validator ('UserRoleValidator')
    Route.put    (UserRoleBar + Id     , UserRoleController + Update ) .validator ('UserRoleValidator')
    Route.patch  (UserRoleBar + Id     , UserRoleController + Status )
    Route.delete (UserRoleBar + Id     , UserRoleController + Destroy)
    Route.post   (UserRoleBar + LoadBar, UserRoleController + Load   )

  //#endregion


  //#region SubsidiaryEmployee

    const SubsidiaryEmployeeBar        = '/subsidiaryemployee'
    const SubsidiaryEmployeeController = 'SubsidiaryEmployeeController.'

    Route.get    (SubsidiaryEmployeeBar          , SubsidiaryEmployeeController + Index  )
    Route.get    (SubsidiaryEmployeeBar + Id     , SubsidiaryEmployeeController + Show   )
    Route.post   (SubsidiaryEmployeeBar          , SubsidiaryEmployeeController + Store  ) .validator ('SubsidiaryEmployeeValidator')
    Route.put    (SubsidiaryEmployeeBar + Id     , SubsidiaryEmployeeController + Update ) .validator ('SubsidiaryEmployeeValidator')
    //Route.patch  (SubsidiaryEmployeeBar + Id     , SubsidiaryEmployeeController + Status )
    Route.delete (SubsidiaryEmployeeBar + Id     , SubsidiaryEmployeeController + Destroy)
    Route.post   (SubsidiaryEmployeeBar + LoadBar, SubsidiaryEmployeeController + Load   )

  //#endregion


  //#region Resource

    const ResourceBar        = '/resource'
    const ResourceController = 'ResourceController.'

    Route.get    (ResourceBar          , ResourceController + Index  )
    Route.get    (ResourceBar + Id     , ResourceController + Show   )
    Route.post   (ResourceBar          , ResourceController + Store  ) .validator ('ResourceValidator')
    Route.put    (ResourceBar + Id     , ResourceController + Update ) .validator ('ResourceValidator')
    Route.patch  (ResourceBar + Id     , ResourceController + Status )
    Route.delete (ResourceBar + Id     , ResourceController + Destroy)
    Route.post   (ResourceBar + LoadBar, ResourceController + Load   )

  //#endregion


  //#region Aircraft

    const AircraftBar        = '/aircraft'
    const AircraftController = 'AircraftController.'

    Route.get    (AircraftBar          , AircraftController + Index  )
    Route.get    (AircraftBar + Id     , AircraftController + Show   )
    Route.post   (AircraftBar          , AircraftController + Store  ) .validator ('AircraftValidator')
    Route.put    (AircraftBar + Id     , AircraftController + Update ) .validator ('AircraftValidator')
    Route.patch  (AircraftBar + Id     , AircraftController + Status )
    Route.delete (AircraftBar + Id     , AircraftController + Destroy)
    Route.post   (AircraftBar + LoadBar, AircraftController + Load   )

  //#endregion


  //#region MainService

    const MainServiceBar        = '/mainservice'
    const MainServiceController = 'MainServiceController.'

    Route.get    (MainServiceBar          , MainServiceController + Index  )
    Route.get    (MainServiceBar + Id     , MainServiceController + Show   )
    Route.post   (MainServiceBar          , MainServiceController + Store  ) .validator ('MainServiceValidator')
    Route.put    (MainServiceBar + Id     , MainServiceController + Update ) .validator ('MainServiceValidator')
    Route.patch  (MainServiceBar + Id     , MainServiceController + Status )
    Route.delete (MainServiceBar + Id     , MainServiceController + Destroy)
    Route.post   (MainServiceBar + LoadBar, MainServiceController + Load   )

  //#endregion





  //***   Rotas para ServiceGroup

  const ServiceGroupBar        = '/servicegroup'
  const ServiceGroupController = 'ServiceGroupController.'

  Route.get    (ServiceGroupBar          , ServiceGroupController + Index  )
  Route.get    (ServiceGroupBar + Id     , ServiceGroupController + Show   )
  Route.post   (ServiceGroupBar          , ServiceGroupController + Store  ) .validator ('ServiceGroupValidator')
  Route.put    (ServiceGroupBar + Id     , ServiceGroupController + Update ) .validator ('ServiceGroupValidator')
  Route.patch  (ServiceGroupBar + Id     , ServiceGroupController + Status )
  Route.delete (ServiceGroupBar + Id     , ServiceGroupController + Destroy)
  Route.post   (ServiceGroupBar + LoadBar, ServiceGroupController + Load   )


  //***   Rotas para ServiceEnterprise

  const ServiceEnterpriseBar        = '/serviceenterprise'
  const ServiceEnterpriseController = 'ServiceEnterpriseController.'

  Route.get    (ServiceEnterpriseBar          , ServiceEnterpriseController + Index  )
  Route.get    (ServiceEnterpriseBar + Id     , ServiceEnterpriseController + Show   )
  Route.post   (ServiceEnterpriseBar          , ServiceEnterpriseController + Store  ) .validator ('ServiceEnterpriseValidator')
  Route.put    (ServiceEnterpriseBar + Id     , ServiceEnterpriseController + Update ) .validator ('ServiceEnterpriseValidator')
  Route.delete (ServiceEnterpriseBar + Id     , ServiceEnterpriseController + Destroy)
  Route.post   (ServiceEnterpriseBar + LoadBar, ServiceEnterpriseController + Load   )


  //#region ServiceSubsidiary

    const ServiceSubsidiaryBar        = '/servicesubsidiary'
    const ServiceSubsidiaryController = 'ServiceSubsidiaryController.'

    Route.get    (ServiceSubsidiaryBar          , ServiceSubsidiaryController + Index  )
    Route.get    (ServiceSubsidiaryBar + Id     , ServiceSubsidiaryController + Show   )
    Route.post   (ServiceSubsidiaryBar          , ServiceSubsidiaryController + Store  ) .validator ('ServiceSubsidiaryValidator')
    Route.put    (ServiceSubsidiaryBar + Id     , ServiceSubsidiaryController + Update ) .validator ('ServiceSubsidiaryValidator')
    Route.delete (ServiceSubsidiaryBar + Id     , ServiceSubsidiaryController + Destroy)
    Route.post   (ServiceSubsidiaryBar + LoadBar, ServiceSubsidiaryController + Load   )

  //#endregion


  //***   Rotas para ServiceAirline

  const ServiceAirlineBar        = '/serviceairline'
  const ServiceAirlineController = 'ServiceAirlineController.'

  Route.get    (ServiceAirlineBar          , ServiceAirlineController + Index  )
  Route.get    (ServiceAirlineBar + Id     , ServiceAirlineController + Show   )
  Route.post   (ServiceAirlineBar          , ServiceAirlineController + Store  ) .validator ('ServiceAirlineValidator')
  Route.put    (ServiceAirlineBar + Id     , ServiceAirlineController + Update ) .validator ('ServiceAirlineValidator')
  Route.delete (ServiceAirlineBar + Id     , ServiceAirlineController + Destroy)
  Route.post   (ServiceAirlineBar + LoadBar, ServiceAirlineController + Load   )


  //***   Rotas para Flight

  const FlightBar        = '/flight'
  const FlightController = 'FlightController.'

  Route.get    (FlightBar          , FlightController + Index  )
  Route.get    (FlightBar + Id     , FlightController + Show   )
  Route.post   (FlightBar          , FlightController + Store  ) .validator ('FlightValidator')
  Route.put    (FlightBar + Id     , FlightController + Update ) .validator ('FlightValidator')
  Route.patch  (FlightBar + Id     , FlightController + Status )
  Route.delete (FlightBar + Id     , FlightController + Destroy)
  Route.post   (FlightBar + LoadBar, FlightController + Load   )


  //***   Rotas para FIDS

  const FIDSBar        = '/fids'
  const FIDSController = 'FIDSController.'

  Route.get    (FIDSBar          , FIDSController + Index  )
  Route.get    (FIDSBar + Id     , FIDSController + Show   )
  Route.post   (FIDSBar          , FIDSController + Store  ) .validator ('FIDSValidator')
  Route.put    (FIDSBar + Id     , FIDSController + Update ) .validator ('FIDSValidator')
  Route.patch  (FIDSBar + Id     , FIDSController + Status )
  Route.delete (FIDSBar + Id     , FIDSController + Destroy)
  Route.post   (FIDSBar + LoadBar, FIDSController + Load   )

  Route.get    (FIDSBar + "token" + Id, FIDSController + Show + "token"  )


  //#region API Integration

    const APIIntegrationBar        = '/apiintegration'
    const APIIntegrationController = 'APIIntegrationController.'

    Route.get    (APIIntegrationBar          , APIIntegrationController + Index  )
    Route.get    (APIIntegrationBar + Id     , APIIntegrationController + Show   )
    Route.post   (APIIntegrationBar          , APIIntegrationController + Store  ) .validator ('APIIntegrationValidator')
    Route.put    (APIIntegrationBar + Id     , APIIntegrationController + Update ) .validator ('APIIntegrationValidator')
    //Route.patch  (APIIntegrationBar + Id     , APIIntegrationController + Status )
    Route.delete (APIIntegrationBar + Id     , APIIntegrationController + Destroy)
    Route.post   (APIIntegrationBar + LoadBar, APIIntegrationController + Load   )

    //Route.get    (APIIntegrationBar + "token" + Id, APIIntegrationController + Show + "token"  )

  //#endregion
  

  //#region Status de registros

    const StatusBar        = '/status'
    const StatusController = 'StatusController.'

    Route.get (StatusBar     , StatusController + Index)
    Route.get (StatusBar + Id, StatusController + Show )

    Route.get (StatusBar + FlightBar .replace ("/", ""), StatusController + FlightBar .replace ("/", "") + Index)

  //#endregion





  //#region EnterpriseAirport - SERÁ DESCONTINUADO

    const EnterpriseAirportBar        = '/enterpriseairport'
    const EnterpriseAirportController = 'EnterpriseAirportController.'

    Route.get    (EnterpriseAirportBar          , EnterpriseAirportController + Index  )
    Route.get    (EnterpriseAirportBar + Id     , EnterpriseAirportController + Show   )
    Route.post   (EnterpriseAirportBar          , EnterpriseAirportController + Store  ) .validator ('EnterpriseAirportValidator')
    Route.put    (EnterpriseAirportBar + Id     , EnterpriseAirportController + Update ) .validator ('EnterpriseAirportValidator')
    Route.patch  (EnterpriseAirportBar + Id     , EnterpriseAirportController + Status )
    Route.delete (EnterpriseAirportBar + Id     , EnterpriseAirportController + Destroy)
    Route.post   (EnterpriseAirportBar + LoadBar, EnterpriseAirportController + Load   )

  //#endregion





}) .prefix (Version) //.middleware (['auth'])

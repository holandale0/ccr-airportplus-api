'use strict'





class Messages
{





  //#region System

    static SystemInteger  = "System id must be numeric"
    static SystemRequired = "System id is required"
    static SystemNotFound = "System id not found"
    static SystemStatus   = "System isn't Active"

  //#endregion


  //#region Function

    static FunctionInteger  = "Function id must be numeric"
    static FunctionRequired = "Function id is required"
    static FunctionNotFound = "Function id not found"
    static FunctionStatus   = "Function isn't Active"

  //#endregion


  //#region Company

    static CompanyNotDefined  = "Company must be defined as Enterprise, ubsidiary, Airport, Customer, Airline and/or Transporter"
    static EnterpriseBoolean  = "Enterprise indicator must be boolean"
    static SubsidiaryBoolean  = "Subsidiary indicator must be boolean"
    static AirportBoolean     = "Airport indicator must be boolean"
    static CustomerBoolean    = "Customer indicator must be boolean"
    static AirlineBoolean     = "Airline indicator must be boolean"
    static TransporterBoolean = "Transporter indicator must be boolean"

    static EnterpriseInteger  = "Enterprise id must be numeric"
    static EnterpriseRequired = "Enterprise id is required"
    static EnterpriseNotFound = "Enterprise id not found"
    static EnterpriseStatus   = "Enterprise isn't Active"
    static EnterpriseInvalid  = "Invalid Enterprise id"
    static EnterpriseRange    = "Enterprise id must be between 1 and 999999999"

    static SubsidiaryInteger  = "Subsidiary id must be numeric"
    static SubsidiaryRequired = "Subsidiary id is required"
    static SubsidiaryNotFound = "Subsidiary id not found"
    static SubsidiaryStatus   = "Subsidiary isn't Active"
    static SubsidiaryInvalid  = "Invalid Subsidiary id"
    static SubsidiaryRange    = "Subsidiary id must be between 1 and 999999999"

    static AirportInteger  = "Airport id must be numeric"
    static AirportRequired = "Airport id is required"
    static AirportNotFound = "Airport id not found"
    static AirportStatus   = "Airport isn't Active"
    static AirportInvalid  = "Invalid Airport id"
    static AirportRange    = "Airport id must be between 1 and 999999999"

    static AirportSubsidiaryDifferent = "Airport must be different from this Subsidiary"

    static AirlineInteger  = "Airline id must be numeric"
    static AirlineRequired = "Airline id is required"
    static AirlineNotFound = "Airline id not found"
    static AirlineStatus   = "Airline isn't Active"
    static AirlineInvalid  = "Invalid Airline id"
    static AirlineRange    = "Airline id must be between 1 and 999999999"

    static AirlineSubsidiaryDifferent = "Airline must be different from this Subsidiary"

  //#endregion


  //#region Enterprise x System

    static EnterpriseSystemNotFound      = "Enterprise / System ids not found"
    static EnterpriseSystemNotAuthorized = "System not authorized for this Enterprise"

  //#endregion


  //#region Enterprise x Subsidiary

    static EnterpriseSubsidiaryNotFound      = "Enterprise / Subsidiary ids not found"
    static EnterpriseSubsidiaryStatus        = "Enterprise / Subsidiary isn't Active"
    static EnterpriseSubsidiaryNotAuthorized = "Subsidiary not authorized for this Enterprise"

  //#endregion

  //#region Subsidiary x Airline

    static SubsidiaryAirlineNotFound      = "Subsidiary / Airline ids not found"
    static SubsidiaryAirlineStatus        = "Subsidiary / Airline isn't Active"
    static SubsidiaryAirlineNotAuthorized = "Airline not authorized for this Subsidiary"

  //#endregion


  //#region OriginDestination

    static OriginDestinationNotFound      = "Origin / Destination ids not found"
    static OriginDestinationStatus        = "Origin / Destination isn't Active"
    static OriginDestinationNotAuthorized = "Origin / Destination not authorized for this Subsidiary"

    static ORIGININTEGER       = "Origin id must be numeric"
    static ORIGINREQUIRED      = "Origin id is required"
    static ORIGINNOTFOUND      = "Origin id not found"
    static ORIGINSTATUS        = "Origin isn't Active"
    static ORIGININVALID       = "Invalid Origin id"
    static ORIGINRANGE         = "Origin id must be between 1 and 999999999"
    static ORIGINEQUAL         = "Origin id must be this Subsidiary"
    static ORIGINNOTEQUAL      = "Origin id must be different from this Subsidiary"
    static OriginNotAuthorized = "Origin not authorized for this Subsidiary"
  
    static DESTINATIONINTEGER       = "Destination id must be numeric"
    static DESTINATIONREQUIRED      = "Destination id is required"
    static DESTINATIONNOTFOUND      = "Destination id not found"
    static DESTINATIONSTATUS        = "Destination isn't Active"
    static DESTINATIONINVALID       = "Invalid Destination id"
    static DESTINATIONRANGE         = "Destination id must be between 1 and 999999999"
    static DESTINATIONEQUAL         = "Destination id must be this Subsidiary"
    static DESTINATIONNOTEQUAL      = "Destination id must be different from this Subsidiary"
    static DestinationNotAuthorized = "Destination not authorized for this Subsidiary"

  //#endregion


  //#region Enterprise x Airport

    static EnterpriseAirportNotFound      = "Enterprise / Airport ids not found"
    static EnterpriseAirportStatus        = "Enterprise / Airport isn't Active"
    static EnterpriseAirportNotAuthorized = "Airport not authorized for this Enterprise"

  //#endregion


  //#region Role

    static RoleInteger  = "Role id must be numeric"
    static RoleRequired = "Role id is required"
    static RoleNotFound = "Role id not found"
    static RoleStatus   = "Role isn't Active"
    static RoleRange    = "Role id must be between 1 and 999999999"

  //#endregion


  //#region RoleFunction

    static RoleFunctionInteger  = "RoleFunction id must be numeric"
    static RoleFunctionRequired = "RoleFunction id is required"
    static RoleFunctionNotFound = "RoleFunction id not found"
    static RoleFunctionStatus   = "RoleFunction isn't Active"
    static RoleFunctionRange    = "RoleFunction id must be between 1 and 999999999"

    static CRUDQueryRequired = "Query indicator is required"
    static CRUDQueryBoolean  = "Query indicator must be boolean"

    static CRUDInsertRequired = "Insert indicator is required"
    static CRUDInsertBoolean  = "Insert indicator must be boolean"

    static CRUDUpdateRequired = "Update indicator is required"
    static CRUDUpdateBoolean  = "Update indicator must be boolean"

    static CRUDDeleteRequired = "Delete indicator is required"
    static CRUDDeleteBoolean  = "Delete indicator must be boolean"

    static CRUDExecuteRequired = "Execute indicator is required"
    static CRUDExecuteBoolean  = "Execute indicator must be boolean"

  //#endregion


  //#region User

    static UserInteger  = "User id must be numeric"
    static UserRequired = "User id is required"
    static UserNotFound = "User id not found"
    static UserStatus   = "User isn't Active"
    static UserRange    = "User id must be between 1 and 999999999"

    static EMAILSTRING     = "E-mail must be alphanumeric"
    static EMAILREQUIRED   = "E-mail is required"
    static EMAILMIN        = "E-mail must have at least 8 characters"
    static EMAILMAX        = "E-mail must have at least 8 and up to 50 characters"
    static EMAIL           = "The field is not in e-mail format"
    static EMAILDUPLICATED = "E-mail already registered"
    static EMAILNOTFOUND   = "E-mail not found"
    static EMAILSENT       = "E-mail sent to user"

    static PASSWORDSTRING     = "Password must be alphanumeric"
    static PASSWORDREQUIRED   = "Password is required"
    static PASSWORDMIN        = "Password must have at least 8 characters"
    static PASSWORDMAX        = "Password must have at least 8 and up to 16 characters"
    static PASSWORDSDONTMATCH = "Passwords don't match"

  //#endregion


  //#region UserRole

    static UserRoleInteger  = "UserRole id must be numeric"
    static UserRoleRequired = "UserRole id is required"
    static UserRoleNotFound = "UserRole id not found"
    static UserRoleStatus   = "UserRole isn't Active"
    static UserRoleRange    = "UserRole id must be between 1 and 999999999"

  //#endregion


  //#region ServiceSubsidiary

    static ServiceSubsidiaryInteger    = "Subsidiary Service id must be numeric"
    static ServiceSubsidiaryRequired   = "Subsidiary Service id is required"
    static ServiceSubsidiaryNotFound   = "Subsidiary Service id not found"
    static ServiceSubsidiaryStatus     = "Subsidiary Service is disabled"
    static ServiceSubsidiaryInvalid    = "Invalid Subsidiary Service id"
    static ServiceSubsidiaryRange      = "Subsidiary Service id must be between 1 and 999999999"
    static ServiceSubsidiaryDuplicated = "Subsidiary Service already registered"

  //#endregion


  //#region Subsidiary x Employee

    static JobString   = "Job must be alphanumeric"
    static JobRequired = "Job is required"
    static JobMax      = "Job must have up to 20 characters"

    static FinanceInteger  = "Finance Code must be numeric"
    static FinanceRequired = "Finance Code is required"
    static FinanceRange    = "Finance Code must be between 1 and 999999999999"
  
  //#endregion



  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@






  static RECORDINCLUDED = "Record included"
  static RECORDUPDATED  = "Record updated"
  static RECORDDELETED  = "Record deleted"
  static RECORDSLOADED  = "Records loaded"

  static IDNOTFOUND   = "Record id not found"
  static UPDATEDENIED = "Update denied for this record status"

  static IDSDUPLICATED = "Record ids already registered"

  static STATUSINTEGER  = "Status must be numeric"
  static STATUSREQUIRED = "Record status is required"
  static STATUSINVALID  = "Invalid record status"
  static STATUSUPDATED  = "Record status updated"

  static CODEINTEGER    = "Code must be numeric"
  static CODESTRING     = "Code must be alphanumeric"
  static CODEREQUIRED   = "Code is required"
  static CODERANGE      = "Code must be between 1 and 999999999"
  static CODERANGE9999  = "Code must be between 1 and 9999"
  static CODEDUPLICATED = "Code already registered"

  static KEYINTEGER    = "Key must be numeric"
  static KEYSTRING     = "Key must be alphanumeric"
  static KEYREQUIRED   = "Key is required"
  static KEYRANGE      = "Key must be between 1 and 999999999"
  static KEYDUPLICATED = "Key already registered"

  static NAMESTRING     = "Name must be alphanumeric"
  static NAMEREQUIRED   = "Name is required"
  static NAMEMAX        = "Name must have up to 60 characters"
  static NAMEMAX40      = "Name must have up to 40 characters"
  static NAMEDUPLICATED = "Name already registered"

  static DESCRIPTIONSTRING     = "Description must be alphanumeric"
  static DESCRIPTIONREQUIRED   = "Description is required"
  static DESCRIPTIONMAX        = "Description must have up to 10000 characters"
  static DESCRIPTIONDUPLICATED = "Description already registered"

  static NICKSTRING     = "Nick must be alphanumeric"
  static NICKREQUIRED   = "Nick is required"
  static NICKMAX        = "Nick must have up to 20 characters"
  static NICKDUPLICATED = "Nick name already registered"

  static TOKENSTRING     = "Invalid token"
  static TOKENSTRINGLD   = "Token must have only letters and digits"
  static TOKENREQUIRED   = "Token is required"
  static TOKENNOTFOUND   = "Token not found"
  static TOKENMAX        = "Token must have up to 20 characters"
  static TOKENDUPLICATED = "Token already registered"





  static NOTAIRLINE     = "Airport must not be defined as Airline"
  static NOTTRANSPORTER = "Airport must not be defined as Transporter"

  static IATASTRING      = "IATA must be alphanumeric"
  static IATAREQUIRED    = "IATA is required"
  static IATAMAX2        = "IATA must have 2 characters"
  static IATAMAX3        = "IATA must have 3 characters"
  static IATADUPLICATED  = "IATA already registered"
  static IATATRANSPORTER = "IATA is invalid for transporter"

  static ICAOSTRING      = "ICAO must be alphanumeric"
  static ICAOREQUIRED    = "ICAO is required"
  static ICAOMAX3        = "ICAO must have 3 characters"
  static ICAOMAX4        = "ICAO must have 4 characters"
  static ICAODUPLICATED  = "ICAO already registered"
  static ICAOTRANSPORTER = "ICAO is invalid for transporter"




  static TRANSPORTERINTEGER  = "Transporter id must be numeric"
  static TRANSPORTERREQUIRED = "Transporter id is required"
  static TRANSPORTERNOTFOUND = "Transporter id not found"
  static TRANSPORTERSTATUS   = "Transporter isn't Active"
  static TRANSPORTERINVALID  = "Invalid Transporter id"
  static TRANSPORTERRANGE    = "Transporter id must be between 1 and 999999999"


  static ADDRESSSTRING = "Address must be alphanumeric"
  static ADDRESSMAX    = "Address must have up to 50 characters"

  static NUMBERINTEGER = "Number must be numeric"

  static COMPLEMENTSTRING = "Complement must be alphanumeric"
  static COMPLEMENTMAX    = "Complement must have up to 30 characters"

  static NEIGHBORHOODSTRING = "Neighborhood must be alphanumeric"
  static NEIGHBORHOODMAX    = "Neighborhood must have up to 30 characters"

  static CITYSTRING   = "City must be alphanumeric"
  static CITYREQUIRED = "City is required"
  static CITYMAX      = "City must have up to 40 characters"

  static STATESTRING   = "State must be alphanumeric"
  static STATEREQUIRED = "State is required"
  static STATEMAX      = "State must have up to 40 characters"

  static COUNTRYSTRING   = "Country must be alphanumeric"
  static COUNTRYREQUIRED = "Country is required"
  static COUNTRYMAX      = "Country must have up to 40 characters"

  static REGIONSTRING   = "Region must be alphanumeric"
  static REGIONREQUIRED = "Region is required"
  static REGIONMAX      = "Region must have up to 40 characters"

  static POSTALCODESTRING = "Postal code must be alphanumeric"
  static POSTALCODEMAX    = "Postal code must have up to 10 characters"





  static RESOURCENOTDEFINED    = "Resource must be defined as Gate, Stand, Checkin Counter or Belt"
  static GATEBOOLEAN           = "Gate indicator must be boolean"
  static STANDBOOLEAN          = "Stand indicator must be boolean"
  static CHECKINCOUNTERBOOLEAN = "Checkin Counter indicator must be boolean"
  static BELTRBOOLEAN          = "Belt indicator must be boolean"

  static TERMINALINTEGER    = "Terminal id must be numeric"
  static TERMINALREQUIRED   = "Terminal id is required"
  static TERMINALNOTFOUND   = "Terminal id not found"
  static TERMINALSTATUS     = "Terminal isn't Active"
  static TERMINALINVALID    = "Invalid Terminal id"
  static TERMINALRANGE      = "Terminal id must be between 1 and 999999999"
  static TerminalSubsidiary = "Terminal doesn't belong to this airport"

  static GATEINTEGER    = "Gate id must be numeric"
  static GATEREQUIRED   = "Gate id is required"
  static GATENOTFOUND   = "Gate id not found"
  static GATESTATUS     = "Gate isn't Active"
  static GATEINVALID    = "Invalid Gate id"
  static GateSubsidiary = "Gate doesn't belong to this airport"

  static STANDINTEGER    = "Stand id must be numeric"
  static STANDREQUIRED   = "Stand id is required"
  static STANDNOTFOUND   = "Stand id not found"
  static STANDSTATUS     = "Stand isn't Active"
  static STANDINVALID    = "Invalid Stand id"
  static StandSubsidiary = "Stand doesn't belong to this airport"

  static CHECKINCOUNTERINTEGER    = "Chekin Counter id must be numeric"
  static CHECKINCOUNTERREQUIRED   = "Chekin Counter id is required"
  static CHECKINCOUNTERNOTFOUND   = "Chekin Counter id not found"
  static CHECKINCOUNTERSTATUS     = "Chekin Counter isn't Active"
  static CHECKINCOUNTERINVALID    = "Invalid Chekin Counter id"
  static CheckinCounterSubsidiary = "Chekin Counter doesn't belong to this airport"

  static BELTINTEGER    = "Belt id must be numeric"
  static BELTREQUIRED   = "Belt id is required"
  static BELTNOTFOUND   = "Belt id not found"
  static BELTSTATUS     = "Belt isn't Active"
  static BELTINVALID    = "Invalid Belt id"
  static BeltSubsidiary = "Belt doesn't belong to this airport"



  static AIRCRAFTINTEGER  = "Aircraft id must be numeric"
  static AIRCRAFTREQUIRED = "Aircraft id is required"
  static AIRCRAFTNOTFOUND = "Aircraft id not found"
  static AIRCRAFTSTATUS   = "Aircraft isn't Active"
  static AIRCRAFTINVALID  = "Invalid Aircraft id"
  static AIRCRAFTRANGE    = "Aircraft id must be between 1 and 999999999"



  static MAINSERVICEINTEGER  = "Main Service id must be numeric"
  static MAINSERVICEREQUIRED = "Main Service id is required"
  static MAINSERVICENOTFOUND = "Main Service id not found"
  static MAINSERVICESTATUS   = "Main Service isn't Active"
  static MAINSERVICEINVALID  = "Invalid Main Service id"
  static MAINSERVICERANGE    = "Main Service id must be between 1 and 999999999"



  static SERVICEGROUPINTEGER  = "Service Group id must be numeric"
  static SERVICEGROUPREQUIRED = "Service Group id is required"
  static SERVICEGROUPNOTFOUND = "Service Group id not found"
  static SERVICEGROUPRANGE    = "Service Group id must be between 1 and 999999999"
  static SERVICEGROUPSTATUS   = "Service Group isn't Active"
  static SERVICEGROUPRANGE    = "Service Group id must be between 1 and 999999999"

  static LABELSTRING     = "Label must be alphanumeric"
  static LABELREQUIRED   = "Label is required"
  static LABELMAX        = "Label must have up to 20 characters"
  static LABELDUPLICATED = "Label already registered"



  static SERVICEENTERPRISEINTEGER    = "Enterprise Service id must be numeric"
  static SERVICEENTERPRISEREQUIRED   = "Enterprise Service id is required"
  static SERVICEENTERPRISENOTFOUND   = "Enterprise Service id not found"
  static SERVICEENTERPRISESTATUS     = "Enterprise Service is disabled"
  static SERVICEENTERPRISEINVALID    = "Invalid Enterprise Service id"
  static SERVICEENTERPRISERANGE      = "Enterprise Service id must be between 1 and 999999999"
  static SERVICEENTERPRISEDUPLICATED = "Enterprise Service already registered"

  static INTEGERBOOLEAN  = "Integer indicator must be boolean"
  static INTEGERREQUIRED = "Integer indicator is required"

  static DECIMALBOOLEAN  = "Decimal indicator must be boolean"
  static DECIMALREQUIRED = "Decimal indicator is required"

  static FLAGBOOLEAN  = "Flag indicator must be boolean"
  static FLAGREQUIRED = "Flag indicator is required"

  static DATEBEGINBOOLEAN  = "Date Begin indicator must be boolean"
  static DATEBEGINREQUIRED = "Date Begin indicator is required"

  static DATEENDBOOLEAN  = "Date End indicator must be boolean"
  static DATEENDREQUIRED = "Date End indicator is required"

  static COMMENTSSTRING   = "Comments must be alphanumeric"
  static COMMENTSREQUIRED = "Comments is required"
  static COMMENTSMAX      = "Comments must have up to 20 characters"

  static ACCOUNTINTEGER  = "Financial Account must be numeric"
  static ACCOUNTREQUIRED = "Financial Account is required"
  static ACCOUNTRANGE    = "Financial Account must be between 1 and 999999999999"

  static ENABLEDBOOLEAN  = "Enabled indicator must be boolean"
  static ENABLEDREQUIRED = "Enabled indicator is required"

  static BEGINDATEREQUIRED = "Begin Date is required"
  static BEGINDATEINVALID  = "Invalid Begin Date"
    
  static ENDDATEREQUIRED = "End Date is required"
  static ENDDATEINVALID  = "Invalid End Date"





  static SERVICEAIRLINEINTEGER    = "Airline Service id must be numeric"
  static SERVICEAIRLINEREQUIRED   = "Airline Service id is required"
  static SERVICEAIRLINENOTFOUND   = "Airline Service id not found"
  static SERVICEAIRLINESTATUS     = "Airline Service is disabled"
  static SERVICEAIRLINEINVALID    = "Invalid Airline Service id"
  static SERVICEAIRLINERANGE      = "Airline Service id must be between 1 and 999999999"
  static SERVICEAIRLINEDUPLICATED = "Airline Service already registered"

  static PRIORITYINTEGER  = "Priority must be numeric"
  static PRIORITYREQUIRED = "Priority is required"
  static PRIORITYRANGE    = "Priority must be between 1 and 999999999"



  static TYPEINTEGER     = "Type must be numeric"
  static TYPEREQUIRED    = "Type is required"
  static TYPERANGE001001 = "Type must be 1"
  static TYPERANGE001002 = "Type must be 1 or 2" // Flight
  static TYPERANGE001005 = "Type must be between 1 and 5" // Resource

  static DATESTRING   = "Flight Date must be alphanumeric"
  static DATEDATETIME = "Flight Date must be date"
  static DATEREQUIRED = "Flight Date must be date"
  static DATEINVALID  = "Invalid Flight Date"

  static LINKIDINTEGER   = "Link id must be numeric"
  static LINKIDREQUIRED  = "Link id is required"
  static LINKIDNOTFOUND  = "Link id not found"
  static LINKIDSTATUS    = "Link isn't Active"
  static LINKIDINVALID   = "Invalid Link id"
  static LINKIDRANGE     = "Link id must be between 1 and 999999999"
  static LINKIDANOTHER   = "Linked flight must be another record"
  static LINKTYPEANOTHER = "Linked flight type must be different from current"

  static AIRCRAFTREGISTRATIONSTRING   = "Aircraft Registration must be alphanumeric"
  static AIRCRAFTREGISTRATIONREQUIRED = "Aircraft Registration is required"
  static AIRCRAFTREGISTRATIONMAX      = "Aircraft Registration must have up to 20 characters"

  static AIRCRAFTSERIALNUMBERSTRING   = "Aircraft Serial Number must be alphanumeric"
  static AIRCRAFTSERIALNUMBERREQUIRED = "Aircraft Serial Number is required"
  static AIRCRAFTSERIALNUMBERMAX      = "Aircraft Serial Number must have up to 20 characters"


  static FLIGHTDUPLICATED = "Flight already registered"


  static ORIGINSCHEDULEDTIMESTRING   = "Origin Schedule Time must be alphanumeric"
  static ORIGINSCHEDULEDTIMEDATETIME = "Origin Schedule Time must be datetime"
  static ORIGINSCHEDULEDTIMEREQUIRED = "Origin Schedule Time is required"
  static ORIGINSCHEDULEDTIMEINVALID  = "Invalid Origin Schedule Time"

  static ORIGINACTUALTIMESTRING   = "Origin Actual Time must be alphanumeric"
  static ORIGINACTUALTIMEDATETIME = "Origin Actual Time must be datetime"
  static ORIGINACTUALTIMEREQUIRED = "Origin Actual Time is required"
  static ORIGINACTUALTIMEINVALID  = "Invalid Origin Actual Time"


  static DESTINATIONSCHEDULEDTIMESTRING   = "Destination Schedule Time must be alphanumeric"
  static DESTINATIONSCHEDULEDTIMEDATETIME = "Destination Schedule Time must be datetime"
  static DESTINATIONSCHEDULEDTIMEREQUIRED = "Destination Schedule Time is required"
  static DESTINATIONSCHEDULEDTIMEINVALID  = "Invalid Destination Schedule Time"

  static DESTINATIONESTIMATEDTIMESTRING   = "Destination Estimated Time must be alphanumeric"
  static DESTINATIONESTIMATEDTIMEDATETIME = "Destination Estimated Time must be datetime"
  static DESTINATIONESTIMATEDTIMEREQUIRED = "Destination Estimated Time is required"
  static DESTINATIONESTIMATEDTIMEINVALID  = "Invalid Destination Estimated Time"


  static SCHEDULEDTIMESTRING   = "Schedule Time must be alphanumeric"
  static SCHEDULEDTIMEDATETIME = "Schedule Time must be datetime"
  static SCHEDULEDTIMEREQUIRED = "Schedule Time is required"
  static SCHEDULEDTIMEINVALID  = "Invalid Schedule Time"

  static ESTIMATEDTIMESTRING   = "Estimateed Time must be alphanumeric"
  static ESTIMATEDTIMEDATETIME = "Estimateed Time must be datetime"
  static ESTIMATEDTIMEREQUIRED = "Estimateed Time is required"
  static ESTIMATEDTIMEINVALID  = "Invalid Estimateed Time"

  static ACTUALTIMESTRING   = "Actual Time must be alphanumeric"
  static ACTUALTIMEDATETIME = "Actual Time must be datetime"
  static ACTUALTIMEREQUIRED = "Actual Time is required"
  static ACTUALTIMEINVALID  = "Invalid Actual Time"


  static RAMPREQUIRED = "Ramp indicator is required"
  static RAMPBOOLEAN  = "Ramp indicator must be boolean"

  static PASSENGERREQUIRED = "Passenger indicator is required"
  static PASSENGERBOOLEAN  = "Passenger indicator must be boolean"

  static CARGOREQUIRED = "Cargo indicator is required"
  static CARGOBOOLEAN  = "Cargo indicator must be boolean"

  static SERVICESINTEGER  = "Services must be numeric"
  static SERVICESREQUIRED = "Services is required"
  static SERVICESRANGE    = "Services must be between 0 and 255"

  static EMPLOYEESINTEGER  = "Employees must be numeric"
  static EMPLOYEESREQUIRED = "Employees is required"
  static EMPLOYEESRANGE    = "Employees must be between 0 and 255"

  static EQUIPMENTSINTEGER  = "Equipments must be numeric"
  static EQUIPMENTSREQUIRED = "Equipments is required"
  static EQUIPMENTSRANGE    = "Equipments must be between 0 and 255"

  static ATTACHMENTSINTEGER  = "Attachments must be numeric"
  static ATTACHMENTSREQUIRED = "Attachments is required"
  static ATTACHMENTSRANGE    = "Attachments must be between 0 and 255"

  static INBOUNDNUMBERINTEGER = "Inbound Number must be numeric"
  static INBOUNDNUMBERRANGE   = "Inbound Number must be between 0 and 9999"

  static OUTBOUNDNUMBERINTEGER = "Outbound Number must be numeric"
  static OUTBOUNDNUMBERRANGE   = "Outbound Number must be between 0 and 9999"

  static TAILNUMBERSTRING = "Tail Number must be alphanumeric"
  static TAILNUMBERMAX    = "Tail Number must have up to 5 characters"

  static ONBLOCKSTRING   = "On Block must be alphanumeric"
  static ONBLOCKDATETIME = "On Block must be datetime"
  static ONBLOCKREQUIRED = "On Block is required"
  static ONBLOCKINVALID  = "Invalid On Block"

  static OFFBLOCKSTRING   = "Off Block must be alphanumeric"
  static OFFBLOCKDATETIME = "Off Block must be datetime"
  static OFFBLOCKREQUIRED = "Off Block is required"
  static OFFBLOCKINVALID  = "Invalid Off Block"


  static COMMENTSSTRING = "Comments must be alphanumeric"



  static FIDSINTEGER    = "FIDS id must be numeric"
  static FIDSREQUIRED   = "FIDS id is required"
  static FIDSNOTFOUND   = "FIDS id not found"
  static FIDSSTATUS     = "FIDS is disabled"
  static FIDSINVALID    = "Invalid FIDS id"
  static FIDSRANGE      = "FIDS id must be between 1 and 999999999"
  static FIDSDUPLICATED = "FIDS key already registered"

  static REFRESHINTEGER     = "Refresh must be numeric"
  static REFRESHREQUIRED    = "Refresh is required"
  static REFRESHRANGE001255 = "Refresh must be between 1 and 255"

  static SQLCOMMANDSTRING   = "SQL Select command must be alphanumeric"
  static SQLCOMMANDREQUIRED = "SQL Select command is required"
  static SQLCOMMANDINVALID  = "Invalid SQL Select command"


  //#region APIIntegration

    static APIIntegrationInteger    = "API Integration id must be numeric"
    static APIIntegrationRequired   = "API Integration id is required"
    static APIIntegrationNotFound   = "API Integration id not found"
    static APIIntegrationStatus     = "API Integration isn't Active"
    static APIIntegrationRange      = "API Integration id must be between 1 and 999999999"
    static APIIntegrationDuplicated = "API Integration ids already registered"

    static DayBeforeBoolean  = "Day Before indicator must be boolean"
    static DayBeforeRequired = "Day before is required"

    static DayAfterBoolean  = "Day After indicator must be boolean"
    static DayAfterRequired = "Day After is required"

    static IntervalInteger     = "Interval must be numeric"
    static IntervalRequired    = "Interval is required"
    static IntervalRange001255 = "Interval must be between 1 and 255"
    
    static SourceInteger  = "Source must be numeric"
    static SourceRequired = "Source is required"
    static SourceRange    = "Invalid source"   // "Source must be between 1 and 2"

    static APIURLString   = "API URL must be alphanumeric"
    static APIURLRequired = "API URL is required"
    static APIURLInvalid  = "API URL isn't from the selected source"

    static FilterString   = "Filter must be alphanumeric"
    static FilterRequired = "Filter is required"
    static FilterInvalid  = "Invalid filter"

  //#endregion





}





module.exports = Messages

'use strict'





const Message = use ('App/Models/Utils/Messages')





class FlightValidator
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      EnterpriseId: 'required',

      Type  : "required",
      Date  : "required",
      //LinkId: "required",

      SubsidiaryId    : 'required',
      TerminalId      : 'required',
      //GateId          : 'required',
      //StandId         : 'required',
      //CheckinCounterId: 'required',
      //BeltId          : 'required',

      AirlineId           : 'required',
      Code                : 'required',
      //AircraftId          : 'required',
      //AircraftRegistration: 'required',
      //AircraftSerialNumber: 'required',

      OriginId           : 'required',
      //---OriginScheduledTime: 'required',
      //---OriginActualTime   : 'required',

      DestinationId           : 'required',
      //---DestinationScheduledTime: 'required',
      //---DestinationEstimatedTime: 'required',

      ScheduledTime: "required",
      //EstimatedTime: "required",
      //ActualTime   : "required",

      Ramp     : 'required',
      Passenger: 'required',
      Cargo    : 'required',

      Services   : "required",
      Employees  : "required",
      Equipments : "required",
      Attachments: "required",

      //MainServiceId: 'required',

      InboundNumber : "required",
      OutboundNumber: "required",
      //TailNumber    : "required",

      //OnBlock : "required",
      //OffBlock: "required",

      //Comments: 'required',
      Status  : "required"
    }

  }



  

  get messages() 
  {

    return {
      'EnterpriseId.required': Message.EnterpriseRequired,

      'Type.required' : Message.TYPEREQUIRED,
      'Date.required' : Message.DATEREQUIRED,
      //'LinkId.integer': Message.LINKIDREQUIRED,

      'SubsidiaryId.required'    : Message.SubsidiaryRequired,
      'TerminalId.required'      : Message.TERMINALREQUIRED,
      //'GateId.required'          : Message.GATEREQUIRED,
      //'StandId.required'         : Message.STANDREQUIRED,
      //'CheckinCounterId.required': Message.CHECKINCOUNTERREQUIRED,
      //'BeltId.required'          : Message.BELTREQUIRED,

      'AirlineId.required'           : Message.AirlineRequired,
      'Code.required'                : Message.CODEREQUIRED,
      //'AircraftId.required'          : Message.AIRCRAFTREQUIRED,
      //'AircraftRegistration.required': Message.AIRCRAFTREGISTRATIONREQUIRED,
      //'AircraftSerialNumber.required': Message.AIRCRAFTSERIALNUMBERREQUIRED,

      'OriginId.required'           : Message.ORIGINREQUIRED,
      //---'OriginScheduledTime.required': Message.ORIGINSCHEDULEDTIMEREQUIRED,
      //---'OriginActualTime.required'   : Message.ORIGINACTUALTIMEREQUIRED,

      'DestinationId.required'           : Message.DESTINATIONREQUIRED,
      //---'DestinationScheduledTime.required': Message.ORIGINSCHEDULEDTIMEREQUIRED,
      //---'DestinationEstimatedTime.required': Message.DESTINATIONESTIMATEDTIMEREQUIRED,

      'ScheduledTime.required': Message.SCHEDULEDTIMEREQUIRED,
      //'EstimatedTime.required': Message.ESTIMATEDTIMEREQUIRED,
      //'ActualTime.required'   : Message.ACTUALTIMEREQUIRED,

      'Ramp.required'     : Message.RAMPREQUIRED,
      'Passenger.required': Message.PASSENGERREQUIRED,
      'Cargo.required'    : Message.CARGOREQUIRED,

      'Services.required'   : Message.SERVICESREQUIRED,
      'Employees.required'  : Message.EMPLOYEESREQUIRED,
      'Equipments.required' : Message.EQUIPMENTSREQUIRED,
      'Attachments.required': Message.ATTACHMENTSREQUIRED,

      //'MainServiceId.required': Message.MAINSERVICEREQUIRED,

      'InboundNumber.required' : Message.INBOUNDNUMBERREQUIRED,
      'OutboundNumber.required': Message.OUTBOUNDNUMBERREQUIRED,
      //'TailNumber.required'    : Message.TAILNUMBERREQUIRED,

      //'OnBlock.required' : Message.ONBLOCKREQUIRED,
      //'OffBlock.required': Message.OFFBLOCKREQUIRED,

      //'Comments.required': Message.COMMENTSREQUIRED,
      'Status.required'  : Message.STATUSREQUIRED
    }

  }





}





module.exports = FlightValidator

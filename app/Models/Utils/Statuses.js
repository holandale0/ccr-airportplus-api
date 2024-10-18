'use strict'





class Statuses 
{

  static INVALID  = 0
  static ACTIVE   = 1
  static BLOCKED  = 2
  static CANCELED = 3
  static ENDED    = 4

  static ONTIME      =  5
  static DELAYED     =  6
  static DEPARTED    =  7
  static EARLY       =  8
  static INROUTE     =  9
  static ONGROUND    = 10
  static PARKINGONLY = 11
  static DELETED     = 12



  static StatusName =
  [
    "Invalid",
    "Active",
    "Blocked",
    "Cancelled",
    "Ended",

    "On Time",
    "Delayed",
    "Departed",
    "Early",
    "In Route",
    "On Ground",
    "Parking Only",
    "Deleted"
  ]

}





module.exports = Statuses
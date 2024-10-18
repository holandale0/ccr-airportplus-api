'use strict'





const Message = use ('App/Models/Utils/Messages')





class AircraftValidator
{





  get validateAll()   { return true }





  get rules()
  {

    return {
      Code: 'required',
      Name: 'required',

      IATA: 'required',
      ICAO: 'required'
    }

  }





  get messages()
  {

    return {
      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      'IATA.required': Message.IATAREQUIRED,
      'ICAO.required': Message.ICAOREQUIRED
    }

  }





}





module.exports = AircraftValidator

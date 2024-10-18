'use strict'





const Message = use ('App/Models/Utils/Messages')





class CompanyValidator 
{





  get validateAll()   { return true }





  get rules() 
  {

    return {
      Code: 'required',
      Name: 'required',
      Nick: 'required',

      Enterprise : 'required',
      Subsidiary : 'required',
      Airport    : 'required',
      Customer   : 'required',
      Airline    : 'required',
      Transporter: 'required',

      //---IATA: 'required',
      //---ICAO: 'required',

      //---Address     : 'required',
      //---Number      : 'required',
      //---Complement  : 'required',
      //---Neighborhood: 'required',
      City        : 'required',
      State       : 'required',
      Country     : 'required',
      Region      : 'required',
      //---PostalCode  : 'required'
    }

  }



  

  get messages() 
  {

    return {
      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      'Nick.required': Message.NICKREQUIRED,

      'Enterprise.required' : Message.EnterpriseRequired,
      'Subsidiary.required' : Message.SubsidiaryRequired,
      'Airport.required'    : Message.AirportRequired,
      'Customer.required'   : Message.CustomerRequired,
      'Airline.required'    : Message.AirlineRequired,
      'Transporter.required': Message.TRANSPORTERREQUIRED,

      //---'IATA.required': Message.IATAREQUIRED,
      //---'ICAO.required': Message.ICAOREQUIRED,

      //---'Address.required'     : Message.ADDRESSREQUIRED,
      //---'Number.required'      : Message.NUMBERREQUIRED,
      //---'Complement.required'  : Message.COMPLEMENTREQUIRED,
      //---'Neighborhood.required': Message.NEIGHBORHOODREQUIRED,
      'City.required'        : Message.CITYREQUIRED,
      'State.required'       : Message.STATEREQUIRED,
      'Country.required'     : Message.COUNTRYREQUIRED,
      'Region.required'      : Message.REGIONREQUIRED,
      //---'PostalCode.string'    : Message.POSTALCODEREQUIRED

    }

  }





}





module.exports = CompanyValidator

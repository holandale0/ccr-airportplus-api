'use strict'





const Message = use ('App/Models/Utils/Messages')





class TokenValidator
{





  get validateAll()   { return true }





  get rules()
  {

    return {
      Email: 'string|required|max:50|min:8|email',
      Password: 'string|required|max:60|min:8',
      Token: 'string|max:255|min:255',
    }

  }





  get messages()
  {

    return {
      'Email.string'  : Message.EMAILSTRING,
      'Email.required': Message.EMAILREQUIRED,
      'Email.max'     : Message.EMAILMAX,
      'Email.min'     : Message.EMAILMIN,
      'Email.email'     : Message.EMAIL,

      'Password.string'  : Message.PASSWORDSTRING,
      'Password.required': Message.PASSWORDREQUIRED,
      'Password.max'     : Message.PASSWORDMAX,
      'Password.min'     : Message.PASSWORDMIN
    }

  }





}





module.exports = TokenValidator

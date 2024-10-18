'use strict'





const Message = use ('App/Models/Utils/Messages')





class ForgotPasswordValidator
{





  get validateAll()   { return true }





  get rules()
  {

    return {

      //Email: 'string|required|max:50|min:8|email',
      token: 'string|required',
      Password1: 'string|required|max:60|min:8',
      Password2: 'string|required|max:60|min:8',
    }

  }





  get messages()
  {

    return {
    //   'Code.integer' : Message.CODEINTEGER,
    //   'Code.required': Message.CODEREQUIRED,
    //   'Code.range'   : Message.CODERANGE,

      'token.string'  : Message.TOKENSTRING,
      'token.required': Message.TOKENREQUIRED,
    //  'Name.max'     : Message.NAMEMAX,

    //   'Nick.string'  : Message.NICKSTRING,
    //   'Nick.required': Message.NICKREQUIRED,
    //   'Nick.max'     : Message.NICKMAX,

    //   'Email.string'  : Message.EMAILSTRING,
    //   'Email.required': Message.EMAILREQUIRED,
    //   'Email.max'     : Message.EMAILMAX,
    //   'Email.min'     : Message.EMAILMIN,
    //   'Email.email'     : Message.EMAIL,

      'Password1.string'  : Message.PASSWORDSTRING,
      'Password1required': Message.PASSWORDREQUIRED,
      'Password1.max'     : Message.PASSWORDMAX,
      'Password1.min'     : Message.PASSWORDMIN,

      'Password2.string'  : Message.PASSWORDSTRING,
      'Password2.required': Message.PASSWORDREQUIRED,
      'Password2.max'     : Message.PASSWORDMAX,
      'Password2.min'     : Message.PASSWORDMIN
    }

  }





}





module.exports = ForgotPasswordValidator

'use strict'





const Message = use ('App/Models/Utils/Messages')





class UserValidator
{





  get validateAll()   { return true }





  get rules()
  {

    return {
      Code    : 'required',
      Name    : 'required',
      //Nick    : 'required',
      Email   : 'string|required|max:50|min:8|email',
      Password: 'string|required|max:60|min:8',
    }

  }





  get messages()
  {

    return {
      'Code.required': Message.CODEREQUIRED,
      'Name.required': Message.NAMEREQUIRED,
      //'Nick.required': Message.NICKREQUIRED,

      'Email.string'  : Message.EMAILSTRING,
      'Email.required': Message.EMAILREQUIRED,
      'Email.max'     : Message.EMAILMAX,
      'Email.min'     : Message.EMAILMIN,
      'Email.email'   : Message.EMAIL,

      'Password.string'  : Message.PASSWORDSTRING,
      'Password.required': Message.PASSWORDREQUIRED,
      'Password.max'     : Message.PASSWORDMAX,
      'Password.min'     : Message.PASSWORDMIN
    }

  }





}





module.exports = UserValidator

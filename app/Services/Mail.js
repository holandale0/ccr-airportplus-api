'use strict'





const { randomBytes } = require ('crypto')
const { promisify   } = require ('util'  )

const Mail = use ('Mail')
const Env  = use ('Env' )

const Status  = use ('App/Models/Utils/Statuses')
const Message = use ('App/Models/Utils/Messages')

const UserModel = use ('App/Models/User')





class MailService
{





  async sendMail (Email)
  {

    const From                  = Env.get ('MAIL_USERNAME'          )
    const ResetPasswordUrl      = Env.get ('RESET_PASSWORD_URL'     )
    const ResetPasswordEndpoint = Env.get ('RESET_PASSWORD_ENDPOINT')


    /* Valida o EMail */

    //let user = await User.findBy ('Email',Email);

    console.log ("MailService -> sendMail -> Email", Email)

    let UserRecord = await UserModel.findBy ('Email', Email)

    console.log ("MailService -> sendMail -> user", UserRecord)

    if (! UserRecord)   { return { code: 400, msg: Message.EMAILNOTFOUND } }


    /* Verifica o status */

    if (UserRecord.Status !== Status.ACTIVE)   { return { code: 400, msg: Message.UPDATEDENIED } }


    /* Cria token de recuperação de senha */

    const random = await promisify (randomBytes) (16);

    const token = random.toString ('hex');

    const expirationDate = new Date (new Date().getTime() + 24 * 60 * 60 * 1000);

    await UserRecord.tokens().create
    (
      {
        Token         : token,
        Type          : "forgotpassword",
        ExpirationDate: expirationDate
      }
    )


    //console.log(await user.tokens().fetch());


    /* Cria corpo do e-mail*/

    let mailBody = 
    `
      <html>

        <body>

          <h3> Hi ${UserRecord.Name}, </h3>

          <p>
              We have received your password reset request. To proceed, click on the following link:
          </p>

          <p>
              <a href="${ResetPasswordUrl}${ResetPasswordEndpoint}?token=${token}" >
                  Reset my password
              </a>
          </p>

          <p>
              Discard this message if you did not request it
          </p>

          <p>
              <strong>
                  Team Airport +
              </strong>
          </p>

        </body>

      </html>
    `;


    /* Envia e-mail com link de recuperação de senha */

    const response = await Mail.raw
    (
      mailBody, (message) =>
      {
        message.from    (From)
        message.to      (Email)
        message.subject ('[Airport +] Reset your password');
      }
    )


    console.log ("MailService -> sendMail -> response", response)

    return { code: 200, msg: Message.EMAILSENT }

  }





}





module.exports = MailService

import { transporter } from "../../Config/NodeMailer"

interface IEmail {
  email: string
  userName: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async ( user: IEmail ) => {
    const info = await transporter.sendMail({
      from: 'InventoryStack <info@craftzcoffee.com>',
      to: user.email,
      subject: 'InventoryStack - Confirma tu cuenta',
      text: 'InventoryStack - Confirma tu cuenta',
      html: `<p>Hola: ${user.userName}, has creado tu cuenta en InventoryStack, solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
            <p>E ingresa el siguiente código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
    })
    console.log('Mensaje enviado', info.messageId)
  }
}

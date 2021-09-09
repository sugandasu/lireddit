import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("testAccout: ", testAccount);

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "qaaabvuls2ag24j3@ethereal.email",
      pass: "dxhTHmCK3CcNGqGxzy",
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: "Reset password",
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

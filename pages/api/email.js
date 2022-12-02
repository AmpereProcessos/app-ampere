import nodemailer from "nodemailer";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const msg = {
      from: "ampereprocessos@email.com",
      to: req.body.emailTo,
      subject: req.body.subject,
      text: req.body.message,
    };
    nodemailer
      .createTransport({
        service: "gmail",
        auth: {
          user: "ampereprocessos@gmail.com",
          pass: "ccyecqdvssayztwe",
        },
        port: 465,
        host: "smtp.gmail.com",
      })
      .sendMail(msg)
      .then((res) => {
        console.log(res);
      });
    res.json("FOI");
  }
}

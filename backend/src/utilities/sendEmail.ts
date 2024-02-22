import nodemailer from 'nodemailer';



const sendEmail = async(email:string, subject:string, text:string) => 
{
  try
  {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.EMAIL_SECURE),
      auth:{
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
    await transporter.sendMail({
      from:process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      text:text,
    }); 

    console.log('email sent');
  }
  catch(error)
  {
    console.log('email not sent');
    console.log(error)
  }
}

export default sendEmail;
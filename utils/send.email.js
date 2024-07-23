import nodemailer from 'nodemailer';

const sendEmail = async(email, subject, message)=>{
  console.log(email);
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'arielle4@ethereal.email',
      pass: 's3zq3baFfUeempmMd7'
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from:  '<arielle4@ethereal.email>',// sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      // text: "Hello world?", // plain text body
      html: message, // html body
    });


}

export default sendEmail
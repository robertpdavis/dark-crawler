
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = (mailType, userData) =>{
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      //service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {  
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
    
    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //   from: 'satnamsinghmail296@gmail.com', // sender address
    //   to: "murad.manni@gmail.com", // list of receivers
    //   subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: "<b>Hello world?</b>", // html body
    // });
    let mailText="";
    let mailSubject="";
    let emailTo=userData.email;
    console.log(mailType);
    if (mailType==='New')
    {
        emailTo = userData.email;
        mailText= htmlWelcome(userData.fullname);
        mailSubject = "Welcome to Dark Drawler"
    }
    else{
      
      let token = userData.code;
      emailTo= userData.email;
      mailSubject = "Reset Password - Dark Crawler";
      mailText=`<p>Your security code to reset password is </p><br><br><b> ${token}</b> <br><br> <p> follow http://localhost:3001/resetpass</p>`
    }
    console.log(emailTo);
    console.log(mailText);
    let mailOptions = {
      from: 'darkcrawler@bootcampspot.com',
      to: emailTo,
      subject: mailSubject,
      html: mailText
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }



  const htmlWelcome = (fullname) => {return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Crawler</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/jass.css">
    <link rel="stylesheet" href="/css/style.css">
  </head>
  
  <body class="main-body">
    <div class="flex-column justify-space-around">
      <header class="display-flex justify-space-between align-center p-2">
  
      </header>
      <main class="container container-fluid mt-5">
        <!-- Render the sub layout -->
        Welcome ${fullname}, Thanks for joining!
      </main>
      <footer>
  
      </footer>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"></script>
  </body>
  
  </html>`
}
  module.exports = sendMail;
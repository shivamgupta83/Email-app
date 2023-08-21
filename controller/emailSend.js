const nodemailer = require('nodemailer');
const sendEmailReport = require("../models/sendEmailReport")

exports.sendMail = async(req,res) =>{

let {to,subject,body,name}=req.body;

to.map((to)=>{

    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-password'
        }
      });
    
    
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: to,
        subject: subject,
        body: body,
        name : name
      };
    
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred:', error);
        } else {       
    
          message_Response(res,200,"SUCCESS","Email sent",true,info.response)
          console.log('Email sent:', info.response);
        }
      });

}) 
      
}
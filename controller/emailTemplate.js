const { message_Response } = require("../config/helper");
const email = require("../models/emailTemplate");
const mongoose = require("mongoose");


exports.create= async(req,res)=>{
try    {

  if (Object.entries( req.body).length==0) {
    return message_Response(res, 400, "Required", "req.body", false);
}  

const emails = new email({
  subject: `<h3>${req.body.subject}</h3>`,
  body: `<p>${req.body.body}</p>`,
  name: req.body.name,
  })

  
const savedEmail= await emails.save()

if(savedEmail)
return res.status(200).send({
    message: "email added successfully",
    data: savedEmail,
    success : true
  });

else return message_Response(res, 400, "CREATE_ERROR", "emailTemplate", false, null);}
catch (error){
  return message_Response(res, 500, "SERVER_ERROR", "", false);
}
}


exports.getAll= async(req,res)=>{
  try {

    const getEmail = await email.find({});
    if(getEmail.length==0) return message_Response(res, 400, "NOT_EXIST", "emailTemplate", false, null);
  else {
    message_Response(
      res,
      200,
      "RESULT_FOUND",
      `email`,
      true,
      getEmail
    );
  }
  
  }
 catch (error) {
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
}


exports.delete=  async(req,res)=>{

 try {
    if (!req.params.emailId) {
    return message_Response(
      res,
      400,
      "TOKEN_REQ",
      "req.params.emailId",
      false
    );
  }
  if (!mongoose.isValidObjectId(req.params.emailId)) {
    return message_Response(
      res,
      400,
      "InvalidField",
      "req.params.emailId",
      false
    );
  }

  email.findByIdAndRemove(req.params.emailId).then((email) => {
      if (!email) {
        return res.status(404).send({
          message: "email not found with id " + req.params.emailId,
          success : false
        });
      }
      res.status(200).send({ message: "email deleted successfully!" });
    })
  }catch(error){

return message_Response(res,500,"SERVER_ERROR","",false)

  }
}


exports.update= async(req,res)=>{

try {

  if (Object.keys(req.body).length==0) {
    return message_Response(res, 400, "Required", "req.body", false);
}
  if (!req.params.emailId) {
    return message_Response(
      res,
      400,
      "TOKEN_REQ",
      "req.params.emailId",
      false
    );
  }
  if (!mongoose.isValidObjectId(req.params.emailId)) {
    return message_Response(
      res,
      400,
      "InvalidField",
      "req.params.emailId",
      false
    );
  }

 
  let updatedEmail = await email.findByIdAndUpdate(
    req.params.emailId,
    {
      subject: `<h3>${req.body.subject}</h3>`,
      body: `<p>${req.body.body}</p>`,
      name: req.body.name,
      },
    { new: true }
  );

  if (!updatedEmail)
    return message_Response(res, 400, "UPDATE_ERROR", "User", false);
  else {
    return message_Response(
      res,
      200,
      "UpdateSuccess",
      "User",
      false,
      updatedEmail
    );
  }
} catch (error) {
  return message_Response(res,500,"SERVER_ERROR","",false)
}
}
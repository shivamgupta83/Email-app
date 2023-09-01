const { message_Response ,AddedByOrEditedBy,actionOnError} = require("../config/helper");
const email = require("../models/emailTemplate");
const mongoose = require("mongoose");


exports.create= async(req,res)=>{
try    {

  if (Object.entries( req.body).length==0) {
    return message_Response(res, 400, "Required", "subject", false);
}  
   let {subject,body,name} = req.body;

if(!body || body.trim().length==0){
    return message_Response(res, 400, "Required", "body", false, null);
  }
  
if(!subject || subject.trim().length==0){
  return message_Response(res, 400, "Required", "subject", false, null);
}

if(!name || name.trim().length==0){
  return message_Response(res, 400, "Required", "name", false, null);
}

let addedBy = AddedByOrEditedBy(req,"add")
// {$or:[{subject},{body}]}
let isSubExist = await email.findOne({subject})
if(isSubExist) return message_Response(res, 400, "DUPLICATE", "Email Template", false, null);

const emails = new email({
  subject:req.body.subject,
  body:req.body.body,
  addedBy,
  name
  })
  
const savedEmail= await emails.save()

if(savedEmail)
return res.status(200).send({
    message: "Email Added successfully",
    data: savedEmail,
    success : true
  });

else return message_Response(res, 400, "CREATE_ERROR", "Email Template", false, null);

}
catch (error){
  actionOnError(error)
  return message_Response(res, 500, "SERVER_ERROR", "", false);
}
}


exports.getAll= async(req,res)=>{
  try {

    const getEmail = await email.find({}).sort({"addedBy.date":-1});
    if(getEmail.length==0) return message_Response(res, 400, "NOT_EXIST", "Email Template", false, null);
    
      else {
       return res.status(200).send({status:true,data:getEmail})        
      }  
  }
 catch (error) {
  actionOnError(error)
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
}


exports.delete=  async(req,res)=>{

 try {
    if (!req.params.emailTemplateId) {
    return message_Response(
      res,
      400,
      "Required",
      "Id",
      false
    );
  }
  if (!mongoose.isValidObjectId(req.params.emailTemplateId)) {
    return message_Response(
      res,
      400,
      "InvalidField",
      "Email Template Id",
      false
    );
  }

  email.findByIdAndRemove(req.params.emailTemplateId).then((email) => {
      if (!email){
        return res.status(404).send({
          message: "Email not found",
          success : false
        });
      }
      res.status(200).send({status:true, message: "Email Template deleted successfully!" });
    })
  }catch(error){
    actionOnError(error)
return message_Response(res,500,"SERVER_ERROR","",false)

  }
}


exports.update= async(req,res)=>{

try {

  if (Object.keys(req.body).length==0) {
    return message_Response(res, 400, "Required", "subject", false);
}
  if (!req.params.emailTemplateId) {
    return message_Response(
      res,
      400,
      "Required",
      "Id",
      false
    );
  }
  if (!mongoose.isValidObjectId(req.params.emailTemplateId)) {
    return message_Response(
      res,
      400,
      "InvalidField",
      "Email Template Id",
      false
    );
  }
  let {subject,body,name} = req.body

  if(!subject || subject.trim().length==0){
    return message_Response(res, 400, "Required", "subject", false, null);
  }
  if(!body || body.trim().length==0){
    return message_Response(res, 400, "Required", "body", false, null);
  }
  if(!name || name.trim().length==0){
    return message_Response(res, 400, "Required", "name", false, null);
  }


  let editedBy = AddedByOrEditedBy(req,"edit")
 
  let updatedEmail = await email.findByIdAndUpdate(
    req.params.emailTemplateId,
    {
      subject: req.body.subject,
      body: req.body.body,
      editedBy,
      name
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
      "Email template",
      true,
      updatedEmail
    );
  }
} catch (error) {
  actionOnError(error)
  return message_Response(res,500,"SERVER_ERROR","",false)
}
}
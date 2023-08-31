const { message_Response ,AddedByOrEditedBy,actionOnError} = require("../config/helper");
const client = require("../models/client");
const { default: mongoose } = require("mongoose");
const countryModel  = require("../models/country");


//============email validation====================

let isValidEmail = function (email) {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

//============client Api`s========================

exports.create = async (req, res) => {
  
  try{

    if (Object.keys( req.body).length==0) {
        return message_Response(res, 400, "Required", "body", false);
  }

  let {
    companyName,
    email,
    websiteLink,
    linkedinUrl,
    githubUrl,
    contactNo,
    whatsAppNo,
    address,
    noOfEmployees,
    cp_firstName,
    cp_lastName,
    cp_contactNo,
    cp_email,
    cp_whatsAppNo,
  } = req.body;

  if(!companyName || companyName.trim().length==0){
    return message_Response(res,400,"Required","Company Name",false,null)
  }

if (!email||req.body.email.trim().length==0)
  return message_Response(res, 400, "Required", "Email", false, null);

if (!email||!isValidEmail(req.body.email))
        return message_Response(res, 400, "InvalidEmail", "Email", false, null);

if(address){
  if(typeof address != "object" ) return message_Response(res,400,"InvalidField","address",false,null)
}
if(websiteLink){
  if(websiteLink.trim().length==0) return message_Response(res,400,"InvalidField","websiteLink",false,null)
}
if(linkedinUrl){
  if(linkedinUrl.trim().length==0) return message_Response(res,400,"InvalidField","linkedin Url",false,null)
}

if(githubUrl){
  if(githubUrl.trim().length==0) return message_Response(res,400,"InvalidField","github Url",false,null)
}
if(contactNo){
  if(websiteLink.trim().length==0) return message_Response(res,400,"InvalidField","contact No",false,null)
}
if(whatsAppNo){
  if(whatsAppNo.trim().length==0) return message_Response(res,400,"InvalidField","whatsAppNo",false,null)
}
if(cp_firstName){
  if(cp_firstName.trim().length==0) return message_Response(res,400,"InvalidField","contact person First Name",false,null)
}
if(cp_lastName){
  if(cp_lastName.trim().length==0) return message_Response(res,400,"InvalidField","contact person Last Name",false,null)
}
if(cp_contactNo){
  if(cp_contactNo.trim().length==0) return message_Response(res,400,"InvalidField","contact person Contact Number",false,null)
}
if(cp_email){
  if(cp_email.trim().length==0) return message_Response(res,400,"InvalidField","contact person Email",false,null)
}
if(cp_whatsAppNo){
  if(cp_whatsAppNo.trim().length==0) return message_Response(res,400,"InvalidField","contact person WhatsAppNo",false,null)
}


if(address){const countryId= await countryModel.findOne({Name : address.country},"_id")

 if(countryId){ address.country = countryId;}}

  const addedBy = AddedByOrEditedBy(req, "add");
  req.body.addedBy = addedBy;

  const newclient = new client({
    companyName,
    email,
    websiteLink,
    linkedinUrl,
    githubUrl,
    contactNo,
    whatsAppNo,
    address,
    noOfEmployees,
    cp_firstName,
    cp_lastName,
    cp_contactNo,
    cp_email,
    cp_whatsAppNo,
    addedBy
  });

  client.findOne({ email: req.body.email }).then((singleUser) => {                                                                                                        
    if (singleUser) {
     return res.status(400).send({
        status:false,
        message:" Email already register",
      });
    } else {
      newclient
        .save()
        .then((data) => {
         return res.status(200).send({
            message: "client added successfully",
            data: data,
          });
        })
        .catch((err) => {
          actionOnError(err);
          return message_Response(res, 500, "SERVER_ERROR", "", false);
        });
    }
  });

} catch (err){
  actionOnError(err);
  return message_Response(res, 500, "SERVER_ERROR", "", false)
}
};


exports.getAll = async (req, res) => {
  try {
    const allclient = await client.find({}).sort({"addedBy.date":-1});
    if (allclient.length!=0) {
      return res.status(200).send({status:true,data:allclient});
    } else {
      return message_Response(res, 404, "NOT_FIND_ERROR", "Clients", false);
    }
  } catch (err) {
    actionOnError(err);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.update = async (req, res) => {
  try {
    if (Object.entries(req.body).length==0) {
      return message_Response(res, 400, "Required", "Company Name", false);
}

    let {
    companyName,
    email,
    websiteLink,
    linkedinUrl,
    githubUrl,
    contactNo,
    whatsAppNo,
    address,
    noOfEmployees,
    cp_firstName,
    cp_lastName,
    cp_contactNo,
    cp_email,
    cp_whatsAppNo,
    } = req.body;

    if (!req.params.clientId) {
      return message_Response(
        res,
        400,
        "Required",
        "client Id",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.clientId)) {
      return message_Response(
        res,
        400,
        "InvalidField",
        "Client Id",
        false
      );
    }

let isExistClient =  await client.findById(req.params.clientId).lean();

if(!isExistClient) return message_Response(res,404,"NOT_EXIST","Client",false,null)

if(req.body.email|| req.body.email==''){

if (!req.body.email||!isValidEmail(req.body.email))
  return message_Response(res, 400, "InvalidEmail", "Email", false, null);

const existingClient = await client.findOne({email:req.body.email}).lean();

      if(existingClient) {
      if(existingClient._id.toString()!= req.params.clientId){
      return res.status(400).send({message:"Email already register",status:false});
      }
      }

}


if(address){
  if(typeof address != "object" ) return message_Response(res,400,"InvalidField","address",false,null)
}
if(websiteLink){
  if(websiteLink.trim().length==0) return message_Response(res,400,"InvalidField","websiteLink",false,null)
}
if(linkedinUrl){
  if(linkedinUrl.trim().length==0) return message_Response(res,400,"InvalidField","linkedinUrl",false,null)
}

if(githubUrl){
  if(githubUrl.trim().length==0) return message_Response(res,400,"InvalidField","githubUrl",false,null)
}
if(contactNo){
  if(websiteLink.trim().length==0) return message_Response(res,400,"InvalidField","contactNo",false,null)
}
if(whatsAppNo){
  if(whatsAppNo.trim().length==0) return message_Response(res,400,"InvalidField","whatsAppNo",false,null)
}
if(cp_firstName){
  if(cp_firstName.trim().length==0) return message_Response(res,400,"InvalidField","contact person firstName",false,null)
}
if(cp_lastName){
  if(cp_lastName.trim().length==0) return message_Response(res,400,"InvalidField","contact person lastName",false,null)
}
if(cp_contactNo){
  if(cp_contactNo.trim().length==0) return message_Response(res,400,"InvalidField","contact person contactNo",false,null)
}
if(cp_email){
  if(cp_email.trim().length==0) return message_Response(res,400,"InvalidField","contact person email",false,null)
}
if(cp_whatsAppNo){
  if(cp_whatsAppNo.trim().length==0) return message_Response(res,400,"InvalidField","contact person whatsAppNo",false,null)
}

if(!companyName||companyName.trim().length==0) return message_Response(res,400,"InvalidField","Company Name",false,null)


const editedBy = AddedByOrEditedBy(req, "edit");
req.body.editedBy = editedBy;

    let updatedClient = await client.findByIdAndUpdate(
      req.params.clientId,
      {
        companyName,
        email,
        websiteLink,
        linkedinUrl,
        githubUrl,
        contactNo,
        whatsAppNo,
        address,
        noOfEmployees,
        cp_firstName,
        cp_lastName,
        cp_contactNo,
        cp_email,
        cp_whatsAppNo,
        editedBy
      },
      { new: true }
    );

    if (!updatedClient)
      return message_Response(res, 400, "UPDATE_ERROR", "User", false);
    else {
      return message_Response(
        res,
        200,
        "UpdateSuccess",
        "User",
        true,
        updatedClient
      );
    }
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.delete= async (req, res) => {
  try {
    if (!req.params.clientId) {
      return message_Response(
        res,
        400,
        "Required",
        "Client Id",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.clientId)) {
      return message_Response(
        res,
        400,
        "InvalidField",
        "Client Id",
        false
      );
    }
    client.findByIdAndRemove(req.params.clientId).then((client) => {
      if (!client) {
        return res.status(404).send({
          status:false,
          message: "client not found"
        });
      }
     return res.status(200).send({ message: "client deleted successfully!",status:true });
    });
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

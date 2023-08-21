const { message_Response ,AddedByOrEditedBy} = require("../config/helper");
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
  
  if (Object.keys( req.body).length==0) {
        return message_Response(res, 400, "Required", "req.body", false);
  }

  let {
    companyName,
    email,
    WebsiteLink,
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

        if (!isValidEmail(req.body.email))
        return message_Response(res, 400, "InvalidEmail", " ", false, null);


if(typeof address != "object" ) return message_Response(res,400,"InvalidField","address",false,null)

const countryId= await countryModel.findOne({Name : address.country},"_id")

  address.country = countryId;

  const addedBy = AddedByOrEditedBy(req, "add");
  req.body.addedBy = addedBy;

  const newclient = new client({
    companyName,
    email,
    WebsiteLink,
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
      res.status(400).send({
        message: req.body.email + " email already register",
      });
    } else {
      newclient
        .save()
        .then((data) => {
          res.status(200).send({
            message: "client added successfully",
            data: data,
          });
        })
        .catch((err) => {
          return message_Response(res, 500, "SERVER_ERROR", "", false);
        });
    }
  });
};


exports.getAll = async (req, res) => {
  try {
    const allclient = await client.find({}).sort({createdAt:-1});
    if (allclient) {
      return message_Response(
        res,
        200,
        "RESULT_FOUND",
        "client",
        true,
        allclient
      );
    } else {
      return message_Response(res, 404, "NOT_FIND_ERROR", "", false);
    }
  } catch (err) {
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.update = async (req, res) => {
  try {
    if (Object.entries(req.body).length==0) {
      return message_Response(res, 400, "Required", "req.body", false);
}

    let {
    companyName,
    email,
    WebsiteLink,
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
        "TOKEN_REQ",
        "clientId",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.clientId)) {
      return message_Response(
        res,
        400,
        "InvalidField",
        "req.params.userId",
        false
      );
    }

let existingEmail = await client.findOne({email:req.body.email})
if(existingEmail) res.status(400).send({message: req.body.email + " email already register"});

const editedBy = AddedByOrEditedBy(req, "edit");
req.body.editedBy = editedBy;

    let updatedClient = await client.findByIdAndUpdate(
      req.params.clientId,
      {
        companyName,
        email,
        WebsiteLink,
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
        false,
        updatedClient
      );
    }
  } catch (error) {
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.delete= async (req, res) => {
  try {
    if (!req.params.clientId) {
      return message_Response(
        res,
        400,
        "TOKEN_REQ",
        "req.params.clientId",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.clientId)) {
      return message_Response(
        res,
        400,
        "InvalidField",
        "req.params.userId",
        false
      );
    }
    client.findByIdAndRemove(req.params.clientId).then((client) => {
      if (!client) {
        return res.status(404).send({
          message: "client not found with id " + req.params.clientId,
        });
      }
      res.status(200).send({ message: "client deleted successfully!" });
    });
  } catch (error) {
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

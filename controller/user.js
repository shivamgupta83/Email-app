const { message_Response, AddedByOrEditedBy, actionOnError } = require("../config/helper");
const {user,role}= require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//============email validation====================

let isValidEmail = function (email) {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

//===============user routHandeler=========================

exports.getAll = async (_, res) => {
  try {
    const allUser = await user.find({}).sort({"addedBy.date":-1});
    if (allUser.length!=0) {
      return res.status(200).send({status:true,data:allUser})
    } else {
      return message_Response(res, 404, "NOT_FIND_ERROR", "Users", false);
    }
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};


exports.getById = async (req, res) => {
  try {
         const User = await user.findById(req.params.userId);
      if (User) {
        return res.status(200).send({status:true,data:User})
      } else {
        return message_Response(res, 404, "NOT_FIND_ERROR", "User", false);
      }         
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.getProfile = async (req, res) => {

    try {
          const User = await user.findById(req.user._id);
        if (User) {
          return res.status(200).send({status:true,data:User})
        } else {
          return message_Response(res, 404, "NOT_FIND_ERROR", "User", false);
        }         
    } catch (error) {
      actionOnError(error);
      return message_Response(res, 500, "SERVER_ERROR", "", false);
    }

};


exports.create = (req, res) => {

  if (Object.keys(req.body).length == 0) {
    return message_Response(res, 400, "Required", "First Name", false);
  }

  let { firstName, lastName, email, contactNo, position, password } = req.body;

  if(!firstName || firstName.trim().length==0) {
    return message_Response(res, 400, "Required", "First Name", false, null);
  } 
 
  if(!lastName || lastName.trim().length==0) {
    return message_Response(res, 400, "Required", "Last Name", false, null);
  }
  
  if(!email || email.trim().length==0) {
    return message_Response(res, 400, "Required", "Email", false, null);
  }

  if(!password || password.trim().length==0) {
    return message_Response(res, 400, "Required", "Password", false, null);
  }

if(position|| position==""){

  if(position.trim().length==0||!["1","2","3"].includes(position)){
    return message_Response(res, 400, "InvalidField", "Position", false, null);
  }
}
  
if(contactNo || contactNo==''){
  if(contactNo.trim().length==0) {
  return message_Response(res, 400, "InvalidField", "Contact No", false, null);
}
}


if (!isValidEmail(req.body.email))
  return message_Response(res, 400, "InvalidEmail", " ", false, null);
  

  user.findOne({ email }).then((singleUser) => {
    if (singleUser) {
      res.status(400).send({
        status:false,
        message:"Email already in Use",
      });
    } else {
      const addedBy = AddedByOrEditedBy(req, "add");
      req.body.addedBy = addedBy;
      console.log(role)
      req.body.position = role[position]
      const newUser = new user(req.body);

      // newUser.addedBy = addedBy

      newUser
        .save()
        .then((data) => {
          res.status(200).send({
            message: "User added successfully",
            data: data,
          });
        })
        .catch((err) => {
          actionOnError(err);
          return message_Response(res, 500, "SERVER_ERROR", "", false);
        });
    }
  });
};

exports.login = async (req, res) => {
try {

  let { email, password } = req.body;


  if(!email || email.trim().length==0) {
    return message_Response(res, 400, "Required", "Email", false, null);
  } 


  if(!password || password.trim().length==0) {
    return message_Response(res, 400, "Required", "Password", false, null);
  }

  if (!isValidEmail(email))
    return message_Response(res, 400, "InvalidEmail", " ", false, null);

  user.findOne({ email, password }).then((user) => {
    if (!user) {
      res.status(404).send({
        status:false,
        message: "Username/Password Invalid",
      });
    } else {
      const token = jwt.sign(user.toObject(), process.env.SECRET_KEY);
      return message_Response(
        res,
        200,
        "SUCCESS",
        "Login successfully",
        true,
        token
      );
    }
  });

}catch(err){
  actionOnError(err);
  return message_Response(res, 500, "SERVER_ERROR", "", false);
}
};

exports.update = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0) {
      return message_Response(res, 400, "Required", "First Name", false);
    }
    if (!req.params.userId) {
      return message_Response(
        res,
        400,
        "Required",
        "User Id",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.userId)){
      return message_Response(
        res,
        400,
        "InvalidField",
        "User Id",
        false
      );
    }

let isExistUser =  await user.findById(req.params.userId).lean();

if(!isExistUser) return message_Response(res,404,"NOT_EXIST","user",false,null)


 if(req.body.email || req.body.email==''){

          if (!isValidEmail(req.body.email))
              return message_Response(res, 400, "InvalidEmail", " ", false, null);

              let singleUser= await user.findOne({ email:req.body.email}).lean()


            if(singleUser) {

              if (singleUser._id.toString()!=req.params.userId) {

                           return res.status(400).send({status:false,message:" Email already register"})

                    }

                  }
 }

 let { firstName, lastName, email, contactNo, position, password } = req.body;


  if(!firstName||firstName.trim().length==0)
  return message_Response(res, 400, "Required", "First Name", false, null);


  if(!lastName||lastName.trim().length==0)
  return message_Response(res, 400, "Required", "last Name", false, null);


  if(contactNo|| contactNo.trim().length!=0)
 {
  if(isNaN(+contactNo) ||  contactNo.toString().trim().length==0 ){
    return message_Response(res, 400, "InvalidField", "Contact No", false, null);

  }
 }


  if(!password||password.trim().length==0)
  return message_Response(res, 400, "Required", "Password", false, null);


if(position){
    if(!["1","2","3"].includes(position)){
    return message_Response(res, 400, "InvalidField", "Position", false, null);
  }
}

    const editedBy = AddedByOrEditedBy(req, "edit");
    req.body.editedBy = editedBy;
    req.body.position = role[position]
    let updatedUser = await user.findByIdAndUpdate(
      req.params.userId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNo: req.body.contactNo,
        password:req.body.password,
        position: req.body.position,
        editedBy: editedBy,
      },
      { new: true }
    );

    if (!updatedUser)
      return message_Response(res, 400, "UPDATE_ERROR", "User", false);
    else {
      return message_Response(
        res,
        200,
        "UpdateSuccess",
        "User",
        true,
        updatedUser
      );
    }
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};
exports.UpdateProfile = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0) {
      return message_Response(res, 400, "Required", "First Name", false);
    }
    if (!req.user._id) {
      return message_Response(
        res,
        400,
        "Required",
        "User Id",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.user._id)){
      return message_Response(
        res,
        400,
        "InvalidField",
        "User Id",
        false
      );
    }

let isExistUser =  await user.findById(req.user._id).lean();

if(!isExistUser) return message_Response(res,404,"NOT_EXIST","user",false,null)


 if(req.body.email || req.body.email==''){

          if (!isValidEmail(req.body.email))
              return message_Response(res, 400, "InvalidEmail", " ", false, null);

              let singleUser= await user.findOne({ email:req.body.email}).lean()


            if(singleUser) {

              if (singleUser._id.toString()!=req.user._id) {

                           return res.status(400).send({status:false,message:" Email already register"})

                    }

                  }
 }

 let { firstName, lastName, email, contactNo, position, password } = req.body;


  if(!firstName||firstName.trim().length==0)
  return message_Response(res, 400, "Required", "First Name", false, null);


  if(!lastName||lastName.trim().length==0)
  return message_Response(res, 400, "Required", "last Name", false, null);


  if(contactNo|| contactNo.trim().length!=0)
 {
  if(isNaN(+contactNo) ||  contactNo.toString().trim().length==0 ){
    return message_Response(res, 400, "InvalidField", "Contact No", false, null);

  }
 }


  if(!password||password.trim().length==0)
  return message_Response(res, 400, "Required", "Password", false, null);


if(position){
    if(!["1","2","3"].includes(position)){
    return message_Response(res, 400, "InvalidField", "Position", false, null);
  }
}

    const editedBy = AddedByOrEditedBy(req, "edit");
    req.body.editedBy = editedBy;
    req.body.position = role[position];
    let updatedUser = await user.findByIdAndUpdate(
      req.user._id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNo: req.body.contactNo,
        password:req.body.password,
        position: req.body.position,
        editedBy: editedBy,
      },
      { new: true }
    );

    if (!updatedUser)
      return message_Response(res, 400, "UPDATE_ERROR", "User", false);
    else {
      return message_Response(
        res,
        200,
        "UpdateSuccess",
        "User",
        true,
        updatedUser
      );
    }
  } catch (error) {
    actionOnError(error);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.delete = (req, res) => {
  try {
    if (!req.params.userId) {
      return message_Response(
        res,
        400,
        "InvalidField",
        "User Id",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return message_Response(
        res,
        400,
        "InvalidField",
        "User Id",
        false
      );
    }
    user.findByIdAndRemove(req.params.userId).then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }
      return res.status(200).send({status:true, message: "User deleted successfully!" });
    });
  } catch (error) {
    actionOnError(err);
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

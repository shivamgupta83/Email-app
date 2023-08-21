const { message_Response, AddedByOrEditedBy } = require("../config/helper");
const user = require("../models/user");
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
    const allUser = await user.find({});
    if (allUser) {
      return message_Response(res, 200, "RESULT_FOUND", "user", true, allUser);
    } else {
      return message_Response(res, 404, "NOT_FIND_ERROR", "", false);
    }
  } catch (err) {
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.create = (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return message_Response(res, 400, "Required", "req.body", false);
  }

  if (!isValidEmail(req.body.email))
    return message_Response(res, 400, "InvalidEmail", " ", false, null);

  let { firstName, lastName, email, contactNo, position, password } = req.body;

  user.findOne({ email }).then((singleUser) => {
    if (singleUser) {
      res.status(400).send({
        message: email + " email already register",
      });
    } else {
      const addedBy = AddedByOrEditedBy(req, "add");
      req.body.addedBy = addedBy;
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
          console.log(err.message)
          return message_Response(res, 500, "SERVER_ERROR", "", false);
        });
    }
  });
};

exports.login = async (req, res) => {
  let { email, password } = req.body;

  if (!isValidEmail(email))
    return message_Response(res, 400, "InvalidEmail", " ", false, null);

  user.findOne({ email, password }).then((user) => {
    if (!user) {
      res.status(404).send({
        message: "user is not found",
      });
    } else {
      const token = jwt.sign(user.toObject(), "secret-key");
      return message_Response(
        res,
        200,
        "SUCCESS",
        "token generated",
        true,
        token
      );
    }
  });
};

exports.update = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0) {
      return message_Response(res, 400, "Required", "req.body", false);
    }
    if (!req.params.userId) {
      return message_Response(
        res,
        400,
        "TOKEN_REQ",
        "req.params.userId",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.userId)){
      return message_Response(
        res,
        400,
        "InvalidField",
        "userId",
        false
      );
    }

 if(req.body.email){   

          if (!isValidEmail(req.body.email))
              return message_Response(res, 400, "InvalidEmail", " ", false, null);

            user.findOne({ email:req.body.email}).then((singleUser) => {
              if (singleUser) {
                res.status(400).send({
                  message: req.body.email + " email already register",
                });
              }
            });          
  }

    const editedBy = AddedByOrEditedBy(req, "edit");
    req.body.editedBy = editedBy;

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
        false,
        updatedUser
      );
    }
  } catch (error) {
    console.log(error.message)
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

exports.delete = (req, res) => {
  try {
    if (!req.params.userId) {
      return message_Response(
        res,
        400,
        "TOKEN_REQ",
        "req.params.userId",
        false
      );
    }
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return message_Response(
        res,
        400,
        "InvalidField",
        "req.params.userId",
        false
      );
    }
    user.findByIdAndRemove(req.params.userId).then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }
      res.status(200).send({ message: "User deleted successfully!" });
    });
  } catch (error) {
    return message_Response(res, 500, "SERVER_ERROR", "", false);
  }
};

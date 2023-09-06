const mongoose = require("mongoose");

let role = {
  "1": "Admin",
  "2": "HR",
  "3": "User",
   }
module.exports.role= role

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
       trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      trim: true,
    },
    position: {type:String,enum :["Admin","HR","User"]},
    password :{
        type: String,
        required: true,
        trim: true,
    },
    addedBy: Object,
    editedBy: Object, 
  }
);

module.exports.user = mongoose.model("User", userSchema);

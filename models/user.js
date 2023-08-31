const mongoose = require("mongoose");

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
    position: {type:String,enum :["admin","user","hr"]},
    password :{
        type: String,
        required: true,
        trim: true,
    },
    addedBy: Object,
    editedBy: Object, 
  }
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
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
    position: String,
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

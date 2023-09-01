const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  name:{
    type: String,
  },
  // userId: mongoose.Schema.Types.ObjectId,
  addedBy: Object,
  editedBy: Object,
});

module.exports = mongoose.model("emailTemplate", emailTemplateSchema);

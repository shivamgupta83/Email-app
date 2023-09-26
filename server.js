const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const { Auth } = require("./config/auth");
const { CronJob } = require('cron')
const {EventSave} = require("./controller/emailSend")
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use(express.json());




mongoose.set("strictQuery", true);
mongoose
  .connect(
    process.env.DATABASE,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

// ======================user APi`s=========================

app.use("/user",require("./routes/user"))

//====================client Apis`s===========================

app.use("/client",require("./routes/client"))

// =========================email template api`s===================

app.use("/emailTemplate",require("./routes/emailTemplate"));

// ========================== email send api`s=================================

app.use("/emailSend",require("./routes/emailSend"));


// ============================this running every day end 00:01 am===================

(function (){
new CronJob("01 00 * * * *",function(){
  EventSave();
},null,true,"Asia/kolkata")
})()


// =================================server============================

app.listen(process.env.PORT, function () {
  console.log("Express is running on Port https://localhost:" + process.env.PORT);
});
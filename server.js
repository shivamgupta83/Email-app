const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const { default: mongoose } = require("mongoose");
const { Auth } = require("./config/auth");




mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://husainsanwerwala:i6HsoFwpo8v8oBLr@cluster0.bryk6wr.mongodb.net/newProject01",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

// ======================user APi`s=========================

app.get("/user/getAll", require("./controller/user").getAll);

app.post("/user/create",Auth, require("./controller/user").create);

app.post("/user/login",require("./controller/user").login);

app.put("/user/Update/:userId",Auth, require("./controller/user").update);

app.delete("/user/delete/:userId",Auth, require("./controller/user").delete);

//====================client Apis`s===========================

app.get("/client/getAll",Auth, require("./controller/client").getAll);

app.post("/client/create",Auth, require("./controller/client").create);

app.put("/client/Update/:clientId",Auth, require("./controller/client").update);

app.delete("/client/delete/:clientId",Auth, require("./controller/client").delete);

// =========================email template api`s===================

app.get("/email/getAll", require("./controller/emailTemplate").getAll);

app.post("/email/create", require("./controller/emailTemplate").create);

app.put("/email/Update/:emailId", require("./controller/emailTemplate").update);

app.delete("/email/delete/:emailId", require("./controller/emailTemplate").delete);


// ========================== email send api`s=================================







app.listen(3005, function () {
  console.log("Express is running on Port " + 3005);
});

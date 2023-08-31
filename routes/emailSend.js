let express = require("express")
let route = express.Router();
const { Auth } = require("../config/auth");


route.post("/sendEmail",Auth, require("../controller/emailSend").sendEmail);
route.post("/EventSave",Auth, require("../controller/emailSend").EventSave);


module.exports = route;
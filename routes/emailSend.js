let express = require("express")
let route = express.Router();
const { Auth } = require("../config/auth");


route.post("/sendEmail",Auth, require("../controller/emailSend").sendEmail);
route.post("/eventSave",Auth, require("../controller/emailSend").EventSave);
route.post("/sendEmailReport",Auth, require("../controller/emailSend").getSendEmailReport);
route.post("/sendEmailReportPerClient/:clientId/:docId?",Auth, require("../controller/emailSend").getsendEmailReportPerClient);


module.exports = route;
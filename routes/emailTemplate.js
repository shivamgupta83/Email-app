let express = require("express")
let route = express.Router();
const { Auth } = require("../config/auth");




route.get("/getAll", require("../controller/emailTemplate").getAll);

route.post("/create",Auth, require("../controller/emailTemplate").create);

route.put("/Update/:emailTemplateId",Auth, require("../controller/emailTemplate").update);

route.delete("/delete/:emailTemplateId",Auth, require("../controller/emailTemplate").delete);

module.exports = route
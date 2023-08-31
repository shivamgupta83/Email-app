let express = require("express");
const { Auth } = require("../config/auth");
let route = express.Router();


route.get("/getAll", require("../controller/user").getAll)

route.post("/create",Auth, require("../controller/user").create);

route.post("/login",require("../controller/user").login);

route.put("/Update/:userId",Auth, require("../controller/user").update);

route.delete("/delete/:userId",Auth, require("../controller/user").delete);

module.exports = route
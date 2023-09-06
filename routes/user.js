let express = require("express");
const { Auth } = require("../config/auth");
let route = express.Router();


route.get("/getAll", require("../controller/user").getAll);

route.get("/getById/:userId",Auth, require("../controller/user").getById);

route.post("/create",Auth, require("../controller/user").create);

route.post("/login",require("../controller/user").login);

route.put("/update/:userId",Auth, require("../controller/user").update);

route.delete("/delete/:userId",Auth, require("../controller/user").delete);

route.put("/updateProfile",Auth, require("../controller/user").UpdateProfile);

route.get("/getProfile",Auth, require("../controller/user").getProfile);

module.exports = route
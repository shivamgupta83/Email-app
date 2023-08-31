let express = require("express")
let route = express.Router();
const { Auth } = require("../config/auth");


route.get("/getAll",Auth, require("../controller/client").getAll);

route.post("/create",Auth, require("../controller/client").create);

route.put("/Update/:clientId",Auth, require("../controller/client").update);

route.delete("/delete/:clientId",Auth, require("../controller/client").delete);


module.exports = route;
const messages = require("./message")
const moment = require("moment")

const message_Response =(res,statusCode,type,item,success,data)=>{
  let  message = {
       message : messages[type].replace(":item",item),
       success : success
    }
    if (data) message.data = data
    return res.status(statusCode).send(message)
}

function AddedByOrEditedBy(req, method) {
  if (method == "add") {
    return { date: moment.utc(), userId: req.user ? req.user._id : null };
  } else {
    return { date: moment.utc(), userId: req.user ? req.user._id : null };
  }
}


module.exports.message_Response = message_Response;
module.exports.AddedByOrEditedBy = AddedByOrEditedBy;
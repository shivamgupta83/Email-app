const messages = require("./message")
const moment = require("moment")

const message_Response =(res,statusCode,type,item,success,data)=>{
  let  message = {
       message : messages[type].replace(":item",item),
       success : success
    }
    if(item=="Login successfully"&& data) {
      message.token = data
    } 
    else if (data) {message.data = data}
    return res.status(statusCode).send(message)
}

function AddedByOrEditedBy(req, method) {
  if (method == "add") {
    return { date: moment.utc(), userId: req.user ? req.user._id : null };
  } else {
    return { date: moment.utc(), userId: req.user ? req.user._id : null };
  }
}


exports.actionOnError = async (error) =>{
  console.log("error.message",error.message);
  console.log("error.cause",error.cause);
  console.log("error.stack",error.stack);
  console.log("error.fileName",error.fileName);
  console.log("error.lineNumber",error.lineNumber);
}


module.exports.message_Response = message_Response;
module.exports.AddedByOrEditedBy = AddedByOrEditedBy;
const mongoose = require('mongoose')


let sendEmailReport = new mongoose.Schema({
    sendTo:[String],
    subject :String,
    textBody : String,
    from :String,
	date :Date,
	status :String,
    requestId:String,
    responce:Object,
    addedBy:Object,
    editedBy:Object,
    clientId:[{
        type: String,
    }]
})


module.exports = mongoose.model('sendEmailReport', sendEmailReport)
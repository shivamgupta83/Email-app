const mongoose = require('mongoose')


let sendEmailReport = new mongoose.Schema({
    sendTo:String,
    SentBy :String,
	Date :String,
	Status :String,
    // addedBy: Object,
    // editedBy: Object, 
})


module.export = mongoose.model('sendEmailReport', sendEmailReport)
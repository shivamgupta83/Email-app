const mongoose = require('mongoose')


const clientSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },  
    websiteLink : String,
    linkedinUrl : String,
    githubUrl : String,
    contactNo:{
        type: String,
        trim: true
    },
    whatsAppNo : String,
    address: {
        line_1 : String,
        line_2 : String,
        country:{
         type :  mongoose.Schema.Types.ObjectId,
         ref : "country"
        },
        city: String,
        state:String,
        zip:String
        },
noOfEmployees:Number,
cp_firstName : {
    type: String,
       trim: true,
},
cp_lastName :  {
    type: String,
       trim: true,
},
cp_contactNo :  {
    type: String,
       trim: true,
},
cp_email :  {
    type: String,
       trim: true,
},
cp_whatsAppNo :  {
    type: String,
       trim: true,
},
addedBy: Object,
editedBy: Object, 
});

module.exports = mongoose.model('client', clientSchema)
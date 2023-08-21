const mongoose = require('mongoose');


const countrySchema = new mongoose.Schema({

    Name : String,
	shortName : String,
	code : String,
	addedBy: Object,
	editedBy: Object, 
})


module.exports = mongoose.model('country',countrySchema)


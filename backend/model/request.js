var mongoose = require('mongoose');
var Schema = mongoose.Schema;

requestSchema = new Schema( {
	name: String,
	starttime: Date,
	desc: String,
	type: String,
	// image: String,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
request = mongoose.model('request', requestSchema);

module.exports = request;
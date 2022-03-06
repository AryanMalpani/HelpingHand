var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var request = require("./request.js");
requestSchema = new Schema( {
	typename: {type: String, unique: true},
	// starttime: Date,
	// desc: String,
	// type: String,
	// image: String,
	// seeker_id: {type: Schema.ObjectId, ref: user},
	// is_delete: { type: Boolean, default: false },
	// is_complete: { type: Boolean, default: false },
	// volunteer_id: {type: Schema.ObjectId, ref: user, default:null},
	date : { type : Date, default: Date.now },
}),
type = mongoose.model('type', requestSchema);

module.exports = type;
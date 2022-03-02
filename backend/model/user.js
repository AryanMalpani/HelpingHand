var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	fname : {
        type: String,
        required: true
    },
    lname : {
        type: String,
        required: true
    },
    age : {
        type: Number,
        // required: true,
        // min: [40, 'too young lol'],
        max: [169, 'how are you alive!']
    },
    email : {
        type: String,
        // required: true
    },
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    phoneno : {
        type: String,
        // required: true,
        minLength: 8,
        maxLength: 10
    },
    city : {
        type: String,
        // required: true
    },
	role : {
		type: Number,
		required: true,
		min: 0,
		max: 2
	}
}),
user = mongoose.model('user', userSchema);

module.exports = user;
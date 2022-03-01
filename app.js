const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/SEDB");

const seekerSchema = new mongoose.Schema({
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
        required: true,
        min: [30, 'too young lol'],
        max: [169, 'how are you alive!']
    },
    email : {
        type: String,
        required: true
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
        required: true,
        minLength: 8,
        maxLength: 10
    },
    city : {
        type: String,
        required: true
    },
    state : {
        type: String,
        // required: true
    },
    address : {
        type: String,
        // required: true
    },
    pincode: {
        type: String,
        // required: true
    },




    rating: {
        type: Number,
        default: 10
    },
    // seeks : {
    //     type: Number,
    //     default: 0
    // }
});



const Seeker = mongoose.model("Seeker", seekerSchema);

const seeker = new Seeker ({
    fname: "test",
    lname: "Kasai",
    age: 50,
    email: "kasai@gmail.com",
    username: "kasaitest",
    password: "behenchod",
    phoneno: "1234567890",
    city: "bhopal gaav"
});

// seeker.save();

const volunteerSchema = new mongoose.Schema({
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
        required: true,
        min: [30, 'too young lol'],
        max: [169, 'how are you alive!']
    },
    email : {
        type: String,
        required: true
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
        required: true,
        minLength: 8,
        maxLength: [10, "chutiye"]
    },
    city : {
        type: String,
        required: true
    },
    state : {
        type: String,
        // required: true
    },
    address : {
        type: String,
        // required: true
    },
    pincode: {
        type: String,
        // required: true
    },

    
    rating : {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    helps : {
        type: Number,
        default: 0
    }
})

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

const volunteer = new Volunteer ({
    fname: "Ishan",
    lname: "Shareef",
    age: 50,
    email: "bohsdikea@gmail.com",
    username: "sleepercell",
    password: "allahuakbar",
    phoneno: "0692611911",
    city: "Lahore"
});

// volunteer.save();


// Fruit.insertMany([kiwi, orange, banana], function(err){
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("Succesfully saved all the fruits to fruitsdb");
//     }
// })

// Since score was not mentioned in the schema, while the new fruits are added they wont have it and neither will they have the rating

// Fruit.find(function(err, fruits){
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         // console.log(fruits);

//         mongoose.connection.close();

//         fruits.forEach(function(fruit){
//             console.log(fruit.name);
//         })
//     }
// })
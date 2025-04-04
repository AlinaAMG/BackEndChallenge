const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength:[15,"the name field cannot be more then 10 characters long"]
    },
    
    
    message: {
        type: String,
        required: true,
        maxlength:[40,"The message field  cannot be more then 40 characters long"]
},
    
    date: {
        type: Date,
        default: Date.now,
        required:true,
    }
})

module.exports = mongoose.model("FEED", feedSchema);

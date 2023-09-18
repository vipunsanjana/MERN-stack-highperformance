const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    isDoctor:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    seenNotifications:{
        type:Array,
        default: []
    },
    unseenNotifications:{
        type:Array,
        default: []
    }
},
{
    timestamps:true
});


const userModel = mongoose.model("users",userSchema);
module.exports = userModel;
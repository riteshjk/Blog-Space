import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.TpqSE-tsrMBbQurUw2Su-AHaHk?rs=1&pid=ImgDetMain"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
    
},{ timestamps: true });

const User = mongoose.model("User",userSchema);

export default User
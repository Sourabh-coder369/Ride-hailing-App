const {Schema,model}=require('mongoose');

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    vehicleType: {
        type: String,
        default: null,
    }
})

const User=model('User',userSchema);

module.exports=User;
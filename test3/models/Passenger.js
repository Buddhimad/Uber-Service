const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const PassengerSchema=new Schema({
  name:{
    type:String,
    required:[true,'Name field is required']
  },
  account:{
    type:String
  },
  email:{
    type:String,
    required:[true,'Email field is required']
  },
  password:{
    type:String,
    required:[true,'Password field required']
  },
  phone:{
    type:String,
    unique:true,
    required:[true,'Phoneno required']
  }
});
const Passenger=mongoose.model('Passenger',PassengerSchema);
module.exports=Passenger;

const mongoose =require('mongoose');
const Schema =mongoose.Schema;

  const GeoSchema=new Schema({
    type:{
      type:String,
      default:'Point'
    },
    coordinates:{
      type:[Number],
      index:"2dsphere"
    }
  });

  const ATSchema=new Schema({
    phone:{
      type:String,
      required:[true,'Phoneno field is required'],
      unique:true
    },
    name:{
      type:String,
      required:[true,'Name field is required']
    },
    available:{
      type:Boolean,
      default:false
    },
    location:GeoSchema

  });
  const AT=mongoose.model('AT',ATSchema);
  module.exports=AT;

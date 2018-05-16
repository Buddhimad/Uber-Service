const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const AT=require('../models/AT');




const PickupLocation=new Schema({
    type:{
      type:String,
      default:'Point'
    },
    coordinates:{
      type:[Number],
      index:"2dsphere"
    }
  });

const DropoutLocation=new Schema({
    type:{
      type:String,
      default:'Point'
    },
    coordinates:{
      type:[Number],
      index:"2dsphere"
    }
  });
  const CurrentLocation=new Schema({
      type:{
        type:String,
        default:'Point'
      },
      coordinates:{
        type:[Number],
        index:"2dsphere"
      }
    });
  const APSchema=new Schema({
    phone:{
      type:String,
      required:[true,'Phoneno field is required']
    },
    name:{
      type:String,
      required:[true,'Name field is required']
    },
    date:{
      type:String

    },
    time:{
      type:String

    },
    pllocation:PickupLocation,
    dllocation: DropoutLocation,
    clocation:CurrentLocation,

    availabletaxi:{
      type:Array

    },
    bookedtaxino:{
      type:String
    },
    rejected:{
      type:Array
    }

  });
  const AP=mongoose.model('AP',APSchema);
  module.exports=AP;

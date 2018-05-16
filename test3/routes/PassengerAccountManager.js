const express =require('express');
const router =express.Router();
const Passenger=require('../models/Passenger');

router.get('/passenger',function(req,res,next){
   Passenger.find({}).then(function(passengers){
      res.send(passengers);
   });

});

router.get('/passenger/:no',function(req,res,next){
  Passenger.findOne({phone:req.params.no}).then(function(passenger){
    res.send(passenger);
  }).catch(next);
});

router.post('/passenger',function(req,res,next){
  Passenger.create(req.body).then(function(passenger){
    res.send(passenger);
  }).catch(next);
});

router.put('/passenger/:id',function(req,res,next){
  Passenger.updateOne({phone:req.params.id},req.body).then(function(passenger){
      res.send(passenger);
  }).catch(next);

});

router.delete('/passenger/:id',function(req,res,next){
    Passenger.deleteOne({phone:req.params.id}).then(function(passenger){
      res.send(passenger);
    });
});

module.exports=router;

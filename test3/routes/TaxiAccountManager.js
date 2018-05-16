const express =require('express');
const router =express.Router();
const Taxi=require('../models/Taxi');

router.get('/taxi',function(req,res,next){
   Taxi.find({}).then(function(taxies){
      res.send(taxies);
   });

});

router.get('/taxi/:no',function(req,res,next){
  Taxi.findOne({phone:req.params.no}).then(function(taxi){
    res.send(taxi);
  }).catch(next);
});

router.post('/taxi',function(req,res,next){
  Taxi.create(req.body).then(function(taxi){
    res.send(taxi);
  }).catch(next);
});

router.put('/taxi/:id',function(req,res,next){
  Taxi.updateOne({phone:req.params.id},req.body).then(function(taxi){
      res.send(taxi);
  }).catch(next);

});

router.delete('/taxi/:id',function(req,res,next){
    Taxi.deleteOne({phone:req.params.id}).then(function(taxi){
      res.send(taxi);
    });
});

module.exports=router;

const express =require('express');
const io=require('socket.io');
const AT=require('../models/AT');

function ioConnection2(io){
  if(!(this instanceof ioConnection2)){
    return new ioConnection2(io);
  }
  this.io=io;
}

ioConnection2.prototype.setAvailability=function(){
 this.io.on('connection',function(socket){
    console.log('User '+socket.id+' connected');

/*add rider to active list*/
    socket.on('Active',function(rider){
      /*rider goes online*/
      console.log('rider goes online');
      AT.findOne({phone:rider.phone}).then(function(r){
        /*check rider already active*/
        if(r!=null){
          console.log('Already exists');
          //  socket.broadcast.emit(r.phone+'error',{msg:'Already Exists'});
        }else{
          /*if rider doesn't exists add to the list*/
        //  socket.broadcast.emit(r.phone+'info',{msg:'You are now online'});
          console.log('Driver added');
          AT.create(rider).then(function(taxi){
            var address=taxi.phone+'info';
            socket.emit(address,{msg:'You are now online'});
          });
          //  this.io.emit(rider.phone+'info',{msg:'You are now online'});
          //socket.broadcast.emit(rider.phone+'info',{msg:'You are now online'});
        }
      });

    });
    socket.on('test',function(){
          socket.emit("94778408039",{msg:'ok'});
           //socket.emit("94765363828req",{msg:'ok'});
           var address='94765363828req';
            socket.emit(address,{msg:'You are now online'});
          console.log('working...');
        });
/*remove rider from activelist*/
  socket.on('Deactivate',function(rider){

    AT.remove({phone:rider.phone}).then(function(){
      var address=rider.phone+'info';
      socket.emit(address,{msg:'You are now offline'});
    //console.log(rider.phone +' rider goes offline');
    });
  });

  socket.on('disconnect',function(){
    console.log('User'+socket.id+' disconnected');
  });

  });
}

module.exports=ioConnection2;

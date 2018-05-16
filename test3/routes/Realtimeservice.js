const app=require('express')();
const io=require('socket.io');
const Passenger=require('../models/Passenger');
const Taxi=require('../models/Taxi');
const AT=require('../models/AT');
const AP=require('../models/AP');
const arrayList = require('array-list');
const stripe=require("stripe")("pk_test_Y3RbeTwBC5b0dXDM7y8ltWp5");



function ioConnection(io){
  if(!(this instanceof ioConnection)){
    return new ioConnection(io);
  }
  this.io=io;
}


ioConnection.prototype.Realtimeupdate=function(){
  this.io.on('connection',function(socket){

    /*send all available nearest vehicles*/
socket.on('AAV',function(passenger){
    AT.geoNear(
      {type:'Point', coordinates:[parseFloat(passenger.lng),parseFloat(passenger.lat)]},
      {maxDistance: 3000,spherical: true}
    ).then(function(riders){

        socket.broadcast.emit(passenger.mobnum+'',riders);
    });

});




/*realtime Available taxi list update*/
    socket.on('DL',function(driver){
    //  console.log(driver.phone+'Updating location...');
    var taxi={
      phone:driver.phone,
      name:driver.phone,
      location:driver.location
    };

    AT.updateOne({phone:driver.phone},taxi).then(function(err){
      //console.log(err);
      //console.log('driver updated...');
    }).catch(function(){

    });
    });


    /*Passenger request handling*/
    socket.on('PR',function(passengerrequest){
        console.log('Request received -> '+passengerrequest.phone);//80.216951,6.034989
        /*check weather passenger request exists to that passengerrequest phone no if exists
        1)first clear available taxi list
        2)find all nearest available taxis(status !=pending | status!=granted)
        3)1)if there are nearest taxies
                                    1)send request to first nearest available taxi
          2)if there are no nearest taxies
                                    2)search for taxis that have nearest dropout location to you
                                    3)send request to that taxi
          3)if there are no taxi's
                                    1)send no available taxi's
        */
        AP.findOne({phone:passengerrequest.phone}).then(function(request){
          if(request!=null){
              console.log('request  exists');
            AP.deleteOne({phone:request.phone}).then(function(){
              AP.create(passengerrequest).then(function(){

                AT.geoNear(
                  {type:'Point', coordinates:[6.033253, 80.214559]},
                  {maxDistance: 3000,spherical: true}
                  //{query:{available:true}}
                ).then(function(riders){
                   if(riders.length>0){
                     for(var i=0;i<riders.length;i++){
                       const o=riders[i];
                       /*check status*/
                       var taxi={phone:o.obj.phone};
                       AP.update({'phone':passengerrequest.phone},{'$push':{'availabletaxi':taxi}}).then(function(err){
                        // console.log(err);

                       });
                       if(i==0){
                         AT.update({phone:taxi.phone},{'$set':{'available':false}}).then(function(err){
                           console.log('request sent to suitable taxi if request exit');
                           console.log(err);

                             socket.broadcast.emit(taxi.phone,passengerrequest);
                         });

                       }
                     }
                   }else{
                     /*check nearest drop out location has taxi*/

                   }
                })

              })
            })
          }else{
            console.log('request doesnt exist');
          AP.create(passengerrequest).then(function(request){

            AT.geoNear(
              {type:'Point', coordinates:[6.033253, 80.214559]},
              {maxDistance: 3000,spherical: true,query:{available:false}}
            ).then(function(riders){
            //  console.log(riders.length);
            if(riders.length>0){
              for(var i=0;i<riders.length;i++){

                const os=riders[i];
                var oo={
                  phone:os.obj.phone
                };

              AP.update({'phone':passengerrequest.phone},{'$push':{'availabletaxi':oo}}).then(function(err){
                console.log(err);
              });
                console.log(os);

                if(i==0){
                  AT.update({phone:oo.phone},{'$set':{'available':false}}).then(function(err){
                     console.log('request sent to suitable taxi if request doesnt exit');
                      socket.broadcast.emit(oo.phone,passengerrequest);
                  });
                //  socket.broadcast.emit(oo.phone,passengerrequest);
                }

              }
            }else{
              /*check for dropout locations*/
            }
            });
          });
          }

        });

        //socket.broadcast.emit('778408039',passengerrequest);
    });






  
  });
}
module.exports=ioConnection;

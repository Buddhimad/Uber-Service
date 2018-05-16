const app=require('express')();
const http=require('http').Server(app);
const io=require('socket.io')(http);
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
var ioConnect=require('./routes/Realtimeservice.js')(io);
var ioconnect2=require('./routes/ATManager.js')(io);

mongoose.connect('mongodb://localhost:27017/taxiservicedb');
mongoose.Promise=global.Promise;

app.use(bodyParser.json());

app.use('/api/ts',require('./routes/TaxiAccountManager'));
app.use('/api/ps',require('./routes/PassengerAccountManager'));
app.use('/api/atm',require('./routes/ATManager'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

ioConnect.Realtimeupdate();
ioconnect2.setAvailability();


http.listen(7000,function(){
  console.log('listen on port 4000');
});

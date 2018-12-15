const serialPort = require('serialport');

console.log(serialPort);

const port = new serialPort.SerialPort('/dev/tty.usbserial-AK05D8SC',{
	  baudrate : 115200,
      parser: serialPort.parsers.readline('\n')
});

port.on('open',function(){
	console.log('Serial open.');
	console.log("Connected!!");
});

port.on('data',function(data){
	console.log('Data: ' + data);	
});

function write(data){
	console.log('Write: ' + data);
	port.write(new Buffer(data),function(err,results){
		if(err){
			console.log('Err: ' + err);
			console.log('Results: ' + results);
		}
	});	
}

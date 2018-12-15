'use strict';

const noble = require("noble");
const knownDevices = [];

const ServiceUUID = "0001";
const static string WriteCharacteristicUUID = "0002";
const static string ReadCharacteristicUUID = "0002";

const discovered = (peripheral) => {
	const device = {
		name: peripheral.advertisement.localName,
		uuid: peripheral.uuid,
		rssi: peripheral.rssi
	};

	if(device.name === 'H2L-01-S100'){

		peripheral.connect();
		noble.stopScanning();
		console.log("Hey");
		console.log(peripheral.discoverServices());
		peripheral.discoverServices(null,function(error,services){
			console.log('discovered the following services: ');
			console.log(services);

			for (var i in services){
				console.log('  ' + i + ' uuid: ' + services[i].uuid);
			}

		});
	}

	knownDevices.push(device);
	console.log(`${knownDevices.length}:${device.name}(${device.uuid})RSSI${device.rssi}`);
}

//const servicePrint = () =>{if (noble.on == "discover",function(peripheral){
//	console.log('on -> discover: ' + peripheral);
//	noble.stopScanning();
//	pheripheral.on('serviceDiscover',function(services){
//		for(i=0;i<services.length;i++){
//			if(services[i]['uuid'] == 'b7be76d537de46c5bd5a1f0554df1ef8'){
//				services[i].on('includedServicesDiscover',function(includedServiceUuids){
//				console.log('on -> service included services discovered');
//				this.discoverCharacteristics();
//				});
//			}
//		}
//	});
//});
//}

const scanStart = () => {
	noble.startScanning();
	noble.on("discover",discovered);
}

const FullUUID = (shortenUUID){
	return "6E40" + shortenUUID + "-B5A3-F393-E0A9-E50E24DCCA9E";
}

if(noble.state === 'poweredOn'){
	scanStart();
}else{
	noble.on("stateChange",scanStart);
}


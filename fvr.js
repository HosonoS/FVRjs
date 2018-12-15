var noble = require('noble');
var fvr = null;
var fvrCharacteristic = null;
var fvrDiscripter = null;

var check = false;

noble.on('stateChange', function(state) {
  console.log('[1.stateChange] ' + state);
  if (state === 'poweredOn') {
      noble.startScanning();
  } else {
      noble.stopScanning();
  }
});

noble.on('scanStart', function() {
  console.log('[2.scanStart]');
});

noble.on('scanStop', function() {
  console.log('[scanStop]');
});

noble.on('discover', function(peripheral) {
 
  fvr = peripheral;

  console.log(peripheral.advertisement.localName);
  if( peripheral.advertisement.localName === "H2L-01-S100"){
	noble.stopScanning();

    peripheral.on('connect', function() {
      console.log('[4.connect]');
      this.discoverServices();
    });

    peripheral.on('disconnect', function() {
      console.log('[disconnect]');
    });

    peripheral.on('servicesDiscover', function(services) {
      console.log('[5.servicesDiscover]');

        services[0].on('includedServicesDiscover', function(includedServiceUuids) {
          //console.log('[6.includedServicesDiscover]');
          this.discoverCharacteristics();
        });

        services[0].on('characteristicsDiscover', function(characteristics) {
          console.log('[7.characteristicsDiscover]');

		  /*
          for(j = 0; j < characteristics.length; j++) {
            console.log("------------");
            console.log("  serviceid:"+characteristics[j]._serviceUuid);
            console.log("  uuid:"+characteristics[j].uuid);
            console.log("  name:"+characteristics[j].name);
            console.log("  type:"+characteristics[j].type);
            console.log("  properties:"+characteristics[j].properties);
          }
		  */

		  characteristics[1].on('notify',function(state){
			if(state === true){
				check = true;
			}
		  });

          characteristics[1].subscribe(function(error){
		  	console.log(error + error);
		  });

		  characteristics[1].on('data',function(data, isNotification){
			console.log(data);
			});

		  characteristics[1].discoverDescriptors(function(error,descriptors){
		  	console.log(descriptors[0].readValue(function(error,data){
				console.log(data);
			}));
		  });
        });

        services[0].discoverIncludedServices();
      
		/*
	 	peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics){
			console.log(error);
		});
		*/
    });

    peripheral.connect();
	noble.stopScanning();
  }

});



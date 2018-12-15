var noble = require('noble');

var FOUND_MICROBIT_ADDR1 = 'db:88:10:28:d8:61';

// Temperature + Magnetometer
// characteristicsが混在する場合、それぞれのservicesも配列に追加されていないといけない
var service_uuids = ["6e400003b5a3f393e0a9e50e24dcca9e", "8ec90003f3154f609fb8838830daea50"];
var character_uuids = ["6e400003b5a3f393e0a9e50e24dcca9e", "8ec90003f3154f609fb8838830daea50"];

var subscribeCharacteristics = function( peripheral, servs, chars, callback ){
  peripheral.discoverSomeServicesAndCharacteristics(
    servs, chars, function(error, services, characteristics){
      console.log("services = "+services.length);
      console.log("characteristics = "+characteristics.length);
      for(var ic = 0; ic < characteristics.length; ic++){
        characteristics[ic].on('data', function(data, isNotification){
            callback( null, this._serviceUuid, this.uuid, data );
        });
        characteristics[ic].subscribe(function(error){
            callback( error, "", "", null );
        });
      }
  });
}

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
  if( peripheral.advertisement.localName === "H2L-01-S100"){

    peripheral.on('connect', function() {
      subscribeCharacteristics(this, service_uuids, character_uuids,
        function( error, serviceid, characterid, data ){
          console.log("error:"+error);
          console.log("serviceid:"+serviceid);
          console.log("characterid:"+characterid);
          console.log(data);
      });
    });

    peripheral.on('disconnect', function() {
    });

    peripheral.connect();
  }
  noble.stopScanning();
});


// Based on an example:
//https://github.com/don/cordova-plugin-ble-central

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

//The Bluefruit UART Service
var blue ={
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

var ConnDeviceId;
var deviceList =[];
 
function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
    // bleDeviceList.addEventListener('touchstart', conn, false); // assume not scrolling
}

function onDeviceReady(){
	refreshDeviceList();
}

	 
function refreshDeviceList(){
	//deviceList =[];
 	document.getElementById("bleDeviceList").innerHTML = ''; // empties the list
 	if (cordova.platformId === 'android') { // Android filtering is broken
 		ble.scan([], 5, onDiscoverDevice, onError);
 	} else {
 		//alert("Disconnected");
 		ble.scan([blue.serviceUUID], 5, onDiscoverDevice, onError);
 	}
 }


function onDiscoverDevice(device){
	if (device.name == "BK04") {
		ble.connect('FB:4E:50:F6:53:97', onConnect, onConnError); //MAC-adresse på enhed
		document.getElementById("bleDeviceList").innerHTML = "LOKALE: BK04";
		showFunctions();		
	}
}

// function conn(){
// 	var  deviceTouch= event.srcElement.innerHTML;
// 	document.getElementById("debugDiv").innerHTML =""; // empty debugDiv
// 	var deviceTouchArr = deviceTouch.split(",");
// 	ConnDeviceId = deviceTouchArr[1];
// 	document.getElementById("debugDiv").innerHTML += "<br>"+deviceTouchArr[0]+"<br>"+deviceTouchArr[1]; //for debug:
// 	ble.connect(ConnDeviceId, onConnect, onConnError);
//  }
 
 //succes
function onConnect(){
	document.getElementById("statusDiv").innerHTML = " Status: Forbundet";
	ble.startNotification('FB:4E:50:F6:53:97', blue.serviceUUID, blue.rxCharacteristic, onData, onError);
	
}

//failure
function onConnError(){
	alert("Problem connecting");
	document.getElementById("x").innerHTML = " Status: Ikke forbundet";
}

 function onData(data){ // data received from Arduino
	document.getElementById("receiveDiv").innerHTML =  "&#127777; " + bytesToString(data) + "<br/>";
}

function data(txt){
	messageInput.value = txt;
	var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse('FB:4E:50:F6:53:97', blue.serviceUUID, blue.txCharacteristic, data);
}	

function sendData() { // send data to Arduino
	 var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse('FB:4E:50:F6:53:97', blue.serviceUUID, blue.txCharacteristic, data);
}
	
function onSend(){
	document.getElementById("sendDiv").innerHTML = "Sent: " + messageInput.value + "<br/>";
}

function disconnect() {
	ble.disconnect(deviceId, onDisconnect, onError);
}

function onDisconnect(){
	document.getElementById("statusDiv").innerHTML = "Status: Disconnected";
}
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}

function showFunctions() {
	document.getElementById("functions").style.display = "block";
}

function cleaningLog(){
	var url='https://cleaninglog.000webhostapp.com/index.html';	
	openBrowser(url);
}

function manuals(){
	var url='https://cleaninglog.000webhostapp.com/index.html';	
	openBrowser(url);
}
function openBrowser(url) {
   var target = '_blank';
   var options = "location=no"
   var ref = cordova.InAppBrowser.open(url, target, options);
}
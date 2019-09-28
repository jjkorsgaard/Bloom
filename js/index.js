// Based on an example:
//https://github.com/don/cordova-plugin-ble-central

//Funktion til konvertering fra bytes til streng
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

//Funktion til konvertering fra streng til bytes
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

//Bluefruit UART Service
var blue ={
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

var ConnDeviceId;
var deviceList =[];
 
function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
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
		ble.connect('FB:4E:50:F6:53:97', onConnect, onConnError); //Forbinder til BLE-enheds MAC-adresse
		document.getElementById("bleDeviceList").innerHTML = "LOKALE: BK04"; //Printer streng i app
		showFunctions(); //Kører funktion showFunctions();		
	}
}

 //Forbindelse oprettet
function onConnect(){
	document.getElementById("statusDiv").innerHTML = " Status: Forbundet";
	//Notificerer om ændring på bluetooth-enhed
	ble.startNotification('FB:4E:50:F6:53:97', blue.serviceUUID, blue.rxCharacteristic, onData, onError);
}

//Forbindelse ikke oprettet
function onConnError(){
	alert("Problem med at forbinde");
	document.getElementById("x").innerHTML = " Status: Ikke forbundet";
}

 function onData(data){ //Data modtaget fra Arduino
	//Funktionen bytesToString() omdanner variablen 'data' fra bytes til en streng
	document.getElementById("receiveDiv").innerHTML =  "&#127777; " + bytesToString(data) + "<br/>";
}

function data(txt){
	messageInput.value = txt;
	//Indholdet af messageInput.value omdannes til bytes
	var data = stringToBytes(messageInput.value);
	//Data sendes til BLE-enhed som bytes
	ble.writeWithoutResponse('FB:4E:50:F6:53:97', blue.serviceUUID, blue.txCharacteristic, data);
}	

function sendData() { //Send data til Arduino
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

//Funktion til visning af fejl
function onError(reason)  {
	alert("ERROR: " + reason);
}

function showFunctions() {
	document.getElementById("functions").style.display = "block"; //Ændrer 'display' for ID 'functions' i CSS-koden 'none' til 'block', så appens funktioner vises (normalt skjult)
}

function cleaningLog(){
	var url='https://cleaninglog.000webhostapp.com/index.html';	//Variabel med URL på rengøringslog
	openBrowser(url); //Kører funktion openBrowser() med indholdet af variablen 'url'
}

function manuals(){
	var url='https://manuals.000webhostapp.com/index.html'; //Variabel med URL på vejledninger
	openBrowser(url); //Kører funktion openBrowser() med indholdet af variablen 'url'
}

function openBrowser(url) {
   var target = '_blank';
   var options = "location=no" //Addressefelt udelades i in app browser
   var ref = cordova.InAppBrowser.open(url, target, options); //Åbner URL i in app browser
}
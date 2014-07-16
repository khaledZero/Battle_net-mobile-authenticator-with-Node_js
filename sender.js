var Http = require('http');
var big = require('./myBigInteger');
var index = require('./index');

var dataReceived;
exports.dataReceived = dataReceived;
function sendAndreceive(data) {
	// connexion au serveur
	
	//avec proxy 
	/*
	var options = {
		//proxy
		host : "proxya.u-pec.fr",
		port : 3128,
		path : 'http://m.eu.mobileservice.blizzard.com/enrollment/enroll.htm',
		method : 'POST',
		headers : {
			Host : "http://m.eu.mobileservice.blizzard.com"
		}
	};*/
	//sans proxy
	
	var options = {
		hostname : 'm.eu.mobileservice.blizzard.com',
		port : 80,
		path : '/enrollment/enroll.htm',
		method : 'POST'
	};
	
	var req = Http.request(options, callback);

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	req.write(data);
	req.end();
}

exports.sendAndreceive = sendAndreceive;

function callback(res) {
	res.on('data', decoder);
}

function decoder(chunk) {
	//reponse du serveur
	dataReceived = new Buffer(chunk);
	console.log('length of data received: ' + dataReceived.length);
	
	var xorkey = index.key;
	var time = 0, serial;
	var i;
	console.log("otp key: "+xorkey);
	for ( i = 0; i < 8; i++)
		time = (time << 8) | dataReceived[i];
	/*
	var dataToXor = dataReceived.slice(8, 45);
	dataToXor = big.xor(big.bigOfbuf(dataToXor),big.bigOfbuf(xorkey));
	dataToXor = new Buffer(big.bigTobyteArray(dataToXor));
	*/
	for ( i = 8; i < 45; i++)
		dataReceived[i] ^= xorkey[i - 8]; //=dataToXor[i - 8]

	secret = big.bufferToHex(dataReceived.slice(8, 28));
	
	serial = dataReceived.slice(28, 45).toString('utf8');
	
	console.log("Authenticator : \nsecret = " + secret + "\nserial = " + serial + "\ntime = " + time);
	
	console.log('##################################### END ####################################');

}

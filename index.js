var otp = require("./otp");
var rsa = require('./rsa');
var big = require('./myBigInteger');
var client = require('./sender');

console.log('##################################### START ####################################');
//générer la clé de 37 octets
var key = otp.oneTimePad(37);
console.log('otp key :'+key);
exports.key = key;

//creer le paquet a envoyer de 56 octets
console.log('Creation du buffer a envoyer...');
var buftosend = otp.createBufToserver(key);

//crypter
console.log('Cryptage du paquet...'); 
var enc =rsa.encrypt(buftosend);
console.log('length of data encrypted: '+enc.length);

console.log('Conversion en Bytes...');
var bytes = big.bigTobyteArray(enc);

var bufenc = new Buffer(bytes);
console.log('length data to send:'+bufenc.length);

//envoyer le paquet au seveur blizzard.com
console.log('Envoi du paquet...');
client.sendAndreceive(bufenc);






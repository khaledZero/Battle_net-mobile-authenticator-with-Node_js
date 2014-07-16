var BI = require('./MyBigInteger');
var RSA_MOD = BI.BigInt('10489001880798655687400771091420544315703015966803419718612567896028747089429'+
				'08305306182849431184051108963228354490994332320931511682501521460233193264915876'+
				'516852527748203409959507440756654556817606521365764930287339148921667008991098362'+
				'91180881063097461175643998356321993663868233366705340758102567742483097');
var RSA_KEY =BI.BigInt('257');


function encrypt(m) {
	//console.log('length of module:'+RSA_MOD.length);
	//console.log('length of message:'+m.length);	
	var enc_buf = new Array();
	m = BI.bigOfbuf(m);	
	//console.log('m = '+m);
    var enc_buf = modpow(m, RSA_KEY, RSA_MOD);		
	//console.log('buf_enc = '+enc_buf);
	return enc_buf;
}
exports.encrypt =encrypt;

//a^n % module   Node.js
function modpow(a,n, module){
	var x;
	if( BI.equals(a, BI.BigInt('1'))) return a;
	if(BI.equalsZero(a)) return a;
	if(BI.equalsZero(n)) return BI.BigInt('1');
	if(BI.pair(n)){
		x= modpow(a, (BI.divide(n, BI.BigInt('2'))),module);
		return BI.mod(BI.multiply(x,x), module);
	}else{				
		x= modpow(a, BI.divide(BI.subs(n, BI.BigInt(1) ), BI.BigInt('2')),module);
		return BI.mod(BI.multiply(BI.multiply(x,x), a), module);
	}	
}
exports.modpow=modpow;


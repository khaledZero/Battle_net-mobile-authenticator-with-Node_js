

function oneTimePad(n){
	var reslt = new Buffer(n);
	for (var i=0; i < n; i++) {	  
	  reslt[i] = 0;//Math.floor(Math.random()*255);	  
	}	
	return reslt;
}

//buffer a envoyer au server [[1][encryption key (otp)][region code][mobile model]]
function createBufToserver(otp){
	var buf = new Buffer(56);
	buf[0] = 1;
	for (var i=0; i < otp.length; i++) {
	  buf[i+1]=otp[i];
	}
	var region = new Buffer('EU');
	var mobile = new Buffer('Motorola RAZR v3');
	for (var i=0; i < region.length; i++) {
	  buf[i+38]=region[i];
	  //console.log("buf["+(i+38)+"]= "+buf[i+38]);
	}
	for (var i=0; i < mobile.length; i++) {
	  buf[i+40]=mobile[i];
	  //console.log("buf["+(i+40)+"]= "+buf[i+40]);
	}
	return buf;		
} 
exports.createBufToserver =createBufToserver;
exports.oneTimePad = oneTimePad;

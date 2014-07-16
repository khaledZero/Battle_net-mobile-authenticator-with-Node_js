

//creer un bigInt ex 5416546546 => [5,4,1,6,5,4,6,5,4,6]
function BigInt(nbr) {
	if ( typeof nbr == 'number') {
		nbr = nbr.toString();
	}
	nbr = nbr.replace(' ', '');
	var tab = new Array();
	for (var i = 0; i < nbr.length; i++) {
		tab[i] = parseInt(nbr.charAt(i));
	}
	return tab;
}
exports.BigInt = BigInt;

function strOfBigInt(big){
	var str ='';
	for (var i=0; i < big.length; i++) {
	  str += big[i].toString();
	}
	return str;
}
exports.strOfBigInt=strOfBigInt;
//[10,500,415, 20] => [1,0,5,0,0,4,1,5,2,0]
function bigOfbuf(buf){
	var buffertohexa = bufferToHex(buf);	
	return hexaToBig(buffertohexa);
}
exports.bigOfbuf=bigOfbuf;

function cmp(){
	alert('salut ailou');
}
//decalage a droite du tableau ex [1,9,3,8,5] n=3 => [0,0,0,1,9,3,8,5]
function shiftRight(big, n) {
	var bigBis = new Array();
	for (var i = 0; i < n; i++) {
		bigBis[i] = 0;
	}
	for (var i = n; i < (n + big.length); i++) {
		bigBis[i] = big[i - n];
	}

	return bigBis;

}

function shiftLeft(big, n) {
	for (var i = 0; i < n; i++) {
		big.push(0);
	}
	return big;
}

function reverse(big) {
	var bigBis = new Array();

	for (var i = 0, j = (big.length - 1); i < big.length; i++, j--) {
		bigBis[i] = big[j];
	}
	return bigBis;
}

function add(big1, big2) {
	//mettre les tableaux en meme taille
	if (big1.length < big2.length)
		big1 = shiftRight(big1, (big2.length - big1.length));
	else if (big1.length > big2.length)
		big2 = shiftRight(big2, (big1.length - big2.length));
	//faire l'addition
	var reslt = new Array();
	var retenue = 0;
	var res;
	for (var i = (big1.length - 1), j = 0; i >= 0; i--, j++) {
		res = retenue + big1[i] + big2[i];
		if (res > 9) {
			retenue = 1;
			reslt[j] = res - 10;
		} else {
			retenue = 0;
			reslt[j] = res;
		}
	}
	if (retenue == 1)
		reslt.push(retenue);
	reslt = reverse(reslt);

	return reslt;
}

/////Mulitiplication

//multiplyWhithInt([1,2], 2, 3) => [2,4,0,0,0]
function multiplyWhithInt(big, n, offset) {
	var reslt = new Array();
	var retenue = 0;
	var res;
	for (var i = (big.length - 1), j = 0; i >= 0; i--, j++) {
		res = (n * big[i] ) + retenue;
		if (res > 9) {
			retenue = parseInt(res / 10);
			reslt[j] = res % 10;
		} else {
			retenue = 0;
			reslt[j] = res;
		}
	}
	if (retenue > 0)
		reslt.push(retenue);
	reslt = shiftRight(reslt, offset);
	reslt = reverse(reslt);
	return reslt;
}

//equalsZero([0]) => true, equalsZero([0,0,0]) => true ,  equalsZero([0,5,0]) => false
function equalsZero(big) {
	var i = 0;
	while (i < big.length) {
		if (big[i] != 0) {
			return false;
		}
		i++;
	}
	return true;
}
exports.equalsZero =equalsZero;
//compress([0,0,1,9]) => [1,9]
function compress(big) {
	if (equalsZero(big))
		return BigInt(0);
	//[0]
	var res = new Array();
	var i = 0;
	while (big[i] === 0) {
		i++;
	}
	for (var j = 0; j < (big.length - i); j++) {
		res[j] = big[j + i];
	}
	return res;
}

//multiply([5,5,5],[3]) => [1,6,6,5]
function multiply(big1, big2) {
	var reslt = BigInt(0);
	var decalage = 0;
	if (big1.length < big2.length) {
		for (var i = (big1.length - 1); i >= 0; i--) {
			reslt = add(reslt, multiplyWhithInt(big2, big1[i], decalage));
			decalage++;
		}
	} else {
		for (var i = (big2.length - 1); i >= 0; i--) {
			reslt = add(reslt, multiplyWhithInt(big1, big2[i], decalage));
			decalage++;
		}
	}
	reslt = compress(reslt);
	return reslt;
}
exports.multiply=multiply;
//decrementer un bigint
function dec(big) {
	if (equalsZero(big))
		throw 'big is equals 0! can not dec it';
	else {
		var len = big.length;
		while (big[len - 1] == 0) {
			big[len - 1] = 9;
			len--;
		}
		big[len - 1] = big[len - 1] - 1;
	}
	return compress(big);
}

//exponentielle algo naif
function pow(big, bigexp) {
	if(equals(bigexp, BigInt(0))) return BigInt(1);
	if(equals(bigexp, BigInt(1))) return big;
	var reslt = big;
	bigexp = dec(bigexp);
	//parce qu'on commence de 0
	do {
		reslt = multiply(reslt, big);
		bigexp = dec(bigexp);
	} while(!equalsZero(bigexp));
	return reslt;
}

// si big1 > big2 => true else false
function sup(big1, big2) {
	big1 = compress(big1);
	big2 = compress(big2);
	var len1 = big1.length;
	var len2 = big2.length;
	if (len1 > len2) {
		return true;
	} else if (len2 > len1) {
		return false;
	} else {
		for (var i = 0; i < len1; i++) {
			if (big1[i] > big2[i]) {
				return true;
			} else if (big2[i] > big1[i]) {
				return false;
			}
		}
		return false;
	}

}
exports.sup = sup;
// si big1 == big2 => true else false
function equals(big1, big2) {
	big1 = compress(big1);
	big2 = compress(big2);
	var len1 = big1.length;
	var len2 = big2.length;
	if ((len1 > len2) || (len2 > len1)) {
		return false;
	} else {
		for (var i = 0; i < len1; i++) {
			if (big1[i] != big2[i]) {
				return false;
			}
		}
		return true;
	}
}
exports.equals = equals;
//decalage a droite binaire [1,2,3] => [2,4,6]
function shiftLeftBin(big, n) {
	if(n==0) return big;
	for (var i = 1; i <= n; i++) {
		big = multiply(big, BigInt('2'));
	}
	return big;
}

//decalage à gauche binaire [1,2,3] => [6,1]
function shiftRigthBin(big, n) {
	if(n==0) return big;
	for (var j = 0; j < n; j++) {
		var reslt = new Array();
		var rest = 0;
		var d = big[0];
		var i = 1;
		if (d < 2) {
			if (big.length > 1) {
				d = (big[0] * 10) + big[1];
				i++;
			}
		}
		reslt.push(Math.floor(d / 2));
		rest = d % 2;
		for ( i = i; i < big.length; i++) {
			d = ((rest * 10) + big[i]);
			if (d < 2) {
				reslt.push(0);
				rest = d;
			} else {
				reslt.push(Math.floor(d / 2));
				rest = d % 2;
			}
		}
		big = reslt;
	}
	return reslt;
}
exports.shiftRigthBin=shiftRigthBin;

//soustraction (avec valeur absolue !!)
function subs(big1, big2) {
	//rendre les array de même taille
	if (big1.length < big2.length)
		big1 = shiftRight(big1, (big2.length - big1.length));
	else if (big2.length < big1.length)
		big2 = shiftRight(big2, (big1.length - big2.length));
	//Soustraction
	var reslt = new Array();
	var retenue = 0;
	var res;
	if(sup(big1,big2) || equals(big1,big2)){
		for (var i = (big1.length - 1), j = 0; i >= 0; i--, j++) {
			res = (big1[i] - (big2[i] + retenue));
			if (res < 0) {
				retenue = 1;
				reslt[j] = 10 + res; 
			} else {
				reslt[j] = res;
				retenue = 0;
			}
		}
		reslt = reverse(reslt);				
	} else {
		var reslt = subs(big2, big1);
	}
	return compress(reslt);
}
exports.subs = subs;
//convertir un big décimal en binaire ex [1,2,3] => [1,1,1,1,0,1,1]
function convertToBin(big) {
	var res = new Array();
	var reste = 0;
	var q = big;
	var d = BigInt(2);
	while(!equals(q, BigInt(0))) {
		q = shiftRigthBin(big, 1);
		reste = subs(big, multiply(q, d));
		big = q;
		res.push(compress(reste));
	} 
	return reverse(res);
}

//ou exclusif
function or (big1, big2) {
	big1 = convertToBin(big1);
	big2 = convertToBin(big2);
	if(big1.length > big2.length){
		big2 = shiftRight(big2, (big1.length - big2.length));
	}else if(big1.length < big2.length){
		big1 = shiftRight(big1, (big2.length - big1.length));
	}
	for (var i=0; i < big1.length; i++) {
	  big1[i] = big1[i] | big2[i];
	}
	big1 = compress(big1);
 	return convertToDecimal(big1);
}
//&
function et(big1, big2) {
	big1 = convertToBin(big1);
	big2 = convertToBin(big2);
	if(big1.length > big2.length){
		big2 = shiftRight(big2, (big1.length - big2.length));
	}else if(big1.length < big2.length){
		big1 = shiftRight(big1, (big2.length - big1.length));
	}
	for (var i=0; i < big1.length; i++) {
	  big1[i] = big1[i] & big2[i];
	}
	big1 = compress(big1);
 	return convertToDecimal(big1);
}
exports.et=et;
//version de Aliou 
function convertToDecimal(big){
	big = reverse(big);
	var res, s,x;
	for (var i=0; i < big.length; i++) {
	  if(i == 0){
	  	x = BigInt(big[i].toString());
	  	res = multiply(x, BigInt(1)); 
	  }
	  if(i == 1){
	  	x = BigInt(big[i].toString());	  	
	  	res = add(res , multiply(x, BigInt(2)));
	  }
	  else if(i >1 ){
	  	s = shiftLeftBin(BigInt(2), (i-1));
	  	x = BigInt(big[i].toString());
	  	res = add(res , multiply(x, s));
	  }	  			  
	}
	
	return res;	
}


function divide(big1, big2){
	return euclide(big1, big2)[0];
}
exports.divide =divide;

function mod (big1,big2) {
  return euclide(big1, big2)[1];
}
exports.mod=mod;
// => x^n
function bigExpo(x,n)  {
	var tmp;
	if(equalsZero(n))
		return BigInt(1);
	else
		if(equals(n,BigInt(1)))
			return x;
		else{
			tmp = bigExpo(x, divide(n,BigInt(2)));
			r = mod(n,BigInt(2));
			if(equalsZero(r)) 
				return multiply(tmp,tmp);
			else
				return multiply(x,multiply(tmp,tmp));
		}
}
exports.bigExpo = bigExpo;
function pair(big){
	var bin = convertToBin(big);
	if(bin[bin.length-1] == 1) return false;
	else return true;
}
exports.pair = pair;



function fact(big){
    if(sup(big,BigInt('1'))) return multiply(big,fact(subs(big,BigInt('1') )));
	else return BigInt('1');
}
exports.fact=fact;

//euclide algo source: http://compoasso.free.fr/primelistweb/ressource/EuclideBinaire.java
function euclide( a,  b) {

		var r = a;
		var q = BigInt(0);
		var n = 0;
		var aux = b;

		while (sup(a, aux) || equals(a, aux)) { 
			aux = shiftLeftBin(aux, 1);
			n++;
		}

		while (n > 0) {
			aux = shiftRigthBin(aux, 1);
			n--;
			q = shiftLeftBin(q, 1);
			if (sup(r, aux) || equals(r, aux)) {
				r = subs(r , aux);
				q= add(q, BigInt(1));
			}
		}
		var euclide = new Array( q, r );
		return euclide;
}

exports.euclide = euclide;


//ou exclusif
function xor (big1, big2) {
    big1 = convertToBin(big1);
	big2 = convertToBin(big2);
	if(big1.length > big2.length){
		big2 = shiftRight(big2, (big1.length - big2.length));
	}else if(big1.length < big2.length){
		big1 = shiftRight(big1, (big2.length - big1.length));
	}
	for (var i=0; i < big1.length; i++) {
	  big1[i] = big1[i] ^ big2[i];
	}
	big1 = compress(big1);
 	return convertToDecimal(big1);
}
exports.xor =xor;

function bigTobyteArray(big){
	var a = new Array();
	var n, i = 0;
	while(! equalsZero(big)){
		n = euclide(big, BigInt('256'));
		a[i] = parseInt(strOfBigInt(n[1]));
		big = n[0];
		i++;
	}
	return reverse(a);	
}
exports.bigTobyteArray=bigTobyteArray;

// bigToHexa algo source: http://introcs.cs.princeton.edu/java/31datatype/Hex2Decimal.java.html

function bigToHexa(d) {
        var digits = "0123456789ABCDEF";
        if (equalsZero(d)) return "0";
        var hex = "";
        var bis;
        while (sup(d, BigInt('0'))) {
        	bis = euclide(d, BigInt('16'));
            var digit = bis[1];// rightmost digit
            hex = digits.charAt(parseInt(strOfBigInt(digit))) + hex;  // string concatenation
            d = bis[0];
        }
        return hex;
}
exports.bigToHexa=bigToHexa;




function hexToBuffer(hex) {
	if (hex.length % 2 == 1) hex = "0" + hex;
	var b = new Buffer(hex.length >>> 1);
	for (var i = 0, c = 0; c < hex.length; c += 2, i++)
		b[i] = parseInt(hex.substr(c, 2), 16);
	return b;
}
exports.hexToBuffer= hexToBuffer;

// Convert a byte array tp a hex string
function bufferToHex(bytes) {
	for (var hex = [], i = 0; i < bytes.length; i++) {
		hex.push((bytes[i] >>> 4).toString(16));
		hex.push((bytes[i] & 0xF).toString(16));
	}
	return hex.join("");
}
exports.bufferToHex = bufferToHex;
function hexaToBig(str){
	var i = str.length - 1;
	var big= BigInt(0);
	while(i >=0){
		//big = big + (str[i] * 16^i)
		big = add(big, multiply(BigInt(parseInt(str[i],16)), pow(BigInt(16), BigInt(i))));
		i--;		
	}
	return big;
}
exports.hexaToBig = hexaToBig;







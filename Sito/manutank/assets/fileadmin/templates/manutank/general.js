<!-- JS per menu -->
  

<!--
// ********************** TRIM **************************************
String.prototype.ltrim = function () { return this.replace(/^\s*/, "");}
String.prototype.rtrim = function () { return this.replace(/\s*$/, "");}
String.prototype.trim  = function () { return this.ltrim().rtrim(); }
// ******************************************************************


var strTickboxSuccessiva  	= "Successiva";
var strTickboxPrecedente  	= "Precedente";
var strTickboxChiudi   		= "Chiudi";
var strTickboxImmagine   	= "Immagine";
var strTickboxDi     		= "di";

var strIsDateOne     		= "La data inserita non è nel formato corretto.";
var strIsDateTwo     		= "Il mese deve essere compreso tra 1 e 12.";
var strIsDateThree     		= "Il giorno deve essere compreso tra 1 e 31.";
var strIsDateFour     		= "Il mese non ha 31 giorni!";
var strIsDateFive     		= "Febbraio non ha così tanti giorni!";

var strIsEmailValid   		= "eMail non è in un formato valido";



// *********** CONTROLLO DI VALIDITA DI UN CAMPO DATA ***************
function isDate(dateStr)
{
	var result = checkDate(dateStr);

	if (result == 1) {alert(strIsDateOne);return false;}
	if (result == 2) {alert(strIsDateTwo);return false;}
	if (result == 3) {alert(strIsDateThree);return false;}
	if (result == 4) {alert(strIsDateFour);return false;}
	if (result == 5) {alert(strIsDateFive);return false;}

	return true;
}


function checkDate(dateStr)
{
	/* Valori ritornati:
		0 -> OK
		1 -> La data inserita non è nel formato corretto.
		2 -> Il mese deve essere compreso tra 1 e 12.
		3 -> Il giorno deve essere compreso tra 1 e 31.
		4 -> Il mese non ha 31 giorni!
		5 -> Febbraio non ha così tanti giorni!
	*/

	//var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	var datePat = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
	var matchArray = dateStr.match(datePat); // is the format ok?

	if (matchArray == null) {
		return 1;
	}

	day = matchArray[1]; // p@rse date into variables
	month = matchArray[3];
	year = matchArray[5];

	if (month < 1 || month > 12) { // check month range
		return 2;
	}

	if (day < 1 || day > 31) {
		return 3;
	}

	if ((month==4 || month==6 || month==9 || month==11) && day==31) {
		return 4;
	}

	if (month == 2) { // check for february 29th
		var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
		if (day > 29 || (day==29 && !isleap)) {
			return 5;
		}
	}
	return 0; // date is valid
}
// ******************************************************************

// *********** CONTROLLO DI VALIDITA DI UN CAMPO MAIL ***************
function isEmailValid(checkThisEmail) {
	var result = checkEmailValid(checkThisEmail);

	if (result == 1) {alert(strIsEmailValid);return false;}

	return true;
}

function checkEmailValid(checkThisEmail) {
	/* Valori ritornati:
		0 -> OK
		1 -> KO
	*/

	var emailPat=/^(.+)@(.+)$/
	var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]"
	var validChars="\[^\\s" + specialChars + "\]"
	var quotedUser="(\"[^\"]*\")"
	var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/
	var atom=validChars + '+'
	var word="(" + atom + "|" + quotedUser + ")"
	var userPat=new RegExp("^" + word + "(\\." + word + ")*$")
	var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$")
	var matchArray=checkThisEmail.match(emailPat)
	if (matchArray==null) {
		return 1;
	}
	var user=matchArray[1]
	var domain=matchArray[2]
	if (user.match(userPat)==null) {
	    return 1;
	}
	var IPArray=domain.match(ipDomainPat)
	if (IPArray!=null) {
		  for (var i=1;i<=4;i++) {
		    if (IPArray[i]>255) {
		        return 1;
		    }
	    }
	    return 0;
	}
	var domainArray=domain.match(domainPat)
	if (domainArray==null) {
		return 1;
	}
	var atomPat=new RegExp(atom,"g")
	var domArr=domain.match(atomPat)
	var len=domArr.length
	if (domArr[domArr.length-1].length<2 ||
	    domArr[domArr.length-1].length>4) {
		   return 1;
	}
	if (len<2) {
	   return 1;
	}
	return 0;
}
// ******************************************************************

// ************** RIPRISTINA BACKGROUNDCOLOR DI UN CAMPO ************
function cln(e,c) {
	document.getElementById(e).style.backgroundColor = c;
}
// ******************************************************************

// ******************************************************************
function roundDownNumber(numberField,rlength) {
	var newnumber = Math.round(numberField*Math.pow(10,rlength)-0.1)/Math.pow(10,rlength);
	return newnumber;
}

function roundUpNumber(numberField,rlength) {
	var newnumber = Math.round(numberField*Math.pow(10,rlength)+0.1)/Math.pow(10,rlength);
	return newnumber;
}

function roundNumber(numberField,rlength) {
	var newnumber = Math.round(numberField*Math.pow(10,rlength))/Math.pow(10,rlength);
	return newnumber;
}

function formatCurrency(num) {
	num = num.toString().replace(/\€|\,/g,'');
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	cents = num%100;
	num = Math.floor(num/100).toString();
	if(cents<10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + '' + num + ',' + cents);
}

function isNumber(val) {
	var Segno = '';

	if (val.trim() == '') {return(false);}

	// tolgo un eventuale segno meno
	if (val.indexOf('-') == 0) {Segno = '-'; val = val.substr(1);}

	// se contiene qualche lettera alora non è valido
	if (!checkValidChars(val)) {return(false);}

	var arParti = val.split(',');

	// se c'è più di una virgola allora non è valido
	if (arParti.length > 2) {return(false);}

	var Intero = arParti[0];
	var Decimale = arParti[1];

	if (Decimale)
	{
		// la parte decimale deve contenere solo numeri
		if (!checkDigit(Decimale)) {return(false);}
	}
	else
	{
		// se ho messo la virgola ma non ho messo decimali allora non è valido
		if (val.indexOf(',') >= 0) {return(false);}
	}

	if (Intero)
	{
		// se la parte intera contiene almeno un punto allora devo fare ulteriori verifiche
		// altrimenti va bene così
		if (Intero.indexOf('.') >= 0)
		{
			var arPezziDiIntero = Intero.split('.');
			for (i = 0; i < arPezziDiIntero.length; i++)
			{
				var Pezzo = arPezziDiIntero[i];
				if (i == 0)
				{
					if (Pezzo.length > 3 || Pezzo.length == 0) {return(false);}
				}
				else
				{
					if (Pezzo.length != 3) {return(false);}
				}
			}
		}
	}
	else
	{
		return(false);
	}

	return(true);
}

function checkValidChars(val) {
	var nums = "0123456789,.-";
	if (val.length==0)return(false);
	for (var n=0; n < val.length; n++){
		if(nums.indexOf(val.charAt(n))==-1) {return(false);}
	}
	return(true);
}

function checkDigit(val) {
	var nums = "0123456789";
	if (val.length==0)return(false);
	for (var n=0; n < val.length; n++){
		if(nums.indexOf(val.charAt(n))==-1) {return(false);}
	}
	return(true);
}
// ******************************************************************


// ******** FUNZIONE CHE FA APPARIRE E SCOMPARIRE LIVELLI ***********

function dettagli(txt,txt2,n,numeroTag) {

	for (i=1; i<=6; i++) {
		if (document.getElementById(txt+i) != undefined) {
			document.getElementById(txt+i).style.display='none';
		}
	}

	for (i=1; i<6; i++) {
		if (document.getElementById(txt2+i) != undefined) {
				document.getElementById(txt2+i).className='inattivo';
		}
	}

	document.getElementById(txt+n).style.display='block';
	document.getElementById(txt2+n).className='attivo';
}

// ******************************************************************

function leggiDettagli(imgApre, divDettagli)
{
	var objdivDettagli;
	var objimgApre;


	objdivDettagli=document.getElementById(divDettagli);
	objimgApre=document.getElementById(imgApre);

	if (objimgApre)
	{
		if (objimgApre.style.backgroundImage == "url(/Img/ico_chiudiDett.gif)")
		{
			objimgApre.style.backgroundImage = "url(/Img/ico_apriDett.gif)";
		}
		else
		{
			objimgApre.style.backgroundImage = "url(/Img/ico_chiudiDett.gif)";
		}
	}
	if (objdivDettagli)
	{
		if (objdivDettagli.style.display == "none")
		{
			objdivDettagli.style.display = "block";
		}
		else
		{
			objdivDettagli.style.display = "none";
		}
	}

	return;
}


function leggiDettagli2(imgApre, divDettagli)
{
	var objdivDettagli2;
	var objimgApre2;


	objdivDettagli2=document.getElementById(divDettagli);
	objimgApre2=document.getElementById(imgApre);

	if (objimgApre2)
	{
		if (objimgApre2.style.backgroundImage == "url(/Img/ico_chiudiDettgrigio.gif)")
		{
			objimgApre2.style.backgroundImage = "url(/Img/ico_apriDettgrigio.gif)";
		}
		else
		{
			objimgApre2.style.backgroundImage = "url(/Img/ico_chiudiDettgrigio.gif)";
		}
	}
	if (objdivDettagli2)
	{
		if (objdivDettagli2.style.display == "none")
		{
			objdivDettagli2.style.display = "block";
		}
		else
		{
			objdivDettagli2.style.display = "none";
		}
	}

	return;
}

// **************************** AJAX ********************************

// funzione per prendere un elemento con id univoco

function prendiElementoDaId(id_elemento) {
	var elemento;
	if(document.getElementById)
		elemento = document.getElementById(id_elemento);
	else
		elemento = document.all[id_elemento];
	return elemento;
};

// funzione per assegnare un oggetto XMLHttpRequest
function assegnaXMLHttpRequest() {
	var
		XHR = null,
		browserUtente = navigator.userAgent.toUpperCase();
	if(typeof(XMLHttpRequest) === "function" || typeof(XMLHttpRequest) === "object")
		XHR = new XMLHttpRequest();
	else if(window.ActiveXObject && browserUtente.indexOf("MSIE 4") < 0) {
		if(browserUtente.indexOf("MSIE 5") < 0)
			XHR = new ActiveXObject("Msxml2.XMLHTTP");
		else
			XHR = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return XHR;
};


// oggetto di verifica stato
var readyState = {
	INATTIVO:		0,
	INIZIALIZZATO:	1,
	RICHIESTA:		2,
	RISPOSTA:		3,
	COMPLETATO:		4
};

// array descrittivo dei codici restituiti dal server
// [la scelta dell' array è per evitare problemi con vecchi browsers]
var statusText = new Array();
statusText[100] = "Continue";
statusText[101] = "Switching Protocols";
statusText[200] = "OK";
statusText[201] = "Created";
statusText[202] = "Accepted";
statusText[203] = "Non-Authoritative Information";
statusText[204] = "No Content";
statusText[205] = "Reset Content";
statusText[206] = "Partial Content";
statusText[300] = "Multiple Choices";
statusText[301] = "Moved Permanently";
statusText[302] = "Found";
statusText[303] = "See Other";
statusText[304] = "Not Modified";
statusText[305] = "Use Proxy";
statusText[306] = "(unused, but reserved)";
statusText[307] = "Temporary Redirect";
statusText[400] = "Bad Request";
statusText[401] = "Unauthorized";
statusText[402] = "Payment Required";
statusText[403] = "Forbidden";
statusText[404] = "Not Found";
statusText[405] = "Method Not Allowed";
statusText[406] = "Not Acceptable";
statusText[407] = "Proxy Authentication Required";
statusText[408] = "Request Timeout";
statusText[409] = "Conflict";
statusText[410] = "Gone";
statusText[411] = "Length Required";
statusText[412] = "Precondition Failed";
statusText[413] = "Request Entity Too Large";
statusText[414] = "Request-URI Too Long";
statusText[415] = "Unsupported Media Type";
statusText[416] = "Requested Range Not Satisfiable";
statusText[417] = "Expectation Failed";
statusText[500] = "Internal Server Error";
statusText[501] = "Not Implemented";
statusText[502] = "Bad Gateway";
statusText[503] = "Service Unavailable";
statusText[504] = "Gateway Timeout";
statusText[505] = "HTTP Version Not Supported";
statusText[509] = "Bandwidth Limit Exceeded";

var massimaAttesa = 5;  // in secondi
var ajax = assegnaXMLHttpRequest();
var ajaxMessage = '';


function callAjax(link, messageElement, messageContent, errorMessage, successMessage)
{
	var usaLink	= true;
	var dataChiamata = new Date();
	var inizioChiamata = dataChiamata.getTime();

	document.body.style.cursor = 'wait';

	if (ajax)
	{
		if (ajax.readyState !== readyState.INATTIVO)
		{
			ajax.onreadystatechange = function() {return;}
			ajax.abort();
		}

		ajax.open("get",link,true);
		ajax.setRequestHeader("connection","close");

		ajax.onreadystatechange = function()
		{
			if (ajax.readyState === readyState.COMPLETATO)
			{
				verificaTempoTrascorso = function(){};

				if (statusText[ajax.status] === "OK")
				{
					document.body.style.cursor = 'default';
					if (document.getElementById('boxCarrelloQta'))
						document.getElementById('boxCarrelloQta').innerHTML = parseInt(document.getElementById('boxCarrelloQta').innerHTML) + 1
					messageElement.style.display = 'block';
					messageContent.innerHTML = ajax.responseText;
				}
				else
				{
					document.body.style.cursor = 'default';
					messageElement.style.display = 'block';
					messageContent.innerHTML = errorMessage;
				}
			}
			else if (massimaAttesa < 1000)
			{
				massimaAttesa = massimaAttesa * 1000;
				verificaTempoTrascorso = function()
				{
					dataChiamata = new Date();

					if ((dataChiamata.getTime() - inizioChiamata) > massimaAttesa)
					{
						document.body.style.cursor = 'default';
						messageElement.style.display = 'block';
						messageContent.innerHTML = errorMessage;

						ajax.onreadystatechange = function() {return;}
						ajax.abort();
					}
					else
						setTimeout(verificaTempoTrascorso, 100);
				}

				verificaTempoTrascorso();
			}
		}

		ajax.send(null);
	}
}

function inserisciNelCarrello(codiceProdotto)
{
	massimaAttesa = 5;  // in secondi
	var elemento = prendiElementoDaId("elemento-dinamico");
	var contenuto = prendiElementoDaId("contenuto-dinamico");

	if (ajax)
	{
		var link = '/EndUser/carrello/insert.asp?ajax=1&codice=' + codiceProdotto + '&random=' + Math.random().toString();
		callAjax(link, elemento, contenuto, "", "");
	}
	else
	{
		document.location.href = '/EndUser/carrello/insert.asp?ajax=0&codice=' + codiceProdotto + '&random=' + Math.random().toString();
	}
}

function inserisciBundleNelCarrello(IDBundle)
{
	massimaAttesa = 5;  // in secondi
	var elemento = prendiElementoDaId("elemento-dinamico");
	var contenuto = prendiElementoDaId("contenuto-dinamico");

	if (ajax)
	{
		var link = '/EndUser/carrello/insertBundle.asp?ajax=1&IDBundle=' + IDBundle + '&random=' + Math.random().toString();
		callAjax(link, elemento, contenuto, "", "");
	}
	else
	{
		document.location.href = '/EndUser/carrello/insertBundle.asp?ajax=0&IDBundle=' + IDBundle + '&random=' + Math.random().toString();
	}
}

function chiudiAjaxPopUp()
{
	var elemento = prendiElementoDaId("elemento-dinamico");
	elemento.style.display = 'none';
}



function addRemCodice(codice,check)
{
	var lista = document.formModelloUp.codiciDaConfrontare.value;
	if (check)
	{
		if (lista.length == 0)
		{
			lista = codice;
		}
		else
		{
			lista = lista + ',' + codice;
		}
	}
	else
	{
		lista = lista.replace(',' + codice , '');
		lista = lista.replace(codice + ',' , '');
		lista = lista.replace(codice , '');
	}

	document.formModelloUp.codiciDaConfrontare.value = lista;

	var lista = document.formModelloDown.codiciDaConfrontare.value;
	if (check)
	{
		if (lista.length == 0)
		{
			lista = codice;
		}
		else
		{
			lista = lista + ',' + codice;
		}
	}
	else
	{
		lista = lista.replace(',' + codice , '');
		lista = lista.replace(codice + ',' , '');
		lista = lista.replace(codice , '');
	}

	document.formModelloDown.codiciDaConfrontare.value = lista;


}

function confronta()
{
	var lista = document.formModelloUp.codiciDaConfrontare.value;
	arLista = lista.split(',');
	if (arLista.length > 3)
	{
		alert("E' possibile confrontare al massimo 3 articoli.");
	}
	else if (arLista.length < 2)
	{
		alert("E' necessario selezionare almeno 2 articoli.");
	}
	else
	{
		document.formModelloUp.action = '/EndUser/Ricerche/stepConfronta.asp';
		document.formModelloUp.submit();
	}
}




// ******************************************************************



function check_testo(oForm) {

  if (oForm.TXTRicerca.value.length < 2 )
  {
	    oForm.TXTRicerca.value="" ;
	    return (false);
  }

      if (oForm.TXTRicerca.value.length > 100 )
  {
	    alert("");
	    return (false);
  }

  return (true);
}

function commitFlashObject(_obj, _container){
	var _output=_paramoutput=_src=_ver="";
	for(var _cO in _obj){
		_output+=_cO+"=\""+_obj[_cO]+"\" "
		_paramoutput+="<param name="+_cO+" value=\""+_obj[_cO]+"\">";
		if(_cO=="movie")_src="src=\""+_obj[_cO]+"\"";
		if(_cO=="version")_ver=_obj[_cO];
	}
	if(_ver=="")_ver="8,0,0,0"
	var ihtm="<object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase="+location.protocol+"//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version="+_ver+" "+_output+">\n"
	ihtm+=_paramoutput+"\n"
	ihtm+="<embed "+_src+" pluginspage="+location.protocol+"//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash type=application/x-shockwave-flash "+_output+">\n";
	ihtm+="</embed>\n";
	ihtm+="</object>\n";
	document.getElementById(_container).innerHTML=ihtm
}

function mostra_nascondi(tr){
document.getElementById(tr).style.display=(window['vis_'+tr])?'none':'block';
window['vis_'+tr]=!window['vis_'+tr]
}
//-->
/* - - - - - - - - - - - - - - - - - - */
/* - Versione 1.5.7 del 19ott2009  - - */
/* - - - - - - - - - - - - - - - - - - */
// Var Globali
var flvPlay = "true";
var player  = null;
var endLink = "";
var IDplayerFLV ;
/* - - - - - - - - - - - - - - - - - - */


/* - - - - - - - - - - - - - - - - - - */
// DA MODIFICARE
/* - - - - - - - - - - - - - - - - - - */
// Posizionamento filmato 
// LEFT  : angolo inferiore Sinistro
// RIGHT : angolo inferiore Destro
// BOX   : resta all'interno della pagina
var FlvPosition = 'LEFT'; 
/* - - - - - - - - - - - - - - - - - - */
// Dimensione Filmato
var FlvBoxWidth      = 400 ;
var FlvBoxHeight     = 350 ;
/* - - - - - - - - - - - - - - - - - - */
// Directory
var flvPath = "/flv/"; // percorso File FLV
var swfPath = "/flv/"; // percorso player SWF
/* - - - - - - - - - - - - - - - - - - */
// Caricamento del filmato
// FIRST  : Filmato visualizzato SOLO alla prima visita della sessione
// ALWAYS : Filmato SEMPRE visualizzato 
var flv_onLoad      = "FIRST"; // FIRST , ALWAYS
/* - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - */
// Azioni del Filmato a caricamneto pagina
// PLAY  : Autoplay del Filmato
// PAUSE : NON Autoplay del Filmato
// HIDE  : Rimuove il filmato
var flv_FirstVisit = "PLAY" ; // PLAY , PAUSE , HIDE
var flv_OtherVisit = "PAUSE" ; // PLAY , PAUSE , HIDE
/* - - - - - - - - - - - - - - - - - - */
// Azioni da eseguire
// NONE  : Nessuna
// LINK  : apre la pagina indicata nell'inizializzazione del player
// CLOSE : chiude il player
// CUSTOM : esegue lo script specificato
// CUSTOMCLOSE : esegue lo script specificato e chiude il player
var flv_onCompleted = "NONE"; // NONE , LINK , CLOSE , CUSTOM , CUSTOMCLOSE
var flv_onPaused    = "NONE"; // NONE , LINK , CLOSE , CUSTOM , CUSTOMCLOSE
var flv_onPlaying   = "NONE"; // NONE , CUSTOM 

/* - - - - - - - - - - - - - - - - - - */
var ClientWidth = 0, ClientHeight = 0;
// recupero delle dimensioni effettive della finestra del brower
function ClientSize() {
	ClientWidth = 0;
	ClientHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    ClientWidth = window.innerWidth;
    ClientHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    ClientWidth = document.documentElement.clientWidth;
    ClientHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    ClientWidth = document.body.clientWidth;
    ClientHeight = document.body.clientHeight;
  }
//  window.alert( 'Width = '  + ClientWidth );
//  window.alert( 'Height = ' + ClientHeight );
}
/* - - - - - - - - - - - - - - - - - - */
// Spostamento box SWF
/*
ID_          : Nome del player SWF
FlvPosition_ : posizione del player
	RIGHT = in basso a destra
	LEFT  = in basso a sinistra
	BOX   = resta nel punto definito
*/
function FlvBoxReposition(ID_ , FlvPosition_) {
    FlvPosition = FlvPosition_ ;
	ClientSize();
	var FlvDivobj = document.getElementById(ID_);
	if (FlvDivobj){
		switch (FlvPosition) {
		  case 'RIGHT':
				FlvDivobj.style.top = (ClientHeight - FlvBoxHeight) +'px';
				FlvDivobj.style.left = (ClientWidth - FlvBoxWidth) +'px';
				FlvDivobj.style.position='fixed';
		  break;
		  case 'LEFT':
				FlvDivobj.style.top = (ClientHeight - FlvBoxHeight) +'px';
				FlvDivobj.style.left = '0px';
				FlvDivobj.style.position='fixed';
		  break;
		  case 'BOX':
				FlvDivobj.style.position='absolute';
		  default:
		} 
	}

}
/* - - - - - - - - - - - - - - - - - - */
function FlvPlayer(Box_,ID_,Flv_,FlvW_,FlvH_,Img_,Lnk_) {
/*
Box_  : Nome del div contenente il filmato
ID_   : Nome del player SWF
Flv_  : Nome del filmato FILE.FLV
FlvW_ : Larghezza del filmato 
FlvH_ : Altezza del filmato 
Img_  : Immagine di Inzio/Fine
Lnk_  : Link a cui reindirizzare la pagina a fine filmato 
*/    
endLink = Lnk_;

var VisitedPage = checkVisit(ID_);
var VisitPageAction = 'PLAY';

if(VisitedPage == false) { VisitPageAction = flv_FirstVisit; }
else { VisitPageAction = flv_OtherVisit; }

		switch (VisitPageAction) {
		  case 'PLAY':
			  flvPlay = "true";
		  break;
		  case 'PAUSE':
			  flvPlay = "false";
		  break;
		  case 'HIDE':
			  flvPlay = "false";
		  break;
		  default:
		} 

FlvBoxWidth      = FlvW_ ;
FlvBoxHeight     = FlvH_ ;
    
var flashvarsWithLink = {
  file         : flvPath + Flv_
, link         : Lnk_
, image        : flvPath + Img_
, shuffle      : 'false'
, repeat       : 'none'
, stretching   : 'none'
, autostart    : flvPlay
, volume       : '100'
, frontcolor   : '86C29D'
, backcolor    : '849BC1'
, lightcolor   : 'C286BA'
, screencolor  : 'FFFFFF'
, screenalpha  : '0'
, type         : 'video'
, controlbar   : 'none'
, quality      : 'true'
, state        : 'BUFFERING'
, displayclick : 'link'
, linktarget   : '_self'
}
var flashvarsNoLink = {
  file         : flvPath + Flv_
, image        : flvPath + Img_
, shuffle      : 'false'
, repeat       : 'non8e'
, stretching   : 'none'
, autostart    : flvPlay
, volume       : '100'
, frontcolor   : '86C29D'
, backcolor    : '849BC1'
, lightcolor   : 'C286BA'
, screencolor  : 'FFFFFF'
, screenalpha  : '0'
, type         : 'video'
, controlbar   : 'none'
, quality      : 'true'
, state        : 'BUFFERING'
, linktarget   : '_self'
}


var params = {
  allowfullscreen   : 'true'
, allowscriptaccess : 'always'
, wmode             : 'transparent'
, menu              : 'false'
, bgColor           : '#000000'
}

var attributes = {
  id   : ID_
, name : ID_
}

var flashvars;

if ( (Lnk_ != null) && (Lnk_ != '') ) {
	flashvars = flashvarsWithLink;
}else{
	flashvars = flashvarsNoLink;
}

if ( VisitPageAction == "HIDE" ) { 
	document.getElementById(Box_).parentNode.removeChild(document.getElementById(Box_)); 
	}
else { 
	swfobject.embedSWF( swfPath + 'player.swf' , Box_ , FlvW_, FlvH_, '9.0.124', false, flashvars, params, attributes); 
	}
}

function playerReady(obj) {
 player = gid(obj.id);
 addListeners();
};

function addListeners() {
 playlist = player.getPlaylist();
 if(playlist.length > 0) {
  player.addModelListener('STATE', 'stateMonitor');
//  player.addModelListener('TIME',  'timeMonitor');
  }else{
  setTimeout("addListeners();", 100); }
};

function stateMonitor(obj){
	
	if(obj.newstate == 'PLAYING') {
	//istruzioni da eseguire durante il filmato
		switch (flv_onPlaying) {
		  case 'CUSTOM':
				fnc__onPlaying();
		  break;
		  case 'NONE':
		  default:
		} 
	}
	
	if(obj.newstate == 'COMPLETED') {
		   IDplayerFLV = document.getElementById(obj.id);
	//istruzioni da eseguire a fine filmato
		switch (flv_onCompleted) {
		  case 'LINK':
			  if ( (endLink != null) && (endLink != '') ) { document.location = endLink; }
		  break;
		  case 'CLOSE':
				IDplayerFLV.parentNode.removeChild(IDplayerFLV);
		  break;
		  case 'CUSTOM':
				fnc__onCompleted();
		  break;
		  case 'CUSTOMCLOSE':
				fnc__onCompleted();
				IDplayerFLV.parentNode.removeChild(IDplayerFLV);
		  break;
		  case 'NONE':
		  default:
		} 
	}
	if(obj.newstate == 'PAUSED') {
		   IDplayerFLV = document.getElementById(obj.id);
	//istruzioni da eseguire a pausa filmato
		switch (flv_onPaused) {
		  case 'LINK':
			  if ( (endLink != null) && (endLink != '') ) { document.location = endLink; }
		  break;
		  case 'CLOSE':
		  	IDplayerFLV.parentNode.removeChild(IDplayerFLV);
		  break;
		  case 'CUSTOM':
				fnc__onPaused();
		  break;
		  case 'CUSTOMCLOSE':
				fnc__onPaused();
				IDplayerFLV.parentNode.removeChild(IDplayerFLV);
		  break;
		  case 'NONE':
		  default:
		} 
	}

};

function timeMonitor(obj) {
 if( (obj.position > 20.0)) {
 //istruzioni da eseguire dopo 20.0 secondi di filmato
 }
};

function gid(name) { return document.getElementById(name); };


/* - - - - - - - - - - - - - - - - - - - - - - - */
/* Funzione di controllo prima pagina con Cookie */

function getCookie(c_name_) {
var search = c_name_ + "="
var returnvalue = "";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search)
		// if cookie exists
		if (offset != -1) {
			offset += search.length
			// set index of beginning of value
			end = document.cookie.indexOf(";", offset);
			// set index of end of cookie value
			if (end == -1) end = document.cookie.length;
			returnvalue=unescape(document.cookie.substring(offset, end))
		}
	}
return returnvalue;
}

function setCookie(c_name_,value_){
	document.cookie=c_name_ +'='+ value_ ;
}

function checkVisit(c_name_) {
var c_Return =getCookie(c_name_);
var returnvalue = true;
	if (c_Return==null || c_Return=="") {
  	setCookie(c_name_,'Visited');
  	returnvalue = true; }
	else { 
  	returnvalue = false; }
if ( flv_onLoad == "ALWAYS" ){
	 returnvalue = true;
	 }
return !returnvalue;
}

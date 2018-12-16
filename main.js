//DOUBLE CHECK dependencies are installed.
var xmlReq = false;
var client;
try{
	xmlReq = require("xmlhttprequest");
	client = require('discord-rich-presence')('523786960947380245');
}catch(error){
	console.log("Dependencies not found! Make sure to run installDependencies.bat");
};
var mainBg; //for seeing if the bg has changed
var displayUnits = "mgdl"; //valid options are mgdl and mmol.
var requestSeconds = 15;
config = require('./config.json');
//config values
var lowValue = Number(config.lowValue) || 80;
var highValue = Number(config.highValue) || 180;
var displayNightscoutSite = config.displayNightscoutSite || false;
var siteUrl = config.siteUrl;
//conversion functions for mgdl and mmol

function unitToEnglish(){
  if(displayUnits == "mgdl"){
    return " mg/dL";
  }else if(displayUnits == "mmol"){
    return " mmol/L";
  }
}

function mgdlToMMOL(mgdlVal){
  var mmolMult = 18.016;
  var tempMmol = mgdlVal/mmolMult;
  //make sure to round to one decimal place!
  var tempMmolFinal = Math.round(tempMmol*10)/10;
  if(tempMmolFinal % 1 == 0){
    tempMmolFinal = tempMmolFinal+".0";
  }
  return (tempMmolFinal);
}

function mmoltoMGDL(mmolVal){
  var mmolMult = 18.016;
  var tempMGDL = mmolVal*mmolMult;
  var tempMgdlFinal = Math.round(tempMGDL);
  return (tempMgdlFinal);
}

//main functions

function setPresence(bgValue){
	//set vars
	var smallImage = false;
	//check for mmol or mgdl
	if(displayUnits=="mmol"){
		//do conversion.
		bgValue = mgdlToMMOL(bgValue);
		console.log(bgValue);
		if(Number(bgValue) <= Number(mgdlToMMOL(lowValue))){
			//it's low.
			smallImage="low";
		}else if(Number(bgValue) >= Number(mgdlToMMOL(highValue))){
			//it's high.
			smallImage="high";
		}
	}else{
		//mgdl or incorrectly set, either way default is mgdl
		if(Number(bgValue) <= lowValue){
			//it's low.
			smallImage="low";
		}else if(Number(bgValue) >= highValue){
			//it's high.
			smallImage="high";
		}
	}
	//if display nightscout site is true, make sure to display it
	var detailText = "Nightscout";
	if(displayNightscoutSite == true){
		detailText = siteUrl;
	}
	if(smallImage == false){
		//no, 
		client.updatePresence({
		  details: detailText,
		  state: "Blood Sugar: "+bgValue+unitToEnglish(),
		  largeImageKey: 'nightscout-logo',
		  largeImageText:"Blood Sugar: "+bgValue+unitToEnglish(),
		  //smallImageKey: 'highimage',
		  instance: true,
		});
	}else{
		client.updatePresence({
		  details: detailText,
		  state: "Blood Sugar: "+bgValue+unitToEnglish(),
		  largeImageKey: 'nightscout-logo',
		  largeImageText:"Blood Sugar: "+bgValue+unitToEnglish(),
		  smallImageKey: smallImage+"image",
		  smallImageText: smallImage.toUpperCase()+" GLUCOSE ALERT",
		  instance: true,
		});
	}
	console.log("Set Discord blood sugar value to "+bgValue);
}

function manipulateURL(urlObj){
  var siteUrlBase = urlObj;
  //check if it starts with https/http and manipulate accordingly
  if(siteUrlBase.startsWith("https://") || siteUrlBase.startsWith("http://")){
    //it starts with https/http, we should be good.
  }else{
    //no http, add to string.
    siteUrlBase = "http://"+siteUrlBase;
  } 
  //make sure it ends in a slash
  if(siteUrlBase.endsWith("/")){
  }else{
    //no slash, add one.
    siteUrlBase = siteUrlBase+"/";
  }
  siteUrlBase = siteUrlBase+ 'api/v1/entries.json?count=1';
  //return url with correct values.
  return siteUrlBase;
}

function webError(){
	console.log("ERROR: Invalid Site URL! Please check config.json.");
};

function webRequest(){
	//check that site url is valid
    var siteUrlBase = manipulateURL(siteUrl);
    if(xmlReq == false){
    	return;
    }
	var XMLHttpRequest = xmlReq.XMLHttpRequest;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", siteUrlBase, true);

	xhr.onload = function (e) {
	if (xhr.readyState === 4) {
	  if (xhr.status === 200) {
	    //everything is done. now we can check if it's changed, and set the presence accordingly.
	    var currentBloodGlucose = JSON.parse(xhr.responseText)[0]["sgv"]; //sgv is the blood sugar string
	    if(mainBg==currentBloodGlucose){
	    	//already set correctly.	
	    }else{
	    	//now we have a new data point, push an update.
	    	mainBg = currentBloodGlucose;
			setPresence(currentBloodGlucose);
	    }
	    // we are done. find a way to callback after all the data, too.
	  } else {
	  	//other stuff
	  	webError();
	  }
	}
	};
	xhr.onerror = function (e) {
	  	webError();
	};
	xhr.send(null);
}
webRequest();
setInterval(webRequest, requestSeconds * 1000); //make a web request every 15 seconds



chrome.webRequest.onBeforeRequest.addListener(function(e){
	if(e.type == "script" || e.type == "stylesheet") console.log("block : "+e.type);
	else console.log("response : "+e.type);

	return {cancel : (e.type == "script" || e.type == "stylesheet")}
},
{urls : ["http://wasabisyrup.com/*"]},
["blocking"]);
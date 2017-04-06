chrome.webRequest.onBeforeRequest.addListener(function(e){
	/*
	if(e.type != "image" && e.type != "main_frame") console.log("block : "+e.type);
	else console.log("response : "+e.type);
	*/

	//if(e.url.search("wasabisyrup.com") == -1) return {cancel : false};
	return {cancel : (e.type != "image" && e.type != "main_frame" && e.type != "other")}
},
{urls : ["http://wasabisyrup.com/*"]},
["blocking"]);
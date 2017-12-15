opt = {
      set: {
            "CATAssistant": false,
		"QuickKey": true,
            "autoBookMark": true,
            "denyRequest": true,
		"forcedRemove": true
      },
      off: false
}

chrome.webRequest.onBeforeRequest.addListener(function (e) {
	/*
	if(e.type != "image" && e.type != "main_frame") console.log("block : "+e.type);
	else console.log("response : "+e.type);
	*/

	//if(e.url.search("wasabisyrup.com") == -1) return {cancel : false};
	
	chrome.storage.sync.get({ "opt": opt }, function (load) {
		if (load == undefined || load == "");
		else opt = load.opt;
	})

	if (opt.off == true) return {cancel : false};
	else{
		if(e.type == "script") console.log(e);
		return {cancel : (e.type != "image" && e.type != "main_frame" && e.type != "other" && e.type != "xmlhttprequest")};
	}
},
{urls : ["http://wasabisyrup.com/*"]},
["blocking"]);
	port = chrome.runtime.connect()
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
		return ext.onMessage._dispatch(message, {}, sendResponse).indexOf(true) != -1;
	});
	port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
	port = null;
	
	console.log("hello");

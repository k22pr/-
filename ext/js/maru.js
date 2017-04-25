view = {
	view : ""
}

$(document).ready(function(){
	$(".fa-trash").remove();
	$(".fa-check").remove();
	//$("iframe").remove();
	$("div#responsive-banner").remove();
	$("div#widget__insert_html").remove();
		
	chrome.storage.sync.get(view,function(loadViewData){
		if(loadViewData.view == ""){
			loadViewData = {
				view : "[]"
			}
		}
		view.data = JSON.parse(loadViewData.view);
		$("div#vContent font").attr("color"," ");
		$("div#vContent a").each(function(i,index){
			$(view.data).each(function(i,list){
				link = $(index).attr("href");
				if(link == undefined || link.length < 5) return false;
				else if(link.search("marumaru") != -1) return false;
				//console.log(link);
				chk = link.search("/"+list);
				
				//view this.
				if(chk != -1){
					//console.log(chk);
					$(index).addClass("small");
					$(index).remove("view-link");
					return false;
				}
				if(i-1 == link.length) $(index).addClass("view-link");
			});
		});
	});
});
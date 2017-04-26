view = {
	view : ""
}

$(document).ready(function(){
	$(".fa-trash").remove();
	$(".fa-check").remove();
	$("div#responsive-banner").remove();
	$("div#widget__insert_html").remove();
	$("div.comment").remove();

	$("div#boardList").prepend("<button class='w12 comment-toggle'>댓글 보기/숨기기</button>");
	$("iframe#commentFrame").addClass("hide");

	$(document).on("click", "button.comment-toggle", function () {
		commentBody = $("iframe#commentFrame");
		commentBody.toggleClass("hide");
		//commentBody.css("height", (Number(commentBody.contents().find('body')[0].scrollHeight) - 50) + "px !important");
		commentBody.height(Number(commentBody.contents().find('body')[0].scrollHeight) - 50);
	})
		
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
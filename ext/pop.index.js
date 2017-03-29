dom = {
	url : "http://wasabisyrup.com/archives/",
	list : function(){
		$(".my-list").empty();
		$.each(data,function(i,list){
			base = $(".my-list").append("<li class='w12'><div class='w10 only-line tmain go hand' link='"+dom.url+list.link[1]+"'><span class='bold'>["+list.link[0].trim()+"]</span> "+list.name+"</div><div class='w2 tred del hand' no='"+i+"'>del</div></li>");
		});
	}
}
data = {
	
};

$(document).ready(function(){
	$("input.search").focus();
	chrome.storage.sync.get({json:""},function(item){
		if(item == undefined) data = [];
		else{
			data = JSON.parse(item.json).reverse();
			dom.list();
		}
		
			//$("body").html(data.list[0]);
			
			/*
			console.log(data);
			$("div.my-list").html(data);
			$.each(data.list,function(i,list){
				$("div.my-list").append("<div class='w12'>"+(i+1)+"1233 "+list.name+"</div>");
			});
			*/
	});
	
	$(document).on("click","div.go",function(){
		chrome.tabs.create({url:$(this).attr("link")});
	});
	
	$(document).on("click","div.del",function(){
		no = $(this).attr("no");
		console.log("ee");
		data.splice(no,1);
		dom.list();
		
		//save
		save =  {
			json : JSON.stringify(data.reverse())
		}
		chrome.storage.sync.set(save,function(){
			console.log(save);
		});
	});
	
	$(document).on("click","button.search-btn",function(){
		search();
	});
	$(document).on("keydown","input.search",function(e){
		if(e.keyCode == 13) search();
	});
	function search(){
		search_link = "http://marumaru.in/?r=home&mod=search&keyword="+encodeURI($("input.search").val());
		chrome.tabs.create({url:search_link});
	}
});
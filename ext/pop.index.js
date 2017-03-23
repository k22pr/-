

chrome.storage.sync.get("data",function(item){
	console.log(item);
	data = {"on":1,list:[]};
	data = item;
	if(data.on == undefined) data.on = 1;
	if(data.list == undefined) data.list = [];
	
	$(document).ready(function(){
		//$("body").html(data.list[0]);
		
		/*
		console.log(data);
		$("div.my-list").html(data);
		$.each(data.list,function(i,list){
			$("div.my-list").append("<div class='w12'>"+(i+1)+"1233 "+list.name+"</div>");
		});
		*/
		
		

		$("div.my-list").html("hi");
		$("div.my-list").append(data.on);
		if(data.on == false) $(this).removeClass("button-body-on");
		
		$(document).on("click","div.button-body",function(){
			$(this).toggleClass("button-body-on");
			if($(this).hasClass("button-body-on")) data.on = 1;
			else data.on = 0;
			saveData();
		});
	});
	
	function saveData(){
		chrome.storage.sync.set(data,function(){
			console.log(data);
		});
	}
});
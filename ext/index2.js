var dom = {
	src : [],
	img : [],
	addSrc : function(name){
		this.src.push(name);
	},
	addImg : function(name){
		this.img.push(name);
	}
}

var data = {
	opt : {
		on : true
	},
	list : [],
	save : function(){
		chrome.storage.sync.set(this,function(){
			console.log(this);
		})
	},
	load : function(){
		
	}
}

document.onload = function(){
	
}

document.onreadystatechange = function(event){
    if(document.readyState == "interactive") {
		document.removeEventListener("DOMContentLoaded",onload);
		document.removeEventListener("DOMContentLoaded",onloadstart);
		window.removeEventListener("DOMContentLoaded",onload);
		for(i=0; i < event.srcElement.all.length; i++){
			var content = event.srcElement.all[i];
			if(content.localName == "script"){
				dom.addSrc(content);
			}else if(content.localName == "img"){
				dom.addImg(content);
			}
		}
		document.innerHTML = "";
		//window.srcElement.all = dom.img;
		//console.log(document.onreadystatechange);
		//document.documentElement = "123";
    }
}


now = {
	now : location.pathname.split("/"),
	back : 0,
	backCss : "",
	next : 0,
	nextCss : ""
};
view = {
	now : 1
}

last = {}

var load = function(){
	chrome.storage.sync.get("data",function(item){
	console.log(item);
	data = {"on":1,list:[]};
	data = item;
	if(data.list == undefined)  data.list = [];
	
	//undefined
	if(data.on == undefined) data.on = 1;
	//on or off
	if(data.on == 1) $("head").remove();
	else return false;
	console.log(data.on);
	})
}

$(document).ready(function(){
		arr = [];
		season = [];
		title = $("div.article-title").attr("title");
		name = $("span.title-subject").html();
		$.each($("img.lz-lazyload"), function(i,list){
			arr.push(list.attributes[2].value);
			cname = list.className;
		});
		//화수를 구함
		
		isBreak = false;
		$.each($("select.list-articles > option"), function(i,list){
			season.forEach(function(loop){
				if(loop[1] == $(list).val()){
					isBreak = true;
				}
			});
			if(isBreak){
				isBreak = false;
				return false;
			}
			
			s = $(list).html().replace(/([\s|\n|\t|\r])+/gi,'');
			season.push([$(list).html().replace(/	/g,''),$(list).val()]);
			
			if($(list).val() == now.now[2]) now.back = i;
		});
		
		last.name = name;
		last.title = title;
		last.link = now.now[2];
		changeNo = -1;
		$.each(data.list,function(i,list){
			if(list.name == last.name) changeNo = i;
		});
		
		if(data.list.length == 0) data.list[0] = last;
		else if(changeNo == -1) data.list[data.list.length] = last;
		else data.list[changeNo] = last;
		
		//data.list[data.list.length] = last;
		save = $.extend({},data);
		//else data[changeNo] = last;
		
		
		
		if(season[now.back-1] !== undefined){
			now.backCss = "btn";
			now.backLink = season[now.back-1][1];
		}else{
			now.backCss = "btn-lock";
		}
		//다음화가 있는 경우
		if(season[now.back+1] !== undefined){
			now.next = now.back+1;
			now.nextCss = "btn";
			now.nextLink = season[now.back+1][1];
		}else{
			now.nextCss = "btn-lock";
		}
		
		
		$("body").empty();
		
		$("body").append("<div class='view-header'><div class='title'>header</div></div>");
			if(now.back == 0) $("div.view-header").prepend("<div class='left "+now.backCss+"'>이전화</div>");
			else $("div.view-header").prepend("<a href='"+now.backLink+"'><div class='left "+now.backCss+"'>이전화</div></a>");
			if(now.next == 0) $("div.view-header").append("<div class='right "+now.nextCss+"'>다음화</div>");
			else $("div.view-header").append("<a href='"+now.nextLink+"'><div class='right "+now.nextCss+"'>다음화</div></a>");
		//현재보는 페이지
		$("body").append("<div class='view-page'><span class='now'>"+view.now+"</span>/"+(arr.length-1)+"</span></div>");
		
		$("div.title").html(title);
		$.each(arr,function(i,list){
			$("body").append("<img src='"+list+"' class='"+cname+" view' count='"+i+"'>");
		});
		
		function ShowHeader(){
			$("div.view-header").removeClass("hide"); 
		}
		
		function HideHeader(){
			$("div.view-header").addClass("hide");
		}
		$(function(){
		  //Keep track of last scroll
		  var lastScroll = 0;
		  $(window).scroll(function(event){
			  //Sets the current scroll position
			  var st = $(this).scrollTop();
			  //Determines up-or-down scrolling
			  if (st > lastScroll){ // down
				//Replace this with your function call for downward-scrolling
				now = $(document).scrollTop()+$(window).height();
				max = $(document).height();
				if(now == max) ShowHeader();
				else HideHeader();
			  }
			  else { //up
				//Replace this with your function call for upward-scrolling
				ShowHeader();
				//if(
			  }
			  //scroll
				$.each($("img.view"),function(i,list){
					if($(list).offset().top - ($(window).height()/3) > $(window).scrollTop()){
						$("span.now").html($(list).attr("count"));
						return false;
					}
				});
			  //Updates scroll position
			  lastScroll = st;
		  });
		});
	});
	
});
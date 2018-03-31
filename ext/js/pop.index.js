data = {};
chrome.storage.sync.get({ "opt": opt }, function (load) {
	if (load == undefined || load == "");
	else opt = load.opt;
});

function GetAxiosData(i,list){
	var now = $("li.list-"+i);
	var icon = now.children("div.icon");
	var iconStatus = '';
	axios.get(dom.url+list.link[1]).then(function(rspn){
		icon.empty();
		//reg = new RegExp("\<option value=\"([0-9a-zA-Z\-_+]{1,20})\"","ig");
		//data = rspn.data.replace(/(\n)/g,"");
		//console.log(data);
		reg = new RegExp(/\<option (.*)\>(\n|\r)(.+)/,"g");
		//list = reg.match(rspn.data);
		arr = rspn.data.match(reg);
		if(arr == null){
			//현재값을 찾을 수 없을경우
			iconStatus = 'findError';
		}else{
			arr = arr.slice(0,arr.length/2);
			var nowName = [arr.length];
			//배열형태로 정렬
			arr.forEach(function(str,j){
				//str = str.replace(/\t/g,'');
				nowName[j] = [,];
				//화의 이름값
				nowName[j][0] = str.match(/\t+(.+)\t+/)[1];
				nowName[j][0] = nowName[j][0];
				//화의 주소값
				nowName[j][1] = str.match(/\"(.+)\"/)[1];
			})

			banCount = 0;
			nowName.forEach(function(str,j){
				//특별편, 변외편, 외전 등 마지막에 위치하는 예외 제거
				if(str[0].search(/([\uAC00-\uAD8B]|[\uAD8D-\uD0C3]|[\uD0C5-\uD3B7]|[\uD3B9-\uD653]|[\uD655-\uD7A3]+)/) != -1){
					//console.log("remove : "+str+" // index : "+str[0].search(/([\uAC00-\uAD8B]|[\uAD8D-\uD0C3]|[\uD0C5-\uD3B7]|[\uD3B9-\uD653]|[\uD655-\uD7A3]+)/));
					arr.slice(j,1);
					banCount++;
				}else if(list.link[1] == nowName[j][1]){
					//console.log('saved : '+nowName[j][1])
					savedIndex = j;
				}
			});
			console.log(banCount);
			console.log(arr.length-1);
			console.log(savedIndex);
			console.log(" ");

			if(savedIndex+banCount >= Number(arr.length-1)) iconStatus = 'pass';
			else iconStatus = 'update';
			//if(!dom.lastUpdate.data) dom.lastUpdate.data = [];
			data[i].updateIcon = iconStatus;
			IconType(i,iconStatus);

			//마지막에 데이터 업데이트
			if(i+1 == data.length) setSyncListData();
		}
	}).catch(function(err){
		$("li.list-"+i).children("div.icon").empty();
	})
}
function IconType(i,type){
	switch(type){
		case 'update':
			setChangeIcon(i,"flash","최신화가 업데이트 되었있습니다.");
		break;
		case 'pass':
			setChangeIcon(i,"clock-o","마지막에 본 화로부터 업데이트가 없었습니다.");
		break;
		case 'shrotTime':
			setChangeIcon(i,"spinner-time-alt","얼마전에 업데이트를 확인했습니다.");			
		break;
		case 'unknownError':
			setChangeIcon(i,"exclamation","알 수 없는 이유로 업데이트를 확인할 수 없습니다.");
		break;
		case 'findError':
			setChangeIcon(i,"exclamation","현재 위치를 찾을 수 없습니다.");			
		break;
		default:
			setChangeIcon(i,"exclamation","정의되지 값이 전달되었습니다.");
		break;
	}
}
function setChangeIcon(i,name,msg){
	$("li.list-"+i).children("div.icon").html("<i class='fonti um-"+name+" toggling'><div class='hide'>"+msg+"</div></i>");
}
function statusIconUpdate(){
	$.each(dom.list,function(i,list){
		if(dom.lastUpdate.data != undefined && !dom.lastUpdate.data[list.link[1]]) IconType(i,dom.lastUpdate.data[list.link[1]]);
	})
	
}
function setUpdateTime(){
	chrome.storage.sync.set({"update":dom.lastUpdate},function(){});
}
function setPrevIcon(){

}
function setSyncListData(){
	chrome.storage.sync.set({"data":data},function(){
	});
}

dom = {
	url : "http://wasabisyrup.com/archives/",
	lastUpdate : 0,
	list : function(){
		return new Promise(function(resolve,reject){
			$(".my-list").empty();
			//마지막 업데이트로 부터 30분이 지난경우
			if(dom.lastUpdate + 60*5 < Math.floor(new Date().getTime() / 1000)) updateFlag = 1;
			else updateFlag = 0;
			//updateFlag = 1;
			/*
				30분에 한번씩 업데이트를 확인 해야하지만 확인했던 업데이트 정보를 기록하지 않아
				이전에 확인했던 내용을 다시 확인 할 수 없는 문제가 있다.
				업데이트 했던 내용을 기록하고 사용자가 삭제하는 기능이 필요한덧 & 30분에 한번이 아니라 매번 새로운 업데이트를 확인
			*/
			$.each(data,function(i,list){
				base = $(".my-list").append("<li class='w12 list-"+i+"'><div class='w10 only-line go hand p3 name-line' link='"+dom.url+list.link[1]+"'><span class='bold'>["+list.link[0].trim()+"]</span> "+list.name+"</div><div class='w1 center b5 small-color icon'><i class='fonti um-spinner-alt spinner-alt um-pulse'></i></div><div class='w1 center tred del hand p3 b5' no='"+i+"'><i class='fonti um-trash'></i></div></li>");
				if(list.updateIcon)	IconType(i,list.updateIcon);
			});
			resolve();
		});
	},
	updateCheck : function(){
		$.each(data,function(i,list){
			type = GetAxiosData(i,list);
		});
	}
}

$(document).ready(function () {
	if (opt.off == true) {
		$(".title-name").addClass("text-grey");
		$("img.logo").addClass("grey");
	}
	$("input.search").focus();
	chrome.storage.sync.get("update",function(load){
		dom.lastUpdate =  load.update;
		chrome.storage.sync.get("data",function(load){
			if(load == undefined || load.length == 0) data = [];
			else{
				//data = JSON.parse(load.data);
				data = load.data;
				dom.list().then(function(){
					new Promise(function(resolve, reject){
						$.each(data,function(i,list){
							type = GetAxiosData(i,list);
						});
						resolve();
					}).then(function(){
					}).then(function(){
						dom.lastUpdate = Math.floor(new Date().getTime() / 1000);
						setUpdateTime();
					})
				});
			}
		});
	});

	
	$(document).on("click","div.go",function(){
		chrome.tabs.create({url:$(this).attr("link")});
	});
	
	$(document).on("click","div.del",function(){
		no = $(this).attr("no");
		data.splice(no,1);
		dom.list();
		
		//save
		save =  {
			json : JSON.stringify(data.reverse())
		}
		chrome.storage.sync.set({"data":data.reverse()},function(){
			//console.log(save);
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
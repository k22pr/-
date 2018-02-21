var dom = {
	url: location,
	urlBase: location.pathname.split("/"),
	src: [],
	img: [],
	season: [],
	viewMode : "list",
	nowView: 1,
	addSrc: function (name) {
		this.src.push(name);
	},
	addImg: function (name) {
		this.img.push(name);
	},
	nextCount : 0,
	make: {
		img: function () {
			$("body").append("<div class='list-body'></div>");
			chrome.storage.sync.get({"opt":opt},function(load){
				if(load == undefined || load == "");
				else opt = load.opt;
				for (i = 0; i < dom.img.length; i++) {
					if(opt.set["CATAssistant"] == false) $(".list-body").append("<img src='" + dom.url.origin + dom.img[i] + "' count='" + i + "' class='view'>");
					/*
					src = dom.url.origin+dom.img[i].attributes[2].value;
					console.log(dom.img[i].attributes[2]);
					$("body").append("<img src='"+src+"' count='"+i+"'>");
					*/
				};
			});
		},
		header: function () {
			$("body").append("<div class='view-header' id='head'><div class='left header-list bbtn hand'>목록</div><div class='left header-title'><span class='small'>" + (dom.now) + "개 <</span> " + dom.name.base + " <span class='small'>> " + (dom.season.length - dom.now - 1) + "개</span></div></div>");
			if (dom.urlBase[2] == dom.season[0][1]) $("div.view-header").prepend("<div class='bbtn btn-lock'>이전</div>");
			else $("div.view-header").prepend("<a href='" + dom.season[dom.now - 1][1] + "'><div class='bbtn bdr0 only-line'>이전(" + dom.season[dom.now - 1][0] + ")</div></a>");
			if (dom.urlBase[2] == dom.season[dom.season.length - 1][1]) $("div.view-header").append("<div class='bbtn btn-lock'>다음</div>");
			else $("div.view-header").append("<a href='" + dom.season[dom.now + 1][1] + "'><div class='bbtn bdr0 only-line'>다음(" + dom.season[dom.now + 1][0] + ")</div></a>");
		},
		nowPage: function () {
			//현재보는 페이지
			$("body").append("<div class='view-page only-line'><span class='now'>" + dom.nowView + "</span>/" + (dom.img.length) + "</span></div>");
		},
		nowPageChange : function(i){
			dom.nowView = i;
			$("span.now").html(dom.nowView);
		},
		lockBox: function () {
			$("body").append("<div class='wac5 box lock-box mt-p10 p10'><div class='b3'>이 페이지는 잠겨 있습니다.</div></div>");
			$("div.lock-box").append("<script src='https://www.google.com/recaptcha/api.js?onload=captchaCallback' async defer></script>");
			$("div.lock-box").append("<div class='w12'><img src='/captcha1'></div>");
			$("div.lock-box").append("<form action='/"+dom.urlBase[1]+"/"+dom.urlBase[2]+"' class='passform wac8 b4 mt20' method='POST'><input type='text' name='captcha1' placeholder='위의 한글' class='w12'><button class='btn oran w12 mt10'>확인</form>");
			$("form.passform").prepend(clone[0].outerHTML);
			
		},
		listBox: function () {
			$("div.view-header").append("<div class='list-box b5 w12 hide'></div>");
			$.each(dom.season, function (i, list) {
				if (dom.sync.dataView.indexOf(list[1]) == -1) color = "tblue";
				else color = "tgrey";
				if (i != 0) $(".list-box").append("<span class='l p10'> | </span>");
				$(".list-box").append("<a href='http://wasabisyrup.com/archives/" + list[1] + "'><span class='" + color + " p10'>" + list[0] + "</span></a>");
			});
		},
		pageEnd: function () {
			if(dom.viewMode != "list") return;
			if (this.nextCount == 0) {
				ment = "다음 화가 존재하지 않습니다.";
				$("body").append("<div class='w12 page-end tsb'><div class='end-ment grey'>" + ment + "</div></div>");
			} else {
				ment = "다음화로 넘어가시려면 화면을 클릭해주세요.";
				url = dom.season[dom.now + 1][1];
				$("body").append("<a href='"+url+"'><div class='w12 page-end tsb'><div class='end-ment blue'>" + ment + "</div></div></div>");
			}
		},
		viewMode : function (){
			new Promise(function(resolve, reject){
				chrome.storage.sync.get("viewMode",function(load){
					if(load.viewMode != undefined) dom.viewMode = load.viewMode;
					else dom.viewMode = "list";
					//console.log("1 : " + dom.viewMode);
					$("body").append("<div class='view-mode-body'></div>");
					$("div.view-mode-body").append("<div class='view-change change-list' mode='list'>일반</div>");
					$("div.view-mode-body").append("<div class='view-change change-one' mode='one'>한장씩</div>");
					$("div.view-mode-body").append("<div class='view-change change-book' mode='book'>두장씩</div>");
					$("div.change-"+dom.viewMode).addClass("use");
					//console.log("div.change : "+dom.viewMode);
				});
			})
		},
		onePageMode : function(){
			var i = dom.nowView -1 ;
			//console.log("i : "+i +" // length : "+dom.img.length);

			var src = dom.url.origin + dom.img[i];

			$("body").css("padding-bottom","0px").css("overflow","hidden");

			if($("div.one-body").length == 0) $("body").append("<div class='wac11 one-body flex'></div>");
			else $("div.one-body").empty();
			
			var body = $("div.one-body");
			$("img.hide-"+i).clone().appendTo(body);
			
		},
		onePageChange : function(i){
			chrome.storage.sync.get("viewMode",function(load){
				dom.viewMode = load.viewMode;

				if(i >= dom.img.length){ //마지막 이미지인 경우 다음 화로
				if(dom.season[dom.now + 1][1] != undefined){
						if(dom.season[dom.now + 1][1] != undefined) location.href = dom.season[dom.now + 1][1];
				}
				return;
				}else if(i <= -1){ //첫번째 이미지인 경우 이전 화로
				if(dom.season[dom.now - 1][1] != undefined){
						if(dom.season[dom.now - 1][1] != undefined) location.href = dom.season[dom.now - 1][1];
				}
				return;

				}

				var img = $("img.one-view");
				dom.make.nowPageChange(Number(i+1));
				dom.make.onePageMode();
			});
		},
		bookPageMode : function(){
			if(dom.nowView < 2) dom.nowView = 2;
			var i = dom.nowView-2 ;
			//console.log("i : "+i +" // length : "+dom.img.length);

			var src = dom.url.origin + dom.img[i];

			$("body").css("padding-bottom","0px").css("overflow","hidden");

			if($("div.book-body").length == 0) $("body").append("<div class='wac11 book-body flex'></div>");
			else $("div.book-body").empty();
			
			var body = $("div.book-body");
			var now = document.getElementsByClassName("hide-"+i)[0];
			var next = document.getElementsByClassName("hide-"+(i+1))[0];

			$("img.hide-"+i).clone().appendTo(body);
			body.children("img.hide-"+i).addClass("book-first");
			//console.log("hide-"+(i+1));
			if(now.naturalHeight > now.naturalWidth && next != undefined && next.naturalHeight > next.naturalWidth){
				$("img.hide-"+(i+1)).clone().prependTo(body);
			body.children("img.hide-"+(i+1)).addClass("book-second");
				i++;
			}
			dom.make.nowPageChange(Number(i+1));
		},
		bookPageChange : function(i){
			chrome.storage.sync.get("viewMode",function(load){
				dom.viewMode = load.viewMode;
				if(i >= dom.img.length){ //마지막 이미지인 경우 다음 화로
				if(dom.season[dom.now + 1][1] != undefined){
						if(dom.season[dom.now + 1][1] != undefined) location.href = dom.season[dom.now + 1][1];
				}
				return;
				}else if(i <= -1){ //첫번째 이미지인 경우 이전 화로
				if(dom.season[dom.now - 1][1] != undefined){
						if(dom.season[dom.now - 1][1] != undefined) location.href = dom.season[dom.now - 1][1];
				}
				return;
				}

				var img = $("img.book-view");
				dom.make.nowPageChange(Number(i+2));
				dom.make.bookPageMode();
			});
		},
		imageRequest : function(){
			return new Promise(function(resolve,reject){
			//이미지 버퍼링을 최소화 하기위에 axios를 이용해 미리 diskcach를 남겨놓는다.
			//axios를 써도 15ms정도의 버퍼링이 생겨 미리 이미지를 받아두고 불러오는 방식으로 변경
			/*
			for (i = 0; i < dom.img.length; i++) {
				console.log(dom.url.origin+dom.img[i]);
				axios.get(dom.url.origin+dom.img[i],{
					headers : {
						 'Content-type': 'image/jpeg'
					}
				});
			}
			*/
			$("body").append("<div class='hide-image hide'></div>");
				var promise = new Promise(function(resolve,reject){
					for (i = 0; i < dom.img.length; i++){
						//console.log("promise : "+i);
						$("div.hide-image").append("<img src='"+dom.url.origin+dom.img[i]+"' class='hide-"+i+"'>");
						var img = document.getElementsByClassName("hide-"+i)[0];
						img.onload = function(){
							resolve();
						}
					}
				});

				promise.then(function(){
					//가로길이가 더 클경우
					for (i = 0; i < dom.img.length; i++){
						var img = document.getElementsByClassName("hide-"+i)[0];
						//console.log("promised : "+i +"("+img.naturalWidth+")");
						if(img.naturalWidth > img.naturalHeight){
							img.className += " wd12";
						}else{
							if(dom.viewMode == "one") img.className += " he12";
							else if(dom.viewMode == "book") img.className += " book-image-double";
							//$("img.hide-"+i).css("min-height",window.innerHeight-40).css("height",window.innerHeight-40);
						}
					}
				}).then(function(){
					resolve();
				})
			})
		}
	},
	bgColorChange : function(name){
		color = "#16191c";
		if(name == "white") color = "#fff";
		else if(name == "gray") color = "#666";
		else color = "#16191c";
		$("html").css("background",color);
	},
	now: {
	},
	name: {
		base: $("title").html(), 
		title: function () {
			//arr = this.base.split('|');
			arr = this.base.split(' ');
			name = '';
			if (arr[arr.length - 1].search("/(-|~|,)/i") != -1) arr[arr.length - 1] = '';
			if (arr.length < 1) return base;
			for (i = 0; i < arr.length - 1; i++) {
				if (i != 0) name += ' ';
				name += arr[i];
			}
			return name;
		}
	},
	sync: {
		data: [],
		dataView: [],
		save: {
			json: ""
		},
		view: {
			view: ""
		}
	},
	lock: false
}
chrome.storage.sync.get({"opt":opt},function(load){
	if(load == undefined || load == "");
	else opt = load.opt;
});

/*
아직 beata버젼에서만 작동함
var matcher = new chrome.declarativeWebRequest.RequestMatcher({
   url: { hostSuffix: 'example.com', schemes: ['http'] },
   resourceType: ['main_frame']
});
	var clearSrc = {
		conditions: [
			new chrome.declarativeWebRequest.RequestMatcher({
				url: { hostSuffix: 'wasabisyrup.com' }
			})
		],
		actions: [
			new chrome.declarativeWebRequest.CancelRequest()
		]
	};
*/
document.onreadystatechange = function (event){
	if (document.readyState == "interactive" && !opt.off) {
		for (i = 0; i < event.srcElement.all.length; i++) {
			var content = event.srcElement.all[i];
			if (content.localName == "script") {
				dom.addSrc(content);
			} else if (content.localName == "img") {
				if(content.attributes[2] != undefined) dom.addImg(content.attributes[2].value);
			}
		}

		(function (){
			var isBreak = false;
			$.each($("select.list-articles > option"), function (i, list) {
				//console.log($(list).html().search("/[\uAC00-\uD7A3]+/"));
				if (dom.season[0] != undefined && dom.season[0][1] == $(list).val()) {
					isBreak = true;
					return false;
				} else {
					//현재 보고있는 화수
					if ($(list).val() == dom.urlBase[2]) dom.now = dom.season.length;
					dom.season.push([$(list).html().replace(/(\t|\s)+/g, ''), $(list).val()]);
				}
				//남은 화수를 저장
				dom.nextCount = dom.season.length - dom.now;
			});
		}());

		if($("form").length != 0){ 
			dom.lock = true;
			clone = $("div.g-recaptcha");
		}else dom.lock = false;
		dom.name.base = $("div.article-title").attr("title");
		//console.log(opt);
		console.log(opt);
		if(opt.set["forcedRemove"] == true && opt.set["CATAssistant"] == false){
			$(root).off();
			root.remove();
		}else{
			//$("head").remove();
			//$("div#root").remove();
		}
	}

	if (document.readyState == "complete" && !opt.off) {
		dom.make.header();
		dom.make.nowPage();
		$("body").addClass("show");

		chrome.storage.sync.get("viewMode",function(load){
			if(load.viewMode != undefined) dom.viewMode = load.viewMode;
			else dom.viewMode = "list";

			$("body").append("<div class='view-mode-body'></div>");
			$("div.view-mode-body").append("<div class='view-change' mode='list'>일반</div>");
			$("div.view-mode-body").append("<div class='view-change' mode='one'>한장씩</div>");
			$("div.view-mode-body").append("<div class='view-change' mode='book'>두장씩</div>");
			$("div.view-mode-body").append("<div class='color-change' mode='black' style='margin-top:10px;'><div class='color-radi black'></div></div>");
			$("div.view-mode-body").append("<div class='color-change' mode='gray'><div class='color-radi gray'></div></div>");
			$("div.view-mode-body").append("<div class='color-change' mode='white'><div class='color-radi white'></div></div>");
			if (dom.lock == true && dom.img.length < 1) dom.make.lockBox();
			else if(dom.viewMode == "list") dom.make.img();
			else{
				Promise.resolve(dom.make.imageRequest(),function(){
				}).then(function(){
					if(dom.viewMode == "one") dom.make.onePageMode();
					else if(dom.viewMode == "book") dom.make.bookPageMode();
				});
			}
		});
		chrome.storage.sync.get("bgColor",function(load){
			dom.bgColorChange(load.bgColor);
		});

		//console.log(opt);
		//if key move options is true
		if (opt.keyMove != 0) {
			//move key code
			$(document).on("keydown", function (e){
				//up
				if (e.keyCode == 38) {
					if(opt.keyMove == 2){
						/*
						no = Number(dom.nowView) - 2;
						if (0 >= no) prep = 0;
						prep = $("img.view")[no];
						$(window).scrollTop($(prep).offset().top);
						*/
						if(dom.viewMode == "one") dom.make.onePageChange(dom.nowView-2);
						else dom.make.bookPageChange(dom.nowView-4);
					}
					return false;

				}else if (e.keyCode == 40) { //아래로
					no = dom.nowView;
					if(opt.keyMove == 2){
						/*
						if (dom.img.length - 1 < no) no = dom.img.length;
						next = $("img.view")[no];
						$(window).scrollTop($(next).offset().top);
						*/
						if(dom.viewMode == "one") dom.make.onePageChange(dom.nowView);
						else dom.make.bookPageChange(dom.nowView);
					}
					return false;
				}else if (e.keyCode == 37) { //왼쪽
					if(opt.keyMove == 1){
						//키타입 왼쪽의 한페이지 일때 (다음이미지)
						if(dom.viewMode == "one") dom.make.onePageChange(dom.nowView);
						else dom.make.bookPageChange(dom.nowView);
					}else if(opt.keyMove == 2){
						 if (dom.season[dom.now - 1] !== undefined) location.href = dom.season[dom.now - 1][1];
					}else if(opt.keyMove == 3){
						//키타입 오른쪽의 한페이지일때 (뒤로가기)
						if(dom.viewMode == "one") dom.make.onePageChange(dom.nowView-2);
						else dom.make.bookPageChange(dom.nowView-4);
					}
					return false;

				}else if (e.keyCode == 39) { //오른쪽
					if(opt.keyMove == 1){
						//키타입 오른쪽의 한페이지 일때 (다음이미지)
						if(dom.viewMode == "one") dom.make.onePageChange(dom.nowView-2);
						else dom.make.bookPageChange(dom.nowView-4);
					}else if(opt.keyMove == 2){
						 if (dom.season[dom.now + 1] !== undefined) location.href = dom.season[dom.now + 1][1];
					}else if(opt.keyMove == 3){
						//키타입 왼쪽의 한페이지일때 (뒤로가기)
						if(dom.viewMode == "one") dom.make.onePageChange(dom.nowView);
						else dom.make.bookPageChange(dom.nowView);
					}
					return false;
				}
			});
		}	

		$(function () {
			//Keep track of last scroll
			var lastScroll = 0;
			$(window).scroll(function (event) {
				//Sets the current scroll position
				var st = $(this).scrollTop();
				//Determines up-or-down scrolling
				if (st > lastScroll) { // down
					//Replace this with your function call for downward-scrolling
					now = $(document).scrollTop() + $(window).height();
					max = $(document).height();
					if (now == max) {
						$("div.view-header").removeClass("bye");
						$("span.now").html(dom.img.length);
						//다음 화로 넘기는 페이지 출력
						dom.make.pageEnd();
					}else{
					 $("div.view-header").addClass("bye");
					 $("div.view-mode-body").addClass("bye");
					}
				}else { //up
					//Replace this with your function call for upward-scrolling
					$("div.view-header").removeClass("bye");
					$("div.page-end").remove();
					$("div.view-mode-body").removeClass("bye");
				}
				//scroll
				$.each($("img.view"), function (i, list) {
					if ($(list).offset().top - ($(window).height() / 3) > $(window).scrollTop()) {
						dom.nowView = $(list).attr("count");
						$("span.now").html(dom.nowView);
						return false;
					}
				});
				//Updates scroll position
				lastScroll = st;
			});
		});

		$(document).on("click", ".header-list", function (){
			$(".list-box").toggleClass("hide");
		});

		$(document).on("click", "div.view-change",function(){
			dom.viewMode = $(this).attr("mode");
			Promise.resolve(chrome.storage.sync.set({"viewMode":dom.viewMode},function(){
			})).then(function(){
				location.reload();
			});
		})
		$(document).on("click","div.color-change",function(){
			dom.bgColorChange($(this).attr("mode"));
			chrome.storage.sync.set({"bgColor":$(this).attr("mode")},function(){});
		});

		$(document).on("click","div.one-body",function(){
			dom.make.onePageChange(dom.nowView);
		})
		$(document).on("click","img.book-first",function(){
			dom.make.bookPageChange(dom.nowView-4);
		});
		$(document).on("click","img.book-second",function(){
			dom.make.bookPageChange(dom.nowView);
		});

		//save sync
		if(opt.set["autoBookMark"] == true){
			chrome.storage.sync.get("data", function (load) {
				if(load.data != undefined) dom.sync.data = load.data;
				/*
				if (loadData == undefined || loadData.json == "") {
					loadData = {
						json: "[]"
					}
				} else {
					dom.sync.data = JSON.parse(loadData.json);
				}
				*/
				//현재 위치와 번외를 제외한 사이즈를 비교하는 부분
				onlySeason = dom.season;
				$.each(onlySeason,function(i,list){
					reg = onlySeason[i][0].search(/([\uAC00-\uAD8B]|[\uAD8D-\uD0C3]|[\uD0C5-\uD3B7]|[\uD3B9-\uD653]|[\uD655-\uD7A3]+)/);
					if(reg != -1){
						//console.log(i+" : "+reg);
						onlySeason.slice(i,1);
					}
				});

				if (dom.sync.data.length > 100) dom.sync.data = dom.sync.data.slice(1);
				save = dom.sync.data;
				//저장할 인덱스 북마크
				var saveNo = -1;
				//저장할 화수 인덱스
				var saved = -1;
				$.each(save,function (i,list) {
					if (list.name == dom.name.title()) {
						saveNo = i;
						$.each(dom.season,function(i,search){
							if(dom.sync.data[saveNo].link[1] == search[1]){
								//현재 저장되어 있는 index 만약 dom.now보다 i가 크다면 저장하지 않는다.
								//console.log("저장된index : "+i+" // 지금보고있는 index"+dom.now);
								saved = i;
							}
						})
					}
				});

				//만약 저장되어 있던 값이 없을경우 dom.now로 현재 인덱스를 저장한다.
				if(saved == -1 || saved < dom.now) saved = dom.now;


				//저장된 정보가 없으면 마지막에 기록추가
				if (saveNo == -1) saveNo = save.length;

				reg = dom.season[dom.now][0].search(/([\uAC00-\uAD8B]|[\uAD8D-\uD0C3]|[\uD0C5-\uD3B7]|[\uD3B9-\uD653]|[\uD655-\uD7A3]+)/);
				if (reg == -1) {
					save[saveNo] = {
						name: dom.name.title(),
						size: dom.season.length,
						link: dom.season[saved],
						updateIcon : onlySeason[onlySeason.length-1][1] == dom.season[dom.now][1] ? "pass" : "update"
					}
				}

				dom.sync.save.json = JSON.stringify(save);
					chrome.storage.sync.set({"data":save}, function () {
						//console.log(dom.sync.save);
					});
			});
		}

		chrome.storage.sync.get(dom.sync.view, function (loadViewData) {
			if (loadViewData.view == "") {
				loadViewData = {
					view: "[]"
				}
			}
			dom.sync.dataView = JSON.parse(loadViewData.view);
			isset = dom.sync.dataView.indexOf(dom.season[dom.now][1]);
			if (isset == -1) {
				dom.sync.dataView[dom.sync.dataView.length] = dom.season[dom.now][1];
				dom.sync.view.view = JSON.stringify(dom.sync.dataView);
				chrome.storage.sync.set(dom.sync.view, function () {
				});
			}
			//console.log(dom.sync.dataView);
			dom.make.listBox();
		});

		/*
		dom.sync.get(function(event){
			console.log(event);
			dom.sync.set(function(){
				console.log("sync clear");
			});
		});
		*/
	}
}
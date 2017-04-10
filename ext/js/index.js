var dom = {
	url: location,
	urlBase: location.pathname.split("/"),
	src: [],
	img: [],
	season: [],
	nowView: 1,
	addSrc: function (name) {
		this.src.push(name);
	},
	addImg: function (name) {
		this.img.push(name);
	},
	make: {
		img: function () {
			for (i = 0; i < dom.img.length; i++) {
				if(opt.set["CATAssistant"] == false) $("body").append("<img src='" + dom.url.origin + dom.img[i] + "' count='" + i + "' class='view'>");
				/*
				src = dom.url.origin+dom.img[i].attributes[2].value;
				console.log(dom.img[i].attributes[2]);
				$("body").append("<img src='"+src+"' count='"+i+"'>");
				*/
			};
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
		lockBox: function () {
			$("body").append("<div class='wac5 box lock-box mt-p10 p10'><div class='b3'>이 페이지는 잠겨 있습니다.</div></div>");
			$("div.lock-box").append("<form action='" + location.href + "' class='wac8 b4 mt20' method='POST'><input type='password' name='pass' placeholder='비밀번호 입력' class='w12'><button class='btn oran w12 mt10'>확인</form>");
		},
		listBox: function () {
			$("div.view-header").append("<div class='list-box b5 w12 hide'></div>");
			$.each(dom.season, function (i, list) {
				if (dom.sync.dataView.indexOf(list[1]) == -1) color = "tblue";
				else color = "tgrey";
				if (i != 0) $(".list-box").append("<span class='l p10'> | </span>");
				$(".list-box").append("<a href='http://wasabisyrup.com/archives/" + list[1] + "'><span class='" + color + " p10'>" + list[0] + "</span></a>");
			});
		}
	},
	now: {
	},
	name: {
		base: $("title").html(),
		title: function () {
			arr = this.base.split(' ');
			name = '';
			if (arr[arr.length - 1].search("/(-|~)/i") != -1) arr[arr.length - 1] = '';
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
opt = {
      set: {
            "CATAssistant": false,
            "autoBookMark": true,
            "denyRequest": true,
            "forcedRemove": true
      },
      off: false
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
				dom.addImg(content.attributes[2].value);
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
			});
		}());

		if ($("form").length != 0) dom.lock = true;
		else dom.lock = false;
		dom.name.base = $("div.article-title").attr("title");
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
		if (dom.lock == true && dom.img.length == 0) dom.make.lockBox();
		else dom.make.img();
		dom.make.header();
		dom.make.nowPage();
		$("body").addClass("show");

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
					} else $("div.view-header").addClass("bye");
				}
				else { //up
					//Replace this with your function call for upward-scrolling
					$("div.view-header").removeClass("bye");
					//if(
				}
				//scroll
				$.each($("img.view"), function (i, list) {
					if ($(list).offset().top - ($(window).height() / 3) > $(window).scrollTop()) {
						$("span.now").html($(list).attr("count"));
						return false;
					}
				});
				//Updates scroll position
				lastScroll = st;
			});
		});

		$(document).on("click", ".header-list", function () {
			$(".list-box").toggleClass("hide");
		});

		//save sync
		if(opt.set["autoBookMark"] == true){
			chrome.storage.sync.get(dom.sync.save, function (loadData) {
				if (loadData == undefined || loadData.json == "") {
					loadData = {
						json: "[]"
					}
				} else {
					dom.sync.data = JSON.parse(loadData.json);
				}
				if (dom.sync.data.length > 100) dom.sync.data = dom.sync.data.slice(1);
				save = dom.sync.data;
				var saveNo = -1;

				save.forEach(function (list, i) {
					if (list.name == dom.name.title()) {
						saveNo = i;
					}
				});


				if (saveNo == -1) saveNo = save.length;
				reg = dom.season[dom.now][0].search(/[\uAC00-\uAD8B-\uAD8D-\uD0C3-\uD0C5-\uD3B7-\uD3B9-\uD653-\uD655-\uD7A3]+/i);
				if (reg == -1) {
					save[saveNo] = {
						name: dom.name.title(),
						size: dom.season.length,
						link: dom.season[dom.now]
					}
				}
				dom.sync.save.json = JSON.stringify(save);
					chrome.storage.sync.set(dom.sync.save, function () {
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
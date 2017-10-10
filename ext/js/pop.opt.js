save = { json: "" }
nameArray = ["CAT 보조","북마크 자동 저장", "script 차단", "root 강제 제거"];
infoArray = [
      "Comic Asstants Tool호환 모드로 작동합니다.<br>CAT를 사용하지 않으실 경우 꺼주세요.",
      "보고있는 만화를 자동으로 클리너 북마크에 저장합니다.",
      "마루마루 페이지에서 자동으로 불러와지는 script를 자동으로 차단합니다.<br> <span class='small'>해제시 페이지 로딩속도가 느려질 수 있습니다.</span>",
      "root문서를 강제로 제거하고 페이지를 새로 만듭니다. <br> <span class='small'>해제시 페이지 로딩속도가 느려질 수 있습니다.</span>"
];
chrome.storage.sync.get("opt", function (load) {
      if (load.opt == undefined || load.opt == "");
      else{
            opt = load.opt;
            if(load.opt.keyMove == undefined) opt.keyMove = 1;
            else opt.keyMove = load.opt.keyMove;
            //opt.keyMove = load.opt.keyMove == undefined ? 1 : load.opt.keyMove;
            $.each(load.opt.set,function(name,bool){
                  if(opt.set.name == undefined) return;
                  else opt.set.name = bool;
            });
      }

      var entry = 0;
      $.each(opt.set, function (name, bool) {
            if (bool == true) $("ul.on-opt").append("<li class='w12 toggling hand p7' opt='" + name + "'><div class='hide'>"+infoArray[entry]+"</div><span class='bold'>" + nameArray[entry] + "</span> 사용</li>");
            else $("ul.off-opt").append("<li class='w12 toggling hand p7' opt='" + name + "'><div class='hide'>"+infoArray[entry]+"</div><span class='bold'>" + nameArray[entry] + "</span> 사용</li>");
            entry++;
      })
      if(opt.keyMove == 1) $("button.btn-left").addClass("use");
      else if(opt.keyMove == 2) $("button.btn-down").addClass("use");
      else if(opt.keyMove == 3) $("button.btn-right").addClass("use");
      else if(opt.keyMove == 0) $("button.btn-false").addClass("use");
      else $("button.btn-false").addClass("use");
});
var saveOpt = function (opt) {
      chrome.storage.sync.set({ "opt": opt }, function () { })
}
var moveMain = function () {
       location.href = "./popup.html";
}
$(document).ready(function () {
      
      if (opt.off == true) $(".extension-off").addClass("blue").removeClass("red").html("사용시작");
      $(document).on("click", "button.remove-all", function () {
            chrome.storage.sync.set(save, function () {
               moveMain();
            });
      })
      $(document).on("click", "button.back", function () {
            moveMain();
      })
      $(document).on("click", "li.toggling", function () {
            var type = $(this).parent().hasClass("on-opt");
            if (type == true) {
                  $(this).appendTo("ul.off-opt");
                  opt.set[$(this).attr("opt")] = false;
                  saveOpt(opt);
            } else {
                  $(this).appendTo("ul.on-opt");
                  opt.set[$(this).attr("opt")] = true;
                  saveOpt(opt);
            }
      })

      $(document).on("click", ".extension-off", function () {
            opt.off = !opt.off;
            saveOpt(opt);
            moveMain();
      });
      $(document).on("click","button.keypad-change",function(){
            key = $(this).attr("key");
            opt.keyMove = key;
            saveOpt(opt);

            $("button.keypad-change").removeClass("use");
            $(this).addClass("use");
      })
});
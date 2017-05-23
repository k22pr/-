save = { json: "" }
opt = {
      set: {
            "CATAssistant": false,
            "QuickKey": true,
            "autoBookMark": true,
            "denyRequest": true,
            "forcedRemove": true
      },
      off: false
}
nameArray = ["CAT 보조", "키보드로 움직이기","북마크 자동 저장", "script 차단", "root 강제 제거"];
infoArray = [
      "Comic Asstants Tool호환 모드로 작동합니다.<br>CAT를 사용하지 않으실 경우 꺼주세요.",
      "방향키를 이용해 만화 페이지를 이동 할 수 있습니다.",
      "보고있는 만화를 자동으로 클리너 북마크에 저장합니다.",
      "마루마루 페이지에서 자동으로 불러와지는 script를 자동으로 차단합니다.<br> <span class='small'>해제시 페이지 로딩속도가 느려질 수 있습니다.</span>",
      "root문서를 강제로 제거하고 페이지를 새로 만듭니다. <br> <span class='small'>해제시 페이지 로딩속도가 느려질 수 있습니다.</span>"
];
chrome.storage.sync.get({ "opt": opt }, function (load) {
      if (load == undefined || load == "");
      else opt = load.opt;
      console.log(load);

      var entry = 0;
      $.each(opt.set, function (name, bool) {
            if (bool == true) $("ul.on-opt").append("<li class='w12 toggling hand' opt='" + name + "'><div class='hide'>"+infoArray[entry]+"</div><span class='bold'>" + nameArray[entry] + "</span> 사용</li>");
            else $("ul.off-opt").append("<li class='w12 toggling hand' opt='" + name + "'><div class='hide'>"+infoArray[entry]+"</div><span class='bold'>" + nameArray[entry] + "</span> 사용</li>");
            entry++;
      })
});
var saveOpt = function (opt) {
      chrome.storage.sync.set({ "opt": opt }, function () { })
}
var moveMain = function () {
       location.href = "./popup.html";
}
$(document).ready(function () {
      console.log(opt);
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
      //otions popup infomation
      $(document).on("mouseover", "li.toggling", function () {
            $("body").append("<div class='popBox'></div>")
            $("div.popBox").html($(this).children("div.hide").html());
            offsetX = Number($(this).offset().top) - Number($("div.popBox").outerHeight()) - 20;
            console.log(offsetX);
            $("div.popBOx").css("top", offsetX);
      })
      $(document).on("mouseout", "li.toggling", function () {
            $("div.popBox").remove();
      })

      $(document).on("click", ".extension-off", function () {
            opt.off = !opt.off;
            saveOpt(opt);
            moveMain();
      });
});
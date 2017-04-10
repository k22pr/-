save = { json: "" }
opt = {
      set: {
            "CATAssistant": false,
            "autoBookMark": true,
            "denyRequest": true,
            "forcedRemove": true
      },
      off: false
}
nameArray = ["CAT 보조", "북마크 자동 저장", "script 차단", "root 강제 제거"]
chrome.storage.sync.get({ "opt": opt }, function (load) {
      if (load == undefined || load == "");
      else opt = load.opt;
      console.log(load);

      var entry = 0;
      $.each(opt.set, function (name, bool) {
            if (bool == true) $("ul.on-opt").append("<li class='w12 toggling hand' opt='" + name + "'><span class='bold'>" + nameArray[entry] + "</span> 변경</li>");
            else $("ul.off-opt").append("<li class='w12 toggling hand' opt='" + name + "'><span class='bold'>" + nameArray[entry] + "</span> 변경</li>");
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
      $(document).on("click", ".extension-off", function () {
            opt.off = !opt.off;
            saveOpt(opt);
            moveMain();
      });
});
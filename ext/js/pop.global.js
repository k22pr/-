var opt = {
      set: {
            "CATAssistant": false,
            "autoBookMark": true,
            "denyRequest": true,
            "forcedRemove": true
      },
      off: false,
      keyMove : 1,
      lastUpdate : 0
}

$(document).ready(function(){
      //otions popup infomation
      $(document).on("mouseover", ".toggling, div.popBox", function () {
        $("body").append("<div class='popBox'></div>")
        $("div.popBox").html($(this).children("div.hide").html());
        offsetX = Number($(this).offset().top) - Number($("div.popBox").outerHeight()) - 10;
        $("div.popBox").css("top", offsetX);
      })
      $(document).on("mouseout", ".toggling", function () {
        $("div.popBox").remove();
      })
      
	
      var saveOpt = function (opt) {
        chrome.storage.sync.set({ "opt": opt }, function () { })
      }
});
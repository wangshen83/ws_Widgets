(function($){
	$.fn.wsTabs = function(settings){
		var options = {
			active: 1,
			event: "click"
		};
		
		$.extend(options, settings);
		return this.each( 
			function(){
				var target = $(this);
				
				var initTabs = function(){
					if(target && target.find("ul")){
						target.removeClass().addClass("ws-tabs");
						var tabList = target.find("ul").addClass("ws-tabs-ul clearfix");
						if(options.active){
							tabList.find("li:nth-child(" + options.active + "):has(a[href])").addClass("ws-tabs-active");
							var num = options.active - 1;
							if(panel = target.find("div:eq(" + num + ")")){
								panel.addClass("ws-tabs-panel").show();
								panel.siblings("div").addClass("ws-tabs-panel").hide();
							}
						}
						tabList.find("li:not(:nth-child(" + options.active + ")):has(a[href])").addClass("ws-tabs-default");
					}
				};
				
				initTabs();
				
				target.find("ul li a").on(options.event, function(){
					$(this).parent().parent().find("li").removeClass("ws-tabs-active").addClass("ws-tabs-default");
					$(this).parent().removeClass("ws-tabs-default").addClass("ws-tabs-active");
					
					var index = $(this).attr("href");
					index = index.substring(1);
					if(panel = target.find("div#" + index)){
						panel.addClass("ws-tabs-panel").show();
						panel.siblings("div").addClass("ws-tabs-panel").hide();
					}
				});
			}	
		);
	}
})(jQuery);
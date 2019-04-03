$(function() {
	var listN = $(".bannerUl li").size();
	for (i = 0; i < listN; i++) {
		$(".bannerbtn").append('<span></span>');
	}
	$(".bannerUl li").eq(0).css({
		"display": "block",
		"z-index": 6
	}).fadeIn(600);
	$(".bannerbtn span").eq(0).addClass("on");
	$(".bannerTxt").eq(0).stop().animate({
		"margin-left": "-500",
		opacity: 1
	});
	var sw = 1;
	$(".bannerbtn span").mouseover(function() {
		sw = $(".bannerbtn span").index(this);
		myShow(sw);
		clearInterval(myTime);
	});

	function myShow(i) {
		$(".bannerUl ul li").eq(i).css({
			"display": "block",
			"z-index": 6
		}).stop(true, true).fadeIn(600).siblings("li").css("z-index", "5").fadeOut(600);
		$(".bannerTxt").css({
			"margin-left": 0,
			opacity: 0
		});
		$(".bannerUl ul li").eq(i).find(".bannerTxt").stop().animate({
			"margin-left": "-500",
			opacity: 1
		}, 1500, "easeInOutQuint");
		$(".bannerbtn span").eq(i).addClass("on").siblings("span").removeClass("on");
	}

	//滑入停止动画，滑出开始动画
	$(".bannerUl").hover(function() {
		if (myTime) {
			clearInterval(myTime);
		}
	}, function() {
		myTime = setInterval(function() {
			myShow(sw)
			sw++;
			if (sw == listN) {
				sw = 0;
			}
		}, 6000);
	});
	//自动开始
	var myTime = setInterval(function() {
		myShow(sw);
		sw++;
		if (sw == listN) {
			sw = 0;
		}
	}, 6000);
})

jquery(".ssada").on('click', '.selector', function(event) {
	jquery(this).siblings().removeClass('.current').end().addClass('.nav');
});
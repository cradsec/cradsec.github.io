///// IE8-IE10対応 /////
function alertIE(){
		var ua = navigator.userAgent;
		if ( ua.indexOf('MSIE 8') !== -1 || ua.indexOf('MSIE 9') !== -1 || ua.indexOf('MSIE 10') !== -1) {
				$('body').prepend(
						'<div class="IE">お使いのInternet Explorerは古いバージョンのため、ホームページが正しく表示されない可能性があります。<br>最新のバージョンにアップデートするか、別のブラウザからご利用ください。</div>'
				);
		}
}

//SP_gnav
$(function(){
	$('.menu_trigger').click(function(){
		$('.menu').fadeToggle(500);
		$('.menu_trigger').toggleClass('active');
		$(".layer").stop().fadeToggle();
	});
	$('.close').click(function(){
		$('.menu').fadeToggle(500);
		$('.layer').stop().fadeToggle();
		$('.menu_trigger').toggleClass('active');
	});
});

$(function(){
	if (window.matchMedia( '(max-width: 768px)' ).matches){
		$('.menu li a').click(function(){
		$('.menu').slideToggle(500);
		$('.layer').stop().fadeToggle();
		$('.menu_trigger').toggleClass('active dl-active');
	});
	}
});

//ページトップJS
$(function() {
	var topBtn = $('#page-top');
	topBtn.hide();
	//スクロールが100に達したらボタン表示
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			topBtn.fadeIn();
		} else {
			topBtn.fadeOut();
		}
	});
	//スクロールしてトップ
	topBtn.click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 600);
		return false;
	});
});



//telタグPC無効
var ua = navigator.userAgent;
if (ua.indexOf('iPhone') < 0 && ua.indexOf('Android') < 0) {
	$('a[href^="tel:"]').css('cursor', 'default').click(function (event) {
		event.preventDefault();
	});
}

//ViewPort切り替え
$(function(){
	var ua = navigator.userAgent;
	if((ua.indexOf('iPhone') > 0) || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
		$('head').prepend('<meta name="viewport" content="width=device-width,initial-scale=1">');
	} else {
		$('head').prepend('<meta name="viewport" content="width=768">');
	}
});




  var $win = $(window),
      $main = $('#main'),
      $nav = $('header'),
      navHeight = $nav.outerHeight(),
      navPos = $nav.offset().top,
      fixedClass = 'is-show';

  $win.on('load scroll', function() {
    if ($(window).width() > 768) {
    var value = $(this).scrollTop();
    if ( value > navPos ) {
      $nav.addClass(fixedClass);
      $main.css('margin-top', navHeight);
    } else {
      $nav.removeClass(fixedClass);
      $main.css('margin-top', '0');
    };
  };
  });




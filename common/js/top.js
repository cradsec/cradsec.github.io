



$(function() {
	
    $('.slick-box').slick({
        dots: false,
        infinite: true,
        autoplay:true,
        speed: 1200,
        autoplaySpeed : 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        
    //レスポンシブでの動作を指定
    responsive: [{
      breakpoint: 768,  //ブレイクポイントを指定
      settings: {
        centerMode: false,
      }
      }]
    });

	const slider = $(".member_box");
	const windowHeight = $(window).height();

  // Slick Sliderを初期化し、自動再生を無効にする
  slider.slick({
    autoplay: false,
	slidesToShow: 3,
	slidesToScroll: 1,
	
//レスポンシブでの動作を指定
responsive: [{
  breakpoint: 1000,  //ブレイクポイントを指定
  settings: {
	centerMode: false,
	slidesToShow: 2,
  }
  },{
	breakpoint: 600,  //ブレイクポイントを指定
	settings: {
	  centerMode: false,
	  slidesToShow: 1,
	}
	}]
  });
  // スライダーが画面内に入ったときに自動再生を有効にする処理
  slider.on("init", function () {
    // Slick Sliderが初期化されたときの処理
    if (slider.height() <= windowHeight) {
      // スライダーの高さがウィンドウの高さ以下の場合、自動再生を有効にする
      slider.slick("slickPlay");
    }
  });

  $(window).on("scroll", function () {
    const rect = slider[0].getBoundingClientRect();
    if (rect.top < windowHeight && rect.bottom >= 0) {
      // スライダーが画面内に入った場合、自動再生を有効にする
      slider.slick("slickPlay");
    } else {
      // 画面外に出た場合、自動再生を停止
      slider.slick("slickPause");
    }
  });
  // ウィンドウがリサイズされたときに再評価する
  $(window).on("resize", function () {
    if (slider.height() <= windowHeight) {
      // スライダーの高さがウィンドウの高さ以下の場合、自動再生を有効にする
      slider.slick("slickPlay");
    }
  });
});


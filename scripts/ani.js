//
// state
var musicOk = false;
var state_ready = false;
var dev = ( localStorage.devMode && true ) || false;

//
// timing constants
var dur_still = 6500;
var dur_trans = 1500;
var dur_fade = 700;

if(dev){
   var dur_still = 1000;
   var dur_trans = 700;
   var dur_fade = 700;
}

var period = dur_still + dur_trans;

//
// animations

function makeFade(el, toVisible, dur) { // function factory
	var op = toVisible ? "1.0" : "0.0";
	dur = dur || dur_trans;
	return function() {el.animate({opacity:op}, dur);};
}

function makeCrossFade(el1, el2, dur) { // function factory
	dur = dur || dur_trans;
	return function() {
		$(el1).animate({opacity:"0"}, dur);
		$(el2).animate({opacity:"1"}, dur);
	};
}

var dropEnvelope = function(dur) {
   dur = dur || dur_trans;
   
   $("#env-front, #env-back")
   	.animate({marginTop:"+=480px"}, dur)
   	.animate({opacity:"0.0"}, dur);
   setTimeout(function(){ $("#env-front, #env-back").hide();}, dur*2 + 200 );
};

var fadeInLinks = function() { 
	$("#links").css({left:"0px"});
	$("#links").animate({opacity:"1.0"}, dur_fade);
};

var fadeOutLinks = function() { 
	$("#links").animate({opacity:"0.0"}, dur_fade, function(){$("#links").css({left:"-9999px"});});
};

var growLogo = function() { $("#logo").animate({top: "120px", left: "100px", width:"398px", height: "166px"}, dur_trans); };

// todo: put this in the script. 
var reset = function() { 
   fadeOutLinks();
   $("#logo").animate({left:"30px", top:"30px", width: "163px", height:"60px" }, dur_trans);
   $("#slide2, #slide3, #slide4", "#slide5").css({opacity:"0"});
   if(musicOk){
      $("#jplayer").jPlayer("play", 0);
   }
   stage(script_play);
};

var play = function() {
	$("#env-front, #env-back").css("opacity","1.0");
	makeFade($("#env-sealed, #click-to-open"),false, 300)();
  	if(musicOk) {
      $("#jplayer").jPlayer("play", 0);
   }
   setTimeout( function(){ dropEnvelope(dur_trans); }, 800);
   setTimeout( function(){ $("#env-sealed, #click-to-open").hide(); }, 800 + dur_trans);
   stage(script_play, 800 + dur_trans * 2 );
};

//
// components

var slide1Sparkles = [
	{x:  98, y: 325, size:14},
	{x: 461, y: 370, size:12},
	{x: 470, y: 392, size:14},
	{x:  86, y: 369, size:12},
	{x: 421, y: 398, size:12},	
	{x:  78, y: 345, size:12},
	{x: 445, y: 403, size:17}
];

var slide2Sparkles = [
	{x: 392, y:	343, size: 17},
   {x: 132, y:	394, size: 14},
   {x: 157, y:	406, size: 17},
   {x: 183, y:	400, size: 12},
   {x: 412, y:	363, size: 14},
   {x: 140, y:	372, size: 12},
   {x: 404, y:	387, size: 14}
];

var slide3Sparkles = [
   {x: 115, y:	359, size: 17},
   {x: 427, y:	386, size: 12},
   {x: 177, y:	339, size: 12},
   {x: 121, y:	386, size: 14},
   {x: 407, y:	406, size: 14},
   {x: 146, y:	327, size: 14},
   {x: 419, y:	361, size: 12}
];

var slide4Sparkles = [
   {x:  52,	y: 393, size: 14},
   {x: 501, y:	354, size: 14},
   {x:  72,	y: 413, size: 17},
   {x:  59,	y: 369, size: 14},
   {x: 477, y:	342, size: 17},
   {x: 494, y:	376, size: 12},
   {x: 451, y:	348, size: 12}
];

var script_play = [   
   { when: 0 * period, what: makeCrossFade("#slide5, #slide4, #slide3, #slide2", "#slide1")},
   { when: 0 * period, what: function(){window.sparkle.flourish(slide1Sparkles, dur_still);} },
   
   { when: 1 * period, what: makeCrossFade("#slide1", "#slide2")},
   { when: 1 * period, what: function(){window.sparkle.flourish(slide2Sparkles, dur_still);} },
   
   { when: 2 * period, what: makeCrossFade("#slide2", "#slide3")},
   { when: 2 * period, what: function(){window.sparkle.flourish(slide3Sparkles, dur_still);} },
   
   { when: 3 * period, what: makeCrossFade("#slide3", "#slide4")},
   { when: 3 * period, what: function(){window.sparkle.flourish(slide4Sparkles, dur_still);} },
   
   { when: 4 * period, what: makeCrossFade("#slide4", "#slide5")},
   { when: 4 * period, what: growLogo },
   { when: 4 * period + dur_trans, what: fadeInLinks } 
];

// todo: this is not the best way to animate, because minimizing/tabbing will cause all the delays to fire simultaneously - use an active polling at given intervals, which
// maintains its own time elapsed vars and effectively pauses when the window/tab is not in view. 
function stage(script, delay){
   delay = delay || 0;
   $.each(script, function(i, action) {
      setTimeout(action.what, action.when + delay);
   });
}

//
// wiring 

function getReady() {
	setTimeout(function(){
		state_ready = true;
		$("#innerFrame, #backdrop, #slide1, #logo").css("opacity", "1.0");
		$("#click-to-open").show().animate({opacity:"1.0"},500);
	}, 1000);
}

$(function() {
   window.sparkle.init("sparkles", 600, 500);
   
     
   $("#click-to-open").click(function(){
   	if(state_ready) {
   		play();
   		state_ready = false;
   	}
   });
   
   $("#jplayer").jPlayer( {
  		// errorAlerts: true,
  		// warningAlerts: true,
  		swfPath: "http://aisdevstorage.blob.core.windows.net/aisholidaycard/media/",
  		supplied: "mp3",
		loop: false, //
		volume: dev ? 0.3 : 1.0,
  		ready: function() {
  			$(this).jPlayer("setMedia", {
            mp3: "http://aisdevstorage.blob.core.windows.net/aisholidaycard/media/bgm.mp3"
    		});
			musicOk = true;
         getReady();
  		},
      error: function() {
         getReady();
      }
	});
   
   $("#replay").click(function(){
     reset();
   });
   
   //"fix" AIS link
   $('a[href="http://appliedis.com"]').attr("href", "http://www.appliedis.com");
});

// click event marshalling
var state = "start";

//
// spacing contants

var imageWidth = 563;
var imageHeight = 431;
var imagePadding = 18; //on each side

var xMove = imageWidth + (imagePadding * 2);
var yMove = imageHeight + (imagePadding * 2); 

//
// timing constants

var dur_still = 1200;
var dur_trans = 800;
var dur_fadeIn = 400;
var dur_fadeOut = 400;

var period = dur_trans + dur_fadeIn + dur_still + dur_fadeOut;
var wait_fadeOut = dur_fadeIn + dur_still;
var wait_slide = dur_fadeIn + dur_still + dur_fadeOut;

//
// animations

var slideTo2 = function() {
   $("#slides").animate({left: "-=" + xMove + "px"}, dur_trans ); 
   $("#text").animate({left: "-=" + xMove + "px"}, dur_trans );
};

var slideTo3 = function() {
   $("#slides").animate({top:  "-=" + yMove + "px"}, dur_trans );
   $("#text").animate({left: "-=" + xMove + "px"}, dur_trans );
};

var slideTo4 = function() {
   $("#slides").animate({left: "+=" + xMove + "px"}, dur_trans );
   $("#text").animate({left: "-=" + xMove + "px"}, dur_trans );
};

var slideTo5 = function() {
   $("#slides").animate({top:  "-=" + yMove + "px"}, dur_trans );
   $("#text").animate({left: "-=" + xMove + "px"}, dur_trans );
};

var fadeInText = function() { $("#text").animate({opacity:"1.0"}, dur_fadeIn)};
var fadeOutText = function() { $("#text").animate({opacity:"0.0"}, dur_fadeOut)};

var fadeInLinks = function() { 
	$("#links").css({left:"0px"});
	$("#links").animate({opacity:"1.0"}, dur_fadeIn);
};

var fadeOutLinks = function() { 
	$("#links").animate({opacity:"0.0"}, dur_fadeOut, function(){$("#links").css({left:"-9999px"});});
};

var growLogo = function() { $("#logo").animate({top: "120px", left: "100px", width:"398px", height: "166px"}, dur_trans); };
//var shrinkLogo = function() { $("#logo").animate({top: "-=70px", left: "-=50px", width:"-=250px"}, 500); };

var reset = function() { 
   $("#slides").animate({top: "+=" + 2 * yMove + "px"}, dur_trans);
   $("#text").animate({left:"0px"}, dur_trans);
   fadeOutLinks();
   $("#logo").animate({left:"30px", top:"30px", width: "163px", height:"60px" }, dur_trans);  //todo: use class based animation here.
}

//
// components

var script_play = [
   { when: 0, what: function(){ state = "busy"; } },
   { when: 0 * period, what: fadeInText }, 
   { when: 0 * period + wait_fadeOut, what: fadeOutText }, 
   { when: 0 * period + wait_slide, what: slideTo2 },
   
   { when: 1 * period, what: fadeInText }, 
   { when: 1 * period + wait_fadeOut, what: fadeOutText }, 
   { when: 1 * period + wait_slide, what: slideTo3 },   
   
   { when: 2 * period, what: fadeInText }, 
   { when: 2 * period + wait_fadeOut, what: fadeOutText }, 
   { when: 2 * period + wait_slide, what: slideTo4 },   
   
   { when: 3 * period, what: fadeInText }, 
   { when: 3 * period + wait_fadeOut, what: fadeOutText }, 
   { when: 3 * period + wait_slide, what: slideTo5 },
   
   { when: 4 * period, what: growLogo },
   { when: 4 * period + dur_trans, what: fadeInLinks }, 
   { when: 4 * period + 500, what: function(){state = "done";} }
];

var script_reset = [
   { when : 0, what: reset },
   { when : dur_trans + 100, what: function(){state="start";} }
]

// todo: this is not the best way to animate, because minimizing/tabbing will cause all the delays to fire simultaneously - use an active polling at given intervals, which
// maintains its own time elapsed vars and effectively pauses when the window/tab is not in view. 
function stage(script){
   $.each(script, function(i, action) {
      setTimeout(action.what, action.when);
   });
}

//
// wiring 

$(function() {
   $("#innerFrame").click(function(){
      switch (state) {
         case "start":
            stage(script_play);
         break
         
         case "done" :
            stage(script_reset);
         break
         
         default :
      }
   });
});

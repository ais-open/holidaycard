
window.sparkle = function(){
	
	var _paper = null;
	
	var _sparkleAttr = {
		fill: "#f00",
		stroke: "none"
	};
	
	var my = {};
	
	my.init = function() {
		_paper = Raphael(10, 50, 320, 200);
	}
	
	my.testPoints = [
		{x:100,y:100, size:20},
		{x:140,y:100, size:20},
		{x:140,y:140, size:20},
		{x:100,y:140, size:20},
		{x:120,y:120, size:40}
	];
	
	my.flourish = function (points, duration){
		var self = this;
		var sparkleDuration = duration * 3 / 5 // sparkles will last 3/5 of total duration.  
		var burstInterval = duration * 2 / 5 / points.length; // 2/5 of total duration will be used to launch sparkles 
		for(var i = 0; i<points.length; i++) {
				var point = points[i];
				this.drawSparkle(point.x, point.y, point.size, sparkleDuration, burstInterval*i);
		}
	};
	
	
	my.drawSparkle = function(x, y, size, duration, delay){		
		size = size || 10;
		duration = duration || 800;
		delay = delay || 0;
		
		var aniGrow = Raphael.animation({transform:"S1,1"},duration * 0.6,"backOut").delay(delay);
		var aniFade = Raphael.animation({opacity:"0"}, duration * 0.2).delay(delay+duration);
		
		var topX = x;
		var topY = y-size;
		var rgtX = x+size;
		var rgtY = y;
		var btmX = x;
		var btmY = y+size;
		var lftX = x-size;
		var lftY = y; 
				
		var p = [];
		p.push("M"+topX+" "+topY);
		p.push("C"+x+" "+y+" "+x+" "+y+" "+rgtX+" "+rgtY);
		p.push("C"+x+" "+y+" "+x+" "+y+" "+btmX+" "+btmY);
		p.push("C"+x+" "+y+" "+x+" "+y+" "+lftX+" "+lftY);
		p.push("C"+x+" "+y+" "+x+" "+y+" "+topX+" "+topY);
		p = p.join("");
		
		
		var sparkle = _paper.path( p ).attr(_sparkleAttr).scale(0,0);
		sparkle.animate(aniGrow);
		sparkle.animate(aniFade);
	};
	
	return my;	
}();

$(function(){
	window.sparkle.init();
	sparkle.flourish(sparkle.testPoints, 2000);
})

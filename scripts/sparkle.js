window.sparkle = function(){
	
	var _paper = null;
	
	var _sparkleAttr = {
		fill: "#fff",
		stroke: "none"
	};
	
	var my = {};
	
	my.init = function(rootElement, w, h){
		_paper = Raphael(rootElement, w, h);
	};
		
	my.flourish = function (points, duration){
		var self = this;
		var sparkleDuration = duration * 4 / 5; // sparkles will last 4/5 of total duration.  
		var burstInterval = duration * 1 / 5 / points.length; // 1/5 of total duration will be used to launch sparkles 
		for(var i = 0; i<points.length; i++) {
				var point = points[i];
				this.drawSparkle(point.x, point.y, point.size, sparkleDuration, burstInterval*i);
		}
	};
	
	my.drawSparkle = function(x, y, size, duration, delay){		
		size = size || 10;
		duration = duration || 800;
		delay = delay || 0;
		
		var aniGrow = Raphael.animation({transform:"S1,1"},duration * 0.4,"backOut").delay(delay);
		var aniFade = Raphael.animation({opacity:"0"}, duration * 0.2).delay(delay+duration);
		
		// see old lab/raf.js for + shaped sparkles instead of x shaped ones.  
		
		var p = [];
		p.push("M"+(x-size)+" "+(y-size)); // NW
		p.push("C"+x+" "+y+" "+x+" "+y+" "+(x+size)+" "+(y-size)); // NE
		p.push("C"+x+" "+y+" "+x+" "+y+" "+(x+size)+" "+(y+size)); // SE
		p.push("C"+x+" "+y+" "+x+" "+y+" "+(x-size)+" "+(y+size)); // SW
		p.push("C"+x+" "+y+" "+x+" "+y+" "+(x-size)+" "+(y-size)); // NW
		p = p.join("");
		
		var sparkle = _paper.path( p ).attr(_sparkleAttr).scale(0,0);
		sparkle.animate(aniGrow);
		sparkle.animate(aniFade);
	};
	
	return my;	
}();

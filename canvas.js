var space = new CanvasSpace("pt").setup( {bgcolor: "#252934"} );
var form = new Form( space );

var pts = [];
var center = space.size.$divide(2);
var line = new Line(center).to( space.size );
var r = Math.min( space.size.x, space.size.y ) * 1.5;

//controllers
var count = 1000;
var connectChance = 5;
var twinkleChance = 100;

//Create points and line connections
for (var i=0; i<count; i++) {
  //Generate start location
  var p = new Vector( Math.random()*r-Math.random()*r, Math.random()*r-Math.random()*r );
  p.moveBy( center ).rotate2D( i*Math.PI/count, center );

  //random star properites
  p.size = Math.random()*3;
  p.color = "rgba(255,255,"+ (255-Math.floor(Math.random()*100)+1) +",1)";
  p.pointCenter = new Vector(center.x+Math.random()*100, center.y+Math.random()*100, 0);
  p.rotateSpeed = (Math.random()*60)+60;

  //generate line connections
  if(Math.floor(Math.random()*100)+1 < connectChance) {
    if(i > 1) {
      var distance = [];
      for(var j = 0; j < i; j++) {
        var info = {};
        info.distance = Math.sqrt( Math.pow(p.x - pts[j].x, 2) + Math.pow(p.y - pts[j].y, 2) ); //Find the distance between two points
        info.index = j;
        distance.push(info);
      }
      distance.sort((a,b) => a.distance - b.distance);
      p.connectedTo = pts[distance[0].index]; //sets connected to star
    }
  }

  //Creates twinkling stars
  if(Math.floor(Math.random()*100)+1 < twinkleChance) {
    p.twinkle = true;
    p.twinkleSpeed = Math.random()*.01;
    p.state = 0;
  }

  pts.push( p ); //push to array
}

space.add({
  animate: function(time, fps, context) {
    for (var i=1; i<pts.length; i++) {

      var pt = pts[i];

      //Toggle twinkle state and sets size
      if(pt.twinkle && pt.size > 0 && pt.state == 0) {
        //Shrink star
        pt.size -= pt.twinkleSpeed;
        if(pt.size <= 0) {
          pt.state = 1;
          pt.size = 0;
        }
      } else if(pt.twinkle && pt.size < 3 && pt.state == 1) {
        //Grow Star
        pt.size += pt.twinkleSpeed;
        if(pt.size >= 3) {
          pt.state = 0;
        }
      }

      form.stroke( false ).fill( pt.color ).point( pt, pt.size, true );

      //Render line if it is with in range otherwise break and generate new line
      if(pt.connectedTo != null && distanceBetween(pt, pt.connectedTo) < 100) {
        var ln = new Line( pt ).to(pt.connectedTo);
        form.stroke( "rgba(255,255,255,.5)" ).line(ln);
      } else if(pt.connectedTo != null && distanceBetween(pt, pt.connectedTo) > 100) {
        //generate new line
        var distance = [];
        for(var j = 0; j < pts.length; j++) {
          var info = {};
          info.distance = Math.sqrt( Math.pow(pt.x - pts[j].x, 2) + Math.pow(pt.y - pts[j].y, 2) ); //Find the distance between two points
          info.index = j;
          distance.push(info);
        }
        distance.sort((a,b) => a.distance - b.distance);
        pt.connectedTo = pts[distance[1].index]; //sets connected to star
      }

      pt.rotate2D( Const.one_degree / pt.rotateSpeed, pt.pointCenter );
    }
  }
});

function distanceBetween(v1,v2) {
  return Math.sqrt( Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2) )
}


space.play();
function main()
{


//Wow, this is my first program to reach top of the hot list!!!!

//change distance to 100 and restart if you want a REAL challenge
var distance=122;
var rad=200;
var rtt=90;

//you can change this image if you want
var img=getImage("creatures/Winston");

background(0, 0, 0,0);
fill(255, 255, 255);
ellipse(200-distance/2,260,rad+1,rad+1);
var l=get();
background(0, 0, 0,0);
ellipse(200+distance/2,260,rad+1,rad+1);
var r=get();
background(255, 255, 255);
fill(0, 0, 0);
textSize(43);
text('Unscramble Winston',0,70);
fill(94, 94, 94);
textSize(24);
text("(now tells you when you've won)",30,110); 
textSize(15);
text('    Click on one of the 4 arrows to rotate the circle\n below it 90 degrees clockwise or counterclockwise',30,375);
fill(255, 255, 255);
ellipse(200-distance/2,260,rad,rad);
ellipse(200+distance/2,260,rad,rad);
image(img,100+distance/2,162,rad,rad);
line(46,160,120,140);
line(46,160,70,135);
line(46,160,70,170);
line(196,160+(distance-142)/5,130,140+(distance-142)/5);
line(196,160+(distance-142)/5,170,135+(distance-142)/5);
line(196,160+(distance-142)/5,166,165+(distance-142)/5);
line(206,160+(distance-142)/5,280,140+(distance-142)/5);
line(206,160+(distance-142)/5,225,135+(distance-142)/5);
line(206,160+(distance-142)/5,230,167+(distance-142)/5);
line(356,160,290,140);
line(356,160,327,135);
line(356,160,326,165);
var p1=get(240,220);
var a1=get(342,224);
var s1=get(311,320);
var d1=get(247,213);
var f1=get(200,250);
//scramble
      noFill();
      for(var q=0;q<5;q++){
 var g=get();
g.mask(l);
pushMatrix();
translate(200-distance/2,260);
rotate(90);
translate(-200+distance/2,-260);
image(g,0,0);
popMatrix();
ellipse(200-distance/2,260,rad,rad);
ellipse(200+distance/2,260,rad,rad);
var g=get();
g.mask(r);
pushMatrix();
translate(200+distance/2,260);
rotate(90);
translate(-200-distance/2,-260);
image(g,0,0);
popMatrix();
ellipse(200-distance/2,260,rad,rad);
ellipse(200+distance/2,260,rad,rad);
}
mousePressed = function(){
    if(mouseX<200){
        if(mouseX<100){
             rtt=-90;
        } else{
          rtt=90;   
        }
    var g=get();
g.mask(l);
pushMatrix();
translate(200-distance/2,260);
rotate(rtt);
translate(-200+distance/2,-260);
image(g,0,0);
popMatrix();
ellipse(200-distance/2,260,rad,rad);
ellipse(200+distance/2,260,rad,rad);
}
if(mouseX>199){
    if(mouseX>300){
             rtt=90;
        } else{
          rtt=-90;   
        }
var g=get();
g.mask(r);
pushMatrix();
translate(200+distance/2,260);
rotate(rtt);
translate(-200-distance/2,-260);
image(g,0,0);
popMatrix();
ellipse(200-distance/2,260,rad,rad);
ellipse(200+distance/2,260,rad,rad);
}
var f2=get(200,250);
var d2=get(247,213);
var s2=get(311,320);
var a2=get(342,224);
    var p2=get(240,220);
    if(p2===p1&&a2===a1&&s2===s1&&d2===d1&&f2===f1){
        fill(59, 56, 255);
        textSize(80);
        text('YOU WIN',10,250);
        noFill();
    } 
};
}

PJSLoader.loadSketch("canvas", main);
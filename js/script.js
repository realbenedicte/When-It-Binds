"use strict";

/**************************************************
Template p5 project
Pippin Barr

Here is a description of this template p5 project.
**************************************************/

let img01;
let img02;
let img03;
let img04;
let img05;
let img06;
let img07;
let img08;
let img09;

let imgZOffest = 100;


function preload()
{
  // load images
  img01 = loadImage('assets/images/Images_Layers/1creature.png');
  img02 = loadImage('assets/images/Images_Layers/2wispsleft.png');
  img03 = loadImage('assets/images/Images_Layers/3stars.png');
  img04 = loadImage('assets/images/Images_Layers/4wispsright.png');
  img05 = loadImage('assets/images/Images_Layers/5tail.png');
  img06 = loadImage('assets/images/Images_Layers/6blue.png');
  img07 = loadImage('assets/images/Images_Layers/7blue.png');
  img08 = loadImage('assets/images/Images_Layers/8white.png');
  img09 = loadImage("assets/images/Images_Layers/9background.png");
}
// setup()
//
// Description of setup() goes here.
function setup() {
  // set canvas size
  createCanvas(windowWidth, windowHeight, WEBGL);

}

// draw()
//
// Description of draw() goes here.
function draw() {
    //orbitControl();

push();
rotateY(frameCount * 0.002);
  var scale = 0.4;
  // display background image
  //image(img09, 0, 0, width, img09.height*width/img09.width);
  background(200);
  //translate(mouseX-width/2, mouseY-height/2);
  //background
  push();
    texture(img09);
    translate(0, 0, imgZOffest*-8);
    noStroke();
    plane(scale*width, scale*img09.height*width/img09.width)
  pop();

  //8th image
  push();
    texture(img08);
    translate(0, 0, imgZOffest*-7);
    noStroke();
    plane(scale*width, scale*img08.height*width/img08.width)
  pop();

  //7th image
  push();
    texture(img07);
    translate(0, 0, imgZOffest*-6);
    noStroke();
    plane(scale*width, scale*img07.height*width/img07.width)
  pop();

  //5th image
  push();
    texture(img05);
    translate(0, 0, imgZOffest*-5);
    noStroke();
    plane(scale*width, scale*img05.height*width/img05.width)
  pop();

//4th image
  push();
    texture(img04);
    translate(0, 0, imgZOffest*-4);
    noStroke();
    plane(scale*width, scale*img04.height*width/img04.width)
  pop();


  //3rd image
    push();
      texture(img03);
      translate(0, 0, imgZOffest*-3);
      noStroke();
      plane(scale*width, scale*img03.height*width/img03.width)
    pop();

    //2nd image
      push();
        texture(img02);
        translate(0, 0, imgZOffest*-2);
        noStroke();
        plane(scale*width, scale*img02.height*width/img02.width)
      pop();

      //1st image
        push();
          texture(img01);
          translate(0, 0, imgZOffest*-1);
          noStroke();
          plane(scale*width, scale*img01.height*width/img01.width)
        pop();
}

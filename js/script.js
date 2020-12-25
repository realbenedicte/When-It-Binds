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
  createCanvas(windowWidth, windowHeight);

}

// draw()
//
// Description of draw() goes here.
function draw() {

var scale = 0.5;
// display background image
image(img09, 0, 0, width, img09.height*width/img09.width);

push();
imageMode(CENTER);
image(img09, 0.5*width, 0.5*height, scale*width, scale*img09.height*width/img09.width); // to fit width
image(img08, 0.5*width, 0.5*height, scale*width, scale*img08.height*width/img08.width); // to fit width
image(img07, 0.5*width, 0.5*height, scale*width, scale*img07.height*width/img07.width); // to fit width
//image(img06, 0.5*width, 0.5*height, scale*width, scale*img06.height*width/img06.width); // to fit width
image(img05, 0.5*width, 0.5*height, scale*width, scale*img05.height*width/img05.width); // to fit width
image(img04, 0.5*width, 0.5*height, scale*width, scale*img04.height*width/img04.width); // to fit width
image(img03, 0.5*width, 0.5*height, scale*width, scale*img03.height*width/img03.width); // to fit width
image(img02, 0.5*width, 0.5*height, scale*width, scale*img02.height*width/img02.width); // to fit width
image(img01, mouseX, mouseY, scale*width, scale*img01.height*width/img01.width); // to fit width


pop();
}

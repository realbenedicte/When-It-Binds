"use strict";

/**************************************************
Bénédicte Webpage for When It Binds ~~ EP ~~
2021
**************************************************/

//Global Variables
//
//layered images
let img01;
let img02;
let img03;
let img04;
let img05;
// let img06;
let img07;
let img08;
let img09;

//how far image layers should be spaced apart
let imgZOffest = 100;
//album Title image
let whenItBinds;

//Fonts
let lapicideFont;
let mirageFont;

//Text
let titleText;
let albumTitle;
//let benedicteText;

//PLane Size
let planeX;
let planeY;

// preload()
//
//Preload Images and fonts
function preload() {
  // load images (right now using 1080x1080)
  img01 = loadImage('assets/images/1080/1creature.png');
  img02 = loadImage('assets/images/1080/2wispsleft.png');
  img03 = loadImage('assets/images/1080/3stars.png');
  img04 = loadImage('assets/images/1080/4wispsright.png');
  img05 = loadImage('assets/images/1080/5tail.png');
  // img06 = loadImage('assets/images/Images_Layers/6blue.png');
  img07 = loadImage('assets/images/1080/6blue.png');
  img08 = loadImage('assets/images/1080/7white.png');
  // img09 = loadImage("assets/images/1080/8background.png");
  img09 = loadImage("assets/images/1080/WIB-1080.png");
  //Title centered text
  whenItBinds = loadImage("assets/images/WhiteFont_SMALL.png");

  //benedicteText = loadImage("assets/images/benedicte.png");
  lapicideFont = loadFont('css/lapicide-light-webfont.woff');
}

// setup()
//
function setup() {
  //create canvas and make it window sized
  var cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.style('display', 'block');
  cnv.position(0, 0);
  cnv.style('z-index', '-1')
}

// windowResized()
//
//resize window!!!
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// draw()
//
function draw() {
  //Zoom on z with mouse Y movement
  background(220);
  //scale for how the layered images should be scaled
  //9th image

  push();
  if (windowWidth > 700) {
    var scale = 0.6;
    var scale2 = 0.6;
    //mousemovements
    push();
    texture(img09);
    translate(0, 0, imgZOffest * -8);
    noStroke();
    plane(700,700)
    pop();

    push();
    translate((mouseX - width / 2) / 4, 0, (mouseY - height / 2));
    //grey background

  //  rotateY(frameCount * 0.002);

      // //8th image
      // push();
      // texture(img08);
      // translate(0, 0, imgZOffest * -7);
      // noStroke();
      // plane(scale * width, scale * img08.height * width / img08.width)
      // pop();
      //
      // //7th image
      // push();
      // texture(img07);
      // translate(0, 0, imgZOffest * -6);
      // noStroke();
      // plane(scale * width, scale * img07.height * width / img07.width)
      // pop();

      //5th image
      push();
      texture(img05);
      translate(0, 0, imgZOffest * -5);
      noStroke();
      plane(scale * width, scale * img05.height * width / img05.width)
      pop();

      //4th image
      push();
      texture(img04);
      translate(0, 0, imgZOffest * -4);
      noStroke();
      plane(scale * width, scale * img04.height * width / img04.width)
      pop();

      //3rd image
      push();
      texture(img03);
      translate(0, 0, imgZOffest * -3);
      noStroke();
      plane(scale * width, scale * img03.height * width / img03.width)
      pop();

      //2nd image
      push();
      texture(img02);
      translate(0, 0, imgZOffest * -2);
      noStroke();
      plane(scale * width, scale * img02.height * width / img02.width)
      pop();

      //1st image
      push();
      texture(img01);
      translate(0, 0, imgZOffest * -1);
      noStroke();
      plane(scale * width, scale * img01.height * width / img01.width)
      pop();
      pop();

    pop();

  } else {
    rotateY(frameCount * 0.003);
    var scale = 1.8;
  }
pop();


  // //album Title image
  // push();
  // let whenItBindsScale = 0.6;
  // texture(whenItBinds);
  // translate(0, 0, 100);
  // noStroke();
  // plane(whenItBindsScale * width, whenItBindsScale * whenItBinds.height * width / whenItBinds.width);
  // pop();

}

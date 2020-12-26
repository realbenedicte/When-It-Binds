"use strict";

/**************************************************
Bénédicte Webpage for When It Binds
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
let img06;
let img07;
let img08;
let img09;

//how far image layers should be spaced apart
let imgZOffest = 100;
//album Title image
let whenItBinds;

//Font
let lapicideFont;
let mirageFont;

//Text
let titleText;
let albumTitle;
let benedicteText;

//PLane Size
let planeX;
let planeY;

// preload()
//
//Preload Images
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

  whenItBinds = loadImage("assets/images/WhiteFont.png");
  benedicteText = loadImage("assets/images/benedicte.png");
  lapicideFont = loadFont('assets/fonts/Lapicide-Light.ttf');
}

// setup()
//
function setup() {
  //create canvas and make it window sized
  var cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.style('display', 'block'); //formatting for css
  // titleText = new BasicText(-windowWidth/2 + 150, -windowHeight/2 + 120, 'Bénédicte', 50, lapicideFont);
  // albumTitle = new BasicText(0, 0, 'When It Binds', 50, lapicideFont);
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
  push();
  //mousemovements
  translate((mouseX-width/2)/4,0, (mouseY-height/2));
  //grey background
  background(220);
  //scale for how the layered images should be scaled
  var scale = 0.6;
  //rotateY(frameCount * 0.002);

  //9th image
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
        pop();

        // push();
        // titleText.display();
        // pop();

        // push();
        // textAlign(CENTER, CENTER);
        // albumTitle.display();
        // pop();

        push();
        let whenItBindsScale = 0.6;
        texture(whenItBinds);
        translate(0, 0, 100);
        noStroke();
        plane(whenItBindsScale*width, whenItBindsScale*whenItBinds.height*width/whenItBinds.width);
        pop();
        //
        push();
          let benedicteScale = 0.15;
          planeX = benedicteScale*windowWidth;
          planeY = benedicteScale*benedicteText.height*windowWidth/benedicteText.width;
          texture(benedicteText);
          noStroke();
          translate(-windowWidth/2 + (planeX + 30), -windowHeight/2 + (planeY+60), 100);
          plane(planeX, planeY);

          print(planeX);

        //width = width of SCREEN
        //the plane will be some percentage of the screen width ie. 20percent
        //the height of the plane is determined by percentofScreen (imageheight*width of screen/image width)
        //basically get ratio of image (height over width)
        pop();

      }

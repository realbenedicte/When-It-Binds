
window.addEventListener("resize", (e) => {
    SCREEN_W = window.innerWidth
})

let SCREEN_W = window.innerWidth
let SCREEN_H = window.innerHeight

console.log(SCREEN_W)
// function animateImage(obj) {

//   let maxWidth = obj.stretch ? SCREEN_W : obj.w
//   obj.x += obj.speed;
//   if (obj.x > maxWidth) {
//     obj.x = -maxWidth
//   }

//   document.getElementById(obj.id).style.transform = `translateX(${obj.x}px)`;
//   // console.log("got obj x", obj.x)
//   // console.log("got img ", obj.img)
//   requestAnimationFrame(() => animateImage(obj))
// }

// let bg = document.getElementById("blob-bg")
// let bfly = document.getElementById("butterfly")

// let animationObj = {
//   img: bg,
//   stretch: true,
//   id: "blob-bg",
//   speed: 1,
//   x: 0,
//   y: 0,
//   h: bg.height,
//   w: bg.width
// }

// let animationObj2 = {
//   img: bfly,
//   stretch: false,
//   id: "butterfly",
//   speed: 2,
//   x: 0,
//   y: 0,
//   h: bfly.height,
//   w: bfly.width
// }

// anime({
//   targets: '.mg img',
//   translateX: function(el, i) {
//     return SCREEN_W + (-SCREEN_W * i);
//   },
//   translateY: function(el, i) {
//     return SCREEN_W + (-SCREEN_W * i);
//   },
//   // scale: function(el, i, l) {
//   //   return (l - i) + .25;
//   // },
//   // rotate: function() { return anime.random(-360, 360); },
//   // borderRadius: function() { return ['50%', anime.random(10, 35) + '%']; },
//   // duration: function() { return anime.random(1200, 1800); },
//   delay: function() { return anime.random(0, 400); },
//   direction: 'alternate',
//   loop: true
// });
var loopBegan = 0
var loopCompleted = 0
let TARGET_START = 0

let butterfly = {
    startY: 0,
    endY: 0,
    startX: -1080,
    endX: SCREEN_W,
    duration: 16000,
    delay: 0,
}

let RANDOM_Y = 0

function updateRandom() {
    RANDOM_Y = anime.random(0, 1000)
}

anime({
    targets: ".mg img",
    translateX: (el, i) => {
        return [-el.width, SCREEN_W]
    },
    translateY: RANDOM_Y,
    duration: function () {
        return anime.random(5000, 10000)
    },
    delay: function () {
        return anime.random(0, 2000)
    },
    easing: "linear",
    loopBegin: (anim) => {
        updateRandom()
    },
    loop: true,
})

// anime({
//   targets: '.mg img',
//   translateX: {
//     value: '+=10', // 100px * 2.5 = '250px'
//     duration: 6000
//   },
//   translateY: {
//     value: '+=0', // 100px * 2.5 = '250px'
//     duration: 1000
//   },
//   easing: "linear",
//   loop: true,
// });

function animate() {
    anime({
        targets: ".mg img",
        translateX: (el, i) => {
            return [-el.width, SCREEN_W]
        },
        translateY: (el, i) => {
            let newY = anime.random(-el.height / 2, SCREEN_H - el.height / 2)
            return [newY, newY]
        },
        duration: function () {
            return anime.random(16000, 40000)
        },
        delay: function () {
            return anime.random(0, 2000)
        },
        easing: "linear",
        loopBegin: (anim) => { },
    })
}
      // animate();
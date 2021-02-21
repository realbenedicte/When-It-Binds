let screenWidth, screenHeight;
/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

/**
 * Vector
 */
function Vector(x, y) {
  this.x = x || 0
  this.y = y || 0
}

Vector.add = function (a, b) {
  return new Vector(a.x + b.x, a.y + b.y)
}

Vector.sub = function (a, b) {
  return new Vector(a.x - b.x, a.y - b.y)
}

Vector.scale = function (v, s) {
  return v.clone().scale(s)
}

Vector.random = function () {
  return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)
}

Vector.prototype = {
  set: function (x, y) {
    if (typeof x === "object") {
      y = x.y
      x = x.x
    }
    this.x = x || 0
    this.y = y || 0
    return this
  },

  add: function (v) {
    this.x += v.x
    this.y += v.y
    return this
  },

  sub: function (v) {
    this.x -= v.x
    this.y -= v.y
    return this
  },

  scale: function (s) {
    this.x *= s
    this.y *= s
    return this
  },

  length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  },

  lengthSq: function () {
    return this.x * this.x + this.y * this.y
  },

  normalize: function () {
    var m = Math.sqrt(this.x * this.x + this.y * this.y)
    if (m) {
      this.x /= m
      this.y /= m
    }
    return this
  },

  angle: function () {
    return Math.atan2(this.y, this.x)
  },

  angleTo: function (v) {
    var dx = v.x - this.x,
      dy = v.y - this.y
    return Math.atan2(dy, dx)
  },

  distanceTo: function (v) {
    var dx = v.x - this.x,
      dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  },

  distanceToSq: function (v) {
    var dx = v.x - this.x,
      dy = v.y - this.y
    return dx * dx + dy * dy
  },

  lerp: function (v, t) {
    this.x += (v.x - this.x) * t
    this.y += (v.y - this.y) * t
    return this
  },

  clone: function () {
    return new Vector(this.x, this.y)
  },

  toString: function () {
    return "(x:" + this.x + ", y:" + this.y + ")"
  },
}

/**
 * Particle
 */
function Particle(x, y, radius) {
  Vector.call(this, x, y)
  this.radius = radius

  this._latest = new Vector()
  this._speed = new Vector()
  this._size = new Vector()
}

Particle.prototype = (function (o) {
  var s = new Vector(0, 0),
    p
  for (p in o) s[p] = o[p]
  return s
})({
  addSpeed: function (d) {
    this._speed.add(d)
  },

  setSize: function (v) {
    this._size.set(v.x, v.y)
  },



  update: function () {
    if (this._speed.length() > 12) this._speed.normalize().scale(12)

    if (this._latest.x > screenWidth
      || this._latest.y > screenHeight
      || this._latest.y < -this._size.y) {
      this.set(new Vector(-this._size.x, Math.random() * screenHeight / 2))
    }
    this._latest.set(this)
    this.add(this._speed)
  },
})

// Initialize
const test = (() => {

  // Configs

  var BACKGROUND_COLOR = 'rgba(11, 51, 56, 1)',
    PARTICLE_RADIUS = 1,
    G_POINT_RADIUS = 10,
    G_POINT_RADIUS_LIMITS = 65;


  // Vars

  var mouse = new Vector(),
    gravities = [],
    particles = [],
    imgs = [];


  // Event Listeners

  function resize(e) {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    // var cx = canvas.width * 0.5,
    //   cy = canvas.height * 0.5;

    // grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
    // grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    // grad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
  }

  function mouseMove(e) {
    mouse.set(e.clientX, e.clientY);

    // var i, g, hit = false;
    // for (i = gravities.length - 1; i >= 0; i--) {
    //   g = gravities[i];
    //   if ((!hit && g.hitTest(mouse)) || g.dragging)
    //     g.isMouseOver = hit = true;
    //   else
    //     g.isMouseOver = false;
    // }

    // canvas.style.cursor = hit ? 'pointer' : 'default';
  }

  // function mouseDown(e) {
  //   for (var i = gravities.length - 1; i >= 0; i--) {
  //     if (gravities[i].isMouseOver) {
  //       gravities[i].startDrag(mouse);
  //       return;
  //     }
  //   }
  //   gravities.push(new GravityPoint(e.clientX, e.clientY, G_POINT_RADIUS, {
  //     particles: particles,
  //     gravities: gravities
  //   }));
  // }

  // function mouseUp(e) {
  //   for (var i = 0, len = gravities.length; i < len; i++) {
  //     if (gravities[i].dragging) {
  //       gravities[i].endDrag();
  //       break;
  //     }
  //   }
  // }

  // Functions
  function addParticle(imgs) {
    var i, p, img;
    for (i = 0; i < imgs.length; i++) {
      img = imgs[i]
      p = new Particle(
        Math.floor(Math.random() * screenWidth / 2),
        Math.floor(Math.random() * screenHeight - screenHeight / 2),
        PARTICLE_RADIUS
      );
      p.setSize(new Vector(img.width, img.height))
      p.addSpeed(new Vector(Math.random() + 1, Math.random() * 0.5 - 0.25));
      console.log("created particle ", p)
      particles.push(p);
    }
  }

  function removeParticle(num) {
    if (particles.length < num) num = particles.length;
    for (var i = 0; i < num; i++) {
      particles.pop();
    }
  }


  // Init
  window.addEventListener('resize', resize, false);
  resize(null);

  imgs = document.getElementsByClassName("left")
  addParticle(imgs);
  window.addEventListener('mousemove', mouseMove, false);

  // Start Update

  var loop = function () {
    var i, len, g, p;

    // context.save();
    // context.fillStyle = BACKGROUND_COLOR;
    // context.fillRect(0, 0, screenWidth, screenHeight);
    // context.fillStyle = grad;
    // context.fillRect(0, 0, screenWidth, screenHeight);
    // context.restore();

    // for (i = 0, len = gravities.length; i < len; i++) {
    //   g = gravities[i];
    //   if (g.dragging) g.drag(mouse);
    //   g.render(context);
    //   if (g.destroyed) {
    //     gravities.splice(i, 1);
    //     len--;
    //     i--;
    //   }
    // }

    // bufferCtx.save();
    // bufferCtx.globalCompositeOperation = 'destination-out';
    // bufferCtx.globalAlpha = 0.35;
    // bufferCtx.fillRect(0, 0, screenWidth, screenHeight);
    // bufferCtx.restore();

    // パーティクルをバッファに描画
    // for (i = 0, len = particles.length; i < len; i++) {
    //     particles[i].render(bufferCtx);
    // }
    len = imgs.length;
    // bufferCtx.save();
    // bufferCtx.fillStyle = bufferCtx.strokeStyle = '#fff';
    // bufferCtx.lineCap = bufferCtx.lineJoin = 'round';
    // bufferCtx.lineWidth = PARTICLE_RADIUS * 2;
    // bufferCtx.beginPath();
    for (i = 0; i < len; i++) {
      p = particles[i];
      p.update();
      imgs[i].setAttribute("style", `transform: translate(${p.x}px, ${p.y}px);`);
      // bufferCtx.moveTo(p.x, p.y);
      // bufferCtx.lineTo(p._latest.x, p._latest.y);
    }
    // bufferCtx.stroke();
    // bufferCtx.beginPath();
    // for (i = 0; i < len; i++) {
    //   p = particles[i];
    //   // bufferCtx.moveTo(p.x, p.y);
    //   // bufferCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
    // }
    // bufferCtx.fill();
    // bufferCtx.restore();

    // バッファをキャンバスに描画
    // context.drawImage(bufferCvs, 0, 0);

    requestAnimationFrame(loop);
  };
  loop();
})();
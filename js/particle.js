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

Vector.directionTo = function (a) {
  return new Vector(Math.cos(a), Math.sin(a))
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
    let m = Math.sqrt(this.x * this.x + this.y * this.y)
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
    let dx = v.x - this.x,
      dy = v.y - this.y
    return Math.atan2(dy, dx)
  },

  distanceTo: function (v) {
    let dx = v.x - this.x,
      dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  },

  distanceToSq: function (v) {
    let dx = v.x - this.x,
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
function Particle(x, y, radius, el = null) {
  Vector.call(this, x, y)
  this.radius = radius

  this._initialSpeed = new Vector()
  this._initialX = x
  this._initialY = y
  this._latest = new Vector()
  this._speed = new Vector()
  this._size = new Vector()
  this._el = el;
  this._cp = new Vector()
}

Particle.prototype = (function (o) {
  let s = new Vector(0, 0),
    p
  for (p in o) s[p] = o[p]
  return s
})({

  setCp: function (cp) {
    this._cp = cp
  },
  addSpeed: function (d) {
    this._speed.add(d).scale(0.3)
  },
  setInitialSpeed: function (d) {
    this._initialSpeed = d;
    this._speed.add(d)
  },
  setSize: function (v) {
    this._size.set(v.x, v.y)
  },

  updateInitialSpeed: function () {
    let direction = Vector.directionTo(this.angleTo(this._cp))
    this._speed.add(direction.scale(0.01))
  },

  updateSpeed: function () {
    if (this._speed.length() > 6) this._speed.normalize().scale(6)
  },

  update: function () {
    if (this._speed.length() > 6) this._speed.normalize().scale(6)

    this._latest.set(this)
    this.add(this._speed)
    this.add(this._initialSpeed)

    if (this._latest.x > screenWidth + Math.round(this._size.x / 2)
      || this._latest.y > screenHeight + Math.round(this._size.y / 2)
      || this._latest.y < Math.round(-this._size.y / 2)
      || this._latest.x < Math.round(-this._size.x)
    ) {

      this.set(new Vector(-this._size.x, Math.random() * screenHeight / 2))
      let direction = Vector.directionTo(this.angleTo(this._cp))
      this.setInitialSpeed(direction.scale(0.2 + Math.random() / 2));
      // this.setInitialSpeed(new Vector(Math.random(), Math.random() * 0.5 - 0.25));
    }

  },
})



/**
 * GravityPoint
 */
function GravityPoint(x, y, radius, targets) {
  Vector.call(this, x, y);
  this.radius = radius;
  this.currentRadius = radius * 0.5;
  this._targets = {
    particles: targets.particles || [],
    gravities: targets.gravities || [],
    field: targets.field || [],
  };
  this._speed = new Vector();
  this.fieldVectors = []
}

GravityPoint.RADIUS_LIMIT = 65;
GravityPoint.interferenceToPoint = true;

GravityPoint.prototype = (function (o) {
  let s = new Vector(0, 0), p;
  for (p in o) s[p] = o[p];
  return s;
})({
  gravity: 0.05,
  isMouseOver: false,
  dragging: false,
  destroyed: false,
  _easeRadius: 0,
  _dragDistance: null,
  _collapsing: false,

  hitTest: function (p) {
    return this.distanceTo(p) < this.radius;
  },

  clamp: function (number, min, max) {
    return Math.min(Math.max(number, min), max);
  },

  startDrag: function (dragStartPoint) {
    this._dragDistance = Vector.sub(dragStartPoint, this);
    this.dragging = true;
  },

  drag: function (dragToPoint) {
    this.x = dragToPoint.x - this._dragDistance.x;
    this.y = dragToPoint.y - this._dragDistance.y;
  },

  endDrag: function () {
    this._dragDistance = null;
    this.dragging = false;
  },

  addSpeed: function (d) {
    this._speed = this._speed.add(d);
  },

  collapse: function (e) {
    this.currentRadius *= 1.75;
    this._collapsing = true;
  },

  render: function (gp) {
    if (this.destroyed) return;

    let field = this._targets.field
    let particles = this._targets.particles,
      i, len;


    for (i = 0, len = field.length; i < len; i++) {
      // field[i].addSpeed(Vector.sub(this, field[i]).normalize().scale(this.gravity));
      let fp = field[i]
      fp.addSpeed(Vector.sub(fp._initialSpeed, Vector.sub(this, fp).normalize().scale(80000 / fp.distanceToSq(this))))
    }

    for (i = 0, len = particles.length; i < len; i++) {
      // particles[i].addSpeed(Vector.sub(this, particles[i]).normalize().scale(this.gravity));
      let fp = particles[i]
      fp.updateInitialSpeed()
      fp.addSpeed(Vector.sub(fp._initialSpeed, Vector.sub(this, fp).normalize().scale(80000 / fp.distanceToSq(this))))
    }

    // let repulseRadius = 200
    // let velocity = 10

    // for (i = 0, len = field.length; i < len; i++) {
    //   let p = field[i]
    //   let dx = p.x - this.x
    //   let dy = p.y - this.y

    //   let distToP = p.distanceTo(this)
    //   let normVec = new Vector(dx / distToP, dy / distToP)
    //   let repulseFactor = this.clamp((1 / repulseRadius) * (-1 * Math.pow(distToP / repulseRadius, 2) + 1) * repulseRadius * velocity, 0, 50);

    //   //let pos = new Vector(p.x + normVec.x * repulseFactor, p.y + normVec.y * repulseFactor)
    //   let pos = Vector.add(normVec, Vector.sub(this, p)).scale(-repulseFactor * 4)

    //   // p.addSpeed(Vector.add(pos, p._initialSpeed))
    //   p.addSpeed(Vector.add(pos, p._initialSpeed).scale(0.4))
    // }

    // for (i = 0, len = particles.length; i < len; i++) {
    //   let p = particles[i]
    //   let dx = p.x - this.x
    //   let dy = p.y - this.y

    //   let distToP = p.distanceTo(this)
    //   let normVec = new Vector(dx / distToP, dy / distToP)
    //   let repulseFactor = this.clamp((1 / repulseRadius) * (-1 * Math.pow(distToP / repulseRadius, 2) + 1) * repulseRadius * velocity, 0, 50);

    //   // let pos = new Vector(p.x + normVec.x * repulseFactor, p.y + normVec.y * repulseFactor)
    //   let pos = Vector.add(normVec, Vector.sub(this, p)).scale(-repulseFactor * 4)
    //   //let pos = Vector.sub(this, p).scale(-repulseFactor)

    //   p.addSpeed(Vector.add(pos, p._initialSpeed).scale(0.4))

    // }



    this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95;
    this.currentRadius += this._easeRadius;
    if (this.currentRadius < 0) this.currentRadius = 0;

    if (this._collapsing) {
      this.radius *= 0.75;
      if (this.currentRadius < 1) this.destroyed = true;
      this._draw(gp)
      return;
    }

    let gravities = this._targets.gravities,
      gps = this._targets.gps,
      g, absorp,
      area = this.radius * this.radius * Math.PI, garea;

    for (i = 0, len = gravities.length; i < len; i++) {
      g = gravities[i];
      if (g === this || g.destroyed) continue;

      if (
        (this.currentRadius >= g.radius || this.dragging) &&
        this.distanceTo(g) < (this.currentRadius + g.radius) * 0.85
      ) {
        g.destroyed = true;
        this.gravity += g.gravity;

        absorp = Vector.sub(g, this).scale(g.radius / this.radius * 0.5);
        this.addSpeed(absorp);

        garea = g.radius * g.radius * Math.PI;
        this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI);
        this.radius = Math.sqrt((area + garea) / Math.PI);
      }

      g.addSpeed(Vector.sub(this, g).normalize().scale(this.gravity));
    }

    if (GravityPoint.interferenceToPoint && !this.dragging)
      this.add(this._speed);

    this._speed = new Vector();

    if (this.currentRadius > GravityPoint.RADIUS_LIMIT) this.collapse();

    this._draw(gp);
  },

  _draw: function (gp) {
    let grd, r;

    gp.setAttribute("style", `transform: translate(${this.x}px, ${this.y}px) scale(${this.radius / 5}, ${this.radius / 5});`)
    // ctx.save();

    // grd = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 5);
    // grd.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
    // grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false);
    // ctx.fillStyle = grd;
    // ctx.fill();

    // r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3;
    // grd = ctx.createRadialGradient(this.x, this.y, r, this.x, this.y, this.currentRadius);
    // grd.addColorStop(0, 'rgba(0, 0, 0, 1)');
    // grd.addColorStop(1, Math.random() < 0.2 ? 'rgba(255, 196, 0, 0.15)' : 'rgba(103, 181, 191, 0.75)');
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false);
    // ctx.fillStyle = grd;
    // ctx.fill();
    // ctx.restore();
  }
});




// Initialize
const testy = (() => {

  // Configs

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  console.log("got screenHeight ", screenHeight)
  console.log("got screenWidth ", screenWidth)

  let BACKGROUND_COLOR = 'rgba(11, 51, 56, 1)',
    PARTICLE_RADIUS = 1,
    G_POINT_RADIUS = 10,
    G_POINT_RADIUS_LIMITS = 65;


  // Vars

  let mouse = new Vector(),
    gravities = [],
    particles = [],
    imgs = [],
    gpEls = [],
    field = [];


  // Event Listeners

  function resize(e) {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;


  }



  const generateField = () => {
    let spacing = 50;
    let countX = Math.round(screenWidth / spacing);
    let countY = Math.round(screenHeight / spacing);
    let offset = spacing / 2
    console.log("got countX ", countX)
    console.log("got countY ", countY)

    let totalCount = countX * countY;
    let cp = new Vector(screenWidth, screenHeight / 2)

    for (i = 0; i < totalCount; i++) {
      let fx = offset + (i % countX) * spacing
      let fy = offset + Math.floor(i / countX) * spacing
      let fvEl = document.createElement('div');
      fvEl.className = "fv"
      fvEl.innerHTML = `&#8594`
      document.body.appendChild(fvEl)
      let fv = new Particle(fx, fy, PARTICLE_RADIUS, fvEl)
      let direction = Vector.directionTo(fv.angleTo(cp))

      // this.setInitialSpeed(new Vector(Math.random() + 1, Math.random() * 0.5 - 0.25).scale(0.5));
      // let speed = new Vector(1, 0)
      let speed = direction
      // let speed = new Vector(Math.random() + 1, Math.random() * 0.5 - 0.25)
      // let speed = new Vector(0.5 + Math.random() * 0.5, Math.random() * 0.01)
      fv.setCp(cp)
      fv.setInitialSpeed(speed)
      // fieldVector.addSpeed(speed)
      let deg = (360 + Math.round(180 * speed.angle() / Math.PI)) % 360;
      field.push(fv)
      fvEl.setAttribute("style", `transform: translate(${fx}px, ${fy}px) rotate(${deg}deg); `)

    }
  }
  // generateField()

  function touchStart(e) {
    let clientX = e.touches[0].clientX;
    let clientY = e.touches[0].clientY;
    mouse.set(clientX, clientY);
    if (gravities.length) {
      let g = gravities[0]
      g.set(mouse)
    }
  }

  function mouseMove(e) {
    mouse.set(e.clientX, e.clientY);

    if (gravities.length) {
      let g = gravities[0]
      g.set(mouse)
    }

  }
  let maxGravityPoints = 1;
  function mouseDown(e) {

    if (gravities.length > 0) return

    console.log(" MOUSE DOWN ", e.clientX, e.clientY)
    let mpos = new Vector(e.clientX, e.clientY)
    let gpEl = document.createElement('div');
    gpEl.className = "gp"
    gpEl.setAttribute("style", `transform: translate(${mpos.x}px, ${mpos.y}px);`)
    document.body.appendChild(gpEl)
    gpEls.push(gpEl)

    let gp = new GravityPoint(mpos.x, mpos.y, G_POINT_RADIUS, {
      particles: particles,
      gravities: gravities,
      field: field,
    })
    gravities.push(gp);

  }

  function generateGravityPoint() {

    if (gravities.length > 0) return

    let gpEl = document.createElement('div');
    gpEl.className = "gp"
    gpEl.setAttribute("style", `transform: translate(${mouse.x}px, ${mouse.y}px);`)
    document.body.appendChild(gpEl)
    gpEls.push(gpEl)

    let gp = new GravityPoint(mouse.x, mouse.y, G_POINT_RADIUS, {
      particles: particles,
      gravities: gravities,
      field: field,
    })
    gravities.push(gp);
  }

  generateGravityPoint()



  function generateParticles(name, className, num = 100, containerId = "nova-mid") {
    let particleEls = document.getElementsByClassName(className)
    let particleContainer = document.getElementById(containerId)
    for (let i = 0; i < num; i++) {
      let rIdx = Math.floor(Math.random() * particleEls.length)
      let particleEl = particleEls[rIdx]
      let particleClone = particleEl.cloneNode(true)
      particleClone.setAttribute("class", "nova")
      particleContainer.appendChild(particleClone)
    }
    let particles = particleContainer.getElementsByClassName(className)
    addParticle(particles)
  }
  // novas behind
  generateParticles("stars", "particle star s", 15)
  generateParticles("stars", "particle star m", 5)
  generateParticles("stars", "particle star l", 5)
  generateParticles("dots", "particle dot s", 15)
  generateParticles("dots", "particle dot m", 20)
  generateParticles("dots", "particle dot l", 20)

  // novas infront
  generateParticles("stars", "particle star s", 10, "nova-top")
  generateParticles("stars", "particle star m", 5, "nova-top")
  generateParticles("stars", "particle star l", 5, "nova-top")
  generateParticles("dots", "particle dot s", 10, "nova-top")
  generateParticles("dots", "particle dot m", 5, "nova-top")
  generateParticles("dots", "particle dot l", 5, "nova-top")

  // Functions
  function addParticle(imgs) {
    let i, p, img;
    for (i = 0; i < imgs.length; i++) {
      img = imgs[i].firstElementChild
      p = new Particle(
        Math.floor((Math.random() * (screenWidth - img.width / 2))),
        Math.floor(img.height / 2 + (Math.random() * (screenHeight - img.height / 2))),
        PARTICLE_RADIUS
      );
      p.setSize(new Vector(img.width, img.height))

      let speed = new Vector(0.5 + Math.random() * 0.5, Math.random() * 0.01)
      let cp = new Vector(screenWidth, screenHeight / 2)
      let direction = Vector.directionTo(p.angleTo(cp))
      p.setCp(cp)
      p.setInitialSpeed(direction.scale(0.2 + Math.random() / 2));


      // p.setInitialSpeed(speed);
      console.log("created particle ", p)
      particles.push(p);
    }
  }

  function removeParticle(num) {
    if (particles.length < num) num = particles.length;
    for (let i = 0; i < num; i++) {
      particles.pop();
    }
  }

  resize(null);

  imgs = document.getElementsByClassName("nova")
  addParticle(imgs);
  window.addEventListener('mousemove', mouseMove, false);
  // Init
  window.addEventListener('resize', resize, false);
  window.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('touchstart', touchStart, false);
  // canvas.addEventListener('mouseup', mouseUp, false);
  // canvas.addEventListener('dblclick', doubleClick, false);

  // Start Update

  let loop = function () {
    let i, len, g, p, context;

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

    for (i = 0, len = field.length; i < len; i++) {
      let fv = field[i]
      fv.updateSpeed()
      let deg = (360 + Math.round(180 * fv._speed.angle() / Math.PI)) % 360;
      fv._el.setAttribute("style", `transform: translate(${fv._initialX}px, ${fv._initialY}px) rotate(${deg}deg); `)
    }


    for (i = 0, len = gravities.length; i < len; i++) {
      g = gravities[i];
      gpEl = gpEls[i];
      if (g.dragging) g.drag(mouse);
      g.render(gpEl);
      if (g.destroyed) {
        gravities.splice(i, 1);
        gpEls.splice(i, 1)
        gpEl.remove()
        len--;
        i--;
      }
    }


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

  return { "gen": function () { return generateField; } };
})();
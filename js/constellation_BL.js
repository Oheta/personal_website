/**
 * Stars
 * Inspired by Steve Courtney's poster art for Celsius GS's Drifter - http://celsiusgs.com/drifter/posters.php
 * by Cory Hughart - http://coryhughart.com
 * disclaimer from Theau Ebalard : modifications and additions were made to accomodate my own website
 * There is a lot of code dupe, but I unfortunately couldn't obtain the desired effect by treating all constellations within a single file. 
 * It does in sequence what I want to happen simulteanousely
 */

// Settings
var particleCount = 6,
  flareCount = 10,
  motion = 0.05,
  tilt = 0.05,
  color = '#FFEED4',
  particleSizeBase = 1.5,
  particleSizeMultiplier = 0.5,
  flareSizeBase = 100,
  flareSizeMultiplier = 100,
  lineWidth = 1,
  linkChance = 50, // chance per frame of link, higher = smaller chance
  linkLengthMin = 5, // min linked verticesBL
  linkLengthMax = 7, // max linked verticesBL
  linkOpacity = 0.25; // number between 0 & 1
  linkFade = 90, // link fade-out frames
  linkSpeed = 1, // distance a link travels in 1 frame
  glareAngle = -60,
  glareOpacityMultiplier = 0.05,
  renderParticles = true,
  renderParticleGlare = false,
  renderFlares = true,
  renderLinks = true,
  renderMesh = false,
  flicker = true,
  flickerSmoothing = 120, // higher = smoother flicker
  blurSize = 0,
  orbitTilt = true,
  randomMotion = false,
  section = "",
  noiseLength = 1000,
  noiseStrength = 1;
  section = document.currentScript.getAttribute( "data-section" );
console.log(section);

var canvasBL = document.getElementById('canvas-BL'),
  //orbits = document.getElementById('orbits'),
  contextBL = canvasBL.getContext('2d'),
  mouse = { x: 0, y: 0 },
  m = {},
  r = 0,
  c = 1000, // multiplier for delaunay pointsBL, since floats too small can mess up the algorithm
  n = 0,
  nAngle = (Math.PI * 2) / noiseLength,
  nRad = 100,
  nScale = 0.5,
  nPos = {x: 0, y: 0},
  pointsBL = [],
  verticesBL = [],
  linksBL = [],
  particlesBL = [],
  flaresBL = [],
  trianglesBL = [];
  
function build() {
  console.log("into build");
  var i, j, k;

  // requestAnimFrame polyfill
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ){
          window.setTimeout(callback, 1000 / 60);
        };
  })();
/*
  // Fade in background
  var background = document.getElementById('background'),
    bgImg = new Image(),
    bgURL = 'img/Abstract_digital_wave_of_particles_background.jpg';
  bgImg.onload = function() {
    //console.log('background loaded');
    background.style.backgroundImage = 'url("'+bgURL+'")';
    background.className += ' loaded';
  }
  bgImg.src = bgURL;
  */
  // Size canvasBL
  resize();

  mouse.x = canvasBL.clientWidth / 2;
  mouse.y = canvasBL.clientHeight / 2;

  // Create particle positions
  for (i = 0; i < particleCount; i++) 
  {
    var p = new Particle();
    particlesBL.push(p);
    pointsBL.push([p.x*c, p.y*c]);
  }
  //console.log(JSON.stringify(pointsBL));

  // Delaunay triangulation
  //var Delaunay = require('delaunay-fast');
  verticesBL = Delaunay.triangulate(pointsBL);
  //console.log(JSON.stringify(verticesBL));
  // Create an array of "trianglesBL" (groups of 3 indices)
  var tri = [];
  for (i = 0; i < verticesBL.length; i++) {
    if (tri.length == 3) {
      trianglesBL.push(tri);
      tri = [];
    }
    tri.push(verticesBL[i]);
  }
  //console.log(JSON.stringify(trianglesBL));

  // Tell all the particlesBL who their neighbors are
  for (i = 0; i < particlesBL.length; i++) {
    // Loop through all tirangles
    for (j = 0; j < trianglesBL.length; j++) {
      // Check if this particle's index is in this triangle
      k = trianglesBL[j].indexOf(i);
      // If it is, add its neighbors to the particlesBL contacts list
      if (k !== -1) {
        trianglesBL[j].forEach(function(value, index, array) {
          if (value !== i && particlesBL[i].neighbors.indexOf(value) == -1) {
            particlesBL[i].neighbors.push(value);
          }
        });
      }
    }
  }
  //console.log(JSON.stringify(particlesBL));

  if (renderFlares) {
    // Create flare positions
    for (i = 0; i < flareCount; i++) {
      flaresBL.push(new Flare());
    }
  }

  // Motion mode
  /*
  //if (Modernizr && Modernizr.deviceorientation) {
  if ('ontouchstart' in document.documentElement && window.DeviceOrientationEvent) {
    console.log('Using device orientation');
    window.addEventListener('deviceorientation', function(e) {
      mouse.x = (canvasBL.clientWidth / 2) - ((e.gamma / 90) * (canvasBL.clientWidth / 2) * 2);
      mouse.y = (canvasBL.clientHeight / 2) - ((e.beta / 90) * (canvasBL.clientHeight / 2) * 2);
      //console.log('Center: x:'+(canvasBL.clientWidth/2)+' y:'+(canvasBL.clientHeight/2));
      //console.log('Orientation: x:'+mouse.x+' ('+e.gamma+') y:'+mouse.y+' ('+e.beta+')');
    }, true);
  }
  else {
    // Mouse move listener
    console.log('Using mouse movement');
    document.body.addEventListener('mousemove', function(e) {
      //console.log('moved');
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  }
  */
  // Random motion
  if (randomMotion) {
    //var SimplexNoise = require('simplex-noise');
    //var simplex = new SimplexNoise();
  }

  // Animation loop
  (function animloop(){
    console.log("anim loop BL");
    requestAnimFrame(animloop);
    resize();
    renderBL();
  })();
}


function renderBL() {
  console.log("start renderBL()");
  if (randomMotion) {
    n++;
    if (n >= noiseLength) {
      n = 0;
    }

    nPos = noisePoint(n);
    //console.log('NOISE x:'+nPos.x+' y:'+nPos.y);
  }

  // Clear
  contextBL.clearRect(0, 0, canvasBL.width, canvasBL.height);

  if (blurSize > 0) {
    contextBL.shadowBlur = blurSize;
    contextBL.shadowColor = color;
  }

  if (renderParticles) {
    // Render particlesBL
    for (var i = 0; i < particleCount; i++) {
      particlesBL[i].render();
    }
  }

  if (renderMesh) {
    // Render all lines
    contextBL.beginPath();
    for (var v = 0; v < verticesBL.length-1; v++) {
      // Splits the array into triplets
      if ((v + 1) % 3 === 0) { continue; }

      var p1 = particlesBL[verticesBL[v]],
        p2 = particlesBL[verticesBL[v+1]];

      //console.log('Line: '+p1.x+','+p1.y+'->'+p2.x+','+p2.y);

      var pos1 = position(p1.x, p1.y, p1.z),
        pos2 = position(p2.x, p2.y, p2.z);

      contextBL.moveTo(pos1.x, pos1.y);
      contextBL.lineTo(pos2.x, pos2.y);
    }
    contextBL.strokeStyle = color;
    contextBL.lineWidth = lineWidth;
    contextBL.stroke();
    contextBL.closePath();
  }

  if (renderLinks) {
    console.log("build/renderlinks condition");
    // Possibly start a new link
    let randomL = random(0, linkChance);
    console.log("randomL = ", randomL);
    if (randomL == linkChance) {
      console.log("inside condi");
      var length = random(linkLengthMin, linkLengthMax);
      var start = random(0, particlesBL.length-1);
      console.log("starting link : start = ", start, " length = ", length);
      startLinkBL(start, length);
    }

    // Render existing linksBL
    // Iterate in reverse so that removing items doesn't affect the loop
    for (var l = linksBL.length-1; l >= 0; l--) {
      console.log("build/renderlinks condi/for loop");
      if (linksBL[l] && !linksBL[l].finished) {
        linksBL[l].render();
      }
      else {
        delete linksBL[l];
      }
    }
  }

  if (renderFlares) {
    // Render flaresBL
    for (var j = 0; j < flareCount; j++) {
      flaresBL[j].render();
    }
  }

  /*
  if (orbitTilt) {
    var tiltX = -(((canvasBL.clientWidth / 2) - mouse.x + ((nPos.x - 0.5) * noiseStrength)) * tilt),
      tiltY = (((canvasBL.clientHeight / 2) - mouse.y + ((nPos.y - 0.5) * noiseStrength)) * tilt);

    orbits.style.transform = 'rotateY('+tiltX+'deg) rotateX('+tiltY+'deg)';
  }
  */
}

function resize() {
  canvasBL.width = window.innerWidth * (window.devicePixelRatio || 1);
  canvasBL.height = canvasBL.width * (canvasBL.clientHeight / canvasBL.clientWidth);
}

function startLinkBL(vertex, length) {
  console.log('LINK from '+vertex+' (length '+length+')');
  linksBL.push(new LinkBL(vertex, length));
}

// Particle class
var Particle = function() {
  this.x = random(0.1, 0.9, true);
  this.y = random(0.1, 0.9, true);
  this.z = random(0,4);
  this.color = color;
  this.opacity = random(0.4,1,true);
  this.flicker = 0;
  this.neighbors = []; // placeholder for neighbors
};
Particle.prototype.render = function() {
  var pos = position(this.x, this.y, this.z),
    r = ((this.z * particleSizeMultiplier) + particleSizeBase) * (sizeRatio() / 1000),
    o = this.opacity;

  if (flicker) {
    var newVal = random(-0.5, 0.5, true);
    this.flicker += (newVal - this.flicker) / flickerSmoothing;
    if (this.flicker > 0.5) this.flicker = 0.5;
    if (this.flicker < -0.5) this.flicker = -0.5;
    o += this.flicker;
    if (o > 1) o = 1;
    if (o < 0) o = 0;
  }

  contextBL.fillStyle = this.color;
  contextBL.globalAlpha = o;
  contextBL.beginPath();
  contextBL.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
  contextBL.fill();
  contextBL.closePath();

  if (renderParticleGlare) {
    contextBL.globalAlpha = o * glareOpacityMultiplier;
    /*
    contextBL.ellipse(pos.x, pos.y, r * 30, r, 90 * (Math.PI / 180), 0, 2 * Math.PI, false);
    contextBL.fill();
    contextBL.closePath();
    */
    contextBL.ellipse(pos.x, pos.y, r * 100, r, (glareAngle - ((nPos.x - 0.5) * noiseStrength * motion)) * (Math.PI / 180), 0, 2 * Math.PI, false);
    contextBL.fill();
    contextBL.closePath();
  }

  contextBL.globalAlpha = 1;
};

// Flare class
var Flare = function() {
  this.x = random(-0.25, 1.25, true);
  this.y = random(-0.25, 1.25, true);
  this.z = random(0,2);
  this.color = color;
  this.opacity = random(0.001, 0.01, true);
};
Flare.prototype.render = function() {
  var pos = position(this.x, this.y, this.z),
    r = ((this.z * flareSizeMultiplier) + flareSizeBase) * (sizeRatio() / 1000);

  // Feathered circles
  /*
  var grad = contextBL.createRadialGradient(x+r,y+r,0,x+r,y+r,r);
  grad.addColorStop(0, 'rgba(255,255,255,'+f.o+')');
  grad.addColorStop(0.8, 'rgba(255,255,255,'+f.o+')');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  contextBL.fillStyle = grad;
  contextBL.beginPath();
  contextBL.fillRect(x, y, r*2, r*2);
  contextBL.closePath();
  */

  contextBL.beginPath();
  contextBL.globalAlpha = this.opacity;
  contextBL.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
  contextBL.fillStyle = this.color;
  contextBL.fill();
  contextBL.closePath();
  contextBL.globalAlpha = 1;
};

// LinkBL class
var LinkBL = function(startVertex, numPoints) {
  this.length = numPoints;
  this.verts = [startVertex];
  this.stage = 0;
  this.linked = [startVertex];
  this.distances = [];
  this.traveled = 0;
  this.fade = 0;
  this.finished = false;
};
LinkBL.prototype.render = function() {
  // Stages:
  // 0. Vertex collection
  // 1. Render line reaching from vertex to vertex
  // 2. Fade out
  // 3. Finished (delete me)

  var i, p, pos, pointsBL;
  console.log("inside LinkBL.render()");
  switch (this.stage) {
    // VERTEX COLLECTION STAGE
    case 0:
      console.log("class LinkBL/render case 0: vertex collection");
      // Grab the last member of the link
      var last = particlesBL[this.verts[this.verts.length-1]];
      //console.log(JSON.stringify(last));
      if (last && last.neighbors && last.neighbors.length > 0) {
        // Grab a random neighbor
        var neighbor = last.neighbors[random(0, last.neighbors.length-1)];
        // If we haven't seen that particle before, add it to the link
        if (this.verts.indexOf(neighbor) == -1) {
          this.verts.push(neighbor);
        }
        // If we have seen that particle before, we'll just wait for the next frame
      }
      else {
        //console.log(this.verts[0]+' prematurely moving to stage 3 (0)');
        this.stage = 3;
        this.finished = true;
      }

      if (this.verts.length >= this.length) {
        // Calculate all distances at once
        for (i = 0; i < this.verts.length-1; i++) {
          var p1 = particlesBL[this.verts[i]],
            p2 = particlesBL[this.verts[i+1]],
            dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            dist = Math.sqrt(dx*dx + dy*dy);

            this.distances.push(dist);
        }
        //console.log('Distances: '+JSON.stringify(this.distances));
        //console.log('verts: '+this.verts.length+' distances: '+this.distances.length);

        //console.log(this.verts[0]+' moving to stage 1');
        this.stage = 1;
      }
    break;

    // RENDER LINE ANIMATION STAGE
    case 1:
      console.log("class LinkBL/render case 1: render anim");
      if (this.distances.length > 0) {

        pointsBL = [];
        //var a = 1;

        // Gather all pointsBL already linked
        for (i = 0; i < this.linked.length; i++) {
          p = particlesBL[this.linked[i]];
          pos = position(p.x, p.y, p.z);
          pointsBL.push([pos.x, pos.y]);
        }

        var linkSpeedRel = linkSpeed * 0.00001 * canvasBL.width;
        this.traveled += linkSpeedRel;
        var d = this.distances[this.linked.length-1];
        // Calculate last point based on linkSpeed and distance travelled to next point
        if (this.traveled >= d) {
          this.traveled = 0;
          // We've reached the next point, add coordinates to array
          //console.log(this.verts[0]+' reached vertex '+(this.linked.length+1)+' of '+this.verts.length);

          this.linked.push(this.verts[this.linked.length]);
          p = particlesBL[this.linked[this.linked.length-1]];
          pos = position(p.x, p.y, p.z);
          pointsBL.push([pos.x, pos.y]);

          if (this.linked.length >= this.verts.length) {
            //console.log(this.verts[0]+' moving to stage 2 (1)');
            this.stage = 2;
          }
        }
        else {
          // We're still travelling to the next point, get coordinates at travel distance
          // http://math.stackexchange.com/a/85582
          var a = particlesBL[this.linked[this.linked.length-1]],
            b = particlesBL[this.verts[this.linked.length]],
            t = d - this.traveled,
            x = ((this.traveled * b.x) + (t * a.x)) / d,
            y = ((this.traveled * b.y) + (t * a.y)) / d,
            z = ((this.traveled * b.z) + (t * a.z)) / d;

          pos = position(x, y, z);

          //console.log(this.verts[0]+' traveling to vertex '+(this.linked.length+1)+' of '+this.verts.length+' ('+this.traveled+' of '+this.distances[this.linked.length]+')');

          pointsBL.push([pos.x, pos.y]);
        }

        this.drawLine(pointsBL);
      }
      else {
        //console.log(this.verts[0]+' prematurely moving to stage 3 (1)');
        this.stage = 3;
        this.finished = true;
      }
    break;

    // FADE OUT STAGE
    case 2:
      console.log("class LinkBL/render case 2: fade");
      if (this.verts.length > 1) {
        if (this.fade < linkFade) {
          this.fade++;

          // Render full link between all verticesBL and fade over time
          pointsBL = [];
          var alpha = (1 - (this.fade / linkFade)) * linkOpacity;
          for (i = 0; i < this.verts.length; i++) {
            p = particlesBL[this.verts[i]];
            pos = position(p.x, p.y, p.z);
            pointsBL.push([pos.x, pos.y]);
          }
          this.drawLine(pointsBL, alpha);
        }
        else {
          //console.log(this.verts[0]+' moving to stage 3 (2a)');
          this.stage = 3;
          this.finished = true;
        }
      }
      else {
        //console.log(this.verts[0]+' prematurely moving to stage 3 (2b)');
        this.stage = 3;
        this.finished = true;
      }
    break;

    // FINISHED STAGE
    case 3:
      console.log("class LinkBL/render case 3: finish");
    default:
      this.finished = true;
    break;
  }
};
LinkBL.prototype.drawLine = function(pointsBL, alpha) {
  if (typeof alpha !== 'number') alpha = linkOpacity;

  if (pointsBL.length > 1 && alpha > 0) {
    //console.log(this.verts[0]+': Drawing line '+alpha);
    contextBL.globalAlpha = alpha;
    contextBL.beginPath();
    for (var i = 0; i < pointsBL.length-1; i++) {
      contextBL.moveTo(pointsBL[i][0], pointsBL[i][1]);
      contextBL.lineTo(pointsBL[i+1][0], pointsBL[i+1][1]);
    }
    contextBL.strokeStyle = color;
    contextBL.lineWidth = lineWidth;
    contextBL.stroke();
    contextBL.closePath();
    contextBL.globalAlpha = 1;
  }
};


// Utils

function noisePoint(i) {
  var a = nAngle * i,
    cosA = Math.cos(a),
    sinA = Math.sin(a),
    //value = simplex.noise2D(nScale * cosA + nScale, nScale * sinA + nScale),
    //rad = nRad + value;
    rad = nRad;
  return {
    x: rad * cosA,
    y: rad * sinA
  };
}

function position(x, y, z) {
  return {
    x: (x * canvasBL.width) + ((((canvasBL.width / 2) - mouse.x + ((nPos.x - 0.5) * noiseStrength)) * z) * motion),
    y: (y * canvasBL.height) + ((((canvasBL.height / 2) - mouse.y + ((nPos.y - 0.5) * noiseStrength)) * z) * motion)
  };
}

function sizeRatio() {
  return canvasBL.width >= canvasBL.height ? canvasBL.width : canvasBL.height;
}

function random(min, max, float) {
  return float ?
    Math.random() * (max - min) + min :
    Math.floor(Math.random() * (max - min + 1)) + min;
}


//#region T.Ebalard : Here are my additions
function linkParticlesToNodes(){
  //Select leftmost particle
  let leftmost;
  particlesBL.forEach((particle) => {if(particle.x < leftmost.x) leftmost = particle;});

}


//#endregion

// build
if (canvasBL) build();
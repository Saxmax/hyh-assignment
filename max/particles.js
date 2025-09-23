/* 
  TODO =>
  - Let first param be a settings object for more customization
  - events for emit, death, play, pause, stop?
  - tweenable props:
    alpha, size, angle
  - bonus: extend pool if saturated quantity
*/

const DefaultParticleConfig = {
  x: 0,
  y: 0,
  textures: [],
  size: { width: 100, height: 100 },
  lifespan: 1000,
  gravity: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  autoplay: false,
  animationDuration: 1000,
  quantity: 10,
  frequency: 1000,
};
Object.freeze(DefaultParticleConfig);

const Particles = function Particles(config) {
  this.config = this._getConfig(config);

  this.textures = this._getTexturesArray(this.config.textures);
  this.quantity = this.config.quantity;
  this.frequency = this.config.frequency;
  this.size = this.config.size;
  this.animationDuration = this.config.animationDuration;
  this.lifespan = this.config.lifespan;
  this.emitPosition = { x: this.config.x, y: this.config.y };
  this.gravity = this.config.gravity;
  this.velocity = this.config.velocity;
  this.acceleration = this.config.acceleration;

  this.container;
  this.particles = [];
  this.frames = [];
  this.isPlaying = false;
  this.elapsed = 0;
  this._emitted = 0;

  this.initialize();
};

Particles.prototype.initialize = function () {
  this._createContainer();
  this._createFrames();
  this._createParticles();

  app.ticker.add(this._onTick, this);

  if (this.config.autoplay === true) {
    this.play();
  }
};

Particles.prototype._getConfig = function (config) {
  if (config === undefined) config = {};

  // Make sure all properties have a value
  for (const [key, value] of Object.entries(DefaultParticleConfig)) {
    if (config[key] === undefined) {
      config[key] = value;
    }
  }

  return config;
};

Particles.prototype._getTexturesArray = function (textures) {
  return Array.isArray(textures) ? textures : [textures];
};

Particles.prototype._createFrames = function () {
  const frames = [];
  for (let i = 0; i < this.textures.length; i++) {
    const frameObject = {
      texture: this.textures[i],
      time: this.animationDuration / this.textures.length,
    };
    frames.push(frameObject);
  }

  this.frames = frames;
};

Particles.prototype._createContainer = function () {
  if (this.container !== undefined) return;
  this.container = new PIXI.Container();
  app.stage.addChild(this.container);
};

Particles.prototype._createParticles = function (quantity) {
  quantity = quantity || this.quantity;
  for (let i = 0; i < quantity; i++) {
    const particle = new Particle(this.frames);
    this.particles.push(particle);
    this.container.addChild(particle.sprite);
  }
};

Particles.prototype._updateAnimatedSprite = function () {
  if (this.sprite === undefined) return;

  for (let i = 0; i < this.sprite.textures.length; i++) {
    const frameObject = this.sprite.textures[i];
    frameObject.time = this.animationDuration / this.sprite.textures.length;
  }
};

Particles.prototype._getFreeParticle = function () {
  return this.particles.find(function (particle) {
    return particle.isAlive === false;
  });
};

Particles.prototype._getActiveParticles = function () {
  return this.particles.filter(function (particle) {
    return particle.isAlive === true;
  });
};

Particles.prototype._onTick = function () {
  if (this.isPlaying === false) return;

  const dt = app.ticker.deltaMS;
  this.elapsed += dt;

  // Check to spawn next particle.
  if (this._emitted < this.elapsed / this.frequency) {
    // console.log("Time to spawn next particle");
    const particle = this._getFreeParticle();
    if (particle) {
      console.log("Found free particle");
      this.resetParticle(particle);
      particle.emit();
      this._emitted += 1;
    }
  }

  // Update active particles.
  const active = this._getActiveParticles();
  active.forEach(
    function (particle) {
      if (particle.elapsed + dt >= this.lifespan) {
        particle.reset();
      } else {
        particle.onTick(dt);
      }
    }.bind(this)
  );
};

Particles.prototype.setDuration = function (animationDuration) {
  this.animationDuration = animationDuration;
  this._updateAnimatedSprite();
};

Particles.prototype.resetParticle = function (particle) {
  particle.setSize(this.size.width, this.size.height);
  particle.setAngle(0);
  particle.setAlpha(1);
  particle.setEmitPosition(this.emitPosition.x, this.emitPosition.y);
  particle.setAcceleration(this.acceleration.x, this.acceleration.y);
  particle.setGravity(this.gravity.x, this.gravity.y);
  particle.setVelocity(this.velocity.x, this.velocity.y);
};

Particles.prototype.play = function () {
  if (this.isPlaying === true) return;

  // for (let i = 0; i < this.particles.length; i++) {
  //   const particle = this.particles[i];
  //   this.resetParticle(particle);
  //   particle.emit();
  // }

  this._emitted = 0;
  this.elapsed = 0;
  this.isPlaying = true;
};

Particles.prototype.pause = function () {
  if (this.isPlaying === true) return;
  this.isPlaying = false;
};

Particles.prototype.resume = function () {
  if (this.isPlaying === false) return;
  this.isPlaying = true;
};

Particles.prototype.stop = function () {
  if (this.isPlaying === false) return;

  for (let i = 0; i < this.particles.length; i++) {
    const particle = this.particles[i];
    particle.reset();
  }

  this.isPlaying = false;
};

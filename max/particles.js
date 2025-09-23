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

  this._isPlaying = false;
  this._elapsed = 0;
  this._countdown = 0;
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
    return particle._getIsAlive() === false;
  });
};

Particles.prototype._getActiveParticles = function () {
  return this.particles.filter(function (particle) {
    return particle._getIsAlive() === true;
  });
};

Particles.prototype._resetParticle = function (particle) {
  particle.setSize(this.size.width, this.size.height);
  particle.setAngle(0);
  particle.setAlpha(1);
  particle.setEmitPosition(this.emitPosition.x, this.emitPosition.y);
  particle.setAcceleration(this.acceleration.x, this.acceleration.y);
  particle.setGravity(this.gravity.x, this.gravity.y);

  const velocity = {
    x: Math.random() * 1000 - 500,
    y: Math.random() * -750 - 500,
  };
  particle.setInitialVelocity(velocity.x, velocity.y);
};

Particles.prototype._emitParticle = function () {
  const particle = this._getFreeParticle();
  if (particle === undefined) return;

  this._resetParticle(particle);
  particle._emit();
  this._emitted += 1;
};

Particles.prototype._onTick = function () {
  if (this._isPlaying === false) return;

  const dt = app.ticker.deltaMS;
  this._elapsed += dt;

  // Check to spawn a particle.
  if (this.frequency == 0) {
    this._emitParticle();
  } else if (this.frequency > 0) {
    this._countdown -= dt;
    if (this._countdown <= 0) {
      this._emitParticle();
      this._countdown = this.frequency - Math.abs(this._countdown);
    }
  }

  // Update active particles.
  const active = this._getActiveParticles();
  active.forEach(
    function (particle) {
      if (particle.elapsed + dt >= this.lifespan) {
        particle._reset();
      } else {
        particle._onParticleUpdate(dt);
      }
    }.bind(this)
  );
};

Particles.prototype.setDuration = function (animationDuration) {
  this.animationDuration = animationDuration;
  this._updateAnimatedSprite();
};

Particles.prototype.play = function () {
  if (this._isPlaying === true) return;

  this._emitted = 0;
  this._elapsed = 0;
  this._countdown = this.frequency || 0;
  this._isPlaying = true;
};

Particles.prototype.pause = function () {
  if (this._isPlaying === true) return;
  this._isPlaying = false;
};

Particles.prototype.resume = function () {
  if (this._isPlaying === false) return;
  this._isPlaying = true;
};

Particles.prototype.stop = function () {
  if (this._isPlaying === false) return;

  for (let i = 0; i < this.particles.length; i++) {
    const particle = this.particles[i];
    particle._reset();
  }

  this._isPlaying = false;
};

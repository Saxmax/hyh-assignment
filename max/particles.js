/* 
  TODO =>
  - events X
  - animationDuration X
  - destroy (manager) X
  - destroy (particle) X
  - pool extend dynamically X
  - randomness
  - scale in example
  - tweens
  - pause/unpause (timescale)

  Bonus features:
  - follow target

  Testing still needed:
  - Events (add, remove, multiple, once, all event types, context, data)
  - Changing animation duration
  - Destroying
*/

const Particles = function Particles(config) {
  this.config = this._getConfig(config);

  this.textures = this._getTexturesArray(this.config.textures);
  this.extendable = this.config.extendable;
  this.quantity = this.config.quantity;
  this.frequency = this.config.frequency;
  this.size = this.config.size;
  this.scale = this.config.scale;
  this.animationDuration = this.config.animationDuration;
  this.lifespan = this.config.lifespan;
  this.emitPosition = { x: this.config.x, y: this.config.y };
  this.gravity = this.config.gravity;
  this.velocity = this.config.velocity;
  this.acceleration = this.config.acceleration;

  // Multi-value properties
  this.angle = { start: 0, end: 0 };

  this.container;
  this.particles = [];
  this.frames = [];

  this._events = {};
  this._isPlaying = false;
  this._elapsed = 0;
  this._countdown = 0;
  this._emitted = 0;

  this._initialize();
};

Particles.DefaultConfig = {
  x: 0,
  y: 0,
  textures: [],
  size: { width: 100, height: 100 },
  lifespan: 1000,
  gravity: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
  alpha: 1,
  angle: { start: 0, end: 0 },
  animationDuration: 1000,
  quantity: 10,
  frequency: 1000,
  autoplay: false,
  extendable: false,
};

Particles.Events = function Events() {};
Particles.Events.ON_READY = "on_ready";
Particles.Events.ON_PLAY = "on_play";
Particles.Events.ON_STOP = "on_stop";
Particles.Events.ON_UPDATE = "on_update";
Particles.Events.ON_DESTROY = "on_destroy";
Particles.Events.ON_PARTICLE_EMIT = "on_particle_emit";
Particles.Events.ON_PARTICLE_DEATH = "on_particle_death";
Particles.Events.ON_PARTICLE_UPDATE = "on_particle_update";
Particles.Events.ON_PARTICLE_DESTROY = "on_particle_destroy";

Particles.prototype.addEventListener = function (
  event,
  callback,
  once,
  context
) {
  if (!event || !callback) return;
  if (this._events[event] === undefined) this._events[event] = [];

  const data = {
    callback: callback,
    once: once === true,
    context: context || this,
  };
  this._events[event].push(data);

  return true;
};

Particles.prototype.removeEventListener = function (event, callback) {
  if (!event || !callback) return;

  const events = this._events[event];
  if (!events) return;

  const data = events.find(function (eventData) {
    return eventData.callback == callback;
  });
  if (!data) return;

  events.splice(events.indexOf(data), 1);

  return true;
};

Particles.prototype._emitEvent = function (event, data) {
  const events = this._events[event];
  if (!events) return;

  for (let i = 0; i < events.length; i++) {
    const eventData = events[i];
    eventData.callback.call(eventData.context, data);

    if (eventData.once === true) {
      events.splice(i, 1);
      i -= 1;
    }
  }
};

Particles.prototype._initialize = function () {
  this._createContainer();
  this._createFrames();
  this._createParticles();

  app.ticker.add(this._onTick, this);

  this._emitEvent(Particles.Events.ON_READY);

  if (this.config.autoplay === true) {
    this.play();
  }
};

Particles.prototype._getConfig = function (config) {
  if (config === undefined) config = {};

  // Make sure all properties have a value
  for (const [key, value] of Object.entries(Particles.DefaultConfig)) {
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

  const particles = [];
  for (let i = 0; i < quantity; i++) {
    const particle = new Particle(this, this.frames);
    particles.push(particle);
    this.particles.push(particle);
    this.container.addChild(particle.sprite);
  }

  return particles;
};

Particles.prototype._getFreeParticle = function () {
  let particle = this.particles.find(function (particle) {
    return particle._getIsAlive() === false;
  });

  if (particle === undefined && this.extendable === true) {
    particle = this._createParticles(1)[0];
  }

  return particle;
};

Particles.prototype._getActiveParticles = function () {
  return this.particles.filter(function (particle) {
    return particle._getIsAlive() === true;
  });
};

Particles.prototype._getStartEndValue = function (data) {
  const result = { start: 0, end: 0 };

  const isNumber = typeof data === "number";
  if (isNumber) {
    result.start = data;
    result.end = data;
  }

  const isRandom = data.hasOwnProperty("min") && data.hasOwnProperty("max");
  if (isRandom) {
    const random = Utilities.getRandom(data.min, data.max);
    result.start = random;
    result.end = random;
  }

  const isRange = data.hasOwnProperty("start") && data.hasOwnProperty("end");
  if (isRange) {
    result.start = data.start;
    result.end = data.end;
  }

  return result;
};

Particles.prototype._resetParticle = function (particle) {
  particle.setLifespan(this.lifespan);
  particle.setSize(this.size.width, this.size.height);
  particle.setAngle(this._getStartEndValue(this.angle));
  particle.setAlpha(1);
  particle.setEmitPosition(this.emitPosition.x, this.emitPosition.y);
  particle.setAcceleration(this.acceleration.x, this.acceleration.y);
  particle.setGravity(this.gravity.x, this.gravity.y);
  particle.setScale(this.scale.x, this.scale.y);

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

  this._emitEvent(Particles.Events.ON_PARTICLE_EMIT, particle);
};

Particles.prototype._onTick = function () {
  if (this._isPlaying === false) return;

  const dt = app.ticker.deltaMS;
  this._elapsed += dt;

  this._emitEvent(Particles.Events.ON_UPDATE, dt);

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
      particle._onParticleUpdate(dt);
    }.bind(this)
  );
};

Particles.prototype.setDuration = function (animationDuration, updateExisting) {
  this.animationDuration = animationDuration;
  this._createFrames();

  if (updateExisting === true) {
    this.particles.forEach(function (particle) {
      particle.setDuration(animationDuration);
    });
  }
};

Particles.prototype.play = function () {
  if (this._isPlaying === true) return;

  this._emitted = 0;
  this._elapsed = 0;
  this._countdown = this.frequency || 0;
  this._isPlaying = true;

  this._emitEvent(Particles.Events.ON_PLAY);
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

  this._emitEvent(Particles.Events.ON_STOP);
};

Particles.prototype.destroy = function () {
  this._isPlaying = false;
  this.particles.forEach(function (particle) {
    particle.destroy();
  });
  this.particles.length = 0;
  this.frames.length = 0;
  this.textures.length = 0;
  app.stage.removeChild(this.container);
  this.container.destroy();
  this.container = null;
  this.config = null;
  this._emitEvent(Particles.Events.ON_DESTROY, this);
};

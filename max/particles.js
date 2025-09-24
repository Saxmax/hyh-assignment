const Particles = function Particles(config) {
  this.config = this._getConfig(config);

  this.textures = this._getTexturesArray(this.config.textures);
  this.extendable = this.config.extendable;
  this.quantity = this.config.quantity;
  this.frequency = this.config.frequency;
  this.animationDuration = this.config.animationDuration;
  this.lifespan = this.config.lifespan;

  this.emitPositionX = this._getMinMaxValue(config.x);
  this.emitPositionY = this._getMinMaxValue(config.y);
  this.velocityX = this._getMinMaxValue(config.velocityX);
  this.velocityY = this._getMinMaxValue(config.velocityY);
  this.gravityX = this._getMinMaxValue(config.gravityX);
  this.gravityY = this._getMinMaxValue(config.gravityY);
  this.accelerationX = this._getMinMaxValue(config.accelerationX);
  this.accelerationY = this._getMinMaxValue(config.accelerationY);

  this.angle = this._getStartEndValue(config.angle);
  this.alpha = this._getStartEndValue(config.alpha);
  this.width = this._getStartEndValue(config.width);
  this.height = this._getStartEndValue(config.height);

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
  textures: [],
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  lifespan: 1000,
  velocityX: 0,
  velocityY: 0,
  gravityX: 0,
  gravityY: 0,
  accelerationX: 0,
  accelerationY: 0,
  angle: 0,
  alpha: 1,
  animationDuration: 1000,
  quantity: 10,
  frequency: 1000,
  autoplay: false,
  extendable: false,
};

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

  // Make sure all properties have a value.
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

Particles.prototype._getDualValue = function (data, a, b) {
  const result = { [a]: data, [b]: data };

  const isRange = data.hasOwnProperty(a) && data.hasOwnProperty(b);
  if (isRange) {
    result[a] = data[a];
    result[b] = data[b];
  }

  return result;
};

Particles.prototype._getStartEndValue = function (data) {
  return this._getDualValue(data, "start", "end");
};

Particles.prototype._getMinMaxValue = function (data) {
  return this._getDualValue(data, "min", "max");
};

Particles.prototype._prepareParticle = function (particle) {
  const ex = Utilities.getRandom(
    this.emitPositionX.min,
    this.emitPositionX.max
  );
  const ey = Utilities.getRandom(
    this.emitPositionY.min,
    this.emitPositionY.max
  );
  particle.setEmitPosition(ex, ey);

  const vx = Utilities.getRandom(this.velocityX.min, this.velocityX.max);
  const vy = Utilities.getRandom(this.velocityY.min, this.velocityY.max);
  particle.setInitialVelocity(vx, vy);

  const gx = Utilities.getRandom(this.gravityX.min, this.gravityX.max);
  const gy = Utilities.getRandom(this.gravityY.min, this.gravityY.max);
  particle.setGravity(gx, gy);

  const ax = Utilities.getRandom(
    this.accelerationX.min,
    this.accelerationX.max
  );
  const ay = Utilities.getRandom(
    this.accelerationY.min,
    this.accelerationY.max
  );
  particle.setAcceleration(ax, ay);

  particle.setLifespan(this.lifespan);
  particle.setAngle(this.angle);
  particle.setAlpha(this.alpha);
  particle.setSize(this.width, this.height);
};

Particles.prototype._emitParticle = function () {
  const particle = this._getFreeParticle();
  if (particle === undefined) return;

  this._prepareParticle(particle);
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
  active.forEach(function (particle) {
    particle._onParticleUpdate(dt);
  });
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
  this._emitParticle();
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

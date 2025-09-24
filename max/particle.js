const Particle = function Particle(manager, frames) {
  this.sprite;
  this.isAlive = false;

  this.alpha = { start: 1, end: 1, value: 0 };
  this.angle = { start: 0, end: 0, value: 0 };
  this.width = { start: 50, end: 50, value: 0 };
  this.height = { start: 50, end: 50, value: 0 };

  this._emitPosition = { x: 0, y: 0 };
  this._initialVelocity = { x: 0, y: 0 };
  this._gravity = { x: 0, y: 0 };
  this._acceleration = { x: 0, y: 0 };
  this._manager = manager;
  this._velocity = { x: 0, y: 0 };
  this._maxVelocity = { x: 0, y: 0 };
  this._t = 0;

  this.lifespan = 0;
  this.elapsed = 0;
  this.deltaTime = 0;
  this.deltaTimeMs = 0;

  this._createAnimatedSprite(frames);
};

Particle.prototype._createAnimatedSprite = function (frames) {
  this.sprite = new PIXI.AnimatedSprite(frames);
  this.sprite.anchor.set(0.5);
  this.sprite.visible = false;
};

Particle.Property = function Property() {};
Particle.Property.Alpha = "alpha";
Particle.Property.Angle = "angle";
Particle.Property.Height = "height";
Particle.Property.Width = "width";

Particle.prototype._onParticleUpdate = function (dt) {
  if (this.isAlive === false) return;

  this.deltaTime = dt / 1000;
  this.deltaTimeMs = dt;

  this.elapsed += this.deltaTimeMs;
  this._t = Utilities.normalize(this.elapsed, this.lifespan);

  if (this._t >= 1) {
    this._reset();
    this._manager._emitEvent(Particles.Events.ON_PARTICLE_DEATH, this);
    return;
  }

  this._manager._emitEvent(Particles.Events.ON_PARTICLE_UPDATE, this);

  this._updateVelocity();
  this.sprite.x += this._velocity.x * this.deltaTime;
  this.sprite.y += this._velocity.y * this.deltaTime;

  // Update multi-value properties.
  this._updateProperty(Particle.Property.Alpha);
  this._updateProperty(Particle.Property.Angle);
  this._updateProperty(Particle.Property.Height);
  this._updateProperty(Particle.Property.Width);
};

Particle.prototype._updateProperty = function (property) {
  const data = this[property];
  data.value = Utilities.lerp(data.start, data.end, this._t);
  this.sprite[property] = data.value;
};

Particle.prototype._emit = function () {
  this.sprite.x = this._emitPosition.x;
  this.sprite.y = this._emitPosition.y;

  this._updateProperty(Particle.Property.Alpha);
  this._updateProperty(Particle.Property.Angle);
  this._updateProperty(Particle.Property.Height);
  this._updateProperty(Particle.Property.Width);

  this.sprite.visible = true;

  this.sprite.play();

  this._velocity.x = this._initialVelocity.x;
  this._velocity.y = this._initialVelocity.y;

  this._t = 0;
  this.elapsed = 0;
  this.isAlive = true;
};

Particle.prototype._reset = function () {
  this.sprite.stop();
  this.sprite.visible = false;
  this.isAlive = false;
};

Particle.prototype._updateVelocity = function () {
  let vx = this._velocity.x;
  let vy = this._velocity.y;

  vx += this._gravity.x * this.deltaTime;
  vy += this._gravity.y * this.deltaTime;

  vx += this._acceleration.x * this.deltaTime;
  vy += this._acceleration.y * this.deltaTime;

  if (this._maxVelocity.x != 0) {
    vx = Utilities.clamp(vx, -this._maxVelocity.x, this._maxVelocity.x);
  }
  if (this._maxVelocity.y != 0) {
    vy = Utilities.clamp(vy, -this._maxVelocity.y, this._maxVelocity.y);
  }

  this._velocity.x = vx;
  this._velocity.y = vy;
};

Particle.prototype._getIsAlive = function () {
  return this.isAlive === true;
};

Particle.prototype.setDuration = function (duration) {
  for (let i = 0; i < this.sprite.textures.length; i++) {
    const frameObject = this.sprite.textures[i];
    frameObject.time = duration / this.sprite.textures.length;
  }
};

Particle.prototype.setLifespan = function (lifespan) {
  this.lifespan = lifespan;
};

Particle.prototype.setInitialVelocity = function (velocityX, velocityY) {
  this._initialVelocity.x = velocityX;
  this._initialVelocity.y = velocityY;
};

Particle.prototype.setMaxVelocity = function (maxVelocityX, maxVelocityY) {
  this._maxVelocity.x = maxVelocityX;
  this._maxVelocity.y = maxVelocityY;
};

Particle.prototype.setVelocity = function (velocityX, velocityY) {
  this._velocity.x = velocityX;
  this._velocity.y = velocityY;
};

Particle.prototype.setGravity = function (gravityX, gravityY) {
  this._gravity.x = gravityX;
  this._gravity.y = gravityY;
};

Particle.prototype.setAcceleration = function (accelerationX, accelerationY) {
  this._acceleration.x = accelerationX;
  this._acceleration.y = accelerationY;
};

Particle.prototype.setSize = function (width, height) {
  this.width.start = width.start;
  this.width.end = width.end;

  this.height.start = height.start;
  this.height.end = height.end;
};

Particle.prototype.setEmitPosition = function (x, y) {
  this._emitPosition.x = x;
  this._emitPosition.y = y;
};

Particle.prototype.setAngle = function (angle) {
  this.angle.start = angle.start;
  this.angle.end = angle.end;
};

Particle.prototype.setAlpha = function (alpha) {
  this.alpha.start = alpha.start;
  this.alpha.end = alpha.end;
};

Particle.prototype.destroy = function () {
  this.isAlive = false;
  this._manager.container.removeChild(this.sprite);
  this.sprite.destroy();
  this.sprite = null;
  this._manager._emitEvent(Particles.Events.ON_PARTICLE_DESTROY, this);
  this._manager = null;
};

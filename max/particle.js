const Particle = function Particle(manager, frames) {
  this.sprite;
  this.isAlive = false;

  this.angle = { start: 0, end: 0, value: 0 };

  this.x = 0;
  this.y = 0;
  this.alpha = 1;
  this.scale = { x: 1, y: 1 };

  this.emitPosition = { x: 0, y: 0 };
  this.gravity = { x: 0, y: 0 };
  this.initialVelocity = { x: 0, y: 0 };
  this.maxVelocity = { x: 0, y: 0 };
  this.acceleration = { x: 0, y: 0 };

  this._manager = manager;
  this._velocity = { x: 0, y: 0 };
  this._size = { width: 100, height: 100 };
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
  this.setSize(this._size.width, this._size.height);
};

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
};

Particle.prototype._emit = function () {
  this.sprite.x = this.emitPosition.x;
  this.sprite.y = this.emitPosition.y;
  this.sprite.alpha = this.alpha;
  this.sprite.angle = this.angle.start;
  this.setSize(this._size.width, this._size.height);
  this.sprite.visible = true;
  this.sprite.play();

  this._velocity.x = this.initialVelocity.x;
  this._velocity.y = this.initialVelocity.y;

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

  vx += this.gravity.x * this.deltaTime;
  vy += this.gravity.y * this.deltaTime;

  vx += this.acceleration.x * this.deltaTime;
  vy += this.acceleration.y * this.deltaTime;

  if (this.maxVelocity.x != 0) {
    vx = Utilities.clamp(vx, -this.maxVelocity.x, this.maxVelocity.x);
  }
  if (this.maxVelocity.y != 0) {
    vy = Utilities.clamp(vy, -this.maxVelocity.y, this.maxVelocity.y);
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
  this.initialVelocity.x = velocityX;
  this.initialVelocity.y = velocityY;
};

Particle.prototype.setMaxVelocity = function (maxVelocityX, maxVelocityY) {
  this.maxVelocity.x = maxVelocityX;
  this.maxVelocity.y = maxVelocityY;
};

Particle.prototype.setVelocity = function (velocityX, velocityY) {
  this._velocity.x = velocityX;
  this._velocity.y = velocityY;
};

Particle.prototype.setGravity = function (gravityX, gravityY) {
  this.gravity.x = gravityX;
  this.gravity.y = gravityY;
};

Particle.prototype.setAcceleration = function (accelerationX, accelerationY) {
  this.acceleration.x = accelerationX;
  this.acceleration.y = accelerationY;
};

Particle.prototype.setSize = function (width, height) {
  this._size.width = width;
  this._size.height = height;

  this.sprite.width = width * this.scale.x;
  this.sprite.height = height * this.scale.y;
};

Particle.prototype.setScale = function (x, y) {
  this.scale.x = x;
  this.scale.y = y;

  this.setSize(this._size.width, this._size.height);
};

Particle.prototype.setEmitPosition = function (x, y) {
  this.emitPosition.x = x;
  this.emitPosition.y = y;
};

Particle.prototype.setAngle = function (angle) {
  this.angle.start = angle.start;
  this.angle.end = angle.end;
};

Particle.prototype.setAlpha = function (alpha) {
  this.alpha = alpha;
};

Particle.prototype.destroy = function () {
  this.isAlive = false;
  this._manager.container.removeChild(this.sprite);
  this.sprite.destroy();
  this.sprite = null;
  this._manager._emitEvent(Particles.Events.ON_PARTICLE_DESTROY, this);
  this._manager = null;
};

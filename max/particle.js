const Particle = function Particle(frames) {
  this.x = 0;
  this.y = 0;
  this.alpha = 1;
  this.angle = 0;
  this.size = { width: 100, height: 100 };
  this.elapsed = 0;
  this.isAlive = false;

  this.emitPosition = { x: 0, y: 0 };
  this.gravity = { x: 0, y: 0 };
  this.initialVelocity = { x: 0, y: 0 };
  this.maxVelocity = { x: 0, y: 0 };
  this.acceleration = { x: 0, y: 0 };

  this._velocity = { x: 0, y: 0 };

  this.deltaTime = 0;
  this.deltaTimeMs = 0;

  this.sprite = new PIXI.AnimatedSprite(frames);
  this.sprite.anchor.set(0.5);
  this.sprite.visible = false;
};

Particle.prototype._onParticleUpdate = function (dt) {
  if (this.isAlive === false) return;

  this.deltaTime = dt / 1000;
  this.deltaTimeMs = dt;

  this.elapsed += this.deltaTimeMs;

  this._updateVelocity();

  this.sprite.x += this._velocity.x * this.deltaTime;
  this.sprite.y += this._velocity.y * this.deltaTime;
};

Particle.prototype._emit = function () {
  this.sprite.x = this.emitPosition.x;
  this.sprite.y = this.emitPosition.y;
  this.sprite.alpha = this.alpha;
  this.sprite.angle = this.angle;
  this.setAngle(this.angle);
  this.setSize(this.size.width, this.size.height);
  this.sprite.visible = true;
  this.sprite.play();

  this._velocity.x = this.initialVelocity.x;
  this._velocity.y = this.initialVelocity.y;

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
  this.size.width = width;
  this.size.height = height;

  this.sprite.width = width;
  this.sprite.height = height;
};

Particle.prototype.setEmitPosition = function (x, y) {
  this.emitPosition.x = x;
  this.emitPosition.y = y;
};

Particle.prototype.setAngle = function (angle) {
  this.angle = angle;
};

Particle.prototype.setAlpha = function (alpha) {
  this.alpha = alpha;
};

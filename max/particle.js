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
  this.velocity = { x: 0, y: 0 };
  this.acceleration = { x: 0, y: 0 };

  this.deltaTime = 0;
  this.deltaTimeMs = 0;

  this.sprite = new PIXI.AnimatedSprite(frames);
  this.sprite.anchor.set(0.5);
  this.sprite.visible = false;
};

Particle.prototype.onTick = function (dt) {
  if (this.isAlive === false) return;

  this.deltaTime = dt / 1000;
  this.deltaTimeMs = dt;

  this.elapsed += this.deltaTimeMs;

  this.sprite.x += this.velocity.x * this.deltaTime;
  this.sprite.y += this.velocity.y * this.deltaTime;

  this.velocity.x += this.acceleration.x + this.gravity.x;
  this.velocity.y += this.acceleration.y + this.gravity.y;
};

Particle.prototype.emit = function () {
  this.sprite.x = this.emitPosition.x;
  this.sprite.y = this.emitPosition.y;
  this.sprite.alpha = this.alpha;
  this.sprite.angle = this.angle;
  this.setAngle(this.angle);
  this.setSize(this.size.width, this.size.height);
  this.sprite.visible = true;
  this.sprite.play();

  this.elapsed = 0;
  this.isAlive = true;
};

Particle.prototype.reset = function () {
  this.sprite.stop();
  this.sprite.visible = false;
  this.isAlive = false;
};

Particle.prototype.setVelocity = function (velocityX, velocityY) {
  this.velocity.x = velocityX;
  this.velocity.y = velocityY;
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

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
  lifespan: 1000,
  gravity: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  autoplay: false,
  animationDuration: 1000,
  quantity: 10,
  frequency: 20,
};

const Particles = function Particles(config) {
  this.config = this.getConfig(config);

  this.emitPosition = { x: this.config.x, y: this.config.y };
  this.animationDuration = this.config.animationDuration;
  this.lifespan = this.config.lifespan;
  this.gravity = this.config.gravity;
  this.velocity = this.config.velocity;
  this.acceleration = this.config.acceleration;
  this.quantity = this.config.quantity;
  this.frequency = this.config.frequency;
  this.textures = this.config.textures;

  this.isPlaying = false;

  this.initialize();

  if(this.config.autoplay === true) {
    this.play();
  }
  return;

  // Make sure textures is always an array
  const _textures = Array.isArray(textures) ? textures : [textures];
  this.textures = _textures;
  this.sprites = [];

  this.container = new PIXI.Container();
  app.stage.addChild(container);

  // this._createAnimatedSprites();

  app.ticker.add(this.onTick.bind(this));
};

Particles.prototype.initialize = function() {
  //
};

Particles.prototype.getConfig = function(config) {
  if(config === undefined) config = {};

  // Make sure all properties have a value
  for (const [key, value] of Object.entries(DefaultParticleConfig)) {
    if(config[key] === undefined) {
      config[key] = value;
    }
  }

  return config;
};

Particles.prototype._createAnimatedSprites = function() {
  if(this.sprite !== undefined) return;

  const objects = [];
  for (let i = 0; i < this.textures.length; i++) {
    const frameObject = { texture: this.textures[i], time: this.animationDuration / this.textures.length };
    objects.push(frameObject);
  }

  for (let i = 0; i < this.quantity; i++) {
    const sprite = new PIXI.AnimatedSprite(objects);
    sprite.anchor.set(0.5);
    this.sprites.push(sprite);
    this.container.addChild(sprite);
  }
  // sprite.position.set(this.emitPosition.x, this.emitPosition.y);
  // app.stage.addChild(sprite);
};

Particles.prototype._updateAnimatedSprite = function() {
  if(this.sprite === undefined) return;

  for (let i = 0; i < this.sprite.textures.length; i++) {
    const frameObject = this.sprite.textures[i];
    frameObject.time = this.animationDuration / this.sprite.textures.length;
  }
};

Particles.prototype.onTick = function(dt) {
  if(this.isPlaying === false) return;
};

Particles.prototype.setDuration = function(animationDuration) {
  this.animationDuration = animationDuration;
  this._updateAnimatedSprite();
};

Particles.prototype.play = function() {
  this.container.x = this.emitPosition.x;
  this.container.y = this.emitPosition.y;
  this.isPlaying = true;
};

Particles.prototype.pause = function() {
  this.isPlaying = false;
};

Particles.prototype.stop = function() {
  this.isPlaying = false;
  // TODO => Reset everything, kill current sprites, etc
};
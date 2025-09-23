/* 
  TODO =>
  - Let first param be a settings object for more customization
*/

const Particles = function Particles(x, y, textures) {
  // Setting up class variables with default values
  this.emitPosition = { x: x || 0, y: y || 0 };
  this.animationDuration = 1000;
  this.lifespan = 1000;
  this.gravity = { x: 0, y: 0 };
  this.velocity = { x: 0, y: 0 };
  this.isPlaying = false;

  // Make sure textures is always an array
  const _textures = Array.isArray(textures) ? textures : [textures];
  this.textures = _textures;
  
  this.sprite = this._createAnimatedSprite();

  this.container = new PIXI.Container();
  app.stage.addChild(container);
};

Particles.prototype._createAnimatedSprite = function() {
  if(this.sprite !== undefined) return;

  const objects = [];
  for (let i = 0; i < this.textures.length; i++) {
    const frameObject = { texture: this.textures[i], time: this.animationDuration / this.textures.length };
    objects.push(frameObject);
  }

  const sprite = new PIXI.AnimatedSprite(objects);
  sprite.anchor.set(0.5);
  sprite.position.set(this.emitPosition.x, this.emitPosition.y);
  app.stage.addChild(sprite);

  return sprite;
};

Particles.prototype._updateAnimatedSprite = function() {
  if(this.sprite === undefined) return;

  for (let i = 0; i < this.sprite.textures.length; i++) {
    const frameObject = this.sprite.textures[i];
    frameObject.time = this.animationDuration / this.sprite.textures.length;
  }
};

Particles.prototype.setDuration = function(animationDuration) {
  this.animationDuration = animationDuration;
  this._updateAnimatedSprite();
};
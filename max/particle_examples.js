Particles.Examples = function Examples() {};
Particles.Examples.Fountain = function (textures) {
  return {
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    textures,
    width: { start: 20, end: 50 },
    height: { start: 20, end: 50 },
    lifespan: 1500,
    velocityX: { min: -500, max: 500 },
    velocityY: { min: -1000, max: -1500 },
    gravityY: 2000,
    angle: { start: 0, end: 180 },
    quantity: 64,
    frequency: 50,
    autoplay: true,
    extendable: true,
  };
};
Particles.Examples.Explosions = function (textures) {
  return {
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    textures,
    width: { start: 50, end: 10 },
    height: { start: 50, end: 10 },
    lifespan: 1500,
    velocityX: { min: -500, max: 500 },
    velocityY: { min: -500, max: 500 },
    gravityY: 20,
    angle: { start: 0, end: 360 },
    alpha: { start: 1, end: 0.2 },
    animationDuration: 500,
    quantity: 64,
    frequency: 0,
    autoplay: true,
    extendable: false,
  };
};
Particles.Examples.MarioCoin = function (textures) {
  return {
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    textures,
    width: 100,
    height: 100,
    lifespan: 1250,
    velocityY: -1250,
    gravityY: 2000,
    animationDuration: 750,
    quantity: 1,
    frequency: 2000,
    autoplay: true,
    extendable: false,
  };
};
Particles.Examples.Cannon = function (textures) {
  return {
    x: 100,
    y: app.screen.height / 2,
    textures,
    width: 75,
    height: 75,
    lifespan: 1200,
    velocityX: { min: 2200, max: 2600 },
    velocityY: { min: -700, max: -1400 },
    gravityY: 2000,
    animationDuration: 500,
    quantity: 1,
    frequency: 2000,
    autoplay: true,
    extendable: false,
  };
};
Particles.Examples.Torpedo = function (textures) {
  return {
    x: 100,
    y: app.screen.height / 2,
    textures,
    width: 150,
    height: 75,
    lifespan: 4000,
    animationDuration: textures.length * 12000,
    accelerationX: 500,
    quantity: 1,
    frequency: 4500,
    autoplay: true,
    extendable: false,
  };
};
Particles.Examples.Shmup = function (textures) {
  return {
    x: 100,
    y: { min: app.screen.height * 0.3, max: app.screen.height * 0.7 },
    textures,
    width: { start: 30, end: 20 },
    height: { start: 30, end: 20 },
    lifespan: 2000,
    velocityX: 3000,
    animationDuration: 250,
    quantity: 256,
    frequency: 50,
    autoplay: true,
    extendable: true,
  };
};
Particles.Examples.Twinkle = function (textures) {
  return {
    x: { min: 0, max: app.screen.width },
    y: { min: 0, max: app.screen.height },
    textures,
    width: { start: 10, end: 5 },
    height: { start: 10, end: 5 },
    lifespan: 1500,
    animationDuration: textures.length * 12000,
    quantity: 1024,
    frequency: 1,
    autoplay: true,
    extendable: true,
  };
};

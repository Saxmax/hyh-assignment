const textureCount = 30;
const coinPath = "./assets/coin/coin_";
const coinTextures = [];
for (let i = 0; i < textureCount; i++) {
  const fullNumber = "000" + i.toString();
  const uniqueNumber = fullNumber.substring(fullNumber.length - 3);
  const path = coinPath + uniqueNumber + ".png";
  const texture = PIXI.Texture.from(path);
  coinTextures.push(texture);

  if (i == textureCount - 1) {
    texture.baseTexture.once("loaded", onTexturesLoaded);
  }
}

function onTexturesLoaded() {
  let config;
  switch (example) {
    case Examples.Fountain:
      config = Particles.Examples.Fountain(coinTextures);
      bunny.rotate = true;
      break;
    case Examples.Explosions:
      config = Particles.Examples.Explosions(coinTextures);
      bunny.rotate = true;
      break;
    case Examples.MarioCoin:
      config = Particles.Examples.MarioCoin(coinTextures);
      break;
    case Examples.Cannon:
      config = Particles.Examples.Cannon(coinTextures);
      bunny.x = config.x;
      bunny.y = config.y;
      break;
    case Examples.Torpedo:
      config = Particles.Examples.Torpedo(coinTextures);
      bunny.x = config.x - 50;
      bunny.y = config.y;
      break;
    case Examples.Shmup:
      config = Particles.Examples.Shmup(coinTextures);
      bunny.x = config.x;
      break;
    case Examples.Twinkle:
      config = Particles.Examples.Twinkle(coinTextures);
      bunny.visible = false;
      break;

    default:
      config = {
        textures: coinTextures,

        // Can only be numbers.
        lifespan: 1000,
        animationDuration: 1000,
        quantity: 10,
        frequency: 1000,

        autoplay: false,
        extendable: false,

        // Can be either a number or an object with min & max number properties.
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        gravityX: 0,
        gravityY: 0,
        accelerationX: 0,
        accelerationY: 0,

        // Can be either a number or an object with start & end number properties.
        width: 50,
        height: 50,
        angle: 0,
        alpha: 1,
      };
  }

  const particles = new Particles(config);
  app.stage.swapChildren(particles.container, bunny);

  if (example == Examples.Shmup) {
    particles.addEventListener(
      Particles.Events.ON_PARTICLE_EMIT,
      function (particle) {
        bunny.y = particle.sprite.y;
      }
    );
  }
}

const Examples = {
  Custom: 0,
  Fountain: 1,
  Explosions: 2,
  MarioCoin: 3,
  Cannon: 4,
  Torpedo: 5,
  Shmup: 6,
  Twinkle: 7,
};

// Modify this value to quickly test the different examples provided.
// Or set it to 'Custom' to play with the values yourself.
const example = Examples.Fountain;

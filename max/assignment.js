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
  const config = {
    textures: coinTextures,
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    autoplay: true,
    quantity: 1,
    extendable: true,
    // alpha: { start: 1, end: 0 },
    angle: { start: 0, end: 180 }, // min/max
    // velocity: { x: 0, y: -2000 },
    gravity: { x: 0, y: 2000 },
    lifespan: 1000,
    size: { width: 50, height: 50 },
    frequency: 50,
  };
  const particles = new Particles(config);
}

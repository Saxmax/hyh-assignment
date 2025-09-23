// Load all coin assets
const coinPath = './assets/coin/coin_';
const coinTextures = [];
for (let i = 0; i < 30; i++) {
  const fullNumber = ('000' + i.toString());
  const uniqueNumber = fullNumber.substring(fullNumber.length - 3);
  const path = coinPath + uniqueNumber + '.png';
  const texture = PIXI.Texture.from(path);
  coinTextures.push(texture);
}

const particles = new Particles(app.screen.width / 2, app.screen.height / 2, coinTextures);
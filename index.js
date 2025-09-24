const app = new PIXI.Application({ background: "#1099bb", resizeTo: window });
document.body.appendChild(app.view);

// Create a new texture
const texture = PIXI.Texture.from("./assets/bunny.png");
const bunny = new PIXI.Sprite(texture);
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
bunny.anchor.set(0.5);
bunny.width = 100;
bunny.height = 100;
bunny.rotate = false;
app.stage.addChild(bunny);

// Listen for animate update
app.ticker.add((delta) => {
  if (bunny.rotate) {
    bunny.rotation -= 0.01 * delta;
  }
});

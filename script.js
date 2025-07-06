// PixiJS setup for fabric displacement effect

const app = new PIXI.Application({
  view: document.getElementById('fabric-canvas'),
  resizeTo: window,
  transparent: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
});

let displacementSprite, displacementFilter;
let mousePosition = { x: 0, y: 0 };
let targetPosition = { x: 0, y: 0 };
let velocity = { x: 0, y: 0 };
const easing = 0.1;

// Load fabric texture and displacement map
PIXI.Loader.shared
  .add('fabricTexture', 'https://i.ibb.co/2kR7Zqv/silk-texture.jpg')
  .add('displacementMap', 'https://i.ibb.co/7vY9Q7Z/displacement-map.png')
  .load(setup);

function setup(loader, resources) {
  // Create fabric sprite
  const fabric = new PIXI.Sprite(resources.fabricTexture.texture);
  fabric.width = app.screen.width;
  fabric.height = app.screen.height;
  fabric.tileScale.set(1);
  fabric.tilePosition.set(0);
  app.stage.addChild(fabric);

  // Create displacement sprite
  displacementSprite = new PIXI.Sprite(resources.displacementMap.texture);
  displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
  displacementSprite.scale.set(2);
  app.stage.addChild(displacementSprite);

  // Create displacement filter
  displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
  displacementFilter.scale.x = 30;
  displacementFilter.scale.y = 30;

  fabric.filters = [displacementFilter];

  // Animate displacement sprite
  app.ticker.add(() => {
    // Smoothly move displacement sprite towards target position
    velocity.x += (targetPosition.x - displacementSprite.x) * easing;
    velocity.y += (targetPosition.y - displacementSprite.y) * easing;

    velocity.x *= 0.8;
    velocity.y *= 0.8;

    displacementSprite.x += velocity.x;
    displacementSprite.y += velocity.y;

    // Slowly move the displacement map to create waving effect
    displacementSprite.x += 1;
    displacementSprite.y += 1;
  });

  // Mouse move event to update target position
  window.addEventListener('mousemove', (event) => {
    targetPosition.x = event.clientX;
    targetPosition.y = event.clientY;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    fabric.width = app.screen.width;
    fabric.height = app.screen.height;
  });
}

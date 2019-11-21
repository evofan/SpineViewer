import * as PIXI from "pixi.js";
import { loader, IgnorePlugin } from "webpack";
window.PIXI = PIXI;
import "pixi-spine";

console.log(PIXI);

// init
const WIDTH: number = 720;
const HEIGHT: number = 480;
const BG_COLOR: number = 0x000000;

/*
// old way
const app: PIXI.Application = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT,
  forceCanvas: false,
  backgroundColor: BG_COLOR
});
document.body.appendChild(app.view);
*/

// renderer
let renderer: PIXI.Renderer = new PIXI.Renderer({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR
});
document.body.appendChild(renderer.view);

// stage
let stage: PIXI.Container = new PIXI.Container();

// Custom GameLoop(v5)
// call requestAnimationFrame directly.
let oldTime = Date.now();
let ms = 1000;
let fps = 60;
let animate = () => {
  // console.log("animate()");
  let newTime = Date.now();
  let deltaTime = newTime - oldTime;
  oldTime = newTime;
  if (deltaTime < 0) {
    deltaTime = 0;
  }
  if (deltaTime > ms) {
    deltaTime = ms;
  }
  let deltaFrame = (deltaTime * fps) / ms;
  // sprite.rotation += 0.1 * deltaFrame; // sample
  moveStar(deltaFrame);

  // update your game there
  renderer.render(stage);
  requestAnimationFrame(animate);
};

// ticker
/*
let ticker: PIXI.Ticker = new PIXI.Ticker();
ticker.add(() => {
  renderer.render(stage);
}, PIXI.UPDATE_PRIORITY.LOW);
ticker.start();
*/

// loader
let loader: PIXI.Loader = new PIXI.Loader();

// asset
const ASSET_BG: string = "assets/images/pic_bg.jpg"; // your bakground image
const ASSET_STAR: string = "assets/images/pic_star.png"; // fps test

// const ASSET_SPINE1: string = "assets/spine/alien/export/alien.json";
// const ASSET_SPINE1: string = "assets/spine/spineboy/export/spineboy.json";
// const ASSET_SPINE1: string = "assets/spine/dragon/export/dragon.json";
const ASSET_SPINE1: string = "assets/spine/powerup/export/powerup.json";

const spineLoaderOptions: object = { metadata: { spineSkeletonScale: 0.5 } };
const offsetY: number = 0; // 140: spineboy, alien;
let spine: PIXI.spine.Spine;

// const anim_ary: string[] = ["death", "hit", "jump", "run"]; // Alien, TODO: Auto detect and make button
/*
const anim_ary: string[] = [ // spineboy
  "aim",
  "death",
  "hoverboard",
  "idle",
  "idle-turn",
  "jump",
  "portal",
  "run",
  "run-to-idle",
  "shoot",
  "walk"
];
*/
// const anim_ary: string[] = ["flying"]; // dragon
const anim_ary: string[] = ["bounce"]; // powerup

const anim_length: number = anim_ary.length;
let anim_index: number = 0;

// container
let container: PIXI.Container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
// container.interactive = true;
// container.buttonMode = true;
// container.isSprite = true;
// container.interactiveChildren = true;
stage.addChild(container);
console.log(container);

// bg
let bg: PIXI.Sprite;

// sprite
let star: PIXI.Sprite;

// texts
let text_libVersion: PIXI.Text,
  text_userMessage: PIXI.Text,
  text_animationName: PIXI.Text,
  text_error: PIXI.Text,
  text_fps: PIXI.Text;

if (!ASSET_BG || ASSET_BG === null || typeof ASSET_BG === "undefined") {
  // console.log("background image error");
  // throw Error("Unable to load image ...");
  console.log("Do not use background image.");
}

// loader
loader
  .add("bg", ASSET_BG)
  .add("star", ASSET_STAR)
  .add("spineCharacter", ASSET_SPINE1, spineLoaderOptions) // spine ver. 3.8
  .load(function(loader: PIXI.Loader, resources: any) {
    console.log(loader);

    // bg
    bg = new PIXI.Sprite(resources.bg.texture);
    bg.interactive = true;
    bg.buttonMode = true;
    container.addChild(bg);
    bg.on("pointerdown", onClick);
    // - Pointers normalize touch and mouse -
    // sprite.on('pointerdown', onClick);
    //
    // - Alternatively, use the mouse & touch events: -
    // sprite.on('click', onClick); // mouse-only
    // sprite.on('tap', onClick); // touch-only

    // star
    star = new PIXI.Sprite(resources.star.texture);
    container.addChild(star);
    star.x = 10;
    star.y = 410;
    star.scale.x = star.scale.y = 0.5;
    star.anchor.set(0.5);

    // text_version
    let version: string =
      "pixi-spine 2.1.4\nPixiJS 5.2.0\nSpine 3.8.55\nwebpack 4.41.2";
    text_libVersion = setText(version, "Arial", 24, 0xf0fff0, "left", "bold");
    container.addChild(text_libVersion);
    text_libVersion.x = 10;
    text_libVersion.y = 10;

    // text_userMessage
    let usermessage: string = "Touch the Stage !";
    text_userMessage = setText(
      usermessage,
      "Arial",
      24,
      0xff0033,
      "center",
      "bold",
      "#000000",
      5,
      false
    );
    container.addChild(text_userMessage);
    text_userMessage.x = WIDTH / 2 - text_userMessage.width / 2;
    text_userMessage.y = HEIGHT - text_userMessage.height - 10;

    // text_fps
    text_fps = setText(fps, "Arial", 24, 0x00cc00, "right", "bold");
    container.addChild(text_fps);
    let offsetX = 10;
    text_fps.x = WIDTH - text_fps.width - offsetX;
    text_fps.y = 440;

    // spine
    spine = new PIXI.spine.Spine(resources.spineCharacter.spineData);
    console.log(spine);
    spine.x = WIDTH / 2;
    spine.y = HEIGHT / 2 + offsetY;
    // spine.scale.x = spine.scale.y = 0.5; // other
    spine.scale.x = spine.scale.y = 1.5; // powerup
    spine.y = 350; // powerup
    container.addChild(spine);

    // app start
    requestAnimationFrame(animate);
  });

loader.onError.add(() => {
  displayError();
  throw Error("load error ...");
});

/**
 * dislpay Asset Loading Error
 */
let displayError = () => {
  let error_message: string = "Asset Loading Error ...";
  text_error = setText(error_message, "Arial", 24, 0xff0000, "center", "bold");
  container.addChild(text_error);
  text_error.x = WIDTH / 2 - text_error.width / 2;
  text_error.y = HEIGHT / 2 - text_error.height / 2;
};

/**
 * Callback when the background is pressed
 * @param { MouseEvent } e
 */
let onClick = (e: MouseEvent) => {
  console.log("onClick(): ", e);
  if (text_animationName) {
    clearText(text_animationName);
  }
  playAnimation();
};

/**
 * Remeove text_animationName
 * @param { PIXI.Text } targetText
 */
let clearText = (target: PIXI.Text) => {
  target.text = "";
  container.removeChild(target);
};

/**
 * Change & Play Alien Animation.
 * @TODO: get animation end callback and clearIndex
 */
let playAnimation = () => {
  let animation: string = "animation: " + anim_ary[anim_index];
  text_animationName = setText(
    animation,
    "Arial",
    24,
    0x33ccff,
    "center",
    "bold",
    "#000000",
    4,
    false,
    "#666666"
  );
  container.addChild(text_animationName);
  text_animationName.x = WIDTH - text_animationName.width - 10;
  text_animationName.y = 10;

  spine.state.setAnimation(0, anim_ary[anim_index], false); // TODO: can loop 'true' toggle
  anim_index >= anim_length - 1 ? (anim_index = 0) : anim_index++;
};

/**
 * Set Text on TextField
 * @param { string | number } message
 * @param { string } fontfamily
 * @param { number } fontsize
 * @param { number } fillcolor
 * @param { string } align
 * @param { number } fontweight
 * @param { string } strokecolor
 * @param { number } sthickness
 * @param { boolean } isShadow
 * @param { string } shadowcolor
 *
 * @returns { object } PIXI.Text
 */
let setText = (
  message: string | number,
  fontfamily: string = "Arial",
  fontsize: number = 12,
  fillcolor: number = 0xffffff,
  align: string = "left",
  fontweight: string = "normal",
  strokecolor: string = "#000000",
  sthickness: number = 0,
  isShadow: boolean = false,
  shadowcolor: string = "#000000"
) => {
  return new PIXI.Text(`${message}`, {
    fontFamily: fontfamily,
    fontSize: fontsize,
    fill: fillcolor,
    align: align,
    fontWeight: fontweight,
    stroke: strokecolor,
    strokeThickness: sthickness,
    dropShadow: isShadow,
    dropShadowColor: shadowcolor,
    lineJoin: "round"
  });
};

/**
 * move star ... gameLoop(custom ticker) test
 * @param { number } delta
 */
let moveStar = (delta: number) => {
  // console.log("moveStar()");
  star.x += 1 * delta;
  star.rotation += 0.01;
  if (star.x >= WIDTH + star.width) {
    star.x = -star.width;
  }
};

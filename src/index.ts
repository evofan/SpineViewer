import * as PIXI from "pixi.js";
import { loader } from "webpack";
window.PIXI = PIXI;
import "pixi-spine";

console.log(PIXI);

// init
const WIDTH: number = 720;
const HEIGHT: number = 480;
const BG_COLOR: number = 0x000000;
const app: PIXI.Application = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT,
  forceCanvas: false
});
app.renderer.backgroundColor = BG_COLOR;
document.body.appendChild(app.view);

// asset
const ASSET_BG: string = "assets/images/pic_bg.jpg"; // your bakground image
// const ASSET_SPINE1: string = "assets/spine/alien/export/alien.json";
const ASSET_SPINE1: string = "assets/spine/spineboy/export/spineboy.json"; // your spine animation
const spineLoaderOptions: object = { metadata: { spineSkeletonScale: 0.5 } };
const offsetY: number = 140;
let spine: PIXI.spine.Spine;

// const anim_ary: string[] = ["death", "hit", "jump", "run"]; // TODO: Auto detect and make button
const anim_ary: string[] = [ // your spine animation name
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
app.stage.addChild(container);
console.log(container);

// bg
let bg: PIXI.Sprite;

// texts
let text_libVersion: PIXI.Text,
  text_userMessage: PIXI.Text,
  text_animationName: PIXI.Text,
  text_error: PIXI.Text;

if (!ASSET_BG || ASSET_BG === null || typeof ASSET_BG === "undefined") {
  // console.log("background image error");
  // throw Error("Unable to load image ...");
  console.log("Do not use background image.");
}

// loader
app.loader
  .add("bg", ASSET_BG)
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

    // text
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

    // spine
    spine = new PIXI.spine.Spine(resources.spineCharacter.spineData);
    console.log(spine);
    spine.x = WIDTH / 2;
    spine.y = HEIGHT / 2 + offsetY;
    container.addChild(spine);

    // app.start();
  });

app.loader.onError.add(() => {
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

let setText = (
  message: string,
  fontfamily: string = "Arial",
  fontsize: number = 12,
  fill: number = 0xffffff,
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
    fill: fill,
    align: align,
    fontWeight: fontweight,
    stroke: strokecolor,
    strokeThickness: sthickness,
    dropShadow: isShadow,
    dropShadowColor: shadowcolor,
    lineJoin: "round"
  });
};

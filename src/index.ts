import * as PIXI from "pixi.js";
import { loader } from "webpack";
window.PIXI = PIXI;
import "pixi-spine";

console.log(PIXI);

// init
const WIDTH: number = 720;
const HEIGHT: number = 480;
const app: PIXI.Application = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
document.body.appendChild(app.view);

const spineLoaderOptions: object = { metadata: { spineSkeletonScale: 0.5 } };
const offsetY: number = 140;
let spine: PIXI.spine.Spine;

const anim_ary: string[] = ["death", "hit", "jump", "run"];
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
  text_animationName: PIXI.Text;

// loader
app.loader
  .add("bg", "assets/bg/pic_bg.jpg")
  .add("spineCharacter", "assets/alien/export/alien.json", spineLoaderOptions) // spine ver. 3.8
  // .add("spineCharacter", "assets/01_hone.json") // spine ver. 3.7
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
let clearText = (targetText: PIXI.Text) => {
  targetText.text = "";
  container.removeChild(targetText);
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

  spine.state.setAnimation(0, anim_ary[anim_index], false);
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

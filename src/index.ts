import * as PIXI from "pixi.js";
import { loader, IgnorePlugin } from "webpack";
window.PIXI = PIXI;
import "pixi-spine";
import { kMaxLength } from "buffer";

import { STAGES, ASSETS, GAME } from "./constants";

console.log(PIXI);

// init
const WIDTH: number = STAGES.WIDTH;
const HEIGHT: number = STAGES.HEIGHT;
const BG_COLOR: number = STAGES.BG_COLOR;

// renderer
const renderer: PIXI.Renderer = new PIXI.Renderer({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR
});
document.body.appendChild(renderer.view);

// stage
const stage: PIXI.Container = new PIXI.Container();

// Custom GameLoop(v5)
// call requestAnimationFrame directly.
let oldTime: number = Date.now();
let ms: number = 1000;
let fps: number = GAME.FPS;
let animate = () => {
  let newTime: number = Date.now();
  let deltaTime: number = newTime - oldTime;
  oldTime = newTime;
  if (deltaTime < 0) {
    deltaTime = 0;
  }
  if (deltaTime > ms) {
    deltaTime = ms;
  }

  renderer.render(stage);
  requestAnimationFrame(animate);
};

// loader
let loader: PIXI.Loader = new PIXI.Loader();

// asset
const ASSET_BG: string = ASSETS.ASSET_BG;
const ASSET_SPINE1: string = ASSETS.ASSET_SPINE1;
const SPINEOBJ_NUM = ASSETS.ASSET_SPINE_NUM; // 1 fixed now

const anim_ary: string[] = [];

// json load
let jsonObj: { [s: string]: string };
let req = new XMLHttpRequest();
req.addEventListener(
  "load",
  () => {
    jsonObj = req.response;

    // get Animation name
    let names: string[] = [];

    // Get animation name by key name
    Object.keys(jsonObj.animations).forEach((ele, idx) => {
      names.push(ele);
      anim_ary.push(ele);
    });

    let leng: number = names.length;
    for (let i: number = 0; i < leng; i++) {
      let button: HTMLButtonElement = <HTMLButtonElement>(
        document.createElement("button")
      );
      button.textContent = `${names[i]}`;
      button.onclick = function() {
        let animeObj: { [s: string]: number } = { animNum1: 0, animNum2: i }; // dummy
        playAnimation2(animeObj);
      };
      document.body.appendChild(button);
      let divider: HTMLElement = <HTMLElement>document.createElement("span");
      divider.textContent = " ";
      document.body.appendChild(divider);
      if (i === leng - 1) {
        let newLine: HTMLElement = <HTMLElement>document.createElement("br");
        document.body.appendChild(newLine);
      }
    }
  },
  false
);
req.open("GET", ASSET_SPINE1, true);
req.responseType = "json";
req.send(null);

const spineLoaderOptions: object = { metadata: { spineSkeletonScale: 0.5 } };
let spineObj: PIXI.spine.Spine[] = [];


// const anim_ary: string[][] = [["death", "hit", "jump", "run"], ["bounce"]];

let isDragging = false;

// container
let container: PIXI.Container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0.5;
container.pivot.y = 0.5;
container.interactiveChildren = true;
stage.addChild(container);

// bg
let bg: PIXI.Sprite;

// texts
let text_libVersion: PIXI.Text,
  text_animationName: PIXI.Text,
  text_error: PIXI.Text,
  text_fps: PIXI.Text;

if (!ASSET_BG || ASSET_BG === null || typeof ASSET_BG === "undefined") {
  console.log("Do not use background image.");
}

// loader
loader
  .add("bg", ASSET_BG)
  .add("spineCharacter1", ASSET_SPINE1, spineLoaderOptions) // spine ver. 3.8
  .load((loader: PIXI.Loader, resources: any) => {
    console.log(loader);
    console.log(resources);

    // bg
    bg = new PIXI.Sprite(resources.bg.texture);
    container.addChild(bg);

    // text_version
    let version: string =
      "pixi-spine 2.1.6\nPixiJS 5.2.0\nSpine 3.8.55\nwebpack 4.41.2";
    text_libVersion = setText(version, "Arial", 24, 0xf0fff0, "left", "bold");
    container.addChild(text_libVersion);
    text_libVersion.x = 10;
    text_libVersion.y = 10;

    // text_fps
    text_fps = setText(fps, "Arial", 24, 0x00cc00, "right", "bold");
    container.addChild(text_fps);
    let offsetX: number = 10;
    text_fps.x = WIDTH - text_fps.width - offsetX;
    text_fps.y = 440;

    for (let i: number = 0; i <= SPINEOBJ_NUM - 1; i++) {
      spineObj[i] = new PIXI.spine.Spine(
        resources[`spineCharacter${i + 1}`].spineData
      );
      let sp: PIXI.spine.Spine = spineObj[i];
      sp.x = WIDTH / 2;
      sp.y = HEIGHT / 2;
      sp.pivot.x = 0.5;
      sp.pivot.y = 0.5;
      sp.interactive = true;
      sp.buttonMode = true;
      sp.on("pointerdown", onDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove);
      container.addChild(sp);
    }

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
let displayAnimeName = (num1: number, num2: number) => {
  let animation: string = `animation: ${anim_ary[num2]}`;
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

function playAnimation(this: any, e: MouseEvent) {
  let num1: number = this.animNum1 - 1;
  let num2: number = this.animNum2 - 1;

  let animeLoop: boolean = false; // TODO: configurable
  let animeObj: PIXI.spine.Spine = spineObj[num1];
  let animeName: string = anim_ary[num2];

  if (animeName === "") {
    console.log("there isn't animation name.");
    return false;
  }

  // play anime
  animeObj.state.setAnimation(0, animeName, animeLoop);

  // clear text
  if (text_animationName) {
    clearText(text_animationName);
  }
  // show anime name text
  displayAnimeName(num1, num2);
}

document.addEventListener("DOMContentLoaded", () => {
  let button: any;
  let btStart: number = 1;
  let btMaxLength: number = 100;

  for (let i: number = btStart; i <= btMaxLength; i++) {
    if (document.getElementById(`myButton${i}`)) {
      button = document.getElementById(`myButton${i}`);
      if (button) {
        let num1: number = button.name.substring(0, 1);
        let num2: number = button.name.substring(1, 2);
        button.addEventListener(
          "click",
          {
            animNum1: num1,
            animNum2: num2,
            handleEvent: playAnimation,
            this: button
          },
          false
        );
      }
    }
  }
});

function playAnimation2(obj: any) {
  console.log("playAnimation2()", obj);
  let num1: number = obj.animNum1;
  let num2: number = obj.animNum2;

  let animeLoop: boolean = false; // TODO: configurable
  let animeObj: PIXI.spine.Spine = spineObj[num1];
  let animeName: string = anim_ary[num2];

  if (animeName === "") {
    console.log("there isn't animation name.");
    return false;
  }

  // play anime
  animeObj.state.setAnimation(0, animeName, animeLoop);

  // clear text
  if (text_animationName) {
    clearText(text_animationName);
  }
  // show anime name text
  displayAnimeName(num1, num2);
}

/**
 * start drag
 * @param { object } e
 */
let onDragStart = (e: any) => {
  isDragging = true;
  let sp: PIXI.spine.Spine = e.currentTarget;
  sp.alpha = 0.5;
};

/**
 * stop drag
 */
let onDragEnd = (e: any) => {
  isDragging = false;
  let sp: PIXI.spine.Spine = e.currentTarget;
  sp.alpha = 1;
};

/**
 * move drag
 */
let onDragMove = (e: any) => {
  if (isDragging) {
    let sp: PIXI.spine.Spine = e.currentTarget;
    sp.x = renderer.plugins.interaction.mouse.global.x;
    sp.y = renderer.plugins.interaction.mouse.global.y + sp.height / 2;
    sp.children[0].x = sp.x;
    sp.children[0].y = sp.y;
  }
};

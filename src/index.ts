import * as PIXI from "pixi.js";
import { loader, IgnorePlugin, DllPlugin } from "webpack";
window.PIXI = PIXI;
import "pixi-spine";
import { kMaxLength } from "buffer";
import { STAGES, ASSETS, GAMES } from "./constants";

// console.log(PIXI);

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

// Custom GameLoop(v5), call requestAnimationFrame directly.
let oldTime: number = Date.now();
let ms: number = 1000;
let fps: number = GAMES.FPS;
let animate = () => {
  let newTime: number = Date.now();
  let deltaTime: number = newTime - oldTime;
  oldTime = newTime;
  deltaTime < 0 ? (deltaTime = 0) : deltaTime;
  deltaTime > ms ? (deltaTime = ms) : deltaTime;
  renderer.render(stage);
  requestAnimationFrame(animate);
};

// loader
let loader: PIXI.Loader = new PIXI.Loader();

// asset
const ASSET_BG: string = ASSETS.ASSET_BG;
const ASSET_SPINE1: string = ASSETS.ASSET_SPINE1;
const SPINEOBJ_NUM: number = 1; // now Fixed

const anim_ary: string[] = [];
const spineLoaderOptions: object = { metadata: { spineSkeletonScale: 0.5 } };
let SP_HEIGHT: number;
let spineObj: PIXI.spine.Spine[] = [];
let isDragging: boolean = false;

// json load
let jsonObj: { [s: string]: string };
const req: XMLHttpRequest = new XMLHttpRequest();
req.addEventListener(
  "load",
  () => {
    jsonObj = req.response;

    // get Animation name
    let names: string[] = [];

    // Get animation name by key name
    Object.keys(jsonObj.animations).forEach(ele => {
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
        let animeObj: { [s: string]: number } = { animNum1: 0, animNum2: i };
        playAnimation(animeObj);
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

// container
let container: PIXI.Container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0.5;
container.pivot.y = 0.5;
stage.addChild(container);

// bg
let bg: PIXI.Sprite;

// text
let text_libVersion: PIXI.Text,
  text_animationName: PIXI.Text,
  text_error: PIXI.Text,
  text_fps: PIXI.Text;

// load
if (ASSET_BG === "") {
  console.log("Don't use background image.");
} else {
  loader.add("bg", ASSET_BG);
}
loader.add("spineCharacter1", ASSET_SPINE1, spineLoaderOptions); // spine ver. 3.8 over must
loader.load((loader: PIXI.Loader, resources: any) => {
  console.log(loader);
  console.log(resources);

  // bg
  if (ASSET_BG !== "") {
    bg = new PIXI.Sprite(resources.bg.texture);
    container.addChild(bg);
  }

  // text version
  let version: string =
    "pixi-spine 2.1.6\nPixiJS 5.2.0\nSpine 3.8.55\nwebpack 4.41.2";
  text_libVersion = setText(version, "Arial", 24, 0xf0fff0, "left", "bold");
  container.addChild(text_libVersion);
  text_libVersion.x = 10;
  text_libVersion.y = 10;

  // text fps
  text_fps = setText(`FPS: ${fps}`, "Arial", 24, 0x00cc00, "right", "bold");
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
    sp.y = HEIGHT / 2 + sp.height / 2;
    SP_HEIGHT = sp.height;
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
  throw Error("load error ...");
});

/**
 * Remeove text animationName
 * @param { PIXI.Text } targetText
 */
let clearText = (t: PIXI.Text) => {
  t.text = "";
  container.removeChild(t);
};

/**
 * Change & Play Alien Animation.
 * num1 : for multiple spine animations
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

document.addEventListener("DOMContentLoaded", () => {
  let button: any;
  let btStart: number = 1;
  let btMaxLength: number = 100;

  for (let i: number = btStart; i <= btMaxLength; i++) {
    if (document.getElementById(`myButton${i}`)) {
      button = document.getElementById(`myButton${i}`);
      if (button) {
        let num1: number = button.name.substring(0, 1); // spineObj[n]
        let num2: number = button.name.substring(1, 2); // ex: aim, death, idle ...
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

/**
 * Play spine animation by animation-name
 * @param { object } animation object
 */
let playAnimation = (obj: any) => {
  console.log("playAnimation()", obj);
  let num1: number = obj.animNum1;
  let num2: number = obj.animNum2;

  let animeLoop: boolean = false; // TODO: configurable
  let animeObj: PIXI.spine.Spine = spineObj[num1];
  let animeName: string = anim_ary[num2];

  if (animeName === "") {
    console.log("there isn't animation name.");
    return false;
  }

  // timescale to be able adjust
  animeObj.state.timeScale = 1;

  // play anime
  animeObj.state.setAnimation(0, animeName, animeLoop);

  // clear text
  if (text_animationName) {
    clearText(text_animationName);
  }
  // show anime name text
  displayAnimeName(num1, num2);
};

/**
 * start drag
 * @param { object } event
 */
let onDragStart = (e: PIXI.interaction.InteractionEvent) => {
  isDragging = true;
  let sp: PIXI.DisplayObject = e.currentTarget as PIXI.DisplayObject;
  sp.alpha = 0.75;
};

/**
 * stop drag
 * @param { object } event
 */
let onDragEnd = (e: PIXI.interaction.InteractionEvent) => {
  isDragging = false;
  let sp: PIXI.DisplayObject = e.currentTarget;
  sp.alpha = 1;
};

/**
 * move drag
 * @param { object } event
 */
let onDragMove = (e: PIXI.interaction.InteractionEvent) => {
  if (isDragging) {
    let sp: PIXI.DisplayObject = e.currentTarget;
    const point: { x: number; y: number } = e.data.global;
    sp.x = point.x;
    sp.y = point.y + SP_HEIGHT / 2;
  }
};

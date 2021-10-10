import * as PIXI from "pixi.js";
// import { loader, IgnorePlugin, DllPlugin } from "webpack";
window.PIXI = PIXI;
import "pixi-spine";
import { kMaxLength } from "buffer";
import { STAGES, ASSETS, GAMES } from "./constants";
import * as dat from "dat.gui";
// import { GUI } from "dat-gui";

// init
const WIDTH: number = STAGES.WIDTH;
const HEIGHT: number = STAGES.HEIGHT;
const BG_COLOR: number = STAGES.BG_COLOR;

// TODO:
// GAMES.FPS -> const FPS: number = GAMES.FPS;
// and Scale, Loop too.

// renderer
const renderer: PIXI.Renderer = new PIXI.Renderer({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR,
});
document.body.appendChild(renderer.view);

// stage
const stage: PIXI.Container = new PIXI.Container();

// dat.GUI
const gui: dat.GUI = new dat.GUI();

// GUI parameter
class guiCtrl {
  public fps: number;
  public animeTimeScale: number;
  public animeLoop: boolean;
  constructor() {
    this.fps = GAMES.FPS; // default fps ... Does not affect Spien animation speed.
    this.animeTimeScale = GAMES.ANIME_TIME_SCALE; // default timescale
    this.animeLoop = GAMES.ANIME_LOOP; // default loop
  }
}

// GUI method
const setFPS = () => {
  GAMES.FPS = Math.round(guiObj.fps);
  clearText(text_fps);
  setTextFPS();
};
const setAnimeTimeScale = () => {
  GAMES.ANIME_TIME_SCALE = Math.round(guiObj.animeTimeScale * 10) / 10;
  clearText(text_anime_time_scale);
  setTextAnimeTimeScale();
};

const setAnimeLoop = () => {
  GAMES.ANIME_LOOP ? (GAMES.ANIME_LOOP = false) : (GAMES.ANIME_LOOP = true);
  clearText(text_anime_loop);
  setTextAnimeLoop();
};

const guiObj: guiCtrl = new guiCtrl();
const folder: dat.GUI = gui.addFolder("Control Panel");
folder.add(guiObj, "animeTimeScale", 0.1, 10).onChange(setAnimeTimeScale);
folder.add(guiObj, "fps", 1, 60).onChange(setFPS);
folder.add(guiObj, "animeLoop").onChange(setAnimeLoop);
folder.open();

// Custom GameLoop(v5), call requestAnimationFrame directly.
let oldTime: number = Date.now();
let ms: number;
const COE: number = 16.67;
let animate = () => {
  let newTime: number = Date.now();
  let deltaTime: number = newTime - oldTime;
  ms = Math.round(GAMES.FPS * COE);
  // console.log("fps: " + GAMES.FPS + " " + "ms: " + ms);
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
    Object.keys(jsonObj.animations).forEach((ele) => {
      names.push(ele);
      anim_ary.push(ele);
    });

    let leng: number = names.length;
    for (let i: number = 0; i < leng; i++) {

      if (i === 0) {
        let divtemp: HTMLElement = <HTMLElement>document.createElement("div");
        divtemp.textContent = " ";
        document.body.appendChild(divtemp);
      }

      let button: HTMLButtonElement = <HTMLButtonElement>(
        document.createElement("button")
      );
      button.textContent = `${names[i]}`;
      button.onclick = function () {
        let animeObj: { [s: string]: number } = { animNum1: 0, animNum2: i };
        playAnimation(animeObj);
      };
      document.body.appendChild(button);

      let divider: HTMLElement = <HTMLElement>document.createElement("span");
      divider.textContent = " ";
      document.body.appendChild(divider);

      let newLine: HTMLElement = <HTMLElement>document.createElement("br");
      if (i === leng - 1) {
        document.body.appendChild(newLine);
      }
    }
  },
  false
);
req.open("GET", ASSET_SPINE1, true);
req.responseType = "json";
req.send(null);

// container for anime and bg
let container: PIXI.Container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0.5;
container.pivot.y = 0.5;
stage.addChild(container);

// container for text
let container_text: PIXI.Container = new PIXI.Container();
container_text.width = WIDTH;
container_text.height = HEIGHT;
container_text.x = 0;
container_text.y = 0;
container_text.pivot.x = 0.5;
container_text.pivot.y = 0.5;
stage.addChild(container_text);

// bg
let bg: PIXI.Sprite;

// text
let text_libVersion: PIXI.Text,
  text_animationName: PIXI.Text,
  // text_error: PIXI.Text,
  text_fps: PIXI.Text,
  text_anime_time_scale: PIXI.Text,
  text_anime_loop: PIXI.Text;
let offsetX: number = 10;

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
  let pixi_ver: string = PIXI.VERSION;
  let all_version: string = `PixiJS ${pixi_ver}\npixi-spine 2.1.9\nSpine 3.8.55\nwebpack 5.58.1`;
  text_libVersion = setText(all_version, "Arial", 24, 0xf0fff0, "left", "bold");
  container_text.addChild(text_libVersion);
  text_libVersion.x = 10;
  text_libVersion.y = 10;

  setTextFPS();
  setTextAnimeTimeScale();
  setTextAnimeLoop();

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
 * Set Text for FPS value
 */
const setTextFPS = () => {
  text_fps = setText(
    `FPS: ${GAMES.FPS}`,
    "Arial",
    24,
    0x00cc00,
    "right",
    "bold"
  );
  container_text.addChild(text_fps);
  text_fps.x = WIDTH - text_fps.width - offsetX;
  text_fps.y = 440;
};

/**
 * Set Text for AnimeTimeScale value
 */
const setTextAnimeTimeScale = () => {
  text_anime_time_scale = setText(
    `Animation Time Scale: ${GAMES.ANIME_TIME_SCALE}`,
    "Arial",
    24,
    0x00cc00,
    "right",
    "bold"
  );
  container_text.addChild(text_anime_time_scale);
  text_anime_time_scale.x = WIDTH - text_anime_time_scale.width - offsetX;
  text_anime_time_scale.y = 410;
};

/**
 * Set Animation Loop value
 */
const setTextAnimeLoop = () => {
  text_anime_loop = setText(
    `Animation Loop: ${GAMES.ANIME_LOOP}`,
    "Arial",
    24,
    0x00cc00,
    "right",
    "bold"
  );
  container_text.addChild(text_anime_loop);
  text_anime_loop.x = WIDTH - text_anime_loop.width - offsetX;
  text_anime_loop.y = 380;
};

/**
 * Remeove text animationName
 * @param { PIXI.Text } targetText
 */
let clearText = (t: PIXI.Text) => {
  t.text = "";
  container_text.removeChild(t);
};

/**
 * Set Text for animationName
 * (num1 : for multiple spine animations)
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
  container_text.addChild(text_animationName);
  text_animationName.x = WIDTH - text_animationName.width - offsetX;
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
    lineJoin: "round",
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
            this: button,
          },
          false
        );
      }
    }
  }
});

/**
 * Play spine animation by anime name
 * @param { object } animation object
 */
let playAnimation = (obj: any) => {
  // console.log("playAnimation()", obj);
  let num1: number = obj.animNum1;
  let num2: number = obj.animNum2;

  let animeObj: PIXI.spine.Spine = spineObj[num1];
  let animeName: string = anim_ary[num2];

  if (animeName === "") {
    console.log("there isn't animation name.");
    return false;
  }

  // set timescale
  animeObj.state.timeScale = GAMES.ANIME_TIME_SCALE;

  // play anime
  animeObj.state.setAnimation(0, animeName, GAMES.ANIME_LOOP);

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
let onDragStart = (e: PIXI.InteractionEvent) => {
  isDragging = true;
  let sp: PIXI.DisplayObject = e.currentTarget as PIXI.DisplayObject;
  sp.alpha = 0.75;
};

/**
 * stop drag
 * @param { object } event
 */
let onDragEnd = (e: PIXI.InteractionEvent) => {
  isDragging = false;
  let sp: PIXI.DisplayObject = e.currentTarget;
  sp.alpha = 1;
};

/**
 * move drag
 * @param { object } event
 */
let onDragMove = (e: PIXI.InteractionEvent) => {
  if (isDragging) {
    let sp: PIXI.DisplayObject = e.currentTarget;
    const point: { x: number; y: number } = e.data.global;
    sp.x = point.x;
    sp.y = point.y + SP_HEIGHT / 2;
  }
};

import * as PIXI from "pixi.js";
import { loader } from "webpack";
window.PIXI = PIXI;
import "pixi-spine";

console.log(PIXI); // Module {…}

// init
const WIDTH: number = 720;
const HEIGHT: number = 480;
const app: any = new PIXI.Application({
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
let container: any = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = true;
app.stage.addChild(container);

// bg
let bg: PIXI.Sprite;

// text 1-3
let text: PIXI.Text, text2: PIXI.Text, text3: PIXI.Text;

// loader
app.loader
  .add("bg", "assets/bg/pic_bg.jpg")
  .add("spineCharacter", "assets/alien/export/alien.json", spineLoaderOptions) // spine ver. 3.8
  // .add("spineCharacter", "assets/01_hone.json") // spine ver. 3.7
  .load(function(loader: PIXI.Loader, resources: any) {
    console.log(loader);

    // bg
    bg = new PIXI.Sprite(resources.bg.texture);
    container.addChild(bg);

    // text
    text = new PIXI.Text(
      "pixi-spine 2.1.4\nPixiJS 5.2.0\nSpine 3.8.55\nwebpack 4.41.2",
      {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xf0fff0,
        align: "center",
        fontWeight: "bold"
      }
    );
    container.addChild(text);
    text.x = 10;
    text.y = 10;

    // text2
    text2 = new PIXI.Text("Touch the Alien !", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xff0033,
      align: "center",
      fontWeight: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      dropShadow: false,
      dropShadowColor: "#666666",
      lineJoin: "round"
    });
    container.addChild(text2);
    text2.x = WIDTH / 2 - text2.width / 2;
    text2.y = 420;

    // spine
    spine = new PIXI.spine.Spine(resources.spineCharacter.spineData);
    console.log(spine); // 01_hone = width: 0と出るので？3.7だと3.7用のpixi-spine使う？

    spine.x = WIDTH / 2;
    spine.y = HEIGHT / 2 + offsetY;

    container.addChild(spine);

    container.click = function() {
      console.log("clicked alien");
      if (text3) {
        text3.text = "";
        container.removeChild(text3);
      }
      playAnimation();
    };

    container.tap = function() {
      console.log("taped alien");
      if (text3) {
        text3.text = "";
        container.removeChild(text3);
      }
      playAnimation();
    };

    // app.start();
  });

/**
 * Change & Play Animation for Alien.
 */
function playAnimation() {
  // text3
  text3 = new PIXI.Text(`animation: ${anim_ary[anim_index]}`, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0x33ccff,
    align: "center",
    fontWeight: "bold",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  container.addChild(text3);
  text3.x = WIDTH - text3.width - 10;
  text3.y = 10;

  spine.state.setAnimation(0, anim_ary[anim_index], false);
  anim_index >= anim_length - 1 ? (anim_index = 0) : anim_index++;
}

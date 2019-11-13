import * as PIXI from "pixi.js";
import { loader } from "webpack";

console.log(PIXI); // Module {…}

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app: any = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader
  .add("bunny", "assets/bunny.png")
  .load((loader: PIXI.LoaderResource, resources: any) => {
    console.log(loader);
    /* Loader
    baseUrl: ""
    defaultQueryString: ""
    loading: false
    onComplete: MiniSignal {_tail: MiniSignalBinding, _head: MiniSignalBinding}
    onError: MiniSignal {_tail: MiniSignalBinding, _head: MiniSignalBinding}
    onLoad: MiniSignal {_tail: MiniSignalBinding, _head: MiniSignalBinding}
    onProgress: MiniSignal {_tail: MiniSignalBinding, _head: MiniSignalBinding}
    onStart: MiniSignal {_tail: MiniSignalBinding, _head: MiniSignalBinding}
    progress: 100
    resources: {bunny: Resource}
    _afterMiddleware: (4) [ƒ, ƒ, ƒ, ƒ]
    _beforeMiddleware: []
    _boundLoadResource: ƒ (r, d)
    _events: Events {}
    _eventsCount: 0
    _protected: false
    _queue: {_tasks: Array(0), concurrency: 10, buffer: 2.5, saturated: ƒ, unsaturated: ƒ, …}
    _resourcesParsing: []
    concurrency: 10
  */

    // This creates a texture from a 'bunny.png' image
    const bunny: PIXI.Sprite = new PIXI.Sprite(resources.bunny.texture);
    console.log(typeof resources.bunny); // object

    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny);

    // Listen for frame updates
    app.ticker.add(() => {
      // each frame we spin the bunny around a bit
      bunny.rotation += 0.01;
    });
  });

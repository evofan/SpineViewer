# A tool for reading Spine files on PixiJS and checking animation.

![https://evofan.github.io/SpineViewer/screenshot/pic_spine_viwer_title_x2_02.jpg](https://evofan.github.io/SpineViewer/screenshot/pic_spine_viwer_title_x2_02.jpg "image")  

**DEMO**  
[https://evofan.github.io/SpineViewer/dist/](https://evofan.github.io/SpineViewer/dist/)  

**USAGE**  
npm install  
npm run build  
npm run start  
http://localhost:8080/

**custom setting**  
SpineViewer\src\constants.ts
~~~
// stage settings
export const STAGES = {
  WIDTH: 720,
  HEIGHT: 480,
  BG_COLOR: 0x000000
};

// path for use assets
export const ASSETS = {
  ASSET_BG: "assets/images/pic_bg.jpg", // your bg image
  // ASSET_BG: "", // if you don't want to use bg image
  ASSET_SPINE1: "assets/spine/spineboy/export/spineboy.json" // your spine animation
  // ASSET_SPINE1: "assets/spine/alien/export/alien.json" // your spine animation
  // ASSET_SPINE1: "assets/spine/dragon/export/dragon.json" // your spine animation
  // ASSET_SPINE1: "assets/spine/powerup/export/powerup.json" // your spine animation
};

export const GAMES = {
  FPS: 60 // framerate ex. 30
};
~~~  

**TODO:**  
~~Controllable timeScale.~~ end  
<img src="https://raw.githubusercontent.com/evofan/SpineViewer/master/screenshot/pic_change_anime_scale.jpg" width="50%">  
Multiple object display?  

reference  

**pixijs/pixi-spine**  
[https://github.com/pixijs/pixi-spine](https://github.com/pixijs/pixi-spine)  
Use: >PixiJS v5 Spine 3.8 - this branch, latest npm **

**Spine project sample file**  
[http://ja.esotericsoftware.com/spine-examples](http://ja.esotericsoftware.com/spine-examples)  
Use: >Alien, Spineboy  

**TypeScriptチュートリアル① -環境構築編-**  
[https://qiita.com/ochiochi/items/efdaa0ae7d8c972c8103](https://qiita.com/ochiochi/items/efdaa0ae7d8c972c8103)  
TypeScript environment construction.  

**Getting Started with Pixi.js and webpack**  
[https://jameskiefer.com/posts/getting-started-with-pixi.js-and-webpack/](https://jameskiefer.com/posts/getting-started-with-pixi.js-and-webpack/)  

**※Spineのバージョンが3.8になったら3.7までとフォーマットが変わって  
プロジェクト上で読み込みエラーが出るようになったので、↓解決方法。**

**Spine v3.8 json format breaking changes #300**  
[https://github.com/pixijs/pixi-spine/issues/300](https://github.com/pixijs/pixi-spine/issues/300)  

**3.8.13 crash pixijs and corrupted project file Search this**  
[http://ja.esotericsoftware.com/forum/3-8-13-crash-pixijs-and-corrupted-project-file-Search-this-12066](http://ja.esotericsoftware.com/forum/3-8-13-crash-pixijs-and-corrupted-project-file-Search-this-12066)  
>Use the 3.8 skeletonViewer-beta.jar and run it like:  
``` java -cp skeletonViewer-beta.jar com.esotericsoftware.spine.JsonRollback input.json 3.7 output.json ```  
>Where input.json is from 3.8. The tool will write output.json which you can then import into 3.7.  
プロジェクトで3.8に上げてしまったSpineの元ファイルを、↑の方法で3.7以下で読み込めるように戻せた。  
（Spineのバージョンを落とすと新しいバージョン作ったファイルが開けなくなる為、  
プロジェクトで使用するバージョンの統一と、可能ならバージョン別に元ファイルを保存しておく）  

**Spine editor and runtime version management**  
[http://ja.esotericsoftware.com/forum/Spine-editor-and-runtime-version-management-6534](http://ja.esotericsoftware.com/forum/Spine-editor-and-runtime-version-management-6534)  

**v5 Custom Application GameLoop**  
[https://github.com/pixijs/pixi.js/wiki/v5-Custom-Application-GameLoop](https://github.com/pixijs/pixi.js/wiki/v5-Custom-Application-GameLoop)  
make their own application class and gameloop.  

**PIXI.Loader**  
[https://pixijs.download/dev/docs/PIXI.Loader.html](https://pixijs.download/dev/docs/PIXI.Loader.html)  

**Spine Demo(sample)**  
[http://ja.esotericsoftware.com/spine-demos](http://ja.esotericsoftware.com/spine-demos)  

**webpackでhtmlファイルも出力する**  
[https://ema-hiro.hatenablog.com/entry/2017/10/12/015748](https://ema-hiro.hatenablog.com/entry/2017/10/12/015748)  

**How to use spine events spine-ts way**  
[https://github.com/pixijs/pixi-spine/blob/master/examples/spine_events.md](https://github.com/pixijs/pixi-spine/blob/master/examples/spine_events.md)  

**TypeScriptでDOM要素を作成する**  
[https://confrage.jp/typescript%E3%81%A7dom%E8%A6%81%E7%B4%A0%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B/](https://confrage.jp/typescript%E3%81%A7dom%E8%A6%81%E7%B4%A0%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B/)  
  
**GitHubから通知が来た：依存関係の1つに潜在的なセキュリティ脆弱性があります**  
[https://www.l08084.com/entry/2018/04/22/162130](https://www.l08084.com/entry/2018/04/22/162130)  
↑で直らず（Pixiのバージョンは上がった）
>npm install serialize-javascript  
serialize-javascript@1.9.1 -> 2.1.2で警告消失  

**TypeScript のオブジェクト型リテラルいろいろ - Qiita**  
[https://qiita.com/hida/items/fb0379353bbb71f8191b](https://qiita.com/hida/items/fb0379353bbb71f8191b)  


**v5 Migration Guide**  
[https://github.com/pixijs/pixi.js/wiki/v5-Migration-Guide](https://github.com/pixijs/pixi.js/wiki/v5-Migration-Guide)  
>PIXI.mesh.Mesh to PIXI.SimpleMesh  

**ERROR in C:\Users\USER\Documents\SpineViewer\src\index.ts(330,27)**  
[https://pixijs.download/dev/docs/PIXI.interaction.InteractionEvent.html](https://pixijs.download/dev/docs/PIXI.interaction.InteractionEvent.html)  
>PIXI.interaction.InteractionEvent -> See: PIXI.InteractionEvent  

**DevTools failed to load SourceMap for webpack:///node_modules//…js.map
HTTP error: status code 404, net::ERR_UNKNOWN_URL_SCHEME**  
[https://stackoverflow.com/questions/61767538/devtools-failed-to-load-sourcemap-for-webpack-node-modules-js-map-http-e](https://stackoverflow.com/questions/61767538/devtools-failed-to-load-sourcemap-for-webpack-node-modules-js-map-http-e)  
>use source-map-loader loader.  

result:  
![https://evofan.github.io/SpineViewer/screenshot/pic_warn_sourcemap.png](https://evofan.github.io/SpineViewer/screenshot/pic_warn_sourcemap.png "image")  

**dat.GUI**  
[https://github.com/dataarts/dat.gui](https://github.com/dataarts/dat.gui)  

**dat.gui を使ってみた - しまむーの備忘録**  
[https://shsm385.hatenablog.com/entry/2017/12/31/171446](https://shsm385.hatenablog.com/entry/2017/12/31/171446)  



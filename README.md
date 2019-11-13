# A tool for reading Spine files on PixiJS and checking animation.
※背景画像・Spineデータ・アニメーションは差し替えられるようにする。

**DEMO**  
[https://evofan.github.io/SpineViewer/dist/](https://evofan.github.io/SpineViewer/dist/)  

reference  

**pixijs/pixi-spine**  
[https://github.com/pixijs/pixi-spine](https://github.com/pixijs/pixi-spine)  
Use: >PixiJS v5 Spine 3.8 - this branch, latest npm **

**Spine project sample file**  
[http://ja.esotericsoftware.com/spine-examples](http://ja.esotericsoftware.com/spine-examples)  
Use: >Alien  

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
Download: 「JAR file」  

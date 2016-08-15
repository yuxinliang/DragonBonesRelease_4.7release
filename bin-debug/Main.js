var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.curAnimIndex = 0;
        this.tempX = 0;
        this.tempY = 0;
        this.armeX = 0;
        this.armeY = 0;
        this.armeSX = 0;
        this.isMove = false;
        this.isCtrlDown = false;
        this.firstPoint = -1;
        this.secondPoint = -1;
        this.temp2X = 0;
        this.temp2Y = 0;
        this.isMultiFinger = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        this.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
        //egret.Profiler.getInstance().run();
        //var sprbg:egret.Sprite = new egret.Sprite();
        //sprbg.graphics.beginFill(0x000000,0.5);
        //sprbg.graphics.drawRect(0,0,160,100);
        //this.stage.addChild(sprbg);
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("TestArmature");
    };
    /**
     * preload资源组加载完成
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "TestArmature") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
    * 资源组加载出错
    */
    p.onResourceLoadError = function (event) {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "TestArmature") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     */
    p.createGameScene = function () {
        var _this = this;
        //this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        document.addEventListener("keydown", function (evt) {
            if (evt.keyCode == 17) {
                _this.isCtrlDown = true;
            }
            if (evt.keyCode == 49) {
                _this["armatureDisplay"].x = _this["armature"].getBones()[0].global.x;
                _this["armatureDisplay"].y = _this["armature"].getBones()[0].global.y;
                _this["armatureDisplay"].scaleX = 1;
                _this["armatureDisplay"].scaleY = 1;
            }
        });
        document.addEventListener("keyup", function (evt) {
            if (evt.keyCode == 17) {
                _this.isCtrlDown = false;
            }
        });
        this.createMotorcycleExp();
    };
    /**创建骨骼模型**/
    p.createMotorcycleExp = function () {
        this.container = new egret.DisplayObjectContainer();
        egret.MainContext.instance.stage.addChild(this.container);
        this.container.x = 600;
        this.container.y = 500;
        //读取一个骨骼数据,并创建实例显示到舞台
        var skeletonData = RES.getRes("skeleton_json");
        var textureData = RES.getRes("texture_json");
        var texture = RES.getRes("texture_png");
        var factory = new dragonBones.EgretFactory();
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        if (RES.hasRes("texture_png")) {
            textureData = RES.getRes("texture_json");
            texture = RES.getRes("texture_png");
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
        }
        var i = 0;
        while (RES.hasRes("texture_png" + i)) {
            textureData = RES.getRes("texture_json" + i);
            texture = RES.getRes("texture_png" + i);
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
            i++;
        }
        this.armature = factory.buildArmature(skeletonData.armature[0].name);
        //this.armature = factory.buildFastArmature(skeletonData.armature[0].name);
        if (skeletonData.armature[0].type == "Stage") {
            this.container.x = 0;
            this.container.y = 0;
        }
        this.armatureDisplay = this.armature.display;
        dragonBones.WorldClock.clock.add(this.armature);
        this.container.addChild(this.armatureDisplay);
        this.armatureDisplay.x = this.armature.getBones()[0].global.x; //_boneList[0].global.x;
        this.armatureDisplay.y = this.armature.getBones()[0].global.y;
        //var aniCachManager:dragonBones.AnimationCacheManager = this.armature.enableAnimationCache(60, null, false);
        //console.log(aniCachManager)
        //aniCachManager.resetCacheGeneratorArmature();
        //启动骨骼动画播放
        this.armature.animation.gotoAndPlay(this.armature.animation.animationList[0], -1, -1);
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
    };
    p.onTouch = function (evt) {
        this.curAnimIndex++;
        this.curAnimationName = this.armature.animation.animationList[this.curAnimIndex % this.armature.animation.animationList.length];
        this.armature.animation.gotoAndPlay(this.curAnimationName, -1, -1);
    };
    p.onTouchBegin = function (evt) {
        if (this.firstPoint == -1) {
            this.firstPoint = evt.touchPointID;
            this.tempX = evt.stageX;
            this.tempY = evt.stageY;
            this.armeX = this.armatureDisplay.x;
            this.armeY = this.armatureDisplay.y;
            this.armeSX = this.armatureDisplay.scaleX;
            this.nowX = evt.stageX;
            this.nowY = evt.stageY;
        }
        else {
            if (this.secondPoint == -1) {
                this.secondPoint = evt.touchPointID;
                this.isMultiFinger = true;
                this.temp2X = evt.stageX;
                this.temp2Y = evt.stageY;
                this.now2X = evt.stageX;
                this.now2Y = evt.stageY;
            }
        }
    };
    p.onTouchMove = function (evt) {
        this.isMove = true;
        if (evt.touchPointID == this.firstPoint) {
            this.nowX = evt.stageX;
            this.nowY = evt.stageY;
        }
        if (evt.touchPointID == this.secondPoint) {
            this.now2X = evt.stageX;
            this.now2Y = evt.stageY;
        }
        if (this.isMultiFinger) {
            var nowDistance = Math.sqrt((this.now2X - this.nowX) * (this.now2X - this.nowX) + (this.now2Y - this.nowY) * (this.now2Y - this.nowY));
            var temDistance = Math.sqrt((this.temp2X - this.tempX) * (this.temp2X - this.tempX) + (this.temp2Y - this.tempY) * (this.temp2Y - this.tempY));
            if (this.armatureDisplay.scaleX > 0.3 && this.armeSX + ((nowDistance / temDistance) - 1) > 0.3 && this.armatureDisplay.scaleX < 3 && this.armeSX + ((nowDistance / temDistance) - 1) < 3) {
                this.armatureDisplay.scaleX = this.armeSX + ((nowDistance / temDistance) - 1);
                this.armatureDisplay.scaleY = this.armeSX + ((nowDistance / temDistance) - 1);
            }
        }
        else {
            var value = evt.stageY - this.tempY;
            if (!this.isCtrlDown) {
                this.armatureDisplay.x = this.armeX + (evt.stageX - this.tempX);
                this.armatureDisplay.y = this.armeY + (evt.stageY - this.tempY);
            }
            else {
                if (this.tempY < evt.stageY) {
                    if (this.armatureDisplay.scaleX > 0.3 && this.armeSX - (value / 200) > 0.3) {
                        this.armatureDisplay.scaleX = this.armeSX - (value / 200);
                        this.armatureDisplay.scaleY = this.armeSX - (value / 200);
                    }
                }
                else {
                    if (this.armatureDisplay.scaleX < 3 && this.armeSX - (3 * value / 200) < 3) {
                        this.armatureDisplay.scaleX = this.armeSX - (3 * value / 200);
                        this.armatureDisplay.scaleY = this.armeSX - (3 * value / 200);
                    }
                }
            }
        }
    };
    p.onTouchEnd = function (evt) {
        if (this.firstPoint == evt.touchPointID) {
            this.firstPoint = -1;
        }
        if (this.secondPoint == evt.touchPointID) {
            this.secondPoint = -1;
        }
        if (this.firstPoint == -1 && this.secondPoint == -1) {
            this.isMultiFinger = false;
        }
        if (!this.isMultiFinger) {
            if (this.isMove) {
                this.isMove = false;
            }
            else {
                this.curAnimIndex++;
                this.curAnimationName = this.armature.animation.animationList[this.curAnimIndex % this.armature.animation.animationList.length];
                this.armature.animation.gotoAndPlay(this.curAnimationName, -1, -1);
            }
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
